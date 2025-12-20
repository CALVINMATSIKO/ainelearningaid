const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database configuration
const DB_PATH = path.join(__dirname, '../../database/aine_learning_aid.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database with schema
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    const initSqlPath = path.join(__dirname, '../../database/init.sql');

    fs.readFile(initSqlPath, 'utf8', (err, sql) => {
      if (err) {
        reject(err);
        return;
      }

      db.exec(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database initialized successfully.');
          resolve();
        }
      });
    });
  });
};

// Helper function to run queries with promises
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Helper function to get single row
const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Helper function to get all rows
const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  db,
  initDatabase,
  run,
  get,
  all
};