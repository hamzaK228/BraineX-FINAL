"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Week View");
  
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", color: "#6366f1", date: new Date().toISOString().split('T')[0] });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const ComfortCard = ({ children, style = {} }: any) => (
    <div style={{
      background: "var(--card-bg)",
      border: "1px solid var(--card-border)",
      borderRadius: "24px",
      padding: "30px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      ...style
    }}>
      {children}
    </div>
  );

  // Date Logic
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "Week View") newDate.setDate(newDate.getDate() - 7);
    else if (view === "Month View") newDate.setMonth(newDate.getMonth() - 1);
    else newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "Week View") newDate.setDate(newDate.getDate() + 7);
    else if (view === "Month View") newDate.setMonth(newDate.getMonth() + 1);
    else newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  // Format Header
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  let headerText = "";
  if (view === "Week View") {
    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
      headerText = `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
    } else {
      headerText = `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    }
  } else if (view === "Month View") {
    headerText = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  } else {
    headerText = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  }

  // Generate Days Data
  let daysArray: Date[] = [];
  if (view === "Week View") {
    const startOfWeek = getStartOfWeek(currentDate);
    daysArray = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  } else if (view === "Month View") {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDayOfMonth = startOfMonth.getDay();
    const adjustedStartDay = startDayOfMonth === 0 ? 6 : startDayOfMonth - 1; // Make Monday 0
    daysArray = Array.from({ length: 42 }).map((_, i) => {
      const d = new Date(startOfMonth);
      d.setDate(d.getDate() - adjustedStartDay + i);
      return d;
    });
  } else {
    daysArray = [new Date(currentDate)];
  }

  // Initial Events Map
  const [eventsMap, setEventsMap] = useState<any>({});

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const map: any = {};
          data.forEach((ev: any) => {
            const d = new Date(ev.startDate);
            const dateStr = d.toDateString();
            if (!map[dateStr]) map[dateStr] = [];
            map[dateStr].push({ id: ev.id, title: ev.title, time: ev.startTime || "All Day", color: ev.color || "#6366f1" });
          });
          setEventsMap(map);
        }
      }
    } catch { /* fallback */ }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.date) return;

    // Convert newEvent.date (YYYY-MM-DD) to Date object to get the string format matching the map key
    // Watch out for timezone shifts, so construct date locally
    const [year, month, day] = newEvent.date.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    const dateStr = d.toDateString();

    setEventsMap((prev: any) => {
      const updated = { ...prev };
      if (!updated[dateStr]) updated[dateStr] = [];
      updated[dateStr] = [...updated[dateStr], { 
        title: newEvent.title, 
        time: newEvent.time || "All Day", 
        color: newEvent.color 
      }];
      return updated;
    });

    setNewEvent({ title: "", time: "", color: "#6366f1", date: new Date().toISOString().split('T')[0] });
    setIsAdding(false);

    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newEvent.title, startDate: newEvent.date, startTime: newEvent.time || "All Day", color: newEvent.color }),
      });
    } catch { /* silent */ }
  };

  const deleteEvent = (dateStr: string, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEventsMap((prev: any) => {
      const updated = { ...prev };
      if (updated[dateStr]) {
        updated[dateStr] = updated[dateStr].filter((_: any, i: number) => i !== index);
      }
      return updated;
    });
  };

  const renderEvent = (e: any, isCompact: boolean, dateStr: string, index: number) => (
    <div key={`${e.title}-${index}`} style={{ 
      background: `var(--bg-color)`, 
      border: `1px solid var(--card-border)`,
      borderLeft: `3px solid ${e.color}`, 
      padding: isCompact ? "0.4rem" : "0.85rem", 
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "0.5rem",
      position: "relative"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: isCompact ? "0.7rem" : "0.9rem", fontWeight: "700", color: "var(--text-color)", whiteSpace: isCompact ? "nowrap" : "normal", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "1.5rem" }}>{e.title}</div>
        <button onClick={(ev) => deleteEvent(dateStr, index, ev)} style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.2rem", position: "absolute", top: isCompact ? "2px" : "8px", right: "4px" }} title="Delete Event">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      {!isCompact && (
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: "500", marginTop: "0.3rem" }}>
          <Clock size={12} color={e.color} /> {e.time}
        </div>
      )}
    </div>
  );

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "1400px", margin: "0 auto", paddingBottom: "3rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, rgba(99,102,241,0.05), rgba(168,85,247,0.05))", padding: "2rem", borderRadius: "24px", border: "1px solid var(--card-border)" }}>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <CalendarIcon size={32} color="#6366f1" /> My Planner
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1.1rem" }}>Organize your academic schedule and never miss a deadline.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="ds-btn ds-btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 1.75rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "1rem" }}>
          <Plus size={20} /> Add Event
        </button>
      </div>

      <motion.div variants={itemVariants}>
        <ComfortCard style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--card-border)" }}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={handlePrev} style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "50%", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-color)" }}>
                  <ChevronLeft size={22} />
                </button>
                <button onClick={handleNext} style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "50%", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-color)" }}>
                  <ChevronRight size={22} />
                </button>
              </div>
              <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800" }}>{headerText}</h3>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <select value={view} onChange={(e) => setView(e.target.value)} style={{ padding: "0.65rem 1.5rem", borderRadius: "100px", background: "var(--bg-color)", border: "1px solid var(--card-border)", color: "var(--text-color)", outline: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.95rem" }}>
                <option value="Week View">Week View</option>
                <option value="Month View">Month View</option>
                <option value="Day View">Day View</option>
              </select>
            </div>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: view === "Day View" ? "1fr" : "repeat(7, minmax(120px, 1fr))", 
            gap: "1rem", 
            minHeight: "550px",
            overflowX: "auto",
            paddingBottom: "1rem"
          }}>
            {/* Month View Headers */}
            {view === "Month View" && ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
              <div key={day} style={{ textAlign: "center", fontWeight: "700", color: "var(--text-muted)", paddingBottom: "1rem", fontSize: "0.9rem" }}>
                {day}
              </div>
            ))}

            <AnimatePresence mode="popLayout">
              {daysArray.map((d, i) => {
                const isToday = d.toDateString() === new Date().toDateString();
                const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                const events = eventsMap[d.toDateString()] || [];
                const isMonthView = view === "Month View";

                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={d.toDateString()} 
                    style={{ 
                      background: isToday ? "rgba(99,102,241,0.03)" : "var(--bg-color)", 
                      border: isToday ? "2px solid #6366f1" : "1px solid var(--card-border)", 
                      borderRadius: isMonthView ? "12px" : "20px", 
                      padding: isMonthView ? "0.75rem" : "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      opacity: !isCurrentMonth && isMonthView ? 0.4 : 1,
                      minHeight: isMonthView ? "120px" : "auto"
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: isMonthView ? "row" : "column", justifyContent: isMonthView ? "space-between" : "center", alignItems: isMonthView ? "flex-start" : "center", marginBottom: isMonthView ? "0.5rem" : "1.5rem" }}>
                      <span style={{ fontSize: isMonthView ? "0.7rem" : "1rem", color: isToday ? "#6366f1" : "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>
                        {isMonthView ? (i < 7 ? dayNames[d.getDay()] : '') : dayNames[d.getDay()]}
                      </span>
                      <span style={{ fontSize: isMonthView ? "1.2rem" : "2.5rem", fontWeight: "800", lineHeight: 1, marginTop: isMonthView ? "0" : "0.25rem", background: isToday && isMonthView ? "#6366f1" : "transparent", color: isToday && isMonthView ? "white" : (isToday ? "#6366f1" : "inherit"), padding: isToday && isMonthView ? "0.2rem 0.5rem" : "0", borderRadius: "100px" }}>
                        {d.getDate()}
                      </span>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      {events.map((e: any, idx: number) => renderEvent(e, isMonthView, d.toDateString(), idx))}
                      
                      {events.length === 0 && !isMonthView && (
                        <div style={{ margin: "auto", color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic", textAlign: "center" }}>No events</div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ComfortCard>
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
                <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Add Event</h3>
                <button onClick={() => setIsAdding(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              <form onSubmit={handleAddEvent} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Event Title</label>
                  <input 
                    type="text" 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="e.g. Physics Lab" 
                    style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    autoFocus
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Date</label>
                    <input 
                      type="date" 
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Time</label>
                    <input 
                      type="text" 
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      placeholder="e.g. 10:00 AM" 
                      style={{ padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "1rem", outline: "none" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)" }}>Color Category</label>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {["#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#a855f7"].map(color => (
                      <div 
                        key={color}
                        onClick={() => setNewEvent({...newEvent, color})}
                        style={{ 
                          width: "30px", 
                          height: "30px", 
                          borderRadius: "50%", 
                          background: color, 
                          cursor: "pointer",
                          border: newEvent.color === color ? "3px solid var(--text-color)" : "3px solid transparent",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setIsAdding(false)} style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", background: "transparent", border: "1px solid var(--card-border)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button type="submit" className="ds-btn ds-btn-primary" style={{ padding: "0.75rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>Save Event</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
