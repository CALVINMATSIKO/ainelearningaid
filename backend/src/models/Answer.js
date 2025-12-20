const { run, get, all } = require('../config/database');

class Answer {
  constructor(data) {
    this.id = data.id;
    this.question_id = data.question_id;
    this.user_id = data.user_id;
    this.content = data.content ? JSON.parse(data.content) : {};
    this.tokens_used = data.tokens_used;
    this.processing_time = data.processing_time;
    this.created_at = data.created_at;
  }

  // Create a new answer
  static async create(answerData) {
    const { question_id, user_id, content, tokens_used, processing_time } = answerData;

    const contentJson = JSON.stringify(content || {});

    const sql = `
      INSERT INTO answers (question_id, user_id, content, tokens_used, processing_time)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await run(sql, [question_id, user_id, contentJson, tokens_used, processing_time]);
    return result.id;
  }

  // Find answer by ID
  static async findById(id) {
    const sql = 'SELECT * FROM answers WHERE id = ?';
    const row = await get(sql, [id]);
    return row ? new Answer(row) : null;
  }

  // Find answers by question ID
  static async findByQuestionId(questionId) {
    const sql = 'SELECT * FROM answers WHERE question_id = ? ORDER BY created_at DESC';
    const rows = await all(sql, [questionId]);
    return rows.map(row => new Answer(row));
  }

  // Find answers by user ID
  static async findByUserId(userId, limit = 50, offset = 0) {
    const sql = 'SELECT * FROM answers WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const rows = await all(sql, [userId, limit, offset]);
    return rows.map(row => new Answer(row));
  }

  // Get the latest answer for a question
  static async getLatestForQuestion(questionId) {
    const sql = 'SELECT * FROM answers WHERE question_id = ? ORDER BY created_at DESC LIMIT 1';
    const row = await get(sql, [questionId]);
    return row ? new Answer(row) : null;
  }

  // Update answer
  async update(updates) {
    const fields = [];
    const values = [];

    if (updates.content) {
      fields.push('content = ?');
      values.push(JSON.stringify(updates.content));
    }
    if (updates.tokens_used !== undefined) {
      fields.push('tokens_used = ?');
      values.push(updates.tokens_used);
    }
    if (updates.processing_time !== undefined) {
      fields.push('processing_time = ?');
      values.push(updates.processing_time);
    }

    if (fields.length === 0) return;

    const sql = `UPDATE answers SET ${fields.join(', ')} WHERE id = ?`;
    values.push(this.id);

    await run(sql, values);

    // Refresh the object
    Object.assign(this, updates);
  }

  // Delete answer
  async delete() {
    const sql = 'DELETE FROM answers WHERE id = ?';
    await run(sql, [this.id]);
  }

  // Get the associated question
  async getQuestion() {
    const Question = require('./Question');
    return await Question.findById(this.question_id);
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      question_id: this.question_id,
      user_id: this.user_id,
      content: this.content,
      tokens_used: this.tokens_used,
      processing_time: this.processing_time,
      created_at: this.created_at
    };
  }
}

module.exports = Answer;