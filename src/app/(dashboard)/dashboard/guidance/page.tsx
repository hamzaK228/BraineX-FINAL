"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, BookOpen, GraduationCap, Users, ArrowRight, Compass, Star, ChevronDown, CheckCircle } from "lucide-react";

const guidanceData = [
  {
    id: 1,
    category: "Fields",
    title: "Computer Science & Tech",
    icon: <Compass size={24} color="#3b82f6" />,
    tips: [
      "Master core algorithmic patterns (Sliding Window, Two Pointers, BFS/DFS) rather than simply memorizing individual coding problems.",
      "Build full-stack side projects that solve real-world problems, and deploy them to demonstrate your end-to-end competency.",
      "Contribute to significant open-source repositories. A merged pull request in a popular library holds tremendous weight.",
      "Develop strong communication skills. The most successful engineers can easily explain complex technical architecture to non-technical stakeholders."
    ]
  },
  {
    id: 2,
    category: "Fields",
    title: "Business Admin & Finance",
    icon: <Star size={24} color="#f59e0b" />,
    tips: [
      "Familiarize yourself with DCF (Discounted Cash Flow) modeling and advanced Excel mechanics before pursuing your first internship.",
      "Network aggressively but authentically. Schedule informational 'coffee chats' with alumni to understand their exact career progression.",
      "Read financial publications daily to build a robust macroeconomic perspective, which is crucial for technical interviews.",
      "Pursue leadership roles in relevant campus organizations (e.g., Investment Group, Consulting Club) to prove managerial potential early."
    ]
  },
  {
    id: 3,
    category: "Programs",
    title: "Top-Tier Admissions",
    icon: <GraduationCap size={24} color="#ec4899" />,
    tips: [
      "Cultivate an 'angular' profile. Elite universities don't necessarily want well-rounded students; they want a well-rounded class made of distinct specialists.",
      "Take the most rigorous curriculum available to you and excel, but never let academics completely sacrifice your unique extracurricular narrative.",
      "Your personal statement must convey intellectual vitality—a genuine, unprompted curiosity and passion for learning beyond the classroom.",
      "Secure letters of recommendation from individuals who can speak deeply to your resilience, problem-solving, and character."
    ]
  },
  {
    id: 4,
    category: "Admissions",
    title: "Writing the Personal Statement",
    icon: <BookOpen size={24} color="#10b981" />,
    tips: [
      "Avoid the 'resume in prose' trap. Your essay should reveal who you fundamentally are, not just reiterate what you've achieved.",
      "Start with a compelling, highly specific vignette to immediately hook the reader and establish your voice.",
      "Focus on vulnerability and internal growth. The most powerful essays often discuss failures, realizations, or profound shifts in perspective.",
      "Read your draft out loud. If it doesn't sound exactly like your authentic speaking voice, you need to revise for a more natural tone."
    ]
  },
  {
    id: 5,
    category: "Mentorship",
    title: "How to Find a Mentor",
    icon: <Users size={24} color="#8b5cf6" />,
    tips: [
      "Don't abruptly ask 'Will you be my mentor?' Let the relationship naturally evolve through consistent, value-driven interactions over time.",
      "Do your homework before reaching out. Reference specific projects, papers, or articles they've authored to demonstrate your genuine interest.",
      "Respect their time above all else. When asking for advice, frame highly specific, localized questions rather than broad, existential ones.",
      "Implement their feedback immediately and follow up. Mentors heavily invest in people who take tangible action based on their advice."
    ]
  },
  {
    id: 6,
    category: "Admissions",
    title: "Acing the Interview",
    icon: <CheckCircle size={24} color="#f43f5e" />,
    tips: [
      "Treat the interview as a collaborative conversation, not a strict interrogation. Attempt to find common ground with your interviewer early on.",
      "Utilize the STAR method (Situation, Task, Action, Result) to structure your answers, ensuring they remain concise, logical, and impactful.",
      "Prepare a list of highly nuanced questions about the institution that cannot be easily answered by simply browsing their public website.",
      "Be entirely ready to articulate not just why you want to attend, but exactly how you will contribute to their specific campus community."
    ]
  }
];

const categories = ["All", "Fields", "Programs", "Admissions", "Mentorship"];

export default function GuidancePage() {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredData = activeTab === "All" ? guidanceData : guidanceData.filter(item => item.category === activeTab);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "1200px", margin: "0 auto", paddingBottom: "3rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Lightbulb size={32} color="#f59e0b" /> Guidance & Tips
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Expert advice, actionable tips, and detailed guidance for your journey.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none" }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "100px",
              border: "none",
              background: activeTab === category ? "var(--text-color)" : "var(--card-bg)",
              color: activeTab === category ? "var(--bg-color)" : "var(--text-muted)",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap"
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
        <AnimatePresence mode="popLayout">
          {filteredData.map(item => (
            <motion.div 
              layout
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id}
              style={{ 
                background: "var(--card-bg)", 
                border: "1px solid var(--card-border)", 
                borderRadius: "20px", 
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "15px", 
                  background: "var(--bg-color)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  border: "1px solid var(--card-border)"
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
                    {item.category}
                  </span>
                  <h3 style={{ margin: "0.25rem 0 0 0", fontSize: "1.2rem", fontWeight: "700" }}>{item.title}</h3>
                </div>
                <motion.div
                  animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={20} color="var(--text-muted)" />
                </motion.div>
              </div>

              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ 
                      padding: "1.25rem", 
                      background: "var(--bg-color)", 
                      borderRadius: "15px",
                      border: "1px solid var(--card-border)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <Lightbulb size={18} color="#f59e0b" />
                        <h4 style={{ margin: 0, fontSize: "1rem" }}>Pro Tips</h4>
                      </div>
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: "1.2rem", 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "0.75rem",
                        color: "var(--text-muted)",
                        fontSize: "0.95rem",
                        lineHeight: "1.5"
                      }}>
                        {item.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                      
                      <button style={{
                        marginTop: "1.5rem",
                        width: "100%",
                        padding: "0.75rem",
                        background: "var(--text-color)",
                        color: "var(--bg-color)",
                        border: "none",
                        borderRadius: "10px",
                        fontWeight: "600",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer"
                      }}>
                        Read More Details <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
