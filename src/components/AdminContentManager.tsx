"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, Search, X, Save, ChevronDown } from "lucide-react";

const CONTENT_TYPES = [
  { key: "universities", label: "Universities", fields: ["name","location","country","ranking","type","tuition","acceptance","website","logo","image","description","tags"] },
  { key: "programs", label: "Programs", fields: ["title","university","location","country","category","fields","degreeLevel","studyMode","tuition","duration","description","eligibility","applyLink","tags","image","specialFeatures","noticableFacts","featured"] },
  { key: "scholarships", label: "Scholarships", fields: ["title","provider","location","country","category","fields","studyMode","coverage","degreeLevel","deadline","amount","description","eligibility","applyLink","tags","specialFeatures","noticableFacts","featured"] },
  { key: "fields", label: "Fields", fields: ["title","category","icon","description","salary","growth","demand","topUnis","tags"] },
  { key: "projects", label: "Projects", fields: ["title","creator","difficulty","category","status","duration","description","tags"] },
  { key: "roadmaps", label: "Roadmaps", fields: ["title","path","level","time","modules","description","tags","specialFeatures","noticableFacts","steps","color"] },
];

// Fields that should be rendered as number inputs
const NUMERIC_FIELDS = new Set(["ranking","tuition","acceptance","amount","modules","salary","growth","demand"]);
// Fields that should be rendered as textarea
const TEXTAREA_FIELDS = new Set(["description","details","specialFeatures","noticableFacts","tips","steps"]);
// Fields that should be treated as arrays (comma-separated input)
const ARRAY_FIELDS = new Set(["tags", "specialFeatures", "noticableFacts", "tips", "programs", "fields", "eligibility"]);

// Human-readable labels for field names
const FIELD_LABELS: Record<string, string> = {
  name: "Name", location: "Location", country: "Country", ranking: "Ranking",
  type: "Type", tuition: "Tuition ($)", acceptance: "Acceptance Rate (%)",
  website: "Website URL", description: "Description",
  title: "Title", university: "University", degreeLevel: "Degree Level",
  studyMode: "Study Mode", duration: "Duration", applyLink: "Apply Link",
  provider: "Provider", coverage: "Coverage", deadline: "Deadline",
  amount: "Amount ($)", category: "Category", icon: "Icon",
  salary: "Salary ($)", growth: "Growth (%)", demand: "Demand",
  topUnis: "Top Universities", creator: "Creator", difficulty: "Difficulty",
  status: "Status", path: "Path", level: "Level", time: "Time",
  modules: "Modules Count", image: "Image URL", logo: "Logo URL",
  tags: "Tags (comma-separated)", specialFeatures: "Special Features (comma-sep)", 
  tips: "Tips (comma-separated)", noticableFacts: "Noticable Facts (comma-sep)",
  steps: "Roadmap Steps (JSON)", color: "Theme Color (Hex)",
  isPublished: "Published",
};

// Placeholder hints for fields
const FIELD_PLACEHOLDERS: Record<string, string> = {
  name: "e.g. Harvard University",
  title: "e.g. Computer Science",
  location: "e.g. New York, USA",
  country: "e.g. United States",
  university: "e.g. MIT",
  provider: "e.g. Fulbright",
  coverage: "e.g. Full Tuition",
  degreeLevel: "e.g. Bachelor's",
  studyMode: "e.g. Full-time",
  difficulty: "e.g. Beginner",
  category: "e.g. Technology",
  creator: "e.g. John Doe",
  path: "e.g. /roadmaps/web-dev",
  level: "e.g. Intermediate",
  website: "https://...",
  applyLink: "https://...",
  deadline: "e.g. 2026-12-31",
  description: "Enter description here...",
};

type Item = Record<string, any>;

export function AdminContentManager() {
  const [activeType, setActiveType] = useState(CONTENT_TYPES[0]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${activeType.key}?page=${page}&search=${search}&limit=${perPage}`);
      const data = await res.json();
      setItems(data.items || []);
      if (data.pagination) setPagination({ total: data.pagination.total, totalPages: data.pagination.totalPages });
    } catch { setItems([]); }
    setLoading(false);
  }, [activeType.key, page, search, perPage]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditItem(null); setFormData({}); setShowForm(true); };
  const openEdit = (item: Item) => {
    setEditItem(item);
    const fd: Record<string, string> = {};
    activeType.fields.forEach(f => { 
      const val = item[f];
      if (f === "steps" && val && typeof val === "object") {
        fd[f] = JSON.stringify(val, null, 2);
      } else if (Array.isArray(val)) {
        fd[f] = val.join(", ");
      } else {
        fd[f] = val?.toString() || ""; 
      }
    });
    setFormData(fd);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    // Check that at least the first field is filled (typically the title/name)
    if (!formData[activeType.fields[0]]?.trim()) {
      alert(`Please fill in the "${FIELD_LABELS[activeType.fields[0]] || activeType.fields[0]}" field.`);
      return;
    }
    
    const payload: any = {};
    
    // Build payload: skip empty strings, convert numeric fields properly
    for (const [key, value] of Object.entries(formData)) {
      if (value === "" || value === undefined) continue;
      
      if (NUMERIC_FIELDS.has(key)) {
        const num = parseFloat(value);
        if (!isNaN(num)) payload[key] = num;
      } else if (key === "steps") {
        try {
          payload[key] = JSON.parse(value);
        } catch {
          // If not valid JSON, maybe it's just a string, but let's try to keep it as string if parsing fails
          payload[key] = value;
        }
      } else if (ARRAY_FIELDS.has(key)) {
        // Split by comma and trim whitespace
        payload[key] = value.split(",").map(v => v.trim()).filter(v => v !== "");
      } else {
        payload[key] = value;
      }
    }
    
    const url = editItem ? `/api/admin/content/${activeType.key}/${editItem.id}` : `/api/admin/content/${activeType.key}`;
    const method = editItem ? "PATCH" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to save. Please check your input.");
        return;
      }
      setShowForm(false);
      fetchItems();
    } catch {
      alert("Network error. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/content/${activeType.key}/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "1.5rem" };
  const pageStyle = (isActive: boolean): React.CSSProperties => ({
    width: "32px", height: "32px", borderRadius: "8px", border: isActive ? "none" : "1px solid var(--card-border)",
    background: isActive ? "#f43f5e" : "var(--card-bg)", color: isActive ? "white" : "var(--text-color)",
    cursor: "pointer", fontWeight: "600", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center"
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Type Selector */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {CONTENT_TYPES.map(ct => (
          <button key={ct.key} onClick={() => { setActiveType(ct); setPage(1); }}
            style={{ padding: "0.5rem 1rem", borderRadius: "100px", border: activeType.key === ct.key ? "none" : "1px solid var(--card-border)",
              background: activeType.key === ct.key ? "linear-gradient(135deg, #f43f5e, #f97316)" : "var(--card-bg)",
              color: activeType.key === ct.key ? "white" : "var(--text-color)", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
            {ct.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input placeholder={`Search ${activeType.label}...`} value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: "0.6rem 0.6rem 0.6rem 2.25rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", width: "100%", maxWidth: "280px", outline: "none" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Page {page} of {pagination.totalPages} &middot; {pagination.total} total</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Per page:</span>
            <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
              style={{ padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", fontSize: "0.85rem", cursor: "pointer" }}>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <button onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", background: "linear-gradient(135deg, #f43f5e, #f97316)", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
            <Plus size={16} /> Add {activeType.label.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div style={card}>
        {loading ? <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Loading...</p> : items.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No {activeType.label.toLowerCase()} found. Click "Add" to create one.</p>
        ) : (
          <div className="responsive-table-container">
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                {activeType.fields.slice(0, 4).map(f => <th key={f} style={{ padding: "0.75rem 0.5rem", fontWeight: "600", textAlign: "left" }}>{FIELD_LABELS[f] || f}</th>)}
                <th style={{ padding: "0.75rem 0.5rem", fontWeight: "600", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                  {activeType.fields.slice(0, 4).map(f => (
                    <td key={f} style={{ padding: "0.75rem 0.5rem", fontSize: "0.9rem", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item[f]?.toString() || "—"}
                    </td>
                  ))}
                  <td style={{ padding: "0.75rem 0.5rem", textAlign: "right" }}>
                    <button onClick={() => openEdit(item)} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", padding: "0.25rem" }}><Edit3 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: "none", border: "none", color: "#f43f5e", cursor: "pointer", padding: "0.25rem", marginLeft: "0.5rem" }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        {pagination.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: page === 1 ? "var(--text-muted)" : "var(--text-color)", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "0.8rem", fontWeight: "600" }}
            >
              Previous
            </button>
            
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {(() => {
                const pages = [];
                const maxVisible = 5;
                let start = Math.max(1, page - 2);
                let end = Math.min(pagination.totalPages, start + maxVisible - 1);
                
                if (end - start + 1 < maxVisible) {
                  start = Math.max(1, end - maxVisible + 1);
                }

                if (start > 1) {
                  pages.push(
                    <button key={1} onClick={() => setPage(1)} style={pageStyle(page === 1)}>1</button>
                  );
                  if (start > 2) pages.push(<span key="d1" style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}>...</span>);
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button key={i} onClick={() => setPage(i)} style={pageStyle(page === i)}>{i}</button>
                  );
                }

                if (end < pagination.totalPages) {
                  if (end < pagination.totalPages - 1) pages.push(<span key="d2" style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}>...</span>);
                  pages.push(
                    <button key={pagination.totalPages} onClick={() => setPage(pagination.totalPages)} style={pageStyle(page === pagination.totalPages)}>{pagination.totalPages}</button>
                  );
                }
                return pages;
              })()}
            </div>

            <button 
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: page === pagination.totalPages ? "var(--text-muted)" : "var(--text-color)", cursor: page === pagination.totalPages ? "not-allowed" : "pointer", fontSize: "0.8rem", fontWeight: "600" }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowForm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ ...card, width: "90%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>{editItem ? "Edit" : "Add New"} {activeType.label.slice(0, -1)}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {activeType.fields.map(f => {
                const label = FIELD_LABELS[f] || f.charAt(0).toUpperCase() + f.slice(1);
                const placeholder = FIELD_PLACEHOLDERS[f] || "";
                const isNumeric = NUMERIC_FIELDS.has(f);
                const isTextarea = TEXTAREA_FIELDS.has(f) || f === "description";
                
                return (
                  <div key={f}>
                    <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem", display: "block" }}>
                      {label}
                      {activeType.fields.indexOf(f) === 0 && <span style={{ color: "#f43f5e", marginLeft: "4px" }}>*</span>}
                    </label>
                    {isTextarea ? (
                      <textarea 
                        value={formData[f] || ""} 
                        onChange={e => setFormData({ ...formData, [f]: e.target.value })} 
                        rows={3}
                        placeholder={placeholder}
                        style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", resize: "vertical", fontFamily: "inherit", fontSize: "0.9rem" }} 
                      />
                    ) : (
                      <input 
                        type={isNumeric ? "number" : "text"}
                        value={formData[f] || ""} 
                        onChange={e => setFormData({ ...formData, [f]: e.target.value })}
                        placeholder={placeholder}
                        min={isNumeric ? 0 : undefined}
                        step={isNumeric ? "any" : undefined}
                        style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", fontSize: "0.9rem" }} 
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={{ padding: "0.6rem 1.25rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
              <button onClick={handleSubmit} style={{ padding: "0.6rem 1.25rem", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #f43f5e, #f97316)", color: "white", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Save size={16} /> {editItem ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
