const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    this.model = 'llama3-8b-8192'; // Meta Llama 3.1 8B - fast and capable model
    this.maxTokens = 2048;
    this.temperature = 0.7;
  }

  /**
   * Generate a response using Groq AI
   * @param {string} prompt - The prompt to send to the AI
   * @param {Object} options - Additional options for the request
   * @returns {Promise<Object>} - Response object with content and metadata
   */
  async generateResponse(prompt, options = {}) {
    const startTime = Date.now();

    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational assistant for Ugandan Competency-Based Assessment (CBA) curriculum. Provide clear, structured responses aligned with UNEB standards.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: options.model || this.model,
        temperature: options.temperature || this.temperature,
        max_tokens: options.maxTokens || this.maxTokens,
        top_p: 1,
        stream: false,
      });

      const processingTime = Date.now() - startTime;
      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No response generated from Groq AI');
      }

      return {
        content: response,
        tokens_used: completion.usage?.total_tokens || 0,
        processing_time: processingTime,
        model: completion.model,
        success: true
      };

    } catch (error) {
      console.error('Groq AI service error:', error);

      // Handle different types of errors
      if (error.response) {
        // API error response
        const status = error.response.status;
        const message = error.response.data?.error?.message || 'API request failed';

        if (status === 401) {
          throw new Error('Invalid API key provided');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status === 400) {
          throw new Error(`Bad request: ${message}`);
        } else {
          throw new Error(`API error (${status}): ${message}`);
        }
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error('Unable to connect to Groq API. Please check your internet connection.');
      } else {
        throw new Error(`AI service error: ${error.message}`);
      }
    }
  }

  /**
   * Generate a chat response using Groq AI with conversation history
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Additional options for the request
   * @returns {Promise<Object>} - Response object with content and metadata
   */
  async generateChatResponse(messages, options = {}) {
    const startTime = Date.now();

    try {
      // Prepare messages with system prompt
      const systemMessage = {
        role: 'system',
        content: 'You are an expert educational assistant for Ugandan Competency-Based Assessment (CBA) curriculum. Provide clear, structured responses aligned with UNEB standards. Engage in natural conversation while maintaining educational value.'
      };

      const chatMessages = [systemMessage, ...messages];

      const completion = await this.client.chat.completions.create({
        messages: chatMessages,
        model: options.model || this.model,
        temperature: options.temperature || this.temperature,
        max_tokens: options.maxTokens || this.maxTokens,
        top_p: 1,
        stream: false,
      });

      const processingTime = Date.now() - startTime;
      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No response generated from Groq AI');
      }

      return {
        content: response,
        tokens_used: completion.usage?.total_tokens || 0,
        processing_time: processingTime,
        model: completion.model,
        success: true
      };

    } catch (error) {
      console.error('Groq AI chat service error:', error);

      // Handle different types of errors
      if (error.response) {
        // API error response
        const status = error.response.status;
        const message = error.response.data?.error?.message || 'API request failed';

        if (status === 401) {
          throw new Error('Invalid API key provided');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status === 400) {
          throw new Error(`Bad request: ${message}`);
        } else {
          throw new Error(`API error (${status}): ${message}`);
        }
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new Error('Unable to connect to Groq API. Please check your internet connection.');
      } else {
        throw new Error(`AI service error: ${error.message}`);
      }
    }
  }

  /**
   * Generate a CBA-structured response
   * @param {string} question - The student's question
   * @param {Object} context - Context including subject, grade level, competencies
   * @returns {Promise<Object>} - Structured CBA response
   */
  async generateCBAResponse(question, context = {}) {
    const { subject, grade_level, competencies, question_type } = context;

    // Build a structured prompt for CBA compliance
    const prompt = this.buildCBAPrompt(question, {
      subject: subject || 'General',
      grade_level: grade_level || 'Secondary',
      competencies: competencies || [],
      question_type: question_type || 'general'
    });

    const result = await this.generateResponse(prompt);

    // Parse and structure the response
    const structuredResponse = this.parseCBAResponse(result.content);

    return {
      ...result,
      content: structuredResponse
    };
  }

  /**
   * Build a CBA-compliant prompt
   * @param {string} question - The question
   * @param {Object} context - Context information
   * @returns {string} - Formatted prompt
   */
  buildCBAPrompt(question, context) {
    const { subject, grade_level, competencies, question_type } = context;

    return `As an expert educator following Ugandan Competency-Based Assessment (CBA) standards, please answer the following question in a structured format:

SUBJECT: ${subject}
GRADE LEVEL: ${grade_level}
QUESTION TYPE: ${question_type}
COMPETENCIES TO ADDRESS: ${competencies.join(', ') || 'General knowledge and understanding'}

QUESTION: ${question}

Please structure your response in the CBA format:
1. INTRODUCTION: Provide context and state the main concept
2. ELABORATION: Explain in detail with examples and step-by-step reasoning
3. CONCLUSION: Summarize key points and relate to real-world application

Ensure the response aligns with UNEB standards and emphasizes skill application rather than memorization.`;
  }

  /**
   * Parse AI response into CBA structure
   * @param {string} response - Raw AI response
   * @returns {Object} - Structured CBA response
   */
  parseCBAResponse(response) {
    // Split response by sections
    const sections = response.split(/\d+\.\s*(INTRODUCTION|ELABORATION|CONCLUSION):?/i);

    let introduction = '';
    let elaboration = '';
    let conclusion = '';

    for (let i = 1; i < sections.length; i += 2) {
      const sectionType = sections[i].toLowerCase();
      const content = sections[i + 1]?.trim() || '';

      if (sectionType.includes('introduction')) {
        introduction = content;
      } else if (sectionType.includes('elaboration')) {
        elaboration = content;
      } else if (sectionType.includes('conclusion')) {
        conclusion = content;
      }
    }

    // If parsing failed, use the whole response as elaboration
    if (!introduction && !elaboration && !conclusion) {
      elaboration = response;
    }

    return {
      introduction: introduction || 'This topic covers fundamental concepts in the subject area.',
      elaboration: elaboration || response,
      conclusion: conclusion || 'Understanding these concepts will help you apply knowledge in real-world situations.',
      competencies_addressed: [], // Will be filled by analysis service
      references: []
    };
  }

  /**
   * Check if the service is available
   * @returns {Promise<boolean>} - Service availability
   */
  async isAvailable() {
    try {
      // Simple test prompt
      await this.generateResponse('Hello', { maxTokens: 10 });
      return true;
    } catch (error) {
      console.error('Groq service availability check failed:', error.message);
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
      service: 'Groq AI',
      available,
      model: this.model,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new GroqService();