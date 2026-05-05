import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const scholarship = await prisma.contentScholarship.findFirst();
  console.log("Scholarship Example:", JSON.stringify(scholarship, null, 2));

  const roadmap = await prisma.contentRoadmap.findFirst();
  console.log("Roadmap Example:", JSON.stringify(roadmap, null, 2));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
