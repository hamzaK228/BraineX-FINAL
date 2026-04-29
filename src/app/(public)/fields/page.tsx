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

const fieldsData: Field[] = [
  {
    id: 1, category: "STEM", icon: "💻", title: "Computer Science", desc: "The study of computation, algorithms, and information systems. Covers AI, cybersecurity, distributed systems, and software engineering. The backbone of the digital age.",
    salaryNum: 120000, salary: "$120k", growth: 15, growthStr: "15% Growth", demand: "Very High", topUnis: ["MIT", "Stanford", "CMU"],
    special_features: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing"],
    noticable_facts: ["Highest starting salaries across all majors", "Strong remote-work culture", "500k+ unfilled positions globally"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800"
  },
  {
    id: 2, category: "Business", icon: "📊", title: "Business Administration", desc: "Strategic management of business operations, organizational leadership, and decision-making. Covers marketing, operations, HR, and corporate strategy.",
    salaryNum: 90000, salary: "$90k", growth: 8, growthStr: "8% Growth", demand: "High", topUnis: ["Wharton", "HBS", "INSEAD"],
    special_features: ["Strategic Management", "Entrepreneurship", "Digital Transformation"],
    noticable_facts: ["MBA is the most popular graduate degree", "Versatile career path", "High potential for C-suite roles"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"
  },
  {
    id: 3, category: "STEM", icon: "⚙️", title: "Engineering", desc: "Application of physics, mathematics, and materials science to design and build structures, machines, and systems. Spans civil, mechanical, electrical, and aerospace.",
    salaryNum: 100000, salary: "$100k", growth: 10, growthStr: "10% Growth", demand: "High", topUnis: ["MIT", "Caltech", "ETH Zurich"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800"
  },
  {
    id: 4, category: "Business", icon: "📈", title: "Finance & Economics", desc: "The science of money, markets, and investment. Studies how individuals, companies, and governments allocate resources. Covers banking, trading, and economic policy.",
    salaryNum: 110000, salary: "$110k", growth: 12, growthStr: "12% Growth", demand: "High", topUnis: ["Wharton", "LSE", "Chicago"],
    image: "https://images.unsplash.com/photo-1611974714024-4693895e6912?q=80&w=800"
  },
  {
    id: 5, category: "STEM", icon: "🧬", title: "Biology & Biomedical Science", desc: "The study of life at molecular, cellular, and organismal levels. Covers genetics, neuroscience, immunology, biotech, and pharmaceutical development.",
    salaryNum: 95000, salary: "$95k", growth: 11, growthStr: "11% Growth", demand: "High", topUnis: ["Harvard", "Johns Hopkins", "Cambridge"],
    image: "https://images.unsplash.com/photo-1532187863486-abf9d3a3522a?q=80&w=800"
  },
  {
    id: 6, category: "STEM", icon: "🌌", title: "Physics & Astronomy", desc: "Understanding the fundamental laws governing the universe — from subatomic particles to galaxies. Covers quantum mechanics, astrophysics, and materials science.",
    salaryNum: 105000, salary: "$105k", growth: 9, growthStr: "9% Growth", demand: "High", topUnis: ["MIT", "Princeton", "CERN/ETH"],
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800"
  },
  {
    id: 7, category: "STEM", icon: "🧮", title: "Mathematics & Statistics", desc: "The language of science. Pure math, applied math, statistics, and data science form the foundation of modern technology, AI, finance, and scientific research.",
    salaryNum: 95000, salary: "$95k", growth: 14, growthStr: "14% Growth", demand: "Very High", topUnis: ["MIT", "Princeton", "Cambridge"],
    image: "https://images.unsplash.com/photo-1509228468518-180dd482180c?q=80&w=800"
  },
  {
    id: 8, category: "Health", icon: "🩺", title: "Medicine & Healthcare", desc: "Diagnosis, treatment, and prevention of disease. Covers clinical medicine, public health, nursing, and health administration. The most impactful profession globally.",
    salaryNum: 130000, salary: "$130k", growth: 13, growthStr: "13% Growth", demand: "Very High", topUnis: ["Harvard Med", "Johns Hopkins", "Oxford"],
    image: "https://images.unsplash.com/photo-1505751172107-597d7a423b9c?q=80&w=800"
  },
  {
    id: 9, category: "STEM", icon: "🌍", title: "Environmental Science", desc: "Studying Earth's systems and human impact on the environment. Covers climate science, conservation biology, renewable energy, and sustainability policy.",
    salaryNum: 75000, salary: "$75k", growth: 11, growthStr: "11% Growth", demand: "Growing", topUnis: ["ETH Zurich", "Stanford", "Wageningen"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800"
  },
  {
    id: 10, category: "Creative", icon: "🎨", title: "Design & Visual Arts", desc: "Creating visual solutions that communicate, inspire, and solve problems. Covers graphic design, UX/UI, motion graphics, illustration, and brand identity.",
    salaryNum: 65000, salary: "$65k", growth: 8, growthStr: "8% Growth", demand: "High", topUnis: ["RISD", "RCA", "Parsons"],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800"
  },
  {
    id: 11, category: "Creative", icon: "🎬", title: "Film, Media & Communication", desc: "Storytelling through visual and digital media. Covers filmmaking, journalism, digital marketing, PR, and content strategy for the modern media landscape.",
    salaryNum: 70000, salary: "$70k", growth: 7, growthStr: "7% Growth", demand: "Moderate", topUnis: ["USC", "NYU", "UCLA"],
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800"
  },
  {
    id: 12, category: "Humanities", icon: "⚖️", title: "Law & Political Science", desc: "The study of governance, justice, and legal systems. Covers constitutional law, international relations, human rights, and public policy.",
    salaryNum: 120000, salary: "$120k", growth: 6, growthStr: "6% Growth", demand: "Moderate", topUnis: ["Harvard Law", "Yale", "Oxford"],
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800"
  },
  {
    id: 13, category: "Humanities", icon: "🧠", title: "Psychology & Cognitive Science", desc: "Understanding human behavior, cognition, and mental processes. Covers clinical psychology, behavioral economics, neuroscience, and organizational psychology.",
    salaryNum: 80000, salary: "$80k", growth: 10, growthStr: "10% Growth", demand: "High", topUnis: ["Stanford", "Harvard", "UCL"],
    image: "https://images.unsplash.com/photo-1527067829737-402993088e6b?q=80&w=800"
  },
  {
    id: 14, category: "STEM", icon: "🤖", title: "Data Science & AI", desc: "Extracting insights from data using statistics, machine learning, and domain expertise. The driving force behind modern technology, business, and scientific discovery.",
    salaryNum: 130000, salary: "$130k", growth: 22, growthStr: "22% Growth", demand: "Very High", topUnis: ["MIT", "Stanford", "Berkeley"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800"
  },
  {
    id: 15, category: "Health", icon: "💊", title: "Pharmacy & Pharmaceutical Science", desc: "The science of drug discovery, development, and therapeutic use. Covers medicinal chemistry, pharmacology, clinical trials, and regulatory science.",
    salaryNum: 110000, salary: "$110k", growth: 8, growthStr: "8% Growth", demand: "High", topUnis: ["UCSF", "UCL", "UNC"],
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=800"
  },
  {
    id: 16, category: "Creative", icon: "🏛️", title: "Architecture & Urban Planning", desc: "Designing buildings, cities, and spaces that shape how people live. Combines art, engineering, and environmental sustainability.",
    salaryNum: 85000, salary: "$85k", growth: 9, growthStr: "9% Growth", demand: "High", topUnis: ["MIT", "AA London", "ETH Zurich"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800"
  }
];

const CATS = [
  { id: "All", label: "All Fields", icon: <Globe size={16} /> },
  { id: "STEM", label: "STEM", icon: <Microscope size={16} /> },
  { id: "Business", label: "Business", icon: <Briefcase size={16} /> },
  { id: "Health", label: "Health", icon: <Heart size={16} /> },
  { id: "Creative", label: "Creative", icon: <Palette size={16} /> },
  { id: "Humanities", label: "Humanities", icon: <BookOpen size={16} /> }
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

      <main id="mainContent" style={{ paddingTop: "80px", minHeight: "100vh", background: "#0f172a" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "1280px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", marginBottom: "1rem", fontWeight: 800 }}>Explore 16 Academic Fields</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: "1.2rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
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