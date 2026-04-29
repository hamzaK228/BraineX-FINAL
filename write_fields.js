const fs = require('fs');
const path = require('path');

const fieldsContent = `"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, Brain, Briefcase, TrendingUp, Sparkles, ArrowRight, BookOpen, Microscope, Globe, Palette, Users, DollarSign, GraduationCap, Heart, Filter, ChevronDown, X } from "lucide-react";

type Field = { id: number; category: string; icon: string; title: string; desc: string; salaryNum: number; salary: string; growth: number; growthStr: string; demand: string; topUnis: string; special_features?: string[]; noticable_facts?: string[]; image?: string; resources?: Array<{ label: string; url: string }>; };

const fieldsData: Field[] = [
  {
    id: 1, category: "stem", icon: "💻", title: "Computer Science", desc: "The study of computation, algorithms, and information systems. Covers AI, cybersecurity, distributed systems, and software engineering.",
    salaryNum: 120, salary: "$120k", growth: 15, growthStr: "15%", demand: "Very High", topUnis: "MIT, Stanford, CMU",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800",
    special_features: ["Artificial Intelligence", "Cybersecurity", "Cloud Computing"],
    noticable_facts: ["Highest starting salaries", "Remote-friendly", "500k+ unfilled US positions"],
    resources: [{ label: "PathwaysToScience — CS REUs", url: "https://pathwaystoscience.org" }]
  },
  {
    id: 2, category: "business", icon: "📊", title: "Business Administration", desc: "Strategic management of business operations, organizational leadership, and decision-making.",
    salaryNum: 90, salary: "$90k", growth: 8, growthStr: "8%", demand: "High", topUnis: "Wharton, HBS, INSEAD",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    special_features: ["Strategic Management", "Entrepreneurship", "Digital Transformation"],
    noticable_facts: ["MBA is most popular graduate degree", "Versatile across industries"],
    resources: [{ label: "NSLC Leadership Programs", url: "https://nslcleaders.org" }]
  }
];

const CATS = [{ v: "all", l: "All Fields", icon: <Globe size={16} /> }, { v: "stem", l: "STEM", icon: <Microscope size={16} /> }, { v: "business", l: "Business", icon: <Briefcase size={16} /> }, { v: "health", l: "Health", icon: <Heart size={16} /> }, { v: "creative", l: "Creative", icon: <Palette size={16} /> }, { v: "humanities", l: "Humanities", icon: <BookOpen size={16} /> }];
const DEMANDS = ["Very High", "High", "Moderate", "Growing"];
const CAT_COLORS: Record<string, string> = { stem: "#6366f1", business: "#f59e0b", creative: "#ec4899", health: "#10b981", humanities: "#8b5cf6" };
const DEMAND_CLS: Record<string, string> = { ["Very High"]: styles.demandVH, ["High"]: styles.demandH, ["Moderate"]: styles.demandM, ["Growing"]: styles.demandG };

export default function FieldsPage() {
  const [sel, setSel] = useState<Field | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [demands, setDemands] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState(0);
  const [minGrowth, setMinGrowth] = useState(0);
  const [sort, setSort] = useState("default");
  const [openSec, setOpenSec] = useState<string[]>(["demand", "salary", "growth"]);
  const [showMob, setShowMob] = useState(false);

  const togSec = (id: string) => setOpenSec(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const togDemand = (d: string) => setDemands(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const hasFilters = demands.length > 0 || minSalary > 0 || minGrowth > 0 || catFilter !== "all" || search;
  const clearAll = () => { setDemands([]); setMinSalary(0); setMinGrowth(0); setCatFilter("all"); setSearch(""); };

  const filtered = useMemo(() => {
    let r = fieldsData;
    if (catFilter !== "all") r = r.filter(f => f.category === catFilter);
    if (search) { const s = search.toLowerCase(); r = r.filter(f => f.title.toLowerCase().includes(s) || f.desc.toLowerCase().includes(s)); }
    if (demands.length > 0) r = r.filter(f => demands.includes(f.demand));
    if (minSalary > 0) r = r.filter(f => f.salaryNum >= minSalary);
    if (minGrowth > 0) r = r.filter(f => f.growth >= minGrowth);
    return [...r].sort((a, b) => {
      if (sort === "salary_desc") return b.salaryNum - a.salaryNum;
      if (sort === "growth_desc") return b.growth - a.growth;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [catFilter, search, demands, minSalary, minGrowth, sort]);

  return (
    <>
      <PublicHeader />
      {sel && (<InfoModal isOpen={!!sel} onClose={() => setSel(null)} title={sel.title} subtitle={\`\${sel.category.toUpperCase()} Field\`} icon={sel.icon} image={sel.image} description={sel.desc} specialFeatures={sel.special_features} stats={[{ label: "Avg Salary", value: sel.salary }, { label: "Job Growth", value: sel.growthStr }, { label: "Demand", value: sel.demand }]} tips={sel.noticable_facts || []} ctaLink="/roadmaps" ctaLabel="View Career Roadmap" />)}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", marginBottom: "1rem", lineHeight: 1.1 }}>Explore {fieldsData.length} Academic Fields</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: "1.15rem", color: "#94a3b8", marginBottom: "2rem", fontWeight: 500 }}>Discover disciplines with salary data, growth projections, top universities, and curated resources.</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className={styles.searchBox}>
              <Search style={{ color: "#8b5cf6", flexShrink: 0 }} size={20} />
              <input type="text" placeholder="Search fields and disciplines..." className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", display: "flex" }}><X size={18} /></button>}
            </motion.div>
          </div>
        </section>

        <section style={{ background: "rgba(15, 23, 42, 0.4)" }}>
          <div className={\`container \${styles.layout}\`}>
            <button className={styles.mobileFilterToggle} onClick={() => setShowMob(p => !p)}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Filter size={16} />Filters {(demands.length > 0 || minSalary > 0 || minGrowth > 0) && <span style={{ background: "#8b5cf6", color: "white", borderRadius: "20px", padding: "0.1rem 0.5rem", fontSize: "0.75rem" }}>{demands.length + (minSalary > 0 ? 1 : 0) + (minGrowth > 0 ? 1 : 0)}</span>}</span>
              <ChevronDown size={18} style={{ transform: showMob ? "rotate(180deg)" : "none", transition: "0.3s" }} />
            </button>
            <aside className={styles.filterSidebar} style={{ display: showMob ? "block" : undefined }}>
              <div className={styles.filterSidebarHeader}><span className={styles.filterSidebarTitle}><Filter size={14} />Filters</span>{hasFilters && <button className={styles.clearAllBtn} onClick={clearAll}>Clear all</button>}</div>
              <div className={styles.filterSection}><div className={styles.filterSectionHeader} onClick={() => togSec("category")}><span className={styles.filterSectionTitle}>Category</span><ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes("category") ? styles.open : ""}\`} /></div>{openSec.includes("category") && (<div className={styles.checkGrid}>{CATS.slice(1).map(c => (<label key={c.v} className={styles.checkLabel}><input type="checkbox" checked={catFilter === c.v} onChange={() => setCatFilter(p => p === c.v ? "all" : c.v)} style={{ accentColor: "#8b5cf6" }} />{c.l}</label>))}</div>)}</div>
              <div className={styles.filterSection}><div className={styles.filterSectionHeader} onClick={() => togSec("demand")}><span className={styles.filterSectionTitle}>Job Demand</span><ChevronDown size={14} className={\`\${styles.filterChevron} \${openSec.includes("demand") ? styles.open : ""}\`} /></div>{openSec.includes("demand") && (<div className={styles.checkGrid}>{DEMANDS.map(d => (<label key={d} className={styles.checkLabel}><input type="checkbox" checked={demands.includes(d)} onChange={() => togDemand(d)} style={{ accentColor: "#8b5cf6" }} /><span className={\`\${styles.demandBadge} \${DEMAND_CLS[d]}\`}>{d}</span></label>))}</div>)}</div>
            </aside>

            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>Showing <strong style={{ color: "#f1f5f9" }}>{filtered.length}</strong> fields</span>
                <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}><option value="default">📋 Default</option><option value="salary_desc">💰 Highest Salary</option><option value="growth_desc">📈 Fastest Growing</option></select>
              </div>
              <div className={styles.fieldsGrid}>
                <AnimatePresence>
                  {filtered.map((field, i) => {
                    const color = CAT_COLORS[field.category] || "#6366f1";
                    return (
                      <motion.div key={field.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.04 }} className={styles.fieldCard}>
                        <div className={styles.fieldHeader}><div className={styles.fieldIconWrapper} style={{ background: \`\${color}15\`, borderColor: \`\${color}30\` }}>{field.icon}</div><div><h3 className={styles.fieldTitle}>{field.title}</h3><span className={styles.fieldCat} style={{ color }}>{field.category}</span></div></div>
                        <p className={styles.fieldDesc}>{field.desc}</p>
                        <div className={styles.fieldStatsRow}><div className={styles.miniStat}><TrendingUp size={13} color="#10b981" /><span>{field.growthStr} Growth</span></div><div className={\`\${styles.demandBadge} \${DEMAND_CLS[field.demand]}\`}>{field.demand}</div></div>
                        <div className={styles.fieldFooter}><div className={styles.salaryInfo}><span className={styles.salaryLabel}>Avg Salary</span><span className={styles.salaryValue}>{field.salary}</span></div><button onClick={() => setSel(field)} className={styles.exploreBtn}>Explore <ArrowRight size={16} /></button></div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
\`;

fs.writeFileSync(path.join(__dirname, 'src/app/(public)/fields/page.tsx'), fieldsContent, 'utf8');
console.log('Fields page written successfully.');
