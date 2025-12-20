const rateLimit = require('express-rate-limit');
const { logger } = require('./errorHandler');

// Create rate limiter for AI endpoints
const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs for AI endpoints
  message: {
    success: false,
    message: 'Too many AI requests, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    logger.warn('AI rate limit exceeded:', {
      ip: req.ip,
      url: req.url,
      user_id: req.body?.user_id
    });
    res.status(429).json({
      success: false,
      message: 'Too many AI requests, please try again later',
      error: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.url === '/health';
  }
});

// Stricter rate limit for question submission
const questionSubmissionLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 question submissions per 5 minutes
  message: {
    success: false,
    message: 'Too many question submissions, please wait before asking another question',
    error: 'QUESTION_SUBMISSION_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    logger.warn('Question submission rate limit exceeded:', {
      ip: req.ip,
      user_id: req.body?.user_id
    });
    res.status(429).json({
      success: false,
      message: 'Too many question submissions, please wait before asking another question',
      error: 'QUESTION_SUBMISSION_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// General API rate limit
const generalApiLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    error: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    logger.warn('General API rate limit exceeded:', {
      ip: req.ip,
      url: req.url
    });
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later',
      error: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// User-specific rate limit (requires user authentication)
const createUserRateLimit = (maxRequests, windowMs, endpointName) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    keyGenerator: (req) => {
      // Use user_id for rate limiting if available, otherwise fall back to IP
      return req.body?.user_id || req.query?.user_id || req.ip;
    },
    message: {
      success: false,
      message: `Too many ${endpointName} requests, please try again later`,
      error: 'USER_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      logger.warn(`${endpointName} user rate limit exceeded:`, {
        user_id: req.body?.user_id || req.query?.user_id,
        ip: req.ip,
        url: req.url
      });
      res.status(429).json({
        success: false,
        message: `Too many ${endpointName} requests, please try again later`,
        error: 'USER_RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  });
};

// Specific user rate limits
const userQuestionLimit = createUserRateLimit(20, 15 * 60 * 1000, 'question'); // 20 questions per 15 minutes per user
const userRegenerateLimit = createUserRateLimit(5, 10 * 60 * 1000, 'regenerate'); // 5 regenerations per 10 minutes per user

// Rate limit for image generation requests
const imageGenerationLimit = createUserRateLimit(10, 15 * 60 * 1000, 'image generation'); // 10 image generations per 15 minutes per user

module.exports = {
  aiRateLimit,
  questionSubmissionLimit,
  generalApiLimit,
  userQuestionLimit,
  userRegenerateLimit,
  imageGenerationLimit
};