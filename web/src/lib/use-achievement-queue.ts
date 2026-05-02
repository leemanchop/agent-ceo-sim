"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Achievement } from "./types";

/**
 * Live entry in the on-screen toast stack. `mountedAt` is the ms epoch we
 * pushed it; the prune interval drops anything past `TOAST_TTL_MS`.
 */
export type ToastEntry = {
  uid: string;
  achievement: Achievement;
  mountedAt: number;
};

const TOAST_TTL_MS = 5000;
const PRUNE_INTERVAL_MS = 250;
const MAX_VISIBLE = 3;

export function useAchievementQueue() {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [modal, setModal] = useState<Achievement | null>(null);
  const seenRef = useRef<Set<string>>(new Set());

  const unlock = useCallback((achievement: Achievement) => {
    // de-dupe — never unlock the same id twice in a single session
    if (seenRef.current.has(achievement.id)) return;
    seenRef.current.add(achievement.id);
    setToasts((prev) => {
      const next: ToastEntry = {
        uid: `${achievement.id}-${Date.now()}`,
        achievement,
        mountedAt: Date.now(),
      };
      // newest at the bottom; cap visible
      const merged = [...prev, next];
      return merged.slice(-MAX_VISIBLE);
    });
  }, []);

  const dismiss = useCallback((uid: string) => {
    setToasts((prev) => prev.filter((t) => t.uid !== uid));
  }, []);

  const openModal = useCallback((achievement: Achievement) => {
    setModal(achievement);
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  // prune expired entries
  useEffect(() => {
    const i = setInterval(() => {
      const cutoff = Date.now() - TOAST_TTL_MS;
      setToasts((prev) => {
        const next = prev.filter((t) => t.mountedAt > cutoff);
        return next.length === prev.length ? prev : next;
      });
    }, PRUNE_INTERVAL_MS);
    return () => clearInterval(i);
  }, []);

  return { toasts, unlock, dismiss, openModal, modal, closeModal };
}
