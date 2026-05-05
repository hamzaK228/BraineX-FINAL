import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in environment variables.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const fieldsData = [
  {
    title: "Software Engineering",
    category: "stem",
    icon: "💻",
    description: "Software engineering is the systematic application of engineering approaches to the development of software.",
    salary: "$120k - $250k",
    growth: "+25% (Very High)",
    demand: "Critical",
    topUnis: "MIT, Stanford, CMU",
    tags: ["Coding", "Architecture", "Cloud"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200",
  },
  {
    title: "Data Science & AI",
    category: "stem",
    icon: "🤖",
    description: "Extracting insights from data using statistics, machine learning, and deep learning technologies.",
    salary: "$110k - $220k",
    growth: "+36% (Explosive)",
    demand: "High",
    topUnis: "Stanford, Berkeley, MIT",
    tags: ["Machine Learning", "Python", "Math"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200",
  },
  {
    title: "Cybersecurity",
    category: "stem",
    icon: "🛡️",
    description: "Protecting systems, networks, and programs from digital attacks and unauthorized access.",
    salary: "$105k - $210k",
    growth: "+33% (Very High)",
    demand: "High",
    topUnis: "CMU, Georgia Tech, MIT",
    tags: ["Security", "Network", "Linux"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
  },
  {
    title: "Investment Banking",
    category: "business",
    icon: "📈",
    description: "Financial services that help companies and governments raise capital and provide advisory services for M&A.",
    salary: "$150k - $400k+",
    growth: "+10% (Stable)",
    demand: "Very High",
    topUnis: "UPenn (Wharton), Harvard, LSE",
    tags: ["Finance", "M&A", "Capital Markets"],
    image: "https://images.unsplash.com/photo-1611974717482-48a4c3d756ae?q=80&w=1200",
  },
  {
    title: "Product Design (UI/UX)",
    category: "creative",
    icon: "🎨",
    description: "Creating digital experiences that are both beautiful and functional through user-centered design.",
    salary: "$90k - $180k",
    growth: "+20% (High)",
    demand: "Medium",
    topUnis: "RISD, Parsons, Stanford",
    tags: ["Figma", "UX", "Psychology"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200",
  },
  {
    title: "Molecular Biology",
    category: "health",
    icon: "🧬",
    description: "The branch of biology that concerns the molecular basis of biological activity in and between cells.",
    salary: "$85k - $160k",
    growth: "+15% (High)",
    demand: "Medium",
    topUnis: "Harvard, Johns Hopkins, Cambridge",
    tags: ["Genetics", "Research", "Medicine"],
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1200",
  },
  {
    title: "International Law",
    category: "humanities",
    icon: "⚖️",
    description: "Rules, norms, and standards generally accepted in relations between nations.",
    salary: "$100k - $220k",
    growth: "+10% (Steady)",
    demand: "High",
    topUnis: "Yale, Oxford, Harvard",
    tags: ["Policy", "Diplomacy", "Ethics"],
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200",
  },
  {
    title: "Robotics Engineering",
    category: "stem",
    icon: "🦾",
    description: "Design, construction, and operation of robots to automate tasks and solve complex problems.",
    salary: "$110k - $200k",
    growth: "+18% (High)",
    demand: "Medium",
    topUnis: "MIT, CMU, Stanford",
    tags: ["Hardware", "AI", "Control Systems"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200",
  }
];

const programsData = [
  {
    title: "Computer Science (B.S.)",
    university: "MIT",
    location: "Cambridge, USA",
    degreeLevel: "Bachelor's",
    studyMode: "On-Campus",
    tuition: 58000,
    duration: "4 Years",
    description: "The flagship computer science program focusing on theoretical foundations and practical engineering.",
    tags: ["STEM", "High Prestige", "Research-Heavy"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200",
    specialFeatures: ["Undergraduate Research Opportunities (UROP)", "World-class faculty", "Strong industry connections"],
    noticableFacts: ["#1 QS World Ranking", "Highest graduate starting salaries", "Rigorous academic environment"],
    applyLink: "https://mit.edu",
  },
  {
    title: "MBA Program",
    university: "Harvard University",
    location: "Boston, USA",
    degreeLevel: "Master's",
    studyMode: "On-Campus",
    tuition: 75000,
    duration: "2 Years",
    description: "A world-renowned leadership program using the case method to build general management skills.",
    tags: ["Business", "Leadership", "Networking"],
    image: "https://images.unsplash.com/photo-1523050335456-c9948906028a?q=80&w=1200",
    specialFeatures: ["Case Method teaching", "Global immersion projects", "Extensive alumni network"],
    noticableFacts: ["Most CEOs are Harvard MBAs", "Average starting package ~$175k", "Ivy League prestige"],
    applyLink: "https://hbs.edu",
  },
  {
    title: "Theoretical Physics (MSc)",
    university: "Oxford University",
    location: "Oxford, UK",
    degreeLevel: "Master's",
    studyMode: "On-Campus",
    tuition: 35000,
    duration: "1 Year",
    description: "Intensive graduate study of the fundamental laws governing the universe.",
    tags: ["Science", "Research", "UK"],
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1200",
    specialFeatures: ["Tutorial-based learning", "Access to CERN research", "One-on-one supervision"],
    noticableFacts: ["Oldest university in English-speaking world", "Rhodes Scholarship destination", "Historic campus"],
    applyLink: "https://ox.ac.uk",
  },
  {
    title: "Artificial Intelligence (MS)",
    university: "Stanford University",
    location: "Stanford, USA",
    degreeLevel: "Master's",
    studyMode: "On-Campus",
    tuition: 60000,
    duration: "1.5 - 2 Years",
    description: "Leading research in machine learning, NLP, and computer vision in the heart of Silicon Valley.",
    tags: ["AI", "Silicon Valley", "Innovation"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200",
    specialFeatures: ["Proximity to Google/Meta", "Stanford AI Lab (SAIL)", "Entrepreneurship ecosystem"],
    noticableFacts: ["Top choice for tech founders", "Highly selective admission", "Pioneer in modern AI"],
    applyLink: "https://stanford.edu",
  },
  {
    title: "Data Science (Online Master's)",
    university: "Georgia Tech",
    location: "Online",
    degreeLevel: "Master's",
    studyMode: "Online",
    tuition: 7000,
    duration: "2-3 Years",
    description: "Affordable, top-tier online program for working professionals worldwide.",
    tags: ["Data Science", "Affordable", "Online"],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200",
    specialFeatures: ["OMSA (Online Master of Science in Analytics)", "Same degree as on-campus", "Flexible schedule"],
    noticableFacts: ["Most popular online master's in US", "Sub-$10k total tuition", "High industry recognition"],
    applyLink: "https://gatech.edu",
  }
];

const scholarshipsData = [
  {
    title: "The Gates Scholarship",
    provider: "Gates Foundation",
    location: "USA",
    coverage: "Full Ride",
    degreeLevel: "Undergraduate",
    deadline: "2024-09-15",
    amount: 200000,
    description: "A highly selective, last-dollar scholarship for outstanding, minority, high school seniors from low-income households.",
    tags: ["Full Ride", "Need-Based"],
    specialFeatures: ["Full cost of attendance", "Leadership training", "Professional development"],
    noticableFacts: ["Minority focus", "Need-based", "USA Domestic"],
    applyLink: "https://thegatesscholarship.org",
  },
  {
    title: "Rhodes Scholarship",
    provider: "Rhodes Trust",
    location: "UK (Oxford)",
    coverage: "Full Ride",
    degreeLevel: "Graduate",
    deadline: "2024-10-01",
    amount: 75000,
    description: "The oldest and perhaps most prestigious international scholarship program, supporting students at the University of Oxford.",
    tags: ["Prestige", "Leadership"],
    specialFeatures: ["Oxford tuition", "Living stipend", "Global alumni network"],
    noticableFacts: ["Prestigious", "International", "Oxford destination"],
    applyLink: "https://rhodeshouse.ox.ac.uk",
  },
  {
    title: "Fulbright Program",
    provider: "U.S. Department of State",
    location: "USA / Global",
    coverage: "Full Ride",
    degreeLevel: "Graduate, Research",
    deadline: "2024-10-11",
    amount: 50000,
    description: "The flagship international educational exchange program sponsored by the U.S. government.",
    tags: ["Cultural Exchange", "Research"],
    specialFeatures: ["Global networking", "Cultural immersion", "Government sponsorship"],
    noticableFacts: ["Cultural focus", "USA involvement", "Global"],
    applyLink: "https://fulbrightprogram.org",
  },
  {
    title: "Chevening Scholarships",
    provider: "UK Government",
    location: "UK",
    coverage: "Full Ride",
    degreeLevel: "Master's",
    deadline: "2024-11-05",
    amount: 45000,
    description: "The UK government’s international awards program aimed at developing global leaders.",
    tags: ["Global Leaders", "Networking"],
    specialFeatures: ["UK tuition", "Networking events", "leadership training"],
    noticableFacts: ["Leadership focus", "UK focused", "Master's only"],
    applyLink: "https://chevening.org",
  },
  {
    title: "Schwarzman Scholars",
    provider: "Schwarzman Trust",
    location: "China",
    coverage: "Full Ride",
    degreeLevel: "Master's",
    deadline: "2024-09-19",
    amount: 80000,
    description: "Designed to prepare the next generation of global leaders to respond to the geopolitical landscape of the 21st Century.",
    tags: ["Leadership", "Geopolitics"],
    specialFeatures: ["China experience", "Geopolitical training", "Exclusive campus"],
    noticableFacts: ["China focused", "Leadership training", "Master's level"],
    applyLink: "https://schwarzmanscholars.org",
  }
];

const roadmapsData = [
  {
    title: "Frontend Developer",
    path: "Frontend",
    level: "Beginner",
    time: "3-6 Months",
    modules: 12,
    description: "Master HTML, CSS, JavaScript, and React to build modern, responsive web interfaces. Covers accessibility, performance optimization, and state management.",
    tags: ["React", "CSS", "JavaScript"],
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200",
    color: "#ec4899",
    tips: ["Start with free resources like freeCodeCamp & MDN", "Build a portfolio site as your first project", "Learn Git early — every job requires it"],
    steps: [
      { title: "HTML & CSS Fundamentals", items: ["Semantic HTML", "Box Model", "Flexbox & Grid", "Responsive Design"] },
      { title: "JavaScript Essentials", items: ["ES6+ Syntax", "DOM Manipulation", "Async/Await", "NPM & Packages"] },
      { title: "React & Modern UI", items: ["Components & Props", "Hooks (useState, useEffect)", "Context API", "Tailwind CSS"] }
    ]
  },
  {
    title: "Backend Developer",
    path: "Backend",
    level: "Intermediate",
    time: "3-6 Months",
    modules: 15,
    description: "Master Node.js, databases (SQL & NoSQL), REST/GraphQL APIs, authentication, and server architecture.",
    tags: ["Node.js", "SQL", "APIs"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
    color: "#8b5cf6",
    tips: ["Learn SQL before NoSQL", "Understand HTTP status codes deeply", "Always validate input on the server side"],
    steps: [
      { title: "Node.js & Runtime", items: ["Event Loop", "File System", "Streams", "Package Management"] },
      { title: "API Design", items: ["RESTful Principles", "Express.js", "Middleware", "Error Handling"] },
      { title: "Databases", items: ["SQL (PostgreSQL)", "NoSQL (MongoDB)", "ORM (Prisma/Mongoose)", "Caching (Redis)"] }
    ]
  },
  {
    title: "Machine Learning Engineer",
    path: "AI & Data",
    level: "Advanced",
    time: "> 6 Months",
    modules: 20,
    description: "Dive deep into Python, linear algebra, statistics, and neural networks to build production-grade AI models.",
    tags: ["Python", "TensorFlow", "Math"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200",
    color: "#3b82f6",
    tips: ["Master Python & NumPy first", "Kaggle competitions are best practice", "Learn to read research papers"],
    steps: [
      { title: "Math & Foundations", items: ["Linear Algebra", "Calculus", "Probability", "Statistics"] },
      { title: "Python for ML", items: ["NumPy", "Pandas", "Matplotlib", "Scikit-Learn"] },
      { title: "Deep Learning", items: ["Neural Networks", "TensorFlow/PyTorch", "NLP/CV", "Model Deployment"] }
    ]
  }
];

async function main() {
  console.log('Starting full synchronization...');

  // Clear existing content
  await prisma.contentField.deleteMany({});
  await prisma.contentProgram.deleteMany({});
  await prisma.contentScholarship.deleteMany({});
  await prisma.contentRoadmap.deleteMany({});

  console.log('Cleared existing content tables.');

  // Insert Fields
  for (const item of fieldsData) {
    await prisma.contentField.create({ data: item });
  }
  console.log(`Inserted ${fieldsData.length} Fields.`);

  // Insert Programs
  for (const item of programsData) {
    await prisma.contentProgram.create({ data: item });
  }
  console.log(`Inserted ${programsData.length} Programs.`);

  // Insert Scholarships
  for (const item of scholarshipsData) {
    await prisma.contentScholarship.create({ data: item });
  }
  console.log(`Inserted ${scholarshipsData.length} Scholarships.`);

  // Insert Roadmaps
  for (const item of roadmapsData) {
    await prisma.contentRoadmap.create({ 
      data: {
        ...item,
        steps: item.steps as any // Cast to Json
      } 
    });
  }
  console.log(`Inserted ${roadmapsData.length} Roadmaps.`);

  console.log('Full synchronization complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
