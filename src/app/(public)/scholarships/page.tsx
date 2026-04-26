"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, MapPin, Award, Calendar, DollarSign, BookOpen, Sparkles, ArrowRight, Bookmark } from "lucide-react";

type Scholarship = {
  id: string;
  title: string;
  provider: string;
  location: string;
  coverage: string; // Full Ride, Partial, Tuition Only
  degreeLevel: string; // Bachelor, Master, PhD, All
  deadline: string;
  amount: number;
  tags: string[];
  description?: string;
  special_features?: string[];
  noticable_facts?: string[];
  apply_link?: string;
};

const scholarshipsData: Scholarship[] = [
  { 
    id: "s1", 
    title: "Fulbright Foreign Student Program", 
    provider: "U.S. Department of State", 
    location: "USA", 
    coverage: "Full Ride", 
    degreeLevel: "Master's & Ph.D.", 
    deadline: "October 2025", 
    amount: 80000, 
    tags: ["International", "Prestigious", "All Subjects"],
    description: "The Fulbright Program is the flagship international educational exchange program sponsored by the U.S. government. It is designed to increase mutual understanding between the people of the United States and the people of other countries.",
    special_features: ["Full Tuition & Living Expenses", "Health Insurance Included", "Cultural Exchange Activities", "Pre-academic English programs"],
    noticable_facts: ["Operating in over 160 countries", "8,000 grants awarded annually", "Alumni include 62 Nobel Laureates"],
    apply_link: "https://foreign.fulbrightonline.org/"
  },
  { 
    id: "s2", 
    title: "Chevening Scholarships", 
    provider: "UK Government", 
    location: "UK", 
    coverage: "Full Ride", 
    degreeLevel: "Master's", 
    deadline: "November 2025", 
    amount: 45000, 
    tags: ["Leadership", "Global", "UK"],
    description: "Chevening is the UK government’s international awards programme aimed at developing global leaders. Funded by the Foreign, Commonwealth & Development Office and partner organisations.",
    special_features: ["Full Tuition Fees", "Monthly Stipend", "Return Airfare to UK", "Exclusive Networking Events"],
    noticable_facts: ["Focus on leadership potential", "1-year Master's degree only", "Requirement to return home for 2 years"],
    apply_link: "https://www.chevening.org/apply/"
  },
  { 
    id: "s4", 
    title: "Rhodes Scholarship", 
    provider: "Rhodes Trust", 
    location: "UK (Oxford)", 
    coverage: "Full Ride", 
    degreeLevel: "Postgraduate", 
    deadline: "August 2025", 
    amount: 70000, 
    tags: ["Oxford", "Excellence", "Leadership"],
    description: "The Rhodes Scholarship is the oldest and perhaps most prestigious international scholarship program in the world, enabling outstanding young people from around the world to study at the University of Oxford.",
    special_features: ["University & College Fees", "Personal Stipend", "Health Surcharge Covered", "Rhodes House Community"],
    noticable_facts: ["Requires nomination by home country", "Exceptional academic standing", "Emphasis on character and leadership"],
    apply_link: "https://www.rhodeshouse.ox.ac.uk/scholarships/apply/"
  },
  { 
    id: "s5", 
    title: "Gates Cambridge Scholarship", 
    provider: "Bill and Melinda Gates Foundation", 
    location: "UK (Cambridge)", 
    coverage: "Full Ride", 
    degreeLevel: "Postgraduate", 
    deadline: "October 2025", 
    amount: 65000, 
    tags: ["Cambridge", "Social Impact", "Research"],
    description: "Gates Cambridge Scholarships are highly competitive full-cost scholarships for postgraduate study in any subject available at the University of Cambridge.",
    special_features: ["Full Cost of Cambridge Degree", "Academic Development Funding", "Family Allowance Potential", "Gates Cambridge Scholars Council"],
    noticable_facts: ["80 scholarships awarded each year", "Global applicant pool", "Focus on commitment to improving lives of others"],
    apply_link: "https://www.gatescambridge.org/apply/how-to-apply/"
  }
];

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("amount_desc");
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [coverage, setCoverage] = useState<string[]>([]);
  const [degreeLevels, setDegreeLevels] = useState<string[]>([]);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['coverage_type', 'degree_level', 'region']);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredData = useMemo(() => {
    let result = scholarshipsData;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.provider.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s) ||
        p.tags.some(tag => tag.toLowerCase().includes(s))
      );
    }

    if (coverage.length > 0) {
      result = result.filter(p => coverage.includes(p.coverage));
    }

    if (degreeLevels.length > 0) {
      result = result.filter(p => degreeLevels.some(dl => p.degreeLevel.includes(dl) || p.degreeLevel === "All Levels"));
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sort === "amount_asc") return a.amount - b.amount;
      if (sort === "amount_desc") return b.amount - a.amount;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [search, sort, coverage, degreeLevels]);

  return (
    <>
      <PublicHeader />
      {selectedScholarship && (
        <InfoModal 
          isOpen={!!selectedScholarship} 
          onClose={() => setSelectedScholarship(null)} 
          title={selectedScholarship.title} 
          subtitle={selectedScholarship.provider} 
          icon="💰"
          image="https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=1200&auto=format&fit=crop"
          description={selectedScholarship.description}
          specialFeatures={selectedScholarship.special_features}
          stats={[
            { label: "Coverage", value: selectedScholarship.coverage },
            { label: "Est. Value", value: `$${selectedScholarship.amount.toLocaleString()}` },
            { label: "Deadline", value: selectedScholarship.deadline }
          ]}
          tips={selectedScholarship.noticable_facts || [
            "Start your application at least 6 months in advance.",
            "Contact your referees early.",
            "Tailor your personal statement specifically."
          ]}
          ctaLink={selectedScholarship.apply_link}
          ctaLabel="Apply Now"
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
              Global Scholarships
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Discover fully-funded scholarships, grants, and financial aid to support your international education dreams.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#10b981", marginLeft: "0.5rem" }} />
              <input 
                type="text" 
                placeholder="Search by name, provider, or keyword..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#10b981" }}>Search</button>
            </motion.div>
          </div>
        </section>

        {/* Directory Layout */}
        <section style={{ background: "rgba(15, 23, 42, 0.4)", position: "relative" }}>
          <div className={`container ${styles.layout}`}>
            
            {/* Filter Sidebar */}
            <aside className={styles.filterSidebar}>
              <div className={styles.filterHeader}>
                <h3 className={styles.filterHeaderTitle}>Filter Results</h3>
                <span style={{ fontSize: "0.8rem", background: "#10b981", color: "white", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700 }}>
                  {filteredData.length}
                </span>
              </div>

              <div className={styles.filterBody}>
                <div className={styles.filterGroup}>
                  <h4 className={styles.filterTitle}>Country of Study</h4>
                  <select className={styles.filterSelect}>
                    <option value="">Any Location</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#6ee7b7", display: "flex", gap: "0.75rem" }}>
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span>Unlock exclusive funding opportunities by joining!</span>
                </div>

                {[
                  { id: 'coverage_type', label: 'Coverage Type' },
                  { id: 'degree_level', label: 'Degree Level' },
                ].map((acc) => (
                  <div key={acc.id} className={styles.accordionItem}>
                    <div 
                      className={styles.accordionHeader}
                    >
                      <span>{acc.label}</span>
                      <BookOpen size={16} style={{ color: "#94a3b8" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.filterFooter}>
                <button 
                  className={styles.clearBtn}
                  onClick={() => { setCoverage([]); setDegreeLevels([]); setSearch(""); }}
                >
                  Clear All
                </button>
                <button className={styles.applyBtn} style={{ background: "#10b981" }}>
                  Apply
                </button>
              </div>
            </aside>

            {/* Main Content Grid */}
            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>
                  Showing <strong>{filteredData.length}</strong> Scholarships
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Sort by:</span>
                  <select 
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="amount_desc">💰 Highest Value</option>
                    <option value="amount_asc">💰 Lowest Value</option>
                    <option value="name_asc">📝 Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Search size={48} style={{ color: "#4b5563", marginBottom: "1.5rem" }} />
                  <h3>No scholarships found</h3>
                  <p style={{ color: "#94a3b8" }}>Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filteredData.map((schol, index) => (
                      <motion.div
                        key={schol.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: Math.min(index * 0.05, 0.3) }}
                        className={styles.card}
                      >
                        <div className={styles.cardHeader}>
                          <div className={styles.logoWrapper}>
                            <Award size={32} color="#10b981" />
                          </div>
                          <div>
                            <h3 className={styles.title}>{schol.title}</h3>
                            <div className={styles.university}>{schol.provider}</div>
                            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <MapPin size={14} /> Study in: {schol.location}
                            </div>
                          </div>
                        </div>

                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Coverage</span>
                            <span className={styles.detailValue} style={{ color: schol.coverage === 'Full Ride' ? '#10b981' : 'inherit' }}>
                              {schol.coverage}
                            </span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Degree Level</span>
                            <span className={styles.detailValue}>{schol.degreeLevel}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Deadline</span>
                            <span className={styles.detailValue} style={{ color: "#ef4444" }}>{schol.deadline}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Est. Value</span>
                            <span className={styles.detailValue}>~${schol.amount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className={styles.tags}>
                          {schol.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>

                        <div className={styles.cardActions}>
                          <button onClick={() => setSelectedScholarship(schol)} className={styles.applyBtnMain}>
                            Apply Now
                          </button>
                          <button className={styles.bookmarkBtn}>
                            <Bookmark size={18} />
                          </button>
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

