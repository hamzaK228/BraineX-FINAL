"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, Rocket, BookOpen, Sparkles, Users, Bookmark, Filter, ChevronDown } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

type Project = { id: string; title: string; creator: string; difficulty: string; category: string; status: string; duration: string; tags: string[]; description?: string; special_features?: string[]; noticable_facts?: string[]; image?: string; };

const projectsData: Project[] = [
  { id: "pj1", title: "AI Medical Image Analyzer", creator: "Stanford AI Lab Team", difficulty: "Advanced", category: "AI & Machine Learning", status: "Open to Join", duration: "6 Months", tags: ["Python", "TensorFlow", "Computer Vision"], image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200&auto=format&fit=crop", description: "Developing deep learning models to detect early signs of diseases in X-ray and MRI scans. This project aims to assist radiologists with high-accuracy automated screening.", special_features: ["Large-scale medical dataset access", "GPU-accelerated training", "Mentorship from PhD researchers", "Potential for publication"], noticable_facts: ["Partnership with Stanford Hospital", "Over 95% accuracy on test set", "Open-source codebase"] },
  { id: "pj2", title: "Decentralized Voting System", creator: "CryptoSec Group", difficulty: "Intermediate", category: "Web Development", status: "Open to Join", duration: "3 Months", tags: ["Solidity", "React", "Web3"], image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop", description: "Building a tamper-proof voting platform on the Ethereum blockchain with identity verification and anonymized ballots.", special_features: ["Smart Contract Security Audits", "Gas Optimization", "Zero-Knowledge Proofs", "Responsive Admin Dashboard"], noticable_facts: ["Deployed on Goerli Testnet", "Used by 5 campus organizations", "Fully decentralized"] },
  { id: "pj3", title: "IoT Weather Station Network", creator: "Open Hardware Initiative", difficulty: "Intermediate", category: "Hardware & IoT", status: "Open to Join", duration: "2 Months", tags: ["Arduino", "Sensors", "C++"], image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=1200&auto=format&fit=crop", description: "Creating a network of low-cost weather stations using ESP32. Data is synced to a central server for real-time climate monitoring.", special_features: ["Solar-powered design", "MQTT data transmission", "Dynamic web dashboard", "Real-time alert system"], noticable_facts: ["Scalable to hundreds of nodes", "Under $50 build cost per unit", "Real-time data API"] },
  { id: "pj4", title: "Open Source E-Commerce Engine", creator: "Web Wizards", difficulty: "Advanced", category: "Web Development", status: "Open to Join", duration: "6 Months", tags: ["Next.js", "Node.js", "PostgreSQL"], image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1200&auto=format&fit=crop", description: "A full-stack, modular e-commerce engine with built-in analytics, inventory management, and multi-vendor support.", special_features: ["Serverless Architecture", "Redis Caching", "Stripe Integration", "Multi-language Support"], noticable_facts: ["Over 2k stars on GitHub", "Modular plugin system", "Lighthouse score of 100"] },
  { id: "pj5", title: "Climate Change Data Dashboard", creator: "Green Tech Labs", difficulty: "Beginner", category: "Data Science", status: "Open to Join", duration: "2 Months", tags: ["Python", "Pandas", "Plotly", "Streamlit"], image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=1200&auto=format&fit=crop", description: "An interactive dashboard visualizing global temperature trends, CO2 levels, and sea-level data from NASA and NOAA public datasets.", special_features: ["Real-time NASA API Integration", "Interactive Plotly Charts", "Streamlit Deployment", "Data Storytelling"], noticable_facts: ["Great first project for beginners", "Uses publicly available datasets", "Deployed free on Streamlit Cloud"] },
  { id: "pj6", title: "AI-Powered Resume Builder", creator: "Career Tech Collective", difficulty: "Intermediate", category: "AI & Machine Learning", status: "Open to Join", duration: "3 Months", tags: ["React", "OpenAI API", "Node.js"], image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200&auto=format&fit=crop", description: "A web app that uses GPT-4 to generate, optimize, and tailor professional resumes based on job descriptions and user profiles.", special_features: ["GPT-4 Integration", "PDF Export", "ATS Optimization Score", "Template Library"], noticable_facts: ["80% faster resume creation", "Supports 10+ resume templates", "Free tier available"] },
  { id: "pj7", title: "Mental Health Chatbot", creator: "WellTech Foundation", difficulty: "Advanced", category: "AI & Machine Learning", status: "In Progress", duration: "8 Months", tags: ["Python", "NLP", "Flask", "React"], image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=1200&auto=format&fit=crop", description: "An empathetic AI chatbot trained on CBT techniques to provide mental health support. Works with licensed professionals as a supplementary tool.", special_features: ["Sentiment Analysis", "Crisis Detection & Referral", "Multi-language Support", "HIPAA-compliant Architecture"], noticable_facts: ["Partnered with 3 university counseling centers", "Over 10,000 conversations logged", "Published research on efficacy"] },
  { id: "pj8", title: "Smart Campus Navigation", creator: "UniTech Solutions", difficulty: "Beginner", category: "Mobile Development", status: "Open to Join", duration: "4 Months", tags: ["React Native", "Firebase", "Google Maps API"], image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop", description: "A mobile app that provides indoor navigation, event discovery, and facility booking for university campuses.", special_features: ["Indoor BLE Beacons", "Event Calendar Integration", "Accessibility Routes", "AR Campus Tour"], noticable_facts: ["Piloted at 3 universities", "Beginner-friendly codebase", "Open-source since day 1"] },
  { id: "pj9", title: "Open-Source Study Planner", creator: "EduFlow", difficulty: "Beginner", category: "Web Development", status: "Open to Join", duration: "1 Month", tags: ["Vue.js", "Firebase", "Tailwind CSS"], image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1200&auto=format&fit=crop", description: "A Pomodoro-based study planner with goal tracking, spaced repetition reminders, and group study sessions.", special_features: ["Pomodoro Timer", "Spaced Repetition Algorithm", "Group Study Rooms", "Statistics Dashboard"], noticable_facts: ["Perfect for first-time contributors", "500+ active daily users", "Built in a hackathon"] },
  { id: "pj10", title: "Drone Delivery Simulation", creator: "Autonomous Systems Lab", difficulty: "Advanced", category: "Hardware & IoT", status: "In Progress", duration: "12 Months", tags: ["Python", "ROS", "Gazebo", "C++"], image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop", description: "Building a full simulation environment for autonomous drone delivery systems, including path planning, obstacle avoidance, and fleet management.", special_features: ["ROS2 Integration", "Gazebo Simulation", "Computer Vision Landing", "Fleet Management Dashboard"], noticable_facts: ["Used in 2 master's theses", "Presented at ICRA conference", "Industry-grade simulation fidelity"] },
  { id: "pj11", title: "Peer-to-Peer Learning Platform", creator: "EduDecentralized", difficulty: "Intermediate", category: "Web Development", status: "Open to Join", duration: "5 Months", tags: ["Next.js", "WebRTC", "MongoDB"], image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop", description: "A platform where students can teach and learn from each other through live video sessions, with integrated scheduling and reputation systems.", special_features: ["WebRTC Video Calls", "Rating & Review System", "Skill Matching Algorithm", "Calendar Integration"], noticable_facts: ["1000+ registered tutors", "WebRTC for zero-latency video", "Built-in payment system"] },
  { id: "pj12", title: "Satellite Image Land Classifier", creator: "GeoAI Research", difficulty: "Advanced", category: "Data Science", status: "Open to Join", duration: "4 Months", tags: ["Python", "PyTorch", "GIS", "Remote Sensing"], image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop", description: "Using deep learning on satellite imagery from Sentinel-2 to classify land use types for environmental monitoring and urban planning.", special_features: ["Sentinel-2 Dataset", "U-Net Architecture", "GIS Visualization", "Automated Pipeline"], noticable_facts: ["94% classification accuracy", "Used by 2 NGOs for deforestation tracking", "Free access to satellite data"] },
];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['category', 'difficulty']);
  const [showFilters, setShowFilters] = useState(false);
  const { saveItem, removeItem, isSaved } = useSaved();

  const toggleAccordion = (id: string) => setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleSave = (proj: Project) => {
    if (isSaved(proj.id)) { removeItem(proj.id); }
    else { saveItem({ id: proj.id, title: proj.title, type: 'Project', source: proj.creator, image: proj.image }); }
  };

  const uniqueCategories = useMemo(() => Array.from(new Set(projectsData.map(p => p.category))).sort(), []);

  const filteredData = useMemo(() => {
    let result = projectsData;
    if (search) { const s = search.toLowerCase(); result = result.filter(p => p.title.toLowerCase().includes(s) || p.creator.toLowerCase().includes(s) || p.tags.some(tag => tag.toLowerCase().includes(s))); }
    if (categories.length > 0) { result = result.filter(p => categories.includes(p.category)); }
    if (difficulties.length > 0) { result = result.filter(p => difficulties.includes(p.difficulty)); }
    result = [...result].sort((a, b) => { if (sort === "name_asc") return a.title.localeCompare(b.title); return 0; });
    return result;
  }, [search, sort, categories, difficulties]);

  return (
    <>
      <PublicHeader />
      {selectedProject && (
        <InfoModal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject.title} subtitle={`By ${selectedProject.creator}`} icon="🚀"
          image={selectedProject.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"}
          description={selectedProject.description} specialFeatures={selectedProject.special_features}
          stats={[{ label: "Difficulty", value: selectedProject.difficulty }, { label: "Duration", value: selectedProject.duration }, { label: "Status", value: selectedProject.status }]}
          tips={selectedProject.noticable_facts || ["Familiarize yourself with the tech stack first."]} ctaLink="#" ctaLabel="Join Project" />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>Collaborative Projects</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Join {projectsData.length} open-source projects, collaborate with peers globally, and build your technical portfolio.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#a855f7", marginLeft: "0.5rem" }} />
              <input type="text" placeholder="Search for projects, technologies, or topics..." className={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#a855f7" }}>Search</button>
            </motion.div>
          </div>
        </section>

        <section style={{ background: "rgba(15, 23, 42, 0.4)", position: "relative" }}>
          <div className={`container ${styles.layout}`}>
            <aside className={styles.filterSidebar}>
              <div className={styles.filterHeader} onClick={() => setShowFilters(!showFilters)}>
                <h3 className={styles.filterHeaderTitle}>
                  <Filter size={18} /> Filters
                  <span style={{ fontSize: "0.8rem", background: "#a855f7", color: "white", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700, marginLeft: "0.5rem" }}>
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
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('category')}>
                    <span>Category</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('category') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('category') && (
                    <div className={styles.accordionContent}>
                      {uniqueCategories.map(c => (
                        <label key={c} className={styles.filterCheckbox}>
                          <input type="checkbox" checked={categories.includes(c)} onChange={() => setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('difficulty')}>
                    <span>Difficulty</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('difficulty') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('difficulty') && (
                    <div className={styles.accordionContent}>
                      {["Beginner", "Intermediate", "Advanced"].map(d => (
                        <label key={d} className={styles.filterCheckbox}>
                          <input type="checkbox" checked={difficulties.includes(d)} onChange={() => setDifficulties(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])} />
                          <span>{d}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "12px", marginTop: "1.5rem", fontSize: "0.85rem", color: "#d8b4fe", display: "flex", gap: "0.75rem" }}>
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span>Get matched with projects based on your skills!</span>
                </div>
              </div>
              <div className={styles.filterFooter} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button className={styles.clearBtn} onClick={() => { setCategories([]); setDifficulties([]); setSearch(""); }}>Clear All</button>
                <button className={styles.applyBtn} style={{ background: "#a855f7" }} onClick={() => setShowFilters(false)}>Apply</button>
              </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>

            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>Showing <strong>{filteredData.length}</strong> Projects</span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Sort by:</span>
                  <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="recent">🕒 Most Recent</option>
                    <option value="name_asc">📝 Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Search size={48} style={{ color: "#4b5563", marginBottom: "1.5rem" }} />
                  <h3>No projects found</h3>
                  <p style={{ color: "#94a3b8" }}>Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filteredData.map((proj, index) => (
                      <motion.div key={proj.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: Math.min(index * 0.05, 0.3) }} className={styles.card} style={{ position: "relative" }}>
                        <button onClick={() => handleSave(proj)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, color: isSaved(proj.id) ? "#a855f7" : "#94a3b8", transition: "all 0.2s" }}>
                          <Bookmark size={18} fill={isSaved(proj.id) ? "#a855f7" : "none"} />
                        </button>
                        <div className={styles.cardHeader}>
                          <div className={styles.logoWrapper}><Rocket size={32} color="#a855f7" /></div>
                          <div style={{ paddingRight: "2rem" }}>
                            <h3 className={styles.title}>{proj.title}</h3>
                            <div className={styles.university}>By: {proj.creator}</div>
                            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: proj.status === 'Open to Join' ? '#10b981' : '#f59e0b' }}></span>
                              {proj.status}
                            </div>
                          </div>
                        </div>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Difficulty</span><span className={styles.detailValue}>{proj.difficulty}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Category</span><span className={styles.detailValue}>{proj.category}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Est. Duration</span><span className={styles.detailValue}>{proj.duration}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Stack</span><span className={styles.detailValue}>{proj.tags.length} Techs</span></div>
                        </div>
                        <div className={styles.tags}>{proj.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}</div>
                        <div className={styles.cardActions} style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                          <button onClick={() => setSelectedProject(proj)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "0.75rem", borderRadius: "12px", flex: 1, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}><Rocket size={18} /> Details</button>
                          <Link href="/dashboard" className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "12px", flex: 1, textDecoration: "none", background: "#a855f7", color: "white", border: "none" }}>
                            Join <ArrowRight size={18} />
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
