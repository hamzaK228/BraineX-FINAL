"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight, Plus, Building, GraduationCap, ListTodo, FileText, BookOpen, Clock, Calendar, CalendarDays, TrendingUp, User, Map } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [userName, setUserName] = useState("there");
  const [stats, setStats] = useState([
    { label: "Active Goals", value: "0", icon: "🎯" },
    { label: "Tasks In Progress", value: "0", icon: "📚" },
    { label: "Scholarships Saved", value: "0", icon: "🏆" },
    { label: "Deadlines This Month", value: "0", icon: "🔥" }
  ]);
  const [goals, setGoals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      // Fetch user
      const userRes = await fetch("/api/user/me");
      if (userRes.ok) { const u = await userRes.json(); setUserName(u.name?.split(" ")[0] || "there"); }
    } catch { /* fallback */ }
    try {
      // Fetch stats
      const statsRes = await fetch("/api/dashboard/stats");
      if (statsRes.ok) {
        const s = await statsRes.json();
        setStats([
          { label: "Active Goals", value: String(s.goals ?? 0), icon: "🎯" },
          { label: "Tasks In Progress", value: String(s.tasks?.total ?? 0), icon: "📚" },
          { label: "Scholarships Saved", value: String(s.scholarships ?? 0), icon: "🏆" },
          { label: "Deadlines This Month", value: String(s.deadlines ?? 0), icon: "🔥" }
        ]);
      }
    } catch { /* fallback */ }
    try {
      // Fetch goals
      const goalsRes = await fetch("/api/goals");
      if (goalsRes.ok) {
        const data = await goalsRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setGoals(data.slice(0, 4).map((g: any) => ({ id: g.id, text: g.title, completed: g.status === "completed", category: g.category || "General", progress: g.progress ?? 0 })));
        }
      }
    } catch { /* fallback */ }
    try {
      // Fetch tasks
      const tasksRes = await fetch("/api/tasks");
      if (tasksRes.ok) {
        const data = await tasksRes.json();
        if (Array.isArray(data)) {
          setTasks(data.slice(0, 5).map((t: any) => ({
            id: t.id,
            text: t.title,
            done: t.status === "completed"
          })));
        }
      }
    } catch { /* fallback */ }
    setIsReady(true);
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Reusable Comfortable Card Component
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

  const isNewUser = isReady && stats.every(s => s.value === "0" || s.value === "—") && goals.length === 0;

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ display: "flex", flexDirection: "column", gap: "3.5rem", maxWidth: "1200px", margin: "0 auto", paddingBottom: "3rem" }}
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants}>
        <ComfortCard style={{ 
          background: "linear-gradient(to right, rgba(99,102,241,0.05), rgba(168,85,247,0.05))",
          display: "flex", 
          alignItems: "center", 
          gap: "2rem",
          flexWrap: "wrap"
        }}>
          <div style={{ fontSize: "4rem", lineHeight: 1 }}>🏠</div>
          <div>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", fontWeight: "800" }}>Welcome back, {userName}!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "700px", lineHeight: "1.6" }}>
              Welcome to your BraineX Dashboard! As a new user, you can start by adding a goal, saving universities or programs, and managing your tasks. Let's build your path to success!
            </p>
          </div>
        </ComfortCard>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        {stats.map((stat, i) => (
          <ComfortCard key={i} style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "24px" }}>
            <div style={{ fontSize: "2.5rem" }}>{stat.icon}</div>
            <div>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#6366f1" }}>{stat.value}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "600" }}>{stat.label}</div>
            </div>
          </ComfortCard>
        ))}
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
        
        {/* My Goals Tracker */}
        <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <ComfortCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🎯</span>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>My Goals Tracker</h3>
              </div>
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.25rem", borderRadius: "100px", fontSize: "0.95rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Plus size={18} /> Add Goal
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {goals.length > 0 ? goals.map((goal) => (
                <div key={goal.id} style={{ 
                  background: "var(--bg-color)", 
                  border: "1px solid var(--card-border)",
                  borderRadius: "16px", 
                  padding: "1.25rem",
                  opacity: goal.completed ? 0.6 : 1,
                  transition: "transform 0.2s ease",
                  cursor: "pointer"
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
                    <div style={{ marginTop: "0.2rem" }}>
                      {goal.completed ? <CheckCircle2 color="#10b981" size={28} /> : <Circle color="var(--text-muted)" size={28} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "0.5rem" }}>
                        <h4 style={{ margin: 0, fontSize: "1.1rem", textDecoration: goal.completed ? "line-through" : "none", color: goal.completed ? "var(--text-muted)" : "var(--text-color)" }}>
                          {goal.text}
                        </h4>
                        <span style={{ fontSize: "0.75rem", fontWeight: "bold", background: "rgba(99,102,241,0.1)", color: "#6366f1", padding: "0.3rem 0.8rem", borderRadius: "100px" }}>
                          {goal.category}
                        </span>
                      </div>
                      {!goal.completed && (
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                          <div style={{ flex: 1, height: "8px", background: "rgba(168,85,247,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${goal.progress}%`, background: "linear-gradient(90deg, #6366f1, #a855f7)", borderRadius: "4px" }} />
                          </div>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "bold" }}>{goal.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                  <Target size={48} color="var(--card-border)" style={{ marginBottom: "1rem" }} />
                  <p>You have no active goals. Start by adding one!</p>
                </div>
              )}
            </div>
            
            <Link href="/dashboard/goals" style={{ marginTop: "2rem", color: "#6366f1", fontSize: "1rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", alignSelf: "center", textDecoration: "none" }}>
              View All Goals <ArrowRight size={18} />
            </Link>
          </ComfortCard>
        </motion.div>
        
        {/* Secondary Column: Deadlines & Suggestions */}
        <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          
          {/* Upcoming Deadlines */}
          <ComfortCard>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <span style={{ fontSize: "1.5rem" }}>⏰</span>
              <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Upcoming Deadlines</h3>
            </div>
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              <Clock size={32} color="var(--card-border)" style={{ marginBottom: "1rem" }} />
              <p>No upcoming deadlines. Save a scholarship or program to track it here!</p>
            </div>
          </ComfortCard>

          {/* Suggested for You */}
          <ComfortCard style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <span style={{ fontSize: "1.5rem" }}>💡</span>
              <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Suggested for You</h3>
            </div>
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              <Lightbulb size={32} color="var(--card-border)" style={{ marginBottom: "1rem" }} />
              <p>Tell us more about your interests to get personalized suggestions.</p>
            </div>
          </ComfortCard>
        </motion.div>
      </div>

      {/* Row 4: Universities & Programs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
        
        {/* Saved Universities */}
        <motion.div variants={itemVariants} style={{ display: "flex" }}>
          <ComfortCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🏛️</span>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Saved Universities</h3>
              </div>
              <Link href="/universities" style={{ color: "#6366f1", fontSize: "0.95rem", fontWeight: "600", textDecoration: "none" }}>Browse All</Link>
            </div>
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              <Building size={32} color="var(--card-border)" style={{ marginBottom: "1rem" }} />
              <p>You haven't saved any universities yet.</p>
              <Link href="/universities" style={{ color: "#6366f1", marginTop: "1rem", display: "inline-block", fontWeight: "600" }}>Explore Universities</Link>
            </div>
          </ComfortCard>
        </motion.div>

        {/* Saved Programs */}
        <motion.div variants={itemVariants} style={{ display: "flex" }}>
          <ComfortCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🎓</span>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Saved Programs</h3>
              </div>
              <Link href="/programs" style={{ color: "#6366f1", fontSize: "0.95rem", fontWeight: "600", textDecoration: "none" }}>Browse All</Link>
            </div>
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
              <GraduationCap size={32} color="var(--card-border)" style={{ marginBottom: "1rem" }} />
              <p>You haven't saved any programs yet.</p>
              <Link href="/programs" style={{ color: "#6366f1", marginTop: "1rem", display: "inline-block", fontWeight: "600" }}>Explore Programs</Link>
            </div>
          </ComfortCard>
        </motion.div>
      </div>

      {!isNewUser ? (
        <>
      {/* Row 5: Schedule & Important Dates */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem" }}>
        {/* Weekly Schedule */}
        <motion.div variants={itemVariants} style={{ display: "flex" }}>
        <ComfortCard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "1.5rem" }}>📅</span>
              <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Weekly Schedule</h3>
            </div>
            <Link href="/dashboard/planner" style={{ color: "#6366f1", fontSize: "0.95rem", fontWeight: "600", textDecoration: "none" }}>Open Full Planner</Link>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
            {[
              { day: "Mon", date: "12", events: [{ title: "Physics Lab", color: "#3b82f6" }] },
              { day: "Tue", date: "13", events: [{ title: "Mentor Call", color: "#a855f7" }, { title: "Draft Essay", color: "#10b981" }] },
              { day: "Wed", date: "14", isToday: true, events: [{ title: "Submit Application", color: "#f43f5e" }] },
              { day: "Thu", date: "15", events: [] },
              { day: "Fri", date: "16", events: [{ title: "Study Group", color: "#f59e0b" }] },
            ].map((d, i) => (
              <div key={i} style={{ 
                background: d.isToday ? "rgba(99,102,241,0.05)" : "var(--bg-color)", 
                border: d.isToday ? "2px solid #6366f1" : "1px solid var(--card-border)", 
                borderRadius: "16px", 
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                minHeight: "150px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.9rem", color: d.isToday ? "#6366f1" : "var(--text-muted)", fontWeight: "600" }}>{d.day}</span>
                  <span style={{ fontSize: "1.2rem", fontWeight: "800", color: d.isToday ? "#6366f1" : "var(--text-color)" }}>{d.date}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                  {d.events.length === 0 ? (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", marginTop: "auto", marginBottom: "auto" }}>Free Day</div>
                  ) : d.events.map((e, j) => (
                    <div key={j} style={{ background: `rgba(${e.color === '#3b82f6' ? '59,130,246' : e.color === '#a855f7' ? '168,85,247' : e.color === '#10b981' ? '16,185,129' : e.color === '#f43f5e' ? '244,63,94' : '245,158,11'}, 0.1)`, borderLeft: `3px solid ${e.color}`, padding: "0.5rem", borderRadius: "0 6px 6px 0", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-color)" }}>
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ComfortCard>
        </motion.div>

        {/* Important Dates Calendar */}
        <motion.div variants={itemVariants} style={{ display: "flex" }}>
          <ComfortCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🗓️</span>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Important Dates</h3>
              </div>
              <button style={{ background: "none", border: "none", color: "#6366f1", fontWeight: "600", cursor: "pointer" }}><Plus size={20} /></button>
            </div>
            
            {/* Minimal Calendar View */}
            <div style={{ background: "var(--bg-color)", borderRadius: "16px", padding: "1.5rem", border: "1px solid var(--card-border)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                <h4 style={{ margin: 0, fontSize: "1.1rem" }}>October 2024</h4>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button style={{ background: "var(--card-border)", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", color: "var(--text-color)" }}>&lt;</button>
                  <button style={{ background: "var(--card-border)", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", color: "var(--text-color)" }}>&gt;</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem", textAlign: "center", fontSize: "0.95rem" }}>
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isEvent = day === 12 || day === 15 || day === 25;
                  const isToday = day === 14;
                  return (
                    <div key={i} style={{ 
                      aspectRatio: "1/1", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      borderRadius: "50%",
                      background: isToday ? "#6366f1" : isEvent ? "rgba(244,63,94,0.1)" : "transparent",
                      color: isToday ? "#fff" : isEvent ? "#f43f5e" : "var(--text-color)",
                      fontWeight: isToday || isEvent ? "bold" : "normal",
                      cursor: "pointer"
                    }}>
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f43f5e" }}></div>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>Oct 15 - Early Action Deadline</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Don't forget to submit SAT scores</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }}></div>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>Oct 25 - NSF Fellowship</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Final review with mentor</div>
                </div>
              </div>
            </div>
          </ComfortCard>
        </motion.div>
      </div>

      {/* Row 6: Progress & Tasks */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "2.5rem" }}>
        
        {/* My Progress */}
        <motion.div variants={itemVariants} style={{ display: "flex" }}>
          <ComfortCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>📊</span>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Overall Progress</h3>
              </div>
              <Link href="/dashboard/goals" style={{ color: "#6366f1", fontSize: "0.95rem", fontWeight: "600", textDecoration: "none" }}>View Stats</Link>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {/* Progress Bar 1 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}><GraduationCap size={18} color="#a855f7" /> University Applications</div>
                  <span style={{ fontWeight: "bold", color: "#a855f7" }}>40%</span>
                </div>
                <div style={{ height: "10px", background: "rgba(168,85,247,0.15)", borderRadius: "5px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "40%", background: "#a855f7", borderRadius: "5px" }}></div>
                </div>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>2 of 5 applications submitted</p>
              </div>

              {/* Progress Bar 2 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}><Map size={18} color="#10b981" /> Active Roadmaps</div>
                  <span style={{ fontWeight: "bold", color: "#10b981" }}>65%</span>
                </div>
                <div style={{ height: "10px", background: "rgba(16,185,129,0.15)", borderRadius: "5px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "65%", background: "#10b981", borderRadius: "5px" }}></div>
                </div>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Data Structures module almost complete</p>
              </div>

              {/* Progress Bar 3 */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}><User size={18} color="#f59e0b" /> Profile Strength</div>
                  <span style={{ fontWeight: "bold", color: "#f59e0b" }}>85%</span>
                </div>
                <div style={{ height: "10px", background: "rgba(245,158,11,0.15)", borderRadius: "5px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "85%", background: "#f59e0b", borderRadius: "5px" }}></div>
                </div>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Add test scores to reach 100%</p>
              </div>
            </div>
          </ComfortCard>
        </motion.div>
        
        {/* Daily Tasks */}
        <motion.div variants={itemVariants} style={{ display: "flex" }}>
          <ComfortCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>✅</span>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Daily Tasks</h3>
              </div>
              <Link href="/dashboard/tasks" style={{ color: "#6366f1", fontSize: "0.95rem", fontWeight: "600", textDecoration: "none" }}>View All</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {tasks.length > 0 ? tasks.map((task, i) => (
                <div key={task.id || i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--bg-color)", borderRadius: "12px", border: "1px solid var(--card-border)", opacity: task.done ? 0.6 : 1, transition: "transform 0.2s" }}>
                  <div style={{ cursor: "pointer" }} onClick={async () => {
                    const newStatus = task.done ? "todo" : "completed";
                    setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
                    try {
                      await fetch(`/api/tasks/${task.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: newStatus }),
                      });
                    } catch {}
                  }}>
                    {task.done ? <CheckCircle2 color="#10b981" /> : <Circle color="var(--text-muted)" />}
                  </div>
                  <span style={{ fontSize: "1.05rem", textDecoration: task.done ? "line-through" : "none", color: task.done ? "var(--text-muted)" : "var(--text-color)" }}>{task.text}</span>
                </div>
              )) : (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  <ListTodo size={32} color="var(--card-border)" style={{ marginBottom: "1rem" }} />
                  <p>No tasks for today. Start adding some!</p>
                  <Link href="/dashboard/tasks" style={{ color: "#6366f1", marginTop: "1rem", display: "inline-block", fontWeight: "600" }}>Go to Tasks</Link>
                </div>
              )}
            </div>
          </ComfortCard>
        </motion.div>

      </div>

      {/* Row 7: Resources & Heatmap */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "2.5rem" }}>
        
        {/* Recommended Resources */}
        <motion.div variants={itemVariants} style={{ display: "flex" }}>
          <ComfortCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>📚</span>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Learning Resources</h3>
              </div>
              <Link href="/resources" style={{ color: "#6366f1", fontSize: "0.95rem", fontWeight: "600", textDecoration: "none" }}>Browse All</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Link href="#" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--bg-color)", borderRadius: "12px", border: "1px solid var(--card-border)", textDecoration: "none", color: "var(--text-color)", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ padding: "0.6rem", background: "rgba(168,85,247,0.1)", color: "#a855f7", borderRadius: "8px" }}><FileText size={20} /></div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>Ultimate Essay Guide</h4>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>PDF Document • 2.4 MB</p>
                </div>
              </Link>
              <Link href="#" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--bg-color)", borderRadius: "12px", border: "1px solid var(--card-border)", textDecoration: "none", color: "var(--text-color)", transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ padding: "0.6rem", background: "rgba(59,130,246,0.1)", color: "#3b82f6", borderRadius: "8px" }}><BookOpen size={20} /></div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: "1rem" }}>Interview Prep Course</h4>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Video Series • 45 mins</p>
                </div>
              </Link>
            </div>
          </ComfortCard>
        </motion.div>
      </div>

      {/* Third Row: Roadmaps & Activity Heatmap */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "2.5rem" }}>
        
        {/* Active Roadmaps */}
        <motion.div variants={itemVariants} style={{ display: "flex" }}>
          <ComfortCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🗺️</span>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Active Roadmaps</h3>
              </div>
              <Link href="/roadmaps" style={{ color: "#6366f1", fontSize: "0.95rem", fontWeight: "600", textDecoration: "none" }}>Browse All</Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Roadmap Item 1 */}
              <div style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem" }}>Data Structures & Algorithms</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Module 4: Trees & Graphs</p>
                  </div>
                  <span style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "0.4rem 0.8rem", borderRadius: "100px", fontSize: "0.85rem", fontWeight: "bold" }}>
                    65% Done
                  </span>
                </div>
                <div style={{ height: "8px", background: "rgba(16,185,129,0.15)", borderRadius: "4px", overflow: "hidden", marginBottom: "1.25rem" }}>
                  <div style={{ height: "100%", width: "65%", background: "#10b981", borderRadius: "4px" }} />
                </div>
                <button className="ds-btn ds-btn-primary" style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", background: "var(--card-border)", color: "var(--text-color)", border: "none", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'var(--card-border)'}>
                  Continue Learning
                </button>
              </div>

              {/* Roadmap Item 2 */}
              <div style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem" }}>Machine Learning Fundamentals</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Module 1: Intro to Python</p>
                  </div>
                  <span style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", padding: "0.4rem 0.8rem", borderRadius: "100px", fontSize: "0.85rem", fontWeight: "bold" }}>
                    12% Done
                  </span>
                </div>
                <div style={{ height: "8px", background: "rgba(99,102,241,0.15)", borderRadius: "4px", overflow: "hidden", marginBottom: "1.25rem" }}>
                  <div style={{ height: "100%", width: "12%", background: "#6366f1", borderRadius: "4px" }} />
                </div>
                <button className="ds-btn ds-btn-primary" style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", background: "var(--card-border)", color: "var(--text-color)", border: "none", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'var(--card-border)'}>
                  Continue Learning
                </button>
              </div>
            </div>
          </ComfortCard>
        </motion.div>

        {/* Activity & Streak Heatmap */}
        <motion.div variants={itemVariants} style={{ display: "flex" }}>
          <ComfortCard style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>📈</span>
                <h3 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "700" }}>Activity Tracker</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(236,72,153,0.1)", color: "#ec4899", padding: "0.4rem 0.8rem", borderRadius: "8px", fontWeight: "bold", fontSize: "0.9rem" }}>
                🔥 5 Day Streak
              </div>
            </div>

            {/* Simulated Heatmap */}
            <div style={{ background: "var(--bg-color)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--card-border)", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                  <span key={day} style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", width: "14%", textAlign: "center" }}>{day}</span>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[1, 2, 3].map(week => (
                  <div key={week} style={{ display: "flex", justifyContent: "space-between" }}>
                    {[1, 2, 3, 4, 5, 6, 7].map(day => {
                      const intensity = Math.random();
                      let bg = "var(--card-border)";
                      if (intensity > 0.8) bg = "#6366f1";
                      else if (intensity > 0.5) bg = "rgba(99,102,241,0.6)";
                      else if (intensity > 0.3) bg = "rgba(99,102,241,0.3)";
                      
                      return (
                        <div key={day} style={{ 
                          width: "12%", 
                          aspectRatio: "1/1", 
                          background: bg, 
                          borderRadius: "4px",
                          transition: "transform 0.2s",
                          cursor: "pointer"
                        }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Less <div style={{width: 12, height: 12, background: "var(--card-border)", borderRadius: 2}}></div>
                <div style={{width: 12, height: 12, background: "rgba(99,102,241,0.3)", borderRadius: 2}}></div>
                <div style={{width: 12, height: 12, background: "rgba(99,102,241,0.6)", borderRadius: 2}}></div>
                <div style={{width: 12, height: 12, background: "#6366f1", borderRadius: 2}}></div> More
              </div>
            </div>

            {/* Recent Log */}
            <div>
              <h4 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", color: "var(--text-muted)" }}>Recent Actions</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 8, height: 8, background: "#10b981", borderRadius: "50%" }}></div>
                  <span style={{ fontSize: "0.95rem" }}>Completed <strong>Arrays & Strings</strong> quiz.</span>
                  <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-muted)" }}>2h ago</span>
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: 8, height: 8, background: "#f59e0b", borderRadius: "50%" }}></div>
                  <span style={{ fontSize: "0.95rem" }}>Saved <strong>Rhodes Scholarship</strong>.</span>
                  <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-muted)" }}>Yesterday</span>
                </li>
              </ul>
            </div>
          </ComfortCard>
        </motion.div>
      </div>
      </>
      ) : (
        <motion.div variants={itemVariants} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem" }}>
          <ComfortCard style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", background: "rgba(99,102,241,0.1)", width: "80px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", marginBottom: "1rem" }}>🚀</div>
            <h3 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "800" }}>Let's Get Started!</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "600px", lineHeight: "1.6" }}>
              Your dashboard is looking a bit empty because you haven't started tracking your activities yet. Here's a quick guide to what you can do:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", width: "100%", marginTop: "2rem" }}>
              <div style={{ padding: "1.5rem", background: "var(--bg-color)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                <Target size={24} color="#f43f5e" style={{ marginBottom: "1rem" }} />
                <h4 style={{ margin: "0 0 0.5rem 0" }}>Set Goals</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Use the Goals Tracker above to set your first academic goal.</p>
              </div>
              <div style={{ padding: "1.5rem", background: "var(--bg-color)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                <Map size={24} color="#10b981" style={{ marginBottom: "1rem" }} />
                <h4 style={{ margin: "0 0 0.5rem 0" }}>Start a Roadmap</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Explore our roadmaps to get a guided learning experience.</p>
              </div>
              <div style={{ padding: "1.5rem", background: "var(--bg-color)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                <Building size={24} color="#a855f7" style={{ marginBottom: "1rem" }} />
                <h4 style={{ margin: "0 0 0.5rem 0" }}>Save Opportunities</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Browse universities and scholarships to save them to your profile.</p>
              </div>
            </div>
            <Link href="/dashboard/goals" className="ds-btn ds-btn-primary" style={{ marginTop: "2rem", padding: "0.75rem 2rem", borderRadius: "100px", fontWeight: "600", textDecoration: "none" }}>
              Create Your First Goal
            </Link>
          </ComfortCard>
        </motion.div>
      )}

    </motion.div>
  );
}
