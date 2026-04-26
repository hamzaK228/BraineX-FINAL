"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, Brain, Briefcase, TrendingUp, Sparkles, ArrowRight, BookOpen, Microscope, Globe, Palette, Users, DollarSign, GraduationCap, Heart } from "lucide-react";

type Field = {
  id: number; category: string; icon: string; title: string; desc: string; salary: string; growth: string; demand: string; topUnis: string;
  special_features?: string[]; noticable_facts?: string[]; image?: string;
};

const fieldsData: Field[] = [
  { id: 1, category: "stem", icon: "💻", title: "Computer Science", desc: "The study of computation, algorithms, and information systems. Covers AI, cybersecurity, distributed systems, and software engineering. The backbone of the digital age.", salary: "$120k", growth: "15%", demand: "Very High", topUnis: "MIT, Stanford, CMU", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop", special_features: ["Artificial Intelligence & Machine Learning", "Cybersecurity & Cryptography", "Cloud Computing & DevOps", "Quantum Computing Research"], noticable_facts: ["Highest starting salaries among all fields", "Remote-friendly with global demand", "Over 500,000 unfilled positions in the US alone", "Fastest growing field in education", "Foundation for interdisciplinary innovation"] },
  { id: 2, category: "business", icon: "📊", title: "Business Administration", desc: "Strategic management of business operations, organizational leadership, and decision-making. Covers marketing, operations, HR, and corporate strategy.", salary: "$90k", growth: "8%", demand: "High", topUnis: "Wharton, HBS, INSEAD", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop", special_features: ["Strategic Management & Planning", "Entrepreneurship & Startups", "Supply Chain & Operations", "Digital Transformation"], noticable_facts: ["MBA is the most popular graduate degree globally", "Versatile — applicable to every industry", "Strong alumni networks provide career leverage", "High potential for C-suite executive roles", "Increasingly data-driven curriculum"] },
  { id: 3, category: "stem", icon: "⚙️", title: "Engineering", desc: "Application of physics, mathematics, and materials science to design and build structures, machines, and systems. Spans civil, mechanical, electrical, and aerospace.", salary: "$100k", growth: "10%", demand: "High", topUnis: "MIT, Caltech, ETH Zurich", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop", special_features: ["Robotics & Automation", "Renewable Energy Systems", "Aerospace & Defense Design", "Civil Infrastructure & Smart Cities"], noticable_facts: ["Professional licensure (PE) boosts credibility", "Hands-on problem solving in every role", "Bridge between science and real-world application", "Critical for climate change solutions", "Strong job security across economic cycles"] },
  { id: 4, category: "business", icon: "📈", title: "Finance & Economics", desc: "The science of money, markets, and investment. Studies how individuals, companies, and governments allocate resources. Covers banking, trading, and economic policy.", salary: "$105k", growth: "9%", demand: "High", topUnis: "Wharton, LSE, Chicago", image: "https://images.unsplash.com/photo-1611974714024-462702c28ca8?q=80&w=1200&auto=format&fit=crop", special_features: ["Investment Banking & Private Equity", "Quantitative Finance & Algorithmic Trading", "Risk Management & Compliance", "FinTech & Blockchain Applications"], noticable_facts: ["Bonus-heavy compensation in banking", "Increasingly quantitative — Python & R are essential", "Critical to every industry and government", "CFA certification adds $50k+ to salary", "Global career mobility"] },
  { id: 5, category: "stem", icon: "🧬", title: "Biology & Biomedical Science", desc: "The study of life at molecular, cellular, and organismal levels. Covers genetics, neuroscience, immunology, biotech, and pharmaceutical development.", salary: "$85k", growth: "12%", demand: "High", topUnis: "Harvard, Johns Hopkins, Cambridge", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop", special_features: ["Genomics & CRISPR Gene Editing", "Neuroscience & Brain-Computer Interfaces", "Drug Discovery & Pharmacology", "Bioinformatics & Computational Biology"], noticable_facts: ["Biotech industry growing at 15% annually", "CRISPR is revolutionizing medicine", "PhD often required for research roles", "Strong overlap with AI for drug discovery", "Aging populations driving massive demand"] },
  { id: 6, category: "stem", icon: "🔬", title: "Physics & Astronomy", desc: "Understanding the fundamental laws governing the universe — from subatomic particles to galaxies. Covers quantum mechanics, astrophysics, and materials science.", salary: "$95k", growth: "7%", demand: "Moderate", topUnis: "MIT, Princeton, CERN/ETH", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop", special_features: ["Quantum Computing & Information", "Particle Physics & CERN Research", "Astrophysics & Space Exploration", "Materials Science & Nanotechnology"], noticable_facts: ["Foundation for all engineering disciplines", "Strongest analytical training available", "PhD opens doors to finance & tech careers", "Space industry growing rapidly (SpaceX, NASA Artemis)", "Nobel Prize-level research opportunities"] },
  { id: 7, category: "stem", icon: "🧮", title: "Mathematics & Statistics", desc: "The language of science. Pure math, applied math, statistics, and data science form the foundation of modern technology, AI, finance, and scientific research.", salary: "$95k", growth: "14%", demand: "Very High", topUnis: "MIT, Princeton, Cambridge", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop", special_features: ["Data Science & Machine Learning", "Actuarial Science & Insurance", "Cryptography & Information Theory", "Operations Research & Optimization"], noticable_facts: ["Data Scientist = 'Sexiest Job of the 21st Century'", "Actuaries earn $120k+ with great work-life balance", "Math majors have highest GRE scores on average", "Foundation for PhD in any quantitative field", "Quant finance roles pay $200k+ starting"] },
  { id: 8, category: "health", icon: "🏥", title: "Medicine & Healthcare", desc: "Diagnosis, treatment, and prevention of disease. Covers clinical medicine, public health, nursing, and health administration. The most impactful profession globally.", salary: "$130k", growth: "13%", demand: "Very High", topUnis: "Harvard Med, Johns Hopkins, Oxford", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop", special_features: ["Clinical Research & Trials", "Digital Health & Telemedicine", "Surgical Innovation & Robotics", "Global Health & Epidemiology"], noticable_facts: ["10-14 years of training but unmatched job security", "AI is transforming diagnostics, not replacing doctors", "Global shortage of 18 million health workers", "Highest public trust of any profession", "Immense personal fulfillment"] },
  { id: 9, category: "stem", icon: "🌍", title: "Environmental Science", desc: "Studying Earth's systems and human impact on the environment. Covers climate science, conservation biology, renewable energy, and sustainability policy.", salary: "$75k", growth: "11%", demand: "Growing", topUnis: "ETH Zurich, Stanford, Wageningen", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop", special_features: ["Climate Modeling & Prediction", "Conservation & Biodiversity", "Renewable Energy Engineering", "Environmental Policy & Law"], noticable_facts: ["Climate tech is the fastest-growing investment sector", "UN SDGs driving global job creation", "Interdisciplinary — combines science, policy, and tech", "Strong growth in ESG consulting", "Every industry needs sustainability experts"] },
  { id: 10, category: "creative", icon: "🎨", title: "Design & Visual Arts", desc: "Creating visual solutions that communicate, inspire, and solve problems. Covers graphic design, UX/UI, motion graphics, illustration, and brand identity.", salary: "$75k", growth: "8%", demand: "High", topUnis: "RISD, RCA, Parsons", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop", special_features: ["UX/UI Design & Research", "Motion Graphics & Animation", "Brand Identity & Strategy", "3D Design & Spatial Computing"], noticable_facts: ["UX designers earn $100k+ at top tech companies", "Every tech company needs design talent", "Portfolio matters more than degree", "AI tools are augmenting, not replacing designers", "Figma proficiency is now essential"] },
  { id: 11, category: "creative", icon: "🎬", title: "Film, Media & Communication", desc: "Storytelling through visual and digital media. Covers filmmaking, journalism, digital marketing, PR, and content strategy for the modern media landscape.", salary: "$70k", growth: "7%", demand: "Moderate", topUnis: "USC, NYU, UCLA", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop", special_features: ["Documentary & Narrative Film", "Digital Marketing & Content Strategy", "Journalism & Investigative Reporting", "Social Media & Influencer Economy"], noticable_facts: ["Streaming industry worth $100B+", "Content marketing is the #1 B2B strategy", "Freelancing is extremely common and viable", "AI is creating new roles in content production", "Strong storytelling skills transfer everywhere"] },
  { id: 12, category: "humanities", icon: "⚖️", title: "Law & Political Science", desc: "The study of governance, justice, and legal systems. Covers constitutional law, international relations, human rights, and public policy.", salary: "$95k", growth: "6%", demand: "Moderate", topUnis: "Harvard Law, Yale, Oxford", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop", special_features: ["Corporate & International Law", "Human Rights & Constitutional Law", "Diplomacy & International Relations", "Public Policy & Governance"], noticable_facts: ["Law school is 3 years post-bachelor's", "Top law firm associates earn $200k+ starting", "Tech law (AI, privacy) is the fastest-growing area", "Transferable critical thinking and argumentation", "Essential for democracy and social justice"] },
  { id: 13, category: "humanities", icon: "🧠", title: "Psychology & Cognitive Science", desc: "Understanding human behavior, cognition, and mental processes. Covers clinical psychology, behavioral economics, neuroscience, and organizational psychology.", salary: "$80k", growth: "10%", demand: "High", topUnis: "Stanford, Harvard, UCL", image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1200&auto=format&fit=crop", special_features: ["Clinical & Counseling Psychology", "Behavioral Economics & Nudge Theory", "Cognitive Neuroscience & Brain Imaging", "Organizational & Industrial Psychology"], noticable_facts: ["Mental health awareness driving massive demand", "UX Research heavily draws from psychology", "Behavioral economics influences policy worldwide", "PhD clinical psychologists earn $100k+", "Intersects with AI, education, and healthcare"] },
  { id: 14, category: "stem", icon: "🤖", title: "Data Science & AI", desc: "Extracting insights from data using statistics, machine learning, and domain expertise. The driving force behind modern technology, business, and scientific discovery.", salary: "$130k", growth: "22%", demand: "Very High", topUnis: "MIT, Stanford, Berkeley", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop", special_features: ["Deep Learning & Neural Networks", "Natural Language Processing (LLMs)", "Computer Vision & Generative AI", "MLOps & Model Deployment"], noticable_facts: ["Fastest salary growth of any field", "Python, SQL, and cloud skills are essential", "Every industry is hiring data/AI talent", "AI research is the new space race", "Kaggle competitions are the best portfolio builder"] },
  { id: 15, category: "health", icon: "💊", title: "Pharmacy & Pharmaceutical Science", desc: "The science of drug discovery, development, and therapeutic use. Covers medicinal chemistry, pharmacology, clinical trials, and regulatory science.", salary: "$110k", growth: "8%", demand: "High", topUnis: "UCSF, UCL, UNC", image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop", special_features: ["Drug Discovery & Medicinal Chemistry", "Clinical Pharmacology & Trials", "Regulatory Affairs & FDA Approval", "Pharmaceutical Biotechnology"], noticable_facts: ["PharmD is a 4-year doctoral program", "Pharmaceutical industry worth $1.4 trillion", "AI is accelerating drug discovery by 10x", "Strong job security and stable hours", "Critical role in personalized medicine"] },
  { id: 16, category: "creative", icon: "🏛️", title: "Architecture & Urban Planning", desc: "Designing buildings, cities, and spaces that shape how people live. Combines art, engineering, and environmental sustainability.", salary: "$80k", growth: "7%", demand: "Moderate", topUnis: "MIT, AA London, ETH Zurich", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1200&auto=format&fit=crop", special_features: ["Sustainable & Green Architecture", "Urban Design & Smart Cities", "Computational Design & BIM", "Interior Architecture & Experience Design"], noticable_facts: ["5-year bachelor's is standard in most countries", "Licensure required to practice independently", "Sustainability is reshaping the entire profession", "Parametric design & AI tools are transforming workflows", "Strong blend of creativity and technical rigor"] },
];

export default function FieldsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [search, setSearch] = useState("");

  const filteredFields = useMemo(() => {
    let result = fieldsData;
    if (activeFilter !== "all") { result = result.filter(f => f.category === activeFilter); }
    if (search) { const s = search.toLowerCase(); result = result.filter(f => f.title.toLowerCase().includes(s) || f.desc.toLowerCase().includes(s)); }
    return result;
  }, [activeFilter, search]);

  const categoryColors: Record<string, string> = { stem: "#6366f1", business: "#f59e0b", creative: "#ec4899", health: "#10b981", humanities: "#8b5cf6" };

  return (
    <>
      <PublicHeader />
      {selectedField && (
        <InfoModal isOpen={!!selectedField} onClose={() => setSelectedField(null)} title={selectedField.title} subtitle={`${selectedField.category.toUpperCase()} Field`} icon={selectedField.icon}
          image={selectedField.image} description={selectedField.desc} specialFeatures={selectedField.special_features}
          stats={[{ label: "Avg Salary", value: selectedField.salary }, { label: "Job Growth", value: selectedField.growth }, { label: "Demand", value: selectedField.demand }]}
          tips={selectedField.noticable_facts || []} ctaLink="/roadmaps" ctaLabel="View Career Roadmap" />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
              Explore {fieldsData.length} Academic Fields
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Discover diverse academic disciplines with salary data, growth projections, top universities, and career insights to find your perfect path.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#6366f1", marginLeft: "0.5rem" }} />
              <input type="text" placeholder="Search fields and disciplines..." className={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#6366f1" }}>Search</button>
            </motion.div>
          </div>
        </section>

        {/* Quick Stats Bar */}
        <section style={{ padding: "2rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", textAlign: "center" }}>
              {[
                { icon: <BookOpen size={20} />, label: "Academic Fields", value: "16", color: "#6366f1" },
                { icon: <TrendingUp size={20} />, label: "Avg Growth", value: "10.2%", color: "#10b981" },
                { icon: <DollarSign size={20} />, label: "Avg Salary", value: "$97k", color: "#f59e0b" },
                { icon: <Users size={20} />, label: "Categories", value: "5", color: "#ec4899" },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                  style={{ background: "rgba(30,41,59,0.3)", borderRadius: "16px", padding: "1.25rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: s.color, marginBottom: "0.5rem" }}>
                    {s.icon}
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#f8fafc" }}>{s.value}</span>
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <div className={styles.filterTabs}>
              {[
                { key: "all", label: "All Fields", icon: <Globe size={18} /> },
                { key: "stem", label: "STEM", icon: <Microscope size={18} /> },
                { key: "business", label: "Business", icon: <Briefcase size={18} /> },
                { key: "health", label: "Health", icon: <Heart size={18} /> },
                { key: "creative", label: "Creative", icon: <Palette size={18} /> },
                { key: "humanities", label: "Humanities", icon: <BookOpen size={18} /> },
              ].map(tab => (
                <button key={tab.key} className={`${styles.filterTab} ${activeFilter === tab.key ? styles.active : ''}`} onClick={() => setActiveFilter(tab.key)}>
                  {tab.icon} {tab.label}
                  {activeFilter !== tab.key && (
                    <span style={{ background: "rgba(255,255,255,0.1)", padding: "0.1rem 0.4rem", borderRadius: "8px", fontSize: "0.7rem", fontWeight: "bold" }}>
                      {tab.key === "all" ? fieldsData.length : fieldsData.filter(f => f.category === tab.key).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <motion.div layout className={styles.fieldsGrid}>
              <AnimatePresence>
                {filteredFields.map((field, index) => (
                  <motion.div key={field.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.04 }} className={styles.fieldCard}>
                    <div className={styles.fieldHeader}>
                      <div className={styles.fieldIconWrapper} style={{ background: `${categoryColors[field.category] || '#6366f1'}15`, borderColor: `${categoryColors[field.category] || '#6366f1'}30` }}>
                        {field.icon}
                      </div>
                      <div>
                        <h3 className={styles.fieldTitle}>{field.title}</h3>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: categoryColors[field.category] || '#6366f1' }}>
                          {field.category}
                        </span>
                      </div>
                    </div>
                    <p className={styles.fieldDesc}>{field.desc}</p>

                    {/* Top Universities mini */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", padding: "0.6rem 0.8rem", background: "rgba(15,23,42,0.4)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <GraduationCap size={14} color="#94a3b8" />
                      <span style={{ fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 500 }}>{field.topUnis}</span>
                    </div>

                    <div className={styles.fieldStatsRow}>
                      <div className={styles.miniStat}>
                        <TrendingUp size={14} color="#10b981" />
                        <span>{field.growth} Growth</span>
                      </div>
                      <div className={styles.miniStat}>
                        <Brain size={14} color={categoryColors[field.category] || '#6366f1'} />
                        <span>{field.demand}</span>
                      </div>
                    </div>

                    <div className={styles.fieldFooter}>
                      <div className={styles.salaryInfo}>
                        <span className={styles.salaryLabel}>Avg Salary</span>
                        <span className={styles.salaryValue}>{field.salary}</span>
                      </div>
                      <button onClick={() => setSelectedField(field)} className={styles.exploreBtn}>
                        Explore <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Featured Pathways */}
        <section className={styles.pathwaysSection}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: "1rem" }}>Trending Career Pathways</h2>
            <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: "3rem", fontSize: "1.1rem" }}>The hottest career paths combining multiple academic disciplines</p>
            <div className={styles.pathwaysGrid}>
              {[
                { title: "AI Architect", desc: "CS + Math + Ethics → Design the future of intelligence.", icon: <Sparkles color="#fbbf24" />, bg: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop" },
                { title: "BioTech Innovator", desc: "Biology + CS + Business → Revolutionary drug discovery.", icon: <Microscope color="#10b981" />, bg: "https://images.unsplash.com/photo-1504868584819-f8eec746dcc4?q=80&w=400&auto=format&fit=crop" },
                { title: "Climate Tech Lead", desc: "Environmental Sci + Engineering + Policy → Save the planet.", icon: <Globe color="#3b82f6" />, bg: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=400&auto=format&fit=crop" },
                { title: "FinTech Founder", desc: "Finance + CS + Design → Reshape global banking.", icon: <TrendingUp color="#f59e0b" />, bg: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400&auto=format&fit=crop" },
              ].map((pathway, i) => (
                <div key={i} className={styles.pathwayCard} style={{ background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('${pathway.bg}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
                  <div className={styles.pathwayContent}>
                    {pathway.icon}
                    <h3>{pathway.title}</h3>
                    <p>{pathway.desc}</p>
                    <Link href="/roadmaps" className={styles.pathwayLink}>Explore Roadmap →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
