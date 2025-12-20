const templates = require('../templates/subjectTemplates');
const cacheService = require('./cacheService');

class TemplateSelectionService {
  /**
   * Select the most appropriate template for a question
   * @param {Object} analysis - Question analysis results
   * @returns {Object} - Selected template and prompt
   */
  static selectTemplate(analysis) {
    const { subject, question_type, grade_level, competencies, complexity } = analysis;

    // Check cache first for subject-specific template
    let template = cacheService.getCachedSubjectTemplate(subject, grade_level);

    if (!template) {
      // Get base template for subject
      template = templates.getTemplate(subject);

      if (!template) {
        // Fallback to general template
        template = this.getFallbackTemplate();
      }

      // Cache the template for future use
      cacheService.cacheSubjectTemplate(subject, grade_level, template);
    }

    // Customize template based on question type and other factors
    const customizedTemplate = this.customizeTemplate(template, {
      question_type,
      grade_level,
      competencies,
      complexity
    });

    // Generate the final prompt
    const prompt = this.generatePrompt(customizedTemplate, analysis);

    return {
      template: customizedTemplate,
      prompt,
      subject,
      question_type,
      confidence: this.calculateSelectionConfidence(analysis, template)
    };
  }

  /**
   * Get fallback template when subject-specific template is not available
   * @returns {Object} - Fallback template
   */
  static getFallbackTemplate() {
    return {
      subject: 'General',
      question_types: ['factual', 'analytical', 'practical', 'application', 'evaluation', 'synthesis'],
      prompt_template: `As an expert educational assistant for Ugandan Competency-Based Assessment (CBA) curriculum, please answer the following question in a structured format:

SUBJECT: {subject}
GRADE LEVEL: {grade_level}
QUESTION TYPE: {question_type}
COMPETENCIES TO ADDRESS: {competencies}

QUESTION: {question}

Please structure your response in the CBA format:
1. INTRODUCTION: Provide context and state the main concept
2. ELABORATION: Explain in detail with examples and step-by-step reasoning
3. CONCLUSION: Summarize key points and relate to real-world application

Ensure the response aligns with UNEB standards and emphasizes skill application rather than memorization.`,
      competencies: [
        'Knowledge and understanding of basic concepts',
        'Application of knowledge in familiar situations',
        'Critical thinking and problem-solving skills',
        'Communication of ideas clearly and effectively'
      ],
      grade_levels: ['S1', 'S2', 'S3', 'S4']
    };
  }

  /**
   * Customize template based on specific requirements
   * @param {Object} template - Base template
   * @param {Object} options - Customization options
   * @returns {Object} - Customized template
   */
  static customizeTemplate(template, options) {
    const { question_type, grade_level, competencies, complexity } = options;

    let customizedPrompt = template.prompt_template;

    // Adjust prompt based on question type
    customizedPrompt = this.adjustForQuestionType(customizedPrompt, question_type);

    // Adjust for grade level
    customizedPrompt = this.adjustForGradeLevel(customizedPrompt, grade_level);

    // Adjust for complexity
    customizedPrompt = this.adjustForComplexity(customizedPrompt, complexity);

    // Filter competencies based on question type
    const relevantCompetencies = this.filterCompetencies(template.competencies, question_type, competencies);

    return {
      ...template,
      prompt_template: customizedPrompt,
      competencies: relevantCompetencies
    };
  }

  /**
   * Adjust prompt template for specific question type
   * @param {string} prompt - Base prompt
   * @param {string} questionType - Question type
   * @returns {string} - Adjusted prompt
   */
  static adjustForQuestionType(prompt, questionType) {
    const typeAdjustments = {
      'factual': `
Focus on providing accurate information and clear definitions.
Emphasize key facts, terms, and basic concepts that students need to know.`,

      'analytical': `
Focus on breaking down complex ideas into understandable parts.
Include step-by-step analysis, comparisons, and explanations of relationships.
Encourage critical thinking about why and how things work.`,

      'practical': `
Emphasize hands-on application and real-world relevance.
Include step-by-step procedures, safety considerations, and practical tips.
Focus on skills development and demonstration of competencies.`,

      'application': `
Show how concepts are used in real situations.
Provide examples of practical application and problem-solving.
Connect theoretical knowledge to everyday scenarios.`,

      'evaluation': `
Encourage assessment and judgment of different approaches.
Include criteria for evaluation and decision-making processes.
Focus on developing reasoning skills and justified conclusions.`,

      'synthesis': `
Promote integration of different ideas and concepts.
Encourage creative combination of knowledge from multiple areas.
Focus on developing new understandings and innovative solutions.`
    };

    const adjustment = typeAdjustments[questionType] || '';
    return prompt.replace('QUESTION: {question}', `QUESTION: {question}${adjustment}`);
  }

  /**
   * Adjust prompt for grade level
   * @param {string} prompt - Base prompt
   * @param {string} gradeLevel - Grade level
   * @returns {string} - Adjusted prompt
   */
  static adjustForGradeLevel(prompt, gradeLevel) {
    const levelAdjustments = {
      'S1': `
Use simple language and basic explanations.
Include lots of examples and visual descriptions.
Focus on building foundational knowledge and basic skills.`,

      'S2': `
Use clear language with some technical terms explained.
Include practical examples and connections to everyday life.
Build on basic knowledge while introducing new concepts.`,

      'S3': `
Use more sophisticated language and technical terminology.
Include detailed analysis and complex examples.
Encourage deeper understanding and critical thinking.`,

      'S4': `
Use advanced language and assume prior knowledge.
Include complex analysis, abstract concepts, and interdisciplinary connections.
Focus on mastery, synthesis, and independent application.`
    };

    const adjustment = levelAdjustments[gradeLevel] || '';
    return prompt.replace('QUESTION: {question}', `QUESTION: {question}${adjustment}`);
  }

  /**
   * Adjust prompt for complexity level
   * @param {string} prompt - Base prompt
   * @param {string} complexity - Complexity level
   * @returns {string} - Adjusted prompt
   */
  static adjustForComplexity(prompt, complexity) {
    const complexityAdjustments = {
      'low': `
Keep explanations straightforward and concise.
Use simple examples and avoid overwhelming detail.
Focus on core concepts and essential information.`,

      'medium': `
Provide balanced explanations with appropriate detail.
Include relevant examples and connections.
Maintain clarity while covering necessary complexity.`,

      'high': `
Provide comprehensive explanations with detailed analysis.
Include multiple perspectives and complex examples.
Encourage deep understanding and critical evaluation.`
    };

    const adjustment = complexityAdjustments[complexity] || '';
    return prompt.replace('Ensure the response aligns with UNEB standards and emphasizes skill application rather than memorization.',
      `${adjustment}

Ensure the response aligns with UNEB standards and emphasizes skill application rather than memorization.`);
  }

  /**
   * Filter competencies based on question type and provided competencies
   * @param {Array} templateCompetencies - Competencies from template
   * @param {string} questionType - Question type
   * @param {Array} analysisCompetencies - Competencies from analysis
   * @returns {Array} - Filtered competencies
   */
  static filterCompetencies(templateCompetencies, questionType, analysisCompetencies) {
    // Combine and prioritize competencies
    const allCompetencies = [...new Set([...templateCompetencies, ...analysisCompetencies])];

    // Sort by relevance to question type
    const typeWeights = {
      'factual': ['knowledge', 'understanding', 'identify', 'define'],
      'analytical': ['analyze', 'explain', 'evaluate', 'understand'],
      'practical': ['apply', 'demonstrate', 'perform', 'create'],
      'application': ['apply', 'use', 'implement', 'solve'],
      'evaluation': ['assess', 'evaluate', 'judge', 'critique'],
      'synthesis': ['create', 'design', 'integrate', 'develop']
    };

    const weights = typeWeights[questionType] || [];

    return allCompetencies
      .sort((a, b) => {
        const aWeight = weights.reduce((sum, weight) =>
          sum + (a.toLowerCase().includes(weight) ? 1 : 0), 0);
        const bWeight = weights.reduce((sum, weight) =>
          sum + (b.toLowerCase().includes(weight) ? 1 : 0), 0);
        return bWeight - aWeight;
      })
      .slice(0, 4); // Limit to top 4
  }

  /**
   * Generate the final prompt with all variables replaced
   * @param {Object} template - Customized template
   * @param {Object} analysis - Question analysis
   * @returns {string} - Final prompt
   */
  static generatePrompt(template, analysis) {
    const { subject, question_type, grade_level, competencies, complexity } = analysis;

    let prompt = template.prompt_template;

    // Replace variables
    prompt = prompt.replace(/{subject}/g, subject);
    prompt = prompt.replace(/{question_type}/g, questionType);
    prompt = prompt.replace(/{grade_level}/g, grade_level);
    prompt = prompt.replace(/{question}/g, analysis.originalQuestion || '');
    prompt = prompt.replace(/{competencies}/g, competencies.join(', '));

    // Add complexity indicator
    if (complexity) {
      prompt = prompt.replace('QUESTION TYPE: {question_type}',
        `QUESTION TYPE: {question_type}
COMPLEXITY: ${complexity}`);
    }

    return prompt;
  }

  /**
   * Calculate confidence in template selection
   * @param {Object} analysis - Question analysis
   * @param {Object} template - Selected template
   * @returns {number} - Confidence score (0-1)
   */
  static calculateSelectionConfidence(analysis, template) {
    let confidence = 0.5; // Base confidence

    // Increase confidence if subject matches exactly
    if (template.subject === analysis.subject) confidence += 0.2;

    // Increase confidence if question type is supported
    if (template.question_types.includes(analysis.question_type)) confidence += 0.2;

    // Increase confidence if grade level is supported
    if (template.grade_levels.includes(analysis.grade_level)) confidence += 0.1;

    // Increase confidence based on analysis confidence
    confidence += analysis.confidence * 0.2;

    return Math.min(confidence, 1.0);
  }

  /**
   * Get alternative templates if the primary selection has low confidence
   * @param {Object} analysis - Question analysis
   * @param {number} minConfidence - Minimum confidence threshold
   * @returns {Array} - Alternative template options
   */
  static getAlternativeTemplates(analysis, minConfidence = 0.7) {
    const primarySelection = this.selectTemplate(analysis);

    if (primarySelection.confidence >= minConfidence) {
      return [primarySelection];
    }

    // Get fallback template as alternative
    const fallback = this.getFallbackTemplate();
    const fallbackPrompt = this.generatePrompt(fallback, analysis);

    return [
      primarySelection,
      {
        template: fallback,
        prompt: fallbackPrompt,
        subject: 'General',
        question_type: analysis.question_type,
        confidence: 0.8 // Fallback has high confidence as it's general
      }
    ];
  }

  /**
   * Validate template selection
   * @param {Object} selection - Template selection result
   * @returns {Object} - Validation result
   */
  static validateSelection(selection) {
    const issues = [];

    if (!selection.template) {
      issues.push('No template selected');
    }

    if (!selection.prompt || selection.prompt.trim().length === 0) {
      issues.push('Generated prompt is empty');
    }

    if (selection.confidence < 0.3) {
      issues.push('Low confidence in template selection');
    }

    // Check for required variables in prompt
    const requiredVars = ['{question}'];
    const missingVars = requiredVars.filter(variable =>
      !selection.prompt.includes(variable)
    );

    if (missingVars.length > 0) {
      issues.push(`Missing required variables in prompt: ${missingVars.join(', ')}`);
    }

    return {
      valid: issues.length === 0,
      issues,
      selection
    };
  }
}

module.exports = TemplateSelectionService;