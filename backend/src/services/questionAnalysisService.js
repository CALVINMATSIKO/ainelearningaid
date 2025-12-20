const templates = require('../templates/subjectTemplates');
const { SUBJECT_METADATA } = require('../../../shared/constants/index');

class QuestionAnalysisService {
  /**
   * Analyze a question to extract subject, type, competencies, and other metadata
   * @param {string} question - The question text
   * @param {Object} context - Additional context (user grade level, etc.)
   * @returns {Object} - Analysis results
   */
  static analyzeQuestion(question, context = {}) {
    const analysis = {
      subject: this.identifySubject(question, context),
      question_type: this.identifyQuestionType(question),
      competencies: [],
      grade_level: context.grade_level || this.inferGradeLevel(question),
      keywords: this.extractKeywords(question),
      complexity: this.assessComplexity(question),
      confidence: 0 // Will be set based on matching accuracy
    };

    // Get competencies based on subject and question type
    analysis.competencies = this.identifyCompetencies(analysis.subject, analysis.question_type, question);

    // Calculate confidence based on how well the analysis matches
    analysis.confidence = this.calculateConfidence(analysis, question);

    return analysis;
  }

  /**
   * Identify the subject of the question
   * @param {string} question - Question text
   * @param {Object} context - Context information
   * @returns {string} - Identified subject
   */
  static identifySubject(question, context) {
    const lowerQuestion = question.toLowerCase();

    // Check for explicit subject mentions
    const subjectKeywords = {
      'Mathematics': ['math', 'mathematics', 'algebra', 'geometry', 'calculus', 'equation', 'formula', 'theorem'],
      'English': ['english', 'literature', 'grammar', 'vocabulary', 'reading', 'writing', 'poetry', 'novel'],
      'Biology': ['biology', 'cell', 'organism', 'ecosystem', 'evolution', 'genetics', 'photosynthesis', 'respiration'],
      'Chemistry': ['chemistry', 'chemical', 'reaction', 'element', 'compound', 'acid', 'base', 'molecule'],
      'Physics': ['physics', 'force', 'energy', 'motion', 'electricity', 'magnetism', 'light', 'sound'],
      'History': ['history', 'historical', 'civilization', 'empire', 'war', 'revolution', 'independence', 'colonial'],
      'Geography': ['geography', 'map', 'continent', 'country', 'climate', 'landform', 'population', 'migration'],
      'Religious Education': ['religion', 'religious', 'christianity', 'islam', 'hinduism', 'buddhism', 'faith', 'god'],
      'Agriculture': ['agriculture', 'farming', 'crop', 'livestock', 'soil', 'irrigation', 'harvest', 'pesticide'],
      'Technology': ['technology', 'computer', 'programming', 'internet', 'software', 'hardware', 'digital']
    };

    // Count matches for each subject
    const scores = {};
    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      scores[subject] = keywords.reduce((count, keyword) => {
        return count + (lowerQuestion.includes(keyword) ? 1 : 0);
      }, 0);
    }

    // Find subject with highest score
    let maxScore = 0;
    let identifiedSubject = 'Other';

    for (const [subject, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        identifiedSubject = subject;
      }
    }

    // If no clear match, check context
    if (maxScore === 0 && context.subject) {
      identifiedSubject = context.subject;
    }

    return identifiedSubject;
  }

  /**
   * Identify the type of question
   * @param {string} question - Question text
   * @returns {string} - Question type
   */
  static identifyQuestionType(question) {
    const lowerQuestion = question.toLowerCase();

    // Question type indicators
    const typeIndicators = {
      'factual': ['what is', 'who is', 'when did', 'where is', 'define', 'identify', 'list', 'name'],
      'analytical': ['why', 'how', 'explain', 'analyze', 'compare', 'contrast', 'evaluate', 'critique'],
      'practical': ['how would you', 'design', 'create', 'demonstrate', 'perform', 'conduct', 'experiment'],
      'application': ['apply', 'use', 'solve', 'calculate', 'implement', 'utilize', 'employ'],
      'evaluation': ['assess', 'judge', 'determine', 'decide', 'recommend', 'justify', 'prioritize'],
      'synthesis': ['combine', 'integrate', 'create', 'design', 'develop', 'formulate', 'compose']
    };

    // Count matches for each type
    const scores = {};
    for (const [type, indicators] of Object.entries(typeIndicators)) {
      scores[type] = indicators.reduce((count, indicator) => {
        return count + (lowerQuestion.includes(indicator) ? 1 : 0);
      }, 0);
    }

    // Find type with highest score
    let maxScore = 0;
    let identifiedType = 'factual'; // Default

    for (const [type, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        identifiedType = type;
      }
    }

    return identifiedType;
  }

  /**
   * Identify relevant competencies based on subject and question type
   * @param {string} subject - Subject
   * @param {string} questionType - Question type
   * @param {string} question - Full question text
   * @returns {Array} - List of competencies
   */
  static identifyCompetencies(subject, questionType, question) {
    // Get template for subject
    const template = templates.getTemplate(subject);
    if (!template) return [];

    // Filter competencies based on question type
    const relevantCompetencies = template.competencies.filter(competency => {
      return this.competencyMatchesQuestionType(competency, questionType, question);
    });

    return relevantCompetencies.slice(0, 3); // Limit to top 3
  }

  /**
   * Check if a competency matches the question type
   * @param {string} competency - Competency description
   * @param {string} questionType - Question type
   * @param {string} question - Question text
   * @returns {boolean} - Whether it matches
   */
  static competencyMatchesQuestionType(competency, questionType, question) {
    const lowerCompetency = competency.toLowerCase();
    const lowerQuestion = question.toLowerCase();

    // Map question types to competency keywords
    const typeMappings = {
      'factual': ['knowledge', 'understanding', 'identify', 'define', 'recall'],
      'analytical': ['analyze', 'explain', 'compare', 'evaluate', 'understand'],
      'practical': ['apply', 'demonstrate', 'perform', 'create', 'design'],
      'application': ['apply', 'use', 'implement', 'solve', 'utilize'],
      'evaluation': ['assess', 'evaluate', 'judge', 'critique', 'recommend'],
      'synthesis': ['create', 'design', 'integrate', 'compose', 'develop']
    };

    const relevantKeywords = typeMappings[questionType] || [];
    return relevantKeywords.some(keyword =>
      lowerCompetency.includes(keyword) || lowerQuestion.includes(keyword)
    );
  }

  /**
   * Infer grade level from question content
   * @param {string} question - Question text
   * @returns {string} - Inferred grade level
   */
  static inferGradeLevel(question) {
    const lowerQuestion = question.toLowerCase();

    // Grade level indicators
    const gradeIndicators = {
      'S1': ['basic', 'fundamental', 'introduction', 'simple'],
      'S2': ['intermediate', 'developing', 'building'],
      'S3': ['advanced', 'complex', 'detailed', 'comprehensive'],
      'S4': ['sophisticated', 'expert', 'specialized', 'in-depth']
    };

    // Count matches for each grade
    const scores = {};
    for (const [grade, indicators] of Object.entries(gradeIndicators)) {
      scores[grade] = indicators.reduce((count, indicator) => {
        return count + (lowerQuestion.includes(indicator) ? 1 : 0);
      }, 0);
    }

    // Find grade with highest score
    let maxScore = 0;
    let inferredGrade = 'S2'; // Default

    for (const [grade, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        inferredGrade = grade;
      }
    }

    return inferredGrade;
  }

  /**
   * Extract keywords from the question
   * @param {string} question - Question text
   * @returns {Array} - List of keywords
   */
  static extractKeywords(question) {
    // Remove common question words
    const stopWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall'];

    const words = question.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));

    // Get unique words and sort by frequency
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.keys(wordCount)
      .sort((a, b) => wordCount[b] - wordCount[a])
      .slice(0, 10); // Top 10 keywords
  }

  /**
   * Assess the complexity of the question
   * @param {string} question - Question text
   * @returns {string} - Complexity level
   */
  static assessComplexity(question) {
    const length = question.length;
    const wordCount = question.split(/\s+/).length;
    const sentenceCount = question.split(/[.!?]+/).length;

    // Complexity factors
    let complexityScore = 0;

    if (wordCount > 20) complexityScore += 1;
    if (sentenceCount > 2) complexityScore += 1;
    if (length > 100) complexityScore += 1;
    if (question.includes('explain') || question.includes('analyze') || question.includes('evaluate')) complexityScore += 2;
    if (question.includes('compare') || question.includes('contrast') || question.includes('synthesize')) complexityScore += 1;

    if (complexityScore >= 4) return 'high';
    if (complexityScore >= 2) return 'medium';
    return 'low';
  }

  /**
   * Calculate confidence in the analysis
   * @param {Object} analysis - Analysis results
   * @param {string} question - Original question
   * @returns {number} - Confidence score (0-1)
   */
  static calculateConfidence(analysis, question) {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on keyword matches
    if (analysis.keywords.length > 5) confidence += 0.1;

    // Increase confidence if subject was clearly identified
    const subjectKeywords = this.getSubjectKeywords(analysis.subject);
    const keywordMatches = subjectKeywords.filter(keyword =>
      question.toLowerCase().includes(keyword)
    ).length;
    confidence += Math.min(keywordMatches * 0.1, 0.3);

    // Increase confidence for clear question types
    const typeIndicators = ['what', 'how', 'why', 'explain', 'analyze', 'compare'];
    const hasClearType = typeIndicators.some(indicator =>
      question.toLowerCase().includes(indicator)
    );
    if (hasClearType) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  /**
   * Get keywords for a subject
   * @param {string} subject - Subject name
   * @returns {Array} - Subject keywords
   */
  static getSubjectKeywords(subject) {
    const keywordMap = {
      'Mathematics': ['math', 'equation', 'formula', 'calculate', 'solve', 'theorem'],
      'English': ['literature', 'grammar', 'vocabulary', 'reading', 'writing'],
      'Biology': ['cell', 'organism', 'ecosystem', 'evolution', 'genetics'],
      'Chemistry': ['chemical', 'reaction', 'element', 'compound', 'molecule'],
      'Physics': ['force', 'energy', 'motion', 'electricity', 'magnetism'],
      'History': ['historical', 'civilization', 'empire', 'war', 'revolution'],
      'Geography': ['map', 'continent', 'country', 'climate', 'landform']
    };

    return keywordMap[subject] || [];
  }

  /**
   * Validate and refine analysis results
   * @param {Object} analysis - Analysis results
   * @param {Object} context - Additional context
   * @returns {Object} - Refined analysis
   */
  static refineAnalysis(analysis, context = {}) {
    // Apply context overrides
    if (context.subject && context.subject !== analysis.subject) {
      analysis.subject = context.subject;
      analysis.competencies = this.identifyCompetencies(analysis.subject, analysis.question_type, context.originalQuestion || '');
    }

    if (context.grade_level && context.grade_level !== analysis.grade_level) {
      analysis.grade_level = context.grade_level;
    }

    // Recalculate confidence
    analysis.confidence = this.calculateConfidence(analysis, context.originalQuestion || '');

    return analysis;
  }

  /**
   * Validate if the question content is appropriate for the specified grade level
   * @param {string} subject - Subject name
   * @param {string} gradeLevel - Grade level
   * @param {string} question - Question text
   * @returns {Object} - Validation result
   */
  static validateGradeLevelAppropriateness(subject, gradeLevel, question) {
    const metadata = SUBJECT_METADATA[subject];

    if (!metadata) {
      return {
        isValid: true,
        warnings: [],
        suggestions: []
      };
    }

    const warnings = [];
    const suggestions = [];

    // Check if grade level is supported for this subject
    if (!metadata.educationLevels.includes(gradeLevel)) {
      warnings.push(`Subject '${subject}' is not typically taught at ${gradeLevel} level in Ugandan curriculum.`);
      suggestions.push(`Consider selecting a grade level where ${subject} is offered: ${metadata.educationLevels.join(', ')}`);
    }

    // Check question complexity against grade level
    const complexity = this.assessComplexity(question);
    const expectedComplexity = this.getExpectedComplexityForGrade(gradeLevel);

    if (complexity === 'high' && expectedComplexity === 'low') {
      warnings.push('Question appears too complex for the selected grade level.');
      suggestions.push('Consider simplifying the question or selecting a higher grade level.');
    } else if (complexity === 'low' && expectedComplexity === 'high') {
      warnings.push('Question appears too basic for the selected grade level.');
      suggestions.push('Consider making the question more challenging or selecting a lower grade level.');
    }

    // Check for subject-specific grade level indicators
    const gradeLevelWarnings = this.checkSubjectSpecificGradeLevel(subject, gradeLevel, question);
    warnings.push(...gradeLevelWarnings.warnings);
    suggestions.push(...gradeLevelWarnings.suggestions);

    return {
      isValid: warnings.length === 0,
      warnings,
      suggestions,
      metadata: {
        subjectDifficulty: metadata.difficulty,
        supportedGrades: metadata.educationLevels,
        questionComplexity: complexity,
        expectedComplexity: expectedComplexity
      }
    };
  }

  /**
   * Get expected complexity level for a grade
   * @param {string} gradeLevel - Grade level
   * @returns {string} - Expected complexity
   */
  static getExpectedComplexityForGrade(gradeLevel) {
    const complexityMap = {
      'P1': 'low', 'P2': 'low', 'P3': 'low',
      'P4': 'low', 'P5': 'medium', 'P6': 'medium', 'P7': 'medium',
      'S1': 'medium', 'S2': 'medium', 'S3': 'high', 'S4': 'high',
      'S5': 'high', 'S6': 'high'
    };
    return complexityMap[gradeLevel] || 'medium';
  }

  /**
   * Check subject-specific grade level appropriateness
   * @param {string} subject - Subject name
   * @param {string} gradeLevel - Grade level
   * @param {string} question - Question text
   * @returns {Object} - Validation result
   */
  static checkSubjectSpecificGradeLevel(subject, gradeLevel, question) {
    const warnings = [];
    const suggestions = [];
    const lowerQuestion = question.toLowerCase();

    // Subject-specific validations
    switch (subject) {
      case 'Mathematics':
        if (gradeLevel.startsWith('P') && (lowerQuestion.includes('calculus') || lowerQuestion.includes('algebra'))) {
          warnings.push('Advanced mathematical concepts like calculus or algebra are not appropriate for primary level.');
          suggestions.push('Focus on basic arithmetic, geometry, and simple problem-solving for primary grades.');
        }
        break;

      case 'Biology':
      case 'Chemistry':
      case 'Physics':
        if (gradeLevel.startsWith('P') && (lowerQuestion.includes('molecular') || lowerQuestion.includes('quantum'))) {
          warnings.push('Advanced scientific concepts are not appropriate for primary level science.');
          suggestions.push('Focus on basic observations, simple experiments, and everyday science applications.');
        }
        break;

      case 'History':
        if (gradeLevel === 'S1' && lowerQuestion.includes('post-colonial')) {
          warnings.push('Post-colonial history topics are more appropriate for higher secondary levels.');
          suggestions.push('For S1, focus on basic world history, African history, or pre-colonial societies.');
        }
        break;

      case 'English':
        if (gradeLevel.startsWith('P') && lowerQuestion.includes('literary criticism')) {
          warnings.push('Literary criticism is too advanced for primary level English.');
          suggestions.push('Focus on basic reading, writing, vocabulary, and simple comprehension.');
        }
        break;
    }

    return { warnings, suggestions };
  }
}

module.exports = QuestionAnalysisService;