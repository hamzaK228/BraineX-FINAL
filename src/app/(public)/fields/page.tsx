"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, Brain, Briefcase, TrendingUp, Sparkles, ArrowRight, BookOpen, Microscope, Globe, Palette } from "lucide-react";

type Field = {
  id: number;
  category: string;
  icon: string;
  title: string;
  desc: string;
  salary: string;
  growth: string;
  special_features?: string[];
  noticable_facts?: string[];
  image?: string;
};

const fieldsData: Field[] = [
  { 
    id: 1, 
    category: "stem", 
    icon: "💻", 
    title: "Computer Science", 
    desc: "The study of computation, automation, and information. CS spans theoretical disciplines to practical applications.", 
    salary: "$110k", 
    growth: "15%",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    special_features: ["Artificial Intelligence", "Cybersecurity", "Software Architecture", "Quantum Computing"],
    noticable_facts: ["Highest starting salaries", "Remote work opportunities", "Global demand in every sector"]
  },
  { 
    id: 2, 
    category: "business", 
    icon: "📊", 
    title: "Business Admin", 
    desc: "Management of business operations and decision making to achieve organizational goals efficiently.", 
    salary: "$85k", 
    growth: "8%",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    special_features: ["Strategic Management", "Entrepreneurship", "Operations Research", "Global Logistics"],
    noticable_facts: ["Versatile career paths", "Networking intensive", "High potential for executive roles"]
  },
  { 
    id: 4, 
    category: "stem", 
    icon: "⚙️", 
    title: "Engineering", 
    desc: "Application of science and math to solve complex problems and build systems, structures, or machines.", 
    salary: "$95k", 
    growth: "10%",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200&auto=format&fit=crop",
    special_features: ["Robotics & Automation", "Renewable Energy", "Aerospace Design", "Civil Infrastructure"],
    noticable_facts: ["Professional licensure path", "High job security", "Hands-on problem solving"]
  },
  { 
    id: 6, 
    category: "business", 
    icon: "📈", 
    title: "Finance", 
    desc: "The management, creation, and study of money and investments. Critical for global economic stability.", 
    salary: "$95k", 
    growth: "9%",
    image: "https://images.unsplash.com/photo-1611974714024-462702c28ca8?q=80&w=1200&auto=format&fit=crop",
    special_features: ["Investment Banking", "Quantitative Analysis", "Risk Management", "FinTech Innovation"],
    noticable_facts: ["Bonus-heavy compensation", "Fast-paced environment", "Critical to every industry"]
  }
];

export default function FieldsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [search, setSearch] = useState("");

  const filteredFields = useMemo(() => {
    let result = fieldsData;
    if (activeFilter !== "all") {
      result = result.filter(f => f.category === activeFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(f => f.title.toLowerCase().includes(s) || f.desc.toLowerCase().includes(s));
    }
    return result;
  }, [activeFilter, search]);

  return (
    <>
      <PublicHeader />
      {selectedField && (
        <InfoModal 
          isOpen={!!selectedField} 
          onClose={() => setSelectedField(null)} 
          title={selectedField.title} 
          subtitle={`${selectedField.category.toUpperCase()} Field`} 
          icon={selectedField.icon}
          image={selectedField.image}
          description={selectedField.desc}
          specialFeatures={selectedField.special_features}
          stats={[
            { label: "Avg Salary", value: selectedField.salary },
            { label: "Job Growth", value: selectedField.growth },
            { label: "Difficulty", value: "Moderate" }
          ]}
          tips={selectedField.noticable_facts || [
            "Focus on quantitative skills.",
            "Gain internship experience early.",
            "Stay updated with industry trends."
          ]}
          ctaLink="/roadmaps"
          ctaLabel="View Career Roadmap"
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
              Academic Fields
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Discover diverse academic disciplines and career paths to find your perfect educational journey.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#6366f1", marginLeft: "0.5rem" }} />
              <input 
                type="text" 
                placeholder="Search fields and disciplines..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#6366f1" }}>Search</button>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <div className={styles.filterTabs}>
              <button className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`} onClick={() => setActiveFilter('all')}>
                <Globe size={18} /> All Fields
              </button>
              <button className={`${styles.filterTab} ${activeFilter === 'stem' ? styles.active : ''}`} onClick={() => setActiveFilter('stem')}>
                <Microscope size={18} /> STEM
              </button>
              <button className={`${styles.filterTab} ${activeFilter === 'business' ? styles.active : ''}`} onClick={() => setActiveFilter('business')}>
                <Briefcase size={18} /> Business
              </button>
              <button className={`${styles.filterTab} ${activeFilter === 'creative' ? styles.active : ''}`} onClick={() => setActiveFilter('creative')}>
                <Palette size={18} /> Creative
              </button>
            </div>

            <motion.div layout className={styles.fieldsGrid}>
              <AnimatePresence>
                {filteredFields.map((field, index) => (
                  <motion.div 
                    key={field.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className={styles.fieldCard}
                  >
                    <div className={styles.fieldHeader}>
                      <div className={styles.fieldIconWrapper}>{field.icon}</div>
                      <h3 className={styles.fieldTitle}>{field.title}</h3>
                    </div>
                    <p className={styles.fieldDesc}>{field.desc}</p>
                    
                    <div className={styles.fieldStatsRow}>
                      <div className={styles.miniStat}>
                        <TrendingUp size={14} color="#10b981" />
                        <span>{field.growth} Growth</span>
                      </div>
                      <div className={styles.miniStat}>
                        <Brain size={14} color="#6366f1" />
                        <span>High Demand</span>
                      </div>
                    </div>

                    <div className={styles.fieldFooter}>
                      <div className={styles.salaryInfo}>
                        <span className={styles.salaryLabel}>Avg Salary</span>
                        <span className={styles.salaryValue}>{field.salary}</span>
                      </div>
                      <button onClick={() => setSelectedField(field)} className={styles.exploreBtn}>
                        Explore <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Featured Pathways */}
        <section className={styles.pathwaysSection}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: "3rem" }}>Trending Pathways</h2>
            <div className={styles.pathwaysGrid}>
              <div className={styles.pathwayCard}>
                <div className={styles.pathwayOverlay} />
                <div className={styles.pathwayContent}>
                  <Sparkles color="#fbbf24" />
                  <h3>AI Architect</h3>
                  <p>Design the future of intelligence.</p>
                  <Link href="/roadmaps" className={styles.pathwayLink}>Learn More</Link>
                </div>
              </div>
              <div className={styles.pathwayCard} style={{ background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1504868584819-f8eec746dcc4?q=80&w=400&auto=format&fit=crop')", backgroundSize: "cover" }}>
                <div className={styles.pathwayContent}>
                  <Microscope color="#10b981" />
                  <h3>BioTech Lead</h3>
                  <p>Merging biology with technology.</p>
                  <Link href="/roadmaps" className={styles.pathwayLink}>Learn More</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

