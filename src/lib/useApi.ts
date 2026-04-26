"use client";

import { useState, useEffect, useCallback } from "react";

interface UseApiOptions<T> {
  url: string;
  fallback: T;
}

interface UseApiReturn<T> {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (updatedData: T) => void;
}

/**
 * Custom hook for fetching data from API routes with graceful fallback.
 * Falls back to provided mock data when the DB/API isn't available.
 */
export function useApi<T>({ url, fallback }: UseApiOptions<T>): UseApiReturn<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 401) {
          // Not logged in — use fallback silently
          setData(fallback);
          return;
        }
        throw new Error(`API returned ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch {
      // API unavailable (no DB connected) — use fallback
      setData(fallback);
      setError(null); // Suppress error for graceful fallback
    } finally {
      setLoading(false);
    }
  }, [url, fallback]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, mutate: setData };
}

/**
 * Helper for mutating data via API (POST/PATCH/DELETE).
 * Returns the response JSON or null on error.
 */
export async function apiMutate<T>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return { data: null, error: json.error || `Request failed (${res.status})` };
    }

    const json = await res.json();
    return { data: json as T, error: null };
  } catch {
    return { data: null, error: "Network error — is the database connected?" };
  }
}
