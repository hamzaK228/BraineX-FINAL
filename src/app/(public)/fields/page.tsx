"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, Globe, Briefcase, Heart, Palette, BookOpen, Microscope, TrendingUp, DollarSign, Users, ArrowRight, Zap, GraduationCap, Bookmark } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

type Field = {
  id: number | string; category: string; icon: string; title: string; desc: string;
  salaryNum: number; salary: string; growth: number; growthStr: string;
  demand: string; topUnis: string[]; special_features?: string[];
  noticable_facts?: string[]; image?: string;
};


const CATS = [
  { id: "All", label: "All Fields", icon: <Globe size={16} /> },
  { id: "STEM", label: "STEM", icon: <Microscope size={16} /> },
  { id: "Business", label: "Business", icon: <Briefcase size={16} /> },
  { id: "Health", label: "Health", icon: <Heart size={16} /> },
  { id: "Creative", label: "Creative", icon: <Palette size={16} /> },
  { id: "Humanities", label: "Humanities", icon: <BookOpen size={16} /> }
];

const fieldsData: Field[] = [];

export default function FieldsPage() {
  const [fieldsDataState, setFieldsDataState] = useState<Field[]>(fieldsData);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  // Fetch fields from database (admin-managed content)
  useEffect(() => {
    fetch('/api/public/content/fields?limit=100')
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const dbFields: Field[] = data.items.map((item: any) => {
            const parseArray = (val: any) => Array.isArray(val) ? val : (typeof val === 'string' ? val.split(',').map(s => s.trim()) : []);
            
            return {
              id: item.id,
              category: item.category || "General",
              icon: item.icon || "🎓",
              title: item.title,
              desc: item.description || `Explore the career opportunities and academic paths in ${item.title}.`,
              salaryNum: item.salaryNum || 0,
              salary: item.salary || "Varies",
              growth: item.growth || 0,
              growthStr: item.growthStr || "Varies",
              demand: item.demand || "Moderate",
              topUnis: parseArray(item.topUnis).length > 0 ? parseArray(item.topUnis) : [],
              special_features: parseArray(item.specialFeatures).length > 0 ? item.specialFeatures : ["High demand"],
              noticable_facts: parseArray(item.noticableFacts).length > 0 ? item.noticableFacts : ["Check specialization paths"],
              image: item.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800"
            };
          });
          // Merge: Database items take priority, deduplicate by title
          setFieldsDataState(prev => {
            const dbTitles = new Set(dbFields.map(f => f.title.toLowerCase()));
            const filteredHardcoded = prev.filter(f => !dbTitles.has(f.title.toLowerCase()));
            return [...dbFields, ...filteredHardcoded];
          });
        }
      })
      .catch(() => { /* fallback to hardcoded */ });
  }, []);

  const filtered = useMemo(() => {
    let r = fieldsDataState;
    if (activeCat !== "All") r = r.filter(f => f.category === activeCat);
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(f => f.title.toLowerCase().includes(s) || f.desc.toLowerCase().includes(s));
    }
    return r;
  }, [activeCat, search, fieldsDataState]);

  const stats = useMemo(() => {
    const avgSalary = Math.round(fieldsDataState.reduce((acc, f) => acc + f.salaryNum, 0) / fieldsDataState.length / 1000);
    const avgGrowth = (fieldsDataState.reduce((acc, f) => acc + f.growth, 0) / fieldsDataState.length).toFixed(1);
    return [
      { label: "Academic Fields", value: fieldsDataState.length },
      { label: "Avg Growth", value: `${avgGrowth}%` },
      { label: "Avg Salary", value: `$${avgSalary}k` },
      { label: "Categories", value: CATS.length - 1 }
    ];
  }, [fieldsDataState]);

  return (
    <>
      <PublicHeader />
      {selectedField && (
        <InfoModal
          isOpen={!!selectedField}
          onClose={() => setSelectedField(null)}
          title={selectedField.title}
          subtitle={`${selectedField.category} Field`}
          icon={selectedField.icon}
          image={selectedField.image}
          description={selectedField.desc}
          specialFeatures={selectedField.special_features}
          stats={[
            { label: "Avg Salary", value: selectedField.salary },
            { label: "Job Growth", value: selectedField.growthStr },
            { label: "Demand", value: selectedField.demand }
          ]}
          tips={selectedField.noticable_facts || [
            "Network with professionals in the field early.",
            "Gain practical experience through internships.",
            "Stay updated with the latest industry trends."
          ]}
          ctaLink="/roadmaps"
          ctaLabel="View Career Roadmap"
        />
      )}

      <main id="mainContent" style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg-color)" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "1280px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", marginBottom: "1rem", fontWeight: 800 }}>Explore {fieldsDataState.length} Academic Fields</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "3rem", fontWeight: 500 }}>
              Discover diverse academic disciplines with salary data, growth projections, top universities, and career insights to find your perfect path.
            </motion.p>

            <div className={styles.searchBox}>
              <Search style={{ color: "#6366f1", opacity: 0.5 }} size={20} />
              <input
                type="text"
                placeholder="Search fields and disciplines..."
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className={styles.searchBtn}>Search</button>
            </div>

            <div className={styles.statsRow}>
              {stats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className={styles.statCard}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </motion.div>
              ))}
            </div>

            <div className={styles.tabsRow}>
              {CATS.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.tabBtn} ${activeCat === c.id ? styles.active : ""}`}
                  onClick={() => setActiveCat(c.id)}
                >
                  {c.icon} {c.label}
                  {c.id !== "All" && (
                    <span className={styles.tabCount}>
                      {fieldsDataState.filter(f => f.category === c.id).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className={styles.grid}>
              <AnimatePresence>
                {filtered.map((field, i) => (
                  <motion.div key={field.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.iconWrapper}>{field.icon}</div>
                      <div>
                        <h3 className={styles.title}>{field.title}</h3>
                        <span className={styles.category}>{field.category}</span>
                      </div>
                    </div>

                    <p className={styles.description}>{field.desc}</p>

                    {field.topUnis && Array.isArray(field.topUnis) && field.topUnis.length > 0 && (
                      <div className={styles.uniList}>
                        {field.topUnis.map(u => (
                          <div key={u} className={styles.uniPill}>
                            <GraduationCap size={14} /> {u}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.growthRow}>
                      <div className={styles.growthItem}><TrendingUp size={16} color="#10b981" /> {field.growthStr}</div>
                      <div className={styles.growthItem}><Zap size={16} color="#f59e0b" /> {field.demand}</div>
                    </div>

                    <div className={styles.footer}>
                      <div>
                        <span className={styles.salaryLabel}>AVG SALARY</span>
                        <span className={styles.salaryValue}>{field.salary}</span>
                      </div>
                      <button className={styles.exploreBtn} onClick={() => setSelectedField(field)}>
                        Explore <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}