"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Plus, Calendar, CheckCircle2, X, Trash2 } from "lucide-react";

export default function DeadlinesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const FALLBACK_DEADLINES = [
    { id: "1", title: "Stanford Early Action", type: "Application", date: "Nov 1, 2024", daysLeft: 18, color: "#f43f5e", status: "urgent" },
    { id: "2", title: "FAFSA Submission", type: "Financial Aid", date: "Nov 15, 2024", daysLeft: 32, color: "#f59e0b", status: "upcoming" },
    { id: "3", title: "SAT Registration", type: "Testing", date: "Dec 5, 2024", daysLeft: 52, color: "#3b82f6", status: "upcoming" },
    { id: "4", title: "Oxford Regular Decision", type: "Application", date: "Jan 1, 2025", daysLeft: 79, color: "#10b981", status: "future" },
  ];

  const [deadlines, setDeadlines] = useState<any[]>(FALLBACK_DEADLINES);

  const fetchDeadlines = useCallback(async () => {
    try {
      const res = await fetch("/api/deadlines");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDeadlines(data.map((d: any) => {
            const targetDate = new Date(d.dueDate);
            const today = new Date();
            const diffDays = Math.ceil(Math.abs(targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            let color = "#10b981", status = "future";
            if (diffDays < 20) { color = "#f43f5e"; status = "urgent"; }
            else if (diffDays < 60) { color = "#f59e0b"; status = "upcoming"; }
            return { id: d.id, title: d.title, type: d.type || "Other", date: targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), daysLeft: diffDays, color, status };
          }));
        }
      }
    } catch { /* fallback */ }
  }, []);

  useEffect(() => { fetchDeadlines(); }, [fetchDeadlines]);

  const [isAdding, setIsAdding] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ title: "", type: "", date: "" });

  const handleAddDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadline.title.trim() || !newDeadline.date) return;
    
    // Simple mock calculation for days left based on selected date
    const targetDate = new Date(newDeadline.date);
    const today = new Date();
    const diffTime = Math.abs(targetDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let color = "#10b981";
    let status = "future";
    if (diffDays < 20) { color = "#f43f5e"; status = "urgent"; }
    else if (diffDays < 60) { color = "#f59e0b"; status = "upcoming"; }
    
    setDeadlines([...deadlines, { 
      id: Date.now(), 
      title: newDeadline.title, 
      type: newDeadline.type || "Other", 
      date: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
      daysLeft: diffDays, 
      color, 
      status 
    }]);
    
    setNewDeadline({ title: "", type: "", date: "" });
    setIsAdding(false);

    try {
      await fetch("/api/deadlines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newDeadline.title, type: newDeadline.type || "Other", dueDate: newDeadline.date }),
      });
    } catch { /* silent */ }
  };

  const removeDeadline = async (id: string) => {
    setDeadlines(deadlines.filter(d => d.id !== id));
    try { await fetch(`/api/deadlines/${id}`, { method: "DELETE" }); } catch { /* silent */ }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "1200px", margin: "0 auto", paddingBottom: "3rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Clock size={32} color="#f43f5e" /> Upcoming Deadlines
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Never miss an important application or test date.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#f43f5e", color: "white" }}>
          <Plus size={20} /> Add Deadline
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {deadlines.map((deadline) => (
          <motion.div variants={itemVariants} key={deadline.id}>
            <div style={{ 
              background: "var(--card-bg)", 
              border: `1px solid ${deadline.status === 'urgent' ? 'rgba(244,63,94,0.3)' : 'var(--card-border)'}`, 
              borderRadius: "24px", 
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: deadline.status === 'urgent' ? "0 10px 30px rgba(244,63,94,0.05)" : "0 4px 20px rgba(0,0,0,0.02)",
              position: "relative",
              overflow: "hidden"
            }}>
              {deadline.status === 'urgent' && (
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "#f43f5e" }} />
              )}
              
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
                <div style={{ 
                  width: "70px", 
                  height: "70px", 
                  borderRadius: "20px", 
                  background: `rgba(${deadline.color === '#f43f5e' ? '244,63,94' : deadline.color === '#f59e0b' ? '245,158,11' : deadline.color === '#3b82f6' ? '59,130,246' : '16,185,129'}, 0.1)`, 
                  display: "flex", 
                  flexDirection: "column",
                  alignItems: "center", 
                  justifyContent: "center",
                  color: deadline.color
                }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: "800", lineHeight: "1" }}>{deadline.daysLeft}</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase" }}>Days</span>
                </div>
                
                <div>
                  <span style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "bold", color: "var(--text-muted)", marginBottom: "0.5rem", display: "inline-block" }}>
                    {deadline.type}
                  </span>
                  <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.3rem" }}>{deadline.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    <Calendar size={16} /> {deadline.date}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button onClick={() => removeDeadline(deadline.id)} style={{ width: "45px", height: "45px", borderRadius: "50%", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#10b981';}} onMouseOut={e => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-color)'; e.currentTarget.style.borderColor = 'var(--card-border)';}}>
                  <CheckCircle2 size={20} />
                </button>
                <button onClick={() => removeDeadline(deadline.id)} style={{ width: "45px", height: "45px", borderRadius: "50%", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => {e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#ef4444';}} onMouseOut={e => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-color)'; e.currentTarget.style.borderColor = 'var(--card-border)';}}>
                  <Trash2 size={20} />
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
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Add New Deadline</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddDeadline} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Title</label>
                  <input 
                    type="text" 
                    value={newDeadline.title}
                    onChange={(e) => setNewDeadline({...newDeadline, title: e.target.value})}
                    placeholder="e.g. Stanford Early Action" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Category</label>
                  <select 
                    value={newDeadline.type}
                    onChange={(e) => setNewDeadline({...newDeadline, type: e.target.value})}
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", appearance: "none" }}
                  >
                    <option value="">Select Category</option>
                    <option value="Application">Application</option>
                    <option value="Testing">Testing</option>
                    <option value="Financial Aid">Financial Aid</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Date</label>
                  <input 
                    type="date" 
                    value={newDeadline.date}
                    onChange={(e) => setNewDeadline({...newDeadline, date: e.target.value})}
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                  />
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAdding(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#f43f5e", color: "white" }}>Save Deadline</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
