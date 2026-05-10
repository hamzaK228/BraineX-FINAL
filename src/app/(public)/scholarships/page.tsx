"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, MapPin, Award, ChevronDown, Filter, Globe, GraduationCap, Coins, FlaskConical, UserCheck, Monitor, Bookmark, ExternalLink, ArrowRight } from "lucide-react";
import { useSaved } from "@/context/SavedContext";
import { GoogleSearcherIndicator } from "@/components/GoogleSearcherIndicator";

type Scholarship = {
  id: string; title: string; provider: string; location: string;
  coverage: "Full Ride" | "Partial" | "Grant" | "Stipend";
  degreeLevel: string[]; deadline: string; amount: number; tags: string[];
  fields: string[];
  eligibility: ("International" | "Domestic")[];
  format: "Online" | "Offline" | "Universal";
  description?: string; special_features?: string[]; noticable_facts?: string[];
  apply_link?: string; featured?: boolean;
};

const scholarshipsDataHardcoded: Scholarship[] = [];

export default function ScholarshipsPage() {
  const [scholarshipsData, setScholarshipsData] = useState<Scholarship[]>(scholarshipsDataHardcoded);
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const { saveItem, removeItem, isSaved } = useSaved();
  const [sort, setSort] = useState("amount_desc");
  const [selectedSchol, setSelectedSchol] = useState<Scholarship | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Web Search State
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [webResults, setWebResults] = useState<any[]>([]);
  const [hasSearchedWeb, setHasSearchedWeb] = useState(false);

  // Filter States
  const [location, setLocation] = useState("Any Location");
  const [coverage, setCoverage] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [activeFields, setActiveFields] = useState<string[]>([]);
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [formats, setFormats] = useState<string[]>([]);
  const [activeStatus, setActiveStatus] = useState<string[]>([]);
  const [activeTesting, setActiveTesting] = useState<string[]>([]);
  const [activeAidType, setActiveAidType] = useState<string[]>([]);

  // Fetch scholarships from database (admin-managed content)
  useEffect(() => {
    fetch('/api/public/content/scholarships?limit=200')
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const dbSchols: Scholarship[] = data.items.map((item: any) => {
            // Defensive parsing for arrays
            const parseArray = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' ? val.split(',').map((s: string) => s.trim()) : []);
            
            return {
              id: item.id,
              title: item.title,
              provider: item.provider || "Various",
              location: item.location || "Global",
              coverage: (item.coverage as any) || "Partial",
              degreeLevel: parseArray(item.degreeLevel).length > 0 ? parseArray(item.degreeLevel) : ["Undergraduate"],
              deadline: (() => {
                try {
                  if (!item.deadline || item.deadline === "Varies") return "Varies";
                  const d = new Date(item.deadline);
                  return isNaN(d.getTime()) ? "Varies" : d.toISOString().split('T')[0];
                } catch (e) { return "Varies"; }
              })(),
              amount: item.amount || 0,
              tags: parseArray(item.tags).length > 0 ? parseArray(item.tags) : ["General"],
              fields: parseArray(item.fields).length > 0 ? parseArray(item.fields) : ["All"],
              eligibility: parseArray(item.eligibility).length > 0 ? item.eligibility : ["International", "Domestic"],
              format: (item.studyMode as any) || "Universal",
              description: item.description || `${item.title} scholarship offered by ${item.provider || 'various organizations'}.`,
              special_features: parseArray(item.specialFeatures).length > 0 ? item.specialFeatures : ["Global recognition"],
              noticable_facts: parseArray(item.noticableFacts).length > 0 ? item.noticableFacts : ["Apply early"],
              apply_link: item.applyLink || undefined,
              featured: item.featured || false
            };
          });
          // Merge: Database items take priority, deduplicate by title + provider
          setScholarshipsData(prev => {
            const dbKeys = new Set(dbSchols.map(s => `${s.title}-${s.provider}`.toLowerCase()));
            const filteredHardcoded = prev.filter(s => !dbKeys.has(`${s.title}-${s.provider}`.toLowerCase()));
            return [...dbSchols, ...filteredHardcoded];
          });
        }
      })
      .catch(() => { /* keep hardcoded data as fallback */ });
  }, []);

  const locations = useMemo(() => ["Any Location", ...Array.from(new Set(scholarshipsData.map(s => s.location))).sort()], [scholarshipsData]);
  const fieldOptions = ["STEM", "Medicine", "Business", "Humanities", "Arts", "Social Sciences", "Law", "Education", "Leadership", "Environment"];
  const levelOptions = ["High School", "Undergraduate", "Master's", "Ph.D.", "Postgraduate"];
  const coverageOptions = ["Full Ride", "Partial", "Grant", "Stipend"];
  const formatOptions = ["Online", "Offline", "Universal"];
  const eligibilityOptions = ["International", "Domestic"];
  const statusOptions = ["Open Now", "Closing Soon", "Opening Soon"];
  const testingOptions = ["No Tests Needed", "IELTS Required", "SAT Required"];
  const aidTypeOptions = ["Merit-Based", "Need-Based", "Talent-Based"];

  const tog = (arr: string[], val: string, set: React.Dispatch<React.SetStateAction<string[]>>) => {
    set(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const handleWebSearch = async () => {
    if (!search) return;
    setIsSearchingWeb(true);
    setHasSearchedWeb(true);
    try {
      const res = await fetch(`/api/search/google?q=${encodeURIComponent(search)}`);
      const data = await res.json();
      setWebResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  const filtered = useMemo(() => {
    let r = scholarshipsData;
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(x => x.title.toLowerCase().includes(s) || x.provider.toLowerCase().includes(s) || x.tags.some(t => t.toLowerCase().includes(s)));
    }
    if (location !== "Any Location") r = r.filter(x => x.location === location);
    if (coverage.length > 0) r = r.filter(x => coverage.includes(x.coverage));
    if (levels.length > 0) r = r.filter(x => levels.some(l => x.degreeLevel.includes(l)));
    if (activeFields.length > 0) r = r.filter(x => activeFields.some(f => x.fields.includes(f)));
    if (eligibility.length > 0) r = r.filter(x => eligibility.some(e => x.eligibility.includes(e as any)));
    if (formats.length > 0) r = r.filter(x => formats.includes(x.format));

    return [...r].sort((a, b) => {
      if (sort === "amount_desc") return b.amount - a.amount;
      if (sort === "amount_asc") return a.amount - b.amount;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [search, location, coverage, levels, activeFields, eligibility, formats, sort, scholarshipsData]);

  const activeFiltersCount = (location !== "Any Location" ? 1 : 0) + coverage.length + levels.length + activeFields.length + eligibility.length + formats.length + activeStatus.length + activeTesting.length + activeAidType.length;

  return (
    <>
      <PublicHeader />
      {selectedSchol && (
        <InfoModal
          isOpen={!!selectedSchol}
          onClose={() => setSelectedSchol(null)}
          title={selectedSchol.title}
          subtitle={selectedSchol.provider}
          icon="💰"
          image="https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=1200"
          description={selectedSchol.description}
          specialFeatures={selectedSchol.special_features}
          stats={[
            { label: "Coverage", value: selectedSchol.coverage },
            { label: "Format", value: selectedSchol.format },
            { label: "Est. Value", value: `~$${selectedSchol.amount.toLocaleString()}` }
          ]}
          tips={selectedSchol.noticable_facts || ["Start at least 6 months early.", "Get high quality recommendation letters."]}
          ctaLink={selectedSchol.apply_link}
          ctaLabel="Apply Now"
        />
      )}

      <main id="mainContent" style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg-color)" }}>
        <section className={styles.heroSection}>
          <div className="container">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", marginBottom: "1rem", fontWeight: 800 }}>Global Scholarships</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "3rem", fontWeight: 500 }}>
              Filter through {scholarshipsData.length} prestigious scholarships mapped from the BraineX Master Resource Guide.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#10b981", marginLeft: "0.5rem" }} />
              <input type="text" placeholder="Search by name, provider, or country..." className={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#10b981" }}>Search</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={styles.statsRow}
            >
              <div className={styles.statCard}>
                <span className={styles.statValue}>500+</span>
                <span className={styles.statLabel}>Scholarships</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>$100M+</span>
                <span className={styles.statLabel}>Funding</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>Full</span>
                <span className={styles.statLabel}>Coverage</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>Global</span>
                <span className={styles.statLabel}>Eligibility</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section style={{ background: "var(--bg-color)" }}>
          <div className={`container ${styles.layout}`}>

            <div style={{ maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
              <div className={styles.filterBar} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <div className={styles.filterBarLeft}>
                  <Filter size={18} style={{ color: "#10b981" }} />
                  <span className={styles.filterBarTitle}>
                    Filter {activeFiltersCount > 0 && <span className={styles.filterCount} style={{ background: "#10b981" }}>{activeFiltersCount}</span>}
                  </span>
                </div>
                <ChevronDown size={20} style={{ transform: isFilterOpen ? "rotate(180deg)" : "none", transition: "0.3s", color: "var(--text-muted)" }} />
              </div>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                    <div className={styles.expandedFilters}>

                      <div>
                        <span className={styles.filterSectionTitle}><FlaskConical size={12} /> Field of Study</span>
                        <div className={styles.checkGrid}>
                          {fieldOptions.map(f => (
                            <label key={f} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeFields.includes(f)} onChange={() => tog(activeFields, f, setActiveFields)} />
                              {f}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><Monitor size={12} /> Study Format</span>
                        <div className={styles.checkGrid}>
                          {formatOptions.map(f => (
                            <label key={f} className={styles.checkLabel}>
                              <input type="checkbox" checked={formats.includes(f)} onChange={() => tog(formats, f, setFormats)} />
                              {f}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><GraduationCap size={12} /> Degree Level</span>
                          <div className={styles.checkGrid}>
                            {levelOptions.map(l => (
                              <label key={l} className={styles.checkLabel}>
                                <input type="checkbox" checked={levels.includes(l)} onChange={() => tog(levels, l, setLevels)} />
                                {l}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><UserCheck size={12} /> Eligibility</span>
                        <div className={styles.checkGrid}>
                          {eligibilityOptions.map(e => (
                            <label key={e} className={styles.checkLabel}>
                              <input type="checkbox" checked={eligibility.includes(e)} onChange={() => tog(eligibility, e, setEligibility)} />
                              {e} Students
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Globe size={12} /> Region</span>
                          <select className={styles.filterSelect} value={location} onChange={e => setLocation(e.target.value)}>
                            {locations.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><Coins size={12} /> Coverage Type</span>
                        <div className={styles.checkGrid}>
                          {coverageOptions.map(c => (
                            <label key={c} className={styles.checkLabel}>
                              <input type="checkbox" checked={coverage.includes(c)} onChange={() => tog(coverage, c, setCoverage)} />
                              {c}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Monitor size={12} /> Application Status</span>
                          <div className={styles.checkGrid}>
                            {statusOptions.map(s => (
                              <label key={s} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeStatus.includes(s)} onChange={() => tog(activeStatus, s, setActiveStatus)} />
                                {s}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><FlaskConical size={12} /> Requirements & Type</span>
                        <div className={styles.checkGrid}>
                          {testingOptions.map(t => (
                            <label key={t} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeTesting.includes(t)} onChange={() => tog(activeTesting, t, setActiveTesting)} />
                              {t}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Award size={12} /> Aid Category</span>
                          <div className={styles.checkGrid}>
                            {aidTypeOptions.map(a => (
                              <label key={a} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeAidType.includes(a)} onChange={() => tog(activeAidType, a, setActiveAidType)} />
                                {a}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.controlsRow}>
                <span className={styles.resultsText}>Showing <strong>{filtered.length}</strong> Scholarships</span>
                <div className={styles.sortWrapper}>
                  <span className={styles.sortLabel}>Sort by:</span>
                  <select className={styles.filterSelect} style={{ width: "auto", padding: "0.4rem 1rem" }} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="amount_desc">💰 Highest Value</option>
                    <option value="amount_asc">💰 Lowest Value</option>
                    <option value="name_asc">📝 Name A→Z</option>
                  </select>
                </div>
              </div>

              {filtered.length === 0 && !isSearchingWeb && !hasSearchedWeb && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ 
                    textAlign: "center", 
                    padding: "5rem 2rem", 
                    background: "var(--card-bg)", 
                    borderRadius: "32px", 
                    border: "1px dashed var(--card-border)",
                    marginTop: "2rem"
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🏆</div>
                  <h3 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>No direct scholarships found</h3>
                  <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
                    We couldn't find any scholarships matching your search in our primary database. Would you like to consult our global AI searcher?
                  </p>
                  <button 
                    onClick={handleWebSearch}
                    className="ds-btn ds-btn-primary" 
                    style={{ 
                      padding: "1rem 2.5rem", 
                      borderRadius: "100px", 
                      background: "linear-gradient(135deg, #10b981, #34A853)",
                      border: "none",
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.75rem"
                    }}
                  >
                    <Search size={20} /> Deep Search with Google
                  </button>
                </motion.div>
              )}

              {isSearchingWeb && (
                <GoogleSearcherIndicator query={search} onCancel={() => setIsSearchingWeb(false)} />
              )}

              {hasSearchedWeb && !isSearchingWeb && webResults.length > 0 && (
                <div style={{ marginTop: "3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                    <div style={{ padding: "0.75rem", background: "linear-gradient(135deg, rgba(66,133,244,0.15), rgba(52,168,83,0.15))", borderRadius: "12px", border: "1px solid rgba(66,133,244,0.2)" }}>
                      <Globe size={24} color="#4285F4" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0, color: "var(--text-color)" }}>Web Results</h3>
                      <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>Sourced in real-time via Google Search</p>
                    </div>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                    {webResults.map((result, i) => {
                      let domain = "";
                      try { domain = new URL(result.link).hostname; } catch (e) {}
                      
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            background: "var(--card-bg)",
                            border: "1px solid var(--card-border)",
                            borderRadius: "24px",
                            padding: "1.5rem",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                            transition: "all 0.3s ease",
                            position: "relative",
                            overflow: "hidden"
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.boxShadow = "0 12px 30px rgba(66,133,244,0.1)";
                            e.currentTarget.style.borderColor = "rgba(66,133,244,0.3)";
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)";
                            e.currentTarget.style.borderColor = "var(--card-border)";
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                            {domain && (
                              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#fff", padding: "2px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                                <img 
                                  src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} 
                                  alt={domain}
                                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                                />
                              </div>
                            )}
                            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)", background: "var(--bg-color)", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>
                              {domain || "External Site"}
                            </span>
                          </div>

                          <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "1.15rem", lineHeight: "1.4", fontWeight: "700" }}>
                            <a href={result.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "var(--text-color)", transition: "color 0.2s" }} onMouseOver={e => e.currentTarget.style.color = "#4285F4"} onMouseOut={e => e.currentTarget.style.color = "var(--text-color)"}>
                              {result.title}
                            </a>
                          </h4>
                          
                          <p style={{ margin: "0 0 1.5rem 0", color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6", flex: 1 }}>
                            {result.snippet}
                          </p>

                          <a 
                            href={result.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ 
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.5rem",
                              padding: "0.75rem 1rem",
                              background: "rgba(66,133,244,0.05)",
                              color: "#4285F4",
                              textDecoration: "none",
                              borderRadius: "12px",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              transition: "all 0.2s",
                              marginTop: "auto"
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = "#4285F4";
                              e.currentTarget.style.color = "#fff";
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = "rgba(66,133,244,0.05)";
                              e.currentTarget.style.color = "#4285F4";
                            }}
                          >
                            Visit Resource <ArrowRight size={16} />
                          </a>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div style={{ textAlign: "center", marginTop: "3rem" }}>
                    <button 
                      onClick={() => { setHasSearchedWeb(false); setWebResults([]); }}
                      style={{ background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-muted)", padding: "0.75rem 1.5rem", borderRadius: "100px", cursor: "pointer" }}
                    >
                      Back to Database Search
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.grid} style={{ marginTop: "2rem" }}>
                <AnimatePresence>
                  {filtered.map((schol, index) => (
                    <motion.div
                      key={schol.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -12, scale: 1.02 }}
                      className={styles.card}
                    >
                      <button onClick={() => isSaved(schol.id) ? removeItem(schol.id) : saveItem({ id: schol.id, title: schol.title, type: "Scholarship", source: schol.provider, image: `https://www.google.com/s2/favicons?domain=${schol.provider.toLowerCase().replace(/ /g, "")}.com&sz=128` })} className={`${styles.bookmarkTop} ${isSaved(schol.id) ? styles.saved : ""}`}>
                        <Bookmark size={20} fill={isSaved(schol.id) ? "currentColor" : "none"} />
                      </button>
                      <div className={styles.cardHeader}>
                        <div className={styles.iconCircle}>
                          <img
                            src={"https://www.google.com/s2/favicons?domain=" + schol.provider.toLowerCase().replace(/ /g, "") + ".com&sz=128"}
                            alt={schol.provider}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 15l-2 5L9 9l11 4-5 2zm0 0l4 4'/%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 className={styles.title}>{schol.title}</h3>
                          <div className={styles.provider}>{schol.provider}</div>
                          <div className={styles.locationRow}><MapPin size={14} />Study in: {schol.location}</div>
                        </div>
                      </div>

                      <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>COVERAGE</span>
                          <span className={`${styles.detailValue} ${styles.coverageValue}`}>{schol.coverage}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>FORMAT</span>
                          <span className={styles.detailValue}>{schol.format}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>ELIGIBILITY</span>
                          <span className={styles.detailValue}>{schol.eligibility.length === 2 ? "Universal" : schol.eligibility[0]}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>EST. VALUE</span>
                          <span className={styles.detailValue}>~${schol.amount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className={styles.tags}>
                        {schol.tags.slice(0, 3).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                      </div>

                      <button className={styles.viewApplyBtn} onClick={() => setSelectedSchol(schol)}>
                        View & Apply
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}