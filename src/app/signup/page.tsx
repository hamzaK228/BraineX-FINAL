"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight, User, ArrowLeft, Loader2, AlertCircle, CheckCircle2, AtSign, KeyRound } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          router.push('/dashboard');
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, nickname: nickname || undefined, recoveryKey: recoveryKey || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Auto-redirect to login after successful registration
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    window.location.href = `/api/auth/signin/${provider}?callbackUrl=/dashboard`;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: "var(--bg-color)" }}>
      {/* Background gradients */}
      <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)", zIndex: 0 }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "100%", maxWidth: "420px", padding: "2rem", position: "relative", zIndex: 1 }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", padding: "0.5rem", marginLeft: "-0.5rem", borderRadius: "8px", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.color = "var(--text-color)"; e.currentTarget.style.background = "var(--card-border)"; }} onMouseOut={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}>
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-color)" }}>Braine<span style={{ color: "#3b82f6" }}>X</span></span>
          </Link>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700", margin: "0 0 0.5rem 0", color: "var(--text-color)" }}>Create an account</h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>Join BraineX and start your academic journey</p>
        </div>

        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "24px", padding: "2rem", boxShadow: "0 20px 40px rgba(0,0,0,0.05)", backdropFilter: "blur(10px)" }}>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1.25rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", color: "#ef4444", fontSize: "0.9rem", fontWeight: "500" }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1.25rem", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "12px", color: "#10b981", fontSize: "0.9rem", fontWeight: "500" }}>
              <CheckCircle2 size={16} /> Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-color)" }}>Full Name</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <User size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem" }} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={loading || success}
                  style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s", opacity: loading ? 0.6 : 1 }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--card-border)"}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-color)" }}>Email Address</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Mail size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem" }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={loading || success}
                  style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s", opacity: loading ? 0.6 : 1 }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--card-border)"}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-color)" }}>Password</label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Lock size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem" }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 chars)"
                  required
                  minLength={6}
                  disabled={loading || success}
                  style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s", opacity: loading ? 0.6 : 1 }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "var(--card-border)"}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-color)" }}>Nickname <span style={{ color: "var(--text-muted)", fontWeight: "400", fontSize: "0.75rem" }}>(for recovery)</span></label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <AtSign size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem" }} />
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="unique_nick"
                    disabled={loading || success}
                    style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s", opacity: loading ? 0.6 : 1 }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--card-border)"}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-color)" }}>Recovery Key <span style={{ color: "var(--text-muted)", fontWeight: "400", fontSize: "0.75rem" }}>(secret word)</span></label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <KeyRound size={18} color="var(--text-muted)" style={{ position: "absolute", left: "1rem" }} />
                  <input 
                    type="password" 
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                    placeholder="secret keyword"
                    disabled={loading || success}
                    style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem", borderRadius: "12px", border: "1px solid var(--card-border)", background: "var(--bg-color)", color: "var(--text-color)", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s", opacity: loading ? 0.6 : 1 }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--card-border)"}
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading || success} style={{ marginTop: "0.5rem", width: "100%", padding: "0.875rem", borderRadius: "12px", background: loading ? "rgba(16,185,129,0.5)" : "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)", color: "white", border: "none", fontSize: "1rem", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "opacity 0.2s" }} onMouseOver={e => { if (!loading) e.currentTarget.style.opacity = "0.9"; }} onMouseOut={e => e.currentTarget.style.opacity = "1"}>
              {loading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Creating account...</> : <>Create Account <ArrowRight size={18} /></>}
            </button>

          </form>

          <div style={{ margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--card-border)" }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "500" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--card-border)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button onClick={() => handleOAuth("google")} style={{ width: "100%", padding: "0.875rem", borderRadius: "12px", background: "var(--bg-color)", color: "var(--text-color)", border: "1px solid var(--card-border)", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "var(--card-border)"} onMouseOut={e => e.currentTarget.style.background = "var(--bg-color)"}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
            <button onClick={() => handleOAuth("github")} style={{ width: "100%", padding: "0.875rem", borderRadius: "12px", background: "var(--bg-color)", color: "var(--text-color)", border: "1px solid var(--card-border)", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "var(--card-border)"} onMouseOut={e => e.currentTarget.style.background = "var(--bg-color)"}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Sign up with GitHub
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Already have an account? <Link href="/login" style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}>Log in</Link>
        </p>
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

