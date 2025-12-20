const fs = require('fs');
const path = require('path');
const { db } = require('../src/config/database');

/**
 * Database backup utility for SQLite
 * Creates timestamped backups of the database
 */

class DatabaseBackup {
  constructor() {
    this.dbPath = path.join(__dirname, '../../database/aine_learning_aid.db');
    this.backupDir = path.join(__dirname, '../../database/backups');
  }

  /**
   * Create backup directory if it doesn't exist
   */
  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Create a timestamped backup
   * @returns {string} - Path to the backup file
   */
  async createBackup() {
    this.ensureBackupDir();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `aine_learning_aid_backup_${timestamp}.db`;
    const backupPath = path.join(this.backupDir, backupFileName);

    try {
      // SQLite backup using file copy (simple approach)
      await fs.promises.copyFile(this.dbPath, backupPath);
      console.log(`Database backup created: ${backupPath}`);

      // Clean old backups (keep last 10)
      await this.cleanOldBackups();

      return backupPath;
    } catch (error) {
      console.error('Failed to create database backup:', error);
      throw error;
    }
  }

  /**
   * Clean old backups, keeping only the most recent ones
   * @param {number} keepCount - Number of backups to keep (default: 10)
   */
  async cleanOldBackups(keepCount = 10) {
    try {
      const files = await fs.promises.readdir(this.backupDir);
      const backupFiles = files
        .filter(file => file.startsWith('aine_learning_aid_backup_') && file.endsWith('.db'))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          stats: fs.statSync(path.join(this.backupDir, file))
        }))
        .sort((a, b) => b.stats.mtime - a.stats.mtime);

      if (backupFiles.length > keepCount) {
        const filesToDelete = backupFiles.slice(keepCount);
        for (const file of filesToDelete) {
          await fs.promises.unlink(file.path);
          console.log(`Deleted old backup: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }

  /**
   * List all backups
   * @returns {Array} - List of backup files with metadata
   */
  async listBackups() {
    try {
      const files = await fs.promises.readdir(this.backupDir);
      const backupFiles = files
        .filter(file => file.startsWith('aine_learning_aid_backup_') && file.endsWith('.db'))
        .map(file => {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: filePath,
            size: stats.size,
            created: stats.mtime,
            age: Date.now() - stats.mtime.getTime()
          };
        })
        .sort((a, b) => b.created - a.created);

      return backupFiles;
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Restore from a backup
   * @param {string} backupPath - Path to the backup file
   */
  async restoreFromBackup(backupPath) {
    try {
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup file does not exist: ${backupPath}`);
      }

      // Create a backup of current database before restore
      const preRestoreBackup = await this.createBackup();

      // Close current database connection
      db.close();

      // Copy backup to main database location
      await fs.promises.copyFile(backupPath, this.dbPath);

      console.log(`Database restored from: ${backupPath}`);
      console.log(`Pre-restore backup saved as: ${preRestoreBackup}`);

      return true;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      throw error;
    }
  }

  /**
   * Get backup statistics
   * @returns {Object} - Backup statistics
   */
  async getBackupStats() {
    const backups = await this.listBackups();
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);

    return {
      totalBackups: backups.length,
      totalSize,
      oldestBackup: backups[backups.length - 1]?.created,
      newestBackup: backups[0]?.created
    };
  }
}

// Export singleton instance
const databaseBackup = new DatabaseBackup();

module.exports = databaseBackup;

// Run backup if script is executed directly
if (require.main === module) {
  databaseBackup.createBackup()
    .then(() => {
      console.log('Backup completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Backup failed:', error);
      process.exit(1);
    });
}