const { run, all } = require('../config/database');

class AnalyticsEvent {
  constructor(data) {
    this.id = data.id;
    this.session_id = data.session_id;
    this.user_id = data.user_id;
    this.event_type = data.event_type;
    this.event_data = data.event_data ? JSON.parse(data.event_data) : {};
    this.timestamp = data.timestamp;
  }

  // Create a new event
  static async create(eventData) {
    const { session_id, user_id, event_type, event_data } = eventData;

    const eventDataJson = JSON.stringify(event_data || {});

    const sql = `
      INSERT INTO analytics_events (session_id, user_id, event_type, event_data)
      VALUES (?, ?, ?, ?)
    `;

    const result = await run(sql, [session_id, user_id, event_type, eventDataJson]);
    return result.id;
  }

  // Find events by session
  static async findBySession(session_id, limit = 100) {
    const sql = 'SELECT * FROM analytics_events WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?';
    const rows = await all(sql, [session_id, limit]);
    return rows.map(row => new AnalyticsEvent(row));
  }

  // Find events by user
  static async findByUser(user_id, limit = 100) {
    const sql = 'SELECT * FROM analytics_events WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?';
    const rows = await all(sql, [user_id, limit]);
    return rows.map(row => new AnalyticsEvent(row));
  }

  // Get event counts by type
  static async getEventCounts() {
    const sql = 'SELECT event_type, COUNT(*) as count FROM analytics_events GROUP BY event_type';
    const rows = await all(sql, []);
    return rows.reduce((acc, row) => {
      acc[row.event_type] = parseInt(row.count);
      return acc;
    }, {});
  }

  // Get subject popularity
  static async getSubjectPopularity() {
    const sql = `
      SELECT event_data->>'$.subject' as subject, COUNT(*) as count
      FROM analytics_events
      WHERE event_type = 'question_asked' AND event_data->>'$.subject' IS NOT NULL
      GROUP BY event_data->>'$.subject'
      ORDER BY count DESC
    `;
    const rows = await all(sql, []);
    return rows.map(row => ({ subject: row.subject, count: parseInt(row.count) }));
  }

  // Get usage by country
  static async getUsageByCountry() {
    const sql = `
      SELECT s.country, COUNT(e.id) as count
      FROM analytics_events e
      JOIN user_sessions s ON e.session_id = s.session_id
      WHERE s.country IS NOT NULL
      GROUP BY s.country
      ORDER BY count DESC
    `;
    const rows = await all(sql, []);
    return rows.map(row => ({ country: row.country, count: parseInt(row.count) }));
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      session_id: this.session_id,
      user_id: this.user_id,
      event_type: this.event_type,
      event_data: this.event_data,
      timestamp: this.timestamp
    };
  }
}

module.exports = AnalyticsEvent;