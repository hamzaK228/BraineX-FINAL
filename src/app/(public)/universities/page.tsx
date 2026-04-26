"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, MapPin, GraduationCap, Users, BookOpen, Sparkles, ArrowRight, Bookmark, Filter, ChevronDown, Check } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

const top20Data = [
  { 
    id: "mit", 
    name: "Massachusetts Institute of Technology (MIT)", 
    city: "Cambridge", 
    country: "USA", 
    ranking: 1, 
    tuition: 57590, 
    acceptance_rate: 4, 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png", 
    image: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?q=80&w=1200&auto=format&fit=crop",
    programs: ["Computer Science", "Engineering", "Physics"], 
    type: "Private", 
    students: 11934,
    description: "MIT is a world-class institution known for its cutting-edge research and innovation in science, engineering, and technology. It fosters an environment of rigorous academic inquiry and hands-on learning.",
    special_features: ["Media Lab Innovation", "MIT.nano Research Facility", "Strong Entrepreneurial Ecosystem", "Infinite Corridor Hub"],
    noticable_facts: ["85% of undergrads participate in research", "Over 90 Nobel Laureates associated", "Founding member of edX"]
  },
  { 
    id: "imperial", 
    name: "Imperial College London", 
    city: "London", 
    country: "UK", 
    ranking: 2, 
    tuition: 34000, 
    acceptance_rate: 14, 
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Imperial_College_London_new_logo.svg/1024px-Imperial_College_London_new_logo.svg.png", 
    image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1200&auto=format&fit=crop",
    programs: ["Medicine", "Engineering", "Business"], 
    type: "Public", 
    students: 20000,
    description: "Imperial College London is a global top-ten university with a world-class reputation in science, engineering, business, and medicine. Located in the heart of London, it offers unique networking opportunities.",
    special_features: ["Data Science Institute", "White City Innovation Campus", "Global Health Centre", "Imperial Enterprise Lab"],
    noticable_facts: ["Focused solely on STEM and Business", "Gold rating in Teaching Excellence", "Highest graduate starting salaries in UK"]
  }
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// Types
type University = {
  id: string;
  name: string;
  city: string;
  country: string;
  ranking: number;
  tuition: number;
  acceptance_rate: number;
  logo: string;
  image?: string;
  programs: string[];
  type: string;
  students: number;
  description?: string;
  special_features?: string[];
  noticable_facts?: string[];
};

export default function UniversitiesPage() {
  const [universitiesData, setUniversitiesData] = useState<University[]>(top20Data);
  const [loading, setLoading] = useState(true);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const { saveItem, removeItem, isSaved } = useSaved();

  // Filters state
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ranking");
  const [countries, setCountries] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [tuitionRange, setTuitionRange] = useState<[number, number]>([0, 100000]);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['fees', 'type']);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json')
      .then(res => res.json())
      .then(data => {
        let extraUnis: University[] = [];
        let currentRank = 21;
        const topNames = top20Data.map(u => u.name.toLowerCase());
        const programPool = [
          ["Engineering", "Business", "Medicine"],
          ["Law", "Arts", "Humanities"],
          ["Computer Science", "Data Science", "AI"],
          ["Architecture", "Design", "Fine Arts"],
          ["Biology", "Chemistry", "Physics"]
        ];

        for (let u of data) {
          if (extraUnis.length >= 280) break;
          if (topNames.some(tn => u.name.toLowerCase().includes(tn))) continue;

          extraUnis.push({
            id: "uni_" + currentRank,
            name: u.name,
            city: u["state-province"] || "Main Campus",
            country: u.country,
            ranking: currentRank,
            tuition: Math.floor(Math.random() * 40000) + 5000,
            acceptance_rate: Math.floor(Math.random() * 60) + 10,
            logo: "https://cdn-icons-png.flaticon.com/512/8066/8066542.png",
            programs: programPool[Math.floor(Math.random() * programPool.length)],
            type: Math.random() > 0.5 ? "Public" : "Private",
            students: Math.floor(Math.random() * 50000) + 5000,
            description: `${u.name} is a leading institution in ${u.country}, offering diverse academic programs and fostering global research excellence.`,
            special_features: ["International Partnerships", "Modern Research Labs", "Dynamic Campus Life"],
            noticable_facts: ["Global Alumni Network", "High Graduate Employability"]
          });
          currentRank++;
        }
        setUniversitiesData([...top20Data, ...extraUnis]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load extra universities", err);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    let result = universitiesData;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(s) || 
        u.city.toLowerCase().includes(s) || 
        u.country.toLowerCase().includes(s)
      );
    }

    if (countries.length > 0) {
      result = result.filter(u => countries.includes(u.country));
    }

    if (types.length > 0) {
      result = result.filter(u => types.includes(u.type));
    }

    result = result.filter(u => u.tuition >= tuitionRange[0] && u.tuition <= tuitionRange[1]);

    result.sort((a, b) => {
      switch (sort) {
        case "ranking": return a.ranking - b.ranking;
        case "name": return a.name.localeCompare(b.name);
        case "acceptance": return a.acceptance_rate - b.acceptance_rate;
        case "tuition-low": return a.tuition - b.tuition;
        case "tuition-high": return b.tuition - a.tuition;
        default: return a.ranking - b.ranking;
      }
    });

    return result;
  }, [search, countries, types, tuitionRange, sort, universitiesData]);

  const uniqueCountries = useMemo(() => {
    return Array.from(new Set(universitiesData.map(u => u.country))).sort();
  }, [universitiesData]);

  const toggleFilter = (list: string[], setList: (v: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(x => x !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleSave = (uni: University) => {
    if (isSaved(uni.id)) {
      removeItem(uni.id);
    } else {
      saveItem({
        id: uni.id,
        title: uni.name,
        type: 'University',
        source: `${uni.city}, ${uni.country}`,
        image: uni.image
      });
    }
  };

  return (
    <>
      <PublicHeader />
      {selectedUni && (
        <InfoModal 
          isOpen={!!selectedUni} 
          onClose={() => setSelectedUni(null)} 
          title={selectedUni.name} 
          subtitle={`${selectedUni.city}, ${selectedUni.country}`} 
          icon="🏛️"
          image={selectedUni.image || "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop"}
          description={selectedUni.description}
          specialFeatures={selectedUni.special_features}
          stats={[
            { label: "Acceptance", value: `${selectedUni.acceptance_rate}%` },
            { label: "Tuition", value: selectedUni.tuition === 0 ? "Free" : `$${selectedUni.tuition.toLocaleString()}` },
            { label: "Ranking", value: `#${selectedUni.ranking}` }
          ]}
          tips={selectedUni.noticable_facts || [
            "Research specific program requirements before applying.",
            "International students must prepare English proficiency test scores.",
            "Admission is highly competitive."
          ]}
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px" }}>
        
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial="hidden" animate="visible" variants={fadeIn} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
              Top Universities Worldwide
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Explore and compare the world's best {loading ? "..." : universitiesData.length} universities. Find your perfect academic home.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#6366f1", marginLeft: "0.5rem" }} />
              <input 
                type="text" 
                placeholder="Search universities by name, location..." 
                className={styles.searchInput} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#6366f1" }}>Search</button>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={stagger} className={styles.quickStats}>
              <motion.div variants={fadeIn} className={styles.statItem}>
                <span className={styles.statNumber}>{loading ? "..." : universitiesData.length}</span>
                <span className={styles.statLabel}>Top Universities</span>
              </motion.div>
              <motion.div variants={fadeIn} className={styles.statItem}>
                <span className={styles.statNumber}>{loading ? "..." : uniqueCountries.length}</span>
                <span className={styles.statLabel}>Countries</span>
              </motion.div>
              <motion.div variants={fadeIn} className={styles.statItem}>
                <span className={styles.statNumber}>$0-65K</span>
                <span className={styles.statLabel}>Tuition Range</span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Directory Layout */}
        <section style={{ background: "rgba(15, 23, 42, 0.4)", position: "relative" }}>
          <div className={`container ${styles.universitiesLayout}`}>
            
            {/* Filter Sidebar */}
            <aside className={styles.filterSidebar}>
              <div className={styles.filterHeader}>
                <h3 className={styles.filterHeaderTitle}><Filter size={18} /> Filters</h3>
                <span style={{ fontSize: "0.8rem", background: "#6366f1", color: "white", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700 }}>
                  {filteredData.length}
                </span>
              </div>

              <div className={styles.filterBody}>
                <div className={styles.filterGroup}>
                  <h4 className={styles.filterTitle}>Country</h4>
                  <select 
                    className={styles.filterSelect}
                    value={countries[0] || ""}
                    onChange={(e) => setCountries(e.target.value ? [e.target.value] : [])}
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('type')}>
                    <span>Institution Type</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('type') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('type') && (
                    <div className={styles.accordionContent}>
                      {["Public", "Private"].map(t => (
                        <label key={t} className={styles.filterCheckbox}>
                          <input type="checkbox" checked={types.includes(t)} onChange={() => toggleFilter(types, setTypes, t)} />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('fees')}>
                    <span>Tuition Fees</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('fees') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('fees') && (
                    <div className={styles.accordionContent}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Up to ${tuitionRange[1].toLocaleString()}</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100000" 
                          step="5000"
                          value={tuitionRange[1]} 
                          onChange={(e) => setTuitionRange([0, parseInt(e.target.value)])}
                          style={{ width: "100%", accentColor: "#6366f1" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "12px", marginTop: "1.5rem", fontSize: "0.85rem", color: "#a5b4fc", display: "flex", gap: "0.75rem" }}>
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span>Unlock program-specific filters by signing in!</span>
                </div>
              </div>

              <div className={styles.filterFooter}>
                <button 
                  className={styles.clearBtn}
                  onClick={() => { setCountries([]); setTypes([]); setTuitionRange([0, 100000]); setSearch(""); }}
                >
                  Clear All
                </button>
                <button className={styles.applyBtn} style={{ background: "#6366f1" }}>
                  Apply
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className={styles.universitiesContent}>
              <div className={styles.contentControls}>
                <div className={styles.resultsCount}>
                  Showing <strong>{filteredData.length}</strong> universities
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Sort by:</span>
                  <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="ranking">🏆 Ranking</option>
                    <option value="name">📝 Name (A-Z)</option>
                    <option value="acceptance">📊 Acceptance Rate</option>
                    <option value="tuition-low">💰 Tuition (Low to High)</option>
                    <option value="tuition-high">💰 Tuition (High to Low)</option>
                  </select>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: "center", padding: "8rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px" }}>
                  <div style={{ width: "40px", height: "40px", border: "3px solid rgba(99, 102, 241, 0.2)", borderTopColor: "#6366f1", borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 1s linear infinite" }}></div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <p style={{ color: "#94a3b8" }}>Fetching global university database...</p>
                </div>
              )}

              <motion.div layout className={styles.universitiesGrid}>
                <AnimatePresence>
                  {(!loading && filteredData.length > 0) ? filteredData.slice(0, 60).map(uni => (
                    <motion.div 
                      layout 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.9 }} 
                      key={uni.id} 
                      className={styles.uniCard}
                    >
                      <div className={`${styles.rankingBadge} ${uni.ranking <= 10 ? styles.top10 : ''}`}>
                        #{uni.ranking}
                      </div>
                      
                      <button 
                        onClick={() => handleSave(uni)}
                        className={styles.saveBtn}
                        style={{ color: isSaved(uni.id) ? "#6366f1" : "#94a3b8" }}
                      >
                        <Bookmark size={20} fill={isSaved(uni.id) ? "#6366f1" : "none"} />
                      </button>

                      <div className={styles.cardHeader}>
                        <div className={styles.logoWrapper}>
                          <img src={uni.logo} alt={uni.name} className={styles.uniLogo} />
                        </div>
                        <div>
                          <h3 className={styles.uniName}>{uni.name}</h3>
                          <p className={styles.uniLocation}><MapPin size={14} style={{ display: "inline", marginRight: "4px" }} /> {uni.city}, {uni.country}</p>
                        </div>
                      </div>
                      
                      <div className={styles.cardStats}>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{uni.acceptance_rate}%</span>
                          <span className={styles.statLabel}>Acceptance</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{uni.tuition === 0 ? "Free" : `$${(uni.tuition/1000).toFixed(0)}k`}</span>
                          <span className={styles.statLabel}>Tuition/Yr</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{(uni.students/1000).toFixed(0)}k</span>
                          <span className={styles.statLabel}>Students</span>
                        </div>
                      </div>

                      <div className={styles.majorTags}>
                        {uni.programs.map(p => <span key={p} className={styles.majorTag}>{p}</span>)}
                      </div>

                      <div className={styles.cardActions}>
                        <button onClick={() => setSelectedUni(uni)} className={styles.detailsBtn}>
                          <GraduationCap size={18} /> Details
                        </button>
                        <Link href="/roadmaps" className={styles.guideBtn}>
                          Guide <ArrowRight size={18} />
                        </Link>
                      </div>
                    </motion.div>
                  )) : (!loading && 
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                      <Search size={48} style={{ color: "#4b5563", marginBottom: "1.5rem" }} />
                      <h3 style={{ fontSize: "1.5rem", color: "white", marginBottom: "0.5rem" }}>No universities found</h3>
                      <p style={{ color: "#94a3b8" }}>Try adjusting your filters or search terms.</p>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

