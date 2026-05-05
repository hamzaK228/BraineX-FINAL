"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Search, 
  Globe, 
  Rocket, 
  Map, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Activity, 
  BrainCircuit,
  Star,
  Award,
  CheckCircle,
  Clock,
  Briefcase
} from "lucide-react";
import styles from "./page.module.css";
import { useRef, useState, useEffect } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  const [featuredScholarships, setFeaturedScholarships] = useState<any[]>([]);
  const [featuredRoadmaps, setFeaturedRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scholarshipsRes, roadmapsRes] = await Promise.all([
          fetch('/api/public/content/scholarships'),
          fetch('/api/public/content/roadmaps')
        ]);

        const scholarshipsData = await scholarshipsRes.json();
        const roadmapsData = await roadmapsRes.json();

        const scholarships = Array.isArray(scholarshipsData) ? scholarshipsData : (scholarshipsData.items || []);
        const roadmaps = Array.isArray(roadmapsData) ? roadmapsData : (roadmapsData.items || []);

        setFeaturedScholarships(scholarships.filter((s: any) => s.featured).slice(0, 3));
        setFeaturedRoadmaps(roadmaps.filter((r: any) => r.featured).slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallbacks if DB is empty or fetch fails
  const displayScholarships = featuredScholarships.length > 0 ? featuredScholarships : [
    { title: "Gates Cambridge Scholarship", provider: "University of Cambridge", fields: ["All Fields"], deadline: "Dec 15, 2024", degreeLevel: ["Graduate"], description: "Prestigious scholarship for outstanding applicants outside the UK to pursue graduate study." },
    { title: "NSF Graduate Research Fellowship", provider: "National Science Foundation", fields: ["STEM Fields"], deadline: "Oct 25, 2024", degreeLevel: ["Graduate"], description: "Support for graduate research in science, technology, engineering, and mathematics." },
    { title: "Rhodes Scholarship", provider: "University of Oxford", fields: ["All Fields"], deadline: "Oct 6, 2024", degreeLevel: ["Graduate"], description: "The world's oldest graduate scholarship program, enabling exceptional young people to study at Oxford." }
  ];

  const displayRoadmaps = featuredRoadmaps.length > 0 ? featuredRoadmaps : [
    { 
      title: "High School to College", 
      icon: <Map size={28} />,
      color: "#3b82f6",
      steps: [{ title: "GPA", description: "Maintain strong GPA (3.5+)" }, { title: "Courses", description: "Take AP/IB/Honors courses" }, { title: "Leadership", description: "Build leadership experience" }, { title: "Testing", description: "Start SAT/ACT prep" }, { title: "Essays", description: "Write compelling essays" }]
    },
    { 
      title: "Undergrad to Grad School", 
      icon: <GraduationCap size={28} />,
      color: "#a855f7",
      steps: [{ title: "Research", description: "Research faculty & programs" }, { title: "Experience", description: "Gain research experience" }, { title: "Testing", description: "Prep for GRE/GMAT" }, { title: "References", description: "Secure recommendation letters" }, { title: "Funding", description: "Apply for fellowships" }]
    },
    { 
      title: "Career Transition", 
      icon: <Briefcase size={28} />,
      color: "#10b981",
      steps: [{ title: "Audit", description: "Self-assessment & skills audit" }, { title: "Certification", description: "Acquire new certifications" }, { title: "Portfolio", description: "Build portfolio projects" }, { title: "Networking", description: "Network with professionals" }, { title: "Offers", description: "Negotiate offers" }]
    }
  ];

  return (
    <>
      {/* Decorative Background Elements */}
      <div className={styles.bgGlows}>
        <div className={styles.glow1}></div>
        <div className={styles.glow2}></div>
      </div>

      <main id="mainContent" role="main" style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section ref={targetRef} className={styles.heroSection}>
          <motion.div 
            style={{ opacity, scale, y, maxWidth: "900px" }}
            className="container" 
          >
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <span className={styles.badge}>
                🚀 BraineX Platform v2.0
              </span>
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className={styles.heroTitle}
            >
              Your Gateway to <br />
              <span className={styles.gradientTextAnimated}>Global Opportunities</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className={styles.heroSubtitle}
            >
              Access fully-funded scholarships, launch innovative projects, follow expert roadmaps, and get mentorship to shape your ultimate future.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={styles.heroButtons}
            >
              <Link href="/signup" className={`ds-btn ds-btn-primary ${styles.btnLarge}`}>
                Get Started <ArrowRight size={20} />
              </Link>
              <Link href="/about" className={`ds-btn ds-btn-secondary ${styles.btnLarge}`}>
                Explore Platform
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Hero Decorative Shapes */}
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className={styles.shape1}
          />
          <motion.div 
            animate={{ 
              x: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className={styles.shape2}
          />
        </section>

        {/* Trusted By / Opportunities From */}
        <section>
          <div className="container">
            <motion.div 
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
              className={styles.trustedSection}
            >
              <p className={styles.trustedText}>Discover opportunities from world-class institutions</p>
              <div className={styles.trustedLogos}>
                <span>Cambridge</span>
                <span>Oxford</span>
                <span>Harvard</span>
                <span>MIT</span>
                <span>Stanford</span>
                <span>Max Planck</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories / Bento Grid */}
        <section className={styles.sectionPadding}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
              className={styles.sectionHeader}
            >
              <h2 className="section-title">Explore <span className={styles.gradientTextAnimated}>Possibilities</span></h2>
              <p className={styles.sectionSubtitle}>Everything you need to succeed in your academic and professional journey.</p>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className={styles.bentoGrid}
            >
              {[
                { title: "Scholarships", icon: <Search size={32} />, desc: "Tailored funding for your exact goals.", link: "/scholarships", color: "indigo" },
                { title: "Fields", icon: <Globe size={32} />, desc: "Academic disciplines from around the world.", link: "/fields", color: "purple" },
                { title: "Projects", icon: <Rocket size={32} />, desc: "Launch your own tech or research venture.", link: "/projects", color: "pink" },
                { title: "Roadmaps", icon: <Map size={32} />, desc: "Proven paths to success.", link: "/roadmaps", color: "blue" },
                { title: "Mentors", icon: <Users size={32} />, desc: "Connect with world-class experts.", link: "/mentors", color: "emerald" },
                { title: "Universities", icon: <GraduationCap size={32} />, desc: "Find your dream institution.", link: "/universities", color: "amber" }
              ].map((cat, i) => (
                <motion.div key={i} variants={fadeIn}>
                  <Link href={cat.link} className={`${styles.bentoCard} ${styles[cat.color]}`}>
                    <div className={styles.iconWrap}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className={styles.catTitle}>{cat.title}</h3>
                      <p className={styles.catDesc}>{cat.desc}</p>
                    </div>
                    <ArrowRight className={styles.bentoArrow} size={20} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Tracks (Interactive Slider) */}
        <section className={styles.sectionPadding} style={{ background: "var(--section-bg-1)" }}>
          <div className="container" style={{ position: "relative" }}>
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="section-title"
              style={{ textAlign: "center" }}
            >
              Explore <span className={styles.gradientTextAnimated}>Academic Tracks</span>
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className={styles.sectionSubtitle}
              style={{ textAlign: "center", marginTop: "-1.5rem", marginBottom: "2rem" }}
            >
              Discover disciplines and find the perfect path for your future.
            </motion.p>

            {/* Slider Controls */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginBottom: "1.5rem" }}>
              <button onClick={scrollLeft} className="ds-btn ds-btn-secondary" style={{ padding: "0.75rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowRight size={20} style={{ transform: "rotate(180deg)" }} />
              </button>
              <button onClick={scrollRight} className="ds-btn ds-btn-secondary" style={{ padding: "0.75rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowRight size={20} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              style={{ 
                display: "flex", 
                overflowX: "auto", 
                gap: "2rem", 
                paddingBottom: "2rem",
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none"
              }}
              className={styles.hideScrollbar}
            >
              {[
                { title: "AI & Data Science", icon: "🤖", desc: "Explore the cutting-edge world of AI, machine learning, and data analytics", s: 152, r: 18, m: 6 },
                { title: "Biotech & Health", icon: "🧬", desc: "Advance medical research and healthcare innovation", s: 128, r: 15, m: 8 },
                { title: "Climate Tech", icon: "🌱", desc: "Build solutions for environmental challenges and sustainable future", s: 94, r: 12, m: 5 },
                { title: "Engineering & Robotics", icon: "⚙️", desc: "Design and build the technologies of tomorrow", s: 210, r: 24, m: 14 },
                { title: "Entrepreneurship", icon: "💡", desc: "Turn your ideas into impactful startups and ventures", s: 85, r: 10, m: 22 },
                { title: "Global Policy", icon: "🌍", desc: "Drive change in diplomacy, human rights, and sustainable development", s: 65, r: 8, m: 12 },
                { title: "Digital Media", icon: "🎨", desc: "Create immersive experiences and digital art", s: 110, r: 14, m: 9 },
                { title: "Economics & Finance", icon: "💰", desc: "Master financial systems and economic policy", s: 145, r: 16, m: 18 }
              ].map((track, i) => (
                <div key={i} className={`glass-card ${styles.trackCard}`} style={{ width: "350px", flexShrink: 0, padding: "2rem", scrollSnapAlign: "start", transition: "transform 0.3s ease, boxShadow 0.3s ease" }}>
                  <div className={styles.trackHeader} style={{ marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.8rem" }}>{track.icon}</span>
                      <span style={{ lineHeight: "1.2" }}>{track.title}</span>
                    </h3>
                  </div>
                  <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", minHeight: "3.5rem", lineHeight: "1.5", fontSize: "0.95rem" }}>{track.desc}</p>
                  
                  <div className={styles.trackStats} style={{ background: "var(--card-bg)", padding: "1rem 1.25rem", borderRadius: "12px", border: "1px solid var(--card-border)", marginBottom: "1.5rem", marginTop: "auto" }}>
                    <div className={styles.trackStatItem}>
                      <span className={styles.trackStatValue}>{track.s}</span>
                      <span className={styles.trackStatLabel}>Scholarships</span>
                    </div>
                    <div className={styles.trackStatItem}>
                      <span className={styles.trackStatValue}>{track.r}</span>
                      <span className={styles.trackStatLabel}>Roadmaps</span>
                    </div>
                    <div className={styles.trackStatItem}>
                      <span className={styles.trackStatValue}>{track.m}</span>
                      <span className={styles.trackStatLabel}>Mentors</span>
                    </div>
                  </div>

                  <Link href="/fields" className="ds-btn ds-btn-secondary" style={{ width: "100%", textAlign: "center", display: "block" }}>
                    Explore Track
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Platform */}
        <section className={styles.sectionPadding}>
          <div className="container">
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="section-title"
              style={{ textAlign: "center" }}
            >
              Why Choose <span className={styles.gradientTextAnimated}>BraineX</span>
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className={styles.sectionSubtitle}
              style={{ textAlign: "center", marginBottom: "4rem", marginTop: "-1.5rem", maxWidth: "600px", marginInline: "auto" }}
            >
              The smartest way to navigate your academic and professional journey.
            </motion.p>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className={styles.grid3}
            >
              {[
                { title: "AI-Powered Guidance", desc: "Our smart algorithms analyze your profile to suggest the best scholarships, universities, and tracks.", icon: <BrainCircuit size={40} color="#a855f7" /> },
                { title: "All-in-One Dashboard", desc: "Track goals, monitor deadlines, and manage applications in a beautiful, organized workspace.", icon: <Activity size={40} color="#10b981" /> },
                { title: "Global Community", desc: "Connect with expert mentors and ambitious students from top universities worldwide.", icon: <Globe size={40} color="#3b82f6" /> }
              ].map((feature, i) => (
                <motion.div key={i} variants={fadeIn} className="glass-card" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1.5rem" }}>
                  <div style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "50%", border: "1px solid var(--card-border)", boxShadow: "0 8px 32px rgba(0,0,0,var(--shadow-opacity))" }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "700" }}>{feature.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: "1.6" }}>{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Scholarships */}
        <section className={styles.sectionPadding}>
          <div className="container">
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="section-title"
            >
              Featured <span className={styles.gradientTextAnimated}>Scholarships</span>
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className={styles.sectionSubtitle}
              style={{ textAlign: "center", marginBottom: "4rem", marginTop: "-1.5rem" }}
            >
              Find financial aid tailored to your profile from global institutions.
            </motion.p>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className={styles.grid3}
            >
              {displayScholarships.map((item, i) => (
                <motion.div key={i} variants={fadeIn} className={`glass-card ${styles.trackCard}`}>
                  <div className={styles.trackHeader} style={{ marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{item.title}</h3>
                    <div className={styles.trackIcon}><Award size={28} /></div>
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <div className={styles.metaInfo}><GraduationCap size={16} /> <span>{item.provider || item.university}</span></div>
                    <div className={styles.metaInfo}><BookOpen size={16} /> <span>{Array.isArray(item.fields) ? item.fields[0] : (item.field || "All Fields")}</span></div>
                    <div className={styles.metaInfo}><Clock size={16} /> <span>{item.deadline}</span></div>
                  </div>
                  <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", minHeight: "4rem", fontSize: "0.95rem" }}>{item.description || item.desc}</p>
                  <Link href="/scholarships" className="ds-btn ds-btn-secondary" style={{ width: "100%", textAlign: "center", display: "block" }}>
                    View Details
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Top Mentors */}
        <section className={styles.sectionPadding} style={{ background: "var(--section-bg-2)" }}>
          <div className="container">
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="section-title"
            >
              Expert <span className={styles.gradientTextAnimated}>Mentors</span>
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className={styles.sectionSubtitle}
              style={{ textAlign: "center", marginBottom: "4rem", marginTop: "-1.5rem" }}
            >
              Get guidance from industry professionals and successful alumni.
            </motion.p>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className={styles.grid3}
            >
              {[
                { name: "Dr. Sarah Chen", role: "AI Research Scientist", company: "Google DeepMind", desc: "Former Stanford PhD, now leading AI research. Helps students with research applications." },
                { name: "Michael Johnson", role: "Investment Banking VP", company: "Goldman Sachs", desc: "Wharton MBA with 10 years in investment banking. Specializes in finance career paths." },
                { name: "Robert Kim", role: "Startup Founder", company: "TechCorp", desc: "Serial entrepreneur with two successful exits. Mentors students interested in startups." }
              ].map((mentor, i) => (
                <motion.div key={i} variants={fadeIn} className={`glass-card ${styles.trackCard}`} style={{ alignItems: "center", textAlign: "center" }}>
                  <div className={styles.mentorAvatar} style={{ marginBottom: "1rem" }}>
                    <Users size={32} color="white" />
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{mentor.name}</h3>
                  <div style={{ color: "#a855f7", fontWeight: "600", marginBottom: "0.25rem" }}>{mentor.role}</div>
                  <div className={styles.metaInfo} style={{ justifyContent: "center", marginBottom: "1rem" }}><Briefcase size={16} /> <span>{mentor.company}</span></div>
                  <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", minHeight: "4rem", fontSize: "0.95rem" }}>{mentor.desc}</p>
                  <Link href="/mentors" className="ds-btn ds-btn-secondary" style={{ width: "100%", textAlign: "center", display: "block" }}>
                    Connect
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Academic Roadmaps Preview */}
        <section className={styles.sectionPadding}>
          <div className="container">
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="section-title"
            >
              Academic <span className={styles.gradientTextAnimated}>Roadmaps</span>
            </motion.h2>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className={styles.sectionSubtitle}
              style={{ textAlign: "center", marginBottom: "4rem", marginTop: "-1.5rem" }}
            >
              Follow proven pathways to achieve your academic and career goals.
            </motion.p>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className={styles.grid3}
            >
              {displayRoadmaps.map((roadmap, i) => (
                <motion.div key={i} variants={fadeIn} className="glass-card" style={{ padding: "2.5rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.05, transform: "scale(3)" }}>
                    {roadmap.icon || <Map size={28} />}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                    <div style={{ 
                      padding: "1rem", 
                      background: roadmap.color ? `${roadmap.color}15` : "rgba(59,130,246,0.1)", 
                      color: roadmap.color || "#3b82f6", 
                      borderRadius: "12px" 
                    }}>
                      {roadmap.icon || <Map size={28} />}
                    </div>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", margin: 0, lineHeight: "1.3" }}>{roadmap.title}</h3>
                  </div>
                  
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    {Array.isArray(roadmap.steps) && roadmap.steps.slice(0, 5).map((step: any, j: number) => (
                      <li key={j} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <div style={{ background: "var(--card-border)", color: "var(--text-color)", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "bold", flexShrink: 0 }}>
                          {j + 1}
                        </div>
                        <span style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                          {typeof step === 'string' ? step : (step.title || step.description)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/roadmaps" className="ds-btn ds-btn-secondary" style={{ width: "100%", textAlign: "center", display: "block", marginTop: "2rem" }}>
                    Explore Pathway
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.sectionPadding}>
          <div className="container">
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="section-title"
            >
              Success <span className={styles.gradientTextAnimated}>Stories</span>
            </motion.h2>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className={styles.grid3}
            >
              {[
                { name: "Sopia Miller", role: "Fulbright Scholar", text: "BraineX helped me find a scholarship I didn't even know existed. Their roadmap was my bible during the application process.", avatar: "SM" },
                { name: "Liam Chen", role: "Software Engineer @ Google", text: "The mentorship here is world-class. My mentor helped me refine my projects and ace my technical interviews.", avatar: "LC" },
                { name: "Emma Wilson", role: "PhD Candidate", text: "Finding research funding was always a struggle until BraineX. The curated database is a game changer for researchers.", avatar: "EW" }
              ].map((t, i) => (
                <motion.div key={i} variants={fadeIn} className={`glass-card ${styles.testiCard}`}>
                  <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#facc15" color="#facc15" />)}
                  </div>
                  <p className={styles.testiText}>"{t.text}"</p>
                  <div className={styles.testiUser}>
                    <div className={styles.testiAvatar}>{t.avatar}</div>
                    <div>
                      <h4 style={{ fontSize: "1rem", margin: 0 }}>{t.name}</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.sectionPadding} style={{ background: "var(--section-bg-1)" }}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="section-title"
            >
              Frequently Asked <span className={styles.gradientTextAnimated}>Questions</span>
            </motion.h2>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className={styles.faqList}
            >
              {[
                { q: "How do I find the right scholarship for me?", a: "Our advanced matching algorithm analyzes your academic background, interests, and goals to recommend personalized scholarship opportunities." },
                { q: "Is BraineX free to use?", a: "Yes! BraineX is completely free for students. We believe in democratizing access to education." },
                { q: "How does mentor matching work?", a: "We match you with mentors based on your field of interest, career goals, and learning style. Our mentors are industry professionals." },
                { q: "What support do you provide for applications?", a: "We provide comprehensive application support including essay review, interview preparation, document guidance, and deadline tracking." }
              ].map((faq, i) => (
                <motion.div key={i} variants={fadeIn} className={`glass-card ${styles.faqCard}`}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.75rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <CheckCircle size={20} color="#6366f1" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
                    <span>{faq.q}</span>
                  </h3>
                  <p style={{ color: "var(--text-muted)", margin: 0, paddingLeft: "2rem", fontSize: "0.95rem", lineHeight: "1.6" }}>{faq.a}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.sectionPadding}>
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`glass-card ${styles.ctaSection}`}
            >
              <h2 className={styles.ctaTitle}>Ready to accelerate your journey?</h2>
              <p className={styles.ctaSubtitle}>
                Join 50,000+ students who have already secured funding and launched their careers through BraineX.
              </p>
              <div className={styles.ctaBtns}>
                <Link href="/signup" className={`ds-btn ds-btn-primary ${styles.btnLarge}`} style={{ display: 'inline-flex' }}>
                  Create Free Account
                </Link>
                <div className={styles.ctaFeatures}>
                  <span>✓ No credit card required</span>
                  <span>✓ Expert-vetted resources</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

