"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Flag, CheckCircle2, Circle, Lock, Plus, X, ArrowLeft, MoreVertical, Route, Trash2 } from "lucide-react";

export default function RoadmapsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  // State for all roadmaps
  const [roadmaps, setRoadmaps] = useState([
    {
      id: 1,
      title: "Application Roadmap",
      desc: "Your step-by-step journey to getting accepted.",
      iconColor: "#8b5cf6",
      steps: [
        { id: 101, title: "Standardized Testing", desc: "SAT/ACT Prep and Exams", status: "completed", date: "Aug 2024" },
        { id: 102, title: "University Shortlisting", desc: "Finalize top 10 choices", status: "completed", date: "Sep 2024" },
        { id: 103, title: "Personal Statement", desc: "Drafting and revision", status: "in-progress", date: "Oct 2024" },
        { id: 104, title: "Recommendation Letters", desc: "Request from professors", status: "in-progress", date: "Oct 2024" },
        { id: 105, title: "Submit Applications", desc: "Early Action / Regular", status: "locked", date: "Nov-Jan 2025" },
        { id: 106, title: "Financial Aid (FAFSA)", desc: "Submit all documentation", status: "locked", date: "Feb 2025" },
        { id: 107, title: "Decision Letters", desc: "Acceptances arrive!", status: "locked", date: "Mar-Apr 2025" },
      ]
    },
    {
      id: 2,
      title: "Learn Python",
      desc: "Master Python programming from scratch to advanced.",
      iconColor: "#10b981",
      steps: [
        { id: 201, title: "Basics of Python", desc: "Variables, loops, and conditions", status: "in-progress", date: "Anytime" },
        { id: 202, title: "Data Structures", desc: "Lists, dictionaries, sets", status: "locked", date: "TBD" },
      ]
    }
  ]);

  const fetchRoadmaps = useCallback(async () => {
    try {
      const res = await fetch("/api/roadmaps");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRoadmaps(data.map((rm: any) => ({ id: rm.id, title: rm.title, desc: rm.description || "", iconColor: rm.color || "#8b5cf6", steps: (rm.steps || []).map((s: any) => ({ id: s.id, title: s.title, desc: s.description || "", status: s.status, date: s.date || "TBD" })) })));
        }
      }
    } catch { /* fallback */ }
  }, []);

  useEffect(() => { fetchRoadmaps(); }, [fetchRoadmaps]);

  const [activeRoadmapId, setActiveRoadmapId] = useState<number | null>(null);

  // Modal states
  const [isAddingRoadmap, setIsAddingRoadmap] = useState(false);
  const [newRoadmap, setNewRoadmap] = useState({ title: "", desc: "", color: "#8b5cf6" });

  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStep, setNewStep] = useState({ title: "", desc: "", status: "locked", date: "" });

  const handleAddRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoadmap.title.trim()) return;

    const temp = { id: Date.now(), title: newRoadmap.title, desc: newRoadmap.desc || "A custom roadmap", iconColor: newRoadmap.color, steps: [] as any[] };
    setRoadmaps([...roadmaps, temp]);
    setNewRoadmap({ title: "", desc: "", color: "#8b5cf6" });
    setIsAddingRoadmap(false);

    try {
      const res = await fetch("/api/roadmaps", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: temp.title, description: temp.desc, color: temp.iconColor }) });
      if (res.ok) { const saved = await res.json(); setRoadmaps(prev => prev.map(r => r.id === temp.id ? { ...r, id: saved.id } : r)); }
    } catch { /* silent */ }
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.title.trim() || activeRoadmapId === null) return;

    const tempStep = { id: Date.now(), title: newStep.title, desc: newStep.desc || "No description", status: newStep.status, date: newStep.date || "TBD" };
    setRoadmaps(roadmaps.map(rm => rm.id === activeRoadmapId ? { ...rm, steps: [...rm.steps, tempStep] } : rm));
    setNewStep({ title: "", desc: "", status: "locked", date: "" });
    setIsAddingStep(false);

    try {
      await fetch(`/api/roadmaps/${activeRoadmapId}/steps`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: tempStep.title, description: tempStep.desc, status: tempStep.status, date: tempStep.date }) });
    } catch { /* silent */ }
  };

  const markComplete = async (roadmapId: number, stepId: number) => {
    setRoadmaps(roadmaps.map(rm => rm.id === roadmapId ? { ...rm, steps: rm.steps.map(step => step.id === stepId ? { ...step, status: "completed" } : step) } : rm));
    try { await fetch(`/api/roadmaps/${roadmapId}/steps/${stepId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "completed" }) }); } catch { /* silent */ }
  };

  const deleteRoadmap = async (id: number) => {
    setRoadmaps(roadmaps.filter(rm => rm.id !== id));
    try { await fetch(`/api/roadmaps/${id}`, { method: "DELETE" }); } catch { /* silent */ }
  };

  const deleteStep = async (roadmapId: number, stepId: number) => {
    setRoadmaps(roadmaps.map(rm => rm.id === roadmapId ? { ...rm, steps: rm.steps.filter(step => step.id !== stepId) } : rm));
    try { await fetch(`/api/roadmaps/${roadmapId}/steps/${stepId}`, { method: "DELETE" }); } catch { /* silent */ }
  };

  const getProgress = (steps: any[]) => {
    if (steps.length === 0) return 0;
    const completed = steps.filter(s => s.status === "completed").length;
    return Math.round((completed / steps.length) * 100);
  };

  const activeRoadmap = roadmaps.find(rm => rm.id === activeRoadmapId);

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: activeRoadmapId ? "1000px" : "1200px", margin: "0 auto", paddingBottom: "3rem" }}
    >
      {/* --------------------------------------------------------------------------------- */}
      {/* VIEW 1: ROADMAP LIST (GRID) */}
      {/* --------------------------------------------------------------------------------- */}
      {!activeRoadmapId && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Route size={32} color="#ec4899" /> My Roadmaps
              </h2>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>Create and track custom step-by-step journeys for your goals.</p>
            </div>
            <button onClick={() => setIsAddingRoadmap(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#ec4899", color: "white" }}>
              <Plus size={20} /> Create Roadmap
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {roadmaps.map((rm, i) => (
              <motion.div variants={itemVariants} key={rm.id}>
                <div 
                  onClick={() => setActiveRoadmapId(rm.id)}
                  style={{ 
                    background: "var(--card-bg)", 
                    border: "1px solid var(--card-border)", 
                    borderRadius: "24px", 
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    height: "100%"
                  }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ 
                      width: "50px", 
                      height: "50px", 
                      borderRadius: "16px", 
                      background: `${rm.iconColor}15`, 
                      color: rm.iconColor,
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center" 
                    }}>
                      <Map size={24} />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={(e) => { e.stopPropagation(); deleteRoadmap(rm.id); }} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", transition: "all 0.2s", borderRadius: "8px", padding: "0.2rem", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseOver={e=>e.currentTarget.style.background='#ef444415'} onMouseOut={e=>e.currentTarget.style.background='transparent'} title="Delete Roadmap">
                        <Trash2 size={20} />
                      </button>
                      <button style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.25rem", lineHeight: "1.3" }}>{rm.title}</h3>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.5" }}>{rm.desc}</p>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--card-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--text-muted)" }}>
                      <span>{getProgress(rm.steps)}% Complete</span>
                      <span>{rm.steps.length} Steps</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "var(--bg-color)", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ width: `${getProgress(rm.steps)}%`, height: "100%", background: rm.iconColor, borderRadius: "10px", transition: "width 0.3s" }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* --------------------------------------------------------------------------------- */}
      {/* VIEW 2: ROADMAP DETAILS (STEPS) */}
      {/* --------------------------------------------------------------------------------- */}
      {activeRoadmapId && activeRoadmap && (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <button 
                onClick={() => setActiveRoadmapId(null)} 
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", fontSize: "0.9rem", marginBottom: "1rem", padding: 0 }}
              >
                <ArrowLeft size={16} /> Back to Roadmaps
              </button>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Map size={32} color={activeRoadmap.iconColor} /> {activeRoadmap.title}
              </h2>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>{activeRoadmap.desc}</p>
            </div>
            <button onClick={() => setIsAddingStep(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: activeRoadmap.iconColor, color: "white" }}>
              <Plus size={20} /> Add Step
            </button>
          </div>

          <div style={{ position: "relative", padding: "2rem 0 2rem 2rem" }}>
            {/* Vertical connecting line */}
            <div style={{ position: "absolute", left: "44px", top: "3rem", bottom: "3rem", width: "4px", background: "var(--card-border)", borderRadius: "10px" }} />
            
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {activeRoadmap.steps.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", background: "var(--card-bg)", borderRadius: "20px", border: "1px dashed var(--card-border)" }}>
                  No steps in this roadmap yet. Click "Add Step" to begin!
                </div>
              )}
              {activeRoadmap.steps.map((step, i) => (
                <motion.div variants={stepVariants} key={step.id} style={{ display: "flex", alignItems: "flex-start", gap: "2rem", position: "relative" }}>
                  
                  {/* Timeline Icon Node */}
                  <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "50%", 
                    background: step.status === 'completed' ? "#10b981" : step.status === 'in-progress' ? activeRoadmap.iconColor : "var(--bg-color)", 
                    border: step.status === 'locked' ? "2px solid var(--card-border)" : "none",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    zIndex: 2,
                    boxShadow: step.status !== 'locked' ? "0 4px 15px rgba(0,0,0,0.1)" : "none"
                  }}>
                    {step.status === 'completed' && <CheckCircle2 color="white" size={24} />}
                    {step.status === 'in-progress' && <Flag color="white" size={22} />}
                    {step.status === 'locked' && <Lock color="var(--text-muted)" size={20} />}
                  </div>
                  
                  {/* Step Content Card */}
                  <div style={{ 
                    flex: 1, 
                    background: step.status === 'in-progress' ? `${activeRoadmap.iconColor}10` : "var(--card-bg)", 
                    border: step.status === 'in-progress' ? `1px solid ${activeRoadmap.iconColor}50` : "1px solid var(--card-border)", 
                    borderRadius: "20px", 
                    padding: "1.5rem",
                    opacity: step.status === 'locked' ? 0.6 : 1,
                    boxShadow: step.status === 'in-progress' ? `0 10px 30px ${activeRoadmap.iconColor}20` : "0 2px 10px rgba(0,0,0,0.02)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700" }}>{step.title}</h3>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: "600", color: step.status === 'completed' ? "#10b981" : step.status === 'in-progress' ? activeRoadmap.iconColor : "var(--text-muted)", background: "var(--bg-color)", padding: "0.25rem 0.75rem", borderRadius: "100px", border: "1px solid var(--card-border)" }}>
                          {step.date}
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); deleteStep(activeRoadmap.id, step.id); }} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.2rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }} onMouseOver={e=>e.currentTarget.style.background='#ef444415'} onMouseOut={e=>e.currentTarget.style.background='transparent'} title="Delete Step">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>{step.desc}</p>
                    
                    {step.status === 'in-progress' && (
                      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                         <button onClick={() => markComplete(activeRoadmap.id, step.id)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "none", background: activeRoadmap.iconColor, color: "white", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" }}>Mark Complete</button>
                      </div>
                    )}
                  </div>

                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}


      {/* --------------------------------------------------------------------------------- */}
      {/* MODALS */}
      {/* --------------------------------------------------------------------------------- */}

      {/* CREATE ROADMAP MODAL */}
      <AnimatePresence>
        {isAddingRoadmap && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
              onClick={() => setIsAddingRoadmap(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "500px", position: "relative", zIndex: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Create Roadmap</h3>
                <button onClick={() => setIsAddingRoadmap(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddRoadmap} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Roadmap Title</label>
                  <input 
                    type="text" 
                    value={newRoadmap.title}
                    onChange={(e) => setNewRoadmap({...newRoadmap, title: e.target.value})}
                    placeholder="e.g. Learn Python" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Description</label>
                  <input 
                    type="text" 
                    value={newRoadmap.desc}
                    onChange={(e) => setNewRoadmap({...newRoadmap, desc: e.target.value})}
                    placeholder="e.g. Master python programming from scratch" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Theme Color</label>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"].map(color => (
                      <div 
                        key={color}
                        onClick={() => setNewRoadmap({...newRoadmap, color})}
                        style={{ 
                          width: "30px", 
                          height: "30px", 
                          borderRadius: "50%", 
                          background: color, 
                          cursor: "pointer",
                          border: newRoadmap.color === color ? "3px solid var(--text-color)" : "3px solid transparent",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAddingRoadmap(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#ec4899" }}>Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE STEP MODAL */}
      <AnimatePresence>
        {isAddingStep && activeRoadmap && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
              onClick={() => setIsAddingStep(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "500px", position: "relative", zIndex: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Add Step to {activeRoadmap.title}</h3>
                <button onClick={() => setIsAddingStep(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddStep} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Step Title</label>
                  <input 
                    type="text" 
                    value={newStep.title}
                    onChange={(e) => setNewStep({...newStep, title: e.target.value})}
                    placeholder="e.g. Schedule Interview" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Description</label>
                  <input 
                    type="text" 
                    value={newStep.desc}
                    onChange={(e) => setNewStep({...newStep, desc: e.target.value})}
                    placeholder="e.g. Discuss goals with counselor" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                  />
                </div>
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Status</label>
                    <select 
                      value={newStep.status}
                      onChange={(e) => setNewStep({...newStep, status: e.target.value})}
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", appearance: "none" }}
                    >
                      <option value="locked">Locked</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Estimated Date</label>
                    <input 
                      type="text" 
                      value={newStep.date}
                      onChange={(e) => setNewStep({...newStep, date: e.target.value})}
                      placeholder="e.g. Nov 2024" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAddingStep(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: activeRoadmap.iconColor }}>Save Step</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
