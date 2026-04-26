"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ExternalLink, GraduationCap, Building, Star, Search, Filter, Trash2, Heart, Rocket, Map } from "lucide-react";
import Link from "next/link";
import { useSaved } from "@/context/SavedContext";

export default function SavedItemsPage() {
  const { savedItems, removeItem } = useSaved();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case "University": return <Building size={20} color="#6366f1" />;
      case "Program": return <GraduationCap size={20} color="#10b981" />;
      case "Scholarship": return <Star size={20} color="#f59e0b" />;
      case "Project": return <Rocket size={20} color="#a855f7" />;
      case "Roadmap": return <Map size={20} color="#06b6d4" />;
      case "Mentor": return <Heart size={20} color="#f43f5e" />;
      default: return <Bookmark size={20} color="#64748b" />;
    }
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
            <Bookmark size={32} color="#6366f1" /> Saved Items
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>All your bookmarked scholarships, programs, and opportunities in one place.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" placeholder="Search saved items..." style={{ padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-color)", outline: "none", width: "250px" }} />
          </div>
          <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "0.75rem 1.5rem", color: "var(--text-color)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}>
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "8rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <Bookmark size={48} style={{ color: "rgba(255,255,255,0.1)", marginBottom: "1.5rem" }} />
          <h3>No saved items yet</h3>
          <p style={{ color: "var(--text-muted)", maxWidth: "400px", margin: "0.5rem auto 2rem" }}>
            Start exploring universities, scholarships, and projects and click the bookmark icon to save them here.
          </p>
          <Link href="/universities" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 2rem", borderRadius: "100px", textDecoration: "none" }}>
            Explore Opportunities
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          <AnimatePresence>
            {savedItems.map((item) => (
              <motion.div 
                layout
                variants={itemVariants} 
                initial="hidden" 
                animate="visible" 
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
              >
                <div style={{ 
                  background: "rgba(30, 41, 59, 0.4)", 
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)", 
                  borderRadius: "24px", 
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
                className="saved-card"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ 
                      width: "50px", 
                      height: "50px", 
                      borderRadius: "16px", 
                      background: "rgba(255, 255, 255, 0.05)", 
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center" 
                    }}>
                      {getIcon(item.type)}
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      style={{ background: "transparent", border: "none", color: "#6366f1", cursor: "pointer" }}
                    >
                      <Bookmark size={20} fill="#6366f1" />
                    </button>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: "bold", padding: "0.25rem 0.75rem", borderRadius: "100px", background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", color: "#a5b4fc", marginBottom: "0.75rem", display: "inline-block", textTransform: "uppercase" }}>
                      {item.type}
                    </span>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", lineHeight: "1.3", color: "white" }}>{item.title}</h3>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.5" }}>{item.source}</p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <Link href="#" style={{ textDecoration: "none", color: "#6366f1", fontWeight: "600", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      View Details <ExternalLink size={16} />
                    </Link>
                    <button onClick={() => removeItem(item.id)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem", borderRadius: "8px", transition: "all 0.2s" }} title="Remove Item">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
