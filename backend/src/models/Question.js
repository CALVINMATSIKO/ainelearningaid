const { run, get, all } = require('../config/database');

class Question {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.subject = data.subject;
    this.question_type = data.question_type;
    this.content = data.content;
    this.grade_level = data.grade_level;
    this.competencies = data.competencies ? JSON.parse(data.competencies) : [];
    this.context = data.context;
    this.created_at = data.created_at;
  }

  // Create a new question
  static async create(questionData) {
    const { user_id, subject, question_type, content, grade_level, competencies, context } = questionData;

    const competenciesJson = JSON.stringify(competencies || []);

    const sql = `
      INSERT INTO questions (user_id, subject, question_type, content, grade_level, competencies, context)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await run(sql, [user_id, subject, question_type, content, grade_level, competenciesJson, context]);
    return result.id;
  }

  // Find question by ID
  static async findById(id) {
    const sql = 'SELECT * FROM questions WHERE id = ?';
    const row = await get(sql, [id]);
    return row ? new Question(row) : null;
  }

  // Find questions by user ID
  static async findByUserId(userId, limit = 50, offset = 0) {
    const sql = 'SELECT * FROM questions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const rows = await all(sql, [userId, limit, offset]);
    return rows.map(row => new Question(row));
  }

  // Find questions by subject
  static async findBySubject(subject, limit = 50, offset = 0) {
    const sql = 'SELECT * FROM questions WHERE subject = ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const rows = await all(sql, [subject, limit, offset]);
    return rows.map(row => new Question(row));
  }

  // Search questions by content
  static async search(query, limit = 50, offset = 0) {
    const sql = 'SELECT * FROM questions WHERE content LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const rows = await all(sql, [`%${query}%`, limit, offset]);
    return rows.map(row => new Question(row));
  }

  // Update question
  async update(updates) {
    const fields = [];
    const values = [];

    if (updates.subject) {
      fields.push('subject = ?');
      values.push(updates.subject);
    }
    if (updates.question_type) {
      fields.push('question_type = ?');
      values.push(updates.question_type);
    }
    if (updates.content) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    if (updates.grade_level) {
      fields.push('grade_level = ?');
      values.push(updates.grade_level);
    }
    if (updates.competencies) {
      fields.push('competencies = ?');
      values.push(JSON.stringify(updates.competencies));
    }
    if (updates.context !== undefined) {
      fields.push('context = ?');
      values.push(updates.context);
    }

    if (fields.length === 0) return;

    const sql = `UPDATE questions SET ${fields.join(', ')} WHERE id = ?`;
    values.push(this.id);

    await run(sql, values);

    // Refresh the object
    Object.assign(this, updates);
  }

  // Delete question
  async delete() {
    const sql = 'DELETE FROM questions WHERE id = ?';
    await run(sql, [this.id]);
  }

  // Get answers for this question
  async getAnswers() {
    const Answer = require('./Answer');
    return await Answer.findByQuestionId(this.id);
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      subject: this.subject,
      question_type: this.question_type,
      content: this.content,
      grade_level: this.grade_level,
      competencies: this.competencies,
      context: this.context,
      created_at: this.created_at
    };
  }
}

module.exports = Question;