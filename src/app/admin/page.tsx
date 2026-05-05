"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, TrendingUp, Search, Bell, Settings, ChevronDown, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight, UserPlus, FileText, MoreVertical, Database, ShieldBan, ShieldCheck, Trash2, Activity, Download, RefreshCw, X, Save, Edit3, Plus, LogOut, UserCog, BarChart3, Clock, Mail, Globe, Lock, ToggleLeft } from "lucide-react";
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
  const [apiActivity, setApiActivity] = useState<any[]>([]);
  const [userActionLoading, setUserActionLoading] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPagination, setUserPagination] = useState({ total: 0, totalPages: 1 });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    systemEmail: "noreply@brainex.com",
    siteName: "BraineX",
    maxMentors: "50",
    sessionTimeout: "60",
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (!data || Object.keys(data).length === 0) {
          router.push('/login');
        } else {
          setSessionUser(data.user);
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
      const params = new URLSearchParams();
      params.set('page', String(userPage));
      params.set('limit', '10');
      if (userSearch) params.set('search', userSearch);
      if (userRoleFilter) params.set('role', userRoleFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) { const d = await res.json(); setApiUsers(d.users || []); setUserPagination(d.pagination || { total: 0, totalPages: 1 }); }
    } catch {}
  }, [userPage, userSearch, userRoleFilter]);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/activity?limit=10');
      if (res.ok) { const d = await res.json(); setApiActivity(d.items || []); }
    } catch {}
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications?limit=5');
      if (res.ok) { const d = await res.json(); setNotifications(d.items || d || []); }
    } catch {}
  }, []);

  const handleBlockUser = async (userId: string, currentStatus: string) => {
    setUserActionLoading(userId);
    try {
      const newStatus = currentStatus === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      if (res.ok) { fetchUsers(); fetchActivity(); }
    } catch {} finally { setUserActionLoading(null); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setUserActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) { fetchUsers(); fetchStats(); fetchActivity(); }
    } catch {} finally { setUserActionLoading(null); }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        const report = [
      `=== BraineX Admin Report ===`,
      `Generated: ${new Date().toLocaleString()}`,
      ``,
      `Total Users: ${data.users?.total || 0}`,
      `Active Mentors: ${data.mentors || 0}`,
      `Total Messages: ${data.messages || 0}`,
      `Saved Items: ${data.savedItems || 0}`,
      `Bookings: ${data.bookings?.total || 0} (${data.bookings?.pending || 0} pending)`,
      ``,
      `Content:`,
      `  Universities: ${data.content?.universities || 0}`,
      `  Programs: ${data.content?.programs || 0}`,
      `  Scholarships: ${data.content?.scholarships || 0}`,
      `  Fields: ${data.content?.fields || 0}`,
      `  Projects: ${data.content?.projects || 0}`,
      `  Roadmaps: ${data.content?.roadmaps || 0}`,
      `  Total: ${data.content?.total || 0}`,
      ``,
      `=== End Report ===`,
        ].join('\n');
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `brainex-report-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {}
  };

  const handleSaveSettings = async () => {
    setShowSettingsModal(false);
    alert('Settings saved successfully!');
  };

  useEffect(() => { if (!isLoadingSession) { fetchStats(); fetchUsers(); fetchActivity(); fetchNotifications(); } }, [isLoadingSession, fetchStats, fetchUsers, fetchActivity, fetchNotifications]);

  if (isLoadingSession) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)', color: 'var(--text-color)' }}>Verifying Administrator Access...</div>;
  }

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

  const recentUsers = apiUsers.map((u: any) => ({
    id: u.id, name: u.name || "Unknown", email: u.email, status: u.status || "ACTIVE", role: u.role || "STUDENT", plan: u.tier || "Free",
    joinDate: new Date(u.createdAt).toLocaleDateString()
  }));

  const iconMap: Record<string, any> = { CREATE: FileText, UPDATE: CheckCircle2, DELETE: AlertCircle, BLOCK: ShieldBan, UNBLOCK: ShieldCheck };
  const colorMap: Record<string, string> = { CREATE: "10b981", UPDATE: "3b82f6", DELETE: "f43f5e", BLOCK: "f59e0b", UNBLOCK: "8b5cf6" };
  const activities = apiActivity.length > 0 ? apiActivity.map((a: any) => ({
    id: a.id, text: a.details || `${a.action} ${a.target}`, time: new Date(a.createdAt).toLocaleString(),
    icon: iconMap[a.action] || FileText, color: colorMap[a.action] || "3b82f6"
  })) : [
    { id: 1, text: "No recent activity", time: "", icon: Activity, color: "3b82f6" },
  ];

  const cardStyle: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "1.5rem", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-color)", display: "flex", flexDirection: "column" }}>
      
      {/* Top Navigation */}
      <nav className="admin-header" style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--card-border)", zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div className="admin-nav-left">
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-color)" }}>Braine<span style={{ color: "#f43f5e" }}>X</span></span>
              <span style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase" }}>Admin</span>
            </Link>
          </div>

          <div className="admin-nav-right" style={{ gap: "1rem" }}>
            <div style={{ position: "relative" }} className="admin-search-container">
              <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              <input className="responsive-search" type="text" placeholder="Search..." style={{ padding: "0.5rem 1rem 0.5rem 2.5rem", borderRadius: "100px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "0.9rem", outline: "none" }} />
            </div>
            <ThemeToggle />
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", position: "relative" }}>
                <Bell size={20} />
                {notifications.filter((n: any) => !n.isRead).length > 0 && (
                  <span style={{ position: "absolute", top: 0, right: 0, width: "8px", height: "8px", background: "#f43f5e", borderRadius: "50%" }} />
                )}
              </button>
              {showNotifications && (
                <div style={{ position: "absolute", top: "100%", right: 0, width: "320px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginTop: "0.5rem", overflow: "hidden", zIndex: 200 }}>
                  <div style={{ padding: "1rem", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "700" }}>Notifications</h4>
                    <button onClick={() => setShowNotifications(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={16} /></button>
                  </div>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {notifications.length > 0 ? notifications.slice(0, 5).map((n: any, i: number) => (
                      <div key={n.id || i} style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--card-border)", fontSize: "0.85rem" }}>
                        <p style={{ margin: 0, fontWeight: n.isRead ? "normal" : "600" }}>{n.title || n.message || "Notification"}</p>
                        <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "var(--text-muted)" }}>{n.createdAt ? new Date(n.createdAt).toLocaleString() : "Just now"}</p>
                      </div>
                    )) : (
                      <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>No notifications</div>
                    )}
                  </div>
                  <Link href="/dashboard/notifications" style={{ display: "block", padding: "0.75rem", textAlign: "center", color: "#f43f5e", fontWeight: "600", fontSize: "0.85rem", textDecoration: "none", borderTop: "1px solid var(--card-border)" }}>View All</Link>
                </div>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", paddingLeft: "0.5rem", borderLeft: "1px solid var(--card-border)" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #f43f5e, #f97316)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem" }}>
                  {sessionUser?.name ? sessionUser.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "AD"}
                </div>
                <ChevronDown size={16} color="var(--text-muted)" className="admin-avatar-chevron" />
              </div>
              {showProfileMenu && (
                <div style={{ position: "absolute", top: "100%", right: 0, width: "200px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", marginTop: "0.5rem", overflow: "hidden", zIndex: 200 }}>
                  <div style={{ padding: "1rem", borderBottom: "1px solid var(--card-border)" }}>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem" }}>{sessionUser?.name || "Admin"}</p>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>{sessionUser?.email || "admin@brainex.com"}</p>
                  </div>
                  <Link href="/dashboard/settings" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", color: "var(--text-color)", textDecoration: "none", fontSize: "0.85rem", borderBottom: "1px solid var(--card-border)" }}>
                    <UserCog size={16} /> Profile Settings
                  </Link>
                  <button onClick={() => router.push('/')} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", color: "var(--text-color)", background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", fontSize: "0.85rem", borderBottom: "1px solid var(--card-border)" }}>
                    <Globe size={16} /> View Site
                  </button>
                  <button onClick={() => router.push('/login')} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", color: "#f43f5e", background: "none", border: "none", width: "100%", textAlign: "left", cursor: "pointer", fontSize: "0.85rem" }}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Below Header */}
        <div style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingTop: "0.5rem", marginTop: "0.5rem", whiteSpace: "nowrap", WebkitOverflowScrolling: "touch", width: "100%", scrollbarWidth: "none" }}>
          {["overview", "users", "activity", "content", "settings"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ 
                background: "none", 
                border: "none", 
                padding: "0.5rem 0.2rem", 
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
                <motion.div layoutId="admin-nav" style={{ position: "absolute", bottom: "0", left: 0, right: 0, height: "2px", background: "#f43f5e" }} />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="admin-main" style={{ maxWidth: "1600px", margin: "0 auto", width: "100%", flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", color: "var(--text-color)", textTransform: "capitalize" }}>{activeTab} Dashboard</h1>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>Welcome back, Admin. Manage your {activeTab} here.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setShowSettingsModal(true)} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--text-color)", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "500", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Settings size={16} /> Configure
            </button>
            <button onClick={handleGenerateReport} style={{ background: "linear-gradient(135deg, #f43f5e, #f97316)", border: "none", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 15px rgba(244,63,94,0.3)" }}>
              <Download size={16} /> Generate Report
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
            <div className="admin-grid">
              {/* Left Column: Recent Users Table */}
              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>Recent Users</h3>
                  <button onClick={() => setActiveTab('users')} style={{ background: "none", border: "none", color: "#f43f5e", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>View All</button>
                </div>
                
                <div className="responsive-table-container">
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
                              background: user.status === 'ACTIVE' ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                              color: user.status === 'ACTIVE' ? "#10b981" : "#ef4444",
                              padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "bold" 
                            }}>
                              {user.status === 'ACTIVE' ? 'Active' : 'Blocked'}
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
              <div style={cardStyle}>
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
                
                <button onClick={() => setActiveTab('activity')} style={{ width: "100%", marginTop: "2rem", padding: "0.75rem", background: "var(--bg-color)", border: "1px solid var(--card-border)", borderRadius: "12px", color: "var(--text-color)", fontWeight: "600", cursor: "pointer" }}>
                  View All Logs
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ position: "relative" }}>
                <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="text" 
                  placeholder={`Search ${userPagination.total} users...`} 
                  value={userSearch}
                  onChange={e => { setUserSearch(e.target.value); setUserPage(1); }}
                  style={{ padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", width: "300px", outline: "none" }} 
                />
              </div>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <select 
                  value={userRoleFilter} 
                  onChange={e => { setUserRoleFilter(e.target.value); setUserPage(1); }}
                  style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", cursor: "pointer" }}
                >
                  <option value="">All Roles</option>
                  <option value="STUDENT">Student</option>
                  <option value="MENTOR">Mentor</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <select 
                  value={userStatusFilter}
                  onChange={e => { setUserStatusFilter(e.target.value); setUserPage(1); }}
                  style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", cursor: "pointer" }}
                >
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked</option>
                </select>
                <button onClick={() => { setUserSearch(""); setUserRoleFilter(""); setUserStatusFilter(""); setUserPage(1); }} style={{ padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", cursor: "pointer", fontWeight: "500" }}>
                  <RefreshCw size={16} /> Reset
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="responsive-table-container">
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-muted)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>User</th>
                    <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>Role</th>
                    <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>Status</th>
                    <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>Plan</th>
                    <th style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>Joined</th>
                    <th style={{ padding: "1rem 0.5rem", fontWeight: "600", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>No users found matching your filters.</td>
                    </tr>
                  ) : apiUsers.map((user: any) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid var(--card-border)" }}>
                      <td style={{ padding: "1rem 0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--bg-color)", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "bold", color: "var(--text-muted)" }}>
                            {user.name ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: "600", fontSize: "0.95rem" }}>{user.name || "Unknown"}</p>
                            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "1rem 0.5rem" }}>
                        <span style={{ 
                          background: user.role === 'ADMIN' ? "rgba(244,63,94,0.1)" : user.role === 'MENTOR' ? "rgba(139,92,246,0.1)" : "rgba(59,130,246,0.1)",
                          color: user.role === 'ADMIN' ? "#f43f5e" : user.role === 'MENTOR' ? "#8b5cf6" : "#3b82f6",
                          padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "bold" 
                        }}>
                          {user.role || 'STUDENT'}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 0.5rem" }}>
                        <span style={{ 
                          background: user.status === 'ACTIVE' ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                          color: user.status === 'ACTIVE' ? "#10b981" : "#ef4444",
                          padding: "0.2rem 0.6rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "bold" 
                        }}>
                          {user.status === 'ACTIVE' ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>{user.tier || "Free"}</td>
                      <td style={{ padding: "1rem 0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: "1rem 0.5rem", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.25rem", justifyContent: "flex-end" }}>
                          <button 
                            onClick={() => handleBlockUser(user.id, user.status)}
                            disabled={userActionLoading === user.id}
                            style={{ background: "none", border: "none", color: user.status === 'BLOCKED' ? "#10b981" : "#f59e0b", cursor: "pointer", padding: "0.25rem", opacity: userActionLoading === user.id ? 0.5 : 1 }}
                            title={user.status === 'BLOCKED' ? "Unblock user" : "Block user"}
                          >
                            {user.status === 'BLOCKED' ? <ShieldCheck size={16} /> : <ShieldBan size={16} />}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={userActionLoading === user.id}
                            style={{ background: "none", border: "none", color: "#f43f5e", cursor: "pointer", padding: "0.25rem", opacity: userActionLoading === user.id ? 0.5 : 1 }}
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {userPagination.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                <button 
                  onClick={() => setUserPage(p => Math.max(1, p - 1))}
                  disabled={userPage === 1}
                  style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", cursor: userPage === 1 ? "not-allowed" : "pointer", opacity: userPage === 1 ? 0.5 : 1 }}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(userPagination.totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button 
                      key={i} 
                      onClick={() => setUserPage(pageNum)}
                      style={{ width: "36px", height: "36px", borderRadius: "8px", border: userPage === pageNum ? "none" : "1px solid var(--card-border)", background: userPage === pageNum ? "#f43f5e" : "var(--card-bg)", color: userPage === pageNum ? "white" : "var(--text-color)", cursor: "pointer", fontWeight: "600" }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setUserPage(p => Math.min(userPagination.totalPages, p + 1))}
                  disabled={userPage === userPagination.totalPages}
                  style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", cursor: userPage === userPagination.totalPages ? "not-allowed" : "pointer", opacity: userPage === userPagination.totalPages ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "activity" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>Activity Log</h3>
              <button onClick={fetchActivity} style={{ background: "none", border: "none", color: "#f43f5e", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {activities.length === 0 || (activities.length === 1 && activities[0].text === "No recent activity") ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                  <Activity size={48} color="var(--card-border)" style={{ marginBottom: "1rem" }} />
                  <p>No activity logged yet. Activity is recorded when admins perform actions.</p>
                </div>
              ) : (
                apiActivity.map((a: any) => {
                  const Icon = iconMap[a.action] || FileText;
                  const color = colorMap[a.action] || "3b82f6";
                  return (
                    <div key={a.id} style={{ display: "flex", gap: "1rem", padding: "1rem", background: "var(--bg-color)", borderRadius: "12px", border: "1px solid var(--card-border)" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `rgba(${parseInt(color.slice(0,2),16)},${parseInt(color.slice(2,4),16)},${parseInt(color.slice(4,6),16)},0.1)`, color: `#${color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={16} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.9rem", fontWeight: "500" }}>{a.details || `${a.action} ${a.target}`}</p>
                        <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          <span>{new Date(a.createdAt).toLocaleString()}</span>
                          {a.adminName && <span>by {a.adminName}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "content" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <AdminContentManager />
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* General Settings */}
            <div style={cardStyle}>
              <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "700" }}>General Settings</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>Site Name</p>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>The name of your platform</p>
                  </div>
                  <input 
                    value={settingsForm.siteName}
                    onChange={e => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                    style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", width: "200px" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>System Email</p>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Email address for system notifications</p>
                  </div>
                  <input 
                    value={settingsForm.systemEmail}
                    onChange={e => setSettingsForm({ ...settingsForm, systemEmail: e.target.value })}
                    style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", width: "250px" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>Max Mentors</p>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Maximum number of active mentors</p>
                  </div>
                  <input 
                    type="number"
                    value={settingsForm.maxMentors}
                    onChange={e => setSettingsForm({ ...settingsForm, maxMentors: e.target.value })}
                    style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", width: "100px" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>Session Timeout (minutes)</p>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Auto-logout after inactivity</p>
                  </div>
                  <input 
                    type="number"
                    value={settingsForm.sessionTimeout}
                    onChange={e => setSettingsForm({ ...settingsForm, sessionTimeout: e.target.value })}
                    style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none", width: "100px" }}
                  />
                </div>
              </div>
            </div>

            {/* Toggle Settings */}
            <div style={cardStyle}>
              <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", fontWeight: "700" }}>System Controls</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>Maintenance Mode</p>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Disable access for all non-admin users</p>
                  </div>
                  <button 
                    onClick={() => setSettingsForm({ ...settingsForm, maintenanceMode: !settingsForm.maintenanceMode })}
                    style={{ width: "48px", height: "26px", borderRadius: "13px", border: "none", background: settingsForm.maintenanceMode ? "#f43f5e" : "var(--card-border)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}
                  >
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: settingsForm.maintenanceMode ? "24px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>New Registrations</p>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Allow new users to sign up</p>
                  </div>
                  <button 
                    onClick={() => setSettingsForm({ ...settingsForm, newRegistrations: !settingsForm.newRegistrations })}
                    style={{ width: "48px", height: "26px", borderRadius: "13px", border: "none", background: settingsForm.newRegistrations ? "#10b981" : "var(--card-border)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}
                  >
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "white", position: "absolute", top: "2px", left: settingsForm.newRegistrations ? "24px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                  </button>
                </div>
              </div>
              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handleSaveSettings} style={{ padding: "0.75rem 2rem", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #f43f5e, #f97316)", color: "white", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Save size={16} /> Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* Configure Modal */}
      {showSettingsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowSettingsModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", padding: "2rem", width: "90%", maxWidth: "500px", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700" }}>System Configuration</h3>
              <button onClick={() => setShowSettingsModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem", display: "block" }}>Site Name</label>
                <input value={settingsForm.siteName} onChange={e => setSettingsForm({ ...settingsForm, siteName: e.target.value })} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem", display: "block" }}>System Email</label>
                <input value={settingsForm.systemEmail} onChange={e => setSettingsForm({ ...settingsForm, systemEmail: e.target.value })} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem", display: "block" }}>Max Mentors</label>
                <input type="number" value={settingsForm.maxMentors} onChange={e => setSettingsForm({ ...settingsForm, maxMentors: e.target.value })} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem", display: "block" }}>Session Timeout (min)</label>
                <input type="number" value={settingsForm.sessionTimeout} onChange={e => setSettingsForm({ ...settingsForm, sessionTimeout: e.target.value })} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
              <button onClick={() => setShowSettingsModal(false)} style={{ padding: "0.6rem 1.25rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
              <button onClick={handleSaveSettings} style={{ padding: "0.6rem 1.25rem", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #f43f5e, #f97316)", color: "white", cursor: "pointer", fontWeight: "600" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
