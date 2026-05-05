import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const programsToSeed = [
  {
    title: "INSEAD Summer Program",
    university: "INSEAD",
    location: "Fontainebleau, France",
    country: "France",
    level: "Graduate",
    category: "Summer",
    fields: ["Business"],
    format: "Offline",
    duration: "2 Weeks",
    tuition: 8000,
    tags: ["Business", "International", "MBA"],
    eligibility: ["International"],
    description: "Mini-MBA experience focused on global business management and international strategy.",
    special_features: ["Case study marathons", "Global team projects", "Forest campus experience"],
    noticable_facts: ["The Business School for the World", "Highly diverse cohort"],
    apply_link: "https://insead.edu"
  },
  {
    title: "London Business School Summer",
    university: "London Business School",
    location: "London, UK",
    country: "UK",
    level: "Graduate",
    category: "Summer",
    fields: ["Business"],
    format: "Offline",
    duration: "3 Weeks",
    tuition: 9000,
    tags: ["Finance", "London", "Elite"],
    eligibility: ["International"],
    description: "Advanced finance and management programs in the world's financial heart.",
    special_features: ["City of London visits", "Professional mentorship", "Strategic networking"],
    noticable_facts: ["Top-tier global rankings", "Premier finance focus"],
    apply_link: "https://london.edu"
  },
  {
    title: "MIT Bootcamps",
    university: "MIT",
    location: "Online / Global",
    country: "USA",
    level: "Undergraduate",
    category: "Summer",
    fields: ["Business", "STEM"],
    format: "Hybrid",
    duration: "1 Week",
    tuition: 5000,
    tags: ["Entrepreneurship", "Innovation", "MIT"],
    eligibility: ["International", "Domestic"],
    description: "Intensive, week-long programs where participants start a venture and learn the MIT way of innovating.",
    special_features: ["Extreme entrepreneurship", "Pitching to MIT faculty", "Alumni community access"],
    noticable_facts: ["High intensity 'drinking from a firehose'", "Global locations"],
    apply_link: "https://bootcamp.mit.edu"
  },
  {
    title: "Singularity University Summer",
    university: "Singularity University",
    location: "Online / Silicon Valley",
    country: "USA",
    level: "Graduate",
    category: "Summer",
    fields: ["STEM", "Business"],
    format: "Hybrid",
    duration: "2-4 Weeks",
    tuition: 12000,
    tags: ["Exponential Tech", "Future"],
    eligibility: ["International"],
    description: "Explore exponential technologies and how to use them to solve humanity's greatest challenges.",
    special_features: ["Silicon Valley network", "Future-focused curriculum", "Impact project focus"],
    noticable_facts: ["Founded by Ray Kurzweil & Peter Diamandis", "High-tech futurist focus"],
    apply_link: "https://su.org"
  },
  {
    title: "Aalto University Summer School",
    university: "Aalto University",
    location: "Espoo, Finland",
    country: "Finland",
    level: "Undergraduate",
    category: "Summer",
    fields: ["STEM", "Arts", "Business"],
    format: "Offline",
    duration: "2-3 Weeks",
    tuition: 2000,
    tags: ["Design", "Innovation", "Nordic"],
    eligibility: ["International"],
    description: "Nordic focus on design thinking, technology, and entrepreneurship.",
    special_features: ["Design Factory access", "Nordic nature trips", "Collaborative design projects"],
    noticable_facts: ["World leader in design education", "Unique interdisciplinary focus"],
    apply_link: "https://aalto.fi/summer-school"
  },
  {
    title: "TU Delft Summer School",
    university: "TU Delft",
    location: "Delft, Netherlands",
    country: "Netherlands",
    level: "Undergraduate",
    category: "Summer",
    fields: ["STEM"],
    format: "Offline",
    duration: "2 Weeks",
    tuition: 2200,
    tags: ["Water Management", "Engineering"],
    eligibility: ["International"],
    description: "Leading programs in water management, sustainable energy, and aerospace engineering.",
    special_features: ["Dike and dam visits", "Advanced lab access", "Bicycle-friendly campus"],
    noticable_facts: ["World's best in water engineering", "Historic technical university"],
    apply_link: "https://tudelft.nl"
  },
  {
    title: "KTH Summer School",
    university: "KTH Royal Institute",
    location: "Stockholm, Sweden",
    country: "Sweden",
    level: "Undergraduate",
    category: "Summer",
    fields: ["STEM"],
    format: "Offline",
    duration: "4 Weeks",
    tuition: 2500,
    tags: ["Sustainability", "Tech", "Sweden"],
    eligibility: ["International"],
    description: "Sustainability and smart city technology in one of Europe's most innovative cities.",
    special_features: ["Smart city tours", "Innovation hub visits", "Stockholm archipelago trips"],
    noticable_facts: ["Leading technical school in Sweden", "Strong sustainability focus"],
    apply_link: "https://kth.se"
  },
  {
    title: "University of Helsinki Summer",
    university: "University of Helsinki",
    location: "Helsinki, Finland",
    country: "Finland",
    level: "Graduate",
    category: "Summer",
    fields: ["Humanities", "Social Sciences"],
    format: "Offline",
    duration: "3 Weeks",
    tuition: 1800,
    tags: ["Education", "Policy", "Nordic"],
    eligibility: ["International"],
    description: "Deep dive into the Finnish education system and welfare state models.",
    special_features: ["School visits", "Policy debates", "Sauna and nature experiences"],
    noticable_facts: ["World's best education system focus", "Top-tier Nordic research"],
    apply_link: "https://helsinki.fi/summer-school"
  },
  {
    title: "Copenhagen Summer University",
    university: "University of Copenhagen",
    location: "Copenhagen, Denmark",
    country: "Denmark",
    level: "Undergraduate",
    category: "Summer",
    fields: ["STEM", "Health", "Humanities"],
    format: "Offline",
    duration: "2 Weeks",
    tuition: 2000,
    tags: ["Health", "Sustainability", "Denmark"],
    eligibility: ["International"],
    description: "Focus on global health, sustainability, and the Danish 'Hygge' lifestyle.",
    special_features: ["Global health projects", "Sustainability walks", "Danish culture workshops"],
    noticable_facts: ["Oldest university in Denmark", "Leading health research"],
    apply_link: "https://summer.ku.dk"
  }
];

async function main() {
  console.log(`Starting to seed ${programsToSeed.length} remaining programs...`);

  for (const prog of programsToSeed) {
    await prisma.contentProgram.upsert({
      where: {
        title_university: {
          title: prog.title,
          university: prog.university
        }
      },
      update: {
        location: prog.location,
        country: prog.country,
        degreeLevel: prog.level,
        category: prog.category,
        fields: prog.fields,
        studyMode: prog.format,
        duration: prog.duration,
        tuition: prog.tuition,
        tags: prog.tags,
        eligibility: prog.eligibility,
        description: prog.description,
        specialFeatures: prog.special_features,
        noticableFacts: prog.noticable_facts,
        applyLink: prog.apply_link
      },
      create: {
        title: prog.title,
        university: prog.university,
        location: prog.location,
        country: prog.country,
        degreeLevel: prog.level,
        category: prog.category,
        fields: prog.fields,
        studyMode: prog.format,
        duration: prog.duration,
        tuition: prog.tuition,
        tags: prog.tags,
        eligibility: prog.eligibility,
        description: prog.description,
        specialFeatures: prog.special_features,
        noticableFacts: prog.noticable_facts,
        applyLink: prog.apply_link
      }
    });
    console.log(`Upserted: ${prog.title}`);
  }

  console.log("Seeding completed.");
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
