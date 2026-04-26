"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import { InfoModal } from "@/components/InfoModal";
import Link from "next/link";
import styles from "./page.module.css";
import { Search, MapPin, GraduationCap, Clock, DollarSign, BookOpen, Sparkles, ArrowRight, Heart, Bookmark, Filter, ChevronDown } from "lucide-react";
import { useSaved } from "@/context/SavedContext";

type Program = {
  id: string;
  title: string;
  university: string;
  location: string;
  logo: string;
  image?: string;
  degreeLevel: string; // Bachelor, Master, PhD
  studyMode: string; // On-Campus, Online, Hybrid
  duration: string;
  tuition: number;
  tags: string[];
  description?: string;
  special_features?: string[];
  noticable_facts?: string[];
};

const programsData: Program[] = [
  { id: "p1", title: "B.Sc. in Computer Science", university: "Massachusetts Institute of Technology (MIT)", location: "USA", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Bachelor's", studyMode: "On-Campus", duration: "4 Years", tuition: 57590, tags: ["AI", "Software Engineering", "Algorithms"], description: "The Computer Science program at MIT is renowned for its blend of theoretical foundations and practical application. Students engage in groundbreaking research from day one.", special_features: ["UROP Research Opportunities", "State-of-the-art Robotics Lab", "Silicon Valley Internships", "Global Innovation Contests"], noticable_facts: ["98% Graduate Employment Rate", "Highest starting salaries in tech", "Access to MIT Media Lab"] },
  { id: "p2", title: "MBA in Global Business", university: "Harvard University", location: "USA", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_University_shield.png/1024px-Harvard_University_shield.png", image: "https://images.unsplash.com/photo-1454165833767-027ffea9e772?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Master's", studyMode: "On-Campus", duration: "2 Years", tuition: 73440, tags: ["Management", "Finance", "Leadership"], description: "Harvard Business School offers a world-class MBA program that uses the case method to develop leadership skills and strategic thinking in a global context.", special_features: ["Case Method Learning", "Global Immersion Program", "Alumni Mentorship Network", "Venture Competition"], noticable_facts: ["Produced most Fortune 500 CEOs", "Extensive 100k+ Alumni Network", "Located in historic Boston"] },
  { id: "p3", title: "M.Sc. in Data Science", university: "Imperial College London", location: "UK", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Imperial_College_London_new_logo.svg/1024px-Imperial_College_London_new_logo.svg.png", image: "https://images.unsplash.com/photo-1551288049-bbbda536ad0a?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Master's", studyMode: "Hybrid", duration: "1 Year", tuition: 38000, tags: ["Machine Learning", "Big Data", "Statistics"], description: "This intensive program covers the full spectrum of data science, from large-scale data processing to advanced statistical modeling and machine learning.", special_features: ["Data Science Institute Access", "Industry Capstone Projects", "London Tech Hub Connection", "AI Ethics Focus"], noticable_facts: ["Top 3 globally for Data Science", "Partnerships with Google & DeepMind", "Intensive 12-month format"] },
  { id: "p4", title: "Ph.D. in Quantum Physics", university: "University of Oxford", location: "UK", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/1024px-Oxford-University-Circlet.svg.png", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Ph.D.", studyMode: "On-Campus", duration: "3-4 Years", tuition: 35000, tags: ["Quantum Mechanics", "Research", "Physics"], description: "Oxford's Physics department is one of the largest in the world, offering unparalleled research facilities and supervision in quantum computing and technologies.", special_features: ["Quantum Research Center", "Beecroft Building Labs", "International Conferences", "Clarendon Scholarship Link"], noticable_facts: ["Nobel Prize-winning faculty", "Oldest physics lab in UK", "Leading edge of Quantum Tech"] },
  { id: "p5", title: "Lumiere Research Scholar Program", university: "Lumiere Education (Harvard Mentors)", location: "Online / Global", logo: "https://cdn-icons-png.flaticon.com/512/3135/3135810.png", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Summer", studyMode: "Online", duration: "8-12 Weeks", tuition: 3950, tags: ["Research", "Mentorship", "Publication"], description: "Lumiere pairs high school students with PhD mentors from Harvard, Stanford, and MIT for original, publishable research. The gold standard for pre-college academic research.", special_features: ["1-on-1 PhD Mentorship", "Publishable Research Paper", "Harvard/Stanford Mentors", "Flexible Online Schedule"], noticable_facts: ["93% of scholars accepted to T20 universities", "Students have published in real journals", "Founded by Harvard & Oxford researchers"] },
  { id: "p6", title: "MIT PRIMES (Research in Math)", university: "Massachusetts Institute of Technology", location: "USA", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Summer", studyMode: "Hybrid", duration: "12 Months", tuition: 2500, tags: ["Mathematics", "Research", "Competition"], description: "MIT PRIMES is a free, year-long research program for high school students who are mathematically talented. Students work with MIT faculty and graduate students on cutting-edge math research.", special_features: ["Free Program", "MIT Faculty Mentors", "Conference Presentations", "Published Research Papers"], noticable_facts: ["Entirely free of charge", "Students have won Regeneron STS", "Most competitive math research program"] },
  { id: "p7", title: "Stanford Summer Humanities Institute", university: "Stanford University", location: "USA", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Seal_of_Leland_Stanford_Junior_University.svg/1024px-Seal_of_Leland_Stanford_Junior_University.svg.png", image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Summer", studyMode: "On-Campus", duration: "3 Weeks", tuition: 2500, tags: ["Humanities", "Philosophy", "Writing"], description: "A fully-funded summer residential program at Stanford for high school juniors passionate about humanities, philosophy, and critical thinking.", special_features: ["Fully Funded", "Stanford Campus Housing", "Seminar-style Classes", "College Application Boost"], noticable_facts: ["100% free — tuition, room & board covered", "Only ~3% acceptance rate", "Incredible for college applications"] },
  { id: "p8", title: "M.Sc. in Artificial Intelligence", university: "ETH Zürich", location: "Switzerland", logo: "https://cdn-icons-png.flaticon.com/512/8066/8066542.png", image: "https://images.unsplash.com/photo-1677442135132-f8c8c8e1c2b0?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Master's", studyMode: "On-Campus", duration: "2 Years", tuition: 1460, tags: ["AI", "Robotics", "Deep Learning"], description: "ETH Zürich's AI master's program is one of the best in Europe, offering world-class research in robotics, NLP, and computer vision at an incredibly affordable tuition.", special_features: ["Low Tuition (~$1.5k/yr)", "Top European AI Research", "Disney Research Lab Partnership", "Google Zürich Internships"], noticable_facts: ["21 Nobel Prize laureates", "Tuition is only $730/semester", "Einstein's alma mater"] },
  { id: "p9", title: "RSI (Research Science Institute)", university: "MIT & CEE", location: "USA", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1024px-MIT_logo.svg.png", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Summer", studyMode: "On-Campus", duration: "6 Weeks", tuition: 2500, tags: ["STEM Research", "Competition", "MIT Campus"], description: "RSI is the most prestigious FREE summer science research program for high school students worldwide. Held at MIT, students conduct original research with top mentors.", special_features: ["Entirely Free", "MIT Campus & Labs", "World-class STEM Mentors", "Oral & Written Presentations"], noticable_facts: ["Considered #1 summer STEM program", "~2% acceptance rate", "Alumni include Nobel laureates & Fields medalists"] },
  { id: "p10", title: "B.A. in Philosophy, Politics & Economics", university: "University of Oxford", location: "UK", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/1024px-Oxford-University-Circlet.svg.png", image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Bachelor's", studyMode: "On-Campus", duration: "3 Years", tuition: 32000, tags: ["Politics", "Economics", "Philosophy"], description: "Oxford's legendary PPE program has produced more world leaders than any other degree. It combines rigorous analytical training across three foundational disciplines.", special_features: ["Tutorial System", "World Leader Alumni", "Debating Union Access", "Summer Internship Programs"], noticable_facts: ["Produced 30+ heads of state", "Bill Clinton & Benazir Bhutto are alumni", "Most influential degree in politics"] },
  { id: "p11", title: "KAUST Discovery Scholars Program", university: "KAUST", location: "Saudi Arabia", logo: "https://cdn-icons-png.flaticon.com/512/8066/8066542.png", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Summer", studyMode: "On-Campus", duration: "6 Weeks", tuition: 2500, tags: ["STEM", "Research", "Funded"], description: "A fully-funded summer research program at King Abdullah University of Science and Technology for top undergraduates worldwide.", special_features: ["Full Scholarship + Stipend", "State-of-the-art Labs", "International Community", "Research Publication Support"], noticable_facts: ["Free flights + accommodation", "Monthly stipend provided", "World-class research in desert campus"] },
  { id: "p12", title: "M.Eng. in Biomedical Engineering", university: "Johns Hopkins University", location: "USA", logo: "https://cdn-icons-png.flaticon.com/512/8066/8066542.png", image: "https://images.unsplash.com/photo-1581093458791-9d42e3c7e6d5?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Master's", studyMode: "On-Campus", duration: "2 Years", tuition: 58720, tags: ["Biomedical", "Medical Devices", "Biomechanics"], description: "Johns Hopkins' #1 ranked biomedical engineering program integrates cutting-edge medical research with engineering innovation.", special_features: ["#1 BME Program in USA", "Hospital Integration", "FDA Collaboration Projects", "Translational Research"], noticable_facts: ["Connected to top US hospital", "40+ years ranked #1 in BME", "Graduates lead biotech startups"] },
  { id: "p13", title: "Yale Young Global Scholars", university: "Yale University", location: "USA", logo: "https://cdn-icons-png.flaticon.com/512/8066/8066542.png", image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Summer", studyMode: "On-Campus", duration: "2 Weeks", tuition: 6500, tags: ["Leadership", "Global Issues", "Networking"], description: "YYGS brings together outstanding high schoolers from 150+ countries for intensive seminars on global challenges, innovation, and leadership at Yale's campus.", special_features: ["150+ Countries Represented", "Yale Faculty Lectures", "Need-based Financial Aid", "Global Alumni Network"], noticable_facts: ["Generous financial aid available", "Speakers include Nobel laureates", "Incredible for global networking"] },
  { id: "p14", title: "B.Sc. in Computer Science & AI", university: "National University of Singapore", location: "Singapore", logo: "https://cdn-icons-png.flaticon.com/512/8066/8066542.png", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Bachelor's", studyMode: "On-Campus", duration: "4 Years", tuition: 18000, tags: ["AI", "Computer Science", "Asia"], description: "NUS offers Asia's top CS program with a specialized AI track, combining rigorous theory with Singapore's booming tech ecosystem.", special_features: ["Silicon Valley Exchange", "Smart Nation Research", "Google/Meta Partnerships", "Startup Incubator"], noticable_facts: ["#1 in Asia for CS", "Tuition subsidized by government", "95% employment within 6 months"] },
  { id: "p15", title: "M.A. in International Relations", university: "Sciences Po Paris", location: "France", logo: "https://cdn-icons-png.flaticon.com/512/8066/8066542.png", image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Master's", studyMode: "On-Campus", duration: "2 Years", tuition: 14500, tags: ["Diplomacy", "International Law", "Politics"], description: "Sciences Po is France's most prestigious political science institution, educating future diplomats, EU leaders, and international policymakers.", special_features: ["UN Simulation Access", "Paris Location", "Dual-degree with Columbia/LSE", "Multilingual Environment"], noticable_facts: ["4 French presidents are alumni", "Dual degrees with Columbia & LSE", "Heart of European diplomacy"] },
  { id: "p16", title: "Pioneer Research Program", university: "Pioneer Academics", location: "Online / Global", logo: "https://cdn-icons-png.flaticon.com/512/3135/3135810.png", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Summer", studyMode: "Online", duration: "10 Weeks", tuition: 6000, tags: ["Research", "Any Field", "Mentorship"], description: "Pioneer pairs high schoolers with college professors for original research across any academic discipline — from astrophysics to art history.", special_features: ["Any Subject Area", "Professor Mentorship", "Research Paper Output", "Certificate of Distinction"], noticable_facts: ["Recognized by top universities", "Students publish original research", "Available globally online"] },
  { id: "p17", title: "LLM in International Law", university: "University of Cambridge", location: "UK", logo: "https://cdn-icons-png.flaticon.com/512/8066/8066542.png", image: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Master's", studyMode: "On-Campus", duration: "9 Months", tuition: 42000, tags: ["Law", "International Law", "Human Rights"], description: "Cambridge's LLM is one of the most prestigious law degrees in the world, offering deep specialization in international humanitarian law and human rights.", special_features: ["Lauterpacht Centre", "Moot Court Competitions", "800-year Legal Tradition", "Supervision System"], noticable_facts: ["Graduated 90+ international judges", "Small cohort of ~180 students", "One of oldest law faculties in world"] },
  { id: "p18", title: "M.Sc. in Sustainable Energy", university: "Technical University of Denmark (DTU)", location: "Denmark", logo: "https://cdn-icons-png.flaticon.com/512/8066/8066542.png", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Master's", studyMode: "On-Campus", duration: "2 Years", tuition: 2500, tags: ["Renewable Energy", "Climate", "Engineering"], description: "DTU's tuition-free sustainable energy program is Europe's leading green engineering degree, with direct access to Denmark's wind energy industry.", special_features: ["Tuition-free for EU/EEA", "Wind Energy Hub", "Vestas & Ørsted Partnerships", "Living Lab Campus"], noticable_facts: ["Denmark is world leader in wind energy", "Free tuition for EU students", "Campus runs on 100% renewable energy"] },
  { id: "p19", title: "HBX CORe (Credential of Readiness)", university: "Harvard Business School Online", location: "Online / Global", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Harvard_University_shield.png/1024px-Harvard_University_shield.png", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Certificate", studyMode: "Online", duration: "10-17 Weeks", tuition: 2250, tags: ["Business", "Economics", "Analytics"], description: "HBX CORe is Harvard Business School's flagship online program covering business analytics, economics, and financial accounting — ideal for pre-MBA or career changers.", special_features: ["Harvard Certificate", "Interactive Case Studies", "Global Cohort Learning", "Career Advancement Track"], noticable_facts: ["Real Harvard credential", "Used by Fortune 500 for training", "Flexible self-paced schedule"] },
  { id: "p20", title: "B.Tech. in Computer Science", university: "Indian Institute of Technology (IIT Bombay)", location: "India", logo: "https://cdn-icons-png.flaticon.com/512/8066/8066542.png", image: "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200&auto=format&fit=crop", degreeLevel: "Bachelor's", studyMode: "On-Campus", duration: "4 Years", tuition: 2000, tags: ["Computer Science", "Engineering", "India"], description: "IIT Bombay's CS program is India's most prestigious, known for its incredibly competitive entrance (JEE Advanced) and world-class graduates in Silicon Valley.", special_features: ["JEE Advanced Selection", "Strong Alumni in FAANG", "Techfest — Asia's Largest Tech Fest", "Startup Culture"], noticable_facts: ["Acceptance rate < 1%", "Sundar Pichai (Google CEO) is IIT alum", "Tuition is only ~$2000/year"] },
];


export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("tuition_asc");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [degreeLevels, setDegreeLevels] = useState<string[]>([]);
  const [studyModes, setStudyModes] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [tuitionMax, setTuitionMax] = useState(80000);
  const [openAccordions, setOpenAccordions] = useState<string[]>(['degree_level', 'study_mode', 'tuition_fee']);
  const [showFilters, setShowFilters] = useState(false);
  const { saveItem, removeItem, isSaved } = useSaved();

  const uniqueLocations = useMemo(() => Array.from(new Set(programsData.map(p => p.location))).sort(), []);

  const handleSave = (prog: Program) => {
    if (isSaved(prog.id)) { removeItem(prog.id); }
    else { saveItem({ id: prog.id, title: prog.title, type: 'Program', source: prog.university, image: prog.image }); }
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleLevelToggle = (level: string) => {
    setDegreeLevels(prev => prev.includes(level) ? prev.filter(x => x !== level) : [...prev, level]);
  };

  const handleModeToggle = (mode: string) => {
    setStudyModes(prev => prev.includes(mode) ? prev.filter(x => x !== mode) : [...prev, mode]);
  };

  const filteredData = useMemo(() => {
    let result = programsData;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.university.toLowerCase().includes(s) ||
        p.tags.some(tag => tag.toLowerCase().includes(s))
      );
    }

    if (locationFilter) {
      result = result.filter(p => p.location === locationFilter);
    }

    if (degreeLevels.length > 0) {
      result = result.filter(p => degreeLevels.includes(p.degreeLevel));
    }

    if (studyModes.length > 0) {
      result = result.filter(p => studyModes.includes(p.studyMode));
    }

    result = result.filter(p => p.tuition <= tuitionMax);

    result = [...result].sort((a, b) => {
      if (sort === "tuition_asc") return a.tuition - b.tuition;
      if (sort === "tuition_desc") return b.tuition - a.tuition;
      if (sort === "name_asc") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [search, sort, degreeLevels, studyModes, locationFilter, tuitionMax]);

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
          image={selectedProgram.image || "https://images.unsplash.com/photo-1523050335192-ce67457e0c1e?q=80&w=1200&auto=format&fit=crop"}
          description={selectedProgram.description}
          specialFeatures={selectedProgram.special_features}
          stats={[
            { label: "Duration", value: selectedProgram.duration },
            { label: "Tuition", value: `$${selectedProgram.tuition.toLocaleString()}/yr` },
            { label: "Mode", value: selectedProgram.studyMode }
          ]}
          tips={selectedProgram.noticable_facts || [
            "Review prerequisites carefully.",
            "Prepare a strong Statement of Purpose.",
            "Apply for scholarships early."
          ]}
        />
      )}
      <main id="mainContent" role="main" style={{ paddingTop: "80px", minHeight: "100vh" }}>
        
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", marginBottom: "1rem", lineHeight: 1.1 }}>
              Academic Programs
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.25rem", color: "#94a3b8", marginBottom: "3rem", fontWeight: 500 }}>
              Browse thousands of bachelor's, master's, and doctoral programs from the world's top institutions.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.searchBox}>
              <Search style={{ color: "#6366f1", marginLeft: "0.5rem" }} />
              <input 
                type="text" 
                placeholder="Search for programs, universities, or topics..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "10px" }}>Search</button>
            </motion.div>
          </div>
        </section>

        {/* Directory Layout */}
        <section style={{ background: "rgba(15, 23, 42, 0.4)", position: "relative" }}>
          <div className={`container ${styles.layout}`}>
            
            {/* Filter Top Bar */}
            <aside className={styles.filterSidebar}>
              <div className={styles.filterHeader} onClick={() => setShowFilters(!showFilters)}>
                <h3 className={styles.filterHeaderTitle}>
                  <Filter size={18} /> Filters
                  <span style={{ fontSize: "0.8rem", background: "#6366f1", color: "white", padding: "0.2rem 0.6rem", borderRadius: "20px", fontWeight: 700, marginLeft: "0.5rem" }}>
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
                  <h4 className={styles.filterTitle}>Location</h4>
                  <select 
                    className={styles.filterSelect}
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="">Any Location</option>
                    {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('degree_level')}>
                    <span>Degree Level</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('degree_level') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('degree_level') && (
                    <div className={styles.accordionContent}>
                      {["Bachelor's", "Master's", "Ph.D.", "Summer", "Certificate"].map(level => (
                        <label key={level} className={styles.filterCheckbox}>
                          <input type="checkbox" checked={degreeLevels.includes(level)} onChange={() => handleLevelToggle(level)} />
                          <span>{level}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('study_mode')}>
                    <span>Study Mode</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('study_mode') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('study_mode') && (
                    <div className={styles.accordionContent}>
                      {["On-Campus", "Online", "Hybrid"].map(mode => (
                        <label key={mode} className={styles.filterCheckbox}>
                          <input type="checkbox" checked={studyModes.includes(mode)} onChange={() => handleModeToggle(mode)} />
                          <span>{mode}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.accordionItem}>
                  <div className={styles.accordionHeader} onClick={() => toggleAccordion('tuition_fee')}>
                    <span>Tuition Fee</span>
                    <ChevronDown size={16} style={{ transform: openAccordions.includes('tuition_fee') ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </div>
                  {openAccordions.includes('tuition_fee') && (
                    <div className={styles.accordionContent}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Up to ${tuitionMax.toLocaleString()}/yr</span>
                        <input type="range" min="0" max="80000" step="1000" value={tuitionMax} onChange={(e) => setTuitionMax(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#6366f1" }} />
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ padding: "1.25rem", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "12px", marginTop: "1.5rem", fontSize: "0.85rem", color: "#a5b4fc", display: "flex", gap: "0.75rem" }}>
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span>Unlock advanced filters by registering for free!</span>
                </div>
              </div>

              <div className={styles.filterFooter} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button 
                  className={styles.clearBtn}
                  onClick={() => { setDegreeLevels([]); setStudyModes([]); setSearch(""); setLocationFilter(""); setTuitionMax(80000); }}
                >
                  Clear All
                </button>
                <button className={styles.applyBtn} onClick={() => setShowFilters(false)}>
                  Apply Filters
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
                  Showing <strong>{filteredData.length}</strong> Programs
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Sort by:</span>
                  <select 
                    className={styles.sortSelect}
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="tuition_asc">💰 Tuition (Low to High)</option>
                    <option value="tuition_desc">💰 Tuition (High to Low)</option>
                    <option value="name_asc">📝 Name (A-Z)</option>
                  </select>
                </div>
              </div>

              {filteredData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <Search size={48} style={{ color: "#4b5563", marginBottom: "1.5rem" }} />
                  <h3>No programs found</h3>
                  <p style={{ color: "#94a3b8" }}>Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  <AnimatePresence>
                    {filteredData.map((prog, index) => (
                      <motion.div
                        key={prog.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: Math.min(index * 0.05, 0.3) }}
                        className={styles.card}
                        style={{ position: "relative" }}
                      >
                        <button
                          onClick={() => handleSave(prog)}
                          style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, color: isSaved(prog.id) ? "#6366f1" : "#94a3b8", transition: "all 0.2s" }}
                        >
                          <Bookmark size={18} fill={isSaved(prog.id) ? "#6366f1" : "none"} />
                        </button>
                        <div className={styles.cardHeader}>
                          <img 
                            src={prog.logo} 
                            alt={prog.university} 
                            className={styles.logo} 
                            onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/8066/8066542.png"; }}
                          />
                          <div style={{ paddingRight: "2rem" }}>
                            <h3 className={styles.title}>{prog.title}</h3>
                            <div className={styles.university}>{prog.university}</div>
                            <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "4px" }}>
                              <MapPin size={14} /> {prog.location}
                            </div>
                          </div>
                        </div>

                        <div className={styles.detailsGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Degree Level</span>
                            <span className={styles.detailValue}>{prog.degreeLevel}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Study Mode</span>
                            <span className={styles.detailValue}>{prog.studyMode}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Duration</span>
                            <span className={styles.detailValue}>{prog.duration}</span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Tuition / Year</span>
                            <span className={styles.detailValue}>{prog.tuition === 0 ? "Free" : `$${prog.tuition.toLocaleString()}`}</span>
                          </div>
                        </div>

                        <div className={styles.tags}>
                          {prog.tags.map(tag => (
                            <span key={tag} className={styles.tag}>{tag}</span>
                          ))}
                        </div>

                        <div className={styles.cardActions}>
                          <button onClick={() => setSelectedProgram(prog)} className={styles.detailsBtn}>
                            <GraduationCap size={18} /> View Details
                          </button>
                          <Link href="/dashboard" className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "12px", flex: 1, textDecoration: "none" }}>
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

