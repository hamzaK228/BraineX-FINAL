
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
    const schols = await prisma.contentScholarship.findMany();
    console.log("Scholarships found:", schols.length);
    const roads = await prisma.contentRoadmap.findMany();
    console.log("Roadmaps found:", roads.length);
  } catch (e) {
    console.error("Prisma Error:", e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main();
