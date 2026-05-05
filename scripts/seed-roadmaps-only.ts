import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const roadmapsData = [
  { 
    title: "Frontend Developer", 
    description: "Master HTML, CSS, JavaScript, and React to build modern, responsive web interfaces. Covers accessibility, performance optimization, and state management.", 
    level: "Beginner", 
    path: "Frontend", 
    time: "3-6 Months", 
    modules: 12, 
    tags: ["React", "CSS", "JavaScript"], 
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop", 
    color: "#ec4899",
    special_features: ["Project-based learning with 5 capstone projects", "React Hooks & Redux state management", "Responsive Design with CSS Grid & Flexbox", "TypeScript fundamentals"], 
    noticable_facts: ["Start with free resources like freeCodeCamp & MDN", "Build a portfolio site as your first project", "Learn Git early — every job requires it", "Focus on ONE framework deeply before branching out", "Practice daily on Frontend Mentor challenges"],
    steps: [
      { title: "HTML & CSS Fundamentals", description: "Learn semantic HTML, Box Model, and Flexbox. Resources: MDN Web Docs, CSS-Tricks, freeCodeCamp." },
      { title: "JavaScript Essentials", description: "Master ES6+, DOM manipulation, and Async/Await. Resources: Eloquent JavaScript, JavasScript.info." },
      { title: "Tailwind CSS & Modern Styling", description: "Learn utility-first CSS for rapid UI development. Resources: Tailwind Documentation, Scrimba." },
      { title: "React Basics", description: "Understand components, props, and state. Resources: Beta.reactjs.org, Scrimba React Course." },
      { title: "Advanced React & State", description: "Context API, Redux Toolkit, and performance hooks. Resources: Kent C. Dodds Blog, Epic React." },
      { title: "Next.js & Deployment", description: "SSR, SSG, and Vercel deployment. Resources: Next.js Learn, Lee Robinson's Guide." }
    ]
  },
  { 
    title: "Backend Developer", 
    description: "Master Node.js, databases (SQL & NoSQL), REST/GraphQL APIs, authentication, and server architecture. Learn to build scalable, secure backend systems.", 
    level: "Intermediate", 
    path: "Backend", 
    time: "3-6 Months", 
    modules: 15, 
    tags: ["Node.js", "SQL", "APIs"], 
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop", 
    color: "#8b5cf6",
    special_features: ["System Design Fundamentals", "RESTful & GraphQL API design", "Database optimization & indexing", "JWT Auth & OAuth implementation"], 
    noticable_facts: ["Learn SQL before NoSQL — fundamentals matter", "Build a REST API project before learning GraphQL", "Understand HTTP status codes deeply", "Always validate input on the server side", "Deploy on Railway or Render for free practice"],
    steps: [
      { title: "Node.js & NPM", description: "Understanding the Event Loop and package management. Resources: Node.js Documentation, Traversy Media." },
      { title: "Express.js Framework", description: "Building robust REST APIs and middleware. Resources: Expressjs.com, The Net Ninja (YouTube)." },
      { title: "Relational Databases (SQL)", description: "PostgreSQL schema design and queries. Resources: PostgreSQL Tutorial, SQLZoo." },
      { title: "Authentication (JWT & OAuth)", description: "Secure user sessions and 3rd party logins. Resources: Passport.js, Auth0 Blog." },
      { title: "GraphQL & Apollo", description: "Learning modern API query languages. Resources: Apollo Odyssey, HowToGraphQL." },
      { title: "Docker & Deployment", description: "Containerizing apps and CI/CD pipelines. Resources: Docker Labs, GitHub Actions Docs." }
    ]
  },
  { 
    title: "Machine Learning Engineer", 
    description: "Dive deep into Python, linear algebra, statistics, and neural networks to build production-grade AI models. Covers NLP, Computer Vision, and MLOps.", 
    level: "Advanced", 
    path: "AI & Data", 
    time: "> 6 Months", 
    modules: 20, 
    tags: ["Python", "TensorFlow", "Math"], 
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop", 
    color: "#3b82f6",
    special_features: ["Deep Learning with PyTorch & TensorFlow", "NLP: transformers, BERT, GPT fine-tuning", "Computer Vision: CNNs, object detection", "MLOps: Docker, MLflow, model deployment"], 
    noticable_facts: ["Master Python & NumPy before anything else", "Take Andrew Ng's free ML course on Coursera first", "Kaggle competitions are the best practice", "Learn to read research papers — start with Arxiv Sanity", "Focus on one domain (NLP or CV) before generalizing"],
    steps: [
      { title: "Mathematics for AI", description: "Linear Algebra, Calculus, and Statistics. Resources: Khan Academy, 3Blue1Brown (YouTube)." },
      { title: "Python for Data Science", description: "NumPy, Pandas, and Matplotlib mastery. Resources: Kaggle Courses, Real Python." },
      { title: "Classical Machine Learning", description: "Scikit-Learn, Regression, and Trees. Resources: Hands-On ML (Book), StatQuest." },
      { title: "Deep Learning Foundations", description: "Neural Networks and Backpropagation. Resources: Fast.ai, DeepLearning.ai (Coursera)." },
      { title: "Natural Language Processing", description: "Transformers, BERT, and LLMs. Resources: Hugging Face Course, Stanford CS224N." },
      { title: "MLOps & Engineering", description: "Deploying and monitoring models. Resources: Made With ML, Weights & Biases Docs." }
    ]
  },
  { 
    title: "Full-Stack Web3 Developer", 
    description: "Build decentralized applications with Solidity, Hardhat, ethers.js, and Next.js. Learn smart contract security, DeFi, and NFT development.", 
    level: "Advanced", 
    path: "Web3", 
    time: "> 6 Months", 
    modules: 18, 
    tags: ["Solidity", "Blockchain", "Web3.js"], 
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop", 
    color: "#10b981",
    special_features: ["Smart Contract Security & Auditing", "DeFi Protocol Building (AMM, Lending)", "NFT Marketplace from scratch", "Layer 2 Solutions (Polygon, Arbitrum)"], 
    noticable_facts: ["Learn JavaScript/TypeScript thoroughly first", "Use CryptoZombies for free Solidity practice", "Always audit your contracts with Slither/Mythril", "Start with testnet deployments before mainnet", "Join a DAO to learn governance firsthand"],
    steps: [
      { title: "Blockchain Fundamentals", description: "Cryptography, Hashing, and Consensus. Resources: Whiteboard Crypto, Mastering Bitcoin." },
      { title: "Solidity & Smart Contracts", description: "Writing secure Ethereum contracts. Resources: CryptoZombies, Patrick Collins (YouTube)." },
      { title: "Web3 Frontend Integration", description: "Connecting Next.js to the Chain. Resources: Ethers.js Docs, Scaffold-ETH." },
      { title: "DeFi Protocol Design", description: "Build AMMs and Lending Pools. Resources: Uniswap Docs, Finematics (YouTube)." },
      { title: "Auditing & Security", description: "Identifying reentrancy and overflows. Resources: OpenZeppelin Docs, RareSkills." },
      { title: "Layer 2 & Scaling", description: "Polygon, Optimism, and ZK-rollups. Resources: L2BEAT, Alchemy University." }
    ]
  },
  { 
    title: "UI/UX Designer", 
    description: "Learn design thinking, wireframing, prototyping in Figma, user research methods, and design systems. Build a portfolio that gets you hired.", 
    level: "Beginner", 
    path: "Design", 
    time: "3-6 Months", 
    modules: 10, 
    tags: ["Figma", "Design Systems", "User Research"], 
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop", 
    color: "#f59e0b",
    special_features: ["Figma mastery from zero to advanced", "Design System creation (tokens, components)", "User research & usability testing", "Portfolio case study building"], 
    noticable_facts: ["Redesign existing apps as practice (Daily UI challenge)", "Learn basic HTML/CSS to communicate with developers", "Read 'Don't Make Me Think' by Steve Krug", "Study Apple & Google design guidelines", "Always test with real users, not just peers"],
    steps: [
      { title: "Design Principles", description: "Typography, Hierarchy, and Color Theory. Resources: Refactoring UI, Interaction Design Foundation." },
      { title: "Figma Mastery", description: "Auto-layout, Components, and Prototyping. Resources: Figma YouTube, UI Prep." },
      { title: "User Research Methods", description: "Personas, User Flows, and Interviews. Resources: NNGroup, Nielsen Norman Blog." },
      { title: "Wireframing & Lo-Fi", description: "Planning without visual noise. Resources: Balsamiq Blog, UX Collective." },
      { title: "Design Systems", description: "Tokens, Variants, and Documentation. Resources: Design Systems Repo, Material Design Docs." },
      { title: "Portfolio Building", description: "Case studies that tell a story. Resources: Case Study Club, Behance." }
    ]
  },
  {
    title: "Cybersecurity Analyst",
    description: "Protect systems and networks from digital attacks. Learn ethical hacking, network security, and incident response.",
    level: "Intermediate",
    path: "Security",
    time: "6-12 Months",
    modules: 14,
    tags: ["Networking", "Kali Linux", "Security+"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    color: "#ef4444",
    special_features: ["Penetration testing labs", "CompTIA Security+ prep", "Network traffic analysis", "Incident response simulations"],
    noticable_facts: ["Learn Networking (OSI model) first", "TryHackMe and HackTheBox are essential", "Python is the best language for automation in security", "Certifications matter: Start with Security+ or EJPT"],
    steps: [
      { title: "Networking Fundamentals", description: "TCP/IP, OSI, and Subnetting. Resources: Professor Messer (YouTube), Cisco Networking Academy." },
      { title: "Linux for Security", description: "Bash scripting and system admin. Resources: OverTheWire (Bandit), Linux Journey." },
      { title: "Web Vulnerabilities", description: "OWASP Top 10 and Burp Suite. Resources: PortSwigger Academy, OWASP Docs." },
      { title: "Ethical Hacking Basics", description: "Recon, Scanning, and Exploitation. Resources: TryHackMe (Jr PenTester), TCM Security." },
      { title: "Security Monitoring", description: "SIEM, Logs, and Threat Hunting. Resources: Splunk Training, Let's Defend." },
      { title: "Certification Prep", description: "Gearing up for Security+. Resources: Jason Dion (Udemy), Messer Notes." }
    ]
  },
  {
    title: "Data Scientist",
    description: "Extract insights from complex datasets using statistics and machine learning. Master the full data lifecycle from cleaning to visualization.",
    level: "Intermediate",
    path: "AI & Data",
    time: "6-9 Months",
    modules: 16,
    tags: ["Python", "Statistics", "Tableau"],
    image: "https://images.unsplash.com/photo-1551288049-bbbda536ad3a?q=80&w=1200&auto=format&fit=crop",
    color: "#6366f1",
    special_features: ["Exploratory Data Analysis (EDA)", "SQL for Data Analysis", "Advanced visualization with D3.js/Plotly", "Storytelling with Data"],
    noticable_facts: ["Statistics is the heart of Data Science", "80% of the work is data cleaning", "Learn to communicate results to non-technical stakeholders", "Kaggle is your best portfolio builder"],
    steps: [
      { title: "Probability & Statistics", description: "Distributions, Hypothesis Testing. Resources: Statistics101 (YouTube), StatQuest." },
      { title: "SQL for Data Science", description: "Complex joins and window functions. Resources: Mode Analytics SQL Tutorial, HackerRank." },
      { title: "Data Wrangling with Python", description: "Pandas and NumPy advanced techniques. Resources: Python for Data Analysis (Book), Kaggle." },
      { title: "Data Visualization", description: "Storytelling with Matplotlib and Tableau. Resources: Storytelling with Data (Book), Tableau Public." },
      { title: "Statistical Modeling", description: "Regression and Inference. Resources: Introduction to Statistical Learning (ISLR)." },
      { title: "Big Data Tools", description: "Intro to Spark and Hadoop. Resources: Cognitive Class AI, Databricks Academy." }
    ]
  },
  {
    title: "DevOps Engineer",
    description: "Bridge the gap between development and operations. Learn automation, CI/CD, cloud infrastructure, and monitoring.",
    level: "Advanced",
    path: "Cloud & DevOps",
    time: "6-12 Months",
    modules: 18,
    tags: ["AWS", "Docker", "Kubernetes"],
    image: "https://images.unsplash.com/photo-1667372333114-3d254c04291e?q=80&w=1200&auto=format&fit=crop",
    color: "#14b8a6",
    special_features: ["Infrastructure as Code (Terraform)", "CI/CD Pipeline building", "Kubernetes orchestration", "SRE best practices"],
    noticable_facts: ["DevOps is a culture, not just a role", "Infrastructure as Code is non-negotiable", "Master Linux administration early", "Monitoring and Observability are key to uptime"],
    steps: [
      { title: "Linux Administration", description: "Server config and security. Resources: Linux Academy, Cloud Skills Boost." },
      { title: "Infrastructure as Code", description: "Terraform and Ansible. Resources: Terraform Learn, HashiCorp Docs." },
      { title: "CI/CD Orchestration", description: "Jenkins, GitLab CI, and GitHub Actions. Resources: DevOps Directive, GitLab Docs." },
      { title: "Container Orchestration", description: "Kubernetes and Helm. Resources: KubeAcademy, KodeKloud." },
      { title: "Cloud Mastery (AWS)", description: "EC2, S3, RDS, and IAM. Resources: AWS Educate, Adrian Cantrill (Courses)." },
      { title: "Monitoring & Logging", description: "Prometheus, Grafana, and ELK. Resources: Prometheus.io, Elastic Training." }
    ]
  },
  {
    title: "Mobile App Developer",
    description: "Build high-performance native and cross-platform mobile apps for iOS and Android using React Native or Flutter.",
    level: "Intermediate",
    path: "Mobile",
    time: "4-6 Months",
    modules: 12,
    tags: ["React Native", "Swift", "Flutter"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
    color: "#f43f5e",
    special_features: ["Cross-platform app development", "Native module integration", "App Store/Play Store deployment", "Mobile UI/UX best practices"],
    noticable_facts: ["React Native is great for JS devs", "Flutter (Dart) has amazing performance", "Learn the basics of Swift or Learner even for cross-platform", "Optimize for battery and low network early"],
    steps: [
      { title: "Cross-Platform Basics", description: "React Native or Flutter introduction. Resources: Expo Docs, Flutter.dev." },
      { title: "Mobile UI Design", description: "Responsive layouts and navigation. Resources: React Navigation Docs, Material Design." },
      { title: "State Management", description: "Redux or Provider/Riverpod. Resources: Maximillian Schwarzmüller (Udemy)." },
      { title: "Native Features", description: "Camera, Push Notifications, and Biometrics. Resources: React Native Community Docs." },
      { title: "Offline Storage", description: "SQLite and Async Storage. Resources: Realm Docs, Firebase Docs." },
      { title: "App Store Deployment", description: "Certificates, App Store Connect, Play Console. Resources: Fastlane.tools." }
    ]
  },
  {
    title: "Game Developer (Unity)",
    description: "Create immersive 2D and 3D games. Learn C# programming, physics, animation, and game design patterns.",
    level: "Intermediate",
    path: "Game Dev",
    time: "6-12 Months",
    modules: 20,
    tags: ["Unity", "C#", "3D Modeling"],
    image: "https://images.unsplash.com/photo-1552824734-142273e9903c?q=80&w=1200&auto=format&fit=crop",
    color: "#84cc16",
    special_features: ["C# Game Scripting", "3D math for games", "Shader development", "AR/VR exploration"],
    noticable_facts: ["Unity is the most popular engine for indies", "Learn C# properly before jumping into Unity", "3D Math (vectors, dot products) is crucial", "Participate in Game Jams to learn fast"],
    steps: [
      { title: "C# Fundamentals", description: "OOP, Logic, and Data Structures. Resources: Brackeys (YouTube), Microsoft Learn." },
      { title: "Unity Interface & Physics", description: "Rigidbodies, Colliders, and Input. Resources: Unity Learn (Essentials)." },
      { title: "Game Mechanics", description: "Player movement, Combat, and AI. Resources: Code Monkey (YouTube), Unity Docs." },
      { title: "Visuals & Animation", description: "Mechanim, Shaders, and Lighting. Resources: Sebastian Lague (YouTube)." },
      { title: "Advanced Architecture", description: "Scriptable Objects and Events. Resources: Game Programming Patterns (Book)." },
      { title: "Release & Polishing", description: "Optimization and Build settings. Resources: Unity Blog, Game Dev.tv." }
    ]
  },
  {
    title: "Cloud Architect",
    description: "Design and manage large-scale cloud infrastructures. Learn about security, cost optimization, and high availability.",
    level: "Advanced",
    path: "Cloud & DevOps",
    time: "9-15 Months",
    modules: 22,
    tags: ["AWS", "Azure", "Architecture"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    color: "#0ea5e9",
    special_features: ["Multi-cloud strategy", "Well-Architected Framework", "Serverless design", "Disaster recovery planning"],
    noticable_facts: ["AWS is the market leader", "Architects must understand business costs", "Security is priority #0", "Hands-on projects with real quotas are best"],
    steps: [
      { title: "Cloud Fundamentals", description: "SaaS, PaaS, IaaS, and Regions. Resources: Cloud Guru, AWS Cloud Practitioner." },
      { title: "Networking & Security", description: "VPCs, Subnets, IAM, and KMS. Resources: Adrian Cantrill, AWS Docs." },
      { title: "Storage & Compute", description: "S3, EC2, Lambda, and EKS. Resources: ExamPro, Stephane Maarek (Udemy)." },
      { title: "Database Architecture", description: "RDS, DynamoDB, and Aurora. Resources: AWS Database Blog." },
      { title: "Serverless & Microservices", description: "Event-driven design. Resources: Serverless Framework Docs." },
      { title: "Optimization & Governance", description: "Cost Explorer and Compliance. Resources: AWS Well-Architected Tool." }
    ]
  },
  {
    title: "Product Manager (Technical)",
    description: "Lead product development from concept to launch. Balance user needs, business goals, and technical feasibility.",
    level: "Intermediate",
    path: "Business",
    time: "4-8 Months",
    modules: 12,
    tags: ["Strategy", "Agile", "User Stories"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    color: "#f97316",
    special_features: ["Market analysis & validation", "Agile/Scrum certification prep", "Product Roadmap creation", "Technical stakeholder management"],
    noticable_facts: ["PM is about the 'Why', not just the 'How'", "Data beats opinion every time", "Soft skills (empathy, communication) are 80% of the job", "Learn basic coding to talk to engineers"],
    steps: [
      { title: "Product Discovery", description: "Problem identification and market fit. Resources: Inspired (Book by Marty Cagan)." },
      { title: "Agile & Scrum", description: "Running sprints and backlogs. Resources: Scrum.org, Atlassian Agile Coach." },
      { title: "Roadmapping & Prioritization", description: "RICE and MoSCoW methods. Resources: Product School, Roman Pichler Blog." },
      { title: "User Analytics", description: "Mixpanel, Amplitude, and Google Analytics. Resources: Reforge, Analytics Academy." },
      { title: "Stakeholder Management", description: "Negotiation and alignment. Resources: Crucial Conversations (Book)." },
      { title: "GTM (Go-to-Market)", description: "Pricing, Launch, and Marketing. Resources: Product Marketing Alliance." }
    ]
  },
  {
    title: "Digital Marketing Specialist",
    description: "Grow brands and reach audiences through SEO, SEM, social media, and content strategy. Master performance marketing.",
    level: "Beginner",
    path: "Business",
    time: "3-5 Months",
    modules: 10,
    tags: ["SEO", "Google Ads", "Content"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    color: "#d946ef",
    special_features: ["SEO audits & implementation", "PPC campaign management", "Social media automation", "Email marketing & CRM"],
    noticable_facts: ["SEO takes time; Ads are instant", "Content is King, but Distribution is Queen", "Learn to use Google Search Console early", "AI is changing SEO—stay updated on SGE"],
    steps: [
      { title: "Marketing Fundamentals", description: "Funnel design and customer journeys. Resources: HubSpot Academy." },
      { title: "SEO Masterclass", description: "Keywords, Backlinks, and Tech SEO. Resources: Ahrefs Blog, Backlinko." },
      { title: "Paid Advertising (SEM)", description: "Google and Meta Ads. Resources: Google Skillshop, Facebook Blueprint." },
      { title: "Social Media Strategy", description: "Viral loops and community building. Resources: Buffer Blog, Social Media Examiner." },
      { title: "Email & CRM", description: "Nurturing leads with automation. Resources: Mailchimp Academy." },
      { title: "Data-Driven Marketing", description: "Attribution and ROI analysis. Resources: Avinash Kaushik Blog." }
    ]
  },
  {
    title: "Blockchain Architect",
    description: "Design decentralized systems and private ledger solutions. Understand zero-knowledge proofs and layer-1 architecture.",
    level: "Advanced",
    path: "Web3",
    time: "9-18 Months",
    modules: 24,
    tags: ["Rust", "Go", "Cryptography"],
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1200&auto=format&fit=crop",
    color: "#6366f1",
    special_features: ["Consensus algorithm design", "ZK-proof implementation", "Interoperability protocols", "Enterprise blockchain (Hyperledger)"],
    noticable_facts: ["Rust is the future of Blockchain core", "Deep understanding of CS fundamentals is required", "Security is paramount—exploits are permanent", "Mathematics is a core requirement"],
    steps: [
      { title: "Advanced Cryptography", description: "Elliptic Curves, Zero-Knowledge. Resources: Dan Boneh's Crypto Course (Coursera)." },
      { title: "Go/Rust for Systems", description: "Building core chain logic. Resources: Rust Book, Go Tour." },
      { title: "Consensus Mechanisms", description: "PoW, PoS, and BFT models. Resources: Ethereum Yellow Paper." },
      { title: "Layer 1 Architecture", description: "P2P networking and State machines. Resources: Substrate Docs, Polkadot Wiki." },
      { title: "ZK-Rollups & Privacy", description: "Circom, Snarkjs, and Halo2. Resources: ZK Hack, Polygon Zero Docs." },
      { title: "Cross-chain Bridges", description: "Atomic swaps and messaging. Resources: LayerZero Whitepaper." }
    ]
  },
  {
    title: "Embedded Systems Engineer",
    description: "Program hardware and microcontrollers. Learn C/C++, RTOS, and hardware-software integration for IoT and robotics.",
    level: "Advanced",
    path: "Game Dev",
    time: "9-15 Months",
    modules: 18,
    tags: ["C++", "Arduino", "RTOS"],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    color: "#06b6d4",
    special_features: ["Real-time OS (RTOS) mastery", "Bare-metal programming", "Circuit design basics", "Firmware development"],
    noticable_facts: ["Learn C properly first", "Debugging hardware is harder than software", "Understand memory management deeply", "Buy an Arduino or ESP32 to start today"],
    steps: [
      { title: "C for Embedded", description: "Pointers, Bitwise ops, and Structs. Resources: Modern C (Book), Learn-C.org." },
      { title: "Digital Electronics", description: "Gates, Latches, and PCBs. Resources: All About Circuits, SparkFun Tutorials." },
      { title: "Microcontroller Basics", description: "GPIO, UART, I2C, and SPI. Resources: Arduino Docs, ESP32 Guide." },
      { title: "Bare Metal Development", description: "Interrupts and Registers. Resources: Embedded.fm, Quantum Leaps (YouTube)." },
      { title: "Real-Time OS (RTOS)", description: "FreeRTOS and Zephyr. Resources: FreeRTOS Documentation." },
      { title: "Firmware Projects", description: "IoT sensors and actuators. Resources: Hackster.io, Instructables." }
    ]
  },
  { 
    title: "High School to College", 
    featured: true,
    description: "Follow this proven pathway to navigate the transition from high school to your dream university.", 
    level: "Beginner", 
    path: "Academic", 
    time: "4 Years", 
    modules: 5, 
    tags: ["High School", "University Prep"], 
    image: "https://images.unsplash.com/photo-1523050335456-c9948906028a?q=80&w=1200&auto=format&fit=crop", 
    color: "#3b82f6",
    special_features: ["College essay guidance", "Extracurricular planning", "Standardized test prep timeline"],
    noticable_facts: ["Start planning in 9th grade", "GPA is the most important factor", "Leadership roles matter more than many clubs"],
    steps: [
      { title: "Foundation & GPA", description: "Maintain strong GPA (3.5+) and take AP/IB/Honors courses to challenge yourself." },
      { title: "Extracurriculars", description: "Build leadership experience and pursue passions outside the classroom." },
      { title: "Test Preparation", description: "Start SAT/ACT prep early and take practice exams to identify weak areas." },
      { title: "College Research", description: "Research universities, visit campuses, and narrow down your target list." },
      { title: "Applications", description: "Write compelling personal statements and gather strong recommendation letters." }
    ]
  },
  { 
    title: "Undergrad to Grad School", 
    featured: true,
    description: "A comprehensive guide for undergraduate students planning to pursue Master's or PhD programs.", 
    level: "Intermediate", 
    path: "Academic", 
    time: "2-4 Years", 
    modules: 5, 
    tags: ["Graduate", "Research"], 
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop", 
    color: "#a855f7",
    special_features: ["Research proposal tips", "GRE/GMAT prep strategy", "Fellowship application guide"],
    noticable_facts: ["Research experience is vital for PhDs", "Letters of recommendation should be from professors", "Start looking for funding a year in advance"],
    steps: [
      { title: "Research & Planning", description: "Research faculty and programs that align with your interests." },
      { title: "Academic Excellence", description: "Maintain a high GPA and gain relevant research or internship experience." },
      { title: "Standardized Tests", description: "Prepare for and take required exams like the GRE, GMAT, or LSAT." },
      { title: "Network", description: "Secure strong recommendation letters and connect with potential advisors." },
      { title: "Funding", description: "Identify and apply for fellowships and scholarships early." }
    ]
  },
  { 
    title: "Career Transition", 
    featured: true,
    description: "Successfully switch your career path with this structured approach to reskilling and networking.", 
    level: "Advanced", 
    path: "Career", 
    time: "6-12 Months", 
    modules: 5, 
    tags: ["Career Change", "Reskilling"], 
    image: "https://images.unsplash.com/photo-1454165833767-02a698d1316a?q=80&w=1200&auto=format&fit=crop", 
    color: "#10b981",
    special_features: ["Skills gap analysis", "Portfolio building", "Networking strategies"],
    noticable_facts: ["Transferable skills are your best asset", "Certifications can bridge the gap", "Informational interviews are key to hidden jobs"],
    steps: [
      { title: "Self-Assessment", description: "Conduct a thorough skills audit and identify your target industry." },
      { title: "Skill Acquisition", description: "Acquire new certifications and learn the required tools for your new field." },
      { title: "Portfolio Building", description: "Create real-world projects that demonstrate your new skills to employers." },
      { title: "Networking", description: "Network with professionals in your target field and optimize your LinkedIn." },
      { title: "Negotiation", description: "Prepare for interviews and learn how to negotiate salary in a new industry." }
    ]
  }
];

async function main() {
  console.log("Seeding roadmaps data...\n");

  // Clear existing roadmaps
  await prisma.contentRoadmap.deleteMany();
  console.log("Cleared existing roadmaps.");

  for (const r of roadmapsData) {
    const { special_features, noticable_facts, ...rest } = r as any;
    await prisma.contentRoadmap.create({
      data: {
        ...rest,
        specialFeatures: special_features || [],
        noticableFacts: noticable_facts || [],
      }
    });
  }

  const count = await prisma.contentRoadmap.count();
  console.log(`✓ Created ${count} roadmaps.`);
  console.log("\n✅ Roadmap seed complete!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
