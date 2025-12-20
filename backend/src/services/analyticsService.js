const UserSession = require('../models/UserSession');
const AnalyticsEvent = require('../models/AnalyticsEvent');

class AnalyticsService {
  // Track an event
  static async trackEvent(session_id, user_id, event_type, event_data = {}) {
    try {
      // Ensure session exists
      const session = await UserSession.getOrCreate(session_id, user_id);

      // Create event
      await AnalyticsEvent.create({
        session_id,
        user_id,
        event_type,
        event_data
      });

      return true;
    } catch (error) {
      console.error('Error tracking event:', error);
      return false;
    }
  }

  // Track question asked
  static async trackQuestionAsked(session_id, user_id, questionData) {
    const event_data = {
      subject: questionData.subject,
      question_type: questionData.question_type,
      grade_level: questionData.grade_level,
      competencies: questionData.competencies
    };
    return await this.trackEvent(session_id, user_id, 'question_asked', event_data);
  }

  // Track answer generated
  static async trackAnswerGenerated(session_id, user_id, answerData) {
    const event_data = {
      tokens_used: answerData.tokens_used,
      processing_time: answerData.processing_time,
      subject: answerData.subject
    };
    return await this.trackEvent(session_id, user_id, 'answer_generated', event_data);
  }

  // Track subject selected
  static async trackSubjectSelected(session_id, user_id, subject) {
    return await this.trackEvent(session_id, user_id, 'subject_selected', { subject });
  }

  // Track user registration
  static async trackUserRegistered(session_id, user_id) {
    return await this.trackEvent(session_id, user_id, 'user_registered', {});
  }

  // Track user login
  static async trackUserLogin(session_id, user_id) {
    return await this.trackEvent(session_id, user_id, 'user_login', {});
  }

  // Get analytics summary
  static async getAnalyticsSummary() {
    try {
      const eventCounts = await AnalyticsEvent.getEventCounts();
      const subjectPopularity = await AnalyticsEvent.getSubjectPopularity();
      const usageByCountry = await AnalyticsEvent.getUsageByCountry();

      return {
        total_events: Object.values(eventCounts).reduce((a, b) => a + b, 0),
        event_counts: eventCounts,
        subject_popularity: subjectPopularity,
        usage_by_country: usageByCountry
      };
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      return null;
    }
  }

  // Get session analytics
  static async getSessionAnalytics(session_id) {
    try {
      const events = await AnalyticsEvent.findBySession(session_id);
      return {
        session_id,
        event_count: events.length,
        events: events.map(e => e.toJSON())
      };
    } catch (error) {
      console.error('Error getting session analytics:', error);
      return null;
    }
  }

  // Get user analytics
  static async getUserAnalytics(user_id) {
    try {
      const events = await AnalyticsEvent.findByUser(user_id);
      return {
        user_id,
        event_count: events.length,
        events: events.map(e => e.toJSON())
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  }

  // Middleware to track requests
  static trackRequest(event_type) {
    return async (req, res, next) => {
      // Get session_id from header or generate one
      let session_id = req.headers['x-session-id'];
      if (!session_id) {
        session_id = this.generateSessionId();
        res.setHeader('x-session-id', session_id);
      }

      const user_id = req.user ? req.user.id : null;

      // Track the event
      await this.trackEvent(session_id, user_id, event_type, {
        path: req.path,
        method: req.method,
        user_agent: req.get('User-Agent'),
        ip: req.ip
      });

      next();
    };
  }

  // Generate a simple session ID
  static generateSessionId() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get country from IP (simplified, in real app use geoip)
  static getCountryFromIP(ip) {
    // For Uganda focus, assume most are from Uganda
    // In production, use a geoip service
    return 'UG';
  }
}

module.exports = AnalyticsService;