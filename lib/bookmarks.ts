"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "sahani.bookmarks";

export function readBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function writeBookmarks(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export function useBookmarks() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readBookmarks());
  }, []);

  const toggle = useCallback((id: string) => {
    setIds((current) => {
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      writeBookmarks(next);
      return next;
    });
  }, []);

  return { ids, toggle, has: (id: string) => ids.includes(id) };
}
