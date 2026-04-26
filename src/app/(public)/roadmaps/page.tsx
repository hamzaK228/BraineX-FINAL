"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, Map, Clock, BookOpen, Sparkles, ArrowRight, CheckCircle2, Bookmark, GraduationCap, Filter, ChevronDown } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

type Roadmap = { id: string; title: string; description: string; level: string; path: string; time: string; modules: number; tags: string[]; special_features?: string[]; noticable_facts?: string[]; image?: string; };

const roadmapsData: Roadmap[] = [
  { id: "r1", title: "Frontend Developer", description: "Master HTML, CSS, JavaScript, and React to build modern, responsive web interfaces. Covers accessibility, performance optimization, and state management.", level: "Beginner", path: "Frontend", time: "3-6 Months", modules: 12, tags: ["React", "CSS", "JavaScript"], image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop", special_features: ["Project-based learning with 5 capstone projects", "React Hooks & Redux state management", "Responsive Design with CSS Grid & Flexbox", "TypeScript fundamentals"], noticable_facts: ["Start with free resources like freeCodeCamp & MDN", "Build a portfolio site as your first project", "Learn Git early — every job requires it", "Focus on ONE framework deeply before branching out", "Practice daily on Frontend Mentor challenges"] },
  { id: "r2", title: "Backend Developer", description: "Master Node.js, databases (SQL & NoSQL), REST/GraphQL APIs, authentication, and server architecture. Learn to build scalable, secure backend systems.", level: "Intermediate", path: "Backend", time: "3-6 Months", modules: 15, tags: ["Node.js", "SQL", "APIs"], image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop", special_features: ["System Design Fundamentals", "RESTful & GraphQL API design", "Database optimization & indexing", "JWT Auth & OAuth implementation"], noticable_facts: ["Learn SQL before NoSQL — fundamentals matter", "Build a REST API project before learning GraphQL", "Understand HTTP status codes deeply", "Always validate input on the server side", "Deploy on Railway or Render for free practice"] },
  { id: "r3", title: "Machine Learning Engineer", description: "Dive deep into Python, linear algebra, statistics, and neural networks to build production-grade AI models. Covers NLP, Computer Vision, and MLOps.", level: "Advanced", path: "AI & Data", time: "> 6 Months", modules: 20, tags: ["Python", "TensorFlow", "Math"], image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop", special_features: ["Deep Learning with PyTorch & TensorFlow", "NLP: transformers, BERT, GPT fine-tuning", "Computer Vision: CNNs, object detection", "MLOps: Docker, MLflow, model deployment"], noticable_facts: ["Master Python & NumPy before anything else", "Take Andrew Ng's free ML course on Coursera first", "Kaggle competitions are the best practice", "Learn to read research papers — start with Arxiv Sanity", "Focus on one domain (NLP or CV) before generalizing"] },
  { id: "r4", title: "Full-Stack Web3 Developer", description: "Build decentralized applications with Solidity, Hardhat, ethers.js, and Next.js. Learn smart contract security, DeFi, and NFT development.", level: "Advanced", path: "Web3", time: "> 6 Months", modules: 18, tags: ["Solidity", "Blockchain", "Web3.js"], image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop", special_features: ["Smart Contract Security & Auditing", "DeFi Protocol Building (AMM, Lending)", "NFT Marketplace from scratch", "Layer 2 Solutions (Polygon, Arbitrum)"], noticable_facts: ["Learn JavaScript/TypeScript thoroughly first", "Use CryptoZombies for free Solidity practice", "Always audit your contracts with Slither/Mythril", "Start with testnet deployments before mainnet", "Join a DAO to learn governance firsthand"] },
  { id: "r5", title: "UI/UX Designer", description: "Learn design thinking, wireframing, prototyping in Figma, user research methods, and design systems. Build a portfolio that gets you hired.", level: "Beginner", path: "Design", time: "3-6 Months", modules: 10, tags: ["Figma", "Design Systems", "User Research"], image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop", special_features: ["Figma mastery from zero to advanced", "Design System creation (tokens, components)", "User research & usability testing", "Portfolio case study building"], noticable_facts: ["Redesign existing apps as practice (Daily UI challenge)", "Learn basic HTML/CSS to communicate with developers", "Read 'Don't Make Me Think' by Steve Krug", "Study Apple & Google design guidelines", "Always test with real users, not just peers"] },
  { id: "r6", title: "Data Scientist", description: "Master statistics, Python, SQL, data visualization, and machine learning to extract insights from data. Covers A/B testing, feature engineering, and storytelling.", level: "Intermediate", path: "AI & Data", time: "3-6 Months", modules: 14, tags: ["Python", "Pandas", "Statistics"], image: "https://images.unsplash.com/photo-1551288049-bbbda536ad0a?q=80&w=1200&auto=format&fit=crop", special_features: ["Statistical analysis & hypothesis testing", "Data wrangling with Pandas & SQL", "Visualization with Matplotlib & Seaborn", "Feature engineering & model selection"], noticable_facts: ["SQL is non-negotiable — learn it deeply", "Statistics > fancy algorithms for most real problems", "Build a data portfolio on GitHub with Jupyter notebooks", "Practice on real datasets from Kaggle or UCI ML Repo", "Learn to tell a story with data, not just show charts"] },
  { id: "r7", title: "DevOps Engineer", description: "Learn CI/CD pipelines, Docker, Kubernetes, cloud services (AWS/GCP), monitoring, and infrastructure as code. Automate everything.", level: "Advanced", path: "DevOps", time: "> 6 Months", modules: 16, tags: ["Docker", "Kubernetes", "AWS"], image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=1200&auto=format&fit=crop", special_features: ["Docker & container orchestration", "Kubernetes cluster management", "CI/CD with GitHub Actions & Jenkins", "Infrastructure as Code with Terraform"], noticable_facts: ["Learn Linux command line first — it's foundational", "Start with Docker before jumping to Kubernetes", "Get AWS/GCP free tier and practice daily", "Automate a personal project's deployment pipeline", "The 'DevOps Handbook' is essential reading"] },
  { id: "r8", title: "Mobile App Developer", description: "Build cross-platform mobile apps with React Native or Flutter. Learn navigation, state management, native APIs, and app store deployment.", level: "Intermediate", path: "Mobile", time: "3-6 Months", modules: 13, tags: ["React Native", "Flutter", "Mobile"], image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop", special_features: ["React Native OR Flutter (choose your path)", "State management (Redux/Riverpod)", "Native device APIs (camera, GPS, sensors)", "App Store & Google Play deployment"], noticable_facts: ["Pick ONE framework and master it before switching", "Build a real app and publish it — best resume boost", "Learn platform-specific guidelines (iOS HIG, Material)", "Expo simplifies React Native development enormously", "Test on real devices, not just emulators"] },
  { id: "r9", title: "Cybersecurity Analyst", description: "Learn network security, ethical hacking, penetration testing, cryptography, and incident response. Prepare for CompTIA Security+ and CEH certifications.", level: "Intermediate", path: "Security", time: "3-6 Months", modules: 14, tags: ["Networking", "Pentesting", "Cryptography"], image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop", special_features: ["Network security fundamentals", "Ethical hacking with Kali Linux", "Web application security (OWASP Top 10)", "Incident response & forensics basics"], noticable_facts: ["Start with TryHackMe or HackTheBox for hands-on practice", "Get CompTIA Security+ as your first certification", "Learn networking (TCP/IP, DNS) before security", "Practice on intentionally vulnerable apps (DVWA, WebGoat)", "Bug bounty programs let you earn while learning"] },
  { id: "r10", title: "Product Manager", description: "Learn product strategy, user research, roadmap creation, agile methodology, data-driven decision making, and stakeholder communication.", level: "Beginner", path: "Product", time: "< 3 Months", modules: 8, tags: ["Strategy", "Agile", "Analytics"], image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop", special_features: ["Product strategy & vision setting", "User story mapping & prioritization", "Agile/Scrum methodology", "Data-driven product decisions with analytics"], noticable_facts: ["Read 'Inspired' by Marty Cagan — the PM bible", "Learn basic SQL to query your own product data", "Practice writing PRDs (Product Requirement Documents)", "Shadow a PM at a startup for real-world experience", "Communication skills matter more than technical skills"] },
];

export default function RoadmapsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("modules_desc");
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['path', 'level']);
  const [showFilters, setShowFilters] = useState(false);
  const { saveItem, removeItem, isSaved } = useSaved();

  const toggleAccordion = (id: string) => setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const uniquePaths = useMemo(() => Array.from(new Set(roadmapsData.map(r => r.path))).sort(), []);

  const handleSave = (rm: Roadmap) => {
    if (isSaved(rm.id)) { removeItem(rm.id); }
    else { saveItem({ id: rm.id, title: rm.title, type: 'Roadmap', source: `${rm.path} • ${rm.level}`, image: rm.image }); }
  };

  const filteredData = useMemo(() => {
    let result = roadmapsData;
    if (search) { const s = search.toLowerCase(); result = result.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.tags.some(tag => tag.toLowerCase().includes(s))); }
    if (paths.length > 0) { result = result.filter(p => paths.includes(p.path)); }
    if (levels.length > 0) { result = result.filter(p => levels.includes(p.level)); }
    result = [...result].sort((a, b) => { if (sort === "modules_desc") return b.modules - a.modules; if (sort === "modules_asc") return a.modules - b.modules; if (sort === "name_asc") return a.title.localeCompare(b.title); return 0; });
    return result;
  }, [search, sort, paths, levels]);

  return (
    <>
      <PublicHeader />
      {selectedRoadmap && (
        <InfoModal isOpen={!!selectedRoadmap} onClose={() => setSelectedRoadmap(null)} title={selectedRoadmap.title} subtitle={`${selectedRoadmap.path} Career Path`} icon="🗺️"
          image={selectedRoadmap.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200&auto=format&fit=crop"}
          description={selectedRoadmap.description} specialFeatures={selectedRoadmap.special_features}
          stats={[{ label: "Difficulty", value: selectedRoadmap.level }, { label: "Duration", value: selectedRoadmap.time }, { label: "Modules", value: `${selectedRoadmap.modules}` }]}
          tips={selectedRoadmap.noticable_facts || ["Dedicate at least 10 hours a week."]} ctaLink="#" ctaLabel="Start Learning" />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>Career Roadmaps</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              {roadmapsData.length} expert-curated learning paths with actionable advice, real resources, and milestone-based progress tracking.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#06b6d4", marginLeft: "0.5rem" }} />
              <input type="text" placeholder="Search for roles or skills..." className={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#06b6d4" }}>Search</button>
            </motion.div>
          </div>
        </section>

        <section style={{ background: "rgba(15, 23, 42, 0.4)", position: "relative" }}>
          <div className={`container ${styles.layout}`}>
            <aside className={styles.filterSidebar}>
              <div className={styles.filterHeader} onClick={() => setShowFilters(!showFilters)}>
                <h3 className={styles.filterHeaderTitle}>
                  <Filter size={18} /> Filters
                  <span style={{ fontSize: "0.8rem", background: "#06b6d4", color: "white", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700, marginLeft: "0.5rem" }}>
                    {filteredData.length}
                  </span>
                </h3>
                <ChevronDown size={20} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: '0.3s', color: 'var(--text-muted)' }} />
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
              <div className={styles.filterBody}>
                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('path')}>
                    <span>Career Path</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('path') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('path') && (
                    <div className={styles.accordionContent}>
                      {uniquePaths.map(p => (
                        <label key={p} className={styles.filterCheckbox}>
                          <input type="checkbox" checked={paths.includes(p)} onChange={() => setPaths(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])} />
                          <span>{p}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('level')}>
                    <span>Difficulty</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('level') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('level') && (
                    <div className={styles.accordionContent}>
                      {["Beginner", "Intermediate", "Advanced"].map(l => (
                        <label key={l} className={styles.filterCheckbox}>
                          <input type="checkbox" checked={levels.includes(l)} onChange={() => setLevels(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])} />
                          <span>{l}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ padding: "1.25rem", background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", borderRadius: "12px", marginTop: "1.5rem", fontSize: "0.85rem", color: "#67e8f9", display: "flex", gap: "0.75rem" }}>
                  <GraduationCap size={16} style={{ flexShrink: 0 }} />
                  <span>Get a personalized roadmap by answering 5 questions!</span>
                </div>
              </div>
              <div className={styles.filterFooter} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button className={styles.clearBtn} onClick={() => { setPaths([]); setLevels([]); setSearch(""); }}>Clear All</button>
                <button className={styles.applyBtn} style={{ background: "#06b6d4" }} onClick={() => setShowFilters(false)}>Apply</button>
              </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>

            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>Showing <strong>{filteredData.length}</strong> Roadmaps</span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Sort by:</span>
                  <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="modules_desc">📊 Comprehensive</option>
                    <option value="modules_asc">⚡ Shortest</option>
                    <option value="name_asc">📝 Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Search size={48} style={{ color: "#4b5563", marginBottom: "1.5rem" }} /><h3>No roadmaps found</h3>
                  <p style={{ color: "#94a3b8" }}>Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filteredData.map((rm, index) => (
                      <motion.div key={rm.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: Math.min(index * 0.05, 0.3) }} className={styles.card} style={{ position: "relative" }}>
                        <button onClick={() => handleSave(rm)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, color: isSaved(rm.id) ? "#06b6d4" : "#94a3b8", transition: "all 0.2s" }}>
                          <Bookmark size={18} fill={isSaved(rm.id) ? "#06b6d4" : "none"} />
                        </button>
                        <div className={styles.cardHeader}>
                          <div className={styles.logoWrapper}><Map size={32} color="#06b6d4" /></div>
                          <div style={{ paddingRight: "2rem" }}>
                            <h3 className={styles.title}>{rm.title}</h3>
                            <div className={styles.university}>{rm.path} Development</div>
                            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle2 size={14} color="#10b981" /> {rm.modules} Core Modules
                            </div>
                          </div>
                        </div>
                        <p className={styles.descriptionText}>{rm.description}</p>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Difficulty</span><span className={styles.detailValue}>{rm.level}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Est. Time</span><span className={styles.detailValue}>{rm.time}</span></div>
                          <div className={styles.detailItem} style={{ gridColumn: "span 2" }}><span className={styles.detailLabel}>Certification</span><span className={styles.detailValue} style={{ color: "#06b6d4" }}>Included</span></div>
                        </div>
                        <div className={styles.tags}>{rm.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}</div>
                        <div className={styles.cardActions} style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                          <button onClick={() => setSelectedRoadmap(rm)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "0.75rem", borderRadius: "12px", flex: 1, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}><Map size={18} /> Details</button>
                          <Link href="/dashboard" className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "12px", flex: 1, textDecoration: "none", background: "#06b6d4", color: "white", border: "none" }}>
                            Start <ArrowRight size={18} />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
