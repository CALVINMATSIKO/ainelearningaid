const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const cacheService = require('./cacheService');

class ImageGenerationService {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.projectId = process.env.GOOGLE_PROJECT_ID;
    this.location = process.env.GOOGLE_LOCATION || 'us-central1';
    this.baseURL = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models/imagen-3.0-generate-001:predict`;
    this.model = 'imagen-3.0-generate-001';
    this.aspectRatio = '1:1'; // Default aspect ratio
    this.usageCount = 0; // Basic usage tracking for cost monitoring
  }

  /**
   * Generate an educational visual aid image using OpenAI DALL-E
   * @param {string} prompt - The tailored prompt for image generation
   * @param {string} subject - The subject for prompt engineering
   * @param {Object} options - Additional options for the request
   * @returns {Promise<Object>} - Response object with image URL and metadata
   */
  async generateImage(prompt, subject, options = {}) {
    if (!this.apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is not set');
    }

    const startTime = Date.now();

    try {
      // Check cost limit (example: max 10 images per session)
      if (this.usageCount >= 10) {
        throw new Error('Cost limit reached for this session');
      }

      // Validate prompt
      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        throw new Error('Invalid prompt: Prompt must be a non-empty string');
      }

      if (prompt.length > 4000) {
        throw new Error('Invalid prompt: Prompt exceeds maximum length of 4000 characters');
      }
      // Check for forbidden content
      const forbiddenWords = ['violence', 'violent', 'kill', 'murder', 'death', 'blood', 'gore', 'torture', 'abuse', 'explicit', 'sex', 'nude', 'naked', 'porn', 'erotic', 'adult', 'nsfw', 'hate', 'racist', 'racism', 'discrimination', 'slur', 'offensive', 'bigot'];
      const lowerPrompt = prompt.toLowerCase();
      if (forbiddenWords.some(word => lowerPrompt.includes(word))) {
        throw new Error('Prompt contains inappropriate content');
      }

      const hash = crypto.createHash('sha256').update(prompt + JSON.stringify(options)).digest('hex');
      const cachedFilename = cacheService.get(`image_${hash}`);
      if (cachedFilename) {
        return {
          imageUrl: `/api/images/uploads/${cachedFilename}`,
          revisedPrompt: null,
          processing_time: 0,
          model: options.model || this.model,
          size: options.aspectRatio || this.aspectRatio,
          success: true,
          usage_count: this.usageCount,
          cost_estimate: 0,
          cached: true
        };
      }

      const educationalPrompt = this.buildEducationalPrompt(subject, prompt);

      const requestBody = {
        instances: [{ prompt: educationalPrompt }],
        parameters: {
          aspectRatio: options.aspectRatio || this.aspectRatio,
          sampleCount: 1,
          personGeneration: 'allow_adult'
        }
      };

      const url = `${this.baseURL}?key=${this.apiKey}`;

      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 second timeout for image generation
      });

      const processingTime = Date.now() - startTime;
      this.usageCount++; // Increment usage counter

      const prediction = response.data.predictions[0];
      const base64Data = prediction.bytesBase64Encoded;
      const buffer = Buffer.from(base64Data, 'base64');

      const filename = `${hash}.jpg`;
      // Compress image
      try {
        const compressedBuffer = await sharp(buffer)
          .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();
        const filepath = path.join(__dirname, '../../uploads/images', filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, compressedBuffer);
        // Cache the filename
        cacheService.set(`image_${hash}`, filename, 24 * 60 * 60 * 1000);
      } catch (storageError) {
        console.error('Image storage error:', storageError);
        throw new Error('Failed to store image');
      }

      return {
        imageUrl: `/api/images/uploads/${filename}`,
        revisedPrompt: null, // Imagen doesn't provide revised prompt
        processing_time: processingTime,
        model: this.model,
        size: requestBody.parameters.aspectRatio,
        success: true,
        usage_count: this.usageCount,
        cost_estimate: this.estimateCost(requestBody.parameters.aspectRatio), // Basic cost estimation
      };

    } catch (error) {
      console.error('Image generation service error:', error);

      // Handle different types of errors
      if (error.response) {
        // API error response
        const status = error.response.status;
        const message = error.response.data?.error?.message || 'API request failed';

        if (status === 401 || status === 403) {
          throw new Error('Invalid Google API key or insufficient permissions');
        } else if (status === 429) {
          throw new Error('Google API rate limit exceeded. Please try again later.');
        } else if (status === 400) {
          throw new Error(`Bad request: ${message}`);
        } else {
          throw new Error(`Google API error (${status}): ${message}`);
        }
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error('Unable to connect to Google API. Please check your internet connection.');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Google API request timed out. Image generation may take longer than expected.');
      } else {
        throw new Error(`Image generation error: ${error.message}`);
      }
    }
  }

  /**
   * Build an educational prompt to ensure appropriate content
   * @param {string} subject - The subject for tailored prompt engineering
   * @param {string} userPrompt - The user's prompt
   * @returns {string} - Enhanced educational prompt
   */
  buildEducationalPrompt(subject, userPrompt) {
    const prefixes = {
      'science': "Create a clear, accurate diagram showing ",
      'history': "Generate a chronological timeline illustrating ",
      'chemistry': "Draw a precise molecular structure of ",
      'biology': "Illustrate a biological process or structure for ",
      'mathematics': "Create a visual representation or graph for ",
      'geography': "Generate a map or geographical illustration of ",
      default: "Create an educational visual aid for "
    };

    const prefix = prefixes[subject] || prefixes.default;
    const cbaInstructions = "emphasizing key competencies, learning outcomes, and conceptual understanding suitable for students. Use clear, simple visuals with labels and avoid complex text.";

    return `${prefix}${userPrompt}. ${cbaInstructions}`;
  }

  /**
   * Estimate cost based on size and quality (basic implementation)
   * @param {string} size - Image size
   * @param {string} quality - Image quality
   * @returns {number} - Estimated cost in USD
   */
  estimateCost(aspectRatio) {
    // Imagen pricing (as of 2024) - approximately $0.04 per image
    return 0.04;
  }

  /**
   * Get current usage statistics
   * @returns {Object} - Usage statistics
   */
  getUsageStats() {
    return {
      total_requests: this.usageCount,
      estimated_total_cost: this.usageCount * 0.04, // Rough estimate
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check if the service is available
   * @returns {Promise<boolean>} - Service availability
   */
  async isAvailable() {
    try {
      // Simple test request (this will consume credits, so use sparingly)
      await this.generateImage('Test educational image: a simple diagram of a cell', { size: '256x256' });
      return true;
    } catch (error) {
      console.error('Image generation service availability check failed:', error.message);
      return false;
    }
  }

  /**
   * Get service health status
   * @returns {Promise<Object>} - Health status information
   */
  async getHealthStatus() {
    const available = await this.isAvailable();

    return {
      service: 'Google Imagen Image Generation',
      available,
      model: this.model,
      default_aspect_ratio: this.aspectRatio,
      usage_stats: this.getUsageStats(),
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new ImageGenerationService();