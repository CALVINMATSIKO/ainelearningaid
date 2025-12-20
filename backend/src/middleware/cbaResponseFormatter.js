/**
 * CBA Response Formatter Middleware
 * Ensures all AI responses follow the Introduction → Elaboration → Conclusion structure
 * aligned with Ugandan Competency-Based Assessment requirements
 */

class CBAResponseFormatter {
  /**
   * Format a response into CBA structure
   * @param {Object} response - Raw response object
   * @param {Object} context - Context including subject, competencies, etc.
   * @returns {Object} - Formatted CBA response
   */
  static formatResponse(response, context = {}) {
    const { subject, competencies, grade_level, question_type } = context;

    // If response is already structured, validate and enhance it
    if (response.introduction && response.elaboration && response.conclusion) {
      return this.validateAndEnhanceStructure(response, context);
    }

    // If response is a string, parse and structure it
    if (typeof response === 'string') {
      return this.parseAndStructureText(response, context);
    }

    // Handle object responses that need restructuring
    return this.restructureResponse(response, context);
  }

  /**
   * Validate and enhance existing CBA structure
   * @param {Object} response - Structured response
   * @param {Object} context - Context information
   * @returns {Object} - Enhanced CBA response
   */
  static validateAndEnhanceStructure(response, context) {
    const { competencies = [] } = context;

    // Ensure all sections exist and are meaningful
    const enhanced = {
      introduction: this.ensureSectionContent(response.introduction, 'introduction', context),
      elaboration: this.ensureSectionContent(response.elaboration, 'elaboration', context),
      conclusion: this.ensureSectionContent(response.conclusion, 'conclusion', context),
      competencies_addressed: response.competencies_addressed || competencies,
      references: response.references || []
    };

    // Add CBA-specific enhancements
    enhanced.introduction = this.addCBAIntroduction(enhanced.introduction, context);
    enhanced.conclusion = this.addCBAConclusion(enhanced.conclusion, context);

    return enhanced;
  }

  /**
   * Parse text response and structure it into CBA format
   * @param {string} text - Raw text response
   * @param {Object} context - Context information
   * @returns {Object} - Structured CBA response
   */
  static parseAndStructureText(text, context) {
    // Try to identify sections in the text
    const sections = this.identifySections(text);

    // If sections are clearly identified, use them
    if (sections.introduction && sections.elaboration && sections.conclusion) {
      return this.validateAndEnhanceStructure(sections, context);
    }

    // Otherwise, intelligently split the content
    return this.intelligentSplit(text, context);
  }

  /**
   * Identify sections in text based on keywords and structure
   * @param {string} text - Text to parse
   * @returns {Object} - Identified sections
   */
  static identifySections(text) {
    const sections = {
      introduction: '',
      elaboration: '',
      conclusion: ''
    };

    // Split by common section markers
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    let currentSection = 'elaboration'; // Default section
    let sectionContent = [];

    for (const line of lines) {
      // Check for section headers
      const lowerLine = line.toLowerCase();

      if (lowerLine.includes('introduction') || lowerLine.includes('overview') || lowerLine.includes('background')) {
        // Save previous section
        if (sectionContent.length > 0) {
          sections[currentSection] = sectionContent.join(' ');
          sectionContent = [];
        }
        currentSection = 'introduction';
      } else if (lowerLine.includes('elaboration') || lowerLine.includes('explanation') || lowerLine.includes('details') || lowerLine.includes('analysis')) {
        if (sectionContent.length > 0) {
          sections[currentSection] = sectionContent.join(' ');
          sectionContent = [];
        }
        currentSection = 'elaboration';
      } else if (lowerLine.includes('conclusion') || lowerLine.includes('summary') || lowerLine.includes('application') || lowerLine.includes('implication')) {
        if (sectionContent.length > 0) {
          sections[currentSection] = sectionContent.join(' ');
          sectionContent = [];
        }
        currentSection = 'conclusion';
      } else {
        // Add line to current section
        sectionContent.push(line);
      }
    }

    // Save the last section
    if (sectionContent.length > 0) {
      sections[currentSection] = sectionContent.join(' ');
    }

    return sections;
  }

  /**
   * Intelligently split content when sections aren't clearly marked
   * @param {string} text - Text to split
   * @param {Object} context - Context information
   * @returns {Object} - Structured response
   */
  static intelligentSplit(text, context) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Simple heuristic: first 2-3 sentences for introduction, middle for elaboration, last 2-3 for conclusion
    const introCount = Math.min(3, Math.ceil(sentences.length * 0.2));
    const conclusionCount = Math.min(3, Math.ceil(sentences.length * 0.2));

    const introduction = sentences.slice(0, introCount).join('. ') + '.';
    const conclusion = sentences.slice(-conclusionCount).join('. ') + '.';
    const elaboration = sentences.slice(introCount, -conclusionCount).join('. ') + '.';

    return this.validateAndEnhanceStructure({
      introduction,
      elaboration,
      conclusion
    }, context);
  }

  /**
   * Restructure a response object into CBA format
   * @param {Object} response - Response object to restructure
   * @param {Object} context - Context information
   * @returns {Object} - CBA formatted response
   */
  static restructureResponse(response, context) {
    // Extract content from various possible fields
    const content = response.content || response.text || response.answer || response.response || '';

    if (typeof content === 'string') {
      return this.parseAndStructureText(content, context);
    }

    // If content is an object, try to extract sections
    if (typeof content === 'object') {
      return {
        introduction: content.introduction || content.intro || content.overview || 'This topic covers important concepts.',
        elaboration: content.elaboration || content.explanation || content.details || content,
        conclusion: content.conclusion || content.summary || content.application || 'Understanding these concepts enables practical application.',
        competencies_addressed: content.competencies || context.competencies || [],
        references: content.references || []
      };
    }

    return this.parseAndStructureText(String(content), context);
  }

  /**
   * Ensure a section has meaningful content
   * @param {string} content - Section content
   * @param {string} sectionType - Type of section
   * @param {Object} context - Context information
   * @returns {string} - Validated content
   */
  static ensureSectionContent(content, sectionType, context) {
    if (!content || content.trim().length < 10) {
      return this.generateDefaultContent(sectionType, context);
    }
    return content.trim();
  }

  /**
   * Generate default content for a section
   * @param {string} sectionType - Type of section
   * @param {Object} context - Context information
   * @returns {string} - Default content
   */
  static generateDefaultContent(sectionType, context) {
    const { subject = 'this subject' } = context;

    switch (sectionType) {
      case 'introduction':
        return `This topic introduces fundamental concepts in ${subject} that are essential for understanding the subject matter.`;
      case 'elaboration':
        return `The detailed explanation covers the key principles, processes, and relationships within ${subject}. Understanding these elements is crucial for developing competency in the area.`;
      case 'conclusion':
        return `Mastering these concepts in ${subject} enables students to apply their knowledge in real-world situations and demonstrate practical skills aligned with curriculum standards.`;
      default:
        return 'This section provides important information related to the topic.';
    }
  }

  /**
   * Add CBA-specific introduction enhancements
   * @param {string} introduction - Current introduction
   * @param {Object} context - Context information
   * @returns {string} - Enhanced introduction
   */
  static addCBAIntroduction(introduction, context) {
    const { subject, grade_level, competencies = [] } = context;

    // Add CBA context if not already present
    if (!introduction.toLowerCase().includes('competenc')) {
      const cbaPrefix = competencies.length > 0
        ? `In alignment with Competency-Based Assessment standards, this response addresses key competencies in ${subject}. `
        : `Following Ugandan CBA curriculum guidelines for ${subject}, `;
      return cbaPrefix + introduction;
    }

    return introduction;
  }

  /**
   * Add CBA-specific conclusion enhancements
   * @param {string} conclusion - Current conclusion
   * @param {Object} context - Context information
   * @returns {string} - Enhanced conclusion
   */
  static addCBAConclusion(conclusion, context) {
    const { competencies = [] } = context;

    // Add application focus if not present
    if (!conclusion.toLowerCase().includes('appl')) {
      const applicationAddition = competencies.length > 0
        ? ` This understanding enables practical application of the assessed competencies in real-world contexts.`
        : ` This knowledge foundation supports the development of practical skills and competencies.`;
      return conclusion + applicationAddition;
    }

    return conclusion;
  }

  /**
   * Middleware function for Express
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Next middleware function
   */
  static middleware(req, res, next) {
    // Store original json method
    const originalJson = res.json;

    // Override json method to format responses
    res.json = function(data) {
      // Check if this is an AI response that needs CBA formatting
      if (data && data.success && data.data && data.data.content) {
        const context = {
          subject: req.body?.subject || req.query?.subject,
          grade_level: req.body?.grade_level || req.query?.grade_level,
          competencies: req.body?.competencies || req.query?.competencies || [],
          question_type: req.body?.question_type || req.query?.question_type
        };

        data.data.content = CBAResponseFormatter.formatResponse(data.data.content, context);
      }

      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  }
}

module.exports = CBAResponseFormatter;