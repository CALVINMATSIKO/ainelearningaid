const fs = require('fs');
const path = require('path');

const projectRef = 'rgbtyvvsypcjmrvrxocg';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYnR5dnZzeXBjam1ydnJ4b2NnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMzNDMxNSwiZXhwIjoyMDgxOTEwMzE1fQ.vBxFLHy1_EzkQrqZj8jAa3YoyWq8E60ZqmpqhQ79ymM';

const sqlPath = path.join(__dirname, 'backend/database/init_postgres.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

// Split by semicolon and filter empty
const statements = sql.split(';').map(s => s.trim()).filter(s => s);

async function runSQL(query) {
  const response = await fetch(`https://${projectRef}.supabase.co/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL Error: ${response.status} ${error}`);
  }

  return await response.json();
}

async function createTables() {
  for (const statement of statements) {
    if (statement) {
      console.log('Executing:', statement.substring(0, 50) + '...');
      try {
        await runSQL(statement);
        console.log('Success');
      } catch (error) {
        console.error('Failed:', error.message);
      }
    }
  }
}

createTables();