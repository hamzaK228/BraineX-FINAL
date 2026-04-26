"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, MapPin, GraduationCap, Clock, DollarSign, BookOpen, Sparkles, ArrowRight, Heart } from "lucide-react";

type Program = {
  id: string;
  title: string;
  university: string;
  location: string;
  logo: string;
  image?: string;
  degreeLevel: string; // Bachelor, Master, PhD
  studyMode: string; // On-Campus, Online, Hybrid
  duration: string;
  tuition: number;
  tags: string[];
  description?: string;
  special_features?: string[];
  noticable_facts?: string[];
};

const programsData: Program[] = [
  { 
    id: "p1", 
    title: "B.Sc. in Computer Science", 
    university: "Massachusetts Institute of Technology (MIT)", 
    location: "USA", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png", 
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    degreeLevel: "Bachelor's", 
    studyMode: "On-Campus", 
    duration: "4 Years", 
    tuition: 57590, 
    tags: ["AI", "Software Engineering", "Algorithms"],
    description: "The Computer Science program at MIT is renowned for its blend of theoretical foundations and practical application. Students engage in groundbreaking research from day one.",
    special_features: ["UROP Research Opportunities", "State-of-the-art Robotics Lab", "Silicon Valley Internships", "Global Innovation Contests"],
    noticable_facts: ["98% Graduate Employment Rate", "Highest starting salaries in tech", "Access to MIT Media Lab"]
  },
  { 
    id: "p2", 
    title: "MBA in Global Business", 
    university: "Harvard University", 
    location: "USA", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_University_shield.png/1024px-Harvard_University_shield.png", 
    image: "https://images.unsplash.com/photo-1454165833767-027ffea9e772?q=80&w=1200&auto=format&fit=crop",
    degreeLevel: "Master's", 
    studyMode: "On-Campus", 
    duration: "2 Years", 
    tuition: 73440, 
    tags: ["Management", "Finance", "Leadership"],
    description: "Harvard Business School offers a world-class MBA program that uses the case method to develop leadership skills and strategic thinking in a global context.",
    special_features: ["Case Method Learning", "Global Immersion Program", "Alumni Mentorship Network", "Venture Competition"],
    noticable_facts: ["Produced most Fortune 500 CEOs", "Extensive 100k+ Alumni Network", "Located in historic Boston"]
  },
  { 
    id: "p3", 
    title: "M.Sc. in Data Science", 
    university: "Imperial College London", 
    location: "UK", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Imperial_College_London_new_logo.svg/1024px-Imperial_College_London_new_logo.svg.png", 
    image: "https://images.unsplash.com/photo-1551288049-bbbda536ad0a?q=80&w=1200&auto=format&fit=crop",
    degreeLevel: "Master's", 
    studyMode: "Hybrid", 
    duration: "1 Year", 
    tuition: 38000, 
    tags: ["Machine Learning", "Big Data", "Statistics"],
    description: "This intensive program covers the full spectrum of data science, from large-scale data processing to advanced statistical modeling and machine learning.",
    special_features: ["Data Science Institute Access", "Industry Capstone Projects", "London Tech Hub Connection", "AI Ethics Focus"],
    noticable_facts: ["Top 3 globally for Data Science", "Partnerships with Google & DeepMind", "Intensive 12-month format"]
  },
  { 
    id: "p4", 
    title: "Ph.D. in Quantum Physics", 
    university: "University of Oxford", 
    location: "UK", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/1024px-Oxford-University-Circlet.svg.png", 
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
    degreeLevel: "Ph.D.", 
    studyMode: "On-Campus", 
    duration: "3-4 Years", 
    tuition: 35000, 
    tags: ["Quantum Mechanics", "Research", "Physics"],
    description: "Oxford's Physics department is one of the largest in the world, offering unparalleled research facilities and supervision in quantum computing and technologies.",
    special_features: ["Quantum Research Center", "Beecroft Building Labs", "International Conferences", "Clarendon Scholarship Link"],
    noticable_facts: ["Nobel Prize-winning faculty", "Oldest physics lab in UK", "Leading edge of Quantum Tech"]
  }
];

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("tuition_asc");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [degreeLevels, setDegreeLevels] = useState<string[]>([]);
  const [studyModes, setStudyModes] = useState<string[]>([]);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['degree_level', 'study_mode', 'tuition_fee']);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleLevelToggle = (level: string) => {
    setDegreeLevels(prev => prev.includes(level) ? prev.filter(x => x !== level) : [...prev, level]);
  };

  const handleModeToggle = (mode: string) => {
    setStudyModes(prev => prev.includes(mode) ? prev.filter(x => x !== mode) : [...prev, mode]);
  };

  const filteredData = useMemo(() => {
    let result = programsData;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.university.toLowerCase().includes(s) ||
        p.tags.some(tag => tag.toLowerCase().includes(s))
      );
    }

    if (degreeLevels.length > 0) {
      result = result.filter(p => degreeLevels.includes(p.degreeLevel));
    }

    if (studyModes.length > 0) {
      result = result.filter(p => studyModes.includes(p.studyMode));
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sort === "tuition_asc") return a.tuition - b.tuition;
      if (sort === "tuition_desc") return b.tuition - a.tuition;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [search, sort, degreeLevels, studyModes]);

  return (
    <>
      <PublicHeader />
      {selectedProgram && (
        <InfoModal 
          isOpen={!!selectedProgram} 
          onClose={() => setSelectedProgram(null)} 
          title={selectedProgram.title} 
          subtitle={selectedProgram.university} 
          icon="🎓"
          image={selectedProgram.image || "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200&auto=format&fit=crop"}
          description={selectedProgram.description}
          specialFeatures={selectedProgram.special_features}
          stats={[
            { label: "Duration", value: selectedProgram.duration },
            { label: "Tuition", value: `$${selectedProgram.tuition.toLocaleString()}/yr` },
            { label: "Mode", value: selectedProgram.studyMode }
          ]}
          tips={selectedProgram.noticable_facts || [
            "Review prerequisites carefully.",
            "Prepare a strong Statement of Purpose.",
            "Apply for scholarships early."
          ]}
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
              Academic Programs
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Browse thousands of bachelor's, master's, and doctoral programs from the world's top institutions.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#6366f1", marginLeft: "0.5rem" }} />
              <input 
                type="text" 
                placeholder="Search for programs, universities, or topics..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px" }}>Search</button>
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
                <span style={{ fontSize: "0.8rem", background: "#6366f1", color: "white", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700 }}>
                  {filteredData.length}
                </span>
              </div>

              <div className={styles.filterBody}>
                <div className={styles.filterGroup}>
                  <h4 className={styles.filterTitle}>Location</h4>
                  <select className={styles.filterSelect}>
                    <option value="">Any Location</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Europe">Europe</option>
                  </select>
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#a5b4fc", display: "flex", gap: "0.75rem" }}>
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span>Unlock advanced filters by registering for free!</span>
                </div>

                {[
                  { id: 'degree_level', label: 'Degree Level' },
                  { id: 'study_mode', label: 'Study Mode' },
                  { id: 'tuition_fee', label: 'Tuition Fee' },
                ].map((acc) => (
                  <div key={acc.id} className={styles.accordionItem}>
                    <div 
                      className={styles.accordionHeader}
                      onClick={() => toggleAccordion(acc.id)}
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
                  onClick={() => { setDegreeLevels([]); setStudyModes([]); setSearch(""); }}
                >
                  Clear All
                </button>
                <button className={styles.applyBtn}>
                  Apply
                </button>
              </div>
            </aside>

            {/* Main Content Grid */}
            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>
                  Showing <strong>{filteredData.length}</strong> Programs
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Sort by:</span>
                  <select 
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="tuition_asc">💰 Tuition (Low to High)</option>
                    <option value="tuition_desc">💰 Tuition (High to Low)</option>
                    <option value="name_asc">📝 Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Search size={48} style={{ color: "#4b5563", marginBottom: "1.5rem" }} />
                  <h3>No programs found</h3>
                  <p style={{ color: "#94a3b8" }}>Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filteredData.map((prog, index) => (
                      <motion.div
                        key={prog.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: Math.min(index * 0.05, 0.3) }}
                        className={styles.card}
                      >
                        <div className={styles.cardHeader}>
                          <img src={prog.logo} alt={prog.university} className={styles.logo} />
                          <div>
                            <h3 className={styles.title}>{prog.title}</h3>
                            <div className={styles.university}>{prog.university}</div>
                            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <MapPin size={14} /> {prog.location}
                            </div>
                          </div>
                        </div>

                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Degree Level</span>
                            <span className={styles.detailValue}>{prog.degreeLevel}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Study Mode</span>
                            <span className={styles.detailValue}>{prog.studyMode}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Duration</span>
                            <span className={styles.detailValue}>{prog.duration}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Tuition / Year</span>
                            <span className={styles.detailValue}>${prog.tuition.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className={styles.tags}>
                          {prog.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>

                        <div className={styles.cardActions}>
                          <button onClick={() => setSelectedProgram(prog)} className={styles.detailsBtn}>
                            <GraduationCap size={18} /> View Details
                          </button>
                          <button className={styles.heartBtn}>
                            <Heart size={18} />
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

