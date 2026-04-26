"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, MapPin, Rocket, Clock, Code, BookOpen, Sparkles, ArrowRight, Users, Check } from "lucide-react";

type Project = {
  id: string;
  title: string;
  creator: string;
  difficulty: string; // Beginner, Intermediate, Advanced
  category: string; // AI, Web, Mobile, Data, Hardware
  status: string; // Open to Join, In Progress
  duration: string;
  tags: string[];
  description?: string;
  special_features?: string[];
  noticable_facts?: string[];
  image?: string;
};

const projectsData: Project[] = [
  { 
    id: "pj1", 
    title: "AI Medical Image Analyzer", 
    creator: "Stanford AI Lab Team", 
    difficulty: "Advanced", 
    category: "AI & Machine Learning", 
    status: "Open to Join", 
    duration: "6 Months", 
    tags: ["Python", "TensorFlow", "Computer Vision"],
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1200&auto=format&fit=crop",
    description: "Developing deep learning models to detect early signs of diseases in X-ray and MRI scans. This project aims to assist radiologists with high-accuracy automated screening.",
    special_features: ["Large-scale medical dataset access", "GPU-accelerated training", "Mentorship from PhD researchers", "Potential for publication"],
    noticable_facts: ["Partnership with Stanford Hospital", "Over 95% accuracy on test set", "Open-source codebase for community use"]
  },
  { 
    id: "pj2", 
    title: "Decentralized Voting System", 
    creator: "CryptoSec Group", 
    difficulty: "Intermediate", 
    category: "Web Development", 
    status: "Open to Join", 
    duration: "3 Months", 
    tags: ["Solidity", "React", "Web3"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
    description: "Building a tamper-proof voting platform on the Ethereum blockchain. Focuses on identity verification and anonymized ballots to ensure fair elections.",
    special_features: ["Smart Contract Security Audits", "Gas Optimization Techniques", "Zero-Knowledge Proofs", "Responsive Admin Dashboard"],
    noticable_facts: ["Deployed on Goerli Testnet", "Used by 5 campus organizations", "Fully decentralized architecture"]
  },
  { 
    id: "pj4", 
    title: "IoT Weather Station Network", 
    creator: "Open Hardware Initiative", 
    difficulty: "Intermediate", 
    category: "Hardware & IoT", 
    status: "Open to Join", 
    duration: "2 Months", 
    tags: ["Arduino", "Sensors", "C++"],
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=1200&auto=format&fit=crop",
    description: "Creating a network of low-cost weather stations using ESP32. Data is synced to a central server for real-time climate monitoring and hyper-local forecasts.",
    special_features: ["Solar-powered hardware design", "MQTT data transmission", "Dynamic web dashboard", "Real-time alert system"],
    noticable_facts: ["Scalable to hundreds of nodes", "Under $50 build cost per unit", "Real-time data visualization API"]
  },
  { 
    id: "pj7", 
    title: "Open Source E-Commerce", 
    creator: "Web Wizards", 
    difficulty: "Advanced", 
    category: "Web Development", 
    status: "Open to Join", 
    duration: "6 Months", 
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1200&auto=format&fit=crop",
    description: "A full-stack, modular e-commerce engine with built-in analytics, inventory management, and multi-vendor support. Designed for performance and scalability.",
    special_features: ["Serverless Architecture", "Redis Caching Strategy", "Stripe Payment Integration", "Multi-language Support"],
    noticable_facts: ["Over 2k stars on GitHub", "Modular plugin system", "Lighthouse score of 100"]
  }
];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['category', 'difficulty', 'status']);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredData = useMemo(() => {
    let result = projectsData;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.creator.toLowerCase().includes(s) ||
        p.tags.some(tag => tag.toLowerCase().includes(s))
      );
    }

    if (categories.length > 0) {
      result = result.filter(p => categories.includes(p.category));
    }

    if (difficulties.length > 0) {
      result = result.filter(p => difficulties.includes(p.difficulty));
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      if (sort === "name_desc") return b.title.localeCompare(a.title);
      return 0; // Recent is default
    });

    return result;
  }, [search, sort, categories, difficulties]);

  return (
    <>
      <PublicHeader />
      {selectedProject && (
        <InfoModal 
          isOpen={!!selectedProject} 
          onClose={() => setSelectedProject(null)} 
          title={selectedProject.title} 
          subtitle={`By ${selectedProject.creator}`} 
          icon="🚀"
          image={selectedProject.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"}
          description={selectedProject.description}
          specialFeatures={selectedProject.special_features}
          stats={[
            { label: "Difficulty", value: selectedProject.difficulty },
            { label: "Duration", value: selectedProject.duration },
            { label: "Status", value: selectedProject.status }
          ]}
          tips={selectedProject.noticable_facts || [
            "Familiarize yourself with the tech stack first.",
            "Join the project's Discord/Slack channel.",
            "Start with 'good first issues'."
          ]}
          ctaLink="#"
          ctaLabel="Join Project"
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
              Collaborative Projects
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Join open-source projects, collaborate with peers globally, and build your technical portfolio.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#a855f7", marginLeft: "0.5rem" }} />
              <input 
                type="text" 
                placeholder="Search for projects, technologies, or topics..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#a855f7" }}>Search</button>
            </motion.div>
          </div>
        </section>

        {/* Directory Layout */}
        <section style={{ background: "rgba(15, 23, 42, 0.4)", position: "relative" }}>
          <div className={`container ${styles.layout}`}>
            
            {/* Filter Sidebar */}
            <aside className={styles.filterSidebar}>
              <div className={styles.filterHeader}>
                <h3 className={styles.filterHeaderTitle}>Filter Results</h3>
                <span style={{ fontSize: "0.8rem", background: "#a855f7", color: "white", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700 }}>
                  {filteredData.length}
                </span>
              </div>

              <div className={styles.filterBody}>
                <div className={styles.filterGroup}>
                  <h4 className={styles.filterTitle}>Category</h4>
                  <select className={styles.filterSelect}>
                    <option value="">Any Category</option>
                    <option value="AI">AI & Machine Learning</option>
                    <option value="Web">Web Development</option>
                  </select>
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.2)", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#d8b4fe", display: "flex", gap: "0.75rem" }}>
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span>Get matched with projects based on your skills!</span>
                </div>

                {[
                  { id: 'difficulty', label: 'Difficulty' },
                  { id: 'status', label: 'Status' },
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
                  onClick={() => { setCategories([]); setDifficulties([]); setSearch(""); }}
                >
                  Clear All
                </button>
                <button className={styles.applyBtn} style={{ background: "#a855f7" }}>
                  Apply
                </button>
              </div>
            </aside>

            {/* Main Content Grid */}
            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>
                  Showing <strong>{filteredData.length}</strong> Projects
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Sort by:</span>
                  <select 
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
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
                      <motion.div
                        key={proj.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: Math.min(index * 0.05, 0.3) }}
                        className={styles.card}
                      >
                        <div className={styles.cardHeader}>
                          <div className={styles.logoWrapper}>
                            <Rocket size={32} color="#a855f7" />
                          </div>
                          <div>
                            <h3 className={styles.title}>{proj.title}</h3>
                            <div className={styles.university}>By: {proj.creator}</div>
                            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <span style={{ 
                                display: "inline-block", 
                                width: "8px", 
                                height: "8px", 
                                borderRadius: "50%", 
                                background: proj.status === 'Open to Join' ? '#10b981' : '#f59e0b' 
                              }}></span>
                              {proj.status}
                            </div>
                          </div>
                        </div>

                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Difficulty</span>
                            <span className={styles.detailValue}>{proj.difficulty}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Category</span>
                            <span className={styles.detailValue}>{proj.category}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Est. Duration</span>
                            <span className={styles.detailValue}>{proj.duration}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Stack</span>
                            <span className={styles.detailValue}>{proj.tags.length} Techs</span>
                          </div>
                        </div>

                        <div className={styles.tags}>
                          {proj.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>

                        <div className={styles.cardActions}>
                          <button onClick={() => setSelectedProject(proj)} className={styles.detailsBtn}>
                            View Details
                          </button>
                          <button className={styles.usersBtn}>
                            <Users size={18} />
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

