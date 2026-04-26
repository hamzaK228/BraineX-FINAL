"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Filter, FileText, Download, Link as LinkIcon, Video, ArrowRight, Plus, X, Trash2 } from "lucide-react";

export default function ResourcesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const [resources, setResources] = useState([
    { id: 1, title: "Ultimate SAT Math Guide", desc: "A comprehensive 100-page formula sheet and strategy guide.", type: "PDF", tag: "Standardized Testing" },
    { id: 2, title: "How to Ask for Rec Letters", desc: "Templates and email examples to send to professors.", type: "Link", tag: "Applications" },
    { id: 3, title: "Personal Statement Workshop", desc: "1-hour video breakdown of successful Harvard essays.", type: "Video", tag: "Essays" },
    { id: 4, title: "FAFSA Step-by-Step Tutorial", desc: "Detailed breakdown of filling out financial aid documents.", type: "PDF", tag: "Finance" },
    { id: 5, title: "Extracurriculars Database", desc: "Spreadsheet of 500+ impressive high school activities.", type: "File", tag: "Profile Building" },
    { id: 6, title: "College Interview Prep", desc: "Most commonly asked interview questions and how to answer them.", type: "Link", tag: "Applications" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newResource, setNewResource] = useState({ title: "", desc: "", type: "Link", tag: "General" });

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title.trim()) return;

    setResources([{
      id: Date.now(),
      title: newResource.title,
      desc: newResource.desc || "No description provided.",
      type: newResource.type,
      tag: newResource.tag
    }, ...resources]);
    
    setNewResource({ title: "", desc: "", type: "Link", tag: "General" });
    setIsAdding(false);
  };

  const deleteResource = (id: number) => {
    setResources(resources.filter(res => res.id !== id));
  };

  const getResourceIcon = (type: string) => {
    switch(type) {
      case "PDF": return <FileText size={24} color="#f43f5e" />;
      case "Video": return <Video size={24} color="#8b5cf6" />;
      case "File": return <Download size={24} color="#10b981" />;
      case "Link":
      default: return <LinkIcon size={24} color="#3b82f6" />;
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
            <BookOpen size={32} color="#ec4899" /> Resource Library
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Curated guides, templates, and materials to boost your application.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" placeholder="Search resources..." style={{ padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "100px", background: "var(--bg-color)", border: "1px solid var(--card-border)", color: "var(--text-color)", outline: "none", width: "250px" }} />
          </div>
          <button style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "100px", padding: "0.75rem 1.5rem", color: "var(--text-color)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}>
            <Filter size={18} /> Filters
          </button>
          <button onClick={() => setIsAdding(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>
            <Plus size={20} /> Add Resource
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {resources.map((resource, i) => (
          <motion.div variants={itemVariants} key={i}>
            <div style={{ 
              background: "var(--card-bg)", 
              border: "1px solid var(--card-border)", 
              borderRadius: "20px", 
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              height: "100%",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "16px", 
                  background: "var(--bg-color)", 
                  border: "1px solid var(--card-border)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  {getResourceIcon(resource.type)}
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: "bold", padding: "0.25rem 0.75rem", borderRadius: "100px", background: "rgba(236, 72, 153, 0.1)", color: "#ec4899" }}>
                  {resource.tag}
                </span>
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem", lineHeight: "1.3" }}>{resource.title}</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.5" }}>{resource.desc}</p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--card-border)" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {resource.type === 'PDF' && <FileText size={14} />}
                  {resource.type === 'Video' && <Video size={14} />}
                  {resource.type === 'Link' && <LinkIcon size={14} />}
                  {resource.type === 'File' && <Download size={14} />}
                  {resource.type}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={(e) => { e.stopPropagation(); deleteResource(resource.id); }} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem", borderRadius: "8px", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = '#ef444415'} onMouseOut={e => e.currentTarget.style.background = 'transparent'} title="Delete Resource">
                    <Trash2 size={16} />
                  </button>
                  <button style={{ background: "transparent", border: "none", color: "var(--text-color)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", fontSize: "0.9rem", padding: "0.5rem 0" }} onMouseOver={e => e.currentTarget.style.color = '#ec4899'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-color)'}>
                    Access <ArrowRight size={16} />
                  </button>
                </div>
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
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Add Resource</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddResource} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Resource Title</label>
                  <input 
                    type="text" 
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="e.g. Ultimate SAT Math Guide" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Description</label>
                  <textarea 
                    value={newResource.desc}
                    onChange={(e) => setNewResource({...newResource, desc: e.target.value})}
                    placeholder="Briefly describe what this resource is..." 
                    rows={3}
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", resize: "none" }}
                  />
                </div>
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Type</label>
                    <select 
                      value={newResource.type}
                      onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", appearance: "none" }}
                    >
                      <option value="Link">Link</option>
                      <option value="PDF">PDF</option>
                      <option value="Video">Video</option>
                      <option value="File">File</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Tag</label>
                    <input 
                      type="text" 
                      value={newResource.tag}
                      onChange={(e) => setNewResource({...newResource, tag: e.target.value})}
                      placeholder="e.g. Applications" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAdding(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>Save Resource</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
