const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const UserSession = require('../models/UserSession');
const QuestionAnalysisService = require('../services/questionAnalysisService');
const TemplateSelectionService = require('../services/templateSelectionService');
const CompetencyCheckerService = require('../services/competencyCheckerService');
const groqService = require('../services/groqService');
const cacheService = require('../services/cacheService');
const analyticsService = require('../services/analyticsService');
const CBAResponseFormatter = require('../middleware/cbaResponseFormatter');
const { optionalAuth } = require('../middleware/auth');

// Apply CBA response formatting to all AI responses
router.use(CBAResponseFormatter.middleware);

/**
 * POST /api/ai/ask
 * Submit a question and get an AI-generated answer
 */
router.post('/ask', optionalAuth, async (req, res) => {
  try {
    const { question, subject, grade_level, context } = req.body;
    const user_id = req.user ? req.user.id : null;

    // Get or create session
    let session_id = req.headers['x-session-id'] || analyticsService.generateSessionId();
    const country = analyticsService.getCountryFromIP(req.ip);
    await UserSession.getOrCreate(session_id, user_id, req.ip, req.get('User-Agent'), country);

    // Validate required fields
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question is required',
        error: 'MISSING_QUESTION'
      });
    }

    // Step 1: Analyze the question
    const analysis = QuestionAnalysisService.analyzeQuestion(question, {
      subject,
      grade_level,
      user_id
    });

    // Step 2: Select appropriate template
    const templateSelection = TemplateSelectionService.selectTemplate({
      ...analysis,
      originalQuestion: question
    });

    // Step 3: Create question record
    const questionId = await Question.create({
      user_id,
      subject: analysis.subject,
      question_type: analysis.question_type,
      content: question,
      grade_level: analysis.grade_level,
      competencies: analysis.competencies,
      context
    });

    // Track question asked
    await analyticsService.trackQuestionAsked(session_id, user_id, {
      subject: analysis.subject,
      question_type: analysis.question_type,
      grade_level: analysis.grade_level,
      competencies: analysis.competencies
    });

    // Step 4: Generate AI response
    const startTime = Date.now();
    let aiResponse;

    try {
      aiResponse = await groqService.generateCBAResponse(question, {
        subject: analysis.subject,
        grade_level: analysis.grade_level,
        competencies: analysis.competencies,
        question_type: analysis.question_type
      });
    } catch (aiError) {
      console.error('AI service error:', aiError);

      // Return error response
      return res.status(500).json({
        success: false,
        message: 'Failed to generate AI response',
        error: 'AI_SERVICE_ERROR',
        details: aiError.message
      });
    }

    const processingTime = Date.now() - startTime;

    // Step 5: Check competencies in the response
    const competencyCheck = CompetencyCheckerService.checkCompetencies(
      aiResponse.content,
      analysis.competencies,
      {
        subject: analysis.subject,
        question_type: analysis.question_type,
        grade_level: analysis.grade_level
      }
    );

    // Step 6: Enhance response if competency check fails
    let finalResponse = aiResponse.content;
    if (!competencyCheck.valid) {
      finalResponse = CompetencyCheckerService.enhanceResponse(
        aiResponse.content,
        competencyCheck,
        {
          subject: analysis.subject,
          question_type: analysis.question_type
        }
      );
    }

    // Step 7: Save answer record
    const answerId = await Answer.create({
      question_id: questionId,
      user_id,
      content: finalResponse,
      tokens_used: aiResponse.tokens_used,
      processing_time: processingTime
    });

    // Track answer generated
    await analyticsService.trackAnswerGenerated(session_id, user_id, {
      tokens_used: aiResponse.tokens_used,
      processing_time: processingTime,
      subject: analysis.subject
    });

    // Step 8: Return response
    res.setHeader('x-session-id', session_id);
    res.json({
      success: true,
      data: {
        question_id: questionId,
        answer_id: answerId,
        question: {
          id: questionId,
          content: question,
          subject: analysis.subject,
          question_type: analysis.question_type,
          grade_level: analysis.grade_level,
          competencies: analysis.competencies
        },
        answer: {
          id: answerId,
          content: finalResponse,
          tokens_used: aiResponse.tokens_used,
          processing_time: processingTime,
          created_at: new Date().toISOString()
        },
        analysis: {
          subject: analysis.subject,
          question_type: analysis.question_type,
          competencies: analysis.competencies,
          complexity: analysis.complexity,
          confidence: analysis.confidence
        },
        competency_check: {
          valid: competencyCheck.valid,
          overall_score: competencyCheck.overall_score,
          emphasis_level: competencyCheck.emphasis_level,
          suggestions: competencyCheck.suggestions
        }
      }
    });

  } catch (error) {
    console.error('Error in /ask endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/ai/questions
 * Get user's question history
 */
router.get('/questions', optionalAuth, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const user_id = req.user ? req.user.id : null;

    if (!user_id) {
      return res.json({
        success: true,
        data: [],
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          has_more: false
        }
      });
    }

    const questions = await Question.findByUserId(user_id, parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: questions.map(q => q.toJSON()),
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        has_more: questions.length === parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error in /questions endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/ai/questions/:id
 * Get a specific question with its answers
 */
router.get('/questions/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user ? req.user.id : null;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        error: 'QUESTION_NOT_FOUND'
      });
    }

    // Check if user owns this question (only if logged in)
    if (user_id && question.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        error: 'ACCESS_DENIED'
      });
    }

    const answers = await question.getAnswers();

    res.json({
      success: true,
      data: {
        question: question.toJSON(),
        answers: answers.map(a => a.toJSON())
      }
    });

  } catch (error) {
    console.error('Error in /questions/:id endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/ai/answers/:id
 * Get a specific answer
 */
router.get('/answers/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user ? req.user.id : null;

    const answer = await Answer.findById(id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
        error: 'ANSWER_NOT_FOUND'
      });
    }

    // Check if user owns this answer (only if logged in)
    if (user_id && answer.user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        error: 'ACCESS_DENIED'
      });
    }

    const question = await answer.getQuestion();

    res.json({
      success: true,
      data: {
        answer: answer.toJSON(),
        question: question ? question.toJSON() : null
      }
    });

  } catch (error) {
    console.error('Error in /answers/:id endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /api/ai/analyze
 * Analyze a question without generating an answer
 */
router.post('/analyze', async (req, res) => {
  try {
    const { question, subject, grade_level } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question is required',
        error: 'MISSING_QUESTION'
      });
    }

    // Check cache first
    let analysis = cacheService.getCachedAnalysis(question);

    if (!analysis) {
      // Perform analysis
      analysis = QuestionAnalysisService.analyzeQuestion(question, {
        subject,
        grade_level
      });

      // Cache the result
      cacheService.cacheAnalysis(question, analysis);
    }

    const templateSelection = TemplateSelectionService.selectTemplate({
      ...analysis,
      originalQuestion: question
    });

    res.json({
      success: true,
      data: {
        analysis,
        template: {
          subject: templateSelection.subject,
          question_type: templateSelection.question_type,
          confidence: templateSelection.confidence
        },
        prompt_preview: templateSelection.prompt.substring(0, 200) + '...',
        cached: cacheService.getCachedAnalysis(question) !== null
      }
    });

  } catch (error) {
    console.error('Error in /analyze endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /api/ai/health
 * Check AI service health
 */
router.get('/health', async (req, res) => {
  try {
    const health = await groqService.getHealthStatus();

    res.json({
      success: true,
      data: health
    });

  } catch (error) {
    console.error('Error in /health endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: 'HEALTH_CHECK_ERROR'
    });
  }
});

/**
 * POST /api/ai/regenerate/:questionId
 * Regenerate answer for an existing question
 */
router.post('/regenerate/:questionId', optionalAuth, async (req, res) => {
  try {
    const { questionId } = req.params;
    const user_id = req.user ? req.user.id : null;

    if (!user_id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for regeneration',
        error: 'AUTH_REQUIRED'
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
        error: 'QUESTION_NOT_FOUND'
      });
    }

    if (question.user_id !== parseInt(user_id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        error: 'ACCESS_DENIED'
      });
    }

    // Generate new answer using existing question data
    const startTime = Date.now();
    const aiResponse = await groqService.generateCBAResponse(question.content, {
      subject: question.subject,
      grade_level: question.grade_level,
      competencies: question.competencies,
      question_type: question.question_type
    });

    const processingTime = Date.now() - startTime;

    // Check competencies
    const competencyCheck = CompetencyCheckerService.checkCompetencies(
      aiResponse.content,
      question.competencies,
      {
        subject: question.subject,
        question_type: question.question_type,
        grade_level: question.grade_level
      }
    );

    // Enhance if needed
    let finalResponse = aiResponse.content;
    if (!competencyCheck.valid) {
      finalResponse = CompetencyCheckerService.enhanceResponse(
        aiResponse.content,
        competencyCheck,
        {
          subject: question.subject,
          question_type: question.question_type
        }
      );
    }

    // Save new answer
    const answerId = await Answer.create({
      question_id: questionId,
      user_id,
      content: finalResponse,
      tokens_used: aiResponse.tokens_used,
      processing_time: processingTime
    });

    res.json({
      success: true,
      data: {
        answer_id: answerId,
        answer: {
          id: answerId,
          content: finalResponse,
          tokens_used: aiResponse.tokens_used,
          processing_time: processingTime,
          created_at: new Date().toISOString()
        },
        competency_check: {
          valid: competencyCheck.valid,
          overall_score: competencyCheck.overall_score,
          suggestions: competencyCheck.suggestions
        }
      }
    });

  } catch (error) {
    console.error('Error in /regenerate endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;