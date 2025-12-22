const { run, get, all } = require('../config/database');

class Message {
  constructor(data) {
    this.id = data.id;
    this.chat_id = data.chat_id;
    this.role = data.role;
    this.content = data.content;
    this.tokens_used = data.tokens_used;
    this.created_at = data.created_at;
  }

  // Create a new message
  static async create(messageData) {
    const { chat_id, role, content, tokens_used } = messageData;

    const sql = `
      INSERT INTO messages (chat_id, role, content, tokens_used)
      VALUES (?, ?, ?, ?)
    `;

    const result = await run(sql, [chat_id, role, content, tokens_used]);
    return result.id;
  }

  // Find message by ID
  static async findById(id) {
    const sql = 'SELECT * FROM messages WHERE id = ?';
    const row = await get(sql, [id]);
    return row ? new Message(row) : null;
  }

  // Find messages by chat ID
  static async findByChatId(chatId, limit = 100, offset = 0) {
    const sql = 'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC LIMIT ? OFFSET ?';
    const rows = await all(sql, [chatId, limit, offset]);
    return rows.map(row => new Message(row));
  }

  // Update message
  async update(updates) {
    const fields = [];
    const values = [];

    if (updates.content !== undefined) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    if (updates.tokens_used !== undefined) {
      fields.push('tokens_used = ?');
      values.push(updates.tokens_used);
    }

    if (fields.length === 0) return;

    const sql = `UPDATE messages SET ${fields.join(', ')} WHERE id = ?`;
    values.push(this.id);

    await run(sql, values);

    // Refresh the object
    Object.assign(this, updates);
  }

  // Delete message
  async delete() {
    const sql = 'DELETE FROM messages WHERE id = ?';
    await run(sql, [this.id]);
  }

  // Get chat for this message
  async getChat() {
    const Chat = require('./Chat');
    return await Chat.findById(this.chat_id);
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      chat_id: this.chat_id,
      role: this.role,
      content: this.content,
      tokens_used: this.tokens_used,
      created_at: this.created_at
    };
  }
}

module.exports = Message;