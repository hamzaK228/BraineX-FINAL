"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, User, Bell, Lock, Globe, Palette, LogOut, ChevronRight, ChevronDown } from "lucide-react";

export default function SettingsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const settingsGroups = [
    {
      title: "Account Preferences",
      items: [
        { name: "Personal Information", icon: <User size={20} color="#3b82f6" />, desc: "Update your name, email, and contact info." },
        { name: "Language & Region", icon: <Globe size={20} color="#10b981" />, desc: "Set your preferred language and time zone." },
        { name: "Appearance", icon: <Palette size={20} color="#f59e0b" />, desc: "Toggle between light, dark, and system themes." },
      ]
    },
    {
      title: "Security & Privacy",
      items: [
        { name: "Password & Security", icon: <Lock size={20} color="#ef4444" />, desc: "Change your password and enable 2FA." },
        { name: "Notifications", icon: <Bell size={20} color="#8b5cf6" />, desc: "Manage email and push notification preferences." },
      ]
    }
  ];

  const [activeSetting, setActiveSetting] = useState<string | null>(null);
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });
  const [saveMsg, setSaveMsg] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user/me");
      if (res.ok) {
        const data = await res.json();
        const parts = (data.name || "").split(" ");
        setProfile({ firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "", email: data.email || "" });
      }
    } catch { /* fallback */ }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveProfile = async () => {
    setSaveMsg("");
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${profile.firstName} ${profile.lastName}`.trim() }),
      });
      setSaveMsg(res.ok ? "Saved!" : "Error saving");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch { setSaveMsg("Error saving"); }
  };

  const toggleSetting = (name: string) => {
    setActiveSetting(activeSetting === name ? null : name);
  };

  const renderSettingContent = (name: string) => {
    switch (name) {
      case "Personal Information":
        return (
          <div style={{ padding: "1.5rem", borderTop: "1px solid var(--card-border)", background: "var(--bg-color)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>First Name</label>
                <input type="text" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", outline: "none" }} />
              </div>
              <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Last Name</label>
                <input type="text" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Email Address</label>
              <input type="email" value={profile.email} readOnly style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-muted)", outline: "none", opacity: 0.7 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
              {saveMsg && <span style={{ fontSize: "0.85rem", color: saveMsg === "Saved!" ? "#10b981" : "#ef4444" }}>{saveMsg}</span>}
              <button className="ds-btn ds-btn-primary" onClick={saveProfile} style={{ padding: "0.5rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>Save Changes</button>
            </div>
          </div>
        );
      case "Language & Region":
        return (
          <div style={{ padding: "1.5rem", borderTop: "1px solid var(--card-border)", background: "var(--bg-color)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Language</label>
              <select style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", outline: "none", appearance: "none" }}>
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Time Zone</label>
              <select style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", outline: "none", appearance: "none" }}>
                <option>Pacific Time (PT)</option>
                <option>Eastern Time (ET)</option>
                <option>Central European Time (CET)</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>Save Preferences</button>
            </div>
          </div>
        );
      case "Appearance":
        return (
          <div style={{ padding: "1.5rem", borderTop: "1px solid var(--card-border)", background: "var(--bg-color)", display: "flex", flexDirection: "column", gap: "1rem" }}>
             <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>Theme settings are managed by the quick toggle in the top right header. You can also select preferences here.</p>
             <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                {["Light", "Dark", "System"].map(theme => (
                  <button key={theme} style={{ flex: "1 1 100px", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", cursor: "pointer", fontWeight: "600" }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--text-muted)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--card-border)'}>
                    {theme}
                  </button>
                ))}
             </div>
          </div>
        );
      case "Password & Security":
        return (
          <div style={{ padding: "1.5rem", borderTop: "1px solid var(--card-border)", background: "var(--bg-color)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Current Password</label>
              <input type="password" placeholder="••••••••" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>New Password</label>
                <input type="password" placeholder="••••••••" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", outline: "none" }} />
              </div>
              <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Confirm Password</label>
                <input type="password" placeholder="••••••••" style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
              <input type="checkbox" id="2fa" style={{ width: "16px", height: "16px", cursor: "pointer" }} />
              <label htmlFor="2fa" style={{ fontSize: "0.9rem", color: "var(--text-color)", cursor: "pointer" }}>Enable Two-Factor Authentication (2FA)</label>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600", background: "#ef4444", color: "white" }}>Update Password</button>
            </div>
          </div>
        );
      case "Notifications":
        return (
          <div style={{ padding: "1.5rem", borderTop: "1px solid var(--card-border)", background: "var(--bg-color)", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { id: "email", label: "Email Notifications", desc: "Receive daily updates and alerts via email.", active: true },
              { id: "push", label: "Push Notifications", desc: "Receive immediate alerts in your browser.", active: true },
              { id: "weekly", label: "Weekly Digest", desc: "Get a summary of your academic progress every Sunday.", active: false }
            ].map(notif => (
              <div key={notif.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid var(--card-border)" }}>
                <div>
                  <h5 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: "600" }}>{notif.label}</h5>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>{notif.desc}</p>
                </div>
                <div 
                  style={{ 
                    width: "44px", 
                    height: "24px", 
                    background: notif.active ? "#3b82f6" : "var(--card-border)", 
                    borderRadius: "100px", 
                    position: "relative", 
                    cursor: "pointer",
                    transition: "background 0.3s"
                  }}
                  onClick={(e) => {
                    const el = e.currentTarget;
                    const isNowActive = el.style.background === "var(--card-border)";
                    el.style.background = isNowActive ? "#3b82f6" : "var(--card-border)";
                    const circle = el.firstChild as HTMLElement;
                    circle.style.transform = isNowActive ? "translateX(20px)" : "translateX(2px)";
                  }}
                >
                  <div style={{ 
                    width: "20px", 
                    height: "20px", 
                    background: "white", 
                    borderRadius: "50%", 
                    position: "absolute", 
                    top: "2px", 
                    left: "0", 
                    transform: notif.active ? "translateX(20px)" : "translateX(2px)", 
                    transition: "transform 0.3s",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }} />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button className="ds-btn ds-btn-primary" style={{ padding: "0.5rem 1.5rem", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: "600" }}>Save Preferences</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "900px", margin: "0 auto", paddingBottom: "3rem" }}
    >
      <div>
        <h2 style={{ fontSize: "2rem", fontWeight: "800", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Settings size={32} color="#64748b" /> Settings
        </h2>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>Manage your account settings and preferences.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {settingsGroups.map((group, groupIdx) => (
          <motion.div variants={itemVariants} key={groupIdx} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-color)", margin: 0 }}>{group.title}</h3>
            
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "20px", overflow: "hidden" }}>
              {group.items.map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "1.5rem",
                    borderBottom: (i !== group.items.length - 1 && activeSetting !== item.name) ? "1px solid var(--card-border)" : "none",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  onClick={() => toggleSetting(item.name)}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--bg-color)", border: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "600" }}>{item.name}</h4>
                        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.9rem" }}>{item.desc}</p>
                      </div>
                    </div>
                    {activeSetting === item.name ? (
                      <ChevronDown size={20} color="var(--text-color)" />
                    ) : (
                      <ChevronRight size={20} color="var(--text-muted)" />
                    )}
                  </div>

                  <AnimatePresence>
                    {activeSetting === item.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                      >
                        {renderSettingContent(item.name)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div variants={itemVariants}>
          <button style={{ width: "100%", padding: "1.25rem", borderRadius: "20px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", fontWeight: "600", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}>
            <LogOut size={20} /> Sign Out of All Devices
          </button>
        </motion.div>
      </div>

    </motion.div>
  );
}
