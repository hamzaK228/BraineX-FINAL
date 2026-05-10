"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Globe } from "lucide-react";

interface GoogleSearcherIndicatorProps {
  query: string;
  onCancel?: () => void;
}

export const GoogleSearcherIndicator: React.FC<GoogleSearcherIndicatorProps> = ({ query, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "3rem auto",
        padding: "2.5rem",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(20px)",
        borderRadius: "32px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
      }}
    >
      <div style={{ position: "relative" }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.2,
            position: "absolute",
            top: "-10px",
            left: "-10px",
          }}
        />
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Search size={24} color="#4285F4" />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h3 style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0 }}>
          Deep Search in Progress
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", margin: 0 }}>
          Consulting global databases for <span style={{ color: "#4285F4", fontWeight: "700" }}>"{query}"</span>
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "0.5rem" }}>
        {[
          { color: "#4285F4", delay: 0 },
          { color: "#EA4335", delay: 0.2 },
          { color: "#FBBC05", delay: 0.4 },
          { color: "#34A853", delay: 0.6 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: dot.delay,
            }}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: dot.color,
            }}
          />
        ))}
      </div>

      <div style={{ 
        marginTop: "1rem", 
        padding: "0.75rem 1.5rem", 
        background: "rgba(66, 133, 244, 0.1)", 
        borderRadius: "100px",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#4285F4"
      }}>
        <Globe size={16} />
        Scanning Google Search Results...
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            marginTop: "1rem",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Cancel Search
        </button>
      )}
    </motion.div>
  );
};
