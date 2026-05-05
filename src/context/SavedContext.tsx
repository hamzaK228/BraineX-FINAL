"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type SavedItem = {
  id: string | number;
  itemId?: string;
  title: string;
  type: 'University' | 'Program' | 'Scholarship' | 'Project' | 'Roadmap' | 'Mentor' | 'Field';
  source: string;
  image?: string;
};

type SavedContextType = {
  savedItems: SavedItem[];
  saveItem: (item: SavedItem) => void;
  removeItem: (id: string | number) => void;
  isSaved: (id: string | number) => boolean;
  loading: boolean;
};

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth status and fetch saved items
  useEffect(() => {
    async function init() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();

        if (session?.user?.id) {
          setIsAuthenticated(true);
          // Fetch from API
          const res = await fetch('/api/saved-items');
          if (res.ok) {
            const items = await res.json();
            setSavedItems(items);
          }
        } else {
          // Guest mode — use localStorage
          setIsAuthenticated(false);
          const stored = localStorage.getItem('brainex_saved_items');
          if (stored) {
            try { setSavedItems(JSON.parse(stored)); } catch {}
          }
        }
      } catch {
        // API unavailable — fall back to localStorage
        setIsAuthenticated(false);
        const stored = localStorage.getItem('brainex_saved_items');
        if (stored) {
          try { setSavedItems(JSON.parse(stored)); } catch {}
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Persist to localStorage for guest mode
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      localStorage.setItem('brainex_saved_items', JSON.stringify(savedItems));
    }
  }, [savedItems, isAuthenticated, loading]);

  const saveItem = useCallback(async (item: SavedItem) => {
    if (savedItems.some(s => String(s.itemId || s.id) === String(item.id))) return;

    const newItem: SavedItem = {
      ...item,
      itemId: String(item.id),
    };

    // Optimistic update
    setSavedItems(prev => [newItem, ...prev]);

    if (isAuthenticated) {
      try {
        const res = await fetch('/api/saved-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: String(item.id),
            title: item.title,
            type: item.type,
            source: item.source,
            image: item.image || undefined,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          // Replace optimistic item with server response (has real DB id)
          setSavedItems(prev =>
            prev.map(i => (String(i.itemId || i.id) === String(item.id) && i.type === item.type) ? { ...created, itemId: created.itemId } : i)
          );
        }
      } catch {
        // Keep optimistic update, will sync later
      }
    }

    // Notify dashboard to refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dashboardRefresh'));
    }
  }, [savedItems, isAuthenticated]);

  const removeItem = useCallback(async (id: string | number) => {
    const itemToRemove = savedItems.find(i => i.id === id || i.itemId === String(id));

    // Optimistic removal
    setSavedItems(prev => prev.filter(item => item.id !== id && item.itemId !== String(id)));

    if (isAuthenticated && itemToRemove?.id) {
      try {
        await fetch(`/api/saved-items/${itemToRemove.id}`, { method: 'DELETE' });
      } catch {
        // Silently fail — item already removed from UI
      }
    }

    // Notify dashboard to refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dashboardRefresh'));
    }
  }, [savedItems, isAuthenticated]);

  const isSaved = useCallback((id: string | number) => {
    return savedItems.some(item => item.id === id || item.itemId === String(id));
  }, [savedItems]);

  return (
    <SavedContext.Provider value={{ savedItems, saveItem, removeItem, isSaved, loading }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (context === undefined) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
};
