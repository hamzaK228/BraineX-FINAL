"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./layout.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Target, 
  Bookmark, 
  Settings, 
  LogOut, 
  Search, 
  Menu, 
  X,
  Bell,
  User,
  ListTodo,
  Clock,
  Building,
  GraduationCap,
  Map,
  BookOpen,
  Calendar,
  Award,
  StickyNote,
  MessageSquare,
  Lightbulb,
  Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Check auth session
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
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Scholarship Match", time: "2 hours ago", unread: true },
    { id: 2, title: "Deadline Approaching: MIT", time: "5 hours ago", unread: true },
    { id: 3, title: "Weekly Planner Ready", time: "1 day ago", unread: false }
  ]);
  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navGroups = [
    {
      title: "MAIN",
      links: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Goals", href: "/dashboard/goals", icon: Target },
        { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
        { name: "Planner", href: "/dashboard/planner", icon: Calendar },
        { name: "Tasks", href: "/dashboard/tasks", icon: ListTodo },
        { name: "Deadlines", href: "/dashboard/deadlines", icon: Clock },
        { name: "Notes", href: "/dashboard/notes", icon: StickyNote },
      ]
    },
    {
      title: "ACADEMICS",
      links: [
        { name: "Universities", href: "/dashboard/universities", icon: Building },
        { name: "Programs", href: "/dashboard/programs", icon: GraduationCap },
        { name: "Scholarships", href: "/dashboard/scholarships", icon: Award },
        { name: "Roadmaps", href: "/dashboard/roadmaps", icon: Map },
        { name: "Resources", href: "/dashboard/resources", icon: BookOpen },
        { name: "Guidance & Tips", href: "/dashboard/guidance", icon: Lightbulb },
      ]
    },
    {
      title: "DISCOVER",
      links: [
        { name: "Explore", href: "/scholarships", icon: Search },
        { name: "Saved Items", href: "/dashboard/saved", icon: Bookmark },
      ]
    }
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring" as const, stiffness: 300, damping: 30 } }
  };

  if (isLoadingSession) {
    return <div style={{ display: 'flex', height: '100vh', width: '100vw', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)', color: 'var(--text-color)' }}>Loading BraineX...</div>;
  }

  return (
    <div className={styles.dashboardWrapper}>
      {/* Mobile Topbar */}
      <div className={styles.mobileTopbar}>
        <button 
          className={styles.menuToggle} 
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>
        <Link href="/" className={styles.mobileLogo}>BraineX</Link>
        <div style={{ width: 24 }}></div> {/* Spacer for symmetry */}
      </div>

      {/* Sidebar Overlay (Mobile Only) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.sidebarOverlay}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={styles.sidebar}
        initial="closed"
        animate={typeof window !== 'undefined' && window.innerWidth > 1024 ? "open" : (isSidebarOpen ? "open" : "closed")}
        variants={sidebarVariants}
      >
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>
            <span className="logo-text">Braine</span>
            <span className="logo-accent">X</span>
          </Link>
          <button className={styles.mobileClose} onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.navSection}>
          {navGroups.map((group, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", margin: "0.5rem 0 0.25rem 1rem", letterSpacing: "1px" }}>
                {group.title}
              </div>
              {group.links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                  >
                    <Icon size={20} className={isActive ? styles.activeIcon : ""} />
                    <span>{link.name}</span>
                    {isActive && <motion.div layoutId="sidebar-active" className={styles.activePill} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.navLink} style={{ marginBottom: "0.5rem" }}>
            <Monitor size={20} />
            <span>Back to Website</span>
          </Link>
          <Link href="/dashboard/settings" className={`${styles.navLink} ${pathname === "/dashboard/settings" ? styles.active : ""}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          
          <div className={styles.profileCard}>
            <div className={styles.avatar}>JD</div>
            <div className={styles.profileInfo}>
              <h4>John Doe</h4>
              <p>Pro Member</p>
            </div>
          </div>
          
          <button className={styles.signOutBtn}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h1 className={styles.pageTitle}>
              {navGroups.flatMap(g => g.links).find(l => l.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>
          
          <div className={styles.topbarRight}>
            <div className={styles.searchBar}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                defaultValue={typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get("q") || "" : ""}
                onChange={(e) => {
                  const query = e.target.value;
                  const url = new URL(window.location.href);
                  if (query) {
                    url.searchParams.set("q", query);
                  } else {
                    url.searchParams.delete("q");
                  }
                  window.history.replaceState({}, '', url.toString());
                  // Dispatch a custom event so child pages can listen to URL changes without full re-renders
                  window.dispatchEvent(new Event('searchParamsChanged'));
                }}
              />
            </div>
            <ThemeToggle />
            <div style={{ position: "relative" }}>
              <button 
                className={styles.iconBtn} 
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className={styles.notificationDot}></span>}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{ position: "absolute", top: "120%", right: "0", width: "320px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", zIndex: 50, overflow: "hidden" }}
                  >
                    <div style={{ padding: "1rem", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "700" }}>Notifications</h4>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} style={{ background: "transparent", border: "none", color: "#3b82f6", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer" }}>Mark all read</button>
                      )}
                    </div>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {notifications.length > 0 ? notifications.map(notif => (
                        <div key={notif.id} style={{ padding: "1rem", borderBottom: "1px solid var(--card-border)", display: "flex", gap: "1rem", alignItems: "flex-start", background: notif.unread ? "var(--bg-color)" : "transparent", transition: "background 0.2s" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: notif.unread ? "#3b82f6" : "transparent", marginTop: "6px" }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.9rem", fontWeight: notif.unread ? "600" : "500", color: "var(--text-color)" }}>{notif.title}</p>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{notif.time}</span>
                          </div>
                        </div>
                      )) : (
                        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>No notifications right now.</div>
                      )}
                    </div>
                    <div style={{ padding: "0.75rem", background: "var(--bg-color)", textAlign: "center", borderTop: "1px solid var(--card-border)" }}>
                      <Link href="/dashboard/settings" onClick={() => setShowNotifications(false)} style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none", fontWeight: "500" }}>Notification Settings</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className={styles.userDropdown}>
              <User size={20} />
            </div>
          </div>
        </div>

        <div className={styles.contentScroll}>
          {children}
        </div>
      </main>
    </div>
  );
}
