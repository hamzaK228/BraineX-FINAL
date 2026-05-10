"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, MapPin, GraduationCap, Users, BookOpen, Sparkles, ArrowRight, Bookmark, Filter, ChevronDown, Check, Globe, Coins, FlaskConical, Monitor, ExternalLink } from "lucide-react";
import { useSaved } from "@/context/SavedContext";
import { GoogleSearcherIndicator } from "@/components/GoogleSearcherIndicator";

// Types
type University = {
  id: string;
  name: string;
  city: string;
  country: string;
  ranking: number;
  tuition: number | null;
  acceptance_rate: number | null;
  logo: string;
  image?: string | null;
  programs: string[];
  type: string;
  students: number | null;
  description?: string;
  special_features?: string[];
  noticable_facts?: string[];
};

const top50Data: University[] = [];

export default function UniversitiesPage() {
  const [universitiesData, setUniversitiesData] = useState<University[]>(top50Data);
  const [loading, setLoading] = useState(true);
  const { saveItem, removeItem, isSaved } = useSaved();

  // Filters state
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("ranking");
  const [activeCountries, setActiveCountries] = useState<string[]>([]);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeFields, setActiveFields] = useState<string[]>([]);
  const [activeLevels, setActiveLevels] = useState<string[]>([]);
  const [activeFunding, setActiveFunding] = useState<string[]>([]);
  const [activeSettings, setActiveSettings] = useState<string[]>([]);
  const [activeAid, setActiveAid] = useState<string[]>([]);
  const [activeSelectivity, setActiveSelectivity] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(100);

  // Web Search State
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [webResults, setWebResults] = useState<any[]>([]);
  const [hasSearchedWeb, setHasSearchedWeb] = useState(false);

  const countryOptions = useMemo(() => Array.from(new Set(universitiesData.map(u => u.country))).sort(), [universitiesData]);
  const typeOptions = ["Public", "Private"];
  const fieldOptions = ["STEM", "Business", "Medicine", "Humanities", "Arts", "Law", "Education"];
  const levelOptions = ["Undergraduate", "Graduate", "Ph.D."];
  const fundingOptions = ["Tuition-Free", "Low Cost", "High Value"];
  const settingOptions = ["Urban", "Rural", "Suburban"];
  const aidOptions = ["Full Need Met", "Partial Aid", "None"];
  const selectivityOptions = ["Highly Selective (<10%)", "Competitive (10-30%)", "Accessible (>30%)"];

  // Fetch universities from the database (admin-managed content)
  useEffect(() => {
    fetch('/api/public/content/universities?limit=1500')
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          // Map database items to the expected University format
          const dbUnis: University[] = data.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            city: item.location || item.country || "Main Campus",
            country: item.country || "Unknown",
            ranking: item.ranking ?? 9999,
            tuition: item.tuition ?? null,
            acceptance_rate: item.acceptance ?? null,
            logo: item.logo || `https://www.google.com/s2/favicons?domain=${item.name.toLowerCase().replace(/\s+/g,'')}.edu&sz=128`,
            image: item.image || null,
            programs: item.tags?.length > 0 ? item.tags : ["Academic Excellence"],
            type: item.type || "Public",
            students: item.students || null,
            description: item.description || `${item.name} is a leading institution in ${item.country || 'the world'}.`,
            special_features: item.specialFeatures?.length > 0 ? item.specialFeatures : ["Research Excellence", "Global Community", "Innovation Hub"],
            noticable_facts: item.noticableFacts?.length > 0 ? item.noticableFacts : ["Top-ranked institution", "Global alumni network"]
          }));
          dbUnis.sort((a, b) => a.ranking - b.ranking);
          setUniversitiesData(dbUnis);
          setLoading(false);
        } else {
          setUniversitiesData([]);
          setLoading(false);
        }
      })
      .catch(() => {
        setUniversitiesData([]);
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

    if (activeCountries.length > 0) result = result.filter(u => activeCountries.includes(u.country));
    if (activeTypes.length > 0) result = result.filter(u => activeTypes.includes(u.type));
    if (activeFields.length > 0) result = result.filter(u => activeFields.some(f => u.programs.some(p => p.toLowerCase().includes(f.toLowerCase()))));
    
    if (activeFunding.length > 0) {
      result = result.filter(u => {
        if (activeFunding.includes("Tuition-Free") && u.tuition === 0) return true;
        if (activeFunding.includes("Low Cost") && u.tuition != null && u.tuition > 0 && u.tuition < 15000) return true;
        if (activeFunding.includes("High Value") && u.tuition != null && u.tuition >= 15000) return true;
        return false;
      });
    }

    if (activeSelectivity.length > 0) {
      result = result.filter(u => {
        if (u.acceptance_rate == null) return false;
        if (activeSelectivity.includes("Highly Selective (<10%)") && u.acceptance_rate < 10) return true;
        if (activeSelectivity.includes("Competitive (10-30%)") && u.acceptance_rate >= 10 && u.acceptance_rate <= 30) return true;
        if (activeSelectivity.includes("Accessible (>30%)") && u.acceptance_rate > 30) return true;
        return false;
      });
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "ranking": return a.ranking - b.ranking;
        case "name": return a.name.localeCompare(b.name);
        case "acceptance": {
          if (a.acceptance_rate == null && b.acceptance_rate == null) return 0;
          if (a.acceptance_rate == null) return 1;
          if (b.acceptance_rate == null) return -1;
          return a.acceptance_rate - b.acceptance_rate;
        }
        case "tuition-low": {
          if (a.tuition == null && b.tuition == null) return 0;
          if (a.tuition == null) return 1;
          if (b.tuition == null) return -1;
          return a.tuition - b.tuition;
        }
        case "tuition-high": {
          if (a.tuition == null && b.tuition == null) return 0;
          if (a.tuition == null) return 1;
          if (b.tuition == null) return -1;
          return b.tuition - a.tuition;
        }
        default: return a.ranking - b.ranking;
      }
    });

    return result;
  }, [search, activeCountries, activeTypes, activeFields, activeFunding, sort, universitiesData]);

  const activeFiltersCount = activeCountries.length + activeTypes.length + activeFields.length + activeLevels.length + activeFunding.length + activeSettings.length + activeAid.length + activeSelectivity.length;

  const tog = (list: string[], val: string, setList: (v: string[]) => void) => {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val]);
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

  const handleSave = (uni: University) => {
    if (isSaved(uni.id)) {
      removeItem(uni.id);
    } else {
      saveItem({
        id: uni.id,
        title: uni.name,
        type: 'University',
        source: `${uni.city}, ${uni.country}`,
        image: uni.image ?? undefined
      });
    }
  };

  return (
    <>
      <PublicHeader />
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg-color)" }}>
        
        <section className={styles.heroSection}>
          <div className="container">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", marginBottom: "1rem", fontWeight: 800 }}>
              Top Universities Worldwide
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "var(--text-muted)", marginBottom: "3rem", fontWeight: 500 }}>
              Explore and compare the world's best {loading ? "..." : universitiesData.length} universities. Find your perfect academic home.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#0ea5e9", marginLeft: "0.5rem" }} />
              <input type="text" placeholder="Search by name, location or rank..." className={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#0ea5e9" }}>Search</button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className={styles.statsRow}
            >
              <div className={styles.statCard}>
                <span className={styles.statValue}>1,000+</span>
                <span className={styles.statLabel}>Universities</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>60+</span>
                <span className={styles.statLabel}>Countries</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>Top 1%</span>
                <span className={styles.statLabel}>Worldwide</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>Global</span>
                <span className={styles.statLabel}>Recognition</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section style={{ background: "var(--bg-color)" }}>
          <div className={`container ${styles.layout}`}>
            
            <div style={{ maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
              <div className={styles.filterBar} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <div className={styles.filterBarLeft}>
                  <Filter size={18} style={{ color: "#6366f1" }} />
                  <span className={styles.filterBarTitle}>
                    Filter {activeFiltersCount > 0 && <span className={styles.filterCount}>{activeFiltersCount}</span>}
                  </span>
                </div>
                <ChevronDown size={20} style={{ transform: isFilterOpen ? "rotate(180deg)" : "none", transition: "0.3s", color: "#64748b" }} />
              </div>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                    <div className={styles.expandedFilters}>
                      
                      <div>
                        <span className={styles.filterSectionTitle}><FlaskConical size={12} /> Major Fields</span>
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
                        <span className={styles.filterSectionTitle}><GraduationCap size={12} /> Institution Type</span>
                        <div className={styles.checkGrid}>
                          {typeOptions.map(t => (
                            <label key={t} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeTypes.includes(t)} onChange={() => tog(activeTypes, t, setActiveTypes)} />
                              {t}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Monitor size={12} /> Target Level</span>
                          <div className={styles.checkGrid}>
                            {levelOptions.map(l => (
                              <label key={l} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeLevels.includes(l)} onChange={() => tog(activeLevels, l, setActiveLevels)} />
                                {l}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><Globe size={12} /> Global Region</span>
                        <select className={styles.filterSelect} value={activeCountries[0] || ""} onChange={e => setActiveCountries(e.target.value ? [e.target.value] : [])}>
                          <option value="">Any Location</option>
                          {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><Coins size={12} /> Tuition & Value</span>
                        <div className={styles.checkGrid}>
                          {fundingOptions.map(f => (
                            <label key={f} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeFunding.includes(f)} onChange={() => tog(activeFunding, f, setActiveFunding)} />
                              {f}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Sparkles size={12} /> Selectivity</span>
                          <div className={styles.checkGrid}>
                            {selectivityOptions.map(s => (
                              <label key={s} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeSelectivity.includes(s)} onChange={() => tog(activeSelectivity, s, setActiveSelectivity)} />
                                {s}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><MapPin size={12} /> Campus Setting</span>
                        <div className={styles.checkGrid}>
                          {settingOptions.map(s => (
                            <label key={s} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeSettings.includes(s)} onChange={() => tog(activeSettings, s, setActiveSettings)} />
                              {s}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Users size={12} /> International Aid</span>
                          <div className={styles.checkGrid}>
                            {aidOptions.map(a => (
                              <label key={a} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeAid.includes(a)} onChange={() => tog(activeAid, a, setActiveAid)} />
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
                <span className={styles.resultsText}>Showing <strong>{filteredData.length}</strong> Universities</span>
                <div className={styles.sortWrapper}>
                  <span className={styles.sortLabel}>Sort by:</span>
                  <select className={styles.filterSelect} style={{ width: "auto", padding: "0.4rem 1rem" }} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="ranking">🏆 World Ranking</option>
                    <option value="name">📝 Alphabetical</option>
                    <option value="acceptance">📊 Acceptance Rate</option>
                    <option value="tuition-low">💰 Lowest Tuition</option>
                  </select>
                </div>
              </div>

              {loading && (
                <div style={{ textAlign: "center", padding: "8rem 2rem" }}>
                  <div className={styles.loader}></div>
                  <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>Fetching global university database...</p>
                </div>
              )}

              {!loading && filteredData.length === 0 && !isSearchingWeb && !hasSearchedWeb && (
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
                  <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🔭</div>
                  <h3 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>No direct matches found</h3>
                  <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
                    We couldn't find any universities matching your specific criteria in our primary database. Would you like to expand the search to the entire web?
                  </p>
                  <button 
                    onClick={handleWebSearch}
                    className="ds-btn ds-btn-primary" 
                    style={{ 
                      padding: "1rem 2.5rem", 
                      borderRadius: "100px", 
                      background: "linear-gradient(135deg, #4285F4, #34A853)",
                      border: "none",
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.75rem"
                    }}
                  >
                    <Search size={20} /> Deep Search with Google
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
                  {filteredData.slice(0, displayLimit).map((uni, index) => (
                    <motion.div 
                      key={uni.id} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: (index % 20) * 0.05 }} 
                      whileHover={{ y: -12, scale: 1.02 }}
                      className={styles.card}
                    >
                      <div className={`${styles.rankingBadge} ${uni.ranking <= 10 ? styles.top10 : ''}`}>
                        #{uni.ranking}
                      </div>
                      
                      <button onClick={() => handleSave(uni)} className={styles.saveBtn} style={{ color: isSaved(uni.id) ? "#6366f1" : "#94a3b8" }}>
                        <Bookmark size={20} fill={isSaved(uni.id) ? "#6366f1" : "none"} />
                      </button>

                      <div className={styles.cardHeader}>
                        <div className={styles.logoWrapper}>
                          <img 
                            src={uni.logo} 
                            alt={uni.name} 
                            className={styles.uniLogo} 
                            loading="lazy"
                            onError={(e) => { 
                              e.currentTarget.onerror = null; 
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 10v6M2 10l10-5 10 5-10 5z'/%3E%3Cpath d='M6 12v5c3 3 9 3 12 0v-5'/%3E%3C/svg%3E";
                            }} 
                          />
                        </div>
                        <div style={{ paddingRight: "2rem" }}>
                          <h3 className={styles.uniName}>{uni.name}</h3>
                          <p className={styles.uniLocation}><MapPin size={14} /> {uni.city}, {uni.country}</p>
                        </div>
                      </div>
                      
                      <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Acceptance</span><span className={styles.detailValue}>{uni.acceptance_rate != null ? `${uni.acceptance_rate}%` : "N/A"}</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Tuition</span><span className={styles.detailValue}>{uni.tuition == null ? "N/A" : uni.tuition === 0 ? "Free" : `$${(uni.tuition/1000).toFixed(0)}k`}</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Students</span><span className={styles.detailValue}>{uni.students ? `${(uni.students/1000).toFixed(0)}k` : "N/A"}</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Type</span><span className={styles.detailValue}>{uni.type}</span></div>
                      </div>

                      <div className={styles.tags}>
                        {uni.programs.map(p => <span key={p} className={styles.tag}>{p}</span>)}
                      </div>

                      <div className={styles.cardActions}>
                        <Link href={`/universities/${uni.id}`} className={styles.detailsBtn} style={{ textDecoration: "none" }}>
                          <GraduationCap size={18} /> Details
                        </Link>
                        <Link href="/dashboard" className={styles.guideBtn}>
                          Guide <ArrowRight size={18} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {displayLimit < filteredData.length && (
                <div style={{ textAlign: "center", marginTop: "4rem", marginBottom: "4rem" }}>
                  <button 
                    onClick={() => setDisplayLimit(prev => prev + 200)} 
                    className={styles.detailsBtn} 
                    style={{ padding: "1rem 3rem", fontSize: "1.1rem", borderRadius: "100px" }}
                  >
                    Load More Universities ({filteredData.length - displayLimit} Remaining)
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
