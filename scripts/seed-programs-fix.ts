import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const programsData = [
  {
    title: "SSP (Summer Science Program)",
    university: "SSP International",
    location: "Various (US)",
    degreeLevel: "Summer",
    studyMode: "On-Campus",
    tuition: 0,
    duration: "6 Weeks",
    description: "A legacy program focusing on collaborative research in Astrophysics, Biochemistry, or Genomics.",
    tags: ["STEM", "Research", "Selective"],
    specialFeatures: ["Collaborative team research", "PhD faculty mentorship"],
    noticableFacts: ["One of the oldest summer programs", "High selectivity"],
    applyLink: "https://summerscience.org"
  },
  {
    title: "Lumiere Research Scholar Program",
    university: "Lumiere Education",
    location: "Online / Global",
    degreeLevel: "Summer",
    studyMode: "Online",
    tuition: 3950,
    duration: "12 Weeks",
    description: "Provides 1-on-1 mentorship with PhD researchers from top-tier universities.",
    tags: ["Mentorship", "Research Paper", "PhD"],
    specialFeatures: ["1-on-1 PhD mentorship", "Individual research paper"],
    noticableFacts: ["Produces publishable quality work", "Mentors from Ivy League schools"],
    applyLink: "https://lumiere-education.com"
  },
  {
    title: "Pioneer Academics",
    university: "Pioneer Academics",
    location: "Online / Global",
    degreeLevel: "Summer",
    studyMode: "Online",
    tuition: 6000,
    duration: "10 Weeks",
    description: "A global online research institute known for its high standards and partnership with Oberlin College.",
    tags: ["Credit", "Research"],
    specialFeatures: ["Oberlin College credit", "Standardized research process"],
    noticableFacts: ["First online research program for HS"],
    applyLink: "https://pioneeracademics.com"
  },
  {
    title: "Yale Young Global Scholars",
    university: "Yale University",
    location: "New Haven, CT",
    degreeLevel: "Summer",
    studyMode: "On-Campus",
    tuition: 6500,
    duration: "2 Weeks",
    description: "A world-renowned academic leadership program at Yale University.",
    tags: ["Yale", "Leadership", "Global"],
    specialFeatures: ["Yale faculty seminars", "Capstone projects"],
    noticableFacts: ["One of the most diverse programs"],
    applyLink: "https://globalscholars.yale.edu"
  },
  {
    title: "MIT PRIMES (Research in Math)",
    university: "MIT",
    location: "Cambridge, MA",
    degreeLevel: "Summer",
    studyMode: "Hybrid",
    tuition: 0,
    duration: "1 Year",
    description: "Program for Research in Mathematics, Engineering, and Science for High School Students.",
    tags: ["Mathematics", "Research", "MIT"],
    specialFeatures: ["Mentorship by MIT graduate students", "Advanced math research"],
    noticableFacts: ["Tuition-free", "Highly selective"],
    applyLink: "https://math.mit.edu/primes"
  }
];

async function main() {
  console.log("♻️ Seeding programs into the database...");

  try {
    for (const p of programsData) {
      await prisma.contentProgram.create({ data: p });
    }
    console.log(`✅ Successfully seeded ${programsData.length} programs.`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
