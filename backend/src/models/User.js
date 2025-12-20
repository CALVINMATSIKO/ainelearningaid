const { run, get, all } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.full_name = data.full_name;
    this.grade_level = data.grade_level;
    this.subjects = data.subjects ? JSON.parse(data.subjects) : [];
    this.preferences = data.preferences ? JSON.parse(data.preferences) : {};
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const { email, password, full_name, grade_level, subjects, preferences } = userData;

    const password_hash = await bcrypt.hash(password, 10);
    const subjectsJson = JSON.stringify(subjects || []);
    const preferencesJson = JSON.stringify(preferences || {});

    const sql = `
      INSERT INTO users (email, password_hash, full_name, grade_level, subjects, preferences)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await run(sql, [email, password_hash, full_name, grade_level, subjectsJson, preferencesJson]);
    return result.id;
  }

  // Find user by ID
  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const row = await get(sql, [id]);
    return row ? new User(row) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const row = await get(sql, [email]);
    return row ? new User(row) : null;
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password_hash);
  }

  // Update user
  async update(updates) {
    const fields = [];
    const values = [];

    if (updates.full_name) {
      fields.push('full_name = ?');
      values.push(updates.full_name);
    }
    if (updates.grade_level) {
      fields.push('grade_level = ?');
      values.push(updates.grade_level);
    }
    if (updates.subjects) {
      fields.push('subjects = ?');
      values.push(JSON.stringify(updates.subjects));
    }
    if (updates.preferences) {
      fields.push('preferences = ?');
      values.push(JSON.stringify(updates.preferences));
    }
    if (updates.password) {
      const password_hash = await bcrypt.hash(updates.password, 10);
      fields.push('password_hash = ?');
      values.push(password_hash);
    }

    if (fields.length === 0) return;

    const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    values.push(this.id);

    await run(sql, values);

    // Refresh the object
    Object.assign(this, updates);
  }

  // Delete user
  async delete() {
    const sql = 'DELETE FROM users WHERE id = ?';
    await run(sql, [this.id]);
  }

  // Get user's questions
  async getQuestions(limit = 50, offset = 0) {
    const Question = require('./Question');
    return await Question.findByUserId(this.id, limit, offset);
  }

  // Get user's answers
  async getAnswers(limit = 50, offset = 0) {
    const Answer = require('./Answer');
    return await Answer.findByUserId(this.id, limit, offset);
  }

  // Convert to plain object (without password)
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      full_name: this.full_name,
      grade_level: this.grade_level,
      subjects: this.subjects,
      preferences: this.preferences,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = User;