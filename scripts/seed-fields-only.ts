import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Data from seed-content.ts (I'll extract the main parts)
// Note: I'm skipping Universities as requested previously

const fieldsData = [
  { title: "Computer Science", category: "STEM", icon: "💻", description: "The study of computation, algorithms, and information systems. Covers AI, cybersecurity, distributed systems, and software engineering.", salary: "$120k+", growth: "15%", demand: "Very High", topUnis: "MIT, Stanford, CMU, Berkeley" },
  { title: "Business Administration", category: "Business", icon: "📊", description: "Strategic management of business operations, organizational leadership, and financial decision-making.", salary: "$95k+", growth: "8%", demand: "High", topUnis: "Wharton, Harvard, Stanford, INSEAD" },
  { title: "Medicine & Health", category: "Health", icon: "🏥", description: "Diagnosis, treatment, and prevention of disease. Includes specialized fields like surgery, nursing, and public health.", salary: "$160k+", growth: "13%", demand: "Very High", topUnis: "Johns Hopkins, Harvard, Oxford" },
  { title: "Biotechnology", category: "STEM", icon: "🧬", description: "Using biological systems, living organisms, or derivatives thereof, to make or modify products or processes.", salary: "$105k+", growth: "10%", demand: "High", topUnis: "MIT, ETH Zurich, Cambridge" },
  { title: "Digital Arts & Design", category: "Creative", icon: "🎨", description: "Intersection of creativity and technology. Covers UI/UX design, motion graphics, and game development.", salary: "$85k+", growth: "12%", demand: "High", topUnis: "RISD, Parsons, RCA London" },
  { title: "Law & Jurisprudence", category: "Humanities", icon: "⚖️", description: "The system of rules which a particular country or community recognizes as regulating the actions of its members.", salary: "$125k+", growth: "9%", demand: "High", topUnis: "Yale, Harvard, Oxford, NYU" },
  { title: "Engineering", category: "STEM", icon: "⚙️", description: "Application of physics, mathematics, and materials science to design and build structures, machines, and systems.", salary: "$100k+", growth: "10%", demand: "High", topUnis: "MIT, Caltech, ETH Zurich" },
  { title: "Finance & Economics", category: "Business", icon: "📉", description: "The science of money, markets, and investment. Studies how individuals, companies, and governments allocate resources.", salary: "$110k+", growth: "12%", demand: "High", topUnis: "Wharton, LSE, Chicago" },
  { title: "Physics & Astronomy", category: "STEM", icon: "🌌", description: "Understanding the fundamental laws governing the universe — from subatomic particles to galaxies.", salary: "$115k+", growth: "9%", demand: "High", topUnis: "MIT, Princeton, CERN/ETH" },
  { title: "Mathematics & Statistics", category: "STEM", icon: "🔢", description: "The language of science. Pure math, applied math, statistics, and data science form the foundation of modern technology.", salary: "$95k+", growth: "14%", demand: "Very High", topUnis: "MIT, Princeton, Cambridge" },
  { title: "Environmental Science", category: "STEM", icon: "🌍", description: "Studying Earth's systems and human impact on the environment. Covers climate science, conservation, and renewable energy.", salary: "$75k+", growth: "11%", demand: "Growing", topUnis: "ETH Zurich, Stanford, Wageningen" },
  { title: "Film, Media & Communication", category: "Creative", icon: "🎬", description: "Storytelling through visual and digital media. Covers filmmaking, journalism, digital marketing, PR, and content strategy.", salary: "$70k+", growth: "7%", demand: "Moderate", topUnis: "USC, NYU, UCLA" },
  { title: "Psychology & Cognitive Science", category: "Humanities", icon: "🧠", description: "Understanding human behavior, cognition, and mental processes. Covers clinical psychology, behavioral economics, and neuroscience.", salary: "$80k+", growth: "10%", demand: "High", topUnis: "Stanford, Harvard, UCL" },
  { title: "Data Science & AI", category: "STEM", icon: "🤖", description: "Extracting insights from data using statistics, machine learning, and domain expertise. The driving force behind modern AI.", salary: "$130k+", growth: "22%", demand: "Very High", topUnis: "MIT, Stanford, Berkeley" },
  { title: "Pharmacy & Pharmaceutical Science", category: "Health", icon: "💊", description: "The science of drug discovery, development, and therapeutic use. Covers medicinal chemistry, pharmacology, and clinical practice.", salary: "$110k+", growth: "8%", demand: "High", topUnis: "UCSF, UCL, UNC" },
  { title: "Architecture & Urban Planning", category: "Creative", icon: "🏛️", description: "Designing buildings, cities, and spaces that shape how people live. Combines art, engineering, and environmental science.", salary: "$90k+", growth: "9%", demand: "High", topUnis: "MIT, AA London, ETH Zurich" },
  { title: "Cybersecurity", category: "STEM", icon: "🛡️", description: "Protecting systems, networks, and programs from digital attacks. Includes threat hunting, cryptography, and network security.", salary: "$125k+", growth: "28%", demand: "Critical", topUnis: "CMU, Stanford, Purdue" },
  { title: "Aerospace Engineering", category: "STEM", icon: "✈️", description: "Designing aircraft, spacecraft, satellites, and missiles. Covers aerodynamics, propulsion, and structural design.", salary: "$118k+", growth: "6%", demand: "High", topUnis: "MIT, Georgia Tech, Stanford" },
  { title: "Marketing & Advertising", category: "Business", icon: "📈", description: "The process of getting people interested in your company's product or service. Includes market research and data analysis.", salary: "$75k+", growth: "10%", demand: "High", topUnis: "UPenn, NYU, Northwestern" },
  { title: "International Relations", category: "Humanities", icon: "🌎", description: "The study of the interactions of nation-states and non-governmental organizations in fields like politics and economics.", salary: "$85k+", growth: "7%", demand: "Moderate", topUnis: "Georgetown, Harvard, Sciences Po" },
  { title: "Nursing & Patient Care", category: "Health", icon: "🩹", description: "Focuses on the care of individuals, families, and communities so they may attain, maintain, or recover optimal health.", salary: "$80k+", growth: "40%", demand: "Extremely High", topUnis: "Johns Hopkins, UPenn, King's College" },
  { title: "Renewable Energy Engineering", category: "STEM", icon: "🔋", description: "Focusing on the development of sustainable energy sources like solar, wind, and geothermal power.", salary: "$105k+", growth: "25%", demand: "High", topUnis: "UC Berkeley, TU Delft, Stanford" },
  { title: "Music & Sound Design", category: "Creative", icon: "🎵", description: "The art of creating, performing, and producing sound and music for various media and audiences.", salary: "$65k+", growth: "4%", demand: "Competitive", topUnis: "Berklee, Juilliard, Royal College of Music" },
  { title: "History & Archaeology", category: "Humanities", icon: "🏛️", description: "The study of the past through written records and physical artifacts to understand human civilization.", salary: "$65k+", growth: "5%", demand: "Moderate", topUnis: "Oxford, Cambridge, Harvard" },
  { title: "Accounting & Audit", category: "Business", icon: "🏦", description: "Measurement, processing, and communication of financial information about economic entities.", salary: "$78k+", growth: "6%", demand: "High", topUnis: "UT Austin, BYU, UIUC" },
  { title: "Political Science", category: "Humanities", icon: "🗳️", description: "The study of systems of government, political behavior, and the analysis of political activities.", salary: "$120k+ (Policy)", growth: "6%", demand: "Moderate", topUnis: "Harvard, LSE, Stanford" },
  { title: "Civil & Structural Engineering", category: "STEM", icon: "🏢", description: "Designing and overseeing the construction of public works, such as roads, bridges, and dams.", salary: "$95k+", growth: "7%", demand: "High", topUnis: "UC Berkeley, ETH Zurich, Tsinghua" },
  { title: "Chemical Engineering", category: "STEM", icon: "🧪", description: "Bridging physical sciences and life sciences with mathematics and economics to transform raw materials into useful products.", salary: "$110k+", growth: "8%", demand: "High", topUnis: "MIT, Stanford, Cambridge" },
  { title: "Sociology", category: "Humanities", icon: "🗣️", description: "The study of social life, social change, and the social causes and consequences of human behavior.", salary: "$70k+", growth: "5%", demand: "Moderate", topUnis: "Harvard, Oxford, Berkeley" },
  { title: "Philosophy", category: "Humanities", icon: "📜", description: "Investigation of fundamental truths about ourselves, the world, and our relationships to the world and each other.", salary: "$75k+", growth: "4%", demand: "Moderate", topUnis: "NYU, Oxford, Rutgers" },
];

// ... Other data would go here if I wanted to fully restore Programs/Scholarships without clearing them
// But for now, I've fulfilled "add all fields to content".

async function main() {
  console.log("Seeding fields...\n");
  await prisma.contentField.deleteMany();
  for (const f of fieldsData) {
    await prisma.contentField.create({ data: f });
  }
  console.log(`✓ Created ${fieldsData.length} fields.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
