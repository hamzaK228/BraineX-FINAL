
require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL not set");
    return;
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const users = await prisma.user.findMany({
      select: { email: true, role: true }
    });
    console.log("Users in DB:", JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
