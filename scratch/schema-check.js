
require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const res = await prisma.$queryRawUnsafe("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ContentProgram'");
    console.log("SCHEMA:", JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("RAW_ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main();
