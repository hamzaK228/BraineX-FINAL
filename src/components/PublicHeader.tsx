"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

export function PublicHeader() {
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSession(data);
        }
      })
      .catch(console.error);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileOpen]);

  // Add scroll shadow and height adjustment
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Fields", href: "/fields" },
    { name: "Universities", href: "/universities" },
    { name: "Programs", href: "/programs" },
    { name: "Scholarships", href: "/scholarships" },
    { name: "Roadmaps", href: "/roadmaps" }
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <header className={`${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container">
        <nav role="navigation" aria-label="Primary navigation">
          <div className="logo" style={{ zIndex: 1100 }}>
            <Link href="/" className="logo-link">
              <span className="logo-text">Braine</span>
              <span className="logo-accent">X</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="nav-menu desktop-only">
            {links.map(link => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-underline"
                        className="nav-underline"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="header-actions">
            <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <ThemeToggle />
              {session ? (
                <>
                  <Link href="/dashboard" className="ds-btn ds-btn-secondary">Dashboard</Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="ds-btn ds-btn-primary">Log Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="ds-btn ds-btn-secondary">Log In</Link>
                  <Link href="/signup" className="ds-btn ds-btn-primary">Sign Up</Link>
                </>
              )}
            </div>

            <button 
              className={`hamburger-btn ${isMobileOpen ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle navigation"
              style={{ zIndex: 1100 }}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-overlay"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="mobile-menu"
          >
            <ul className="mobile-nav-list">
              {links.map(link => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link 
                    href={link.href} 
                    className={`mobile-nav-link ${pathname === link.href ? 'active' : ''}`}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={itemVariants} className="mobile-auth-section">
                <div className="mobile-theme-toggle">
                  <span>Theme</span>
                  <ThemeToggle />
                </div>
                <div className="mobile-auth-btns">
                  {session ? (
                    <>
                      <Link href="/dashboard" className="ds-btn ds-btn-secondary w-full">Dashboard</Link>
                      <button onClick={() => signOut({ callbackUrl: '/' })} className="ds-btn ds-btn-primary w-full">Log Out</button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="ds-btn ds-btn-secondary w-full">Log In</Link>
                      <Link href="/signup" className="ds-btn ds-btn-primary w-full">Sign Up</Link>
                    </>
                  )}
                </div>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
