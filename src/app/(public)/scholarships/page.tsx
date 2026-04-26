"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import styles from "./page.module.css";
import { Search, MapPin, Award, Calendar, DollarSign, BookOpen, Sparkles, ArrowRight, Bookmark, Filter, ChevronDown } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

type Scholarship = {
  id: string; title: string; provider: string; location: string; coverage: string; degreeLevel: string; deadline: string; amount: number; tags: string[];
  description?: string; special_features?: string[]; noticable_facts?: string[]; apply_link?: string;
};

const scholarshipsData: Scholarship[] = [
  { id: "s1", title: "Fulbright Foreign Student Program", provider: "U.S. Department of State", location: "USA", coverage: "Full Ride", degreeLevel: "Master's & Ph.D.", deadline: "October 2025", amount: 80000, tags: ["International", "Prestigious", "All Subjects"], description: "The Fulbright Program is the flagship international educational exchange program sponsored by the U.S. government, designed to increase mutual understanding between peoples.", special_features: ["Full Tuition & Living Expenses", "Health Insurance Included", "Cultural Exchange Activities", "Pre-academic English programs"], noticable_facts: ["Operating in over 160 countries", "8,000 grants awarded annually", "Alumni include 62 Nobel Laureates"], apply_link: "https://foreign.fulbrightonline.org/" },
  { id: "s2", title: "Chevening Scholarships", provider: "UK Government", location: "UK", coverage: "Full Ride", degreeLevel: "Master's", deadline: "November 2025", amount: 45000, tags: ["Leadership", "Global", "UK"], description: "Chevening is the UK government's international awards programme aimed at developing global leaders. Funded by the FCDO and partner organisations.", special_features: ["Full Tuition Fees", "Monthly Stipend", "Return Airfare to UK", "Exclusive Networking Events"], noticable_facts: ["Focus on leadership potential", "1-year Master's degree only", "Requirement to return home for 2 years"], apply_link: "https://www.chevening.org/apply/" },
  { id: "s3", title: "Rhodes Scholarship", provider: "Rhodes Trust", location: "UK (Oxford)", coverage: "Full Ride", degreeLevel: "Postgraduate", deadline: "August 2025", amount: 70000, tags: ["Oxford", "Excellence", "Leadership"], description: "The Rhodes Scholarship is the oldest and perhaps most prestigious international scholarship program, enabling outstanding young people to study at the University of Oxford.", special_features: ["University & College Fees", "Personal Stipend", "Health Surcharge Covered", "Rhodes House Community"], noticable_facts: ["Requires nomination by home country", "Exceptional academic standing required", "Emphasis on character and leadership"], apply_link: "https://www.rhodeshouse.ox.ac.uk/scholarships/apply/" },
  { id: "s4", title: "Gates Cambridge Scholarship", provider: "Bill and Melinda Gates Foundation", location: "UK (Cambridge)", coverage: "Full Ride", degreeLevel: "Postgraduate", deadline: "October 2025", amount: 65000, tags: ["Cambridge", "Social Impact", "Research"], description: "Gates Cambridge Scholarships are highly competitive full-cost scholarships for postgraduate study in any subject available at the University of Cambridge.", special_features: ["Full Cost of Cambridge Degree", "Academic Development Funding", "Family Allowance Potential", "Gates Cambridge Scholars Council"], noticable_facts: ["80 scholarships awarded each year", "Global applicant pool", "Focus on commitment to improving lives of others"], apply_link: "https://www.gatescambridge.org/apply/" },
  { id: "s5", title: "DAAD Scholarships", provider: "German Academic Exchange Service", location: "Germany", coverage: "Full Ride", degreeLevel: "Master's & Ph.D.", deadline: "October 2025", amount: 40000, tags: ["Germany", "Engineering", "Research"], description: "DAAD offers scholarships for study and research in Germany for international students. Germany's tuition-free public universities make this exceptionally valuable.", special_features: ["Monthly Stipend (€934-1,300)", "Health Insurance", "Travel Allowance", "German Language Course Funding"], noticable_facts: ["Germany has tuition-free public universities", "Over 100,000 international students funded", "Covers all academic fields"], apply_link: "https://www.daad.de/en/study-and-research-in-germany/scholarships/" },
  { id: "s6", title: "Erasmus Mundus Joint Masters", provider: "European Union", location: "Europe (Multiple)", coverage: "Full Ride", degreeLevel: "Master's", deadline: "January 2026", amount: 49000, tags: ["Europe", "Multicultural", "Joint Degree"], description: "Erasmus Mundus funds prestigious joint master's degrees across multiple European universities, offering a truly international education experience.", special_features: ["Study in 2-3 European Countries", "Full Tuition + Living Costs", "Travel & Installation Allowance", "Joint Degree from Multiple Unis"], noticable_facts: ["Study in multiple countries", "Over 100 master's programs available", "EU's flagship mobility program"], apply_link: "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters" },
  { id: "s7", title: "Schwarzman Scholars", provider: "Schwarzman Scholars Foundation", location: "China (Tsinghua)", coverage: "Full Ride", degreeLevel: "Master's", deadline: "September 2025", amount: 75000, tags: ["China", "Leadership", "Global Affairs"], description: "Schwarzman Scholars is a highly selective, fully-funded one-year master's program at Tsinghua University in Beijing, designed to prepare future leaders for a world where China plays a significant role.", special_features: ["Full Tuition at Tsinghua", "Room & Board on Campus", "Travel to and from Beijing", "Leadership Development Trips"], noticable_facts: ["Modeled after the Rhodes Scholarship", "Only ~150 scholars per year", "Lectures from world leaders"], apply_link: "https://www.schwarzmanscholars.org/apply/" },
  { id: "s8", title: "MEXT Scholarship (Japan)", provider: "Japanese Government", location: "Japan", coverage: "Full Ride", degreeLevel: "All Levels", deadline: "April 2025", amount: 35000, tags: ["Japan", "Research", "Culture"], description: "The MEXT Scholarship is one of the most generous government scholarships available, covering tuition, living expenses, and airfare for study in Japan.", special_features: ["Full Tuition Waiver", "Monthly Allowance (¥143,000-¥148,000)", "Round-trip Airfare", "Japanese Language Training"], noticable_facts: ["One of the most generous scholarships globally", "Includes 6-month Japanese language prep", "Available for undergrad, master's, and PhD"], apply_link: "https://www.studyinjapan.go.jp/en/planning/scholarship/types/government/" },
  { id: "s9", title: "Aga Khan Foundation Scholarship", provider: "Aga Khan Foundation", location: "Global", coverage: "Partial (50% Grant)", degreeLevel: "Master's", deadline: "March 2026", amount: 30000, tags: ["Developing Countries", "Need-based", "Half-Grant"], description: "The AKF Scholarship provides financial assistance to outstanding students from developing countries who have no other means of financing their studies.", special_features: ["50% Grant + 50% Interest-free Loan", "Any Master's Program Worldwide", "Academic Excellence Required", "Community Service Commitment"], noticable_facts: ["Available for students from select developing countries", "Half grant, half interest-free loan", "Must demonstrate financial need"], apply_link: "https://www.akdn.org/our-agencies/aga-khan-foundation/aga-khan-foundation-scholarship-programme" },
  { id: "s10", title: "Vanier Canada Graduate Scholarship", provider: "Government of Canada", location: "Canada", coverage: "Full Ride", degreeLevel: "Ph.D.", deadline: "November 2025", amount: 50000, tags: ["Canada", "PhD", "Research Excellence"], description: "The Vanier CGS is designed to attract and retain world-class doctoral students by offering them a significant financial award for doctoral studies at Canadian institutions.", special_features: ["$50,000/yr for 3 Years", "All Research Fields", "Prestigious National Award", "Access to Canadian Labs"], noticable_facts: ["Total value $150,000 over 3 years", "Only ~166 awards per year", "No separate application — nominated by university"], apply_link: "https://vanier.gc.ca/en/home-accueil.html" },
  { id: "s11", title: "CSC Scholarship (China)", provider: "China Scholarship Council", location: "China", coverage: "Full Ride", degreeLevel: "All Levels", deadline: "January-April 2026", amount: 28000, tags: ["China", "All Fields", "Government"], description: "The Chinese Government Scholarship is a comprehensive program for international students to study at Chinese universities, covering all levels from bachelor's to PhD.", special_features: ["Full Tuition", "Accommodation on Campus", "Monthly Stipend", "Medical Insurance"], noticable_facts: ["Over 50,000 scholarships annually", "280+ Chinese universities participate", "Includes Chinese language preparation"], apply_link: "https://www.campuschina.org/scholarships/index.html" },
  { id: "s12", title: "Australia Awards Scholarships", provider: "Australian Government", location: "Australia", coverage: "Full Ride", degreeLevel: "Master's & Ph.D.", deadline: "April 2025", amount: 55000, tags: ["Australia", "Development", "Asia-Pacific"], description: "Australia Awards provide opportunities for people from developing countries to undertake full-time undergraduate or postgraduate study at participating Australian universities.", special_features: ["Full Tuition", "Return Air Travel", "Establishment Allowance", "Overseas Student Health Cover"], noticable_facts: ["Priority for developing countries in Asia-Pacific", "Must return home for 2 years after", "Incredibly generous living allowance"], apply_link: "https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships" },
  { id: "s13", title: "Knight-Hennessy Scholars (Stanford)", provider: "Stanford University", location: "USA", coverage: "Full Ride", degreeLevel: "Postgraduate", deadline: "October 2025", amount: 90000, tags: ["Stanford", "Innovation", "Leadership"], description: "Knight-Hennessy Scholars is the largest fully endowed scholarship program in the world, funding graduate students at Stanford to become global leaders.", special_features: ["Full Graduate Tuition", "Living Stipend", "Travel & Academic Enrichment", "Leadership Development Program"], noticable_facts: ["Largest endowed scholarship globally ($750M+)", "Only ~100 scholars per year", "Any Stanford graduate program eligible"], apply_link: "https://knight-hennessy.stanford.edu/apply" },
  { id: "s14", title: "Türkiye Scholarships", provider: "Turkish Government", location: "Turkey", coverage: "Full Ride", degreeLevel: "All Levels", deadline: "February 2026", amount: 20000, tags: ["Turkey", "All Fields", "Cultural Exchange"], description: "Türkiye Scholarships is a government-funded program that provides full financial support for international students to study at Turkish universities.", special_features: ["Full Tuition", "Monthly Stipend", "Accommodation", "Turkish Language Course (1 Year)"], noticable_facts: ["Over 5,000 scholarships per year", "Includes 1-year Turkish language prep", "Health insurance included"], apply_link: "https://turkiyeburslari.gov.tr/" },
  { id: "s15", title: "Mastercard Foundation Scholars", provider: "Mastercard Foundation", location: "Africa/Global", coverage: "Full Ride", degreeLevel: "All Levels", deadline: "Varies by Partner", amount: 60000, tags: ["Africa", "Social Impact", "Inclusion"], description: "The Mastercard Foundation Scholars Program provides comprehensive support to young people from economically disadvantaged communities in Africa, enabling them to attend top universities.", special_features: ["Full Tuition & Living", "Mentorship Program", "Transition & Career Support", "Community Engagement"], noticable_facts: ["Over 50,000 scholars since 2012", "Partners with 40+ universities", "Focus on African youth leadership"], apply_link: "https://mastercardfdn.org/all/scholars/" },
];

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("amount_desc");
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [coverageFilter, setCoverageFilter] = useState<string[]>([]);
  const [degreeLevels, setDegreeLevels] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [openAccordions, setOpenAccordions] = useState<string[]>(['coverage_type', 'degree_level']);
  const [showFilters, setShowFilters] = useState(false);
  const { saveItem, removeItem, isSaved } = useSaved();

  const uniqueLocations = useMemo(() => Array.from(new Set(scholarshipsData.map(s => s.location))).sort(), []);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSave = (schol: Scholarship) => {
    if (isSaved(schol.id)) { removeItem(schol.id); }
    else { saveItem({ id: schol.id, title: schol.title, type: 'Scholarship', source: schol.provider }); }
  };

  const filteredData = useMemo(() => {
    let result = scholarshipsData;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(s) || p.provider.toLowerCase().includes(s) || p.location.toLowerCase().includes(s) || p.tags.some(tag => tag.toLowerCase().includes(s)));
    }
    if (locationFilter) { result = result.filter(p => p.location === locationFilter); }
    if (coverageFilter.length > 0) { result = result.filter(p => coverageFilter.includes(p.coverage)); }
    if (degreeLevels.length > 0) { result = result.filter(p => degreeLevels.some(dl => p.degreeLevel.includes(dl) || p.degreeLevel === "All Levels")); }
    result = [...result].sort((a, b) => {
      if (sort === "amount_asc") return a.amount - b.amount;
      if (sort === "amount_desc") return b.amount - a.amount;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });
    return result;
  }, [search, sort, coverageFilter, degreeLevels, locationFilter]);

  return (
    <>
      <PublicHeader />
      {selectedScholarship && (
        <InfoModal 
          isOpen={!!selectedScholarship} onClose={() => setSelectedScholarship(null)} 
          title={selectedScholarship.title} subtitle={selectedScholarship.provider} icon="💰"
          image="https://images.unsplash.com/photo-1544652478-6653e09f18a2?q=80&w=1200&auto=format&fit=crop"
          description={selectedScholarship.description}
          specialFeatures={selectedScholarship.special_features}
          stats={[
            { label: "Coverage", value: selectedScholarship.coverage },
            { label: "Est. Value", value: `$${selectedScholarship.amount.toLocaleString()}` },
            { label: "Deadline", value: selectedScholarship.deadline }
          ]}
          tips={selectedScholarship.noticable_facts || ["Start your application at least 6 months in advance."]}
          ctaLink={selectedScholarship.apply_link}
          ctaLabel="Apply Now"
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
              Global Scholarships
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Discover {scholarshipsData.length} fully-funded scholarships, grants, and financial aid to support your international education dreams.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#10b981", marginLeft: "0.5rem" }} />
              <input type="text" placeholder="Search by name, provider, or keyword..." className={styles.searchInput} value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#10b981" }}>Search</button>
            </motion.div>
          </div>
        </section>

        <section style={{ background: "rgba(15, 23, 42, 0.4)", position: "relative" }}>
          <div className={`container ${styles.layout}`}>
            <aside className={styles.filterSidebar}>
              <div className={styles.filterHeader} onClick={() => setShowFilters(!showFilters)}>
                <h3 className={styles.filterHeaderTitle}>
                  <Filter size={18} /> Filters
                  <span style={{ fontSize: "0.8rem", background: "#10b981", color: "white", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700, marginLeft: "0.5rem" }}>
                    {filteredData.length}
                  </span>
                </h3>
                <ChevronDown size={20} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: '0.3s', color: 'var(--text-muted)' }} />
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
              <div className={styles.filterBody}>
                <div className={styles.filterGroup}>
                  <h4 className={styles.filterTitle}>Country of Study</h4>
                  <select className={styles.filterSelect} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                    <option value="">Any Location</option>
                    {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('coverage_type')}>
                    <span>Coverage Type</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('coverage_type') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('coverage_type') && (
                    <div className={styles.accordionContent}>
                      {["Full Ride", "Partial (50% Grant)"].map(c => (
                        <label key={c} className={styles.filterCheckbox}>
                          <input type="checkbox" checked={coverageFilter.includes(c)} onChange={() => setCoverageFilter(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('degree_level')}>
                    <span>Degree Level</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('degree_level') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('degree_level') && (
                    <div className={styles.accordionContent}>
                      {["Master's", "Ph.D.", "Postgraduate", "All Levels"].map(dl => (
                        <label key={dl} className={styles.filterCheckbox}>
                          <input type="checkbox" checked={degreeLevels.includes(dl)} onChange={() => setDegreeLevels(prev => prev.includes(dl) ? prev.filter(x => x !== dl) : [...prev, dl])} />
                          <span>{dl}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "12px", marginTop: "1.5rem", fontSize: "0.85rem", color: "#6ee7b7", display: "flex", gap: "0.75rem" }}>
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span>Unlock exclusive funding opportunities by joining!</span>
                </div>
              </div>
              <div className={styles.filterFooter} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button className={styles.clearBtn} onClick={() => { setCoverageFilter([]); setDegreeLevels([]); setSearch(""); setLocationFilter(""); }}>Clear All</button>
                <button className={styles.applyBtn} style={{ background: "#10b981" }} onClick={() => setShowFilters(false)}>Apply</button>
              </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>

            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>Showing <strong>{filteredData.length}</strong> Scholarships</span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Sort by:</span>
                  <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
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
                      <motion.div key={schol.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: Math.min(index * 0.05, 0.3) }} className={styles.card} style={{ position: "relative" }}>
                        <button onClick={() => handleSave(schol)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, color: isSaved(schol.id) ? "#10b981" : "#94a3b8", transition: "all 0.2s" }}>
                          <Bookmark size={18} fill={isSaved(schol.id) ? "#10b981" : "none"} />
                        </button>
                        <div className={styles.cardHeader}>
                          <div className={styles.logoWrapper}><Award size={32} color="#10b981" /></div>
                          <div style={{ paddingRight: "2rem" }}>
                            <h3 className={styles.title}>{schol.title}</h3>
                            <div className={styles.university}>{schol.provider}</div>
                            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={14} /> Study in: {schol.location}</div>
                          </div>
                        </div>
                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Coverage</span><span className={styles.detailValue} style={{ color: schol.coverage === 'Full Ride' ? '#10b981' : 'inherit' }}>{schol.coverage}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Degree Level</span><span className={styles.detailValue}>{schol.degreeLevel}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Deadline</span><span className={styles.detailValue} style={{ color: "#ef4444" }}>{schol.deadline}</span></div>
                          <div className={styles.detailItem}><span className={styles.detailLabel}>Est. Value</span><span className={styles.detailValue}>~${schol.amount.toLocaleString()}</span></div>
                        </div>
                        <div className={styles.tags}>{schol.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}</div>
                        <div className={styles.cardActions} style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                          <button onClick={() => setSelectedScholarship(schol)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "0.75rem", borderRadius: "12px", flex: 1, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}><Award size={18} /> Details</button>
                          <Link href="/dashboard" className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "12px", flex: 1, textDecoration: "none", background: "#10b981", color: "white", border: "none" }}>
                            Apply <ArrowRight size={18} />
                          </Link>
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
