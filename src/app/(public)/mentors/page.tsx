"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, MapPin, User, Star, BookOpen, Sparkles, ArrowRight, MessageSquare, Briefcase, Zap, Heart, Filter, ChevronDown } from "lucide-react";

type Mentor = {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  expertise: string; // Engineering, Product, Design, Marketing, Data
  experience: string; // Junior, Mid-Level, Senior, Lead
  price: string; // Free, Paid
  rating: number;
  reviews: number;
  tags: string[];
  special_features?: string[];
  noticable_facts?: string[];
  image?: string;
};

const mentorsData: Mentor[] = [
  { 
    id: "m1", 
    name: "Sarah Jenkins", 
    role: "Senior Software Engineer", 
    company: "Google", 
    bio: "Helping students crack FAANG interviews and master algorithms.", 
    expertise: "Engineering", 
    experience: "Senior", 
    price: "Free", 
    rating: 4.9, 
    reviews: 124, 
    tags: ["Algorithms", "System Design", "Python"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    special_features: ["Mock Technical Interviews", "Resume Deep Dives", "Algorithm Speed-Run Sessions", "Career Path Planning"],
    noticable_facts: ["Ex-Amazon & Microsoft", "Mentored 500+ students", "Open-source contributor"]
  },
  { 
    id: "m2", 
    name: "David Chen", 
    role: "Product Manager", 
    company: "Stripe", 
    bio: "Learn how to transition from engineering to product management.", 
    expertise: "Product", 
    experience: "Lead", 
    price: "Paid", 
    rating: 4.8, 
    reviews: 89, 
    tags: ["Product Strategy", "Agile", "Interviews"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    special_features: ["Product Discovery Workshops", "Roadmap Strategy Sessions", "PRD Writing Guidance", "Leadership Coaching"],
    noticable_facts: ["Founding PM at two startups", "MBA from Stanford GSB", "Speaker at ProductCon"]
  },
  { 
    id: "m7", 
    name: "Jessica Wong", 
    role: "Frontend Developer", 
    company: "Vercel", 
    bio: "React, Next.js, and modern frontend architecture mentoring.", 
    expertise: "Engineering", 
    experience: "Mid-Level", 
    price: "Free", 
    rating: 4.9, 
    reviews: 178, 
    tags: ["React", "Next.js", "CSS"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    special_features: ["Next.js Performance Audits", "Figma to Code Sessions", "Modern CSS Layouts", "Open Source Guidance"],
    noticable_facts: ["Core contributor to UI libraries", "Active tech blogger", "Expert in accessibility"]
  }
];

export default function MentorsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating_desc");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [expertises, setExpertises] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['expertise', 'experience', 'price']);
  const [showFilters, setShowFilters] = useState(false);

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredData = useMemo(() => {
    let result = mentorsData;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(s) || 
        p.role.toLowerCase().includes(s) ||
        p.company.toLowerCase().includes(s) ||
        p.tags.some(tag => tag.toLowerCase().includes(s))
      );
    }

    if (expertises.length > 0) {
      result = result.filter(p => expertises.includes(p.expertise));
    }

    if (experiences.length > 0) {
      result = result.filter(p => experiences.includes(p.experience));
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (sort === "rating_desc") return b.rating - a.rating;
      if (sort === "reviews_desc") return b.reviews - a.reviews;
      if (sort === "name_asc") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [search, sort, expertises, experiences]);

  return (
    <>
      <PublicHeader />
      {selectedMentor && (
        <InfoModal 
          isOpen={!!selectedMentor} 
          onClose={() => setSelectedMentor(null)} 
          title={selectedMentor.name} 
          subtitle={`${selectedMentor.role} @ ${selectedMentor.company}`} 
          icon="👨‍🏫"
          image={selectedMentor.image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"}
          description={selectedMentor.bio}
          specialFeatures={selectedMentor.special_features}
          stats={[
            { label: "Rating", value: `${selectedMentor.rating} ⭐` },
            { label: "Reviews", value: `${selectedMentor.reviews}` },
            { label: "Expertise", value: selectedMentor.expertise }
          ]}
          tips={selectedMentor.noticable_facts || [
            "Be prepared with specific questions.",
            "Send your resume in advance if applicable.",
            "Be ready to discuss your career goals."
          ]}
          ctaLink="#"
          ctaLabel="Book 1-on-1 Session"
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
              Find Your Mentor
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Connect with industry experts from top companies for 1-on-1 guidance, interview prep, and career advice.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#f43f5e", marginLeft: "0.5rem" }} />
              <input 
                type="text" 
                placeholder="Search by name, company, or expertise..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px", background: "#f43f5e" }}>Search</button>
            </motion.div>
          </div>
        </section>

        {/* Directory Layout */}
        <section style={{ background: "rgba(15, 23, 42, 0.4)", position: "relative" }}>
          <div className={`container ${styles.layout}`}>
            
            {/* Filter Sidebar */}
            <aside className={styles.filterSidebar}>
              <div className={styles.filterHeader} onClick={() => setShowFilters(!showFilters)}>
                <h3 className={styles.filterHeaderTitle}>
                  <Filter size={18} /> Filters
                  <span style={{ fontSize: "0.8rem", background: "#f43f5e", color: "white", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700, marginLeft: "0.5rem" }}>
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
                  <h4 className={styles.filterTitle}>Expertise</h4>
                  <select className={styles.filterSelect}>
                    <option value="">Any Expertise</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                  </select>
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.2)", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#fda4af", display: "flex", gap: "0.75rem" }}>
                  <Heart size={16} style={{ flexShrink: 0 }} />
                  <span>Join our community to access free mentorship sessions!</span>
                </div>

                {[
                  { id: 'experience', label: 'Experience' },
                  { id: 'price', label: 'Pricing' },
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

              </div>
              <div className={styles.filterFooter} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button 
                  className={styles.clearBtn}
                  onClick={() => { setExpertises([]); setExperiences([]); setSearch(""); }}
                >
                  Clear All
                </button>
                <button className={styles.applyBtn} style={{ background: "#f43f5e" }} onClick={() => setShowFilters(false)}>
                  Apply
                </button>
              </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>

            {/* Main Content Grid */}
            <div className={styles.content}>
              <div className={styles.contentControls}>
                <span className={styles.resultsCount}>
                  Showing <strong>{filteredData.length}</strong> Mentors
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Sort by:</span>
                  <select 
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="rating_desc">⭐ Highest Rated</option>
                    <option value="reviews_desc">💬 Most Reviewed</option>
                  </select>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Search size={48} style={{ color: "#4b5563", marginBottom: "1.5rem" }} />
                  <h3>No mentors found</h3>
                  <p style={{ color: "#94a3b8" }}>Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filteredData.map((mentor, index) => (
                      <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: Math.min(index * 0.05, 0.3) }}
                        className={styles.card}
                      >
                        <div className={styles.cardHeader}>
                          <div className={styles.avatarWrapper}>
                            {mentor.image ? (
                              <img src={mentor.image} alt={mentor.name} className={styles.avatar} />
                            ) : (
                              <User size={32} color="#f43f5e" />
                            )}
                          </div>
                          <div>
                            <h3 className={styles.title}>{mentor.name}</h3>
                            <div className={styles.university}>{mentor.role} @ {mentor.company}</div>
                            <div style={{ fontSize: "0.85rem", color: "#facc15", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Star size={14} fill="#facc15" /> {mentor.rating} <span style={{ color: "#94a3b8" }}>({mentor.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>

                        <p className={styles.bioText}>
                          "{mentor.bio}"
                        </p>

                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Expertise</span>
                            <span className={styles.detailValue}>{mentor.expertise}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Level</span>
                            <span className={styles.detailValue}>{mentor.experience}</span>
                          </div>
                          <div className={styles.detailItem} style={{ gridColumn: "span 2" }}>
                            <span className={styles.detailLabel}>Pricing</span>
                            <span className={styles.detailValue} style={{ color: mentor.price === 'Free' ? '#10b981' : '#f43f5e' }}>
                              {mentor.price} Sessions
                            </span>
                          </div>
                        </div>

                        <div className={styles.tags}>
                          {mentor.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>

                        <div className={styles.cardActions} style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                          <button onClick={() => setSelectedMentor(mentor)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", padding: "0.75rem", borderRadius: "12px", flex: 1, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}><User size={18} /> Details</button>
                          <Link href="/dashboard" className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "12px", flex: 1, textDecoration: "none", background: "#f43f5e", color: "white", border: "none" }}>
                            Book <ArrowRight size={18} />
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

