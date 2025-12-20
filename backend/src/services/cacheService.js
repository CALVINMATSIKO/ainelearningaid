// Simple in-memory cache for performance optimization
// In production, consider using Redis or similar

class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Set a value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any} - Cached value or null if not found/expired
   */
  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Delete a value from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache stats
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, item] of this.cache) {
      if (now > item.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      hitRate: this.hitRate || 0
    };
  }

  /**
   * Clean expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Generate cache key for AI responses
   * @param {string} question - The question
   * @param {Object} context - Context information
   * @returns {string} - Cache key
   */
  generateAIResponseKey(question, context = {}) {
    const { subject, grade_level, competencies } = context;
    const keyData = {
      question: question.toLowerCase().trim(),
      subject: subject || '',
      grade_level: grade_level || '',
      competencies: competencies ? competencies.sort().join(',') : ''
    };

    return `ai_response_${JSON.stringify(keyData)}`;
  }

  /**
   * Cache AI response
   * @param {string} question - The question
   * @param {Object} context - Context information
   * @param {Object} response - AI response
   */
  cacheAIResponse(question, context, response) {
    const key = this.generateAIResponseKey(question, context);
    // Cache for 1 hour for AI responses
    this.set(key, response, 60 * 60 * 1000);
  }

  /**
   * Get cached AI response
   * @param {string} question - The question
   * @param {Object} context - Context information
   * @returns {Object|null} - Cached response or null
   */
  getCachedAIResponse(question, context) {
    const key = this.generateAIResponseKey(question, context);
    return this.get(key);
  }

  /**
   * Generate cache key for question analysis
   * @param {string} question - The question
   * @returns {string} - Cache key
   */
  generateAnalysisKey(question) {
    return `analysis_${question.toLowerCase().trim()}`;
  }

  /**
   * Cache question analysis
   * @param {string} question - The question
   * @param {Object} analysis - Analysis result
   */
  cacheAnalysis(question, analysis) {
    const key = this.generateAnalysisKey(question);
    // Cache analysis for 24 hours
    this.set(key, analysis, 24 * 60 * 60 * 1000);
  }

  /**
   * Get cached question analysis
   * @param {string} question - The question
   * @returns {Object|null} - Cached analysis or null
   */
  getCachedAnalysis(question) {
    const key = this.generateAnalysisKey(question);
    return this.get(key);
  }

  /**
   * Generate cache key for subject templates
   * @param {string} subject - Subject name
   * @param {string} gradeLevel - Grade level
   * @returns {string} - Cache key
   */
  generateSubjectTemplateKey(subject, gradeLevel) {
    return `subject_template_${subject}_${gradeLevel}`;
  }

  /**
   * Cache subject template
   * @param {string} subject - Subject name
   * @param {string} gradeLevel - Grade level
   * @param {Object} template - Subject template
   */
  cacheSubjectTemplate(subject, gradeLevel, template) {
    const key = this.generateSubjectTemplateKey(subject, gradeLevel);
    // Cache templates for 7 days
    this.set(key, template, 7 * 24 * 60 * 60 * 1000);
  }

  /**
   * Get cached subject template
   * @param {string} subject - Subject name
   * @param {string} gradeLevel - Grade level
   * @returns {Object|null} - Cached template or null
   */
  getCachedSubjectTemplate(subject, gradeLevel) {
    const key = this.generateSubjectTemplateKey(subject, gradeLevel);
    return this.get(key);
  }

  /**
   * Generate cache key for subject metadata
   * @param {string} subject - Subject name
   * @returns {string} - Cache key
   */
  generateSubjectMetadataKey(subject) {
    return `subject_metadata_${subject}`;
  }

  /**
   * Cache subject metadata
   * @param {string} subject - Subject name
   * @param {Object} metadata - Subject metadata
   */
  cacheSubjectMetadata(subject, metadata) {
    const key = this.generateSubjectMetadataKey(subject);
    // Cache metadata for 30 days
    this.set(key, metadata, 30 * 24 * 60 * 60 * 1000);
  }

  /**
   * Get cached subject metadata
   * @param {string} subject - Subject name
   * @returns {Object|null} - Cached metadata or null
   */
  getCachedSubjectMetadata(subject) {
    const key = this.generateSubjectMetadataKey(subject);
    return this.get(key);
  }

  /**
   * Generate cache key for subject-specific response patterns
   * @param {string} subject - Subject name
   * @param {string} questionType - Question type
   * @param {string} gradeLevel - Grade level
   * @returns {string} - Cache key
   */
  generateSubjectResponsePatternKey(subject, questionType, gradeLevel) {
    return `response_pattern_${subject}_${questionType}_${gradeLevel}`;
  }

  /**
   * Cache subject-specific response pattern
   * @param {string} subject - Subject name
   * @param {string} questionType - Question type
   * @param {string} gradeLevel - Grade level
   * @param {Object} pattern - Response pattern
   */
  cacheSubjectResponsePattern(subject, questionType, gradeLevel, pattern) {
    const key = this.generateSubjectResponsePatternKey(subject, questionType, gradeLevel);
    // Cache patterns for 24 hours
    this.set(key, pattern, 24 * 60 * 60 * 1000);
  }

  /**
   * Get cached subject-specific response pattern
   * @param {string} subject - Subject name
   * @param {string} questionType - Question type
   * @param {string} gradeLevel - Grade level
   * @returns {Object|null} - Cached pattern or null
   */
  getCachedSubjectResponsePattern(subject, questionType, gradeLevel) {
    const key = this.generateSubjectResponsePatternKey(subject, questionType, gradeLevel);
    return this.get(key);
  }

  /**
   * Clear subject-specific cache
   * @param {string} subject - Subject name (optional, clears all if not provided)
   */
  clearSubjectCache(subject = null) {
    if (subject) {
      // Clear cache for specific subject
      const subjectKeys = [];
      for (const key of this.cache.keys()) {
        if (key.includes(`_${subject}_`) || key.includes(`_${subject}$`)) {
          subjectKeys.push(key);
        }
      }
      subjectKeys.forEach(key => this.cache.delete(key));
    } else {
      // Clear all subject-related cache
      const keysToDelete = [];
      for (const key of this.cache.keys()) {
        if (key.startsWith('subject_') || key.startsWith('response_pattern_')) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => this.cache.delete(key));
    }
  }

  /**
   * Get subject-specific cache statistics
   * @returns {Object} - Subject cache stats
   */
  getSubjectCacheStats() {
    const now = Date.now();
    let templateEntries = 0;
    let metadataEntries = 0;
    let patternEntries = 0;
    let expiredEntries = 0;

    for (const [key, item] of this.cache) {
      if (now > item.expiresAt) {
        expiredEntries++;
        continue;
      }

      if (key.startsWith('subject_template_')) {
        templateEntries++;
      } else if (key.startsWith('subject_metadata_')) {
        metadataEntries++;
      } else if (key.startsWith('response_pattern_')) {
        patternEntries++;
      }
    }

    return {
      templateEntries,
      metadataEntries,
      patternEntries,
      expiredEntries,
      totalSubjectEntries: templateEntries + metadataEntries + patternEntries
    };
  }
}

// Periodic cleanup
setInterval(() => {
  cacheService.cleanup();
}, 30 * 60 * 1000); // Clean every 30 minutes

const cacheService = new CacheService();

module.exports = cacheService;