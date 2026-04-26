require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  const email = 'admin@brainex.com';
  const password = 'admin123';
  const name = 'System Admin';

  const check = await client.query('SELECT id FROM "User" WHERE email = $1', [email]);
  if (check.rows.length > 0) {
    console.log('User exists. Promoting...');
    await client.query('UPDATE "User" SET role = $1 WHERE email = $2', ['ADMIN', email]);
  } else {
    console.log('Creating new Admin...');
    const hash = await bcrypt.hash(password, 12);
    await client.query(
      'INSERT INTO "User" (id, email, name, "passwordHash", role, tier, "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW())',
      ['admin-id-' + Date.now(), email, name, hash, 'ADMIN', 'Pro']
    );
  }

  console.log('Admin account ready:');
  console.log('Email:', email);
  console.log('Password:', password);
  
  await client.end();
}

main().catch(console.error);
