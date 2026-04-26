"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreHorizontal, Circle, Clock, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Trash2 } from "lucide-react";

export default function TasksPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Fallback data
  const FALLBACK_COLUMNS: any = {
    todo: {
      title: "To Do",
      color: "#f43f5e",
      tasks: [
        { id: "t1", title: "Draft Personal Statement paragraph 1", tag: "Application", tagColor: "168,85,247", date: "Tomorrow", urgent: true },
        { id: "t2", title: "Review GRE Math formulas", desc: "Focus on geometry and probability", tag: "Study", tagColor: "59,130,246", date: "Oct 14" },
        { id: "t3", title: "Update Resume", desc: "Add recent volunteer experience", tag: "Profile", tagColor: "245,158,11", date: "Oct 16" }
      ]
    },
    inProgress: {
      title: "In Progress",
      color: "#f59e0b",
      tasks: [
        { id: "t4", title: "Stanford Fellowship Essay", desc: "Write second draft", tag: "Scholarship", tagColor: "16,185,129", date: "Oct 15", urgent: true },
        { id: "t5", title: "Data Structures Course", desc: "Complete Module 4 assignment", tag: "Study", tagColor: "59,130,246", date: "Oct 18" }
      ]
    },
    inReview: {
      title: "In Review",
      color: "#3b82f6",
      tasks: [
        { id: "t6", title: "Recommendation Letter Request", desc: "Waiting for Prof. Smith's reply", tag: "Application", tagColor: "168,85,247", date: "Pending" }
      ]
    },
    completed: {
      title: "Completed",
      color: "#10b981",
      tasks: [
        { id: "t7", title: "Submit FAFSA Application", tag: "Finance", tagColor: "16,185,129", date: "Done on Oct 1" }
      ]
    }
  };

  // State for columns and tasks
  const [columns, setColumns] = useState<any>(FALLBACK_COLUMNS);

  const statusToColumn: any = { todo: "todo", in_progress: "inProgress", in_review: "inReview", completed: "completed" };
  const columnToStatus: any = { todo: "todo", inProgress: "in_progress", inReview: "in_review", completed: "completed" };

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search).get("q") || "";
      setSearchQuery(query.toLowerCase());

      const handleSearchChange = () => {
        const q = new URLSearchParams(window.location.search).get("q") || "";
        setSearchQuery(q.toLowerCase());
      };

      window.addEventListener('searchParamsChanged', handleSearchChange);
      return () => window.removeEventListener('searchParamsChanged', handleSearchChange);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: any = { todo: { ...FALLBACK_COLUMNS.todo, tasks: [] }, inProgress: { ...FALLBACK_COLUMNS.inProgress, tasks: [] }, inReview: { ...FALLBACK_COLUMNS.inReview, tasks: [] }, completed: { ...FALLBACK_COLUMNS.completed, tasks: [] } };
          data.forEach((t: any) => {
            const col = statusToColumn[t.status] || "todo";
            mapped[col].tasks.push({ id: t.id, title: t.title, desc: t.description || "", tag: t.priority || "General", tagColor: "168,85,247", date: t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD", urgent: t.priority === "urgent" });
          });
          setColumns(mapped);
        }
      }
    } catch { /* fallback */ }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", desc: "", tag: "General", date: "", urgent: false });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const tagColors: any = {
      "Application": "168,85,247",
      "Study": "59,130,246",
      "Profile": "245,158,11",
      "Scholarship": "16,185,129",
      "Finance": "16,185,129",
      "General": "168,85,247"
    };

    const taskDate = newTask.date ? new Date(newTask.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "TBD";

    setColumns((prev: any) => ({
      ...prev,
      todo: {
        ...prev.todo,
        tasks: [{ 
          id: Date.now().toString(), 
          title: newTask.title, 
          desc: newTask.desc,
          tag: newTask.tag || "General", 
          tagColor: tagColors[newTask.tag || "General"] || "168,85,247", 
          date: taskDate,
          urgent: newTask.urgent
        }, ...prev.todo.tasks]
      }
    }));

    setNewTask({ title: "", desc: "", tag: "General", date: "", urgent: false });
    setIsAdding(false);

    // Persist to API
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask.title, description: newTask.desc, priority: newTask.tag, status: "todo", dueDate: newTask.date || null }),
      });
    } catch { /* silent */ }
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: any, columnId: string, taskIndex: number) => {
    setDraggedTask({ columnId, taskIndex });
    e.dataTransfer.setData("text/plain", taskIndex.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: any, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { columnId: sourceColumnId, taskIndex } = draggedTask;
    
    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    moveTask(sourceColumnId, targetColumnId, taskIndex);
    setDraggedTask(null);
  };

  // --- MANUAL MOVE HANDLER (For mobile/click) ---
  const moveTask = (sourceColId: string, targetColId: string, taskIndex: number) => {
    setColumns((prev: any) => {
      const newCols = { ...prev };
      
      const task = newCols[sourceColId].tasks[taskIndex];
      newCols[sourceColId].tasks = [...newCols[sourceColId].tasks];
      newCols[sourceColId].tasks.splice(taskIndex, 1);
      
      newCols[targetColId].tasks = [...newCols[targetColId].tasks, task];
      
      return newCols;
    });
    setActiveMenu(null);
  };

  const deleteTask = (colId: string, taskIndex: number) => {
    setColumns((prev: any) => {
      const newCols = { ...prev };
      newCols[colId].tasks = newCols[colId].tasks.filter((_: any, i: number) => i !== taskIndex);
      return newCols;
    });
    setActiveMenu(null);
  };

  const columnIds = Object.keys(columns);

  const TaskCard = ({ task, colId, index }: any) => {
    const isDragging = draggedTask?.columnId === colId && draggedTask?.taskIndex === index;
    const colIndex = columnIds.indexOf(colId);
    
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isDragging ? 0.4 : 1, scale: isDragging ? 0.95 : 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        draggable
        onDragStart={(e: any) => handleDragStart(e, colId, index)}
        onDragEnd={handleDragEnd}
        style={{ 
          background: "var(--card-bg)", 
          border: "1px solid var(--card-border)", 
          borderRadius: "16px", 
          padding: "1.25rem",
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          cursor: "grab",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          position: "relative",
          pointerEvents: draggedTask && !isDragging ? "none" : "auto", // Prevent children from blocking drop on column
          zIndex: isDragging ? 50 : 1
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ background: `rgba(${task.tagColor}, 0.1)`, color: `rgb(${task.tagColor})`, padding: "0.25rem 0.75rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "bold" }}>{task.tag}</span>
          
          <div style={{ position: "relative" }}>
            <button onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.2rem" }}>
              <MoreHorizontal size={18} />
            </button>
            
            <AnimatePresence>
              {activeMenu === task.id && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  style={{ position: "absolute", top: "100%", right: 0, background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", zIndex: 10, padding: "0.5rem", minWidth: "150px", display: "flex", flexDirection: "column", gap: "0.25rem" }}
                >
                  <div style={{ fontSize: "0.75rem", fontWeight: "bold", padding: "0.5rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Move To</div>
                  {colIndex > 0 && (
                    <button onClick={() => moveTask(colId, columnIds[colIndex - 1], index)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", background: "transparent", border: "none", color: "var(--text-color)", textAlign: "left", cursor: "pointer", borderRadius: "8px" }} onMouseOver={e=>e.currentTarget.style.background='var(--bg-color)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                      <ChevronLeft size={14} /> {columns[columnIds[colIndex - 1]].title}
                    </button>
                  )}
                  {colIndex < columnIds.length - 1 && (
                    <button onClick={() => moveTask(colId, columnIds[colIndex + 1], index)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", background: "transparent", border: "none", color: "var(--text-color)", textAlign: "left", cursor: "pointer", borderRadius: "8px" }} onMouseOver={e=>e.currentTarget.style.background='var(--bg-color)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                      <ChevronRight size={14} /> {columns[columnIds[colIndex + 1]].title}
                    </button>
                  )}
                  <button onClick={() => deleteTask(colId, index)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", background: "transparent", border: "none", color: "#ef4444", textAlign: "left", cursor: "pointer", borderRadius: "8px" }} onMouseOver={e=>e.currentTarget.style.background='#ef444415'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                    <Trash2 size={14} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
        <div>
          <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", opacity: colId === 'completed' ? 0.6 : 1, textDecoration: colId === 'completed' ? 'line-through' : 'none' }}>{task.title}</h4>
          {task.desc && <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", opacity: colId === 'completed' ? 0.6 : 1 }}>{task.desc}</p>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid var(--card-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: task.urgent && colId !== 'completed' ? "#f43f5e" : "var(--text-muted)", fontWeight: task.urgent && colId !== 'completed' ? "bold" : "normal" }}>
            {task.urgent && colId !== 'completed' ? <AlertCircle size={14} /> : <Clock size={14} />} {task.date}
          </div>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: colId === 'completed' ? "#10b981" : "var(--bg-color)", border: colId === 'completed' ? "none" : "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {colId === 'completed' && <span style={{ color: "white", fontSize: "12px" }}>✓</span>}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "1600px", margin: "0 auto", paddingBottom: "3rem" }}
      onClick={() => setActiveMenu(null)} // Close menu when clicking outside
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0" }}>My Tasks</h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Manage your to-dos, assignments, and application requirements.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>
          <Plus size={20} /> Create Task
        </button>
      </div>

      <motion.div variants={itemVariants} style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingBottom: "1rem" }}>
        
        {Object.entries(columns).map(([colId, col]: any) => {
          const filteredTasks = col.tasks.filter((task: any) => 
            !searchQuery || 
            task.title.toLowerCase().includes(searchQuery) ||
            (task.desc && task.desc.toLowerCase().includes(searchQuery)) ||
            (task.tag && task.tag.toLowerCase().includes(searchQuery))
          );

          return (
          <div 
            key={colId} 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, colId)}
            style={{ 
              minWidth: "320px", 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem" 
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: col.color }} />
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700" }}>{col.title}</h3>
              </div>
              <span style={{ background: "var(--card-border)", padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "bold" }}>{filteredTasks.length}</span>
            </div>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem", 
              minHeight: "600px", 
              background: draggedTask?.columnId !== colId && draggedTask ? "rgba(99,102,241,0.05)" : "rgba(0,0,0,0.02)", 
              border: draggedTask?.columnId !== colId && draggedTask ? "2px dashed #6366f1" : "2px dashed var(--card-border)",
              padding: "1rem", 
              borderRadius: "20px",
              transition: "all 0.2s"
            }}>
              <AnimatePresence>
                {filteredTasks.map((task: any, index: number) => (
                  <TaskCard key={task.id} task={task} colId={colId} index={col.tasks.findIndex((t: any) => t.id === task.id)} />
                ))}
              </AnimatePresence>
              {filteredTasks.length === 0 && (
                <div style={{ margin: "auto", color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic", opacity: 0.5 }}>Drop tasks here</div>
              )}
            </div>
          </div>
        )})}

      </motion.div>
      
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
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Create New Task</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <i className="fa-solid fa-xmark" style={{ fontSize: '24px' }}></i>
                </button>
              </div>
              
              <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Task Title</label>
                  <input 
                    type="text" 
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g. Write Personal Statement" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Description (Optional)</label>
                  <textarea 
                    value={newTask.desc}
                    onChange={(e) => setNewTask({...newTask, desc: e.target.value})}
                    placeholder="Add details..." 
                    rows={3}
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", resize: "none" }}
                  />
                </div>
                
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Category Tag</label>
                    <select 
                      value={newTask.tag}
                      onChange={(e) => setNewTask({...newTask, tag: e.target.value})}
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", appearance: "none" }}
                    >
                      <option value="General">General</option>
                      <option value="Application">Application</option>
                      <option value="Study">Study</option>
                      <option value="Profile">Profile</option>
                      <option value="Scholarship">Scholarship</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Due Date</label>
                    <input 
                      type="date" 
                      value={newTask.date}
                      onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none", width: "100%", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input 
                    type="checkbox" 
                    id="urgent-check"
                    checked={newTask.urgent}
                    onChange={(e) => setNewTask({...newTask, urgent: e.target.checked})}
                    style={{ width: "18px", height: "18px", accentColor: "#f43f5e" }}
                  />
                  <label htmlFor="urgent-check" style={{ fontSize: "0.95rem", color: "var(--text-color)", cursor: "pointer" }}>Mark as Urgent</label>
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAdding(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>Add Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
