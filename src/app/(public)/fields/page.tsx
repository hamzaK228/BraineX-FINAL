"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, Globe, Briefcase, Heart, Palette, BookOpen, Microscope, TrendingUp, DollarSign, Users, ArrowRight, Zap, GraduationCap } from "lucide-react";

type Field = { 
  id: number; category: string; icon: string; title: string; desc: string; 
  salaryNum: number; salary: string; growth: number; growthStr: string; 
  demand: string; topUnis: string[]; special_features?: string[]; 
  noticable_facts?: string[]; image?: string; 
};


const CATS = [
  { id: "All", label: "All Fields", icon: <Globe size={16} /> },
  { id: "STEM", label: "STEM", icon: <Microscope size={16} /> },
  { id: "Business", label: "Business", icon: <Briefcase size={16} /> },
  { id: "Health", label: "Health", icon: <Heart size={16} /> },
  { id: "Creative", label: "Creative", icon: <Palette size={16} /> },
  { id: "Humanities", label: "Humanities", icon: <BookOpen size={16} /> }
];

const fieldsData: Field[] = [
  {
    id: 1, category: "STEM", icon: "💻", title: "Computer Science", desc: "The study of computation, algorithms, and information systems. Covers AI, cybersecurity, distributed systems, and software engineering.",
    salaryNum: 120000, salary: "$120k+", growth: 15, growthStr: "15%", demand: "Very High", topUnis: ["MIT", "Stanford", "CMU", "Berkeley"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800",
    special_features: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing"],
    noticable_facts: ["Highest starting salaries", "Strong remote-work culture", "500k+ unfilled positions"],
  },
  {
    id: 2, category: "Business", icon: "📊", title: "Business Administration", desc: "Strategic management of business operations, organizational leadership, and financial decision-making.",
    salaryNum: 95000, salary: "$95k+", growth: 8, growthStr: "8%", demand: "High", topUnis: ["Wharton", "Harvard", "Stanford", "INSEAD"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    special_features: ["Strategic Management", "Entrepreneurship", "Digital Transformation"],
    noticable_facts: ["MBA is the most popular graduate degree", "Versatile career path", "High CEO representation"],
  },
  {
    id: 3, category: "Health", icon: "🏥", title: "Medicine & Health", desc: "Diagnosis, treatment, and prevention of disease. Includes specialized fields like surgery, nursing, and public health.",
    salaryNum: 160000, salary: "$160k+", growth: 13, growthStr: "13%", demand: "Very High", topUnis: ["Johns Hopkins", "Harvard", "Oxford"],
    image: "https://images.unsplash.com/photo-1505751172107-597d7a423b9c?q=80&w=800",
    special_features: ["Clinical Research", "Surgical Innovation", "Health Tech"],
    noticable_facts: ["Recession-proof industry", "High societal impact", "Longest educational path"],
  },
  {
    id: 4, category: "STEM", icon: "🧬", title: "Biotechnology", desc: "Using biological systems, living organisms, or derivatives thereof, to make or modify products or processes.",
    salaryNum: 105000, salary: "$105k+", growth: 10, growthStr: "10%", demand: "High", topUnis: ["MIT", "ETH Zurich", "Cambridge"],
    image: "https://images.unsplash.com/photo-1532187863486-abf9d3a3522a?q=80&w=800",
    special_features: ["Genetic Engineering", "Drug Development", "Synthetic Biology"],
    noticable_facts: ["Rapidly growing field due to mRNA tech", "Interdisciplinary (Bio + Tech)"],
  },
  {
    id: 5, category: "Creative", icon: "🎨", title: "Digital Arts & Design", desc: "Intersection of creativity and technology. Covers UI/UX design, motion graphics, and game development.",
    salaryNum: 85000, salary: "$85k+", growth: 12, growthStr: "12%", demand: "High", topUnis: ["RISD", "Parsons", "RCA London"],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800",
    special_features: ["UI/UX Experience", "3D Modeling", "Brand Identity"],
    noticable_facts: ["High demand in tech sector", "Freelance flexibility"],
  },
  {
    id: 6, category: "Humanities", icon: "⚖️", title: "Law & Jurisprudence", desc: "The system of rules which a particular country or community recognizes as regulating the actions of its members.",
    salaryNum: 125000, salary: "$125k+", growth: 9, growthStr: "9%", demand: "High", topUnis: ["Yale", "Harvard", "Oxford", "NYU"],
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800",
    special_features: ["Corporate Law", "International Rights", "Litigation"],
    noticable_facts: ["Competitive entry", "Strong networking focus"],
  },
  {
    id: 7, category: "STEM", icon: "⚙️", title: "Engineering", desc: "Application of physics, mathematics, and materials science to design and build structures, machines, and systems.",
    salaryNum: 100000, salary: "$100k+", growth: 10, growthStr: "10%", demand: "High", topUnis: ["MIT", "Caltech", "ETH Zurich"],
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800",
    special_features: ["Civil & Structural", "Mechanical Systems", "Aerospace Engineering"],
    noticable_facts: ["Foundation of modern infrastructure", "Highly versatile skills"],
  },
  {
    id: 8, category: "Business", icon: "📉", title: "Finance & Economics", desc: "The science of money, markets, and investment. Studies how individuals, companies, and governments allocate resources.",
    salaryNum: 110000, salary: "$110k+", growth: 12, growthStr: "12%", demand: "High", topUnis: ["Wharton", "LSE", "Chicago"],
    image: "https://images.unsplash.com/photo-1611974714658-058f40700d90?q=80&w=800",
    special_features: ["Investment Banking", "Macroeconomics", "Quantitative Analysis"],
    noticable_facts: ["High bonuses in private sector", "Critical for global policy"],
  },
  {
    id: 9, category: "STEM", icon: "🌌", title: "Physics & Astronomy", desc: "Understanding the fundamental laws governing the universe — from subatomic particles to galaxies.",
    salaryNum: 115000, salary: "$115k+", growth: 9, growthStr: "9%", demand: "High", topUnis: ["MIT", "Princeton", "CERN/ETH"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    special_features: ["Quantum Mechanics", "Astrophysics", "Particle Physics"],
    noticable_facts: ["Strong problem-solving base", "Opens doors to Data Science"],
  },
  {
    id: 10, category: "STEM", icon: "🔢", title: "Mathematics & Statistics", desc: "The language of science. Pure math, applied math, statistics, and data science form the foundation of modern technology.",
    salaryNum: 95000, salary: "$95k+", growth: 14, growthStr: "14%", demand: "Very High", topUnis: ["MIT", "Princeton", "Cambridge"],
    image: "https://images.unsplash.com/photo-1509228468518-180dd482100c?q=80&w=800",
    special_features: ["Pure Mathematics", "Actuarial Science", "Cryptography"],
    noticable_facts: ["Essential for AI research", "High demand in insurance & finance"],
  },
  {
    id: 11, category: "STEM", icon: "🌍", title: "Environmental Science", desc: "Studying Earth's systems and human impact on the environment. Covers climate science, conservation, and renewable energy.",
    salaryNum: 75000, salary: "$75k+", growth: 11, growthStr: "11%", demand: "Growing", topUnis: ["ETH Zurich", "Stanford", "Wageningen"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    special_features: ["Climate Modeling", "Renewable Energy", "Conservation Biology"],
    noticable_facts: ["Crucial for global sustainability", "Expanding government funding"],
  },
  {
    id: 12, category: "Creative", icon: "🎬", title: "Film, Media & Communication", desc: "Storytelling through visual and digital media. Covers filmmaking, journalism, digital marketing, PR, and content strategy.",
    salaryNum: 70000, salary: "$70k+", growth: 7, growthStr: "7%", demand: "Moderate", topUnis: ["USC", "NYU", "UCLA"],
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
    special_features: ["Cinematography", "Digital Marketing", "Journalism"],
    noticable_facts: ["Creative freedom", "High impact on public opinion"],
  },
  {
    id: 13, category: "Humanities", icon: "🧠", title: "Psychology & Cognitive Science", desc: "Understanding human behavior, cognition, and mental processes. Covers clinical psychology, behavioral economics, and neuroscience.",
    salaryNum: 80000, salary: "$80k+", growth: 10, growthStr: "10%", demand: "High", topUnis: ["Stanford", "Harvard", "UCL"],
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800",
    special_features: ["Clinical Psychology", "Neuroscience", "Cognitive Research"],
    noticable_facts: ["Expanding mental health awareness", "Diverse career options"],
  },
  {
    id: 14, category: "STEM", icon: "🤖", title: "Data Science & AI", desc: "Extracting insights from data using statistics, machine learning, and domain expertise. The driving force behind modern AI.",
    salaryNum: 130000, salary: "$130k+", growth: 22, growthStr: "22%", demand: "Very High", topUnis: ["MIT", "Stanford", "Berkeley"],
    image: "https://images.unsplash.com/photo-1551288049-bbbda536ad3a?q=80&w=800",
    special_features: ["Machine Learning", "Big Data", "Data Visualization"],
    noticable_facts: ["Fastest growing field in tech", "Extremely high compensation"],
  },
  {
    id: 15, category: "Health", icon: "💊", title: "Pharmacy & Pharmaceutical Science", desc: "The science of drug discovery, development, and therapeutic use. Covers medicinal chemistry, pharmacology, and clinical practice.",
    salaryNum: 110000, salary: "$110k+", growth: 8, growthStr: "8%", demand: "High", topUnis: ["UCSF", "UCL", "UNC"],
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=800",
    special_features: ["Pharmacology", "Drug Synthesis", "Clinical Trials"],
    noticable_facts: ["Stable healthcare career", "High involvement in biotech"],
  },
  {
    id: 16, category: "Creative", icon: "🏛️", title: "Architecture & Urban Planning", desc: "Designing buildings, cities, and spaces that shape how people live. Combines art, engineering, and environmental science.",
    salaryNum: 90000, salary: "$90k+", growth: 9, growthStr: "9%", demand: "High", topUnis: ["MIT", "AA London", "ETH Zurich"],
    image: "https://images.unsplash.com/photo-1487958449913-d9279906470c?q=80&w=800",
    special_features: ["Sustainable Design", "Urban Planning", "Structural Engineering"],
    noticable_facts: ["Long-lasting physical legacy", "Requires licensure"],
  },
  {
    id: 17, category: "STEM", icon: "🛡️", title: "Cybersecurity", desc: "Protecting systems, networks, and programs from digital attacks. Includes threat hunting, cryptography, and network security.",
    salaryNum: 125000, salary: "$125k+", growth: 28, growthStr: "28%", demand: "Critical", topUnis: ["CMU", "Stanford", "Purdue"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
    special_features: ["Ethical Hacking", "Digital Forensics", "Network Defense"],
    noticable_facts: ["Zero unemployment rate in the field", "Essential for national security"],
  },
  {
    id: 18, category: "STEM", icon: "✈️", title: "Aerospace Engineering", desc: "Designing aircraft, spacecraft, satellites, and missiles. Covers aerodynamics, propulsion, and structural design.",
    salaryNum: 118000, salary: "$118k+", growth: 6, growthStr: "6%", demand: "High", topUnis: ["MIT", "Georgia Tech", "Stanford"],
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800",
    special_features: ["Orbital Mechanics", "Propulsion Systems", "Avionics"],
    noticable_facts: ["Work with NASA, SpaceX, Boeing", "Cutting-edge material science"],
  },
  {
    id: 19, category: "Business", icon: "📈", title: "Marketing & Advertising", desc: "The process of getting people interested in your company's product or service. Includes market research and data analysis.",
    salaryNum: 75000, salary: "$75k+", growth: 10, growthStr: "10%", demand: "High", topUnis: ["UPenn", "NYU", "Northwestern"],
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=800",
    special_features: ["Brand Management", "Digital Strategy", "Consumer Behavior"],
    noticable_facts: ["Fast-paced creative environment", "Heavy shift toward data-driven ROI"],
  },
  {
    id: 20, category: "Humanities", icon: "🌎", title: "International Relations", desc: "The study of the interactions of nation-states and non-governmental organizations in fields like politics and economics.",
    salaryNum: 85000, salary: "$85k+", growth: 7, growthStr: "7%", demand: "Moderate", topUnis: ["Georgetown", "Harvard", "Sciences Po"],
    image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=800",
    special_features: ["Diplomacy", "Global Security", "Human Rights"],
    noticable_facts: ["Careers in UN, Embassies, NGOs", "Requires multilingual skills often"],
  },
  {
    id: 21, category: "Health", icon: "🩹", title: "Nursing & Patient Care", desc: "Focuses on the care of individuals, families, and communities so they may attain, maintain, or recover optimal health.",
    salaryNum: 80000, salary: "$80k+", growth: 40, growthStr: "40% (NP)", demand: "Extremely High", topUnis: ["Johns Hopkins", "UPenn", "King's College"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800",
    special_features: ["Critical Care", "Pediatrics", "Gerontology"],
    noticable_facts: ["Widest demand across all regions", "High emotional fulfillment"],
  },
  {
    id: 22, category: "STEM", icon: "🔋", title: "Renewable Energy Engineering", desc: "Focusing on the development of sustainable energy sources like solar, wind, and geothermal power.",
    salaryNum: 105000, salary: "$105k+", growth: 25, growthStr: "25%", demand: "High", topUnis: ["UC Berkeley", "TU Delft", "Stanford"],
    image: "https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?q=80&w=800",
    special_features: ["Photovoltaics", "Smart Grid Tech", "Energy Storage"],
    noticable_facts: ["Key to Net Zero targets", "Significant VC investment"],
  },
  {
    id: 23, category: "Creative", icon: "🎵", title: "Music & Sound Design", desc: "The art of creating, performing, and producing sound and music for various media and audiences.",
    salaryNum: 65000, salary: "$65k+", growth: 4, growthStr: "4%", demand: "Competitive", topUnis: ["Berklee", "Juilliard", "Royal College of Music"],
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800",
    special_features: ["Audio Engineering", "Composition", "Music Therapy"],
    noticable_facts: ["Digital streaming has changed the industry", "Strong freelance/gig economy"],
  },
  {
    id: 24, category: "Humanities", icon: "🏛️", title: "History & Archaeology", desc: "The study of the past through written records and physical artifacts to understand human civilization.",
    salaryNum: 65000, salary: "$65k+", growth: 5, growthStr: "5%", demand: "Moderate", topUnis: ["Oxford", "Cambridge", "Harvard"],
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800",
    special_features: ["Cultural Heritage", "Digital Humanities", "Archival Science"],
    noticable_facts: ["Critical thinking foundation", "Essential for museum & tourism"],
  },
  {
    id: 25, category: "Business", icon: "🏦", title: "Accounting & Audit", desc: "Measurement, processing, and communication of financial information about economic entities.",
    salaryNum: 78000, salary: "$78k+", growth: 6, growthStr: "6%", demand: "High", topUnis: ["UT Austin", "BYU", "UIUC"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800",
    special_features: ["Forensic Accounting", "Tax Law", "Corporate Governance"],
    noticable_facts: ["The 'language of business'", "CPA certification is highly valued"],
  },
  {
    id: 26, category: "Humanities", icon: "🗳️", title: "Political Science", desc: "The study of systems of government, political behavior, and the analysis of political activities.",
    salaryNum: 120000, salary: "$120k+ (Policy)", growth: 6, growthStr: "6%", demand: "Moderate", topUnis: ["Harvard", "LSE", "Stanford"],
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=800",
    special_features: ["Public Policy", "Political Theory", "Comparative Politics"],
    noticable_facts: ["Gateway to law and government", "Strong focus on data in modern poly-sci"],
  },
  {
    id: 27, category: "STEM", icon: "🏢", title: "Civil & Structural Engineering", desc: "Designing and overseeing the construction of public works, such as roads, bridges, and dams.",
    salaryNum: 95000, salary: "$95k+", growth: 7, growthStr: "7%", demand: "High", topUnis: ["UC Berkeley", "ETH Zurich", "Tsinghua"],
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800",
    special_features: ["Geotechnical Eng", "Structural Integrity", "Transportation"],
    noticable_facts: ["Oldest engineering discipline", "Key for infrastructure resilience"],
  },
  {
    id: 28, category: "STEM", icon: "🧪", title: "Chemical Engineering", desc: "Bridging physical sciences and life sciences with mathematics and economics to transform raw materials into useful products.",
    salaryNum: 110000, salary: "$110k+", growth: 8, growthStr: "8%", demand: "High", topUnis: ["MIT", "Stanford", "Cambridge"],
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800",
    special_features: ["Process Optimization", "Nanotechnology", "Material Science"],
    noticable_facts: ["Highest paid of core engineering", "Vast applications in energy & pharma"],
  },
  {
    id: 29, category: "Humanities", icon: "🗣️", title: "Sociology", desc: "The study of social life, social change, and the social causes and consequences of human behavior.",
    salaryNum: 70000, salary: "$70k+", growth: 5, growthStr: "5%", demand: "Moderate", topUnis: ["Harvard", "Oxford", "Berkeley"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800",
    special_features: ["Social Research", "Demography", "Urban Sociology"],
    noticable_facts: ["Critical for social justice work", "Strong qualitative analysis skills"],
  },
  {
    id: 30, category: "Humanities", icon: "📜", title: "Philosophy", desc: "Investigation of fundamental truths about ourselves, the world, and our relationships to the world and each other.",
    salaryNum: 75000, salary: "$75k+", growth: 4, growthStr: "4%", demand: "Moderate", topUnis: ["NYU", "Oxford", "Rutgers"],
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800",
    special_features: ["Ethics & Logic", "Epistemology", "Political Philosophy"],
    noticable_facts: ["Highest LSAT scores on average", "Foundation for AI Ethics"],
  }
];

export default function FieldsPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const filtered = useMemo(() => {
    let r = fieldsData;
    if (activeCat !== "All") r = r.filter(f => f.category === activeCat);
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(f => f.title.toLowerCase().includes(s) || f.desc.toLowerCase().includes(s));
    }
    return r;
  }, [activeCat, search]);

  const stats = useMemo(() => {
    const avgSalary = Math.round(fieldsData.reduce((acc, f) => acc + f.salaryNum, 0) / fieldsData.length / 1000);
    const avgGrowth = (fieldsData.reduce((acc, f) => acc + f.growth, 0) / fieldsData.length).toFixed(1);
    return [
      { label: "Academic Fields", value: fieldsData.length },
      { label: "Avg Growth", value: `${avgGrowth}%` },
      { label: "Avg Salary", value: `$${avgSalary}k` },
      { label: "Categories", value: CATS.length - 1 }
    ];
  }, []);

  return (
    <>
      <PublicHeader />
      {selectedField && (
        <InfoModal
          isOpen={!!selectedField}
          onClose={() => setSelectedField(null)}
          title={selectedField.title}
          subtitle={`${selectedField.category} Field`}
          icon={selectedField.icon}
          image={selectedField.image}
          description={selectedField.desc}
          specialFeatures={selectedField.special_features}
          stats={[
            { label: "Avg Salary", value: selectedField.salary },
            { label: "Job Growth", value: selectedField.growthStr },
            { label: "Demand", value: selectedField.demand }
          ]}
          tips={selectedField.noticable_facts || [
            "Network with professionals in the field early.",
            "Gain practical experience through internships.",
            "Stay updated with the latest industry trends."
          ]}
          ctaLink="/roadmaps"
          ctaLabel="View Career Roadmap"
        />
      )}

      <main id="mainContent" style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg-color)" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "1280px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", marginBottom: "1rem", fontWeight: 800 }}>Explore {fieldsData.length} Academic Fields</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "3rem", fontWeight: 500 }}>
              Discover diverse academic disciplines with salary data, growth projections, top universities, and career insights to find your perfect path.
            </motion.p>
            
            <div className={styles.searchBox}>
              <Search style={{ color: "#6366f1", opacity: 0.5 }} size={20} />
              <input 
                type="text" 
                placeholder="Search fields and disciplines..." 
                className={styles.searchInput} 
                value={search} 
                onChange={e => setSearch(e.target.value)}
              />
              <button className={styles.searchBtn}>Search</button>
            </div>

            <div className={styles.statsRow}>
              {stats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className={styles.statCard}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </motion.div>
              ))}
            </div>

            <div className={styles.tabsRow}>
              {CATS.map((c) => (
                <button 
                  key={c.id} 
                  className={`${styles.tabBtn} ${activeCat === c.id ? styles.active : ""}`}
                  onClick={() => setActiveCat(c.id)}
                >
                  {c.icon} {c.label}
                  {c.id !== "All" && (
                    <span className={styles.tabCount}>
                      {fieldsData.filter(f => f.category === c.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className={styles.grid}>
              <AnimatePresence>
                {filtered.map((field, i) => (
                  <motion.div key={field.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.iconWrapper}>{field.icon}</div>
                      <div>
                        <h3 className={styles.title}>{field.title}</h3>
                        <span className={styles.category}>{field.category}</span>
                      </div>
                    </div>
                    
                    <p className={styles.description}>{field.desc}</p>
                    
                    {field.topUnis && (
                      <div className={styles.uniList}>
                        {field.topUnis.map(u => (
                          <div key={u} className={styles.uniPill}>
                            <GraduationCap size={14} /> {u}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.growthRow}>
                      <div className={styles.growthItem}><TrendingUp size={16} color="#10b981" /> {field.growthStr}</div>
                      <div className={styles.growthItem}><Zap size={16} color="#f59e0b" /> {field.demand}</div>
                    </div>

                    <div className={styles.footer}>
                      <div>
                        <span className={styles.salaryLabel}>AVG SALARY</span>
                        <span className={styles.salaryValue}>{field.salary}</span>
                      </div>
                      <button className={styles.exploreBtn} onClick={() => setSelectedField(field)}>
                        Explore <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}