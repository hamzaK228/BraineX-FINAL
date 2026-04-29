"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Plus, X, Globe, DollarSign, Calendar, ExternalLink, Bookmark, Trash2 } from "lucide-react";

export default function ScholarshipsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const [scholarships, setScholarships] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");

  const fetchScholarships = useCallback(async () => {
    try {
      const res = await fetch("/api/scholarships");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setScholarships(data.map((s: any) => ({ id: s.id, title: s.name, provider: s.provider || "", amount: s.amount || "Variable", deadline: s.deadline ? new Date(s.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA", status: s.status || "saved", link: s.link || "" })));
        }
      }
    } catch { /* fallback */ }
  }, []);

  useEffect(() => { fetchScholarships(); }, [fetchScholarships]);

  const [isAdding, setIsAdding] = useState(false);
  const [newScholarship, setNewScholarship] = useState({
    title: "",
    provider: "",
    amount: "",
    deadline: "",
    status: "saved",
    link: ""
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScholarship.title.trim() || !newScholarship.provider.trim()) return;

    setScholarships([
      {
        id: Date.now(),
        title: newScholarship.title,
        provider: newScholarship.provider,
        amount: newScholarship.amount || "Variable",
        deadline: newScholarship.deadline || "TBA",
        status: newScholarship.status,
        link: newScholarship.link
      },
      ...scholarships
    ]);

    setNewScholarship({ title: "", provider: "", amount: "", deadline: "", status: "saved", link: "" });
    setIsAdding(false);

    try {
      await fetch("/api/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newScholarship.title, provider: newScholarship.provider, amount: newScholarship.amount, deadline: newScholarship.deadline || null, status: newScholarship.status, link: newScholarship.link }),
      });
    } catch { /* silent */ }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setScholarships(scholarships.map(s => s.id === id ? { ...s, status: newStatus } : s));
    try { await fetch(`/api/scholarships/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) }); } catch { /* silent */ }
  };

  const deleteScholarship = async (id: string) => {
    setScholarships(scholarships.filter(s => s.id !== id));
    try { await fetch(`/api/scholarships/${id}`, { method: "DELETE" }); } catch { /* silent */ }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted": return "#10b981"; // Green
      case "applied": return "#3b82f6"; // Blue
      case "rejected": return "#ef4444"; // Red
      case "saved":
      default: return "#f59e0b"; // Yellow/Orange
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "1200px", margin: "0 auto", paddingBottom: "3rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Award size={32} color="#f59e0b" /> My Scholarships
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Track opportunities, save financial aid, and monitor application statuses.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#f59e0b", color: "white" }}>
          <Plus size={20} /> Add Scholarship
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none" }}>
        {["All", "saved", "applied", "accepted", "rejected"].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            style={{ 
              padding: "0.5rem 1.2rem", 
              borderRadius: "100px", 
              border: filter === f ? "none" : "1px solid var(--card-border)", 
              background: filter === f ? "#f59e0b" : "var(--bg-color)", 
              color: filter === f ? "white" : "var(--text-color)", 
              cursor: "pointer", 
              fontWeight: "600", 
              fontSize: "0.9rem", 
              transition: "all 0.2s",
              textTransform: f === "All" ? "none" : "capitalize"
            }}
          >
            {f === "All" ? "All" : f}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {scholarships.filter(s => filter === "All" || s.status === filter).map((s) => (
          <motion.div variants={itemVariants} key={s.id}>
            <div 
              style={{ 
                background: "var(--card-bg)", 
                border: "1px solid var(--card-border)", 
                borderRadius: "24px", 
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                height: "100%",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Top Accent Line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: getStatusColor(s.status) }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "16px", 
                    background: "var(--bg-color)", 
                    border: "1px solid var(--card-border)",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: "4px"
                  }}>
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${s.provider.toLowerCase().replace(/ /g, "")}.com&sz=128`} 
                      alt={s.provider} 
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 15l-2 5L9 9l11 4-5 2zm0 0l4 4'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem", lineHeight: "1.3" }}>{s.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "500" }}>
                      <Globe size={14} /> {s.provider}
                    </div>
                  </div>
                </div>
                
                <select 
                  value={s.status} 
                  onChange={(e) => updateStatus(s.id, e.target.value)}
                  style={{ 
                    padding: "0.25rem 0.5rem", 
                    borderRadius: "8px", 
                    border: `1px solid ${getStatusColor(s.status)}50`, 
                    background: `${getStatusColor(s.status)}10`, 
                    color: getStatusColor(s.status), 
                    fontSize: "0.75rem", 
                    fontWeight: "700",
                    outline: "none",
                    cursor: "pointer",
                    textTransform: "uppercase"
                  }}
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", background: "var(--bg-color)", padding: "1rem", borderRadius: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-color)", fontSize: "0.9rem", fontWeight: "600" }}>
                  <DollarSign size={16} color="var(--text-muted)" /> {s.amount}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--text-color)", fontSize: "0.9rem", fontWeight: "600" }}>
                  <Calendar size={16} color="var(--text-muted)" /> {s.deadline}
                </div>
              </div>

              <div style={{ marginTop: "auto", display: "flex", gap: "0.5rem" }}>
                {s.link && (
                  <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "12px", background: "#f59e0b", color: "white", fontSize: "0.9rem", fontWeight: "600", transition: "all 0.2s", border: "none", boxShadow: "0 4px 10px rgba(245, 158, 11, var(--shadow-opacity))" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
                    <ExternalLink size={16} /> Visit Page
                  </a>
                )}
                <button onClick={() => deleteScholarship(s.id)} style={{ padding: "0.75rem", borderRadius: "12px", background: "var(--bg-color)", border: "1px solid var(--card-border)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#ef444415"} onMouseOut={e => e.currentTarget.style.background = "var(--bg-color)"} title="Delete Scholarship">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {scholarships.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", color: "var(--text-muted)", background: "var(--card-bg)", borderRadius: "24px", border: "1px dashed var(--card-border)" }}>
            No scholarships tracked yet. Click "Add Scholarship" to start saving opportunities.
          </div>
        )}
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
              style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "500px", position: "relative", zIndex: 1, boxShadow: "0 20px 40px rgba(0,0,0,var(--shadow-opacity))" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Add Scholarship</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Scholarship Title *</label>
                  <input 
                    type="text" 
                    value={newScholarship.title}
                    onChange={(e) => setNewScholarship({...newScholarship, title: e.target.value})}
                    placeholder="e.g. Global Excellence Scholarship" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                    required
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Provider / University *</label>
                  <input 
                    type="text" 
                    value={newScholarship.provider}
                    onChange={(e) => setNewScholarship({...newScholarship, provider: e.target.value})}
                    placeholder="e.g. University of Melbourne" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    required
                  />
                </div>
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Amount / Value</label>
                    <input 
                      type="text" 
                      value={newScholarship.amount}
                      onChange={(e) => setNewScholarship({...newScholarship, amount: e.target.value})}
                      placeholder="e.g. $10,000" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Deadline</label>
                    <input 
                      type="text" 
                      value={newScholarship.deadline}
                      onChange={(e) => setNewScholarship({...newScholarship, deadline: e.target.value})}
                      placeholder="e.g. Oct 31, 2024" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Current Status</label>
                    <select 
                      value={newScholarship.status}
                      onChange={(e) => setNewScholarship({...newScholarship, status: e.target.value})}
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", appearance: "none" }}
                    >
                      <option value="saved">Saved (Planning)</option>
                      <option value="applied">Applied (Awaiting)</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Link to Application</label>
                  <input 
                    type="url" 
                    value={newScholarship.link}
                    onChange={(e) => setNewScholarship({...newScholarship, link: e.target.value})}
                    placeholder="https://..." 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAdding(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#f59e0b", color: "white" }}>Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
