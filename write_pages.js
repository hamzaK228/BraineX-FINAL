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
  { v: \"university\", l: \"University Degree\", icon: \"🎓\" },
  { v: \"summer\", l: \"Summer Program\", icon: \"☀️\" },
  { v: \"research\", l: \"Research\", icon: \"🔬\" },
  { v: \"internship\", l: \"Internship\", icon: \"💼\" },
  { v: \"online\", l: \"Online/Certificate\", icon: \"💻\" }
];

const FIELDS = [
  { v: \"stem\", l: \"STEM\", icon: \"⚗️\" },
  { v: \"medicine\", l: \"Medicine\", icon: \"🏥\" },
  { v: \"business\", l: \"Business\", icon: \"📊\" },
  { v: \"humanities\", l: \"Humanities\", icon: \"📖\" },
  { v: \"arts\", l: \"Arts & Design\", icon: \"🎨\" },
  { v: \"environment\", l: \"Environment\", icon: \"🌿\" }
];

const LEVELS = [
  { v: \"high_school\", l: \"High School\" },
  { v: \"undergraduate\", l: \"Undergraduate\" },
  { v: \"graduate\", l: \"Graduate\" }
];

const MODES = [\"On-Campus\", \"Online\", \"Hybrid\"];

export default function ProgramsPage() {
  const [search, setSearch] = useState(\"\");
  const [sort, setSort] = useState(\"featured\");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [modes, setModes] = useState<string[]>([]);
  const [country, setCountry] = useState(\"\");
  const [tuitionMax, setTuitionMax] = useState(80000);
  const [openSections, setOpenSections] = useState<string[]>([\"category\", \"field\", \"level\", \"mode\", \"tuition\"]);
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
    else saveItem({ id: prog.id, title: prog.title, type: \"Program\", source: prog.university, image: prog.image });
  };

  const activeFilters = useMemo(() => {
    const f: Array<{ label: string; remove: () => void }> = [];
    categories.forEach(c => { const found = CATEGORIES.find(x => x.v === c); f.push({ label: found?.l ?? c, remove: () => setCategories(p => p.filter(x => x !== c)) }); });
    fields.forEach(c => { const found = FIELDS.find(x => x.v === c); f.push({ label: found?.l ?? c, remove: () => setFields(p => p.filter(x => x !== c)) }); });
    levels.forEach(c => { const found = LEVELS.find(x => x.v === c); f.push({ label: found?.l ?? c, remove: () => setLevels(p => p.filter(x => x !== c)) }); });
    modes.forEach(c => f.push({ label: c, remove: () => setModes(p => p.filter(x => x !== c)) }));
    if (country) f.push({ label: country, remove: () => setCountry(\"\") });
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
      if (sort === \"featured\") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      if (sort === \"tuition_asc\") return a.tuition - b.tuition;
      if (sort === \"tuition_desc\") return b.tuition - a.tuition;
      if (sort === \"name_asc\") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [search, sort, categories, fields, levels, modes, country, tuitionMax]);

  const clearAll = () => { setCategories([]); setFields([]); setLevels([]); setModes([]); setCountry(\"\"); setTuitionMax(80000); setSearch(\"\"); };

  const catColor = (cat: string) => ({ university: \"badgeCategory\", summer: \"badgeSummer\", research: \"badgeResearch\", internship: \"badgeInternship\", online: \"badgeCategory\" }[cat] || \"badgeCategory\");

  return (
    <>
      <PublicHeader />
      {selectedProgram && (
        <InfoModal
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          title={selectedProgram.title}
          subtitle={selectedProgram.university}
          icon=\"🎓\"
          image={selectedProgram.image || \"https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200\"}
          description={selectedProgram.description}
          specialFeatures={selectedProgram.special_features}
          stats={[
            { label: \"Duration\", value: selectedProgram.duration },
            { label: \"Tuition\", value: selectedProgram.tuition === 0 ? \"Free\" : \`$\${selectedProgram.tuition.toLocaleString()}/yr\` },
            { label: \"Mode\", value: selectedProgram.studyMode }
          ]}
          tips={selectedProgram.noticable_facts || [\"Review prerequisites carefully.\", \"Prepare a strong Statement of Purpose.\", \"Apply for scholarships early.\"]}
          ctaLink={selectedProgram.apply_link}
          ctaLabel=\"Apply Now\"
        />
      )}
      <main id=\"mainContent\" role=\"main\" style={{ paddingTop: \"80px\", minHeight: \"100vh\" }}>
        <section className={styles.heroSection}>
          <div className=\"container\" style={{ maxWidth: \"800px\" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className=\"section-title gradient-text\" style={{ fontSize: \"clamp(2.2rem, 5vw, 4rem)\", marginBottom: \"1rem\", lineHeight: 1.1 }}>Academic Programs</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: \"1.15rem\", color: \"#94a3b8\", marginBottom: \"2rem\", fontWeight: 500 }}>
              Browse {programsData.length}+ programs — university degrees, summer programs, research, and internships from the world's top institutions.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={styles.searchBox}>
              <Search style={{ color: \"#6366f1\", flexShrink: 0 }} size={20} />
              <input type=\"text\" placeholder=\"Search programs, universities, or topics...\" className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch(\"\")} style={{ background: \"none\", border: \"none\", cursor: \"pointer\", color: \"#64748b\", display: \"flex\" }}><X size={18} /></button>}
            </motion.div>
            {activeFilters.length > 0 && (
              <div className={styles.activeFiltersBar}>
                {activeFilters.map((f, i) => (
                  <button key={i} className={styles.filterChip} onClick={f.remove}>{f.label}<X size={12} /></button>
                ))}
                <button className={styles.filterChip} onClick={clearAll} style={{ borderColor: \"rgba(239,68,68,0.3)\", color: \"#f87171\" }}>Clear all<X size={12} /></button>
              </div>
            )}
          </div>
        </section>

        <section style={{ background: \"rgba(15, 23, 42, 0.4)\" }}>
          <div className={\`container \${styles.layout}\`}>
            <button className={styles.mobileFilterToggle} onClick={() => setShowMobileFilters(p => !p)}>
              <span style={{ display: \"flex\", alignItems: \"center\", gap: \"0.5rem\" }}><Filter size={16} />Filters {activeFilters.length > 0 && <span style={{ background: \"#6366f1\", color: \"white\", borderRadius: \"20px\", padding: \"0.1rem 0.5rem\", fontSize: \"0.75rem\" }}>{activeFilters.length}</span>}</span>
              <ChevronDown size={18} style={{ transform: showMobileFilters ? \"rotate(180deg)\" : \"none\", transition: \"0.3s\" }} />
            </button>

            <aside className={styles.filterSidebar} style={{ display: showMobileFilters ? \"block\" : undefined }}>
              <div className={styles.filterSidebarHeader}>
                <span className={styles.filterSidebarTitle}><Filter size={14} />Filters</span>
                {activeFilters.length > 0 && <button className={styles.clearAllBtn} onClick={clearAll}>Clear all</button>}
              </div>

              {[
                { id: \"category\", label: \"Category\", options: CATEGORIES.map(c => ({ v: c.v, l: \`\${c.icon} \${c.l}\` })), state: categories, set: setCategories },
                { id: \"field\", label: \"Field of Study\", options: FIELDS.map(f => ({ v: f.v, l: \`\${f.icon} \${f.l}\` })), state: fields, set: setFields },
                { id: \"level\", label: \"Target Level\", options: LEVELS, state: levels, set: setLevels },
                { id: \"mode\", label: \"Study Mode\", options: MODES.map(m => ({ v: m, l: m })), state: modes, set: setModes },
              ].map(sec => (
                <div key={sec.id} className={styles.filterSection}>
                  <div className={styles.filterSectionHeader} onClick={() => togSection(sec.id)}>
                    <span className={styles.filterSectionTitle}>{sec.label}</span>
                    <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSections.includes(sec.id) ? styles.open : \"\"}\`} />
                  </div>
                  {openSections.includes(sec.id) && (
                    <div className={styles.checkGrid}>
                      {sec.options.map((o: any) => (
                        <label key={o.v} className={styles.checkLabel}>
                          <input type=\"checkbox\" checked={sec.state.includes(o.v)} onChange={() => tog(sec.state, o.v, sec.set as any)} />
                          {o.l}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSection(\"country\")}>
                  <span className={styles.filterSectionTitle}>Country</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSections.includes(\"country\") ? styles.open : \"\"}\`} />
                </div>
                {openSections.includes(\"country\") && (
                  <select className={styles.filterSelect} value={country} onChange={e => setCountry(e.target.value)}>
                    <option value=\"\">Any Country</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSection(\"tuition\")}>
                  <span className={styles.filterSectionTitle}>Max Tuition / Year</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSections.includes(\"tuition\") ? styles.open : \"\"}\`} />
                </div>
                {openSections.includes(\"tuition\") && (
                  <div className={styles.rangeWrapper}>
                    <div className={styles.rangeLabel}>
                      <span>$0</span>
                      <span className={styles.rangeValue}>{tuitionMax >= 80000 ? \"Any\" : \`$\${tuitionMax.toLocaleString()}\`}</span>
                    </div>
                    <input type=\"range\" className={styles.rangeInput} min={0} max={80000} step={1000} value={tuitionMax} onChange={e => setTuitionMax(parseInt(e.target.value))} />
                    <div style={{ fontSize: \"0.75rem\", color: \"#475569\" }}>$80,000+</div>
                  </div>
                )}
              </div>

              <div style={{ padding: \"1rem 1.25rem\", background: \"rgba(99, 102, 241, 0.07)\", borderTop: \"1px solid rgba(99, 102, 241, 0.15)\", fontSize: \"0.8rem\", color: \"#818cf8\", display: \"flex\", gap: \"0.6rem\", alignItems: \"flex-start\" }}>
                <Sparkles size={14} style={{ flexShrink: 0, marginTop: \"2px\" }} />
                <span>Register free to save programs, set deadlines, and track your applications.</span>
              </div>
            </aside>

            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>Showing <strong style={{ color: \"#f1f5f9\" }}>{filtered.length}</strong> of {programsData.length} programs</span>
                <div style={{ display: \"flex\", alignItems: \"center\", gap: \"0.75rem\" }}>
                  <span style={{ fontSize: \"0.8rem\", color: \"#64748b\", fontWeight: 600 }}>Sort:</span>
                  <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value=\"featured\">⭐ Featured First</option>
                    <option value=\"tuition_asc\">💰 Tuition: Low→High</option>
                    <option value=\"tuition_desc\">💰 Tuition: High→Low</option>
                    <option value=\"name_asc\">📝 Name A→Z</option>
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <Search size={48} style={{ color: \"#334155\", marginBottom: \"1.5rem\" }} />
                  <h3 style={{ color: \"#f1f5f9\", marginBottom: \"0.5rem\" }}>No programs found</h3>
                  <p style={{ color: \"#94a3b8\" }}>Try adjusting your filters or search term.</p>
                  <button onClick={clearAll} style={{ marginTop: \"1.5rem\", background: \"rgba(99, 102, 241, 0.1)\", border: \"1px solid rgba(99, 102, 241, 0.3)\", color: \"#a5b4fc\", padding: \"0.65rem 1.5rem\", borderRadius: \"10px\", fontWeight: 600, cursor: \"pointer\" }}>Clear All Filters</button>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filtered.map((prog, index) => {
                      const isFree = prog.tuition === 0;
                      const catLabel = CATEGORIES.find(c => c.v === prog.category);
                      return (
                        <motion.div key={prog.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ delay: Math.min(index * 0.04, 0.25) }} className={styles.card}>
                          <button className={\`\${styles.saveBtn} \${isSaved(prog.id) ? styles.saved : \"\"}\`} onClick={() => handleSave(prog)} aria-label=\"Save program\"><Bookmark size={16} fill={isSaved(prog.id) ? \"#6366f1\" : \"none\"} /></button>
                          <div className={styles.cardBadgeRow}>
                            <span className={\`\${styles.badge} \${styles[catColor(prog.category)]}\`}>{catLabel?.icon} {catLabel?.l}</span>
                            {isFree && <span className={\`\${styles.badge} \${styles.badgeFree}\`}>✓ Free</span>}
                            {prog.featured && <span className={\`\${styles.badge} \${styles.badgeFeatured}\`}>⭐ Featured</span>}
                          </div>
                          <div className={styles.cardHeader}>
                            {prog.logo ? (
                              <img src={prog.logo} alt={prog.university} className={styles.logo} onError={e => { e.currentTarget.src = \"https://cdn-icons-png.flaticon.com/512/8066/8066542.png\"; }} />
                            ) : (
                              <div className={styles.logoWrapper}>🎓</div>
                            )}
                            <div style={{ paddingRight: \"2rem\", flex: 1 }}>
                              <h3 className={styles.title}>{prog.title}</h3>
                              <div className={styles.university}>{prog.university}</div>
                              <div className={styles.locationRow}><MapPin size={12} />{prog.location}</div>
                            </div>
                          </div>
                          <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}><span className={styles.detailLabel}>Degree Level</span><span className={styles.detailValue}>{prog.degreeLevel}</span></div>
                            <div className={styles.detailItem}><span className={styles.detailLabel}>Study Mode</span><span className={styles.detailValue}>{prog.studyMode}</span></div>
                            <div className={styles.detailItem}><span className={styles.detailLabel}>Duration</span><span className={styles.detailValue}>{prog.duration}</span></div>
                            <div className={styles.detailItem}><span className={styles.detailLabel}>Tuition/Year</span><span className={styles.detailValue} style={{ color: isFree ? \"#34d399\" : \"inherit\" }}>{isFree ? \"Free 🎉\" : \`$\${prog.tuition.toLocaleString()}\`}</span></div>
                          </div>
                          <div className={styles.tags}>
                            {prog.tags.slice(0, 4).map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                          </div>
                          <div className={styles.cardActions}>
                            <button onClick={() => setSelectedProgram(prog)} className={styles.detailsBtn}><GraduationCap size={16} /> Details</button>
                            {prog.apply_link ? (
                              <a href={prog.apply_link} target=\"_blank\" rel=\"noopener noreferrer\" className={styles.applyBtn}>Apply <ArrowRight size={16} /></a>
                            ) : (
                              <Link href=\"/dashboard\" className={styles.applyBtn}>Apply <ArrowRight size={16} /></Link>
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

const scholarshipsContent = \`\"use client\";
import { useState, useMemo } from \"react\";
import { motion, AnimatePresence } from \"framer-motion\";
import Link from \"next/link\";
import { PublicHeader } from \"@/components/PublicHeader\";
import { InfoModal } from \"@/components/InfoModal\";
import styles from \"./page.module.css\";
import { Search, MapPin, Award, Calendar, Sparkles, ArrowRight, Bookmark, Filter, ChevronDown, X } from \"lucide-react\";
import { useSaved } from \"@/context/SavedContext\";

type Scholarship = {
  id: string; title: string; provider: string; location: string; coverage: string;
  degreeLevel: string[]; deadline: string; amount: number; tags: string[]; fields: string[];
  description?: string; special_features?: string[]; noticable_facts?: string[];
  apply_link?: string; featured?: boolean;
};

const scholarshipsData: Scholarship[] = [
  {
    id: \"s1\", title: \"Fulbright Foreign Student Program\", provider: \"U.S. Department of State\", location: \"USA\", coverage: \"Full Ride\",
    degreeLevel: [\"Master's\", \"Ph.D.\"], deadline: \"Oct 2025\", amount: 80000, tags: [\"International\", \"Prestigious\", \"All Fields\"],
    fields: [\"stem\", \"humanities\", \"business\", \"arts\", \"environment\", \"medicine\"],
    description: \"Flagship US government exchange program increasing mutual understanding. Covers tuition, living, and health insurance.\",
    special_features: [\"Full Tuition & Living\", \"Health Insurance\", \"Cultural Activities\"],
    noticable_facts: [\"160+ countries\", \"8,000 grants/year\", \"62 Nobel laureate alumni\"], apply_link: \"https://foreign.fulbrightonline.org/\", featured: true
  },
  {
    id: \"s2\", title: \"Chevening Scholarships\", provider: \"UK Government (FCDO)\", location: \"UK\", coverage: \"Full Ride\",
    degreeLevel: [\"Master's\"], deadline: \"Nov 2025\", amount: 45000, tags: [\"Leadership\", \"UK\", \"Government\"],
    fields: [\"stem\", \"humanities\", \"business\", \"environment\"],
    description: \"UK government awards for future global leaders. Covers tuition, monthly stipend, and return airfare.\",
    special_features: [\"Full Tuition\", \"Monthly Stipend\", \"Return Airfare\", \"Networking Events\"],
    noticable_facts: [\"Focus on leadership potential\", \"1-year Master's only\", \"Must return home 2 years after\"], apply_link: \"https://www.chevening.org/apply/\", featured: true
  }
];

const FIELDS = [{ v: \"stem\", l: \"⚗️ STEM\" }, { v: \"medicine\", l: \"🏥 Medicine\" }, { v: \"business\", l: \"📊 Business\" }, { v: \"humanities\", l: \"📖 Humanities\" }, { v: \"arts\", l: \"🎨 Arts\" }, { v: \"environment\", l: \"🌿 Environment\" }];
const LEVELS = [\"Bachelor's\", \"Master's\", \"Ph.D.\", \"Postgraduate\", \"All Levels\"];

export default function ScholarshipsPage() {
  const [search, setSearch] = useState(\"\");
  const [sort, setSort] = useState(\"amount_desc\");
  const [sel, setSel] = useState<Scholarship | null>(null);
  const [fields, setFields] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [location, setLocation] = useState(\"\");
  const [amountMin, setAmountMin] = useState(0);
  const [fullRideOnly, setFullRideOnly] = useState(false);
  const [openSec, setOpenSec] = useState<string[]>([\"field\", \"level\", \"amount\"]);
  const [showMob, setShowMob] = useState(false);
  const { saveItem, removeItem, isSaved } = useSaved();

  const LOCATIONS = useMemo(() => Array.from(new Set(scholarshipsData.map(s => s.location))).sort(), []);

  const togSec = (id: string) => setOpenSec(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const togArr = (arr: string[], val: string, set: any) => set((p: string[]) => p.includes(val) ? p.filter((x: string) => x !== val) : [...p, val]);
  const handleSave = (s: Scholarship) => { if (isSaved(s.id)) removeItem(s.id); else saveItem({ id: s.id, title: s.title, type: \"Scholarship\", source: s.provider }); };

  const activeFilters = useMemo(() => {
    const f: Array<{ label: string; remove: () => void }> = [];
    fields.forEach(v => { const found = FIELDS.find(x => x.v === v); f.push({ label: found?.l ?? v, remove: () => setFields(p => p.filter(x => x !== v)) }); });
    levels.forEach(v => f.push({ label: v, remove: () => setLevels(p => p.filter(x => x !== v)) }));
    if (location) f.push({ label: location, remove: () => setLocation(\"\") });
    if (amountMin > 0) f.push({ label: \`≥$\${amountMin.toLocaleString()}\`, remove: () => setAmountMin(0) });
    if (fullRideOnly) f.push({ label: \"Full Ride Only\", remove: () => setFullRideOnly(false) });
    return f;
  }, [fields, levels, location, amountMin, fullRideOnly]);

  const clearAll = () => { setFields([]); setLevels([]); setLocation(\"\"); setAmountMin(0); setFullRideOnly(false); setSearch(\"\"); };

  const filtered = useMemo(() => {
    let r = scholarshipsData;
    if (search) { const s = search.toLowerCase(); r = r.filter(x => x.title.toLowerCase().includes(s) || x.provider.toLowerCase().includes(s) || x.tags.some(t => t.toLowerCase().includes(s))); }
    if (fields.length > 0) r = r.filter(x => fields.some(f => x.fields.includes(f)));
    if (levels.length > 0) r = r.filter(x => levels.some(l => x.degreeLevel.includes(l)));
    if (location) r = r.filter(x => x.location === location);
    if (amountMin > 0) r = r.filter(x => x.amount >= amountMin);
    if (fullRideOnly) r = r.filter(x => x.coverage === \"Full Ride\");
    return [...r].sort((a, b) => {
      if (sort === \"amount_desc\") return b.amount - a.amount;
      if (sort === \"amount_asc\") return a.amount - b.amount;
      if (sort === \"name_asc\") return a.title.localeCompare(b.title);
      if (sort === \"featured\") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
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
          icon=\"💰\"
          image=\"https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=1200\"
          description={sel.description}
          specialFeatures={sel.special_features}
          stats={[
            { label: \"Coverage\", value: sel.coverage },
            { label: \"Est. Value\", value: \`~$\${sel.amount.toLocaleString()}\` },
            { label: \"Deadline\", value: sel.deadline }
          ]}
          tips={sel.noticable_facts || [\"Start at least 6 months early.\"]}
          ctaLink={sel.apply_link}
          ctaLabel=\"Apply Now\"
        />
      )}
      <main id=\"mainContent\" role=\"main\" style={{ paddingTop: \"80px\", minHeight: \"100vh\" }}>
        <section className={styles.heroSection}>
          <div className=\"container\" style={{ maxWidth: \"800px\" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className=\"section-title gradient-text\" style={{ fontSize: \"clamp(2.2rem, 5vw, 4rem)\", marginBottom: \"1rem\", lineHeight: 1.1 }}>Global Scholarships</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: \"1.15rem\", color: \"#94a3b8\", marginBottom: \"2rem\", fontWeight: 500 }}>
              Discover {scholarshipsData.length} scholarships, grants, and fellowships — from full rides at Oxford to funded research at CERN.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={styles.searchBox}>
              <Search style={{ color: \"#10b981\", flexShrink: 0 }} size={20} />
              <input type=\"text\" placeholder=\"Search by name, provider, country, or keyword...\" className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch(\"\")} style={{ background: \"none\", border: \"none\", cursor: \"pointer\", color: \"#64748b\", display: \"flex\" }}><X size={18} /></button>}
            </motion.div>
            {activeFilters.length > 0 && (<div className={styles.activeFiltersBar}>{activeFilters.map((f, i) => <button key={i} className={styles.filterChip} onClick={f.remove}>{f.label}<X size={12} /></button>)}<button className={styles.filterChip} onClick={clearAll} style={{ borderColor: \"rgba(239, 68, 68, 0.3)\", color: \"#f87171\" }}>Clear all<X size={12} /></button></div>)}
          </div>
        </section>
        <section style={{ background: \"rgba(15, 23, 42, 0.4)\" }}>
          <div className={\`container \${styles.layout}\`}>
            <button className={styles.mobileFilterToggle} onClick={() => setShowMob(p => !p)}>
              <span style={{ display: \"flex\", alignItems: \"center\", gap: \"0.5rem\" }}><Filter size={16} />Filters{activeFilters.length > 0 && <span style={{ background: \"#10b981\", color: \"white\", borderRadius: \"20px\", padding: \"0.1rem 0.5rem\", fontSize: \"0.75rem\" }}>{activeFilters.length}</span>}</span>
              <ChevronDown size={18} style={{ transform: showMob ? \"rotate(180deg)\" : \"none\", transition: \"0.3s\" }} />
            </button>
            <aside className={styles.filterSidebar} style={{ display: showMob ? \"block\" : undefined }}>
              <div className={styles.filterSidebarHeader}>
                <span className={styles.filterSidebarTitle}><Filter size={14} />Filters</span>
                {activeFilters.length > 0 && <button className={styles.clearAllBtn} onClick={clearAll}>Clear all</button>}
              </div>
              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec(\"field\")}>
                  <span className={styles.filterSectionTitle}>Field of Study</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes(\"field\") ? styles.open : \"\"}\`} />
                </div>
                {openSec.includes(\"field\") && (<div className={styles.checkGrid}>{FIELDS.map(f => <label key={f.v} className={styles.checkLabel}><input type=\"checkbox\" checked={fields.includes(f.v)} onChange={() => togArr(fields, f.v, setFields)} />{f.l}</label>)}</div>)}
              </div>
              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec(\"level\")}>
                  <span className={styles.filterSectionTitle}>Degree Level</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes(\"level\") ? styles.open : \"\"}\`} />
                </div>
                {openSec.includes(\"level\") && (<div className={styles.checkGrid}>{LEVELS.map(l => <label key={l} className={styles.checkLabel}><input type=\"checkbox\" checked={levels.includes(l)} onChange={() => togArr(levels, l, setLevels)} />{l}</label>)}</div>)}
              </div>
              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec(\"location\")}>
                  <span className={styles.filterSectionTitle}>Study Location</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes(\"location\") ? styles.open : \"\"}\`} />
                </div>
                {openSec.includes(\"location\") && (<select className={styles.filterSelect} value={location} onChange={e => setLocation(e.target.value)}><option value=\"\">Any Location</option>{LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}</select>)}
              </div>
              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec(\"amount\")}>
                  <span className={styles.filterSectionTitle}>Minimum Value</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes(\"amount\") ? styles.open : \"\"}\`} />
                </div>
                {openSec.includes(\"amount\") && (<div className={styles.rangeWrapper}><div className={styles.rangeLabel}><span>$0</span><span className={styles.rangeValue}>$\${amountMin.toLocaleString()}+</span></div><input type=\"range\" className={styles.rangeInput} min={0} max={90000} step={5000} value={amountMin} onChange={e => setAmountMin(parseInt(e.target.value))} /></div>)}
              </div>
              <div className={styles.filterSection} style={{ borderBottom: \"none\" }}>
                <label className={styles.checkLabel} style={{ cursor: \"pointer\" }}><input type=\"checkbox\" checked={fullRideOnly} onChange={e => setFullRideOnly(e.target.checked)} style={{ accentColor: \"#10b981\" }} /><span style={{ fontWeight: 700, color: \"#34d399\" }}>✓ Full Ride Only</span></label>
              </div>
              <div style={{ padding: \"1rem 1.25rem\", background: \"rgba(16, 185, 129, 0.07)\", borderTop: \"1px solid rgba(16, 185, 129, 0.15)\", fontSize: \"0.8rem\", color: \"#6ee7b7\", display: \"flex\", gap: \"0.6rem\", alignItems: \"flex-start\" }}>
                <Sparkles size={14} style={{ flexShrink: 0, marginTop: \"2px\" }} /><span>Register free to save scholarships and track your applications.</span>
              </div>
            </aside>
            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>Showing <strong style={{ color: \"#f1f5f9\" }}>{filtered.length}</strong> of {scholarshipsData.length} scholarships</span>
                <div style={{ display: \"flex\", alignItems: \"center\", gap: \"0.75rem\" }}>
                  <span style={{ fontSize: \"0.8rem\", color: \"#64748b\", fontWeight: 600 }}>Sort:</span>
                  <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value=\"featured\">⭐ Featured First</option>
                    <option value=\"amount_desc\">💰 Highest Value</option>
                    <option value=\"amount_asc\">💰 Lowest Value</option>
                    <option value=\"name_asc\">📝 Name A→Z</option>
                  </select>
                </div>
              </div>
              {filtered.length === 0 ? (
                <div className={styles.emptyState}><Search size={48} style={{ color: \"#334155\", marginBottom: \"1.5rem\" }} /><h3 style={{ color: \"#f1f5f9\", marginBottom: \"0.5rem\" }}>No scholarships found</h3><p style={{ color: \"#94a3b8\" }}>Try adjusting your filters.</p><button onClick={clearAll} style={{ marginTop: \"1.5rem\", background: \"rgba(16, 185, 129, 0.1)\", border: \"1px solid rgba(16, 185, 129, 0.3)\", color: \"#6ee7b7\", padding: \"0.65rem 1.5rem\", borderRadius: \"10px\", fontWeight: 600, cursor: \"pointer\" }}>Clear Filters</button></div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filtered.map((schol, i) => (
                      <motion.div key={schol.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ delay: Math.min(i * 0.04, 0.25) }} className={styles.card}>
                        <button className={\`\${styles.saveBtn} \${isSaved(schol.id) ? styles.saved : \"\"}\`} onClick={() => handleSave(schol)}><Bookmark size={16} fill={isSaved(schol.id) ? \"#10b981\" : \"none\"} /></button>
                        <div className={styles.cardBadgeRow}>
                          <span className={\`\${styles.badge} \${schol.coverage === \"Full Ride\" ? styles.badgeFullRide : styles.badgePartial}\`}>{schol.coverage === \"Full Ride\" ? \"🏆 Full Ride\" : \"💛 Partial\"}</span>
                          {schol.featured && <span className={\`\${styles.badge} \${styles.badgeFeatured}\`}>⭐ Featured</span>}
                        </div>
                        <div className={styles.cardHeader}>
                          <div className={styles.logoWrapper}>💰</div>
                          <div style={{ paddingRight: \"2rem\", flex: 1 }}>
                            <h3 className={styles.title}>{schol.title}</h3>
                            <div className={styles.provider}>{schol.provider}</div>
                            <div className={styles.locationRow}><MapPin size={12} />Study in: {schol.location}</div>
                          </div>
                        </div>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Coverage</span><span className={styles.detailValue} style={{ color: schol.coverage === \"Full Ride\" ? \"#34d399\" : \"#e2e8f0\" }}>{schol.coverage}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Est. Value</span><span className={styles.detailValue}>~$\${schol.amount.toLocaleString()}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Deadline</span><span className={styles.detailValue} style={{ color: \"#ef4444\" }}>{schol.deadline}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Level</span><span className={styles.detailValue}>{schol.degreeLevel.join(\", \")}</span></div>
                        </div>
                        <div className={styles.tags}>{schol.tags.slice(0, 4).map(t => <span key={t} className={styles.tag}>{t}</span>)}</div>
                        <div className={styles.cardActions}>
                          <button onClick={() => setSel(schol)} className={styles.detailsBtn}><Award size={16} /> Details</button>
                          {schol.apply_link ? <a href={schol.apply_link} target=\"_blank\" rel=\"noopener noreferrer\" className={styles.applyBtn}>Apply <ArrowRight size={16} /></a> : <Link href=\"/dashboard\" className={styles.applyBtn}>Apply <ArrowRight size={16} /></Link>}
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

const fieldsContent = \`\"use client\";
import { useState, useMemo } from \"react\";
import { motion, AnimatePresence } from \"framer-motion\";
import { PublicHeader } from \"@/components/PublicHeader\";
import { InfoModal } from \"@/components/InfoModal\";
import Link from \"next/link\";
import styles from \"./page.module.css\";
import { Search, Brain, Briefcase, TrendingUp, Sparkles, ArrowRight, BookOpen, Microscope, Globe, Palette, Users, DollarSign, GraduationCap, Heart, Filter, ChevronDown, X } from \"lucide-react\";

type Field = { id: number; category: string; icon: string; title: string; desc: string; salaryNum: number; salary: string; growth: number; growthStr: string; demand: string; topUnis: string; special_features?: string[]; noticable_facts?: string[]; image?: string; resources?: Array<{ label: string; url: string }>; };

const fieldsData: Field[] = [
  {
    id: 1, category: \"stem\", icon: \"💻\", title: \"Computer Science\", desc: \"The study of computation, algorithms, and information systems. Covers AI, cybersecurity, distributed systems, and software engineering. The backbone of the digital age.\",
    salaryNum: 120, salary: \"$120k\", growth: 15, growthStr: \"15%\", demand: \"Very High\", topUnis: \"MIT, Stanford, CMU\",
    image: \"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800\",
    special_features: [\"Artificial Intelligence & Machine Learning\", \"Cybersecurity & Cryptography\", \"Cloud Computing & DevOps\", \"Quantum Computing Research\"],
    noticable_facts: [\"Highest starting salaries among all fields\", \"Remote-friendly with global demand\", \"500,000+ unfilled US positions\", \"Fastest growing field in education\"],
    resources: [{ label: \"PathwaysToScience — CS REUs\", url: \"https://pathwaystoscience.org\" }, { label: \"NSF REU Search\", url: \"https://nsf.gov/crssprgm/reu\" }, { label: \"Congressional App Challenge\", url: \"https://www.congressionalappchallenge.us\" }]
  },
  {
    id: 2, category: \"business\", icon: \"📊\", title: \"Business Administration\", desc: \"Strategic management of business operations, organizational leadership, and decision-making. Covers marketing, operations, HR, and corporate strategy.\",
    salaryNum: 90, salary: \"$90k\", growth: 8, growthStr: \"8%\", demand: \"High\", topUnis: \"Wharton, HBS, INSEAD\",
    image: \"https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800\",
    special_features: [\"Strategic Management\", \"Entrepreneurship & Startups\", \"Supply Chain & Operations\", \"Digital Transformation\"],
    noticable_facts: [\"MBA is most popular graduate degree globally\", \"Versatile across every industry\", \"Strong alumni networks\", \"High C-suite potential\"],
    resources: [{ label: \"M&TSI Penn (Engineering+Business)\", url: \"https://upenn.edu/m-tsi\" }, { label: \"NSLC Leadership Programs\", url: \"https://nslcleaders.org\" }, { label: \"Jack Kent Cooke Scholarship\", url: \"https://www.jkcf.org\" }]
  }
];

const CATS = [{ v: \"all\", l: \"All Fields\", icon: <Globe size={16} /> }, { v: \"stem\", l: \"STEM\", icon: <Microscope size={16} /> }, { v: \"business\", l: \"Business\", icon: <Briefcase size={16} /> }, { v: \"health\", l: \"Health\", icon: <Heart size={16} /> }, { v: \"creative\", l: \"Creative\", icon: <Palette size={16} /> }, { v: \"humanities\", l: \"Humanities\", icon: <BookOpen size={16} /> }];
const DEMANDS = [\"Very High\", \"High\", \"Moderate\", \"Growing\"];
const CAT_COLORS: Record<string, string> = { stem: \"#6366f1\", business: \"#f59e0b\", creative: \"#ec4899\", health: \"#10b981\", humanities: \"#8b5cf6\" };
const DEMAND_CLS: Record<string, string> = { [\"Very High\"]: styles.demandVH, [\"High\"]: styles.demandH, [\"Moderate\"]: styles.demandM, [\"Growing\"]: styles.demandG };

export default function FieldsPage() {
  const [sel, setSel] = useState<Field | null>(null);
  const [search, setSearch] = useState(\"\");
  const [catFilter, setCatFilter] = useState(\"all\");
  const [demands, setDemands] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState(0);
  const [minGrowth, setMinGrowth] = useState(0);
  const [sort, setSort] = useState(\"default\");
  const [openSec, setOpenSec] = useState<string[]>([\"demand\", \"salary\", \"growth\"]);
  const [showMob, setShowMob] = useState(false);

  const togSec = (id: string) => setOpenSec(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const togDemand = (d: string) => setDemands(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const hasFilters = demands.length > 0 || minSalary > 0 || minGrowth > 0 || catFilter !== \"all\" || search;
  const clearAll = () => { setDemands([]); setMinSalary(0); setMinGrowth(0); setCatFilter(\"all\"); setSearch(\"\"); };

  const filtered = useMemo(() => {
    let r = fieldsData;
    if (catFilter !== \"all\") r = r.filter(f => f.category === catFilter);
    if (search) { const s = search.toLowerCase(); r = r.filter(f => f.title.toLowerCase().includes(s) || f.desc.toLowerCase().includes(s)); }
    if (demands.length > 0) r = r.filter(f => demands.includes(f.demand));
    if (minSalary > 0) r = r.filter(f => f.salaryNum >= minSalary);
    if (minGrowth > 0) r = r.filter(f => f.growth >= minGrowth);
    return [...r].sort((a, b) => {
      if (sort === \"salary_desc\") return b.salaryNum - a.salaryNum;
      if (sort === \"growth_desc\") return b.growth - a.growth;
      if (sort === \"name_asc\") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [catFilter, search, demands, minSalary, minGrowth, sort]);

  return (
    <>
      <PublicHeader />
      {sel && (<InfoModal isOpen={!!sel} onClose={() => setSel(null)} title={sel.title} subtitle={\`\${sel.category.toUpperCase()} Field\`} icon={sel.icon} image={sel.image} description={sel.desc} specialFeatures={sel.special_features} stats={[{ label: \"Avg Salary\", value: sel.salary }, { label: \"Job Growth\", value: sel.growthStr }, { label: \"Demand\", value: sel.demand }]} tips={sel.noticable_facts || []} ctaLink=\"/roadmaps\" ctaLabel=\"View Career Roadmap\" />)}
      <main id=\"mainContent\" role=\"main\" style={{ paddingTop: \"80px\", minHeight: \"100vh\" }}>
        <section className={styles.heroSection}>
          <div className=\"container\" style={{ maxWidth: \"800px\" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className=\"section-title gradient-text\" style={{ fontSize: \"clamp(2.2rem, 5vw, 4rem)\", marginBottom: \"1rem\", lineHeight: 1.1 }}>Explore {fieldsData.length} Academic Fields</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: \"1.15rem\", color: \"#94a3b8\", marginBottom: \"2rem\", fontWeight: 500 }}>Discover disciplines with salary data, growth projections, top universities, and curated resources to find your perfect path.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={styles.searchBox}>
              <Search style={{ color: \"#8b5cf6\", flexShrink: 0 }} size={20} />
              <input type=\"text\" placeholder=\"Search fields and disciplines...\" className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch(\"\")} style={{ background: \"none\", border: \"none\", cursor: \"pointer\", color: \"#64748b\", display: \"flex\" }}><X size={18} /></button>}
            </motion.div>
          </div>
        </section>

        <section className={styles.statsBar}>
          <div className=\"container\">
            <div style={{ display: \"grid\", gridTemplateColumns: \"repeat(auto-fit, minmax(180px, 1fr))\", gap: \"1.25rem\", textAlign: \"center\" }}>
              {[{ icon: <BookOpen size={18} />, label: \"Academic Fields\", value: \`\${fieldsData.length}\`, color: \"#8b5cf6\" }, { icon: <TrendingUp size={18} />, label: \"Avg Growth\", value: \"10.2%\", color: \"#10b981\" }, { icon: <DollarSign size={18} />, label: \"Avg Salary\", value: \"$97k\", color: \"#f59e0b\" }, { icon: <Users size={18} />, label: \"Categories\", value: \"5\", color: \"#ec4899\" }].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className={styles.statCard}>
                  <div style={{ display: \"flex\", alignItems: \"center\", justifyContent: \"center\", gap: \"0.5rem\", color: s.color, marginBottom: \"0.35rem\" }}>{s.icon}<span style={{ fontSize: \"1.5rem\", fontWeight: \"800\", color: \"#f8fafc\" }}>{s.value}</span></div>
                  <span style={{ fontSize: \"0.75rem\", color: \"#94a3b8\", fontWeight: 600, textTransform: \"uppercase\", letterSpacing: \"1px\" }}>{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: \"rgba(15, 23, 42, 0.4)\" }}>
          <div className={\`container \${styles.layout}\`}>
            <button className={styles.mobileFilterToggle} onClick={() => setShowMob(p => !p)}>
              <span style={{ display: \"flex\", alignItems: \"center\", gap: \"0.5rem\" }}><Filter size={16} />Filters {(demands.length > 0 || minSalary > 0 || minGrowth > 0) && <span style={{ background: \"#8b5cf6\", color: \"white\", borderRadius: \"20px\", padding: \"0.1rem 0.5rem\", fontSize: \"0.75rem\" }}>{demands.length + (minSalary > 0 ? 1 : 0) + (minGrowth > 0 ? 1 : 0)}</span>}</span>
              <ChevronDown size={18} style={{ transform: showMob ? \"rotate(180deg)\" : \"none\", transition: \"0.3s\" }} />
            </button>
            <aside className={styles.filterSidebar} style={{ display: showMob ? \"block\" : undefined }}>
              <div className={styles.filterSidebarHeader}>
                <span className={styles.filterSidebarTitle}><Filter size={14} />Filters</span>
                {hasFilters && <button className={styles.clearAllBtn} onClick={clearAll}>Clear all</button>}
              </div>
              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec(\"category\")}>
                  <span className={styles.filterSectionTitle}>Category</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes(\"category\") ? styles.open : \"\"}\`} />
                </div>
                {openSec.includes(\"category\") && (
                  <div className={styles.checkGrid}>
                    {CATS.slice(1).map(c => (
                      <label key={c.v} className={styles.checkLabel}>
                        <input type=\"checkbox\" checked={catFilter === c.v} onChange={() => setCatFilter(p => p === c.v ? \"all\" : c.v)} style={{ accentColor: \"#8b5cf6\" }} />
                        {c.l} <span style={{ fontSize: \"0.72rem\", color: \"#475569\", marginLeft: \"auto\" }}>{fieldsData.filter(f => f.category === c.v).length}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec(\"demand\")}>
                  <span className={styles.filterSectionTitle}>Job Demand</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes(\"demand\") ? styles.open : \"\"}\`} />
                </div>
                {openSec.includes(\"demand\") && (
                  <div className={styles.checkGrid}>
                    {DEMANDS.map(d => (
                      <label key={d} className={styles.checkLabel}>
                        <input type=\"checkbox\" checked={demands.includes(d)} onChange={() => togDemand(d)} style={{ accentColor: \"#8b5cf6\" }} />
                        <span className={\`\${styles.demandBadge} \${DEMAND_CLS[d]}\`}>{d}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.filterSection}>
                <div className={styles.filterSectionHeader} onClick={() => togSec(\"salary\")}>
                  <span className={styles.filterSectionTitle}>Min Avg Salary</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes(\"salary\") ? styles.open : \"\"}\`} />
                </div>
                {openSec.includes(\"salary\") && (
                  <div className={styles.rangeWrapper}>
                    <div className={styles.rangeLabel}><span>$0</span><span className={styles.rangeValue}>$\${minSalary}k+</span></div>
                    <input type=\"range\" className={styles.rangeInput} min={0} max={130} step={10} value={minSalary} onChange={e => setMinSalary(parseInt(e.target.value))} />
                    <div style={{ fontSize: \"0.75rem\", color: \"#475569\" }}>Up to $130k avg</div>
                  </div>
                )}
              </div>
              <div className={styles.filterSection} style={{ borderBottom: \"none\" }}>
                <div className={styles.filterSectionHeader} onClick={() => togSec(\"growth\")}>
                  <span className={styles.filterSectionTitle}>Min Job Growth</span>
                  <ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes(\"growth\") ? styles.open : \"\"}\`} />
                </div>
                {openSec.includes(\"growth\") && (
                  <div className={styles.rangeWrapper}>
                    <div className={styles.rangeLabel}><span>0%</span><span className={styles.rangeValue}>{minGrowth}%+</span></div>
                    <input type=\"range\" className={styles.rangeInput} min={0} max={22} step={1} value={minGrowth} onChange={e => setMinGrowth(parseInt(e.target.value))} />
                    <div style={{ fontSize: \"0.75rem\", color: \"#475569\" }}>Up to 22% growth</div>
                  </div>
                )}
              </div>
            </aside>

            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>Showing <strong style={{ color: \"#f1f5f9\" }}>{filtered.length}</strong> of {fieldsData.length} fields</span>
                <div style={{ display: \"flex\", alignItems: \"center\", gap: \"0.75rem\" }}>
                  <span style={{ fontSize: \"0.8rem\", color: \"#64748b\", fontWeight: 600 }}>Sort:</span>
                  <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
                    <option value=\"default\">📋 Default</option>
                    <option value=\"salary_desc\">💰 Highest Salary</option>
                    <option value=\"growth_desc\">📈 Fastest Growing</option>
                    <option value=\"name_asc\">📝 Name A→Z</option>
                  </select>
                </div>
              </div>
              <div className={styles.filterTabs}>
                {CATS.map(tab => (
                  <button key={tab.v} className={\`\${styles.filterTab} \${catFilter === tab.v ? styles.active : \"\"}\`} onClick={() => setCatFilter(tab.v)}>
                    {tab.icon} {tab.l}
                    {catFilter !== tab.v && <span style={{ background: \"rgba(255, 255, 255, 0.1)\", padding: \"0.1rem 0.4rem\", borderRadius: \"8px\", fontSize: \"0.7rem\", fontWeight: \"bold\" }}>{tab.v === \"all\" ? fieldsData.length : fieldsData.filter(f => f.category === tab.v).length}</span>}
                  </button>
                ))}
              </div>
              {filtered.length === 0 ? (
                <div className={styles.emptyState}><Search size={48} style={{ color: \"#334155\", marginBottom: \"1.5rem\" }} /><h3 style={{ color: \"#f1f5f9\", marginBottom: \"0.5rem\" }}>No fields found</h3><p style={{ color: \"#94a3b8\" }}>Try adjusting your filters.</p><button onClick={clearAll} style={{ marginTop: \"1.5rem\", background: \"rgba(139, 92, 246, 0.1)\", border: \"1px solid rgba(139, 92, 246, 0.3)\", color: \"#c4b5fd\", padding: \"0.65rem 1.5rem\", borderRadius: \"10px\", fontWeight: 600, cursor: \"pointer\" }}>Clear Filters</button></div>
              ) : (
                <motion.div layout className={styles.fieldsGrid}>
                  <AnimatePresence>
                    {filtered.map((field, i) => {
                      const color = CAT_COLORS[field.category] || \"#6366f1\";
                      return (
                        <motion.div key={field.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04 }} className={styles.fieldCard}>
                          <div className={styles.fieldHeader}>
                            <div className={styles.fieldIconWrapper} style={{ background: \`\${color}15\`, borderColor: \`\${color}30\` }}>{field.icon}</div>
                            <div>
                              <h3 className={styles.fieldTitle}>{field.title}</h3>
                              <span className={styles.fieldCat} style={{ color }}>{field.category}</span>
                            </div>
                          </div>
                          <p className={styles.fieldDesc}>{field.desc}</p>
                          <div className={styles.uniRow}><GraduationCap size={13} color=\"#64748b\" /><span style={{ fontSize: \"0.8rem\", color: \"#cbd5e1\", fontWeight: 500 }}>{field.topUnis}</span></div>
                          <div className={styles.fieldStatsRow}>
                            <div className={styles.miniStat}><TrendingUp size={13} color=\"#10b981\" /><span>{field.growthStr} Growth</span></div>
                            <div className={\`\${styles.demandBadge} \${DEMAND_CLS[field.demand]}\`}>{field.demand}</div>
                          </div>
                          {field.resources && field.resources.length > 0 && (
                            <div style={{ marginBottom: \"1rem\", padding: \"0.7rem\", background: \"rgba(139, 92, 246, 0.06)\", borderRadius: \"10px\", border: \"1px solid rgba(139, 92, 246, 0.12)\" }}>
                              <div style={{ fontSize: \"0.68rem\", fontWeight: 700, textTransform: \"uppercase\", letterSpacing: \"0.06em\", color: \"#7c3aed\", marginBottom: \"0.4rem\" }}>Resources</div>
                              {field.resources.map((r, ri) => <a key={ri} href={r.url} target=\"_blank\" rel=\"noopener noreferrer\" style={{ display: \"flex\", alignItems: \"center\", gap: \"0.3rem\", fontSize: \"0.78rem\", color: \"#a78bfa\", textDecoration: \"none\", padding: \"0.15rem 0\", fontWeight: 500 }}><ArrowRight size={11} />{r.label}</a>)}
                            </div>
                          )}
                          <div className={styles.fieldFooter}>
                            <div className={styles.salaryInfo}><span className={styles.salaryLabel}>Avg Salary</span><span className={styles.salaryValue}>{field.salary}</span></div>
                            <button onClick={() => setSel(field)} className={styles.exploreBtn}>Explore <ArrowRight size={16} /></button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <section className={styles.pathwaysSection}>
          <div className=\"container\">
            <h2 className=\"section-title\" style={{ marginBottom: \"1rem\" }}>Trending Career Pathways</h2>
            <p style={{ textAlign: \"center\", color: \"#94a3b8\", marginBottom: \"3rem\", fontSize: \"1.05rem\" }}>The hottest career paths combining multiple academic disciplines</p>
            <div className={styles.pathwaysGrid}>
              {[
                { title: \"AI Architect\", desc: \"CS + Math + Ethics → Design the future of intelligence.\", icon: <Sparkles color=\"#fbbf24\" />, bg: \"https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400\" },
                { title: \"BioTech Innovator\", desc: \"Biology + CS + Business → Revolutionary drug discovery.\", icon: <Microscope color=\"#10b981\" />, bg: \"https://images.unsplash.com/photo-1504868584819-f8eec746dcc4?q=80&w=400\" },
                { title: \"Climate Tech Lead\", desc: \"Environmental Sci + Engineering + Policy → Save the planet.\", icon: <Globe color=\"#3b82f6\" />, bg: \"https://images.unsplash.com/photo-1473116763249-2faaef81ccda?q=80&w=400\" },
                { title: \"FinTech Founder\", desc: \"Finance + CS + Design → Reshape global banking.\", icon: <TrendingUp color=\"#f59e0b\" />, bg: \"https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=400\" }
              ].map((p, i) => (
                <div key={i} className={styles.pathwayCard} style={{ background: \`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.65)), url('\${p.bg}')\`, backgroundSize: \"cover\", backgroundPosition: \"center\" }}>
                  <div className={styles.pathwayContent}>{p.icon}<h3 style={{ color: \"white\", fontWeight: 700, margin: 0 }}>{p.title}</h3><p style={{ color: \"rgba(255, 255, 255, 0.75)\", fontSize: \"0.88rem\", margin: 0 }}>{p.desc}</p><Link href=\"/roadmaps\" className={styles.pathwayLink}>Explore Roadmap →</Link></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
\`;

fs.writeFileSync(path.join(__dirname, 'src/app/(public)/programs/page.tsx'), programsContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src/app/(public)/scholarships/page.tsx'), scholarshipsContent, 'utf8');
fs.writeFileSync(path.join(__dirname, 'src/app/(public)/fields/page.tsx'), fieldsContent, 'utf8');

console.log('All pages written successfully in UTF-8.');
