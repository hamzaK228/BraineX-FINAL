"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, Circle, Plus, X, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Goal {
  id: string;
  title: string;
  progress: number;
  completed?: boolean;
}

const FALLBACK_GOALS: Goal[] = [
  { id: "1", title: "Apply for 5 CS Scholarships", progress: 100, completed: true },
  { id: "2", title: "Finish Next.js Portfolio Project", progress: 30, completed: false },
  { id: "3", title: "Schedule 1-on-1 with a FAANG Mentor", progress: 0, completed: false },
  { id: "4", title: "Complete 'Data Structures' Roadmap", progress: 65, completed: false },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(FALLBACK_GOALS);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoalText, setNewGoalText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch("/api/goals");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setGoals(data.map((g: any) => ({ ...g, completed: g.progress >= 100 })));
        }
      }
    } catch {
      // Fallback to local data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const toggleGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    const newProgress = goal.completed ? 0 : 100;
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed, progress: newProgress } : g));

    try {
      await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      });
    } catch {
      // Silent — local state already updated
    }
  };

  const deleteGoal = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGoals(goals.filter(g => g.id !== id));

    try {
      await fetch(`/api/goals/${id}`, { method: "DELETE" });
    } catch {
      // Silent
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setSaving(true);

    const tempGoal: Goal = { id: `temp-${Date.now()}`, title: newGoalText, progress: 0, completed: false };
    setGoals(prev => [...prev, tempGoal]);
    setNewGoalText("");
    setIsAdding(false);

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newGoalText }),
      });
      if (res.ok) {
        const saved = await res.json();
        setGoals(prev => prev.map(g => g.id === tempGoal.id ? { ...saved, completed: saved.progress >= 100 } : g));
      }
    } catch {
      // Temp goal stays in local state
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
        <Loader2 size={32} color="#6366f1" style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>My Goals</h2>
        <button 
          className="ds-btn ds-btn-primary" 
          style={{ padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          onClick={() => setIsAdding(true)}
        >
          <Plus size={18} /> Add Goal
        </button>
      </div>

      <div className="glass-card">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {goals.map((goal) => (
            <li 
              key={goal.id} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "1rem", 
                padding: "1rem", 
                borderBottom: "1px solid var(--card-border)",
                opacity: goal.completed ? 0.6 : 1,
                cursor: "pointer"
              }}
              onClick={() => toggleGoal(goal.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                {goal.completed ? (
                  <CheckCircle2 color="#10b981" size={24} />
                ) : (
                  <Circle color="var(--text-muted)" size={24} />
                )}
                <span style={{ 
                  fontSize: "1.1rem", 
                  textDecoration: goal.completed ? "line-through" : "none",
                  color: goal.completed ? "var(--text-muted)" : "var(--text-color)"
                }}>
                  {goal.title}
                </span>
              </div>
              <button 
                onClick={(e) => deleteGoal(goal.id, e)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  transition: "background 0.2s, color 0.2s"
                }}
                onMouseOver={e => { e.currentTarget.style.background = "#ef444415"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
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
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Add New Goal</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddGoal} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Goal Description</label>
                  <input 
                    type="text" 
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder="e.g. Finish Common App Essay" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAdding(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" disabled={saving} className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>{saving ? "Saving..." : "Save Goal"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
