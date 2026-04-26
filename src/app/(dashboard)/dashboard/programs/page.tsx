"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Search, Filter, Bookmark, DollarSign, Clock, MapPin, Award, Plus, X, Trash2 } from "lucide-react";

export default function ProgramsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const [programs, setPrograms] = useState([
    { id: 1, name: "B.S. Computer Science", university: "Stanford University", location: "Stanford, CA", type: "Bachelor's", duration: "4 Years", tuition: "$55,473/yr", match: "High", logo: "https://logo.clearbit.com/stanford.edu" },
    { id: 2, name: "M.S. Artificial Intelligence", university: "MIT", location: "Cambridge, MA", type: "Master's", duration: "2 Years", tuition: "$53,450/yr", match: "Medium", logo: "https://logo.clearbit.com/mit.edu" },
    { id: 3, name: "B.A. Economics", university: "University of Oxford", location: "Oxford, UK", type: "Bachelor's", duration: "3 Years", tuition: "£28,950/yr", match: "High", logo: "https://logo.clearbit.com/ox.ac.uk" },
    { id: 4, name: "B.S. Software Engineering", university: "ETH Zurich", location: "Zurich, Switzerland", type: "Bachelor's", duration: "3 Years", tuition: "CHF 1,460/yr", match: "Very High", logo: "https://logo.clearbit.com/ethz.ch" },
  ]);
  const [filter, setFilter] = useState("All");

  const [isAdding, setIsAdding] = useState(false);
  const [newProgram, setNewProgram] = useState({ name: "", university: "", location: "", type: "", duration: "", tuition: "" });

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.name.trim() || !newProgram.university.trim()) return;

    setPrograms([{
      id: Date.now(),
      name: newProgram.name,
      university: newProgram.university,
      location: newProgram.location || "TBD",
      type: newProgram.type || "Bachelor's",
      duration: newProgram.duration || "4 Years",
      tuition: newProgram.tuition || "TBD",
      match: "Medium",
      logo: null
    }, ...programs]);
    
    setNewProgram({ name: "", university: "", location: "", type: "", duration: "", tuition: "" });
    setIsAdding(false);
  };

  const deleteProgram = (id: number) => {
    setPrograms(programs.filter(prog => prog.id !== id));
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
            <GraduationCap size={32} color="#10b981" /> Saved Programs
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Compare specific degree programs and their requirements.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" placeholder="Search saved programs..." style={{ padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "100px", background: "var(--bg-color)", border: "1px solid var(--card-border)", color: "var(--text-color)", outline: "none", width: "250px" }} />
          </div>
          <button onClick={() => setIsAdding(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>
            <Plus size={20} /> Add Program
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none" }}>
        {["All", "Bachelor's", "Master's"].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            style={{ 
              padding: "0.5rem 1.2rem", 
              borderRadius: "100px", 
              border: filter === f ? "none" : "1px solid var(--card-border)", 
              background: filter === f ? "#10b981" : "var(--bg-color)", 
              color: filter === f ? "white" : "var(--text-color)", 
              cursor: "pointer", 
              fontWeight: "600", 
              fontSize: "0.9rem", 
              transition: "all 0.2s" 
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {programs.filter(p => {
          if (filter === "Bachelor's") return p.type === "Bachelor's";
          if (filter === "Master's") return p.type === "Master's";
          return true;
        }).map((prog, i) => (
          <motion.div variants={itemVariants} key={i}>
            <div style={{ 
              background: "var(--card-bg)", 
              border: "1px solid var(--card-border)", 
              borderRadius: "20px", 
              padding: "1.5rem 2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.5rem",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateX(5px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.03)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ width: "60px", height: "60px", background: "var(--bg-color)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--card-border)", overflow: "hidden" }}>
                  {prog.logo && prog.logo.startsWith("http") ? (
                    <img src={prog.logo} alt={prog.university} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px", background: "white" }} />
                  ) : (
                    <GraduationCap size={30} color="#10b981" />
                  )}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>{prog.name}</h3>
                  <div style={{ display: "flex", gap: "1.5rem", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "500", flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><MapPin size={16} /> {prog.university}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><Award size={16} /> {prog.type}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "3rem", alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "right" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.9rem", justifyContent: "flex-end" }}>
                    <Clock size={16} /> {prog.duration}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-color)", fontSize: "0.9rem", fontWeight: "700", justifyContent: "flex-end" }}>
                    <DollarSign size={16} /> {prog.tuition === "0" ? "TBD" : prog.tuition}
                  </span>
                </div>
                <button style={{ background: "#10b981", color: "white", border: "none", borderRadius: "12px", padding: "0.6rem 1.2rem", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>
                  View Requirements
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteProgram(prog.id); }} 
                  style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.5rem", borderRadius: "50%", transition: "all 0.2s" }} 
                  onMouseOver={e => e.currentTarget.style.background = '#ef444415'} 
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  title="Remove Program"
                >
                  <Trash2 size={22} />
                </button>
              </div>

            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
              onClick={() => setIsAdding(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "500px", position: "relative", zIndex: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Add Program</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddProgram} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Program Name</label>
                  <input 
                    type="text" 
                    value={newProgram.name}
                    onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                    placeholder="e.g. B.S. Computer Science" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>University</label>
                  <input 
                    type="text" 
                    value={newProgram.university}
                    onChange={(e) => setNewProgram({...newProgram, university: e.target.value})}
                    placeholder="e.g. Stanford University" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                  />
                </div>
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Degree Type</label>
                    <input 
                      type="text" 
                      value={newProgram.type}
                      onChange={(e) => setNewProgram({...newProgram, type: e.target.value})}
                      placeholder="e.g. Bachelor's" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Location</label>
                    <input 
                      type="text" 
                      value={newProgram.location}
                      onChange={(e) => setNewProgram({...newProgram, location: e.target.value})}
                      placeholder="e.g. Stanford, CA" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Duration</label>
                    <input 
                      type="text" 
                      value={newProgram.duration}
                      onChange={(e) => setNewProgram({...newProgram, duration: e.target.value})}
                      placeholder="e.g. 4 Years" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Tuition</label>
                    <input 
                      type="text" 
                      value={newProgram.tuition}
                      onChange={(e) => setNewProgram({...newProgram, tuition: e.target.value})}
                      placeholder="e.g. $55,000/yr" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAdding(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>Save Program</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
