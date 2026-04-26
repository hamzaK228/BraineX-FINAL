"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Info, User, Check, CheckCheck } from "lucide-react";

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState("");

  const mentors = [
    { id: 1, name: "Dr. Sarah Jenkins", role: "Ivy League Admissions", avatar: "SJ", online: true, unread: 2, lastMessage: "Your essay draft looks much better now!" },
    { id: 2, name: "Michael Chen", role: "STEM Scholarships", avatar: "MC", online: false, unread: 0, lastMessage: "Let's schedule a mock interview for Friday." },
    { id: 3, name: "Elena Rodriguez", role: "Financial Aid Expert", avatar: "ER", online: true, unread: 0, lastMessage: "The FAFSA deadline is approaching soon." },
  ];

  const [messages, setMessages] = useState([
    { id: 1, sender: "mentor", text: "Hi there! I reviewed your latest personal statement draft.", time: "10:30 AM" },
    { id: 2, sender: "mentor", text: "You've made great progress on the intro, but the conclusion needs more impact.", time: "10:31 AM" },
    { id: 3, sender: "user", text: "Thanks Sarah! I struggled a bit with tying it all together at the end. Any specific suggestions?", time: "10:45 AM" },
    { id: 4, sender: "mentor", text: "Try referencing your opening hook again. I've left some comments on the Google Doc.", time: "10:48 AM" },
    { id: 5, sender: "mentor", text: "Your essay draft looks much better now!", time: "11:15 AM" },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages([...messages, { 
      id: Date.now(), 
      sender: "user", 
      text: message, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessage("");
  };

  const activeMentor = mentors.find(m => m.id === activeChat);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 120px)", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
      
      {/* Sidebar - Chat List */}
      <div style={{ width: "320px", borderRight: "1px solid var(--card-border)", display: "flex", flexDirection: "column", background: "var(--bg-color)" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--card-border)" }}>
          <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem", fontWeight: "800" }}>Messages</h2>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "1rem" }} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "100px", border: "1px solid var(--card-border)", background: "var(--card-bg)", color: "var(--text-color)", fontSize: "0.9rem", outline: "none" }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {mentors.map(mentor => (
            <div 
              key={mentor.id}
              onClick={() => setActiveChat(mentor.id)}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "1rem", 
                padding: "1rem", 
                borderRadius: "16px", 
                cursor: "pointer", 
                background: activeChat === mentor.id ? "rgba(59,130,246,0.1)" : "transparent",
                border: activeChat === mentor.id ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                marginBottom: "0.5rem",
                transition: "all 0.2s"
              }}
            >
              <div style={{ position: "relative" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "bold" }}>
                  {mentor.avatar}
                </div>
                {mentor.online && <div style={{ position: "absolute", bottom: "2px", right: "2px", width: "12px", height: "12px", background: "#10b981", borderRadius: "50%", border: "2px solid var(--bg-color)" }} />}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mentor.name}</h4>
                  <span style={{ fontSize: "0.75rem", color: activeChat === mentor.id ? "#3b82f6" : "var(--text-muted)" }}>11:15 AM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: activeChat === mentor.id ? "var(--text-color)" : "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: mentor.unread ? "600" : "normal" }}>
                    {mentor.lastMessage}
                  </p>
                  {mentor.unread > 0 && (
                    <span style={{ background: "#f43f5e", color: "white", fontSize: "0.7rem", fontWeight: "bold", padding: "0.1rem 0.4rem", borderRadius: "100px", marginLeft: "0.5rem" }}>{mentor.unread}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--card-bg)" }}>
        
        {/* Chat Header */}
        {activeMentor && (
          <div style={{ padding: "1.25rem 2rem", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: "bold" }}>
                {activeMentor.avatar}
              </div>
              <div>
                <h3 style={{ margin: "0 0 0.2rem 0", fontSize: "1.1rem", fontWeight: "700" }}>{activeMentor.name}</h3>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: activeMentor.online ? "#10b981" : "var(--text-muted)" }} />
                  {activeMentor.online ? "Online" : "Offline"} • {activeMentor.role}
                </p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "1rem", color: "var(--text-muted)" }}>
              <button style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", padding: "0.5rem", borderRadius: "50%", cursor: "pointer", color: "var(--text-color)" }}><Phone size={18} /></button>
              <button style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", padding: "0.5rem", borderRadius: "50%", cursor: "pointer", color: "var(--text-color)" }}><Video size={18} /></button>
              <button style={{ background: "var(--bg-color)", border: "1px solid var(--card-border)", padding: "0.5rem", borderRadius: "50%", cursor: "pointer", color: "var(--text-color)" }}><Info size={18} /></button>
            </div>
          </div>
        )}

        {/* Messages Feed */}
        <div style={{ flex: 1, padding: "2rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ textAlign: "center", margin: "1rem 0" }}>
            <span style={{ background: "var(--bg-color)", padding: "0.3rem 1rem", borderRadius: "100px", fontSize: "0.8rem", color: "var(--text-muted)", border: "1px solid var(--card-border)" }}>Today</span>
          </div>
          
          <AnimatePresence>
            {messages.map((msg) => {
              const isMe = msg.sender === "user";
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", gap: "0.3rem" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", flexDirection: isMe ? "row-reverse" : "row" }}>
                    {!isMe && (
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "bold" }}>
                        {activeMentor?.avatar}
                      </div>
                    )}
                    <div style={{ 
                      maxWidth: "400px", 
                      padding: "1rem 1.25rem", 
                      borderRadius: "20px", 
                      background: isMe ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "var(--bg-color)",
                      color: isMe ? "white" : "var(--text-color)",
                      border: isMe ? "none" : "1px solid var(--card-border)",
                      borderBottomRightRadius: isMe ? "4px" : "20px",
                      borderBottomLeftRadius: !isMe ? "4px" : "20px",
                      boxShadow: isMe ? "0 10px 20px rgba(59,130,246,0.2)" : "none",
                      fontSize: "0.95rem",
                      lineHeight: "1.5"
                    }}>
                      {msg.text}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--text-muted)", fontSize: "0.75rem", margin: isMe ? "0 0 0 0" : "0 0 0 36px" }}>
                    {msg.time} {isMe && <CheckCheck size={14} color="#3b82f6" />}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div style={{ padding: "1.5rem 2rem", borderTop: "1px solid var(--card-border)", background: "var(--card-bg)" }}>
          <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "var(--bg-color)", border: "1px solid var(--card-border)", padding: "0.5rem 0.5rem 0.5rem 1.5rem", borderRadius: "100px" }}>
            <button type="button" style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center" }}><Paperclip size={20} /></button>
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..." 
              style={{ flex: 1, background: "transparent", border: "none", color: "var(--text-color)", fontSize: "0.95rem", outline: "none" }}
            />
            <button 
              type="submit" 
              disabled={!message.trim()}
              style={{ 
                background: message.trim() ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "var(--card-border)", 
                color: "white", 
                border: "none", 
                width: "44px", 
                height: "44px", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                cursor: message.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow: message.trim() ? "0 5px 15px rgba(59,130,246,0.3)" : "none"
              }}
            >
              <Send size={18} style={{ marginLeft: "2px" }} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
