"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, Map, Clock, BookOpen, Sparkles, ArrowRight, CheckCircle2, Bookmark, GraduationCap } from "lucide-react";

type Roadmap = {
  id: string;
  title: string;
  description: string;
  level: string; // Beginner, Intermediate, Advanced
  path: string; // Frontend, Backend, AI, UI/UX, Data
  time: string; // < 3 Months, 3-6 Months, > 6 Months
  modules: number;
  tags: string[];
  special_features?: string[];
  noticable_facts?: string[];
  image?: string;
};

const roadmapsData: Roadmap[] = [
  { 
    id: "r1", 
    title: "Frontend Developer", 
    description: "Learn HTML, CSS, JavaScript, and React to build modern web interfaces.", 
    level: "Beginner", 
    path: "Frontend", 
    time: "3-6 Months", 
    modules: 12, 
    tags: ["React", "CSS", "JavaScript"],
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop",
    special_features: ["Project-based learning", "React Hooks & State Management", "Responsive Design Mastery", "Portfolio Building"],
    noticable_facts: ["Most in-demand skill in 2025", "Includes 5 capstone projects", "Verified certificate upon completion"]
  },
  { 
    id: "r2", 
    title: "Backend Developer", 
    description: "Master Node.js, databases, APIs, and server architecture.", 
    level: "Intermediate", 
    path: "Backend", 
    time: "3-6 Months", 
    modules: 15, 
    tags: ["Node.js", "SQL", "APIs"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    special_features: ["System Design Fundamentals", "RESTful & GraphQL APIs", "Database Optimization", "Server-side Security"],
    noticable_facts: ["Focus on high-performance architecture", "Covers both SQL and NoSQL", "Includes DevOps basics"]
  },
  { 
    id: "r3", 
    title: "Machine Learning Engineer", 
    description: "Dive deep into Python, math, and neural networks to build AI models.", 
    level: "Advanced", 
    path: "AI & Data", 
    time: "> 6 Months", 
    modules: 20, 
    tags: ["Python", "TensorFlow", "Math"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop",
    special_features: ["Deep Learning with PyTorch", "Natural Language Processing", "Computer Vision Projects", "AI Ethics & Deployment"],
    noticable_facts: ["Requires strong mathematical background", "Hands-on with industry datasets", "Advanced neural network architectures"]
  },
  { 
    id: "r6", 
    title: "Full-Stack Web3 Developer", 
    description: "Build decentralized apps with Solidity, Hardhat, and Next.js.", 
    level: "Advanced", 
    path: "Web3", 
    time: "> 6 Months", 
    modules: 18, 
    tags: ["Solidity", "Blockchain", "Web3.js"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
    special_features: ["Smart Contract Security", "DeFi Protocol Building", "NFT Marketplace Project", "Layer 2 Solutions"],
    noticable_facts: ["Fastest growing tech sector", "High earning potential", "Community-led learning"]
  }
];

export default function RoadmapsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("modules_desc");
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['path', 'level', 'time']);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredData = useMemo(() => {
    let result = roadmapsData;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s) ||
        p.tags.some(tag => tag.toLowerCase().includes(s))
      );
    }

    if (paths.length > 0) {
      result = result.filter(p => paths.includes(p.path));
    }

    if (levels.length > 0) {
      result = result.filter(p => levels.includes(p.level));
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sort === "modules_desc") return b.modules - a.modules;
      if (sort === "modules_asc") return a.modules - b.modules;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [search, sort, paths, levels]);

  return (
    <>
      <PublicHeader />
      {selectedRoadmap && (
        <InfoModal 
          isOpen={!!selectedRoadmap} 
          onClose={() => setSelectedRoadmap(null)} 
          title={selectedRoadmap.title} 
          subtitle={`${selectedRoadmap.path} Career Path`} 
          icon="🗺️"
          image={selectedRoadmap.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1200&auto=format&fit=crop"}
          description={selectedRoadmap.description}
          specialFeatures={selectedRoadmap.special_features}
          stats={[
            { label: "Difficulty", value: selectedRoadmap.level },
            { label: "Duration", value: selectedRoadmap.time },
            { label: "Modules", value: `${selectedRoadmap.modules}` }
          ]}
          tips={selectedRoadmap.noticable_facts || [
            "Dedicate at least 10 hours a week.",
            "Complete all projects to earn the certificate.",
            "Join our community forum for help."
          ]}
          ctaLink="#"
          ctaLabel="Start Learning"
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
              Career Roadmaps
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Follow step-by-step guides and learning paths curated by industry experts to achieve your career goals.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#06b6d4", marginLeft: "0.5rem" }} />
              <input 
                type="text" 
                placeholder="Search for roles or skills..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#06b6d4" }}>Search</button>
            </motion.div>
          </div>
        </section>

        {/* Directory Layout */}
        <section style={{ background: "rgba(15, 23, 42, 0.4)", position: "relative" }}>
          <div className={`container ${styles.layout}`}>
            
            {/* Filter Sidebar */}
            <aside className={styles.filterSidebar}>
              <div className={styles.filterHeader}>
                <h3 className={styles.filterHeaderTitle}>Filter Paths</h3>
                <span style={{ fontSize: "0.8rem", background: "#06b6d4", color: "white", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700 }}>
                  {filteredData.length}
                </span>
              </div>

              <div className={styles.filterBody}>
                <div className={styles.filterGroup}>
                  <h4 className={styles.filterTitle}>Career Path</h4>
                  <select className={styles.filterSelect}>
                    <option value="">Any Path</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                  </select>
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(6, 182, 212, 0.1)", border: "1px solid rgba(6, 182, 212, 0.2)", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#67e8f9", display: "flex", gap: "0.75rem" }}>
                  <GraduationCap size={16} style={{ flexShrink: 0 }} />
                  <span>Get a personalized roadmap by answering 5 questions!</span>
                </div>

                {[
                  { id: 'level', label: 'Difficulty' },
                  { id: 'time', label: 'Duration' },
                ].map((acc) => (
                  <div key={acc.id} className={styles.accordionItem}>
                    <div 
                      className={styles.accordionHeader}
                    >
                      <span>{acc.label}</span>
                      <BookOpen size={16} style={{ color: "#94a3b8" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.filterFooter}>
                <button 
                  className={styles.clearBtn}
                  onClick={() => { setPaths([]); setLevels([]); setSearch(""); }}
                >
                  Clear All
                </button>
                <button className={styles.applyBtn} style={{ background: "#06b6d4" }}>
                  Apply
                </button>
              </div>
            </aside>

            {/* Main Content Grid */}
            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>
                  Showing <strong>{filteredData.length}</strong> Roadmaps
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Sort by:</span>
                  <select 
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="modules_desc">📊 Comprehensive</option>
                    <option value="modules_asc">⚡ Shortest</option>
                  </select>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Search size={48} style={{ color: "#4b5563", marginBottom: "1.5rem" }} />
                  <h3>No roadmaps found</h3>
                  <p style={{ color: "#94a3b8" }}>Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filteredData.map((rm, index) => (
                      <motion.div
                        key={rm.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: Math.min(index * 0.05, 0.3) }}
                        className={styles.card}
                      >
                        <div className={styles.cardHeader}>
                          <div className={styles.logoWrapper}>
                            <Map size={32} color="#06b6d4" />
                          </div>
                          <div>
                            <h3 className={styles.title}>{rm.title}</h3>
                            <div className={styles.university}>{rm.path} Development</div>
                            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle2 size={14} color="#10b981" /> {rm.modules} Core Modules
                            </div>
                          </div>
                        </div>

                        <p className={styles.descriptionText}>
                          {rm.description}
                        </p>

                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Difficulty</span>
                            <span className={styles.detailValue}>{rm.level}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Est. Time</span>
                            <span className={styles.detailValue}>{rm.time}</span>
                          </div>
                          <div className={styles.detailItem} style={{ gridColumn: "span 2" }}>
                            <span className={styles.detailLabel}>Certification</span>
                            <span className={styles.detailValue} style={{ color: "#06b6d4" }}>Included</span>
                          </div>
                        </div>

                        <div className={styles.tags}>
                          {rm.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>

                        <div className={styles.cardActions}>
                          <button onClick={() => setSelectedRoadmap(rm)} className={styles.startBtn}>
                            Start Path <ArrowRight size={18} />
                          </button>
                          <button className={styles.bookmarkBtn}>
                            <Bookmark size={18} />
                          </button>
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

