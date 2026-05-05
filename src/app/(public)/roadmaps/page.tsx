"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, Map, Clock, BookOpen, Sparkles, ArrowRight, CheckCircle2, Bookmark, GraduationCap, Filter, ChevronDown } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

type RoadmapStep = {
  title: string;
  description: string;
  orderIndex?: number;
  status?: string;
};

type Roadmap = { 
  id: string; 
  title: string; 
  description: string; 
  level: string; 
  path: string; 
  time: string; 
  modules: number; 
  tags: string[]; 
  special_features?: string[]; 
  noticable_facts?: string[]; 
  image?: string;
  steps?: RoadmapStep[];
  color?: string;
};

const roadmapsData: Roadmap[] = [];


export default function RoadmapsPage() {
  const [roadmapsDataState, setRoadmapsDataState] = useState<Roadmap[]>(roadmapsData);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("modules_desc");
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['path', 'level']);
  const [showFilters, setShowFilters] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const { saveItem, removeItem, isSaved } = useSaved();
  const router = useRouter();
  const { data: session } = useSession();

  // Fetch roadmaps from database (admin-managed content)
  useEffect(() => {
    fetch('/api/public/content/roadmaps?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const dbRoadmaps: Roadmap[] = data.items.map((item: any) => {
            const parseArray = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' ? val.split(',').map((s: string) => s.trim()) : []);
            
            let parsedSteps = [];
            try {
              parsedSteps = Array.isArray(item.steps) ? item.steps : (typeof item.steps === 'string' ? JSON.parse(item.steps) : []);
            } catch (e) {
              console.error("Failed to parse steps for roadmap:", item.title, e);
              parsedSteps = [];
            }

            return {
              id: item.id,
              title: item.title,
              description: item.description || "Career roadmap for " + item.title,
              level: item.level || "Beginner",
              path: item.path || "General",
              time: item.time || "3-6 Months",
              modules: item.modules || (parsedSteps.length || 5),
              tags: parseArray(item.tags),
              image: item.image || "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200",
              color: item.color || "#6366f1",
              special_features: parseArray(item.specialFeatures).length > 0 ? item.specialFeatures : ["Step-by-step guidance", "Curated resources"],
              noticable_facts: parseArray(item.noticableFacts).length > 0 ? item.noticableFacts : ["Personalized learning path", "Industry-relevant skills"],
              steps: parsedSteps
            };
          });
          // Merge: Database items take priority, deduplicate by title
          setRoadmapsDataState(prev => {
            const dbTitles = new Set(dbRoadmaps.map(r => r.title.toLowerCase()));
            const filteredHardcoded = prev.filter(r => !dbTitles.has(r.title.toLowerCase()));
            return [...dbRoadmaps, ...filteredHardcoded];
          });
        }
      })
      .catch(() => { /* fallback to hardcoded */ });
  }, []);

  const toggleAccordion = (id: string) => setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const uniquePaths = useMemo(() => Array.from(new Set(roadmapsDataState.map(r => r.path))).sort(), [roadmapsDataState]);

  const handleSave = (rm: Roadmap) => {
    if (isSaved(rm.id)) { removeItem(rm.id); }
    else { saveItem({ id: rm.id, title: rm.title, type: 'Roadmap', source: `${rm.path} • ${rm.level}`, image: rm.image }); }
  };

  const handleStartLearning = async (rm: Roadmap) => {
    if (!session) {
      router.push("/login?callbackUrl=/roadmaps");
      return;
    }

    setIsStarting(true);
    try {
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: rm.title,
          description: rm.description,
          color: rm.color,
          steps: rm.steps || []
        })
      });

      console.log("Roadmap creation response:", res.status);
      if (res.ok) {
        console.log("Redirecting to dashboard/roadmaps...");
        window.location.href = "/dashboard/roadmaps";
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Failed to start roadmap:", errData);
        alert(`Failed to start roadmap: ${errData.error || res.statusText || "Please check your connection or login again."}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStarting(false);
    }
  };

  const filteredData = useMemo(() => {
    let result = roadmapsDataState;
    if (search) { const s = search.toLowerCase(); result = result.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s) || p.tags.some(tag => tag.toLowerCase().includes(s))); }
    if (paths.length > 0) { result = result.filter(p => paths.includes(p.path)); }
    if (levels.length > 0) { result = result.filter(p => levels.includes(p.level)); }
    result = [...result].sort((a, b) => { if (sort === "modules_desc") return b.modules - a.modules; if (sort === "modules_asc") return a.modules - b.modules; if (sort === "name_asc") return a.title.localeCompare(b.title); return 0; });
    return result;
  }, [search, sort, paths, levels, roadmapsDataState]);

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
          stats={[{ label: "Difficulty", value: selectedRoadmap.level }, { label: "Duration", value: selectedRoadmap.time }, { label: "Modules", value: `${selectedRoadmap.modules}` }]}
          tips={selectedRoadmap.noticable_facts || ["Dedicate at least 10 hours a week."]} 
          steps={selectedRoadmap.steps}
          ctaLabel={isStarting ? "Starting..." : "Start Learning"}
          onCtaClick={() => handleStartLearning(selectedRoadmap)}
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>Career Roadmaps</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "3rem", fontWeight: 500 }}>
              {roadmapsData.length} expert-curated learning paths with actionable advice, real resources, and milestone-based progress tracking.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#06b6d4", marginLeft: "0.5rem" }} />
              <input type="text" placeholder="Search for roles or skills..." className={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#06b6d4" }}>Search</button>
            </motion.div>
          </div>
        </section>

        <section style={{ background: "var(--bg-color)", position: "relative" }}>
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
              <div className={styles.filterFooter} style={{ borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
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
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Sort by:</span>
                  <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="modules_desc">📊 Comprehensive</option>
                    <option value="modules_asc">⚡ Shortest</option>
                    <option value="name_asc">📝 Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--card-bg)", borderRadius: "24px", border: "1px dashed var(--card-border)" }}>
                  <Search size={48} style={{ color: "#4b5563", marginBottom: "1.5rem" }} /><h3>No roadmaps found</h3>
                  <p style={{ color: "var(--text-muted)" }}>Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filteredData.map((rm, index) => (
                      <motion.div key={rm.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: Math.min(index * 0.05, 0.3) }} className={styles.card} style={{ position: "relative" }}>
                        <button onClick={() => handleSave(rm)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--card-bg)", border: "1px solid var(--card-border)", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, color: isSaved(rm.id) ? "#06b6d4" : "var(--text-muted)", transition: "all 0.2s" }}>
                          <Bookmark size={18} fill={isSaved(rm.id) ? "#06b6d4" : "none"} />
                        </button>
                        <div className={styles.cardHeader}>
                          <div className={styles.logoWrapper}><Map size={32} color={rm.color || "#06b6d4"} /></div>
                          <div style={{ paddingRight: "2rem" }}>
                            <h3 className={styles.title}>{rm.title}</h3>
                            <div className={styles.university}>{rm.path} Development</div>
                            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle2 size={14} color="#10b981" /> {rm.modules} Core Modules
                            </div>
                          </div>
                        </div>
                        <p className={styles.descriptionText}>{rm.description}</p>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Difficulty</span><span className={styles.detailValue}>{rm.level}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Est. Time</span><span className={styles.detailValue}>{rm.time}</span></div>
                          <div className={styles.detailItem} style={{ gridColumn: "span 2" }}><span className={styles.detailLabel}>Certification</span><span className={styles.detailValue} style={{ color: rm.color || "#06b6d4" }}>Included</span></div>
                        </div>
                        <div className={styles.tags}>{rm.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}</div>
                        <div className={styles.cardActions} style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                          <button onClick={() => setSelectedRoadmap(rm)} style={{ background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", padding: "0.75rem", borderRadius: "12px", flex: 1, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}> <Map size={18} /> Details</button>
                          <button 
                            onClick={() => handleStartLearning(rm)}
                            disabled={isStarting}
                            className="ds-btn ds-btn-primary" 
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "12px", flex: 1, textDecoration: "none", background: rm.color || "#06b6d4", color: "white", border: "none", cursor: "pointer", opacity: isStarting ? 0.7 : 1 }}
                          >
                            {isStarting ? "Starting..." : "Start"} <ArrowRight size={18} />
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
