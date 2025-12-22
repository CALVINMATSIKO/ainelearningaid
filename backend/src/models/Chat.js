const { run, get, all } = require('../config/database');

class Chat {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.session_id = data.session_id;
    this.title = data.title;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new chat
  static async create(chatData) {
    const { user_id, session_id, title } = chatData;

    const sql = `
      INSERT INTO chats (user_id, session_id, title)
      VALUES (?, ?, ?)
    `;

    const result = await run(sql, [user_id, session_id, title]);
    return result.id;
  }

  // Find chat by ID
  static async findById(id) {
    const sql = 'SELECT * FROM chats WHERE id = ?';
    const row = await get(sql, [id]);
    return row ? new Chat(row) : null;
  }

  // Find chats by user ID
  static async findByUserId(userId, limit = 50, offset = 0) {
    const sql = 'SELECT * FROM chats WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    const rows = await all(sql, [userId, limit, offset]);
    return rows.map(row => new Chat(row));
  }

  // Find chats by session ID
  static async findBySessionId(sessionId, limit = 50, offset = 0) {
    const sql = 'SELECT * FROM chats WHERE session_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    const rows = await all(sql, [sessionId, limit, offset]);
    return rows.map(row => new Chat(row));
  }

  // Update chat
  async update(updates) {
    const fields = [];
    const values = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }

    if (fields.length === 0) return;

    const sql = `UPDATE chats SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    values.push(this.id);

    await run(sql, values);

    // Refresh the object
    Object.assign(this, updates);
  }

  // Delete chat
  async delete() {
    const sql = 'DELETE FROM chats WHERE id = ?';
    await run(sql, [this.id]);
  }

  // Get messages for this chat
  async getMessages(limit = 100, offset = 0) {
    const Message = require('./Message');
    return await Message.findByChatId(this.id, limit, offset);
  }

  // Add a message to this chat
  async addMessage(messageData) {
    const Message = require('./Message');
    const messageId = await Message.create({ ...messageData, chat_id: this.id });

    // Update chat's updated_at
    await run('UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [this.id]);

    return messageId;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      session_id: this.session_id,
      title: this.title,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Chat;