require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  await client.query('UPDATE "User" SET role = $1 WHERE email = $2', ['ADMIN', 'hamza.kozubaev@gmail.com']);
  console.log('Promoted hamza.kozubaev@gmail.com to ADMIN');
  await client.end();
}

main().catch(console.error);
