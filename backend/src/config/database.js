const path = require('path');
const DATABASE_URL = process.env.DATABASE_URL;

let db;
let isPostgres = false;

if (DATABASE_URL) {
  // Use PostgreSQL
  const { Pool } = require('pg');
  db = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false } // For Supabase
  });
  isPostgres = true;
  console.log('Connected to PostgreSQL database.');
} else {
  // Use SQLite
  const sqlite3 = require('sqlite3').verbose();
  const DB_PATH = path.join(__dirname, '../../database/aine_learning_aid.db');
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database.');
    }
  });
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
}

// Initialize database with schema
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    const initSqlPath = path.join(__dirname, `../../database/init${isPostgres ? '_postgres' : ''}.sql`);

    fs.readFile(initSqlPath, 'utf8', (err, sql) => {
      if (err) {
        reject(err);
        return;
      }

      if (isPostgres) {
        // For PostgreSQL, split and execute each statement
        const statements = sql.split(';').filter(stmt => stmt.trim());
        const executeNext = () => {
          if (statements.length === 0) {
            console.log('Database initialized successfully.');
            resolve();
            return;
          }
          const stmt = statements.shift();
          db.query(stmt, (err) => {
            if (err) {
              reject(err);
            } else {
              executeNext();
            }
          });
        };
        executeNext();
      } else {
        db.exec(sql, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Database initialized successfully.');
            resolve();
          }
        });
      }
    });
  });
};

// Helper function to run queries with promises
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (isPostgres) {
      db.query(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ id: result.rows[0]?.id || null, changes: result.rowCount });
        }
      });
    } else {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    }
  });
};

// Helper function to get single row
const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (isPostgres) {
      db.query(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows[0] || null);
        }
      });
    } else {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    }
  });
};

// Helper function to get all rows
const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (isPostgres) {
      db.query(sql, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rows);
        }
      });
    } else {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    }
  });
};

module.exports = {
  db,
  initDatabase,
  run,
  get,
  all,
  isPostgres
};