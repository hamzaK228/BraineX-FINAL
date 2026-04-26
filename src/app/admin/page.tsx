"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp, Search, Bell, Settings, LogOut, ChevronDown, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, UserPlus, FileText, MoreVertical, Database } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AdminContentManager } from "@/components/AdminContentManager";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [apiStats, setApiStats] = useState<any>(null);
  const [apiUsers, setApiUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (!data || Object.keys(data).length === 0) {
          router.push('/login');
        } else {
          setIsLoadingSession(false);
        }
      })
      .catch(() => { router.push('/login'); });
  }, [router]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) setApiStats(await res.json());
    } catch {}
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users?limit=10');
      if (res.ok) { const d = await res.json(); setApiUsers(d.users || []); }
    } catch {}
  }, []);

  useEffect(() => { if (!isLoadingSession) { fetchStats(); fetchUsers(); } }, [isLoadingSession, fetchStats, fetchUsers]);

  if (isLoadingSession) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Verifying Administrator Access...</div>;
  }

  // Stats — use real API data when available, fallback to mock
  const stats = apiStats ? [
    { title: "Total Users", value: apiStats.users?.total?.toLocaleString() || "0", change: apiStats.users?.growth || "+0%", up: !apiStats.users?.growth?.startsWith("-"), icon: Users, color: "3b82f6" },
    { title: "Active Mentors", value: apiStats.mentors?.toString() || "0", change: "+5.2%", up: true, icon: GraduationCap, color: "8b5cf6" },
    { title: "Content Items", value: apiStats.content?.total?.toString() || "0", change: "+100%", up: true, icon: Database, color: "10b981" },
    { title: "Messages", value: apiStats.messages?.toLocaleString() || "0", change: "+12%", up: true, icon: BookOpen, color: "f59e0b" },
  ] : [
    { title: "Total Users", value: "—", change: "loading", up: true, icon: Users, color: "3b82f6" },
    { title: "Active Mentors", value: "—", change: "loading", up: true, icon: GraduationCap, color: "8b5cf6" },
    { title: "Content Items", value: "—", change: "loading", up: true, icon: Database, color: "10b981" },
    { title: "Messages", value: "—", change: "loading", up: true, icon: BookOpen, color: "f59e0b" },
  ];

  // Use real users from API, fallback to mock
  const recentUsers = apiUsers.length > 0 ? apiUsers.map((u: any) => ({
    id: u.id, name: u.name || "Unknown", email: u.email, status: "Active", plan: u.tier || "Free",
    joinDate: new Date(u.createdAt).toLocaleDateString()
  })) : [
    { id: 1, name: "Emma Thompson", email: "emma.t@example.com", status: "Active", plan: "Pro", joinDate: "2 hours ago" },
    { id: 2, name: "David Chen", email: "david.c@example.com", status: "Pending", plan: "Free", joinDate: "5 hours ago" },
    { id: 3, name: "Sarah Williams", email: "sarah.w@example.com", status: "Active", plan: "Free", joinDate: "1 day ago" },
  ];

  const activities = [
    { id: 1, type: "user", text: "Emma Thompson upgraded to Pro plan", time: "10 min ago", icon: TrendingUp, color: "10b981" },
    { id: 2, type: "mentor", text: "New mentor application from Dr. R. Patel", time: "45 min ago", icon: UserPlus, color: "3b82f6" },
    { id: 3, type: "system", text: "Database backup completed successfully", time: "2 hours ago", icon: CheckCircle2, color: "8b5cf6" },
    { id: 4, type: "alert", text: "Failed login attempts spike detected", time: "5 hours ago", icon: AlertCircle, color: "f43f5e" },
    { id: 5, type: "content", text: "50 new scholarships imported via API", time: "1 day ago", icon: FileText, color: "f59e0b" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-color)", display: "flex", flexDirection: "column" }}>
      
      {/* Top Navigation */}
      <nav style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--card-border)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-color)" }}>Braine<span style={{ color: "#f43f5e" }}>X</span></span>
            <span style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase" }}>Admin</span>
          </Link>
          
          <div style={{ display: "flex", gap: "1rem" }}>
            {["overview", "users", "mentors", "content", "settings"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  background: "none", 
                  border: "none", 
                  padding: "0.5rem 1rem", 
                  color: activeTab === tab ? "var(--text-color)" : "var(--text-muted)", 
                  fontWeight: activeTab === tab ? "600" : "500", 
                  cursor: "pointer", 
                  textTransform: "capitalize",
                  position: "relative",
                  transition: "color 0.2s"
                }}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="admin-nav" style={{ position: "absolute", bottom: "-1rem", left: 0, right: 0, height: "2px", background: "#f43f5e" }} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ position: "relative" }}>
            <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" placeholder="Global Admin Search..." style={{ padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "100px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "0.9rem", width: "250px", outline: "none" }} />
          </div>
          <ThemeToggle />
          <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", position: "relative" }}>
            <Bell size={20} />
            <span style={{ position: "absolute", top: 0, right: 0, width: "8px", height: "8px", background: "#f43f5e", borderRadius: "50%" }} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", paddingLeft: "1rem", borderLeft: "1px solid var(--card-border)" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #f43f5e, #f97316)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem" }}>AD</div>
            <ChevronDown size={16} color="var(--text-muted)" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: "2rem", maxWidth: "1600px", margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", color: "var(--text-color)", textTransform: "capitalize" }}>{activeTab} Dashboard</h1>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>Welcome back, Admin. Manage your {activeTab} here.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-color)", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Settings size={16} /> Configure
            </button>
            <button style={{ background: "linear-gradient(135deg, #f43f5e, #f97316)", border: "none", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "600", boxShadow: "0 4px 15px rgba(244,63,94,0.3)" }}>
              Generate Report
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "1.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden" }}
                  >
                    <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "100px", height: "100px", background: `radial-gradient(circle, rgba(${parseInt(stat.color.slice(0,2),16)},${parseInt(stat.color.slice(2,4),16)},${parseInt(stat.color.slice(4,6),16)},0.15) 0%, rgba(0,0,0,0) 70%)`, borderRadius: "50%" }} />
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `rgba(${parseInt(stat.color.slice(0,2),16)},${parseInt(stat.color.slice(2,4),16)},${parseInt(stat.color.slice(4,6),16)},0.1)`, display: "flex", alignItems: "center", justifyContent: "center", color: `#${stat.color}` }}>
                        <Icon size={24} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: stat.up ? "#10b981" : "#f43f5e", background: stat.up ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)", padding: "0.2rem 0.5rem", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "bold" }}>
                        {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {stat.change}
                      </div>
                    </div>
                    
                    <div>
                      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "2rem", fontWeight: "800", color: "var(--text-color)" }}>{stat.value}</h3>
                      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: "500" }}>{stat.title}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Two Column Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
              {/* Left Column: Recent Users Table */}
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "1.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>Recent Users</h3>
                  <button onClick={() => setActiveTab('users')} style={{ background: "none", border: "none", color: "#f43f5e", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>View All</button>
                </div>
                
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                        <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>User</th>
                        <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>Status</th>
                        <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>Plan</th>
                        <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>Joined</th>
                        <th style={{ padding: "1rem 0.5rem", fontWeight: "600", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                          <td style={{ padding: "1rem 0.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--bg-color)", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-muted)" }}>
                                {user.name.split(" ").map((n: string) => n[0]).join("")}
                              </div>
                              <div>
                                <p style={{ margin: 0, fontWeight: "600", fontSize: "0.95rem" }}>{user.name}</p>
                                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "1rem 0.5rem" }}>
                            <span style={{ 
                              background: user.status === 'Active' ? "rgba(16,185,129,0.1)" : user.status === 'Pending' ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                              color: user.status === 'Active' ? "#10b981" : user.status === 'Pending' ? "#f59e0b" : "#ef4444",
                              padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "bold" 
                            }}>
                              {user.status}
                            </span>
                          </td>
                          <td style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "var(--text-muted)" }}>{user.plan}</td>
                          <td style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>{user.joinDate}</td>
                          <td style={{ padding: "1rem 0.5rem", textAlign: "right" }}>
                            <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.2rem" }}><MoreVertical size={18} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Activity Feed */}
              <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "1.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "700" }}>System Activity</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {activities.map((act, idx) => {
                    const Icon = act.icon;
                    return (
                      <div key={act.id} style={{ display: "flex", gap: "1rem", position: "relative" }}>
                        {idx !== activities.length - 1 && (
                          <div style={{ position: "absolute", top: "36px", bottom: "-24px", left: "17px", width: "2px", background: "var(--card-border)", zIndex: 0 }} />
                        )}
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `rgba(${parseInt(act.color.slice(0,2),16)},${parseInt(act.color.slice(2,4),16)},${parseInt(act.color.slice(4,6),16)},0.1)`, color: `#${act.color}`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, border: "2px solid var(--card-bg)", flexShrink: 0 }}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.9rem", color: "var(--text-color)", fontWeight: "500", lineHeight: "1.4" }}>{act.text}</p>
                          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{act.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <button style={{ width: "100%", marginTop: "2rem", padding: "0.75rem", background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "12px", color: "var(--text-color)", fontWeight: "600", cursor: "pointer" }}>
                  View All Logs
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
              <div style={{ position: "relative" }}>
                <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input type="text" placeholder="Search 12,450 users..." style={{ padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", width: "300px", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <select style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", cursor: "pointer" }}>
                  <option>All Plans</option>
                  <option>Free</option>
                  <option>Pro</option>
                </select>
                <select style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", cursor: "pointer" }}>
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>User</th>
                  <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>Plan</th>
                  <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>Joined</th>
                  <th style={{ padding: "1rem 0.5rem", fontWeight: "600", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...recentUsers, { id: 6, name: "Oliver Scott", email: "oliver@example.com", status: "Active", plan: "Free", joinDate: "1 week ago" }, { id: 7, name: "Sophia Martinez", email: "sophia.m@example.com", status: "Active", plan: "Premium", joinDate: "2 weeks ago" }].map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                    <td style={{ padding: "1rem 0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg-color)", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: "bold", color: "var(--text-muted)" }}>
                          {user.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: "600", fontSize: "1rem" }}>{user.name}</p>
                          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 0.5rem" }}>
                      <span style={{ 
                        background: user.status === 'Active' ? "rgba(16,185,129,0.1)" : user.status === 'Pending' ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                        color: user.status === 'Active' ? "#10b981" : user.status === 'Pending' ? "#f59e0b" : "#ef4444",
                        padding: "0.3rem 0.8rem", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "bold" 
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0.5rem", fontSize: "0.95rem", fontWeight: "500", color: "var(--text-muted)" }}>{user.plan}</td>
                    <td style={{ padding: "1rem 0.5rem", fontSize: "0.95rem", color: "var(--text-muted)" }}>{user.joinDate}</td>
                    <td style={{ padding: "1rem 0.5rem", textAlign: "right" }}>
                      <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.5rem" }}><MoreVertical size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {activeTab === "mentors" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Pending Applications</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "bold" }}>JD</div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600" }}>John Doe {i}</h4>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Harvard Alumni • STEM</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.5" }}>"I have 5 years of experience helping students secure full scholarships..."</p>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                    <button style={{ flex: 1, padding: "0.5rem", background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Approve</button>
                    <button style={{ flex: 1, padding: "0.5rem", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "content" && <AdminContentManager />}

        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", borderBottom: "1px solid var(--card-border)", paddingBottom: "1rem" }}>Platform Settings</h2>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid var(--card-border)" }}>
                <div>
                  <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem" }}>Maintenance Mode</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Disable access to the platform for all non-admin users.</p>
                </div>
                <div style={{ width: "48px", height: "24px", background: "var(--card-border)", borderRadius: "100px", position: "relative", cursor: "pointer" }}>
                  <div style={{ width: "20px", height: "20px", background: "white", borderRadius: "50%", position: "absolute", top: "2px", left: "2px" }} />
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid var(--card-border)" }}>
                <div>
                  <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem" }}>New Registrations</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Allow new users to sign up.</p>
                </div>
                <div style={{ width: "48px", height: "24px", background: "#10b981", borderRadius: "100px", position: "relative", cursor: "pointer" }}>
                  <div style={{ width: "20px", height: "20px", background: "white", borderRadius: "50%", position: "absolute", top: "2px", right: "2px" }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0" }}>
                <div>
                  <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem" }}>System Email Address</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Email used for automated notifications.</p>
                </div>
                <input type="email" value="noreply@brainex.com" readOnly style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)" }} />
              </div>
            </div>
          </motion.div>
        )}
      </main>
      
    </div>
  );
}
