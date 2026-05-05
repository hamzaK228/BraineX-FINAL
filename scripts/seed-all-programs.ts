import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
// @ts-ignore
import programsData from "./temp-programs.js";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding all 100 programs from hardcoded data...\n");

  // Clear existing programs to ensure clean state and parity
  await prisma.contentProgram.deleteMany();
  console.log("Cleared existing programs.");

  for (const prog of programsData) {
    const { id, format, special_features, apply_link, noticable_facts, level, ...rest } = prog as any;
    
    await prisma.contentProgram.create({
      data: {
        ...rest,
        studyMode: format || "Offline",
        specialFeatures: special_features || [],
        noticableFacts: noticable_facts || [],
        applyLink: apply_link || null,
        featured: prog.featured || false,
        isPublished: true,
        degreeLevel: level || "Undergraduate"
      }
    });
  }

  const count = await prisma.contentProgram.count();
  console.log(`\n✓ Successfully seeded ${count} programs.`);
  console.log("✅ Program migration complete!");
}

main()
  .catch(e => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
