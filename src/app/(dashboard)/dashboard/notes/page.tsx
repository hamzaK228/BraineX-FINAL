"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNote, Plus, X, Trash2, Calendar, FileText } from "lucide-react";

export default function NotesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const [notes, setNotes] = useState<any[]>([]);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotes(data.map((n: any) => ({ ...n, date: new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) })));
        }
      }
    } catch { /* fallback */ }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", color: "#3b82f6" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const tempNote = {
      id: `temp-${Date.now()}`,
      title: newNote.title,
      content: newNote.content,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      color: newNote.color
    };
    setNotes([tempNote, ...notes]);
    setNewNote({ title: "", content: "", color: "#3b82f6" });
    setIsAdding(false);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: tempNote.title, content: tempNote.content, color: tempNote.color }),
      });
      if (res.ok) {
        const saved = await res.json();
        setNotes(prev => prev.map(n => n.id === tempNote.id ? { ...saved, date: tempNote.date } : n));
      }
    } catch { /* local state preserved */ }
  };

  const deleteNote = async (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    try { await fetch(`/api/notes/${id}`, { method: "DELETE" }); } catch { /* silent */ }
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
            <StickyNote size={32} color="#8b5cf6" /> My Notes
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Jot down ideas, brainstorming, and important thoughts.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#8b5cf6", color: "white" }}>
          <Plus size={20} /> Create Note
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {notes.map((note) => (
          <motion.div variants={itemVariants} key={note.id}>
            <div style={{ 
              background: "var(--card-bg)", 
              border: "1px solid var(--card-border)", 
              borderTop: `4px solid ${note.color}`,
              borderRadius: "20px", 
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              height: "100%",
              position: "relative",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.2rem", lineHeight: "1.3" }}>{note.title}</h3>
                <button onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem", borderRadius: "8px", transition: "all 0.2s", marginTop: "-0.5rem", marginRight: "-0.5rem" }} onMouseOver={e => e.currentTarget.style.background = '#ef444415'} onMouseOut={e => e.currentTarget.style.background = 'transparent'} title="Delete Note">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                  {note.content}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--card-border)", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: "500" }}>
                  <Calendar size={14} /> {note.date}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {notes.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "3rem", textAlign: "center", color: "var(--text-muted)", background: "var(--card-bg)", borderRadius: "24px", border: "1px dashed var(--card-border)" }}>
            No notes added yet. Click "Create Note" to get started.
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
              style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "24px", padding: "2rem", width: "100%", maxWidth: "600px", position: "relative", zIndex: 1, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Create Note</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Title</label>
                  <input 
                    type="text" 
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    placeholder="Note Title" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", fontWeight: "600" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Content</label>
                  <textarea 
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    placeholder="Write your note here..." 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", minHeight: "150px", resize: "vertical", fontFamily: "inherit" }}
                  ></textarea>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Color Category</label>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {["#3b82f6", "#8b5cf6", "#ec4899", "#ef4444", "#f59e0b", "#10b981"].map(color => (
                      <div 
                        key={color}
                        onClick={() => setNewNote({...newNote, color})}
                        style={{ 
                          width: "30px", 
                          height: "30px", 
                          borderRadius: "50%", 
                          background: color, 
                          cursor: "pointer",
                          border: newNote.color === color ? "3px solid var(--text-color)" : "3px solid transparent",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAdding(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#8b5cf6", color: "white" }}>Save Note</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
