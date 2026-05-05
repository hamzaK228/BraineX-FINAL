"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, MapPin, GraduationCap, Sparkles, Bookmark, Filter as FilterIcon, ChevronDown, FlaskConical, Globe, Briefcase, Palette, Heart, BookOpen, Laptop, Trophy, Coins, UserCheck, Monitor } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

type Program = {
  id: string; title: string; university: string; location: string; country: string;
  logo?: string; image?: string; 
  level: "High School" | "Undergraduate" | "Graduate";
  category: "Summer" | "Research" | "Internship" | "Competition" | "University";
  fields: string[]; 
  format: "Online" | "Offline" | "Hybrid"; 
  duration: string; tuition: number; tags: string[];
  eligibility: ("International" | "Domestic")[];
  description?: string; special_features?: string[]; noticable_facts?: string[];
  apply_link?: string; featured?: boolean;
};

const programsData: Program[] = [];

export default function ProgramsPage() {
  const [programsDataState, setProgramsDataState] = useState<Program[]>(programsData);
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [sort, setSort] = useState("tuition_asc");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch programs from database (admin-managed content)
  useEffect(() => {
    fetch('/api/public/content/programs?limit=200')
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const dbPrograms: Program[] = data.items.map((item: any) => ({
            id: item.id,
            title: item.title,
            university: item.university || "Various",
            location: item.location || "Global",
            country: item.country || "Global",
            level: (item.degreeLevel as "High School" | "Undergraduate" | "Graduate") || "Undergraduate",
            category: (item.category as "Summer" | "Research" | "Internship" | "Competition" | "University") || "University",
            fields: Array.isArray(item.fields) ? item.fields : (typeof item.fields === 'string' ? item.fields.split(',').map((s: string) => s.trim()) : ["All"]),
            format: (item.studyMode as "Online" | "Offline" | "Hybrid") || "Online",
            duration: item.duration || "Varies",
            tuition: item.tuition || 0,
            tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(',').map((s: string) => s.trim()) : ["General"]),
            eligibility: Array.isArray(item.eligibility) && item.eligibility.length > 0 ? item.eligibility : ["International", "Domestic"],
            description: item.description || `${item.title} program offered by ${item.university || 'various institutions'}.`,
            special_features: Array.isArray(item.specialFeatures) ? item.specialFeatures : ["Global recognition"],
            noticable_facts: Array.isArray(item.noticableFacts) && item.noticableFacts.length > 0 ? item.noticableFacts : ["Apply early"],
            apply_link: item.applyLink || undefined,
            featured: item.featured || false
          }));
          // Merge: Database items take priority, deduplicate by title + university
          setProgramsDataState(prev => {
            const dbKeys = new Set(dbPrograms.map(p => `${p.title}-${p.university}`.toLowerCase()));
            const filteredHardcoded = prev.filter(p => !dbKeys.has(`${p.title}-${p.university}`.toLowerCase()));
            return [...dbPrograms, ...filteredHardcoded];
          });
        }
      })
      .catch(() => { /* fallback to hardcoded data already in state */ });
  }, []);
  
  // Filter States
  const [activeFields, setActiveFields] = useState<string[]>([]);
  const [activeLevels, setActiveLevels] = useState<string[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [fundingTypes, setFundingTypes] = useState<string[]>([]);
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [activeDifficulties, setActiveDifficulties] = useState<string[]>([]);
  const [activeTesting, setActiveTesting] = useState<string[]>([]);
  const [activeLanguages, setActiveLanguages] = useState<string[]>([]);
  const [location, setLocation] = useState("Any Location");

  const { saveItem, removeItem, isSaved } = useSaved();

  const fieldOptions = ["STEM", "Mathematics", "Medicine", "Humanities", "Business", "Arts", "Social Sciences", "Law", "Education", "Interdisciplinary"];
  const levelOptions = ["High School", "Undergraduate", "Graduate"];
  const formatOptions = ["Online", "Offline", "Hybrid"];
  const categoryOptions = ["Summer", "Research", "Internship", "Competition", "University"];
  const fundingOptions = ["Fully Funded", "Paid", "Free"];
  const eligibilityOptions = ["International", "Domestic"];
  const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
  const testingOptions = ["IELTS/TOEFL Required", "No Tests Needed"];
  const languageOptions = ["English Only", "Bilingual"];
  const locations = useMemo(() => ["Any Location", ...Array.from(new Set(programsDataState.map(p => p.country))).sort()], [programsDataState]);

  const tog = (arr: string[], val: string, set: React.Dispatch<React.SetStateAction<string[]>>) => {
    set(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const filtered = useMemo(() => {
    let r = programsDataState;
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(p => p.title.toLowerCase().includes(s) || p.university.toLowerCase().includes(s) || p.tags.some(t => t.toLowerCase().includes(s)));
    }
    if (activeFields.length > 0) r = r.filter(p => activeFields.some(f => p.fields.includes(f)));
    if (activeLevels.length > 0) r = r.filter(p => activeLevels.includes(p.level));
    if (activeFormats.length > 0) r = r.filter(p => activeFormats.includes(p.format));
    if (activeCategories.length > 0) r = r.filter(p => activeCategories.includes(p.category));
    if (location !== "Any Location") r = r.filter(p => p.country === location);
    if (eligibility.length > 0) r = r.filter(p => eligibility.some(e => p.eligibility.includes(e as any)));
    
    if (fundingTypes.length > 0) {
      r = r.filter(p => {
        if (fundingTypes.includes("Free") && p.tuition === 0) return true;
        if (fundingTypes.includes("Paid") && p.tuition > 0) return true;
        if (fundingTypes.includes("Fully Funded") && p.tags.some(t => t.toLowerCase().includes("funded"))) return true;
        return false;
      });
    }
    return [...r].sort((a, b) => {
      if (sort === "tuition_asc") return a.tuition - b.tuition;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [search, activeFields, activeLevels, activeFormats, activeCategories, fundingTypes, eligibility, location, sort, programsDataState]);

  const activeFiltersCount = activeFields.length + activeLevels.length + activeFormats.length + activeCategories.length + fundingTypes.length + eligibility.length + activeDifficulties.length + activeTesting.length + activeLanguages.length + (location !== "Any Location" ? 1 : 0);

  return (
    <>
      <PublicHeader />
      {selectedProgram && (
        <InfoModal isOpen={!!selectedProgram} onClose={() => setSelectedProgram(null)} title={selectedProgram.title} subtitle={selectedProgram.university} icon="🎓"
          image={selectedProgram.image || "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200"}
          description={selectedProgram.description} specialFeatures={selectedProgram.special_features}
          stats={[{ label: "Level", value: selectedProgram.level }, { label: "Format", value: selectedProgram.format }, { label: "Cost", value: selectedProgram.tuition === 0 ? "Free" : `$${selectedProgram.tuition.toLocaleString()}` }]}
          tips={selectedProgram.noticable_facts || ["Review prerequisites carefully.", "Prepare a strong Statement of Purpose."]} ctaLink={selectedProgram.apply_link} ctaLabel="Apply Now" />
      )}
      <main id="mainContent" style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg-color)" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", marginBottom: "1rem", fontWeight: 800 }}>Academic Programs</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "3rem", fontWeight: 500 }}>
              Browse through top pre-college and university programs mapped from our Master Resource Guide.
            </motion.p>
            <div className={styles.searchBox}>
              <Search style={{ color: "#6366f1", opacity: 0.5 }} size={20} />
              <input type="text" placeholder="Search for programs, universities, or topics..." className={styles.searchInput} value={tempSearch} onChange={e => setTempSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && setSearch(tempSearch)} />
              <button className={styles.searchBtn} onClick={() => setSearch(tempSearch)}>Search</button>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--bg-color)" }}>
          <div className={`container ${styles.layout}`}>
            
            <div style={{ maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
              <div className={styles.filterBar} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <div className={styles.filterBarLeft}>
                  <FilterIcon size={18} style={{ color: "#6366f1" }} />
                  <span className={styles.filterBarTitle}>
                    Filter {activeFiltersCount > 0 && <span className={styles.filterCount}>{activeFiltersCount}</span>}
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
                        <span className={styles.filterSectionTitle}><Monitor size={12} /> Program Format</span>
                        <div className={styles.checkGrid}>
                          {formatOptions.map(f => (
                            <label key={f} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeFormats.includes(f)} onChange={() => tog(activeFormats, f, setActiveFormats)} />
                              {f}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><GraduationCap size={12} /> Degree Level</span>
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
                          <span className={styles.filterSectionTitle}><Trophy size={12} /> Program Type</span>
                          <div className={styles.checkGrid}>
                            {categoryOptions.map(c => (
                              <label key={c} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeCategories.includes(c)} onChange={() => tog(activeCategories, c, setActiveCategories)} />
                                {c}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><Coins size={12} /> Funding & Cost</span>
                        <div className={styles.checkGrid}>
                          {fundingOptions.map(f => (
                            <label key={f} className={styles.checkLabel}>
                              <input type="checkbox" checked={fundingTypes.includes(f)} onChange={() => tog(fundingTypes, f, setFundingTypes)} />
                              {f}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Globe size={12} /> Language & Tests</span>
                          <div className={styles.checkGrid}>
                            {languageOptions.map(l => (
                              <label key={l} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeLanguages.includes(l)} onChange={() => tog(activeLanguages, l, setActiveLanguages)} />
                                {l}
                              </label>
                            ))}
                            {testingOptions.map(t => (
                              <label key={t} className={styles.checkLabel}>
                                <input type="checkbox" checked={activeTesting.includes(t)} onChange={() => tog(activeTesting, t, setActiveTesting)} />
                                {t}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className={styles.filterSectionTitle}><Trophy size={12} /> Difficulty Level</span>
                        <div className={styles.checkGrid}>
                          {difficultyOptions.map(d => (
                            <label key={d} className={styles.checkLabel}>
                              <input type="checkbox" checked={activeDifficulties.includes(d)} onChange={() => tog(activeDifficulties, d, setActiveDifficulties)} />
                              {d}
                            </label>
                          ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                          <span className={styles.filterSectionTitle}><Globe size={12} /> Location</span>
                          <select className={styles.filterSelect} value={location} onChange={e => setLocation(e.target.value)}>
                            {locations.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.controlsRow}>
                <span className={styles.resultsText}>Showing <strong>{filtered.length}</strong> Programs</span>
                <div className={styles.sortWrapper}>
                  <span className={styles.sortLabel}>Sort by:</span>
                  <select className={styles.filterSelect} style={{ width: "auto", padding: "0.4rem 1rem" }} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="tuition_asc">💰 Lowest Cost</option>
                    <option value="name_asc">📝 Alphabetical</option>
                  </select>
                </div>
              </div>

              <div className={styles.grid} style={{ marginTop: "2rem" }}>
                <AnimatePresence>
                  {filtered.map((prog, index) => (
                    <motion.div key={prog.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className={styles.card}>
                      <Bookmark className={`${styles.bookmarkTop} ${isSaved(prog.id) ? styles.saved : ""}`} size={20} onClick={() => { if (isSaved(prog.id)) removeItem(prog.id); else saveItem({ id: prog.id, title: prog.title, type: "Program", source: prog.university, image: prog.image }); }} fill={isSaved(prog.id) ? "currentColor" : "none"} />
                      <div className={styles.cardHeader}>
                        <div className={styles.logoWrapper}>
                          <img 
                            src={prog.logo || "https://www.google.com/s2/favicons?domain=" + prog.university.toLowerCase().replace(/ /g, "") + ".edu&sz=128"} 
                            alt={prog.title} 
                            className={styles.uniLogo}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            onError={(e) => { 
                              e.currentTarget.onerror = null; 
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 10v6M2 10l10-5 10 5-10 5z'/%3E%3Cpath d='M6 12v5c3 3 9 3 12 0v-5'/%3E%3C/svg%3E";
                            }} 
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 className={styles.title}>{prog.title}</h3>
                          <div className={styles.university}>{prog.university}</div>
                          <div className={styles.locationRow}><MapPin size={14} />{prog.location}</div>
                        </div>
                      </div>
                      <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Level</span><span className={styles.detailValue}>{prog.level}</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Format</span><span className={styles.detailValue}>{prog.format}</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Eligibility</span><span className={styles.detailValue}>{prog.eligibility.length === 2 ? "Universal" : prog.eligibility[0]}</span></div>
                        <div className={styles.detailItem}><span className={styles.detailLabel}>Cost</span><span className={styles.detailValue} style={{ color: prog.tuition === 0 ? "#10b981" : "inherit" }}>{prog.tuition === 0 ? "Free" : `$${prog.tuition.toLocaleString()}`}</span></div>
                      </div>
                      <div className={styles.tags}>
                        {prog.tags.slice(0, 3).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                      </div>
                      <button className={styles.viewDetailsBtn} onClick={() => setSelectedProgram(prog)}><Sparkles size={18} /> View Details</button>
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