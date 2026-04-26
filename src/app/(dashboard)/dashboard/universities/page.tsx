"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, MapPin, Search, Star, ExternalLink, Filter, Plus, X, Trash2 } from "lucide-react";

export default function UniversitiesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const ComfortCard = ({ children, style = {}, onMouseOver, onMouseOut }: any) => (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
      borderRadius: "24px",
      padding: "30px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      ...style
    }} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      {children}
    </div>
  );

  const FALLBACK = [
    { id: "1", name: "Stanford University", location: "Stanford, CA, USA", rank: "#2", match: "94%", logo: "https://logo.clearbit.com/stanford.edu" },
    { id: "2", name: "Massachusetts Institute of Technology", location: "Cambridge, MA, USA", rank: "#1", match: "88%", logo: "https://logo.clearbit.com/mit.edu" },
    { id: "3", name: "University of Oxford", location: "Oxford, UK", rank: "#3", match: "85%", logo: "https://logo.clearbit.com/ox.ac.uk" },
    { id: "4", name: "ETH Zurich", location: "Zurich, Switzerland", rank: "#7", match: "91%", logo: "https://logo.clearbit.com/ethz.ch" },
  ];

  const [savedUniversities, setSavedUniversities] = useState<any[]>(FALLBACK);
  const [filter, setFilter] = useState("All");

  const fetchUnis = useCallback(async () => {
    try {
      const res = await fetch("/api/universities");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSavedUniversities(data.map((u: any) => ({ id: u.id, name: u.name, location: u.location || "Unknown", rank: u.ranking || "N/A", match: u.matchScore ? `${u.matchScore}%` : "TBD", logo: "🏫" })));
        }
      }
    } catch { /* fallback */ }
  }, []);

  useEffect(() => { fetchUnis(); }, [fetchUnis]);

  const [isAdding, setIsAdding] = useState(false);
  const [newUni, setNewUni] = useState({ name: "", location: "", rank: "", match: "" });

  const handleAddUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUni.name.trim()) return;
    
    setSavedUniversities([{
      id: Date.now(),
      name: newUni.name,
      location: newUni.location || "Unknown Location",
      rank: newUni.rank || "N/A",
      match: newUni.match ? `${newUni.match}%` : "TBD",
      logo: null
    }, ...savedUniversities]);
    
    setNewUni({ name: "", location: "", rank: "", match: "" });
    setIsAdding(false);

    try {
      await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUni.name, location: newUni.location, ranking: newUni.rank, matchScore: parseInt(newUni.match) || null }),
      });
    } catch { /* silent */ }
  };

  const deleteUniversity = async (id: string) => {
    setSavedUniversities(savedUniversities.filter(uni => uni.id !== id));
    try { await fetch(`/api/universities/${id}`, { method: "DELETE" }); } catch { /* silent */ }
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
            <Building size={32} color="#6366f1" /> Saved Universities
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Track and compare the universities you are applying to.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" placeholder="Search saved universities..." style={{ padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "100px", background: "var(--bg-color)", border: "1px solid var(--card-border)", color: "var(--text-color)", outline: "none", width: "250px" }} />
          </div>
          <button onClick={() => setIsAdding(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>
            <Plus size={20} /> Add University
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none" }}>
        {["All", "Top Ranked", "High Match"].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            style={{ 
              padding: "0.5rem 1.2rem", 
              borderRadius: "100px", 
              border: filter === f ? "none" : "1px solid var(--card-border)", 
              background: filter === f ? "#6366f1" : "var(--bg-color)", 
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {savedUniversities.filter(u => {
          if (filter === "Top Ranked") return u.rank && parseInt(u.rank.replace(/[^0-9]/g, '')) <= 20;
          if (filter === "High Match") return u.match && parseInt(u.match.replace(/[^0-9]/g, '')) >= 90;
          return true;
        }).map((uni) => (
          <motion.div variants={itemVariants} key={uni.id}>
            <ComfortCard style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", cursor: "pointer", transition: "transform 0.2s" }} onMouseOver={(e: any) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e: any) => e.currentTarget.style.transform = 'translateY(0)'}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ width: "60px", height: "60px", background: "var(--bg-color)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--card-border)", overflow: "hidden" }}>
                    {uni.logo && uni.logo.startsWith("http") ? (
                      <img src={uni.logo} alt={uni.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px", background: "white" }} />
                    ) : (
                      <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#6366f1" }}>{uni.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", lineHeight: "1.3" }}>{uni.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      <MapPin size={14} /> {uni.location}
                    </div>
                  </div>
                </div>
                <button style={{ background: "transparent", border: "none", color: "#f59e0b", cursor: "pointer" }}>
                  <Star fill="#f59e0b" size={20} />
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", padding: "1rem", background: "var(--bg-color)", borderRadius: "16px", border: "1px dashed var(--card-border)" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem" }}>Global Rank</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-color)" }}>{uni.rank}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem" }}>Admit Match</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "#10b981" }}>{uni.match}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button style={{ flex: 1, padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "transparent", color: "var(--text-color)", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background='var(--bg-color)'} onMouseOut={e => e.currentTarget.style.background='transparent'}>
                  Compare
                </button>
                <button style={{ flex: 1, padding: "0.75rem", borderRadius: "12px", border: "none", background: "#6366f1", color: "white", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  View Details <ExternalLink size={16} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteUniversity(uni.id); }} 
                  style={{ padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "transparent", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} 
                  onMouseOver={e => { e.currentTarget.style.background='#ef444415'; e.currentTarget.style.borderColor='#ef4444'; }} 
                  onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='var(--card-border)'; }}
                  title="Remove University"
                >
                  <Trash2 size={18} />
                </button>
              </div>

            </ComfortCard>
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
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Add University</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddUniversity} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>University Name</label>
                  <input 
                    type="text" 
                    value={newUni.name}
                    onChange={(e) => setNewUni({...newUni, name: e.target.value})}
                    placeholder="e.g. Harvard University" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Location</label>
                  <input 
                    type="text" 
                    value={newUni.location}
                    onChange={(e) => setNewUni({...newUni, location: e.target.value})}
                    placeholder="e.g. Cambridge, MA" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                  />
                </div>
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Global Rank (Optional)</label>
                    <input 
                      type="text" 
                      value={newUni.rank}
                      onChange={(e) => setNewUni({...newUni, rank: e.target.value})}
                      placeholder="e.g. #4" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Match % (Optional)</label>
                    <input 
                      type="number" 
                      value={newUni.match}
                      onChange={(e) => setNewUni({...newUni, match: e.target.value})}
                      placeholder="e.g. 92" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAdding(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>Save University</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
