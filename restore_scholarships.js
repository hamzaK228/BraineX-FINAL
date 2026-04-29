const fs = require('fs');
const path = require('path');

const scholarshipsContent = `"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, MapPin, Award, Calendar, Sparkles, ArrowRight, Bookmark, Filter, ChevronDown, X, Globe, Briefcase, FlaskConical, BookOpen, Palette, Heart, GraduationCap, DollarSign } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

type Scholarship = {
  id: string; title: string; provider: string; location: string; coverage: string;
  degreeLevel: string[]; deadline: string; amount: number; tags: string[]; fields: string[];
  description?: string; special_features?: string[]; noticable_facts?: string[];
  apply_link?: string; featured?: boolean;
};

const scholarshipsData: Scholarship[] = [
  {
    id: "s1", title: "Fulbright Foreign Student Program", provider: "U.S. Department of State", location: "USA", coverage: "Full Ride",
    degreeLevel: ["Master's", "Ph.D."], deadline: "Oct 2025", amount: 80000, tags: ["International", "Prestigious", "All Fields"],
    fields: ["stem", "humanities", "business", "arts", "environment", "medicine"],
    description: "Flagship US government exchange program increasing mutual understanding. Covers tuition, living, and health insurance.",
    special_features: ["Full Tuition & Living", "Health Insurance", "Cultural Activities"],
    noticable_facts: ["160+ countries", "8,000 grants/year", "62 Nobel laureate alumni"], apply_link: "https://foreign.fulbrightonline.org/", featured: true
  },
  {
    id: "s2", title: "Chevening Scholarships", provider: "UK Government (FCDO)", location: "UK", coverage: "Full Ride",
    degreeLevel: ["Master's"], deadline: "Nov 2025", amount: 45000, tags: ["Leadership", "UK", "Government"],
    fields: ["stem", "humanities", "business", "environment"],
    description: "UK government awards for future global leaders. Covers tuition, monthly stipend, and return airfare.",
    special_features: ["Full Tuition", "Monthly Stipend", "Return Airfare", "Networking Events"],
    noticable_facts: ["Focus on leadership potential", "1-year Master's only", "Must return home 2 years after"], apply_link: "https://www.chevening.org/apply/", featured: true
  },
  {
    id: "s3", title: "Rhodes Scholarship", provider: "Rhodes Trust", location: "UK (Oxford)", country: "UK",
    coverage: "Full Ride", degreeLevel: ["Master's", "Ph.D."], deadline: "Oct 2025", amount: 95000, tags: ["Prestigious", "Oxford", "Leadership"],
    fields: ["stem", "humanities", "business", "arts", "medicine"],
    description: "Oldest and perhaps most prestigious international scholarship program.",
    special_features: ["Full Oxford Tuition", "Monthly Stipend", "Travel to/from Oxford"],
    noticable_facts: ["32 US Scholars per year", "Election based on academic excellence and character"], featured: true, apply_link: "https://www.rhodeshouse.ox.ac.uk/"
  },
  {
    id: "s4", title: "Gates Cambridge Scholarship", provider: "Bill & Melinda Gates Foundation", location: "UK (Cambridge)", country: "UK",
    coverage: "Full Ride", degreeLevel: ["Master's", "Ph.D."], deadline: "Dec 2025", amount: 90000, tags: ["Cambridge", "Leadership", "Research"],
    fields: ["stem", "humanities", "business", "medicine"],
    description: "Full-cost scholarships for postgraduate study in any subject at the University of Cambridge.",
    special_features: ["Full University Fees", "Maintenance Allowance", "Airfare"],
    noticable_facts: ["~80 scholarships awarded annually", "Global competition"], featured: true, apply_link: "https://www.gatescambridge.org/"
  },
  {
    id: "s5", title: "Erasmus+ Scholarship", provider: "European Union", location: "Multiple EU Countries", country: "EU",
    coverage: "Full Ride", degreeLevel: ["Master's"], deadline: "Varies", amount: 50000, tags: ["Europe", "International", "Cultural"],
    fields: ["stem", "humanities", "business", "arts", "environment"],
    description: "Funded master's programs involving study in at least two different European countries.",
    special_features: ["Tuition Paid", "Travel & Installation Costs", "Monthly Subsistence"],
    noticable_facts: ["Joint Degree award", "Study in 2+ countries"], featured: false, apply_link: "https://erasmus-plus.ec.europa.eu/"
  },
  {
    id: "s11", title: "CERN Summer Student Program", provider: "CERN", location: "Switzerland", coverage: "Full Ride",
    degreeLevel: ["Bachelor's", "Master's"], deadline: "Jan 2026", amount: 15000, tags: ["Physics", "STEM", "Prestigious"],
    fields: ["stem"],
    description: "Fully funded summer research at the world's largest particle physics lab.",
    special_features: ["Daily Stipend", "Travel Allowance", "Housing Provided"],
    noticable_facts: ["90 CHF/day allowance", "Work with world-class physicists"], apply_link: "https://home.cern/students", featured: true
  },
  {
    id: "s12", title: "DAAD WISE Program", provider: "DAAD Germany", location: "Germany", coverage: "Full Ride",
    degreeLevel: ["Bachelor's"], deadline: "Nov 2025", amount: 12000, tags: ["Germany", "STEM", "Research"],
    fields: ["stem"],
    description: "Working Internships in Science and Engineering for students from Indian IITs and other top universities.",
    special_features: ["Monthly Stipend", "Travel Subsidy", "Insurance"],
    noticable_facts: ["2-3 month research stay", "German research environment"], featured: false, apply_link: "https://www.daad.de/"
  }
];

const FIELDS = [
  { v: "stem", l: "STEM", icon: <FlaskConical size={14} /> },
  { v: "medicine", l: "Medicine", icon: <Heart size={14} /> },
  { v: "business", l: "Business", icon: <Briefcase size={14} /> },
  { v: "humanities", l: "Humanities", icon: <BookOpen size={14} /> },
  { v: "arts", l: "Arts", icon: <Palette size={14} /> },
  { v: "environment", l: "Environment", icon: <Globe size={14} /> }
];

const LEVELS = ["Bachelor's", "Master's", "Ph.D.", "Postgraduate", "All Levels"];

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("amount_desc");
  const [sel, setSel] = useState<Scholarship | null>(null);
  const [fields, setFields] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [amountMin, setAmountMin] = useState(0);
  const [fullRideOnly, setFullRideOnly] = useState(false);
  const [openSec, setOpenSec] = useState<string[]>(["field", "level", "amount"]);
  const [showMob, setShowMob] = useState(false);
  const { saveItem, removeItem, isSaved } = useSaved();

  const LOCATIONS = useMemo(() => Array.from(new Set(scholarshipsData.map(s => s.location))).sort(), []);

  const togSec = (id: string) => setOpenSec(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const togArr = (arr: string[], val: string, set: any) => set((p: string[]) => p.includes(val) ? p.filter((x: string) => x !== val) : [...p, val]);
  
  const handleSave = (s: Scholarship) => { 
    if (isSaved(s.id)) removeItem(s.id); 
    else saveItem({ id: s.id, title: s.title, type: "Scholarship", source: s.provider }); 
  };

  const activeFilters = useMemo(() => {
    const f: Array<{ label: string; remove: () => void }> = [];
    fields.forEach(v => { const found = FIELDS.find(x => x.v === v); f.push({ label: found?.v.toUpperCase() ?? v, remove: () => setFields(p => p.filter(x => x !== v)) }); });
    levels.forEach(v => f.push({ label: v, remove: () => setLevels(p => p.filter(x => x !== v)) }));
    if (location) f.push({ label: location, remove: () => setLocation("") });
    if (amountMin > 0) f.push({ label: \`≥$\${amountMin.toLocaleString()}\`, remove: () => setAmountMin(0) });
    if (fullRideOnly) f.push({ label: "Full Ride Only", remove: () => setFullRideOnly(false) });
    return f;
  }, [fields, levels, location, amountMin, fullRideOnly]);

  const clearAll = () => { setFields([]); setLevels([]); setLocation(""); setAmountMin(0); setFullRideOnly(false); setSearch(""); };

  const filtered = useMemo(() => {
    let r = scholarshipsData;
    if (search) { const s = search.toLowerCase(); r = r.filter(x => x.title.toLowerCase().includes(s) || x.provider.toLowerCase().includes(s) || x.tags.some(t => t.toLowerCase().includes(s))); }
    if (fields.length > 0) r = r.filter(x => fields.some(f => x.fields.includes(f)));
    if (levels.length > 0) r = r.filter(x => levels.some(l => x.degreeLevel.includes(l)));
    if (location) r = r.filter(x => x.location === location);
    if (amountMin > 0) r = r.filter(x => x.amount >= amountMin);
    if (fullRideOnly) r = r.filter(x => x.coverage === "Full Ride");
    return [...r].sort((a, b) => {
      if (sort === "amount_desc") return b.amount - a.amount;
      if (sort === "amount_asc") return a.amount - b.amount;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      if (sort === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });
  }, [search, sort, fields, levels, location, amountMin, fullRideOnly]);

  return (
    <>
      <PublicHeader />
      {sel && (
        <InfoModal
          isOpen={!!sel}
          onClose={() => setSel(null)}
          title={sel.title}
          subtitle={sel.provider}
          icon="💰"
          image="https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=1200"
          description={sel.description}
          specialFeatures={sel.special_features}
          stats={[
            { label: "Coverage", value: sel.coverage },
            { label: "Est. Value", value: \`~$\${sel.amount.toLocaleString()}\` },
            { label: "Deadline", value: sel.deadline }
          ]}
          tips={sel.noticable_facts || ["Start at least 6 months early.", "Get high quality recommendation letters.", "Tailor your essay to the provider goals."]}
          ctaLink={sel.apply_link}
          ctaLabel="Apply Now"
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", marginBottom: "1rem", lineHeight: 1.1 }}>Global Scholarships</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: "1.15rem", color: "#94a3b8", marginBottom: "2rem", fontWeight: 500 }}>
              Discover {scholarshipsData.length} scholarships, grants, and fellowships — from full rides at Oxford to funded research at CERN.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={styles.searchBox}>
              <Search style={{ color: "#10b981", flexShrink: 0 }} size={20} />
              <input type="text" placeholder="Search by name, provider, country, or keyword..." className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex" }}><X size={18} /></button>}
            </motion.div>
            {activeFilters.length > 0 && (
              <div className={styles.activeFiltersBar}>
                {activeFilters.map((f, i) => (
                  <button key={i} className={styles.filterChip} onClick={f.remove}>{f.label}<X size={12} /></button>
                ))}
                <button className={styles.filterChip} onClick={clearAll} style={{ borderColor: "rgba(239, 68, 68, 0.3)", color: "#f87171" }}>Clear all<X size={12} /></button>
              </div>
            )}
          </div>
        </section>

        <section style={{ background: "rgba(15, 23, 42, 0.4)" }}>
          <div className={\`container \${styles.layout}\`}>
            <button className={styles.mobileFilterToggle} onClick={() => setShowMob(p => !p)}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Filter size={16} />Filters {activeFilters.length > 0 && <span style={{ background: "#10b981", color: "white", borderRadius: "20px", padding: "0.1rem 0.5rem", fontSize: "0.75rem" }}>{activeFilters.length}</span>}</span>
              <ChevronDown size={18} style={{ transform: showMob ? "rotate(180deg)" : "none", transition: "0.3s" }} />
            </button>

            <aside className={styles.filterSidebar} style={{ display: showMob ? "block" : undefined }}>
              <div className={styles.filterSidebarHeader}>
                <span className={styles.filterSidebarTitle}><Filter size={14} />Filters</span>
                {activeFilters.length > 0 && <button className={styles.clearAllBtn} onClick={clearAll}>Clear all</button>}
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec("field")}>
                  <span className={styles.filterSectionTitle}>Field of Study</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes("field") ? styles.open : ""}\`} />
                </div>
                {openSec.includes("field") && (
                  <div className={styles.checkGrid}>
                    {FIELDS.map(f => (
                      <label key={f.v} className={styles.checkLabel}>
                        <input type="checkbox" checked={fields.includes(f.v)} onChange={() => togArr(fields, f.v, setFields)} />
                        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>{f.icon} {f.v.toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec("level")}>
                  <span className={styles.filterSectionTitle}>Degree Level</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes("level") ? styles.open : ""}\`} />
                </div>
                {openSec.includes("level") && (
                  <div className={styles.checkGrid}>
                    {LEVELS.map(l => (
                      <label key={l} className={styles.checkLabel}>
                        <input type="checkbox" checked={levels.includes(l)} onChange={() => togArr(levels, l, setLevels)} />
                        {l}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec("location")}>
                  <span className={styles.filterSectionTitle}>Study Location</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes("location") ? styles.open : ""}\`} />
                </div>
                {openSec.includes("location") && (
                  <select className={styles.filterSelect} value={location} onChange={e => setLocation(e.target.value)}>
                    <option value="">Any Location</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                )}
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec("amount")}>
                  <span className={styles.filterSectionTitle}>Minimum Value</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes("amount") ? styles.open : ""}\`} />
                </div>
                {openSec.includes("amount") && (
                  <div className={styles.rangeWrapper}>
                    <div className={styles.rangeLabel}>
                      <span>$0</span>
                      <span className={styles.rangeValue}>$\${amountMin.toLocaleString()}+</span>
                    </div>
                    <input type="range" className={styles.rangeInput} min={0} max={90000} step={5000} value={amountMin} onChange={e => setAmountMin(parseInt(e.target.value))} />
                  </div>
                )}
              </div>

              <div className={styles.filterSection} style={{ borderBottom: "none" }}>
                <label className={styles.checkLabel} style={{ cursor: "pointer" }}>
                  <input type="checkbox" checked={fullRideOnly} onChange={e => setFullRideOnly(e.target.checked)} style={{ accentColor: "#10b981" }} />
                  <span style={{ fontWeight: 700, color: "#34d399" }}>✓ Full Ride Only</span>
                </label>
              </div>

              <div style={{ padding: "1rem 1.25rem", background: "rgba(16, 185, 129, 0.07)", borderTop: "1px solid rgba(16, 185, 129, 0.15)", fontSize: "0.8rem", color: "#6ee7b7", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <Sparkles size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Register free to save scholarships and track your applications.</span>
              </div>
            </aside>

            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>Showing <strong style={{ color: "#f1f5f9" }}>{filtered.length}</strong> of {scholarshipsData.length} scholarships</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Sort:</span>
                  <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="featured">⭐ Featured First</option>
                    <option value="amount_desc">💰 Highest Value</option>
                    <option value="amount_asc">💰 Lowest Value</option>
                    <option value="name_asc">📝 Name A→Z</option>
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <Search size={48} style={{ color: "#334155", marginBottom: "1.5rem" }} />
                  <h3 style={{ color: "#f1f5f9", marginBottom: "0.5rem" }}>No scholarships found</h3>
                  <p style={{ color: "#94a3b8" }}>Try adjusting your filters.</p>
                  <button onClick={clearAll} style={{ marginTop: "1.5rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#6ee7b7", padding: "0.65rem 1.5rem", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>Clear Filters</button>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filtered.map((schol, i) => (
                      <motion.div key={schol.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ delay: Math.min(i * 0.04, 0.25) }} className={styles.card}>
                        <button className={\`\${styles.saveBtn} \${isSaved(schol.id) ? styles.saved : ""}\`} onClick={() => handleSave(schol)}><Bookmark size={16} fill={isSaved(schol.id) ? "#10b981" : "none"} /></button>
                        <div className={styles.cardBadgeRow}>
                          <span className={\`\${styles.badge} \${schol.coverage === "Full Ride" ? styles.badgeFullRide : styles.badgePartial}\`}>{schol.coverage === "Full Ride" ? "🏆 Full Ride" : "💛 Partial"}</span>
                          {schol.featured && <span className={\`\${styles.badge} \${styles.badgeFeatured}\`}>⭐ Featured</span>}
                        </div>
                        <div className={styles.cardHeader}>
                          <div className={styles.logoWrapper}><Award size={20} color="#10b981" /></div>
                          <div style={{ paddingRight: "2rem", flex: 1 }}>
                            <h3 className={styles.title}>{schol.title}</h3>
                            <div className={styles.provider}>{schol.provider}</div>
                            <div className={styles.locationRow}><MapPin size={12} />Study in: {schol.location}</div>
                          </div>
                        </div>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Coverage</span><span className={styles.detailValue} style={{ color: schol.coverage === "Full Ride" ? "#34d399" : "#e2e8f0" }}>{schol.coverage}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Est. Value</span><span className={styles.detailValue}>~$\${schol.amount.toLocaleString()}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Deadline</span><span className={styles.detailValue} style={{ color: "#ef4444" }}>{schol.deadline}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Level</span><span className={styles.detailValue}>{schol.degreeLevel.join(", ")}</span></div>
                        </div>
                        <div className={styles.tags}>{schol.tags.slice(0, 4).map(t => <span key={t} className={styles.tag}>{t}</span>)}</div>
                        <div className={styles.cardActions}>
                          <button onClick={() => setSel(schol)} className={styles.detailsBtn}><Award size={16} /> Details</button>
                          {schol.apply_link ? <a href={schol.apply_link} target="_blank" rel="noopener noreferrer" className={styles.applyBtn}>Apply <ArrowRight size={16} /></a> : <Link href="/dashboard" className={styles.applyBtn}>Apply <ArrowRight size={16} /></Link>}
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
\`;

fs.writeFileSync(path.join(process.cwd(), 'src/app/(public)/scholarships/page.tsx'), scholarshipsContent, 'utf8');
console.log('Scholarships page restored with rich content and proper encoding.');
