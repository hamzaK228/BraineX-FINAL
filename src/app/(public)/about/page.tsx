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
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} className={styles.missionGrid}>
              <motion.div variants={fadeIn} whileHover={{ y: -10, scale: 1.02 }} className={`${styles.missionCard}`}>
                <div className={styles.missionIcon}>🎯</div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Our Mission</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  To democratize access to quality education by connecting students with scholarships,
                  mentors, and opportunities worldwide, regardless of their background or location.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} whileHover={{ y: -10, scale: 1.02 }} className={`${styles.missionCard}`}>
                <div className={styles.missionIcon}>🔮</div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Our Vision</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  A world where every ambitious student has the tools, guidance, and opportunities
                  needed to achieve their educational and career aspirations.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} whileHover={{ y: -10, scale: 1.02 }} className={`${styles.missionCard}`}>
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
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger} className={styles.teamGrid}>
              {[
                { name: "Sofia Erkinbekova", title: "CEO & Founder", bio: "Leading BraineX with a vision to revolutionize the educational landscape through technology and accessibility.", image: "/team/sofia.jpg" },
                { name: "Hamza Kozubaev", title: "CTO (Tech Lead)", bio: "Architecting the future of BraineX with cutting-edge tech and a passion for scalable systems.", image: "/team/hamza.jpg" },
                { name: "Shirin Turdubaeva", title: "CTO Assistant", bio: "Bridging the gap between strategy and execution, ensuring technical excellence across the platform.", image: "/team/shirin.jpg" },
                { name: "Rufina Erkinbekova", title: "Visual Designer", bio: "Crafting the premium, intuitive visual language that defines the BraineX user experience.", image: "/team/rufina.jpg" },
                { name: "Chyngyz Sultanbekov", title: "PR Manager & Coordinator", bio: "Building the BraineX brand and coordinating outreach to connect with students globally.", image: "/team/chyngyz.jpg" },
                { name: "Bermet Begalieva", title: "Coordinator & Mentor", bio: "Providing expert guidance and coordination to ensure every student finds their path to success.", image: "/team/bermet.jpg" },
                { name: "Binazir Zhumanazarova", title: "Content Creator", bio: "Developing engaging educational content that inspires and informs the BraineX community.", image: "/team/binazir.jpg" },
                { name: "Ademi Usupbaeva", title: "Coordinator & Mentor", bio: "Supporting student growth through personalized mentorship and efficient program coordination.", image: "/team/ademi.jpg" }
              ].map((member, i) => (
                <motion.div key={i} variants={fadeIn} whileHover={{ y: -10, scale: 1.02 }} className={`${styles.teamMember}`}>
                  <div className={styles.memberAvatar}>
                    {member.image ? (
                      <img src={member.image} alt={member.name} className={styles.avatarImg} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      member.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{member.name}</h3>
                  <p className={styles.memberTitle}>{member.title}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", flexGrow: 1, marginTop: "1rem" }}>{member.bio}</p>
                  <div className={styles.memberSocial}>
                    <Link href="#" target="_blank">LinkedIn</Link>
                    <Link href="#" target="_blank">Portfolio</Link>
                  </div>
                </motion.div>
              ))}
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
              style={{ padding: "4rem 2rem", background: "var(--section-bg-2)", border: "1px solid var(--card-border)" }}
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

