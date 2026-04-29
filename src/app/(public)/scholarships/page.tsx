"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, MapPin, Award, ChevronDown, Filter, Globe, GraduationCap, Coins, FlaskConical, UserCheck, Monitor } from "lucide-react";

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

const scholarshipsData: Scholarship[] = [
  {
    id: "s1", title: "Knight-Hennessy Scholars (Stanford)", provider: "Stanford University", location: "USA", coverage: "Full Ride",
    degreeLevel: ["Postgraduate"], deadline: "October 2025", amount: 90000, tags: ["Stanford", "Innovation", "Leadership"],
    fields: ["Leadership", "STEM", "Humanities", "Business"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Knight-Hennessy Scholars is the largest fully endowed scholarship program in the world.",
    apply_link: "https://knight-hennessy.stanford.edu/", featured: true
  },
  {
    id: "s2", title: "Fulbright Foreign Student Program", provider: "U.S. Department of State", location: "USA", coverage: "Full Ride",
    degreeLevel: ["Master's", "Ph.D."], deadline: "October 2025", amount: 80000, tags: ["International", "Prestigious"],
    fields: ["STEM", "Humanities", "Medicine", "Arts", "Business"], eligibility: ["International"], format: "Offline",
    description: "Flagship US government exchange program for international students to study in the USA.",
    apply_link: "https://foreign.fulbrightonline.org/", featured: true
  },
  {
    id: "s3", title: "Schwarzman Scholars", provider: "Schwarzman Scholars Foundation", location: "China (Tsinghua)", coverage: "Full Ride",
    degreeLevel: ["Master's"], deadline: "September 2025", amount: 75000, tags: ["China", "Global Affairs", "Leadership"],
    fields: ["Humanities", "Business", "Leadership"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "Designed to prepare the next generation of global leaders.",
    apply_link: "https://www.schwarzmanscholars.org/", featured: true
  },
  {
    id: "s4", title: "Rhodes Scholarship", provider: "Rhodes Trust", location: "UK (Oxford)", coverage: "Full Ride",
    degreeLevel: ["Postgraduate"], deadline: "August 2025", amount: 70000, tags: ["Oxford", "UK", "Prestigious"],
    fields: ["STEM", "Humanities", "Medicine", "Arts", "Business"], eligibility: ["International", "Domestic"], format: "Offline",
    description: "The Rhodes Scholarship is the oldest and perhaps most prestigious international scholarship program.",
    apply_link: "https://www.rhodeshouse.ox.ac.uk/", featured: true
  },
  {
    id: "s10", title: "Google Europe Students with Disabilities", provider: "Google", location: "Europe", coverage: "Grant",
    degreeLevel: ["Undergraduate", "Master's"], deadline: "Variable", amount: 7000, tags: ["Diversity", "STEM"],
    fields: ["STEM"], eligibility: ["International", "Domestic"], format: "Universal",
    apply_link: "https://buildyourfuture.withgoogle.com/scholarships/"
  }
];

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("");
  const [tempSearch, setTempSearch] = useState("");
  const [sort, setSort] = useState("amount_desc");
  const [selectedSchol, setSelectedSchol] = useState<Scholarship | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
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

  const locations = useMemo(() => ["Any Location", ...Array.from(new Set(scholarshipsData.map(s => s.location))).sort()], []);
  const fieldOptions = ["STEM", "Medicine", "Business", "Humanities", "Arts", "Leadership", "Environment"];
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
  }, [search, location, coverage, levels, activeFields, eligibility, formats, sort]);

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

      <main id="mainContent" style={{ paddingTop: "80px", minHeight: "100vh", background: "#0f172a" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", marginBottom: "1rem", fontWeight: 800 }}>Global Scholarships</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: "1.2rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Filter through {scholarshipsData.length} prestigious scholarships mapped from the BraineX Master Resource Guide.
            </motion.p>
            
            <div className={styles.searchBox}>
              <Search style={{ color: "#10b981", opacity: 0.5 }} size={20} />
              <input 
                type="text" 
                placeholder="Search scholarships by provider, country, or major..." 
                className={styles.searchInput} 
                value={tempSearch} 
                onChange={e => setTempSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && setSearch(tempSearch)}
              />
              <button className={styles.searchBtn} onClick={() => setSearch(tempSearch)}>Search</button>
            </div>
          </div>
        </section>

        <section style={{ background: "rgba(15, 23, 42, 0.4)" }}>
          <div className={`container ${styles.layout}`}>
            
            <div style={{ maxWidth: "1280px", width: "100%", margin: "0 auto" }}>
              <div className={styles.filterBar} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <div className={styles.filterBarLeft}>
                  <Filter size={18} style={{ color: "#10b981" }} />
                  <span className={styles.filterBarTitle}>
                    Filter {activeFiltersCount > 0 && <span className={styles.filterCount} style={{ background: "#10b981" }}>{activeFiltersCount}</span>}
                  </span>
                </div>
                <ChevronDown size={20} style={{ transform: isFilterOpen ? "rotate(180deg)" : "none", transition: "0.3s", color: "#64748b" }} />
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

              <div className={styles.grid} style={{ marginTop: "2rem" }}>
                <AnimatePresence>
                  {filtered.map((schol, index) => (
                    <motion.div key={schol.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.iconCircle} style={{ background: "white", padding: "6px" }}>
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