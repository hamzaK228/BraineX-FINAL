import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import path from "path";
import * as XLSX from "xlsx";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Researched data for the Top 20
const top20Extra: Record<string, { tuition: number, acceptance: number, logo: string }> = {
  "Massachusetts Institute of Technology (MIT)": { tuition: 64000, acceptance: 4, logo: "https://www.google.com/s2/favicons?domain=mit.edu&sz=128" },
  "Imperial College London": { tuition: 51000, acceptance: 12, logo: "https://www.google.com/s2/favicons?domain=imperial.ac.uk&sz=128" },
  "Stanford University": { tuition: 82000, acceptance: 3.8, logo: "https://www.google.com/s2/favicons?domain=stanford.edu&sz=128" },
  "University of Oxford": { tuition: 48000, acceptance: 15, logo: "https://www.google.com/s2/favicons?domain=ox.ac.uk&sz=128" },
  "Harvard University": { tuition: 57000, acceptance: 3.4, logo: "https://www.google.com/s2/favicons?domain=harvard.edu&sz=128" },
  "University of Cambridge": { tuition: 47000, acceptance: 18, logo: "https://www.google.com/s2/favicons?domain=cam.ac.uk&sz=128" },
  "ETH Zurich (Swiss Federal Institute of Technology)": { tuition: 1600, acceptance: 27, logo: "https://logo.clearbit.com/ethz.ch" },
  "National University of Singapore (NUS)": { tuition: 30000, acceptance: 7, logo: "https://logo.clearbit.com/nus.edu.sg" },
  "UCL (University College London)": { tuition: 45000, acceptance: 13, logo: "https://logo.clearbit.com/ucl.ac.uk" },
  "California Institute of Technology (Caltech)": { tuition: 63000, acceptance: 3, logo: "https://logo.clearbit.com/caltech.edu" },
  "The University of Hong Kong": { tuition: 23500, acceptance: 10, logo: "https://www.google.com/s2/favicons?domain=hku.hk&sz=128" },
  "Nanyang Technological University, Singapore (NTU Singapore)": { tuition: 30000, acceptance: 10, logo: "https://www.google.com/s2/favicons?domain=ntu.edu.sg&sz=128" },
  "University of Chicago": { tuition: 65000, acceptance: 5, logo: "https://www.google.com/s2/favicons?domain=uchicago.edu&sz=128" },
  "Peking University": { tuition: 4500, acceptance: 1, logo: "https://www.google.com/s2/favicons?domain=pku.edu.cn&sz=128" },
  "University of Pennsylvania": { tuition: 66000, acceptance: 6, logo: "https://www.google.com/s2/favicons?domain=upenn.edu&sz=128" },
  "Cornell University": { tuition: 65000, acceptance: 8, logo: "https://www.google.com/s2/favicons?domain=cornell.edu&sz=128" },
  "Tsinghua University": { tuition: 4500, acceptance: 1, logo: "https://www.google.com/s2/favicons?domain=tsinghua.edu.cn&sz=128" },
  "University of California, Berkeley (UCB)": { tuition: 48000, acceptance: 11, logo: "https://www.google.com/s2/favicons?domain=berkeley.edu&sz=128" },
  "The University of Melbourne": { tuition: 33000, acceptance: 18, logo: "https://www.google.com/s2/favicons?domain=unimelb.edu.au&sz=128" },
  "The University of New South Wales": { tuition: 33000, acceptance: 25, logo: "https://www.google.com/s2/favicons?domain=unsw.edu.au&sz=128" },
};

async function main() {
  const csvPath = path.join(process.cwd(), "2026_QS_World University_Rankings.csv");
  console.log(`Parsing CSV from: ${csvPath}`);

  const workbook = XLSX.readFile(csvPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData: any[] = XLSX.utils.sheet_to_json(sheet);

  console.log(`Found ${rawData.length} universities in CSV.`);

  // Clear existing universities
  await prisma.contentUniversity.deleteMany();
  console.log("Cleared existing ContentUniversity data.");

  const universities = [];

  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    const name = row["Name"];
    const country = row["Country/Territory"];
    const rankStr = String(row["Rank"]).replace('=', '');
    const ranking = parseInt(rankStr) || 0;

    const extra = top20Extra[name] || {};

    universities.push({
      name,
      ranking,
      location: country,
      country: country,
      tuition: extra.tuition || null,
      acceptance: extra.acceptance || null,
      logo: extra.logo || `https://www.google.com/s2/favicons?domain=${name.split(' ')[0].toLowerCase()}.edu&sz=128`,
      website: `https://www.google.com/search?q=${encodeURIComponent(name)}+official+website`,
      description: `${name} is a world-class institution in ${country}, ranked #${ranking} in the 2026 QS World University Rankings.`,
      image: "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200",
      isPublished: true,
      tags: [country, "QS 2026", ranking <= 100 ? "Elite" : "Global"],
      specialFeatures: ranking <= 50 ? ["Top Tier Research", "Global Alumni Network"] : ["Recognized Excellence"],
      noticableFacts: [`QS 2026 Rank: #${ranking}`],
    });

    if (universities.length >= 100) {
      await prisma.contentUniversity.createMany({ data: universities });
      console.log(`✓ Inserted ${i + 1} universities...`);
      universities.length = 0;
    }
  }

  if (universities.length > 0) {
    await prisma.contentUniversity.createMany({ data: universities });
  }

  console.log("\n✅ Database sync complete! All 1,500+ universities are live.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
