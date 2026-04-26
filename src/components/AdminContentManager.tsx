"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, Search, X, Save, ChevronDown } from "lucide-react";

const CONTENT_TYPES = [
  { key: "universities", label: "Universities", fields: ["name","location","country","ranking","type","tuition","acceptance","website","description"] },
  { key: "programs", label: "Programs", fields: ["title","university","location","degreeLevel","studyMode","tuition","duration","description","applyLink"] },
  { key: "scholarships", label: "Scholarships", fields: ["title","provider","location","coverage","degreeLevel","deadline","amount","description","applyLink"] },
  { key: "fields", label: "Fields", fields: ["title","category","icon","description","salary","growth","demand","topUnis"] },
  { key: "projects", label: "Projects", fields: ["title","creator","difficulty","category","status","duration","description"] },
  { key: "roadmaps", label: "Roadmaps", fields: ["title","path","level","time","modules","description"] },
];

type Item = Record<string, any>;

export function AdminContentManager() {
  const [activeType, setActiveType] = useState(CONTENT_TYPES[0]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${activeType.key}?page=${pagination.page}&search=${search}`);
      const data = await res.json();
      setItems(data.items || []);
      if (data.pagination) setPagination(data.pagination);
    } catch { setItems([]); }
    setLoading(false);
  }, [activeType.key, pagination.page, search]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditItem(null); setFormData({}); setShowForm(true); };
  const openEdit = (item: Item) => {
    setEditItem(item);
    const fd: Record<string, string> = {};
    activeType.fields.forEach(f => { fd[f] = item[f]?.toString() || ""; });
    setFormData(fd);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const payload: any = { ...formData };
    ["ranking","tuition","acceptance","amount","modules"].forEach(k => { if (payload[k]) payload[k] = parseFloat(payload[k]); });
    const url = editItem ? `/api/admin/content/${activeType.key}/${editItem.id}` : `/api/admin/content/${activeType.key}`;
    const method = editItem ? "PATCH" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setShowForm(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/admin/content/${activeType.key}/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const s = (k: string, v: any): React.CSSProperties => v;
  const card: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "1.5rem" };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Type Selector */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {CONTENT_TYPES.map(ct => (
          <button key={ct.key} onClick={() => { setActiveType(ct); setPagination(p => ({ ...p, page: 1 })); }}
            style={{ padding: "0.5rem 1rem", borderRadius: "100px", border: activeType.key === ct.key ? "none" : "1px solid var(--card-border)",
              background: activeType.key === ct.key ? "linear-gradient(135deg, #f43f5e, #f97316)" : "var(--card-bg)",
              color: activeType.key === ct.key ? "white" : "var(--text-color)", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
            {ct.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input placeholder={`Search ${activeType.label}...`} value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: "0.6rem 0.6rem 0.6rem 2.25rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", width: "280px", outline: "none" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{pagination.total} items</span>
          <button onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", background: "linear-gradient(135deg, #f43f5e, #f97316)", color: "white", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
            <Plus size={16} /> Add {activeType.label.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div style={card}>
        {loading ? <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Loading...</p> : items.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>No {activeType.label.toLowerCase()} found. Click &quot;Add&quot; to create one.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                {activeType.fields.slice(0, 4).map(f => <th key={f} style={{ padding: "0.75rem 0.5rem", fontWeight: "600", textAlign: "left" }}>{f}</th>)}
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
        )}
        {pagination.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => (
              <button key={i} onClick={() => setPagination(p => ({ ...p, page: i + 1 }))}
                style={{ width: "32px", height: "32px", borderRadius: "8px", border: pagination.page === i + 1 ? "none" : "1px solid var(--card-border)",
                  background: pagination.page === i + 1 ? "#f43f5e" : "var(--card-bg)", color: pagination.page === i + 1 ? "white" : "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowForm(false)}>
          <div onClick={e => e.stopPropagation()} style={{ ...card, width: "90%", maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>{editItem ? "Edit" : "Add"} {activeType.label.slice(0, -1)}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {activeType.fields.map(f => (
                <div key={f}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem", display: "block" }}>{f}</label>
                  {f === "description" ? (
                    <textarea value={formData[f] || ""} onChange={e => setFormData({ ...formData, [f]: e.target.value })} rows={3}
                      style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
                  ) : (
                    <input value={formData[f] || ""} onChange={e => setFormData({ ...formData, [f]: e.target.value })}
                      style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none" }} />
                  )}
                </div>
              ))}
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
