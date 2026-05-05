// Seed script: Populate content tables (universities, programs, scholarships, fields, projects, roadmaps)
// Run with: npx tsx scripts/seed-content.ts

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

// ─── Universities ───
const universitiesData = [
  { 
    name: "Massachusetts Institute of Technology (MIT)", location: "Cambridge", country: "USA", ranking: 1, type: "Private", tuition: 60156, acceptance: 4, 
    logo: "https://www.google.com/s2/favicons?domain=mit.edu&sz=128", website: "https://mit.edu", 
    description: "MIT is a world-class institution known for its cutting-edge research and innovation in science, engineering, and technology.",
    image: "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200",
    specialFeatures: ["World-leading Robotics Lab", "OpenCourseWare Initiative", "Entrepreneurship Ecosystem"],
    noticableFacts: ["98 Nobel Laureates", "Birthplace of the World Wide Web consortium"],
    tags: ["STEM", "Ivy League", "Tech"]
  },
  { 
    name: "Imperial College London", location: "London", country: "UK", ranking: 2, type: "Public", tuition: 42000, acceptance: 14, 
    logo: "https://www.google.com/s2/favicons?domain=imperial.ac.uk&sz=128", website: "https://imperial.ac.uk", 
    description: "Imperial College London is a global top-ten university with a world-class reputation in science, engineering, business, and medicine.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200",
    specialFeatures: ["Innovation Hub in White City", "Strong Industry Ties", "Multidisciplinary Research"],
    noticableFacts: ["Focus exclusively on science, tech, and business", "Top ranked in the UK for graduate prospects"],
    tags: ["STEM", "Medicine", "London"]
  },
  { 
    name: "University of Oxford", location: "Oxford", country: "UK", ranking: 3, type: "Public", tuition: 45000, acceptance: 17, 
    logo: "https://www.google.com/s2/favicons?domain=ox.ac.uk&sz=128", website: "https://ox.ac.uk", 
    description: "The University of Oxford is the oldest university in the English-speaking world and is consistently ranked among the best.",
    image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1200",
    specialFeatures: ["Collegiate System", "Tutorial-based Learning", "Bodleian Library"],
    noticableFacts: ["Oldest university in the English-speaking world", "Produced 28 UK Prime Ministers"],
    tags: ["Prestige", "Research", "UK"]
  },
  { 
    name: "Harvard University", location: "Cambridge", country: "USA", ranking: 4, type: "Private", tuition: 59000, acceptance: 3, 
    logo: "https://www.google.com/s2/favicons?domain=harvard.edu&sz=128", website: "https://harvard.edu", 
    description: "Harvard is a world-renowned Ivy League institution known for its academic excellence and extensive library system.",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1200",
    specialFeatures: ["Largest Academic Library", "Global Alumni Network", "Interdisciplinary Research"],
    noticableFacts: ["Founded in 1636", "Oldest higher learning institution in US"],
    tags: ["Ivy League", "Law", "Business"]
  },
  { 
    name: "University of Cambridge", location: "Cambridge", country: "UK", ranking: 5, type: "Public", tuition: 48000, acceptance: 20, 
    logo: "https://www.google.com/s2/favicons?domain=cam.ac.uk&sz=128", website: "https://cam.ac.uk", 
    description: "Cambridge is one of the world's oldest and most prestigious universities, with a strong emphasis on research.",
    image: "https://images.unsplash.com/photo-1590490359854-dfba19688d70?q=80&w=1200",
    specialFeatures: ["Silicon Fen Tech Cluster", "Historical Colleges", "Scientific Breakthroughs"],
    noticableFacts: ["Discovery of DNA structure", "Sir Isaac Newton was an alum"],
    tags: ["Prestige", "STEM", "UK"]
  },
  { 
    name: "Stanford University", location: "Stanford", country: "USA", ranking: 6, type: "Private", tuition: 62000, acceptance: 4, 
    logo: "https://www.google.com/s2/favicons?domain=stanford.edu&sz=128", website: "https://stanford.edu", 
    description: "Stanford is located in the heart of Silicon Valley and is known for its entrepreneurial spirit and research.",
    image: "https://images.unsplash.com/photo-1532649538693-f3a2ec1bf8bd?q=80&w=1200",
    specialFeatures: ["Silicon Valley Proximity", "Entrepreneurial Culture", "Vast Campus"],
    noticableFacts: ["Birthplace of Google, Yahoo, and Nike founders", "Leading research in AI"],
    tags: ["Tech", "Business", "Innovation"]
  },
  { 
    name: "ETH Zurich", location: "Zurich", country: "Switzerland", ranking: 7, type: "Public", tuition: 1500, acceptance: 27, 
    logo: "https://logo.clearbit.com/ethz.ch", website: "https://ethz.ch", 
    description: "ETH Zurich is a leading science and technology university in continental Europe.",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200",
    specialFeatures: ["Continental Europe's Top Tech School", "World-class Research Facilities", "High Industry Collaboration"],
    noticableFacts: ["Albert Einstein was a student and professor here", "Very low tuition for high ranking"],
    tags: ["STEM", "Europe", "Low Tuition"]
  },
  { 
    name: "National University of Singapore (NUS)", location: "Singapore", country: "Singapore", ranking: 8, type: "Public", tuition: 38000, acceptance: 10, 
    logo: "https://logo.clearbit.com/nus.edu.sg", website: "https://nus.edu.sg", 
    description: "NUS is Asia's top-ranked university, offering a global approach to education and research.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200",
    specialFeatures: ["Asia's Innovation Hub", "Global Partnerships", "Diverse Campus Community"],
    noticableFacts: ["Consistently ranked #1 in Asia", "Strong focus on Smart City technology"],
    tags: ["Asia", "Global", "Business"]
  },
  { 
    name: "University College London (UCL)", location: "London", country: "UK", ranking: 9, type: "Public", tuition: 35000, acceptance: 29, 
    logo: "https://logo.clearbit.com/ucl.ac.uk", website: "https://ucl.ac.uk", 
    description: "UCL is London's global university, known for its diverse and multi-disciplinary environment.",
    image: "https://images.unsplash.com/photo-1525921429624-479b6a29d840?q=80&w=1200",
    specialFeatures: ["Multidisciplinary Excellence", "Central London Campus", "Global Outlook"],
    noticableFacts: ["First university in England to admit students regardless of religion", "Produced 34 Nobel Prize winners"],
    tags: ["London", "Diverse", "Research"]
  },
  { 
    name: "California Institute of Technology (Caltech)", location: "Pasadena", country: "USA", ranking: 10, type: "Private", tuition: 60000, acceptance: 3, 
    logo: "https://logo.clearbit.com/caltech.edu", website: "https://caltech.edu", 
    description: "Caltech is a world-renowned science and engineering research and education institution.",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=1200",
    specialFeatures: ["NASA Jet Propulsion Laboratory", "Seismological Laboratory", "High Faculty-Student Ratio"],
    noticableFacts: ["Smallest elite research university in US", "Manage's NASA's JPL"],
    tags: ["STEM", "NASA", "Research"]
  },
  { 
    name: "University of Toronto", location: "Toronto", country: "Canada", ranking: 11, type: "Public", tuition: 45000, acceptance: 43, 
    logo: "https://www.google.com/s2/favicons?domain=utoronto.ca&sz=128", website: "https://utoronto.ca", 
    description: "U of T is Canada's leading institution, known for its historic campus and research breakthroughs.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200",
    specialFeatures: ["Canada's Research Powerhouse", "Historic Collegiate System", "Urban Innovation"],
    noticableFacts: ["Discovery of insulin", "Largest academic library in Canada"],
    tags: ["Canada", "Medicine", "Public"]
  },
  { 
    name: "EPFL", location: "Lausanne", country: "Switzerland", ranking: 12, type: "Public", tuition: 1500, acceptance: 20, 
    logo: "https://www.google.com/s2/favicons?domain=epfl.ch&sz=128", website: "https://epfl.ch", 
    description: "EPFL is a world-leading science and technology institution located on the shores of Lake Geneva.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200",
    specialFeatures: ["Rolex Learning Center", "Swiss Data Science Center", "Lakefront Campus"],
    noticableFacts: ["One of the most international technical universities", "Strong focus on AI and Robotics"],
    tags: ["STEM", "Europe", "Robotics"]
  },
  { 
    name: "University of Pennsylvania", location: "Philadelphia", country: "USA", ranking: 13, type: "Private", tuition: 63000, acceptance: 6, 
    logo: "https://www.google.com/s2/favicons?domain=upenn.edu&sz=128", website: "https://upenn.edu", 
    description: "UPenn is an Ivy League institution famous for its interdisciplinary approach and the Wharton School.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200",
    specialFeatures: ["Wharton School of Business", "Perelman School of Medicine", "Urban Research Hub"],
    noticableFacts: ["Founded by Benjamin Franklin", "Home to the first university business school"],
    tags: ["Ivy League", "Business", "Medicine"]
  },
  { 
    name: "Cornell University", location: "Ithaca", country: "USA", ranking: 14, type: "Private", tuition: 65000, acceptance: 7, 
    logo: "https://www.google.com/s2/favicons?domain=cornell.edu&sz=128", website: "https://cornell.edu", 
    description: "Cornell is a private Ivy League research university and a land-grant institution.",
    image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=1200",
    specialFeatures: ["Diverse Academic Range", "Scenic Finger Lakes Campus", "Global Veterinary Excellence"],
    noticableFacts: ["First US university to offer major in Journalism", "Leading in sustainable agriculture"],
    tags: ["Ivy League", "Diverse", "Agriculture"]
  },
  { 
    name: "University of Melbourne", location: "Melbourne", country: "Australia", ranking: 15, type: "Public", tuition: 35000, acceptance: 70, 
    logo: "https://www.google.com/s2/favicons?domain=unimelb.edu.au&sz=128", website: "https://unimelb.edu.au", 
    description: "Melbourne is Australia's #1 university, known for the 'Melbourne Model' of education.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200",
    specialFeatures: ["The Melbourne Model", "Strong Research Culture", "Cultural Capital Advantage"],
    noticableFacts: ["Consistently ranked top in Australia", "Extensive global exchange network"],
    tags: ["Australia", "Public", "Global"]
  },
  { 
    name: "Peking University", location: "Beijing", country: "China", ranking: 16, type: "Public", tuition: 5000, acceptance: 1, 
    logo: "https://www.google.com/s2/favicons?domain=pku.edu.cn&sz=128", website: "https://pku.edu.cn", 
    description: "Peking University is China's oldest national university and a major research center.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200",
    specialFeatures: ["China's Modernization Leader", "Beautiful Traditional Campus", "Political and Social Impact"],
    noticableFacts: ["Historically the center of intellectual movements in China", "Extremely selective admissions"],
    tags: ["China", "Prestige", "History"]
  },
  { 
    name: "Yale University", location: "New Haven", country: "USA", ranking: 17, type: "Private", tuition: 64000, acceptance: 4, 
    logo: "https://www.google.com/s2/favicons?domain=yale.edu&sz=128", website: "https://yale.edu", 
    description: "Yale is an Ivy League university with a rich history in the arts, humanities, and social sciences.",
    image: "https://images.unsplash.com/photo-1622262981414-e0385c649744?q=80&w=1200",
    specialFeatures: ["Residential College System", "Beinecke Rare Book Library", "Elite Law School"],
    noticableFacts: ["Founded in 1701", "Produced 5 US Presidents"],
    tags: ["Ivy League", "Arts", "Law"]
  },
  { 
    name: "University of Hong Kong", location: "Hong Kong", country: "Hong Kong", ranking: 18, type: "Public", tuition: 23000, acceptance: 10, 
    logo: "https://www.google.com/s2/favicons?domain=hku.hk&sz=128", website: "https://hku.hk", 
    description: "HKU is Hong Kong's oldest and most prestigious institution of higher learning.",
    image: "https://images.unsplash.com/photo-1523281991720-6903e140306c?q=80&w=1200",
    specialFeatures: ["Global Financial Hub Proximity", "Bilingual Education", "High Global Rankings"],
    noticableFacts: ["Oldest higher education institution in HK", "Ranked #1 in HK"],
    tags: ["Hong Kong", "Business", "International"]
  },
  { 
    name: "Nanyang Technological University", location: "Singapore", country: "Singapore", ranking: 19, type: "Public", tuition: 35000, acceptance: 15, 
    logo: "https://www.google.com/s2/favicons?domain=ntu.edu.sg&sz=128", website: "https://ntu.edu.sg", 
    description: "NTU is a young, research-intensive university in Singapore, ranked among the best for technology.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200",
    specialFeatures: ["Smart Campus Initiative", "Joint Medical School with Imperial", "Leading in Material Science"],
    noticableFacts: ["Ranked world's best young university for 7 years", "Host to the Earth Observatory of Singapore"],
    tags: ["Singapore", "Tech", "Research"]
  },
  { 
    name: "Princeton University", location: "Princeton", country: "USA", ranking: 20, type: "Private", tuition: 59000, acceptance: 4, 
    logo: "https://www.google.com/s2/favicons?domain=princeton.edu&sz=128", website: "https://princeton.edu", 
    description: "Princeton is an Ivy League research university known for its commitment to undergraduate teaching.",
    image: "https://images.unsplash.com/photo-1590490359854-dfba19688d70?q=80&w=1200",
    specialFeatures: ["Undergraduate Research Focus", "Senior Thesis Requirement", "Institute for Advanced Study"],
    noticableFacts: ["Albert Einstein had an office here", "Top-ranked for undergraduate teaching"],
    tags: ["Ivy League", "Undergrad", "Research"]
  },
  { 
    name: "Tsinghua University", location: "Beijing", country: "China", ranking: 21, type: "Public", tuition: 6000, acceptance: 2, 
    logo: "https://www.google.com/s2/favicons?domain=tsinghua.edu.cn&sz=128", website: "https://tsinghua.edu.cn", 
    description: "Tsinghua is one of China's most prestigious universities, particularly renowned for engineering and computer science.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200",
    specialFeatures: ["Leading Engineering Research", "Innovation Hub", "Global Leadership Programs"],
    noticableFacts: ["Ranked #1 for Engineering globally", "Highly selective C9 League member"],
    tags: ["China", "STEM", "Prestige"]
  },
  { 
    name: "University of Chicago", location: "Chicago", country: "USA", ranking: 22, type: "Private", tuition: 64000, acceptance: 5, 
    logo: "https://www.google.com/s2/favicons?domain=uchicago.edu&sz=128", website: "https://uchicago.edu", 
    description: "UChicago is famous for its rigorous 'Core Curriculum' and its influence on economics and law.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200",
    specialFeatures: ["Rigorous Core Curriculum", "Nobel Prize Powerhouse", "Hyde Park Campus"],
    noticableFacts: ["97 Nobel Laureates associated", "Birthplace of first controlled nuclear reaction"],
    tags: ["Economics", "Core Curriculum", "USA"]
  },
  { 
    name: "Seoul National University", location: "Seoul", country: "South Korea", ranking: 23, type: "Public", tuition: 7000, acceptance: 15, 
    logo: "https://www.google.com/s2/favicons?domain=snu.ac.kr&sz=128", website: "https://snu.ac.kr", 
    description: "SNU is the most prestigious national university in South Korea, known for its academic rigor.",
    image: "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200",
    specialFeatures: ["Korea's Top National Uni", "Vibrant Campus Life", "High Graduate Employability"],
    noticableFacts: ["Part of the SKY universities", "Located at the base of Gwanak Mountain"],
    tags: ["Korea", "Public", "Prestige"]
  },
  { 
    name: "Université PSL", location: "Paris", country: "France", ranking: 24, type: "Public", tuition: 300, acceptance: 10, 
    logo: "https://www.google.com/s2/favicons?domain=psl.eu&sz=128", website: "https://psl.eu", 
    description: "PSL is a collegiate university in Paris, bringing together elite French institutions.",
    image: "https://images.unsplash.com/photo-1525921429624-479b6a29d840?q=80&w=1200",
    specialFeatures: ["Elite French Research", "Latin Quarter Location", "Multi-institution collaboration"],
    noticableFacts: ["Home to the ENS and Mines Paris", "Top-ranked in France"],
    tags: ["France", "Europe", "Research"]
  },
  { 
    name: "University of Edinburgh", location: "Edinburgh", country: "UK", ranking: 25, type: "Public", tuition: 30000, acceptance: 45, 
    logo: "https://www.google.com/s2/favicons?domain=ed.ac.uk&sz=128", website: "https://ed.ac.uk", 
    description: "Edinburgh is one of the UK's oldest and most prestigious universities, located in the heart of Scotland.",
    image: "https://images.unsplash.com/photo-1590490359854-dfba19688d70?q=80&w=1200",
    specialFeatures: ["Scottish Enlightenment Heritage", "UNESCO World Heritage Site", "Leading AI Research"],
    noticableFacts: ["Charles Darwin and David Hume were alums", "One of the top universities for AI"],
    tags: ["Scotland", "History", "UK"]
  },
  { 
    name: "KAIST", location: "Daejeon", country: "South Korea", ranking: 26, type: "Public", tuition: 8000, acceptance: 15, 
    logo: "https://www.google.com/s2/favicons?domain=kaist.ac.kr&sz=128", website: "https://kaist.ac.kr", 
    description: "KAIST is South Korea's premier research university for science and technology.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200",
    specialFeatures: ["Research-First Culture", "English-Medium Instruction", "Innovation Hub"],
    noticableFacts: ["Modelled after MIT", "Leading in semiconductors and robotics"],
    tags: ["Korea", "STEM", "Tech"]
  },
  { 
    name: "McGill University", location: "Montreal", country: "Canada", ranking: 27, type: "Public", tuition: 40000, acceptance: 40, 
    logo: "https://www.google.com/s2/favicons?domain=mcgill.ca&sz=128", website: "https://mcgill.ca", 
    description: "McGill is a world-renowned Canadian university located in vibrant Montreal.",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200",
    specialFeatures: ["Medical-Ph.D. Excellence", "Bilingual Environment", "International Student Base"],
    noticableFacts: ["Produced 12 Nobel Laureates", "Discovery of atomic disintegration"],
    tags: ["Canada", "International", "Medicine"]
  },
  { 
    name: "Australian National University", location: "Canberra", country: "Australia", ranking: 28, type: "Public", tuition: 38000, acceptance: 35, 
    logo: "https://www.google.com/s2/favicons?domain=anu.edu.au&sz=128", website: "https://anu.edu.au", 
    description: "ANU is Australia's national university, known for its research and excellence in social sciences.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200",
    specialFeatures: ["National Policy Influence", "High Research Output", "Canberra Location"],
    noticableFacts: ["Only university created by the Federal Parliament", "Top-ranked for Politics and Law"],
    tags: ["Australia", "Politics", "Research"]
  },
  { 
    name: "Sorbonne University", location: "Paris", country: "France", ranking: 29, type: "Public", tuition: 300, acceptance: 15, 
    logo: "https://www.google.com/s2/favicons?domain=sorbonne-universite.fr&sz=128", website: "https://sorbonne-universite.fr", 
    description: "Sorbonne is a world-class research university in Paris, inheriting centuries of academic tradition.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200",
    specialFeatures: ["Centuries of Heritage", "Parisian Intellectual Hub", "Leading Humanities and Science"],
    noticableFacts: ["Successor to the University of Paris", "Marie Curie was a professor here"],
    tags: ["France", "Heritage", "Research"]
  },
  { 
    name: "University of Tokyo", location: "Tokyo", country: "Japan", ranking: 30, type: "Public", tuition: 4000, acceptance: 10, 
    logo: "https://www.google.com/s2/favicons?domain=u-tokyo.ac.jp&sz=128", website: "https://u-tokyo.ac.jp", 
    description: "UTokyo is Japan's most prestigious university, known for producing top leaders and scientists.",
    image: "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200",
    specialFeatures: ["Japan's Premier Research", "Red Gate Landmark", "Hongo Campus"],
    noticableFacts: ["Produced 15 Prime Ministers of Japan", "Consistently ranked #1 in Japan"],
    tags: ["Japan", "Prestige", "Leader"]
  },
  { 
    name: "Technical University of Munich", location: "Munich", country: "Germany", ranking: 31, type: "Public", tuition: 0, acceptance: 8, 
    logo: "https://www.google.com/s2/favicons?domain=tum.de&sz=128", website: "https://tum.de", 
    description: "TUM is Germany's top-ranked technical university, known for excellence in engineering and science.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200",
    specialFeatures: ["German Engineering Excellence", "No Tuition for International Students", "Munich Tech Hub"],
    noticableFacts: ["Ranked world's top university for Industry 4.0", "Highly selective engineering programs"],
    tags: ["Germany", "Free Tuition", "STEM"]
  },
  { 
    name: "Delft University of Technology", location: "Delft", country: "Netherlands", ranking: 32, type: "Public", tuition: 18000, acceptance: 30, 
    logo: "https://www.google.com/s2/favicons?domain=tudelft.nl&sz=128", website: "https://tudelft.nl", 
    description: "TU Delft is the oldest and largest Dutch public technical university, world-famous for architecture.",
    image: "https://images.unsplash.com/photo-1525921429624-479b6a29d840?q=80&w=1200",
    specialFeatures: ["Architecture & Design Leader", "Hydraulic Engineering Excellence", "Sustainable Tech Focus"],
    noticableFacts: ["Ranked #3 in the world for Architecture", "Leader in quantum computing in Europe"],
    tags: ["Netherlands", "Architecture", "Design"]
  },
];

// ─── Fields ───
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

// ─── Scholarships ───
const scholarshipsData = [
  { title: "The Gates Scholarship", provider: "Gates Foundation", location: "USA", coverage: "Full Ride", degreeLevel: "Undergraduate", deadline: "2024-09-15", amount: 200000, description: "A highly selective, last-dollar scholarship for outstanding, minority, high school seniors from low-income households.", tags: ["Full Ride", "Need-Based"], applyLink: "https://thegatesscholarship.org" },
  { title: "Rhodes Scholarship", provider: "Rhodes Trust", location: "UK (Oxford)", coverage: "Full Ride", degreeLevel: "Graduate", deadline: "2024-10-01", amount: 75000, description: "The oldest and perhaps most prestigious international scholarship program, supporting students at the University of Oxford.", tags: ["Prestige", "Leadership"], applyLink: "https://rhodeshouse.ox.ac.uk" },
  { title: "Fulbright Program", provider: "U.S. Department of State", location: "USA / Global", coverage: "Full Ride", degreeLevel: "Graduate", deadline: "2024-10-11", amount: 50000, description: "The flagship international educational exchange program sponsored by the U.S. government.", tags: ["Cultural Exchange", "Research"], applyLink: "https://fulbrightprogram.org" },
  { title: "Chevening Scholarships", provider: "UK Government", location: "UK", coverage: "Full Ride", degreeLevel: "Master's", deadline: "2024-11-05", amount: 45000, description: "The UK government's international awards program aimed at developing global leaders.", tags: ["Global Leaders", "Networking"], applyLink: "https://chevening.org" },
  { title: "Schwarzman Scholars", provider: "Schwarzman Trust", location: "China", coverage: "Full Ride", degreeLevel: "Master's", deadline: "2024-09-19", amount: 80000, description: "Designed to prepare the next generation of global leaders to respond to the geopolitical landscape of the 21st Century.", tags: ["Leadership", "Geopolitics"], applyLink: "https://schwarzmanscholars.org" },
  { title: "Knight-Hennessy Scholars", provider: "Stanford University", location: "USA", coverage: "Full Ride", degreeLevel: "Graduate", deadline: "2024-10-11", amount: 90000, description: "A multidisciplinary community of graduate students at Stanford University.", tags: ["Multidisciplinary", "Stanford"], applyLink: "https://knight-hennessy.stanford.edu" },
  { title: "DAAD Scholarships", provider: "DAAD Germany", location: "Germany", coverage: "Stipend", degreeLevel: "Graduate", deadline: "Varies", amount: 15000, description: "Supporting international students to study or conduct research in Germany.", tags: ["Germany", "STEM", "Humanities"], applyLink: "https://daad.de" },
  { title: "Eiffel Excellence Scholarship", provider: "French Government", location: "France", coverage: "Stipend", degreeLevel: "Master's", deadline: "2025-01-10", amount: 18000, description: "A tool developed by the Ministry for Europe and Foreign Affairs to enable French higher education institutions to attract top foreign students.", tags: ["France", "Excellence"], applyLink: "https://campusfrance.org" },
  { title: "MEXT Scholarship", provider: "Japanese Government", location: "Japan", coverage: "Full Ride", degreeLevel: "Undergraduate", deadline: "Varies", amount: 20000, description: "The Japanese government scholarship program for international students to study in Japan.", tags: ["Japan", "Cultural"], applyLink: "https://mext.go.jp" },
  { title: "Erasmus Mundus", provider: "European Union", location: "Europe", coverage: "Full Ride", degreeLevel: "Master's", deadline: "Varies", amount: 50000, description: "Joint master's degrees offered by consortia of European universities.", tags: ["Europe", "Joint Degree"], applyLink: "https://erasmusmundus.eu" },
];

// ─── Programs ───
const programsData = [
  { title: "Computer Science & Engineering", university: "MIT", location: "Cambridge, USA", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 60156, duration: "4 years", description: "A rigorous program covering algorithms, systems, AI, and software engineering with hands-on lab experience.", tags: ["STEM", "Top-Ranked"], applyLink: "https://mit.edu/admissions" },
  { title: "MBA", university: "Harvard Business School", location: "Boston, USA", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 75000, duration: "2 years", description: "World's most prestigious MBA program with case-method teaching and global network.", tags: ["Business", "Leadership"], applyLink: "https://hbs.edu/mba" },
  { title: "Medicine (MBBS)", university: "University of Oxford", location: "Oxford, UK", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 45000, duration: "6 years", description: "Oxford's medical program combines pre-clinical and clinical training with world-class research.", tags: ["Medical", "Research"], applyLink: "https://ox.ac.uk/admissions/medicine" },
  { title: "Data Science & AI", university: "Stanford University", location: "Stanford, USA", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 62000, duration: "2 years", description: "Advanced program covering machine learning, deep learning, NLP, and big data analytics.", tags: ["AI", "Data"], applyLink: "https://stanford.edu/admissions" },
  { title: "Mechanical Engineering", university: "ETH Zurich", location: "Zurich, Switzerland", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 1500, duration: "3 years", description: "Comprehensive engineering program with focus on mechanics, thermodynamics, and design.", tags: ["Engineering", "STEM"], applyLink: "https://ethz.ch/admissions" },
  { title: "International Relations", university: "LSE", location: "London, UK", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 26000, duration: "1 year", description: "Study global politics, diplomacy, and international law at one of the world's leading social science universities.", tags: ["Social Sciences", "Global"], applyLink: "https://lse.ac.uk/admissions" },
  { title: "Architecture", university: "TU Delft", location: "Delft, Netherlands", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 18000, duration: "3 years", description: "Renowned architecture program focusing on sustainable design, urban planning, and building technology.", tags: ["Design", "Sustainable"], applyLink: "https://tudelft.nl/admissions" },
  { title: "Biotechnology", university: "University of Cambridge", location: "Cambridge, UK", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 48000, duration: "1 year", description: "Advanced study of molecular biology, genetic engineering, and bioprocessing.", tags: ["Bio", "STEM"], applyLink: "https://cam.ac.uk/admissions" },
  { title: "Law (LLB)", university: "Yale University", location: "New Haven, USA", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 64000, duration: "3 years", description: "Yale's law program is renowned for its interdisciplinary approach and legal scholarship.", tags: ["Law", "Prestige"], applyLink: "https://yale.edu/admissions" },
  { title: "Aerospace Engineering", university: "Caltech", location: "Pasadena, USA", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 60000, duration: "2 years", description: "Cutting-edge program in aeronautics, spacecraft design, and propulsion systems.", tags: ["Aerospace", "STEM"], applyLink: "https://caltech.edu/admissions" },
  { title: "Psychology", university: "UCL", location: "London, UK", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 35000, duration: "3 years", description: "UCL's psychology program is ranked #1 in the UK, covering cognitive, clinical, and developmental psychology.", tags: ["Psychology", "Cognitive"], applyLink: "https://ucl.ac.uk/admissions" },
  { title: "Environmental Science", university: "University of Toronto", location: "Toronto, Canada", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 45000, duration: "4 years", description: "Interdisciplinary program studying climate change, conservation, and sustainable resource management.", tags: ["Environment", "Climate"], applyLink: "https://utoronto.ca/admissions" },
  { title: "Finance", university: "Wharton (UPenn)", location: "Philadelphia, USA", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 63000, duration: "4 years", description: "The world's leading undergraduate business program with a rigorous finance curriculum.", tags: ["Finance", "Business"], applyLink: "https://wharton.upenn.edu" },
  { title: "Physics", university: "Princeton University", location: "Princeton, USA", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 59000, duration: "4 years", description: "Princeton's physics program is renowned for its contributions to fundamental physics and Nobel laureates.", tags: ["Physics", "STEM"], applyLink: "https://princeton.edu/admissions" },
  { title: "Digital Marketing", university: "NYU", location: "New York, USA", degreeLevel: "Master's", studyMode: "Online", tuition: 40000, duration: "1.5 years", description: "Learn SEO, SEM, social media strategy, and data-driven marketing at a global media hub.", tags: ["Marketing", "Digital"], applyLink: "https://nyu.edu/admissions" },
  { title: "Cybersecurity", university: "CMU", location: "Pittsburgh, USA", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 50000, duration: "2 years", description: "Top-ranked program covering network security, cryptography, and ethical hacking.", tags: ["Security", "STEM"], applyLink: "https://cmu.edu/admissions" },
  { title: "Nursing", university: "Johns Hopkins University", location: "Baltimore, USA", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 58000, duration: "4 years", description: "America's #1 nursing school with clinical rotations at world-class hospitals.", tags: ["Healthcare", "Nursing"], applyLink: "https://jhu.edu/admissions" },
  { title: "Chemical Engineering", university: "UC Berkeley", location: "Berkeley, USA", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 48000, duration: "4 years", description: "Top public university program combining chemistry, physics, and engineering principles.", tags: ["Engineering", "STEM"], applyLink: "https://berkeley.edu/admissions" },
  { title: "Artificial Intelligence", university: "Carnegie Mellon University", location: "Pittsburgh, USA", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 52000, duration: "2 years", description: "World's first AI degree program, covering machine learning, robotics, and NLP.", tags: ["AI", "Machine Learning"], applyLink: "https://cmu.edu/admissions" },
  { title: "Economics", university: "University of Chicago", location: "Chicago, USA", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 64000, duration: "4 years", description: "Home to the Chicago School of Economics, with a focus on rigorous quantitative analysis.", tags: ["Economics", "Social Sciences"], applyLink: "https://uchicago.edu/admissions" },
  { title: "Pharmacy", university: "UCL", location: "London, UK", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 35000, duration: "4 years", description: "UCL School of Pharmacy is one of the oldest and most respected pharmacy schools in the UK.", tags: ["Pharmacy", "Healthcare"], applyLink: "https://ucl.ac.uk/admissions" },
  { title: "Film Production", university: "USC", location: "Los Angeles, USA", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 60000, duration: "4 years", description: "USC School of Cinematic Arts is the premier film school in the world.", tags: ["Film", "Creative"], applyLink: "https://usc.edu/admissions" },
  { title: "Civil Engineering", university: "Tsinghua University", location: "Beijing, China", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 6000, duration: "4 years", description: "China's top engineering program with world-class infrastructure and research facilities.", tags: ["Engineering", "Infrastructure"], applyLink: "https://tsinghua.edu.cn/admissions" },
  { title: "Political Science", university: "Sciences Po", location: "Paris, France", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 15000, duration: "3 years", description: "Europe's leading institution for political science and international affairs.", tags: ["Politics", "International"], applyLink: "https://sciencespo.fr/admissions" },
  { title: "Music Performance", university: "Berklee College of Music", location: "Boston, USA", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 45000, duration: "4 years", description: "World's largest independent music college, known for contemporary music and performance.", tags: ["Music", "Creative"], applyLink: "https://berklee.edu/admissions" },
  { title: "Data Science", university: "University of Melbourne", location: "Melbourne, Australia", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 35000, duration: "2 years", description: "Comprehensive data science program covering statistics, ML, and big data technologies.", tags: ["Data", "STEM"], applyLink: "https://unimelb.edu.au/admissions" },
  { title: "Robotics", university: "ETH Zurich", location: "Zurich, Switzerland", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 1500, duration: "2 years", description: "Advanced robotics program covering autonomous systems, control theory, and AI.", tags: ["Robotics", "STEM"], applyLink: "https://ethz.ch/admissions" },
  { title: "Journalism", university: "Columbia University", location: "New York, USA", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 65000, duration: "1 year", description: "Pulitzer-winning journalism school offering intensive reporting and multimedia training.", tags: ["Journalism", "Media"], applyLink: "https://columbia.edu/admissions" },
  { title: "Urban Planning", university: "MIT", location: "Cambridge, USA", degreeLevel: "Master's", studyMode: "On-Campus", tuition: 60000, duration: "2 years", description: "MIT's DUSP is the world's leading urban planning program with a focus on technology and policy.", tags: ["Urban", "Design"], applyLink: "https://mit.edu/admissions" },
  { title: "Veterinary Science", university: "University of Cambridge", location: "Cambridge, UK", degreeLevel: "Bachelor's", studyMode: "On-Campus", tuition: 48000, duration: "6 years", description: "Cambridge's veterinary program is one of the most prestigious in the world.", tags: ["Veterinary", "Healthcare"], applyLink: "https://cam.ac.uk/admissions" },
];

// ─── Projects ───
const projectsData = [
  { title: "AI-Powered Study Assistant", creator: "BraineX Labs", difficulty: "Intermediate", category: "Technology", status: "Open to Join", duration: "3 months", description: "Build an AI assistant that helps students create personalized study plans and track progress using NLP.", tags: ["AI", "Education"] },
  { title: "Scholarship Finder App", creator: "BraineX Labs", difficulty: "Beginner", category: "Technology", status: "Open to Join", duration: "2 months", description: "Develop a mobile app that matches students with scholarships based on their profile and preferences.", tags: ["Mobile", "Education"] },
  { title: "University Comparison Tool", creator: "BraineX Labs", difficulty: "Intermediate", category: "Technology", status: "In Progress", duration: "4 months", description: "Create an interactive web tool that allows students to compare universities across multiple metrics.", tags: ["Web", "Data"] },
  { title: "Mentorship Platform", creator: "BraineX Labs", difficulty: "Advanced", category: "Technology", status: "Planning", duration: "6 months", description: "Build a platform connecting students with mentors for career guidance and academic support.", tags: ["Platform", "Community"] },
  { title: "Study Group Finder", creator: "BraineX Labs", difficulty: "Beginner", category: "Technology", status: "Open to Join", duration: "1 month", description: "A simple app that helps students find and create study groups based on courses and location.", tags: ["Social", "Education"] },
  { title: "Research Paper Analyzer", creator: "BraineX Labs", difficulty: "Advanced", category: "Technology", status: "Open to Join", duration: "5 months", description: "Use ML to analyze and summarize academic papers, extracting key findings and methodologies.", tags: ["ML", "Research"] },
  { title: "Career Path Visualizer", creator: "BraineX Labs", difficulty: "Intermediate", category: "Technology", status: "In Progress", duration: "3 months", description: "Interactive visualization tool showing career paths, required skills, and salary projections.", tags: ["Visualization", "Career"] },
  { title: "Language Exchange Platform", creator: "BraineX Labs", difficulty: "Intermediate", category: "Technology", status: "Open to Join", duration: "4 months", description: "Connect students for language exchange with integrated video chat and learning resources.", tags: ["Language", "Social"] },
  { title: "Exam Prep Gamification", creator: "BraineX Labs", difficulty: "Beginner", category: "Technology", status: "Open to Join", duration: "2 months", description: "Turn exam preparation into a game with quizzes, leaderboards, and achievement badges.", tags: ["Gamification", "Education"] },
  { title: "Global Internship Database", creator: "BraineX Labs", difficulty: "Intermediate", category: "Technology", status: "Planning", duration: "3 months", description: "Curated database of internship opportunities worldwide with application tracking.", tags: ["Database", "Career"] },
];

// ─── Roadmaps ───
const roadmapsData = [
  { 
    title: "Computer Science Fundamentals", path: "Frontend", level: "Beginner", time: "6 months", modules: 8, 
    description: "A comprehensive roadmap for beginners to learn computer science fundamentals.", 
    tags: ["CS", "Beginner"], tips: ["Practice coding daily"], 
    color: "#6366f1",
    steps: [
      { title: "Introduction to Programming", items: ["Variables", "Loops", "Functions"] },
      { title: "Data Structures", items: ["Arrays", "Linked Lists", "Stacks"] },
      { title: "Algorithms", items: ["Sorting", "Searching", "Recursion"] }
    ]
  },
  { 
    title: "Full-Stack Web Development", path: "Frontend", level: "Intermediate", time: "12 months", modules: 12, 
    description: "Master frontend and backend development with modern frameworks.", 
    tags: ["Web", "Full-Stack"], tips: ["Build a portfolio"],
    color: "#f43f5e",
    steps: [
      { title: "Frontend Mastery", items: ["React", "CSS Grid", "State Management"] },
      { title: "Backend Infrastructure", items: ["Node.js", "Express", "PostgreSQL"] },
      { title: "Deployment", items: ["Docker", "CI/CD", "AWS"] }
    ]
  },
  { 
    title: "Data Science & Machine Learning", path: "AI & Data", level: "Intermediate", time: "12 months", modules: 10, 
    description: "From statistics to deep learning.", 
    tags: ["Data Science", "ML"], tips: ["Practice on Kaggle"],
    color: "#10b981",
    steps: [
      { title: "Mathematics", items: ["Linear Algebra", "Calculus", "Statistics"] },
      { title: "Machine Learning", items: ["Regression", "Classification", "Clustering"] }
    ]
  },
];

async function main() {
  console.log("Seeding content data...\n");

  // Clear existing data
  await prisma.contentUniversity.deleteMany();
  await prisma.contentField.deleteMany();
  await prisma.contentScholarship.deleteMany();
  await prisma.contentProgram.deleteMany();
  await prisma.contentProject.deleteMany();
  await prisma.contentRoadmap.deleteMany();
  console.log("Cleared existing content.\n");

  // Seed universities
  for (const u of universitiesData) {
    await prisma.contentUniversity.create({ data: u });
  }
  console.log(`✓ Created ${universitiesData.length} universities`);

  // Seed fields
  for (const f of fieldsData) {
    await prisma.contentField.create({ data: f });
  }
  console.log(`✓ Created ${fieldsData.length} fields`);

  // Seed scholarships
  for (const s of scholarshipsData) {
    await prisma.contentScholarship.create({ data: s });
  }
  console.log(`✓ Created ${scholarshipsData.length} scholarships`);

  // Seed programs
  for (const p of programsData) {
    await prisma.contentProgram.create({ data: p });
  }
  console.log(`✓ Created ${programsData.length} programs`);

  // Seed projects
  for (const p of projectsData) {
    await prisma.contentProject.create({ data: p });
  }
  console.log(`✓ Created ${projectsData.length} projects`);

  // Seed roadmaps
  for (const r of roadmapsData) {
    await prisma.contentRoadmap.create({ data: r });
  }
  console.log(`✓ Created ${roadmapsData.length} roadmaps`);

  console.log("\n✅ Content seed complete!");
  console.log(`   Total: ${universitiesData.length + fieldsData.length + scholarshipsData.length + programsData.length + projectsData.length + roadmapsData.length} items`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
