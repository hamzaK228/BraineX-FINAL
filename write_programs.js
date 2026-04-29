const fs = require('fs');
const path = require('path');

const programsContent = `"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, MapPin, GraduationCap, Sparkles, ArrowRight, Bookmark, Filter, ChevronDown, X, FlaskConical, Globe, Briefcase, Palette, Heart, BookOpen, Laptop, Building2 } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

type Program = {
  id: string; title: string; university: string; location: string; country: string;
  logo: string; image?: string; degreeLevel: string;
  category: "university" | "summer" | "research" | "internship" | "online";
  fields: string[]; studyMode: string; duration: string; tuition: number;
  targetLevel: string[]; tags: string[];
  description?: string; special_features?: string[]; noticable_facts?: string[];
  apply_link?: string; featured?: boolean;
};

const programsData: Program[] = [
  {
    id: "p1", title: "B.Sc. in Computer Science", university: "MIT", location: "Cambridge, USA", country: "USA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800",
    degreeLevel: "Bachelor's", category: "university", fields: ["stem"], studyMode: "On-Campus", duration: "4 Years", tuition: 57590,
    targetLevel: ["undergraduate"], tags: ["AI", "Software Engineering", "Algorithms"],
    description: "World-renowned CS program blending theory and practice. Students engage in groundbreaking research from day one.",
    special_features: ["UROP Research", "Robotics Lab", "Silicon Valley Internships"],
    noticable_facts: ["98% Employment Rate", "Access to MIT Media Lab"], featured: true
  },
  {
    id: "p2", title: "MBA in Global Business", university: "Harvard University", location: "Boston, USA", country: "USA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_University_shield.png/1024px-Harvard_University_shield.png",
    image: "https://images.unsplash.com/photo-1454165833767-027ffea9e772?q=80&w=800",
    degreeLevel: "Master's", category: "university", fields: ["business"], studyMode: "On-Campus", duration: "2 Years", tuition: 73440,
    targetLevel: ["graduate"], tags: ["Management", "Finance", "Leadership"],
    description: "Case-method MBA developing global leaders and strategic thinkers.",
    special_features: ["Case Method Learning", "Global Immersion", "Venture Competition"],
    noticable_facts: ["Most Fortune 500 CEOs", "100k+ Alumni Network"], featured: true
  },
  {
    id: "p11", title: "Lumiere Research Scholar Program", university: "Lumiere Education", location: "Online / Global", country: "Global",
    logo: "https://cdn-icons-png.flaticon.com/512/3135/3135810.png",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800",
    degreeLevel: "Summer", category: "summer", fields: ["stem", "humanities", "business", "arts"], studyMode: "Online", duration: "8-12 Weeks", tuition: 3950,
    targetLevel: ["high_school"], tags: ["Research", "Mentorship", "Publication", "Any Field"],
    description: "Pairs high schoolers with Harvard/Stanford/MIT PhD mentors for publishable research. The gold standard for pre-college research.",
    special_features: ["1-on-1 PhD Mentorship", "Publishable Paper", "Flexible Online"],
    noticable_facts: ["93% accepted to T20 universities", "Students published in real journals"], featured: true, apply_link: "https://lumiere.education/"
  },
  {
    id: "p12", title: "RSI — Research Science Institute", university: "MIT & CEE", location: "Cambridge, USA", country: "USA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800",
    degreeLevel: "Summer", category: "research", fields: ["stem"], studyMode: "On-Campus", duration: "6 Weeks", tuition: 0,
    targetLevel: ["high_school"], tags: ["STEM Research", "Free", "MIT Campus", "Competition"],
    description: "The most prestigious FREE summer science research for high school students worldwide. Held at MIT.",
    special_features: ["Entirely Free", "MIT Labs", "World-class Mentors", "Oral Presentations"],
    noticable_facts: ["Considered #1 summer STEM program", "~2% acceptance rate", "Alumni include Nobel laureates"], featured: true, apply_link: "https://www.cee.org/research-science-institute"
  },
  {
    id: "p13", title: "MIT PRIMES — Research in Mathematics", university: "Massachusetts Institute of Technology", location: "Cambridge, USA", country: "USA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800",
    degreeLevel: "Summer", category: "research", fields: ["stem"], studyMode: "Hybrid", duration: "12 Months", tuition: 0,
    targetLevel: ["high_school"], tags: ["Mathematics", "Research", "Free", "Competition"],
    description: "Free year-long research for mathematically talented high schoolers working with MIT faculty on cutting-edge math.",
    special_features: ["Free Program", "MIT Faculty Mentors", "Conference Presentations"],
    noticable_facts: ["Alumni won Regeneron STS", "Most competitive math research program"], apply_link: "https://math.mit.edu/research/highschool/primes/"
  },
  {
    id: "p21", title: "NSF REU — Research Experience for Undergraduates", university: "National Science Foundation", location: "USA (600+ Sites)", country: "USA",
    logo: "https://cdn-icons-png.flaticon.com/512/3135/3135810.png",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800",
    degreeLevel: "Summer", category: "research", fields: ["stem"], studyMode: "On-Campus", duration: "10 Weeks", tuition: 0,
    targetLevel: ["undergraduate"], tags: ["Research", "Paid", "STEM", "NSF", "Funded"],
    description: "600+ fully funded summer research placements at universities across the USA for undergraduate students.",
    special_features: ["Stipend Provided", "Housing Included", "600+ Sites Nationwide"],
    noticable_facts: ["Fully funded — stipend + housing", "Best research credential for grad school"], apply_link: "https://www.nsf.gov/crssprgm/reu/"
  }
];

const CATEGORIES = [
  { v: "university", l: "University Degree", icon: "🎓" },
  { v: "summer", l: "Summer Program", icon: "☀️" },
  { v: "research", l: "Research", icon: "🔬" },
  { v: "internship", l: "Internship", icon: "💼" },
  { v: "online", l: "Online/Certificate", icon: "💻" }
];

const FIELDS = [
  { v: "stem", l: "STEM", icon: "⚗️" },
  { v: "medicine", l: "Medicine", icon: "🏥" },
  { v: "business", l: "Business", icon: "📊" },
  { v: "humanities", l: "Humanities", icon: "📖" },
  { v: "arts", l: "Arts & Design", icon: "🎨" },
  { v: "environment", l: "Environment", icon: "🌿" }
];

const LEVELS = [
  { v: "high_school", l: "High School" },
  { v: "undergraduate", l: "Undergraduate" },
  { v: "graduate", l: "Graduate" }
];

const MODES = ["On-Campus", "Online", "Hybrid"];

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [modes, setModes] = useState<string[]>([]);
  const [country, setCountry] = useState("");
  const [tuitionMax, setTuitionMax] = useState(80000);
  const [openSections, setOpenSections] = useState<string[]>(["category", "field", "level", "mode", "tuition"]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { saveItem, removeItem, isSaved } = useSaved();

  const countries = useMemo(() => Array.from(new Set(programsData.map(p => p.country))).sort(), []);

  const tog = (arr: string[], val: string, set: React.Dispatch<React.SetStateAction<string[]>>) => {
    set(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };
  const togSection = (id: string) => {
    setOpenSections(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = (prog: Program) => {
    if (isSaved(prog.id)) removeItem(prog.id);
    else saveItem({ id: prog.id, title: prog.title, type: "Program", source: prog.university, image: prog.image });
  };

  const activeFilters = useMemo(() => {
    const f: Array<{ label: string; remove: () => void }> = [];
    categories.forEach(c => { const found = CATEGORIES.find(x => x.v === c); f.push({ label: found?.l ?? c, remove: () => setCategories(p => p.filter(x => x !== c)) }); });
    fields.forEach(c => { const found = FIELDS.find(x => x.v === c); f.push({ label: found?.l ?? c, remove: () => setFields(p => p.filter(x => x !== c)) }); });
    levels.forEach(c => { const found = LEVELS.find(x => x.v === c); f.push({ label: found?.l ?? c, remove: () => setLevels(p => p.filter(x => x !== c)) }); });
    modes.forEach(c => f.push({ label: c, remove: () => setModes(p => p.filter(x => x !== c)) }));
    if (country) f.push({ label: country, remove: () => setCountry("") });
    if (tuitionMax < 80000) f.push({ label: \`≤$\${tuitionMax.toLocaleString()}/yr\`, remove: () => setTuitionMax(80000) });
    return f;
  }, [categories, fields, levels, modes, country, tuitionMax]);

  const filtered = useMemo(() => {
    let r = programsData;
    if (search) { const s = search.toLowerCase(); r = r.filter(p => p.title.toLowerCase().includes(s) || p.university.toLowerCase().includes(s) || p.tags.some(t => t.toLowerCase().includes(s))); }
    if (categories.length > 0) r = r.filter(p => categories.includes(p.category));
    if (fields.length > 0) r = r.filter(p => fields.some(f => p.fields.includes(f)));
    if (levels.length > 0) r = r.filter(p => levels.some(l => p.targetLevel.includes(l)));
    if (modes.length > 0) r = r.filter(p => modes.includes(p.studyMode));
    if (country) r = r.filter(p => p.country === country);
    r = r.filter(p => p.tuition <= tuitionMax);
    return [...r].sort((a, b) => {
      if (sort === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sort === "tuition_asc") return a.tuition - b.tuition;
      if (sort === "tuition_desc") return b.tuition - a.tuition;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [search, sort, categories, fields, levels, modes, country, tuitionMax]);

  const clearAll = () => { setCategories([]); setFields([]); setLevels([]); setModes([]); setCountry(""); setTuitionMax(80000); setSearch(""); };

  const catColor = (cat: string) => ({ university: "badgeCategory", summer: "badgeSummer", research: "badgeResearch", internship: "badgeInternship", online: "badgeCategory" }[cat] || "badgeCategory");

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
          image={selectedProgram.image || "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200"}
          description={selectedProgram.description}
          specialFeatures={selectedProgram.special_features}
          stats={[
            { label: "Duration", value: selectedProgram.duration },
            { label: "Tuition", value: selectedProgram.tuition === 0 ? "Free" : \`$\${selectedProgram.tuition.toLocaleString()}/yr\` },
            { label: "Mode", value: selectedProgram.studyMode }
          ]}
          tips={selectedProgram.noticable_facts || ["Review prerequisites carefully.", "Prepare a strong Statement of Purpose.", "Apply for scholarships early."]}
          ctaLink={selectedProgram.apply_link}
          ctaLabel="Apply Now"
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", marginBottom: "1rem", lineHeight: 1.1 }}>Academic Programs</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: "1.15rem", color: "#94a3b8", marginBottom: "2rem", fontWeight: 500 }}>
              Browse {programsData.length}+ programs — university degrees, summer programs, research, and internships from the world's top institutions.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={styles.searchBox}>
              <Search style={{ color: "#6366f1", flexShrink: 0 }} size={20} />
              <input type="text" placeholder="Search programs, universities, or topics..." className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex" }}><X size={18} /></button>}
            </motion.div>
            {activeFilters.length > 0 && (
              <div className={styles.activeFiltersBar}>
                {activeFilters.map((f, i) => (
                  <button key={i} className={styles.filterChip} onClick={f.remove}>{f.label}<X size={12} /></button>
                ))}
                <button className={styles.filterChip} onClick={clearAll} style={{ borderColor: "rgba(239,68,68,0.3)", color: "#f87171" }}>Clear all<X size={12} /></button>
              </div>
            )}
          </div>
        </section>

        <section style={{ background: "rgba(15, 23, 42, 0.4)" }}>
          <div className={\`container \${styles.layout}\`}>
            <button className={styles.mobileFilterToggle} onClick={() => setShowMobileFilters(p => !p)}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Filter size={16} />Filters {activeFilters.length > 0 && <span style={{ background: "#6366f1", color: "white", borderRadius: "20px", padding: "0.1rem 0.5rem", fontSize: "0.75rem" }}>{activeFilters.length}</span>}</span>
              <ChevronDown size={18} style={{ transform: showMobileFilters ? "rotate(180deg)" : "none", transition: "0.3s" }} />
            </button>

            <aside className={styles.filterSidebar} style={{ display: showMobileFilters ? "block" : undefined }}>
              <div className={styles.filterSidebarHeader}>
                <span className={styles.filterSidebarTitle}><Filter size={14} />Filters</span>
                {activeFilters.length > 0 && <button className={styles.clearAllBtn} onClick={clearAll}>Clear all</button>}
              </div>

              {[
                { id: "category", label: "Category", options: CATEGORIES.map(c => ({ v: c.v, l: \`\${c.icon} \${c.l}\` })), state: categories, set: setCategories },
                { id: "field", label: "Field of Study", options: FIELDS.map(f => ({ v: f.v, l: \`\${f.icon} \${f.l}\` })), state: fields, set: setFields },
                { id: "level", label: "Target Level", options: LEVELS, state: levels, set: setLevels },
                { id: "mode", label: "Study Mode", options: MODES.map(m => ({ v: m, l: m })), state: modes, set: setModes },
              ].map(sec => (
                <div key={sec.id} className={styles.filterSection}>
                  <div className={styles.filterSectionHeader} onClick={() => togSection(sec.id)}>
                    <span className={styles.filterSectionTitle}>{sec.label}</span>
                    <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSections.includes(sec.id) ? styles.open : ""}\`} />
                  </div>
                  {openSections.includes(sec.id) && (
                    <div className={styles.checkGrid}>
                      {sec.options.map((o: any) => (
                        <label key={o.v} className={styles.checkLabel}>
                          <input type="checkbox" checked={sec.state.includes(o.v)} onChange={() => tog(sec.state, o.v, sec.set as any)} />
                          {o.l}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSection("country")}>
                  <span className={styles.filterSectionTitle}>Country</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSections.includes("country") ? styles.open : ""}\`} />
                </div>
                {openSections.includes("country") && (
                  <select className={styles.filterSelect} value={country} onChange={e => setCountry(e.target.value)}>
                    <option value="">Any Country</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSection("tuition")}>
                  <span className={styles.filterSectionTitle}>Max Tuition / Year</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSections.includes("tuition") ? styles.open : ""}\`} />
                </div>
                {openSections.includes("tuition") && (
                  <div className={styles.rangeWrapper}>
                    <div className={styles.rangeLabel}>
                      <span>$0</span>
                      <span className={styles.rangeValue}>{tuitionMax >= 80000 ? "Any" : \`$\${tuitionMax.toLocaleString()}\`}</span>
                    </div>
                    <input type="range" className={styles.rangeInput} min={0} max={80000} step={1000} value={tuitionMax} onChange={e => setTuitionMax(parseInt(e.target.value))} />
                    <div style={{ fontSize: "0.75rem", color: "#475569" }}>$80,000+</div>
                  </div>
                )}
              </div>

              <div style={{ padding: "1rem 1.25rem", background: "rgba(99, 102, 241, 0.07)", borderTop: "1px solid rgba(99, 102, 241, 0.15)", fontSize: "0.8rem", color: "#818cf8", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <Sparkles size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Register free to save programs, set deadlines, and track your applications.</span>
              </div>
            </aside>

            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>Showing <strong style={{ color: "#f1f5f9" }}>{filtered.length}</strong> of {programsData.length} programs</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Sort:</span>
                  <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="featured">⭐ Featured First</option>
                    <option value="tuition_asc">💰 Tuition: Low→High</option>
                    <option value="tuition_desc">💰 Tuition: High→Low</option>
                    <option value="name_asc">📝 Name A→Z</option>
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <Search size={48} style={{ color: "#334155", marginBottom: "1.5rem" }} />
                  <h3 style={{ color: "#f1f5f9", marginBottom: "0.5rem" }}>No programs found</h3>
                  <p style={{ color: "#94a3b8" }}>Try adjusting your filters or search term.</p>
                  <button onClick={clearAll} style={{ marginTop: "1.5rem", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.3)", color: "#a5b4fc", padding: "0.65rem 1.5rem", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>Clear All Filters</button>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filtered.map((prog, index) => {
                      const isFree = prog.tuition === 0;
                      const catLabel = CATEGORIES.find(c => c.v === prog.category);
                      return (
                        <motion.div key={prog.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ delay: Math.min(index * 0.04, 0.25) }} className={styles.card}>
                          <button className={\`\${styles.saveBtn} \${isSaved(prog.id) ? styles.saved : ""}\`} onClick={() => handleSave(prog)} aria-label="Save program"><Bookmark size={16} fill={isSaved(prog.id) ? "#6366f1" : "none"} /></button>
                          <div className={styles.cardBadgeRow}>
                            <span className={\`\${styles.badge} \${styles[catColor(prog.category)]}\`}>{catLabel?.icon} {catLabel?.l}</span>
                            {isFree && <span className={\`\${styles.badge} \${styles.badgeFree}\`}>✓ Free</span>}
                            {prog.featured && <span className={\`\${styles.badge} \${styles.badgeFeatured}\`}>⭐ Featured</span>}
                          </div>
                          <div className={styles.cardHeader}>
                            {prog.logo ? (
                              <img src={prog.logo} alt={prog.university} className={styles.logo} onError={e => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/8066/8066542.png"; }} />
                            ) : (
                              <div className={styles.logoWrapper}>🎓</div>
                            )}
                            <div style={{ paddingRight: "2rem", flex: 1 }}>
                              <h3 className={styles.title}>{prog.title}</h3>
                              <div className={styles.university}>{prog.university}</div>
                              <div className={styles.locationRow}><MapPin size={12} />{prog.location}</div>
                            </div>
                          </div>
                          <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}><span className={styles.detailLabel}>Degree Level</span><span className={styles.detailValue}>{prog.degreeLevel}</span></div>
                            <div className={styles.detailItem}><span className={styles.detailLabel}>Study Mode</span><span className={styles.detailValue}>{prog.studyMode}</span></div>
                            <div className={styles.detailItem}><span className={styles.detailLabel}>Duration</span><span className={styles.detailValue}>{prog.duration}</span></div>
                            <div className={styles.detailItem}><span className={styles.detailLabel}>Tuition/Year</span><span className={styles.detailValue} style={{ color: isFree ? "#34d399" : "inherit" }}>{isFree ? "Free 🎉" : \`$\${prog.tuition.toLocaleString()}\`}</span></div>
                          </div>
                          <div className={styles.tags}>
                            {prog.tags.slice(0, 4).map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                          </div>
                          <div className={styles.cardActions}>
                            <button onClick={() => setSelectedProgram(prog)} className={styles.detailsBtn}><GraduationCap size={16} /> Details</button>
                            {prog.apply_link ? (
                              <a href={prog.apply_link} target="_blank" rel="noopener noreferrer" className={styles.applyBtn}>Apply <ArrowRight size={16} /></a>
                            ) : (
                              <Link href="/dashboard" className={styles.applyBtn}>Apply <ArrowRight size={16} /></Link>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
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

fs.writeFileSync(path.join(__dirname, 'src/app/(public)/programs/page.tsx'), programsContent, 'utf8');
console.log('Programs page written successfully.');
