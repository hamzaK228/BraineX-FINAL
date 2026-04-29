import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import styles from "./InfoModal.module.css";
import { X, Lightbulb, ArrowRight, Star, Info, Target, Zap } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  tips: string[];
  signupText?: string;
  signupHref?: string;
  image?: string;
  description?: string;
  specialFeatures?: string[];
  stats?: { label: string; value: string }[];
  ctaLink?: string;
  ctaLabel?: string;
}

export function InfoModal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  icon, 
  tips, 
  signupText = "Create Free Account",
  signupHref = "/signup",
  image,
  description,
  specialFeatures,
  stats,
  ctaLink,
  ctaLabel
}: InfoModalProps) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/auth/session')
        .then(res => res.json())
        .then(data => {
          if (data && Object.keys(data).length > 0) {
            setSession(data);
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose}>
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={styles.modal}
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
            
            {image && (
              <div className={styles.heroImage}>
                <img src={image} alt={title} />
                <div className={styles.imageOverlay} />
              </div>
            )}

            <div className={styles.header}>
              <div className={styles.headerTitleRow}>
                {icon && <div className={styles.iconWrapper}>{icon}</div>}
                <div>
                  <h2 className={styles.title}>{title}</h2>
                  {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
              </div>
            </div>
            
            <div className={styles.content}>
              {stats && (
                <div className={styles.statsGrid}>
                  {stats.map((stat, i) => (
                    <div key={i} className={styles.statItem}>
                      <span className={styles.statValue}>{stat.value}</span>
                      <span className={styles.statLabel}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {description && (
                <div className={styles.descriptionBox}>
                  <p>{description}</p>
                </div>
              )}

              <div className={styles.tipsBox}>
                <div className={styles.tipsHeader}>
                  <Zap size={18} color="#f59e0b" fill="#f59e0b" />
                  <h3>PRO TIPS</h3>
                </div>
                <ul className={styles.tipsList}>
                  {tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              {specialFeatures && specialFeatures.length > 0 && (
                <div className={styles.featuresBox}>
                  <div className={styles.featuresHeader}>
                    <Star size={18} color="#6366f1" fill="#6366f1" />
                    <h3>SPECIAL FEATURES</h3>
                  </div>
                  <ul className={styles.featuresList}>
                    {specialFeatures.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {ctaLink && (
              <div className={styles.ctaBox}>
                <Link href={ctaLink} target="_blank" className={styles.ctaBtn}>
                  {ctaLabel || "Learn More"} <ArrowRight size={16} />
                </Link>
              </div>
            )}

            <div className={styles.footer}>
              {session ? (
                <>
                  <p className={styles.footerText}>Ready to act on this? Head over to your dashboard to add this to your tracker.</p>
                  <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                      Maybe Later
                    </button>
                    <Link href="/dashboard" className={styles.signupBtn}>
                      Go to Dashboard <ArrowRight size={16} />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className={styles.footerText}>Ready to take the next step? Get personalized guidance and track your progress.</p>
                  <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                      Maybe Later
                    </button>
                    <Link href={signupHref} className={styles.signupBtn}>
                      {signupText} <ArrowRight size={16} />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
