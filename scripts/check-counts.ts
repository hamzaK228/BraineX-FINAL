import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const programCount = await prisma.contentProgram.count();
  const scholarshipCount = await prisma.contentScholarship.count();
  const roadmapCount = await prisma.contentRoadmap.count();
  const fieldCount = await prisma.contentField.count();

  console.log(`Programs: ${programCount}`);
  console.log(`Scholarships: ${scholarshipCount}`);
  console.log(`Roadmaps: ${roadmapCount}`);
  console.log(`Fields: ${fieldCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
