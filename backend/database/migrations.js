const fs = require('fs');
const path = require('path');
const { db, run } = require('../src/config/database');

/**
 * Database migration system for production
 * Handles schema updates and data migrations
 */

class MigrationManager {
  constructor() {
    this.migrationsDir = path.join(__dirname, 'migrations');
    this.migrationTable = 'schema_migrations';
  }

  async initialize() {
    // Create migrations table if it doesn't exist
    await run(`
      CREATE TABLE IF NOT EXISTS ${this.migrationTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        migration_name TEXT UNIQUE NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async getExecutedMigrations() {
    try {
      const rows = await db.all(`SELECT migration_name FROM ${this.migrationTable} ORDER BY id`);
      return rows.map(row => row.migration_name);
    } catch (error) {
      // Table doesn't exist yet, return empty array
      if (error.message.includes('no such table')) {
        return [];
      }
      throw error;
    }
  }

  async executeMigration(migrationFile) {
    const migrationPath = path.join(this.migrationsDir, migrationFile);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    await db.exec(sql);

    // Record the migration
    await run(`INSERT INTO ${this.migrationTable} (migration_name) VALUES (?)`, [migrationFile]);

    console.log(`Executed migration: ${migrationFile}`);
  }

  async runMigrations() {
    await this.initialize();

    const executedMigrations = await this.getExecutedMigrations();
    const migrationFiles = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      if (!executedMigrations.includes(file)) {
        await this.executeMigration(file);
      }
    }

    console.log('All migrations executed successfully');
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  const migrationManager = new MigrationManager();
  migrationManager.runMigrations()
    .then(() => {
      console.log('Migration process completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = MigrationManager;