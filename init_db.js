const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgresql://postgres:Kampalamw1$@db.rgbtyvvsypcjmrvrxocg.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
  try {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL');

    const sqlPath = path.join(__dirname, 'backend/database/init_postgres.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...');
        await client.query(statement);
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await client.end();
  }
}

initDatabase();