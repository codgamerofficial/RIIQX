const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      const k = key.trim();
      const v = vals.join('=').trim();
      if (!process.env[k]) {
        process.env[k] = v;
      }
    }
  });
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

console.log(`Found ${migrationFiles.length} migration files:`);
migrationFiles.forEach((f) => console.log(` - ${f}`));

async function runMigrations() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('\nConnecting to Supabase PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    for (const file of migrationFiles) {
      console.log(`\nExecuting migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await client.query(sql);
      console.log(`✅ Migration ${file} completed successfully!`);
    }

    console.log('\n🎉 ALL MIGRATIONS EXECUTED SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ Migration error:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
