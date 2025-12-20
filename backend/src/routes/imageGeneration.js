const express = require('express');
const router = express.Router();
const imageGenerationService = require('../services/imageGenerationService');

/**
 * POST /api/images/generate
 * Generate an educational visual aid image
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, subject, options } = req.body;

    // Validate required fields
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Prompt is required',
        error: 'MISSING_PROMPT'
      });
    }

    if (prompt.length > 4000) {
      return res.status(400).json({
        success: false,
        message: 'Prompt exceeds maximum length of 4000 characters',
        error: 'PROMPT_TOO_LONG'
      });
    }

    // Generate image
    const result = await imageGenerationService.generateImage(prompt, subject, options || {});

    // Return response
    res.json({
      success: true,
      data: {
        imageUrl: result.imageUrl,
        revisedPrompt: result.revisedPrompt,
        processingTime: result.processing_time,
        model: result.model,
        size: result.size,
        costEstimate: result.cost_estimate,
        usageCount: result.usage_count,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in /generate endpoint:', error);

    // Handle specific service errors
    if (error.message.includes('Invalid prompt')) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: 'INVALID_PROMPT'
      });
    }

    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: 'Image generation service configuration error',
        error: 'SERVICE_CONFIG_ERROR'
      });
    }

    if (error.message.includes('rate limit')) {
      return res.status(429).json({
        success: false,
        message: 'Image generation rate limit exceeded',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }

    if (error.message.includes('Cost limit reached')) {
      return res.status(429).json({
        success: false,
        message: 'Cost limit reached for this session',
        error: 'COST_LIMIT_EXCEEDED'
      });
    }

    // Generic error
    res.status(500).json({
      success: false,
      message: 'Failed to generate image',
      error: 'IMAGE_GENERATION_ERROR',
      details: error.message
    });
  }
});

module.exports = router;