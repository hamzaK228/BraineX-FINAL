import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const scholarshipsData = [
  {
    title: "The Gates Scholarship", provider: "Gates Foundation", location: "USA", coverage: "Full Ride", degreeLevel: ["Undergraduate"], deadline: "2024-09-15", amount: 200000, tags: ["Full Ride", "Need-Based"], fields: ["All"], eligibility: ["Domestic"], format: "Universal",
    description: "A highly selective, last-dollar scholarship for outstanding, minority, high school seniors from low-income households.",
    special_features: ["Full cost of attendance", "Leadership training", "Professional development"],
    apply_link: "https://thegatesscholarship.org"
  },
  {
    title: "Rhodes Scholarship", featured: true, provider: "Rhodes Trust", location: "UK (Oxford)", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "2024-10-01", amount: 75000, tags: ["Prestige", "Leadership"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "The oldest and perhaps most prestigious international scholarship program, supporting students at the University of Oxford.",
    special_features: ["Oxford tuition", "Living stipend", "Global alumni network"],
    apply_link: "https://rhodeshouse.ox.ac.uk"
  },
  {
    title: "Fulbright Program", provider: "U.S. Department of State", location: "USA / Global", coverage: "Full Ride", degreeLevel: ["Graduate", "Research"], deadline: "2024-10-11", amount: 50000, tags: ["Cultural Exchange", "Research"], fields: ["All"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "The flagship international educational exchange program sponsored by the U.S. government.",
    apply_link: "https://fulbrightprogram.org"
  },
  {
    title: "Chevening Scholarships", provider: "UK Government", location: "UK", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "2024-11-05", amount: 45000, tags: ["Global Leaders", "Networking"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "The UK government’s international awards program aimed at developing global leaders.",
    apply_link: "https://chevening.org"
  },
  {
    title: "Schwarzman Scholars", provider: "Schwarzman Trust", location: "China", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "2024-09-19", amount: 80000, tags: ["Leadership", "Geopolitics"], fields: ["Public Policy", "Economics", "Business"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Designed to prepare the next generation of global leaders to respond to the geopolitical landscape of the 21st Century.",
    apply_link: "https://schwarzmanscholars.org"
  },
  {
    title: "Knight-Hennessy Scholars", provider: "Stanford University", location: "USA", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "2024-10-11", amount: 90000, tags: ["Multidisciplinary", "Stanford"], fields: ["All"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "A multidisciplinary community of graduate students at Stanford University.",
    apply_link: "https://knight-hennessy.stanford.edu"
  },
  {
    title: "DAAD Scholarships", provider: "DAAD Germany", location: "Germany", coverage: "Stipend", degreeLevel: ["Graduate", "PhD"], deadline: "Varies", amount: 15000, tags: ["Germany", "STEM", "Humanities"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Supporting international students to study or conduct research in Germany.",
    apply_link: "https://daad.de"
  },
  {
    title: "Eiffel Excellence Scholarship", provider: "French Government", location: "France", coverage: "Stipend", degreeLevel: ["Master's", "PhD"], deadline: "2025-01-10", amount: 18000, tags: ["France", "Excellence"], fields: ["Law", "Economics", "STEM"], eligibility: ["International"], format: "Offline",
    description: "A tool developed by the Ministry for Europe and Foreign Affairs to enable French higher education institutions to attract top foreign students.",
    apply_link: "https://campusfrance.org"
  },
  {
    title: "MEXT Scholarship", provider: "Japanese Government", location: "Japan", coverage: "Full Ride", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 20000, tags: ["Japan", "Cultural"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "The Japanese government scholarship program for international students to study in Japan.",
    apply_link: "https://mext.go.jp"
  },
  {
    title: "Erasmus Mundus", provider: "European Union", location: "Europe", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "Varies", amount: 50000, tags: ["Multi-Country", "Diversity"], fields: ["All"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Joint master's degrees offered by consortia of European universities.",
    apply_link: "https://erasmus-plus.ec.europa.eu"
  },
  {
    title: "Commonwealth Scholarships", provider: "Commonwealth Commission", location: "UK / Global", coverage: "Full Ride", degreeLevel: ["Master's", "PhD"], deadline: "Varies", amount: 40000, tags: ["Commonwealth", "Development"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Scholarships for students from Commonwealth countries to study in the UK or other member states.",
    apply_link: "https://cscuk.fcdo.gov.uk"
  },
  {
    title: "Gates Cambridge Scholarship", featured: true, provider: "Gates Foundation", location: "UK (Cambridge)", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "2024-10-11", amount: 65000, tags: ["Cambridge", "Social Impact"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Full-cost scholarships for postgraduate study in any subject available at the University of Cambridge.",
    apply_link: "https://gatescambridge.org"
  },
  {
    title: "Vanier Canada Graduate", provider: "Canadian Government", location: "Canada", coverage: "Stipend", degreeLevel: ["PhD"], deadline: "2024-11-01", amount: 50000, tags: ["Canada", "PhD"], fields: ["STEM", "Health", "Humanities"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Supporting students who demonstrate both leadership skills and a high standard of scholarly achievement in graduate studies.",
    apply_link: "https://vanier.gc.ca"
  },
  {
    title: "Hubert Humphrey Fellowship", provider: "U.S. State Dept", location: "USA", coverage: "Full Ride", degreeLevel: ["Professional"], deadline: "Varies", amount: 40000, tags: ["Professional", "Leadership"], fields: ["Public Policy", "Health", "Climate"], eligibility: ["International"], format: "Offline",
    description: "Providing 10 months of professional enrichment and non-degree graduate-level study in the U.S.",
    apply_link: "https://humphreyfellowship.org"
  },
  {
    title: "Aga Khan Foundation", provider: "AKDN", location: "Global", coverage: "Partial", degreeLevel: ["Master's", "PhD"], deadline: "2025-03-31", amount: 25000, tags: ["Need-Based", "Development"], fields: ["All"], eligibility: ["International"], format: "Universal",
    description: "Providing a limited number of scholarships each year for postgraduate studies to outstanding students from select developing countries.",
    apply_link: "https://akdn.org"
  },
  {
    title: "ADB-Japan Scholarship", provider: "Asian Development Bank", location: "Asia / Pacific", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "Varies", amount: 30000, tags: ["Asia", "Development"], fields: ["Economics", "STEM", "Health"], eligibility: ["International"], format: "Offline",
    description: "Aimed at providing opportunities for well-qualified citizens of ADB’s developing member countries to undertake postgraduate studies.",
    apply_link: "https://adb.org"
  },
  {
    title: "MasterCard Foundation", provider: "MasterCard Foundation", location: "Global / Africa", coverage: "Full Ride", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 45000, tags: ["Africa", "Leadership"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Partnering with universities to provide scholarships for high-potential students from Sub-Saharan Africa.",
    apply_link: "https://mastercardfdn.org"
  },
  {
    title: "Joint Japan World Bank", provider: "World Bank", location: "Global", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "2025-05-24", amount: 50000, tags: ["Development", "Policy"], fields: ["Social Sciences", "Economics"], eligibility: ["International"], format: "Offline",
    description: "Supporting students from developing countries to study subjects related to development.",
    apply_link: "https://worldbank.org"
  },
  {
    title: "Swiss Government Excellence", provider: "Switzerland Gov", location: "Switzerland", coverage: "Stipend", degreeLevel: ["PhD", "Postgraduate"], deadline: "Varies", amount: 25000, tags: ["Switzerland", "Research"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Enabling foreign researchers from all academic fields to conduct research at a Swiss university.",
    apply_link: "https://sbfi.admin.ch"
  },
  {
    title: "Austrian Government Scholarship", provider: "Austria Gov", location: "Austria", coverage: "Stipend", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 12000, tags: ["Austria", "EU"], fields: ["STEM", "Arts"], eligibility: ["International"], format: "Offline",
    description: "Supporting international students for studies in Austria.",
    apply_link: "https://grants.at"
  },
  {
    title: "Orange Knowledge Program", provider: "Netherlands Gov", location: "Netherlands", coverage: "Full Ride", degreeLevel: ["Short Course", "Master's"], deadline: "Varies", amount: 35000, tags: ["Netherlands", "Growth"], fields: ["Food Security", "Water", "Health"], eligibility: ["International"], format: "Offline",
    description: "Contributing to a society’s sustainable and inclusive development in the Netherlands.",
    apply_link: "https://nuffic.nl"
  },
  {
    title: "Swedish Institute Scholarships", provider: "Sweden Gov", location: "Sweden", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "2025-02-15", amount: 40000, tags: ["Sweden", "Sustainability"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Providing opportunities for global professionals to develop their leadership skills.",
    apply_link: "https://si.se"
  },
  {
    title: "GKS (Global Korea Scholarship)", provider: "South Korea Gov", location: "South Korea", coverage: "Full Ride", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 25000, tags: ["South Korea", "Language"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Designed to provide international students with opportunities to study at higher educational institutions in Korea.",
    apply_link: "https://studyinkorea.go.kr"
  },
  {
    title: "SINGA Scholarship", provider: "A*STAR Singapore", location: "Singapore", coverage: "Full Ride", degreeLevel: ["PhD"], deadline: "2025-06-01", amount: 45000, tags: ["Singapore", "STEM"], fields: ["STEM", "Biomedical"], eligibility: ["International"], format: "Offline",
    description: "Award for international students with excellent academic undergraduate and/or master's results, and strong interest in doing research leading to a PhD.",
    apply_link: "https://a-star.edu.sg"
  },
  {
    title: "Taiwan MOE Scholarship", provider: "Taiwan Government", location: "Taiwan", coverage: "Stipend", degreeLevel: ["Undergraduate", "Graduate"], deadline: "2025-03-31", amount: 15000, tags: ["Taiwan", "Asia"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Encouraging outstanding international students to undertake degree studies in Taiwan.",
    apply_link: "https://edu.tw"
  },
  {
    title: "New Zealand Manaaki", provider: "NZ Government", location: "New Zealand", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "Varies", amount: 40000, tags: ["NZ", "Development"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Scholarships for international students from developing countries to study in New Zealand.",
    apply_link: "https://nzscholarships.govt.nz"
  },
  {
    title: "Australia Awards", provider: "Australia Gov", location: "Australia", coverage: "Full Ride", degreeLevel: ["Undergraduate", "Graduate"], deadline: "2024-04-30", amount: 50000, tags: ["Australia", "Leadership"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Long-term awards administered by the Department of Foreign Affairs and Trade.",
    apply_link: "https://dfat.gov.au"
  },
  {
    title: "Stipendium Hungaricum", provider: "Hungary Gov", location: "Hungary", coverage: "Full Ride", degreeLevel: ["All"], deadline: "2025-01-15", amount: 10000, tags: ["Hungary", "Europe"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "The most prestigious higher education scholarship program of the Hungarian Government.",
    apply_link: "https://stipendiumhungaricum.hu"
  },
  {
    title: "Yenching Academy", provider: "Peking University", location: "China", coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "2024-12-03", amount: 40000, tags: ["China", "Global Affairs"], fields: ["Chinese Studies", "Politics", "Law"], eligibility: ["International"], format: "Offline",
    description: "A fully funded residential program for a Master's in China Studies at Peking University.",
    apply_link: "https://yenchingacademy.pku.edu.cn"
  },
  {
    title: "Lester B. Pearson", provider: "University of Toronto", location: "Canada", coverage: "Full Ride", degreeLevel: ["Undergraduate"], deadline: "2024-11-30", amount: 180000, tags: ["Toronto", "High Prestige"], fields: ["All"], eligibility: ["International"], format: "Offline",
    description: "Recognizing international students who demonstrate exceptional academic achievement and creativity.",
    apply_link: "https://future.utoronto.ca"
  },
  {
    title: "President's Scholarship", provider: "Imperial College", location: "UK", coverage: "Full Ride", degreeLevel: ["PhD"], deadline: "Varies", amount: 60000, tags: ["Imperial", "STEM"], fields: ["STEM", "Medicine", "Business"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Rewarding students of any nationality who demonstrate the highest potential for doctoral research.",
    apply_link: "https://imperial.ac.uk"
  },
  {
    title: "Clarendon Scholarship", provider: "Oxford University", location: "UK", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "2025-01-20", amount: 70000, tags: ["Oxford", "Merit"], fields: ["All"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Supporting more than 160 graduate students at the University of Oxford every year.",
    apply_link: "https://ox.ac.uk/clarendon"
  },
  {
    title: "Gates Millenium", provider: "Gates Foundation", location: "USA", coverage: "Full Ride", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 150000, tags: ["USA", "Minority"], fields: ["STEM", "Education", "Health"], eligibility: ["Domestic"], format: "Universal",
    description: "Reducing financial barriers for African American, American Indian, Asian Pacific Islander, and Hispanic American students.",
    apply_link: "https://gmsp.org"
  },
  {
    title: "Jack Kent Cooke", provider: "JKC Foundation", location: "USA", coverage: "Partial", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 40000, tags: ["USA", "Need-Based"], fields: ["All"], eligibility: ["Domestic"], format: "Universal",
    description: "Dedicated to advancing the education of exceptionally promising students who have financial need.",
    apply_link: "https://jkcf.org"
  },
  {
    title: "Coca-Cola Scholars", provider: "Coca-Cola Co.", location: "USA", coverage: "Grant", degreeLevel: ["Undergraduate"], deadline: "2024-10-31", amount: 20000, tags: ["USA", "High School"], fields: ["All"], eligibility: ["Domestic"], format: "Universal",
    description: "Achievement-based scholarship awarded to graduating high school seniors.",
    apply_link: "https://coca-colascholarsfoundation.org"
  },
  {
    title: "National Merit", provider: "NMSC", location: "USA", coverage: "Grant", degreeLevel: ["Undergraduate"], deadline: "Varies", amount: 2500, tags: ["USA", "PSAT"], fields: ["All"], eligibility: ["Domestic"], format: "Universal",
    description: "A prestigious academic competition for recognition and scholarships.",
    apply_link: "https://nationalmerit.org"
  },
  {
    title: "Truman Scholarship", provider: "Truman Foundation", location: "USA", coverage: "Grant", degreeLevel: ["Graduate"], deadline: "2025-02-04", amount: 30000, tags: ["Public Service", "USA"], fields: ["Public Policy", "Humanities"], eligibility: ["Domestic"], format: "Universal",
    description: "For juniors in college who show exceptional leadership potential and are committed to careers in public service.",
    apply_link: "https://truman.gov"
  },
  {
    title: "Goldwater Scholarship", provider: "Goldwater Foundation", location: "USA", coverage: "Grant", degreeLevel: ["Undergraduate"], deadline: "2025-01-31", amount: 7500, tags: ["STEM", "Research", "USA"], fields: ["STEM"], eligibility: ["Domestic"], format: "Universal",
    description: "For students pursuing careers in the natural sciences, mathematics, and engineering.",
    apply_link: "https://goldwater.scholarsapply.org"
  },
  {
    title: "Udall Scholarship", provider: "Udall Foundation", location: "USA", coverage: "Grant", degreeLevel: ["Undergraduate"], deadline: "2025-03-05", amount: 7000, tags: ["Environment", "Native American"], fields: ["All"], eligibility: ["Domestic"], format: "Universal",
    description: "For students who demonstrate leadership and commitment to issues related to Native American nations or the environment.",
    apply_link: "https://udall.gov"
  },
  {
    title: "Mitchell Scholarship", provider: "US-Ireland Alliance", location: "Ireland", coverage: "Full Ride", degreeLevel: ["Graduate"], deadline: "2024-09-27", amount: 40000, tags: ["Ireland", "Exchange"], fields: ["All"], eligibility: ["Domestic"], format: "Offline",
    description: "Postgraduate study in Ireland and Northern Ireland.",
    apply_link: "https://us-irelandalliance.org"
  },
  {
    title: "Aga Khan (Small Grants)", provider: "AKF", location: "Central Asia", coverage: "Grant", degreeLevel: ["All"], deadline: "Rolling", amount: 5000, tags: ["Tajikistan", "Kyrgyzstan"], fields: ["Education", "Agri"], eligibility: ["International"], format: "Universal",
    description: "Supporting localized educational initiatives in the mountain regions of Central Asia.",
    apply_link: "https://akdn.org"
  },
  {
    title: "Friedrich Ebert Foundation", provider: "FES Germany", location: "Germany", coverage: "Stipend", degreeLevel: ["Undergraduate", "Graduate"], deadline: "Varies", amount: 15000, tags: ["Social Democracy", "Germany"], fields: ["Social Sciences", "Humanities", "Politics"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Supporting students with outstanding academic records who wish to contribute to social democracy.",
    apply_link: "https://fes.de"
  },
  {
    title: "Future Global Leaders", provider: "Hult Prize", location: "Global", coverage: "Grant", degreeLevel: ["Graduate"], deadline: "Varies", amount: 1000000, tags: ["Social Enterprise", "Grand Prize"], fields: ["Business", "Interdisciplinary"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "A global competition that challenges university students to solve the world’s most pressing issues.",
    apply_link: "https://hultprize.org"
  },
  {
    title: "Turing Award Research", provider: "ACM", location: "Global", coverage: "Grant", degreeLevel: ["PhD", "Research"], deadline: "Varies", amount: 1000000, tags: ["CS", "Research"], fields: ["STEM"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "Research grants associated with the highest distinction in computer science.",
    apply_link: "https://amturing.acm.org"
  },
  {
    title: "Presidential Scholarship", provider: "Various Unis", location: "Global", coverage: "Full Ride", degreeLevel: ["Undergraduate"], deadline: "Varies", amount: 200000, tags: ["Merit-Based", "Full Ride"], fields: ["All"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "Generic entry for university-specific presidential awards for top-scoring international students.",
    apply_link: "https://www.commonapp.org"
  },
  {
    title: "L'Oréal-UNESCO For Women", provider: "L'Oréal / UNESCO", location: "Global", coverage: "Stipend", degreeLevel: ["PhD", "Research"], deadline: "Varies", amount: 15000, tags: ["Women in Science", "Research"], fields: ["STEM", "Health"], eligibility: ["International"], format: "Offline",
    description: "Supporting outstanding women researchers who contribute to the progress of science.",
    apply_link: "https://forwomeninscience.com"
  },
  {
    title: "Boeing STEM Award", provider: "Boeing Co.", location: "USA / Global", coverage: "Grant", degreeLevel: ["Undergraduate"], deadline: "Varies", amount: 10000, tags: ["Aerospace", "STEM"], fields: ["STEM"], eligibility: ["Domestic", "International"], format: "Universal",
    description: "Grants for students studying aerospace and mechanical engineering.",
    apply_link: "https://boeing.com"
  },
  {
    title: "Google PhD Fellowship", provider: "Google", location: "Global", coverage: "Stipend", degreeLevel: ["PhD"], deadline: "2024-09-30", amount: 50000, tags: ["CS", "Research"], fields: ["STEM"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "Supporting graduate students doing exceptional work in computer science and related disciplines.",
    apply_link: "https://research.google/outreach/phd-fellowship"
  },
  {
    title: "Open Society Foundations", provider: "OSF", location: "Global", coverage: "Grant", degreeLevel: ["All"], deadline: "Rolling", amount: 20000, tags: ["Human Rights", "Policy"], fields: ["Humanities", "Law"], eligibility: ["International", "Domestic"], format: "Universal",
    description: "Grants for individuals working on projects that promote democratic values.",
    apply_link: "https://opensocietyfoundations.org"
  },
  {
    title: "Heinrich Böll Scholarships", provider: "Heinrich Böll Foundation", location: "Germany", coverage: "Stipend", degreeLevel: ["Graduate", "PhD"], deadline: "2025-03-01", amount: 18000, tags: ["Green Politics", "Sustainability"], fields: ["STEM", "Social Sciences", "Arts"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Awarding scholarships to international students who gain their university entrance qualification from a school outside Germany.",
    apply_link: "https://boell.de"
  },
  {
    title: "NSF Graduate Research Fellowship",
    featured: true,
    provider: "National Science Foundation",
    location: "USA",
    coverage: "Full Ride",
    degreeLevel: ["Graduate"],
    deadline: "2024-10-25",
    amount: 138000,
    description: "The NSF Graduate Research Fellowship Program (GRFP) helps ensure the vitality of the human resource base of science and engineering in the United States and reinforces its diversity. The program recognizes and supports outstanding graduate students in NSF-supported science, technology, engineering, and mathematics disciplines who are pursuing research-based master's and doctoral degrees at accredited United States institutions.",
    tags: ["STEM", "Research", "USA"],
    fields: ["Science", "Technology", "Engineering", "Mathematics"],
    special_features: ["Three years of financial support", "Annual stipend of $37,000", "Cost of education allowance of $16,000 to the institution"],
    noticableFacts: ["Prestigious NSF backing", "Research-focused", "Highly competitive"],
    apply_link: "https://www.nsfgrfp.org/",
  },
];

async function main() {
  console.log("Seeding scholarships data...\n");

  // Clear existing scholarships
  await prisma.contentScholarship.deleteMany();
  console.log("Cleared existing scholarships.");

  for (const s of scholarshipsData) {
    const { format, special_features, apply_link, noticableFacts, ...rest } = s as any;
    await prisma.contentScholarship.create({
      data: {
        ...rest,
        studyMode: format,
        specialFeatures: special_features || [],
        applyLink: apply_link,
        noticableFacts: noticableFacts || [],
      }
    });
  }

  const count = await prisma.contentScholarship.count();
  console.log(`✓ Created ${count} scholarships.`);
  console.log("\n✅ Scholarship seed complete!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
