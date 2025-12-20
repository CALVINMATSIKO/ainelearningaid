const { run, get, all } = require('../config/database');

class UserSession {
  constructor(data) {
    this.id = data.id;
    this.session_id = data.session_id;
    this.user_id = data.user_id;
    this.ip_address = data.ip_address;
    this.user_agent = data.user_agent;
    this.country = data.country;
    this.started_at = data.started_at;
    this.last_activity = data.last_activity;
  }

  // Create a new session
  static async create(sessionData) {
    const { session_id, user_id, ip_address, user_agent, country } = sessionData;

    const sql = `
      INSERT INTO user_sessions (session_id, user_id, ip_address, user_agent, country)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await run(sql, [session_id, user_id, ip_address, user_agent, country]);
    return result.id;
  }

  // Find session by session_id
  static async findBySessionId(session_id) {
    const sql = 'SELECT * FROM user_sessions WHERE session_id = ?';
    const row = await get(sql, [session_id]);
    return row ? new UserSession(row) : null;
  }

  // Update last activity
  async updateActivity() {
    const sql = 'UPDATE user_sessions SET last_activity = CURRENT_TIMESTAMP WHERE id = ?';
    await run(sql, [this.id]);
  }

  // Get or create session
  static async getOrCreate(session_id, user_id = null, ip_address = null, user_agent = null, country = null) {
    let session = await this.findBySessionId(session_id);
    if (!session) {
      const id = await this.create({ session_id, user_id, ip_address, user_agent, country });
      session = await this.findById(id);
    } else {
      // Update user_id if logging in
      if (user_id && !session.user_id) {
        await session.updateUserId(user_id);
      }
      await session.updateActivity();
    }
    return session;
  }

  // Update user_id (when user logs in)
  async updateUserId(user_id) {
    const sql = 'UPDATE user_sessions SET user_id = ? WHERE id = ?';
    await run(sql, [user_id, this.id]);
    this.user_id = user_id;
  }

  // Find session by ID
  static async findById(id) {
    const sql = 'SELECT * FROM user_sessions WHERE id = ?';
    const row = await get(sql, [id]);
    return row ? new UserSession(row) : null;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      session_id: this.session_id,
      user_id: this.user_id,
      country: this.country,
      started_at: this.started_at,
      last_activity: this.last_activity
    };
  }
}

module.exports = UserSession;