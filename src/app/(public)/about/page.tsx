"use client";

import { motion } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
import Link from "next/link";
import styles from "./page.module.css";
import pageStyles from "../page.module.css"; // Reuse stats grid

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function AboutPage() {
  return (
    <>
      <PublicHeader />
      <main id="mainContent" role="main" style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <section className={styles.aboutHero}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <motion.h1 
              initial="hidden" animate="visible" variants={fadeIn}
              className="section-title gradient-text" 
              style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", marginBottom: "1.5rem" }}
            >
              About BraineX
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}
              style={{ fontSize: "1.25rem", color: "var(--text-muted)", margin: "0 auto" }}
            >
              Empowering students worldwide to achieve their educational dreams through innovative
              technology and expert guidance
            </motion.p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className={styles.missionGrid}>
              <motion.div variants={fadeIn} className={`glass-card ${styles.missionCard}`}>
                <div className={styles.missionIcon}>🎯</div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Our Mission</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  To democratize access to quality education by connecting students with scholarships,
                  mentors, and opportunities worldwide, regardless of their background or location.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className={`glass-card ${styles.missionCard}`}>
                <div className={styles.missionIcon}>🔮</div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Our Vision</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  A world where every ambitious student has the tools, guidance, and opportunities
                  needed to achieve their educational and career aspirations.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className={`glass-card ${styles.missionCard}`}>
                <div className={styles.missionIcon}>⚖️</div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Our Values</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  Accessibility, Excellence, Innovation, Integrity, and Community. We believe in
                  empowering students through technology and human connection.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>


        {/* Team Section */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="section-title text-center"
            >
              👥 Meet Our Team
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className={styles.teamGrid}>
              {[
                { initials: "AK", name: "Alex Kumar", title: "Founder & CEO", edu: "Harvard MBA, Stanford CS", bio: "Former Google engineer passionate about democratizing education access. Started BraineX after receiving mentorship that changed his life." },
                { initials: "SR", name: "Sarah Rodriguez", title: "Head of Education", edu: "MIT PhD Education", bio: "Education researcher with 10+ years experience designing learning platforms. Expert in personalized learning and student success." },
                { initials: "MJ", name: "Michael Johnson", title: "CTO", edu: "Stanford MS CS", bio: "Tech leader with experience at Facebook and Uber. Builds scalable platforms that connect millions of students worldwide." },
                { initials: "PW", name: "Priya Williams", title: "Head of Partnerships", edu: "Oxford MBA", bio: "Partnership strategist who has built relationships with 500+ universities and organizations to expand opportunities for students." }
              ].map((member, i) => (
                <motion.div key={i} variants={fadeIn} className={`glass-card ${styles.teamMember}`}>
                  <div className={styles.memberAvatar}>{member.initials}</div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{member.name}</h3>
                  <p className={styles.memberTitle}>{member.title}</p>
                  <p className={styles.memberEducation}>{member.edu}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", flexGrow: 1 }}>{member.bio}</p>
                  <div className={styles.memberSocial}>
                    <Link href="https://linkedin.com/company/brainex" target="_blank">LinkedIn</Link>
                    <Link href="https://twitter.com/brainex" target="_blank">Twitter</Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Company Timeline */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="section-title text-center"
            >
              📈 Our Journey
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className={styles.timeline}>
              {[
                { year: "2020", title: "The Beginning", desc: "Founded with a mission to help students find scholarships and mentorship opportunities." },
                { year: "2021", title: "Platform Launch", desc: "Launched beta platform with 50 mentors and 500 scholarship opportunities." },
                { year: "2022", title: "Global Expansion", desc: "Expanded to 50 countries with partnerships at 100+ universities." },
                { year: "2023", title: "AI Integration", desc: "Introduced AI-powered matching and personalized roadmaps." },
                { year: "2024", title: "Major Milestone", desc: "Reached 50,000 active students and $50M+ in scholarships facilitated." },
                { year: "2025", title: "Future Vision", desc: "Launching advanced features and expanding to 200+ countries." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className={styles.timelineItem}>
                  <div className={styles.timelineMarker}>{item.year}</div>
                  <div className={`glass-card ${styles.timelineContent}`} style={{ padding: "1.5rem" }}>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className={`glass-card ${styles.contactGrid}`} style={{ padding: "3rem" }}
            >
              <div>
                <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>📞 Get in Touch</h2>
                <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📧</div>
                  <div>
                    <h4>Email</h4>
                    <p>hello@edugateway.com</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📱</div>
                  <div>
                    <h4>Phone</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>📍</div>
                  <div>
                    <h4>Address</h4>
                    <p>123 Innovation Drive<br />San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>
              
              <div>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>First Name</label>
                      <input type="text" placeholder="First Name" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Last Name</label>
                      <input type="text" placeholder="Last Name" required />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input type="email" placeholder="Email Address" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Subject</label>
                    <input type="text" placeholder="Subject" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Your Message</label>
                    <textarea placeholder="Your Message" rows={5} required></textarea>
                  </div>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ width: "100%" }}>
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`glass-card text-center`}
              style={{ padding: "4rem 2rem", background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))", border: "1px solid rgba(168,85,247,0.3)" }}
            >
              <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Ready to Start Your Journey?</h2>
              <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", maxWidth: "700px", margin: "0 auto 2rem" }}>
                Join thousands of students who are already shaping their future with BraineX. Create your free account today and unlock a world of opportunities.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/signup" className="ds-btn ds-btn-primary" style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}>
                  Create Free Account
                </Link>
                <Link href="/scholarships" className="ds-btn ds-btn-secondary" style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}>
                  Explore Scholarships
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

