class CompetencyCheckerService {
  /**
   * Check if a response adequately addresses CBA competencies
   * @param {Object} response - CBA structured response
   * @param {Array} requiredCompetencies - Competencies that should be addressed
   * @param {Object} context - Additional context
   * @returns {Object} - Competency check results
   */
  static checkCompetencies(response, requiredCompetencies, context = {}) {
    const { subject, question_type, grade_level } = context;

    const results = {
      overall_score: 0,
      competency_scores: {},
      missing_competencies: [],
      suggestions: [],
      emphasis_level: this.assessSkillEmphasis(response),
      valid: false
    };

    // Check each required competency
    requiredCompetencies.forEach(competency => {
      const score = this.evaluateCompetency(response, competency, context);
      results.competency_scores[competency] = score;

      if (score < 0.6) {
        results.missing_competencies.push(competency);
      }
    });

    // Calculate overall score
    const scores = Object.values(results.competency_scores);
    results.overall_score = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;

    // Generate suggestions for improvement
    results.suggestions = this.generateSuggestions(results, response, context);

    // Determine if response is valid
    results.valid = results.overall_score >= 0.7 && results.emphasis_level >= 0.6;

    return results;
  }

  /**
   * Evaluate how well a specific competency is addressed in the response
   * @param {Object} response - CBA response
   * @param {string} competency - Competency to check
   * @param {Object} context - Context information
   * @returns {number} - Score between 0-1
   */
  static evaluateCompetency(response, competency, context) {
    const { introduction, elaboration, conclusion } = response;
    const fullText = `${introduction} ${elaboration} ${conclusion}`.toLowerCase();

    let score = 0;
    const competencyLower = competency.toLowerCase();

    // Check for direct mentions of competency concepts
    const competencyKeywords = this.getCompetencyKeywords(competency);
    const keywordMatches = competencyKeywords.filter(keyword =>
      fullText.includes(keyword.toLowerCase())
    ).length;
    score += Math.min(keywordMatches * 0.2, 0.4);

    // Check for application examples
    if (this.hasApplicationExamples(fullText, competency)) {
      score += 0.3;
    }

    // Check for skill demonstration
    if (this.hasSkillDemonstration(fullText, competency, context)) {
      score += 0.3;
    }

    // Check for real-world connections
    if (this.hasRealWorldConnections(fullText)) {
      score += 0.2;
    }

    // Penalize if response is too memorization-focused
    if (this.isMemorizationFocused(fullText)) {
      score *= 0.8;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Get keywords associated with a competency
   * @param {string} competency - Competency description
   * @returns {Array} - Related keywords
   */
  static getCompetencyKeywords(competency) {
    const competencyKeywords = {
      'knowledge': ['know', 'understand', 'identify', 'define', 'explain', 'describe'],
      'application': ['apply', 'use', 'implement', 'demonstrate', 'perform', 'utilize'],
      'analysis': ['analyze', 'compare', 'contrast', 'examine', 'investigate', 'break down'],
      'evaluation': ['evaluate', 'assess', 'judge', 'critique', 'recommend', 'justify'],
      'synthesis': ['create', 'design', 'integrate', 'combine', 'develop', 'formulate'],
      'communication': ['communicate', 'express', 'present', 'articulate', 'convey', 'explain'],
      'problem-solving': ['solve', 'resolve', 'address', 'overcome', 'find solution', 'approach'],
      'critical thinking': ['think critically', 'reason', 'analyze', 'evaluate', 'question', 'reflect']
    };

    const keywords = [];
    Object.entries(competencyKeywords).forEach(([key, words]) => {
      if (competency.toLowerCase().includes(key)) {
        keywords.push(...words);
      }
    });

    return [...new Set(keywords)];
  }

  /**
   * Check if response includes application examples
   * @param {string} text - Response text
   * @param {string} competency - Competency being checked
   * @returns {boolean} - Whether application examples are present
   */
  static hasApplicationExamples(text, competency) {
    const applicationIndicators = [
      'for example', 'such as', 'in practice', 'applied to', 'when we', 'in real life',
      'this can be used', 'practical application', 'real-world', 'everyday situation',
      'we can see this', 'this helps us', 'this allows us'
    ];

    return applicationIndicators.some(indicator => text.includes(indicator));
  }

  /**
   * Check if response demonstrates skill application
   * @param {string} text - Response text
   * @param {string} competency - Competency being checked
   * @param {Object} context - Context information
   * @returns {boolean} - Whether skills are demonstrated
   */
  static hasSkillDemonstration(text, competency, context) {
    const { question_type } = context;

    // Different indicators based on question type
    const skillIndicators = {
      'factual': ['identify', 'define', 'list', 'name', 'state'],
      'analytical': ['explain why', 'analyze how', 'compare', 'contrast', 'examine'],
      'practical': ['perform', 'demonstrate', 'create', 'design', 'conduct'],
      'application': ['apply', 'use', 'implement', 'solve using', 'utilize'],
      'evaluation': ['assess', 'evaluate', 'judge', 'recommend', 'justify'],
      'synthesis': ['combine', 'integrate', 'create', 'design', 'develop']
    };

    const indicators = skillIndicators[question_type] || [];
    return indicators.some(indicator => text.includes(indicator));
  }

  /**
   * Check for real-world connections in the response
   * @param {string} text - Response text
   * @returns {boolean} - Whether real-world connections are present
   */
  static hasRealWorldConnections(text) {
    const realWorldIndicators = [
      'in everyday life', 'in the real world', 'practical', 'useful for',
      'helps us', 'important because', 'we use this', 'this applies to',
      'in our community', 'in uganda', 'in africa', 'in daily life'
    ];

    return realWorldIndicators.some(indicator => text.includes(indicator));
  }

  /**
   * Check if response is focused on memorization rather than application
   * @param {string} text - Response text
   * @returns {boolean} - Whether response is memorization-focused
   */
  static isMemorizationFocused(text) {
    const memorizationIndicators = [
      'memorize', 'remember', 'recall', 'rote learning', 'by heart',
      'just know', 'learn this', 'study this', 'repeat after me'
    ];

    const memorizationCount = memorizationIndicators.filter(indicator =>
      text.includes(indicator)
    ).length;

    // Also check for lack of application indicators
    const applicationIndicators = [
      'apply', 'use', 'demonstrate', 'practice', 'do this', 'try this'
    ];

    const applicationCount = applicationIndicators.filter(indicator =>
      text.includes(indicator)
    ).length;

    return memorizationCount > applicationCount;
  }

  /**
   * Assess the level of skill application emphasis in the response
   * @param {Object} response - CBA response
   * @returns {number} - Emphasis level (0-1)
   */
  static assessSkillEmphasis(response) {
    const { introduction, elaboration, conclusion } = response;
    const fullText = `${introduction} ${elaboration} ${conclusion}`.toLowerCase();

    let emphasis = 0;

    // Check conclusion for application focus
    if (conclusion.toLowerCase().includes('application') ||
        conclusion.toLowerCase().includes('apply') ||
        conclusion.toLowerCase().includes('use') ||
        conclusion.toLowerCase().includes('practice')) {
      emphasis += 0.4;
    }

    // Check for practical examples throughout
    if (this.hasApplicationExamples(fullText)) {
      emphasis += 0.3;
    }

    // Check for skill-based language
    const skillWords = ['demonstrate', 'perform', 'apply', 'use', 'practice', 'develop', 'improve'];
    const skillCount = skillWords.filter(word => fullText.includes(word)).length;
    emphasis += Math.min(skillCount * 0.1, 0.3);

    return Math.min(emphasis, 1.0);
  }

  /**
   * Generate suggestions for improving competency alignment
   * @param {Object} results - Competency check results
   * @param {Object} response - Original response
   * @param {Object} context - Context information
   * @returns {Array} - List of suggestions
   */
  static generateSuggestions(results, response, context) {
    const suggestions = [];

    // Suggestions for missing competencies
    results.missing_competencies.forEach(competency => {
      suggestions.push(`Add more emphasis on ${competency.toLowerCase()} with practical examples`);
    });

    // Suggestions based on emphasis level
    if (results.emphasis_level < 0.6) {
      suggestions.push('Include more practical applications and real-world examples');
      suggestions.push('Strengthen the conclusion with clear applications of the concepts');
    }

    // Suggestions based on overall score
    if (results.overall_score < 0.7) {
      suggestions.push('Ensure all CBA competencies are addressed with specific examples');
      suggestions.push('Balance theoretical explanation with practical demonstration');
    }

    // Subject-specific suggestions
    const subjectSuggestions = this.getSubjectSpecificSuggestions(context.subject, results);
    suggestions.push(...subjectSuggestions);

    return suggestions;
  }

  /**
   * Get subject-specific suggestions for competency improvement
   * @param {string} subject - Subject name
   * @param {Object} results - Competency check results
   * @returns {Array} - Subject-specific suggestions
   */
  static getSubjectSpecificSuggestions(subject, results) {
    const suggestions = [];

    switch (subject) {
      case 'Mathematics':
        if (results.emphasis_level < 0.7) {
          suggestions.push('Include step-by-step problem-solving demonstrations');
          suggestions.push('Show how mathematical concepts apply to real-world calculations');
        }
        break;

      case 'Biology':
      case 'Chemistry':
      case 'Physics':
        if (results.emphasis_level < 0.7) {
          suggestions.push('Include laboratory or field application examples');
          suggestions.push('Connect scientific concepts to Ugandan environmental contexts');
        }
        break;

      case 'English':
        if (results.emphasis_level < 0.7) {
          suggestions.push('Demonstrate language skills through practical writing or speaking examples');
          suggestions.push('Show how literary analysis applies to real communication situations');
        }
        break;

      case 'History':
        if (results.emphasis_level < 0.7) {
          suggestions.push('Connect historical events to contemporary Ugandan society');
          suggestions.push('Show how historical analysis skills apply to current events');
        }
        break;

      default:
        suggestions.push('Include subject-specific practical applications and examples');
    }

    return suggestions;
  }

  /**
   * Enhance a response to better address competencies
   * @param {Object} response - Original response
   * @param {Object} checkResults - Competency check results
   * @param {Object} context - Context information
   * @returns {Object} - Enhanced response
   */
  static enhanceResponse(response, checkResults, context) {
    const enhanced = { ...response };

    // Enhance conclusion with better application focus
    if (checkResults.emphasis_level < 0.6) {
      enhanced.conclusion = this.improveConclusionForApplication(
        enhanced.conclusion,
        context
      );
    }

    // Add missing competency demonstrations
    checkResults.missing_competencies.forEach(competency => {
      if (this.canAddCompetencyExample(enhanced, competency)) {
        enhanced.elaboration = this.addCompetencyExample(
          enhanced.elaboration,
          competency,
          context
        );
      }
    });

    return enhanced;
  }

  /**
   * Improve conclusion to emphasize application
   * @param {string} conclusion - Original conclusion
   * @param {Object} context - Context information
   * @returns {string} - Improved conclusion
   */
  static improveConclusionForApplication(conclusion, context) {
    const { subject, question_type } = context;

    const applicationPhrases = {
      'Mathematics': 'These mathematical skills enable us to solve real-world problems and make informed decisions in various fields.',
      'Biology': 'Understanding these biological processes helps us appreciate life systems and make informed decisions about health and environment.',
      'Chemistry': 'These chemical principles help us understand materials around us and develop solutions for various applications.',
      'Physics': 'These physical laws govern our world and enable technological innovations that improve our lives.',
      'English': 'These language and communication skills enable effective expression and understanding in academic and professional contexts.',
      'History': 'Understanding historical patterns helps us analyze current events and make informed decisions about our future.',
      'Geography': 'These geographical concepts help us understand our place in the world and address environmental challenges.'
    };

    const applicationPhrase = applicationPhrases[subject] || 'Mastering these concepts enables practical application in real-world situations.';

    return conclusion + ' ' + applicationPhrase;
  }

  /**
   * Check if a competency example can be added to the response
   * @param {Object} response - Response object
   * @param {string} competency - Competency to add
   * @returns {boolean} - Whether example can be added
   */
  static canAddCompetencyExample(response, competency) {
    // Check if elaboration section has space for additional content
    return response.elaboration && response.elaboration.length < 1000;
  }

  /**
   * Add a competency example to the elaboration section
   * @param {string} elaboration - Original elaboration
   * @param {string} competency - Competency to demonstrate
   * @param {Object} context - Context information
   * @returns {string} - Enhanced elaboration
   */
  static addCompetencyExample(elaboration, competency, context) {
    const { subject } = context;

    // Simple examples based on competency type
    const examples = {
      'application': 'For example, we can apply this knowledge when...',
      'analysis': 'By analyzing similar situations, we can...',
      'evaluation': 'When evaluating different approaches, we consider...',
      'problem-solving': 'To solve related problems, we can...'
    };

    const competencyType = Object.keys(examples).find(type =>
      competency.toLowerCase().includes(type)
    );

    if (competencyType) {
      return elaboration + ' ' + examples[competencyType];
    }

    return elaboration;
  }
}

module.exports = CompetencyCheckerService;