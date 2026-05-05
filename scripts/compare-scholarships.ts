import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const dbScholarships = await prisma.contentScholarship.findMany({ select: { title: true } });
  const dbTitles = new Set(dbScholarships.map(s => s.title));

  const content = fs.readFileSync('src/app/(public)/scholarships/page.tsx', 'utf8');
  // Simple regex to find titles
  const matches = content.match(/title: "(.*?)"/g);
  const fileTitles = matches ? matches.map(m => m.match(/title: "(.*?)"/)[1]) : [];

  console.log(`DB Count: ${dbTitles.size}`);
  console.log(`File Count: ${fileTitles.length}`);

  console.log("\nMissing in DB:");
  fileTitles.forEach(t => {
    if (!dbTitles.has(t)) console.log(`- ${t}`);
  });
}

main().finally(async () => {
  await prisma.$disconnect();
  await pool.end();
});
