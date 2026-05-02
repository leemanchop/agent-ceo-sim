"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SimNotification } from "./types";

/**
 * Live entry in the on-screen notification stack. `mountedAt` is the ms epoch
 * we pushed it; the prune interval drops anything past `notification.ttl_ms`
 * (or DEFAULT_TTL_MS).
 */
export type NotificationEntry = {
  uid: string;
  notification: SimNotification;
  mountedAt: number;
};

const DEFAULT_TTL_MS = 6000;
const PRUNE_INTERVAL_MS = 250;
const MAX_VISIBLE = 4;

export function useNotificationQueue() {
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const seenRef = useRef<Set<string>>(new Set());

  const push = useCallback((n: SimNotification): string => {
    // de-dupe by id — never push the same id twice
    if (seenRef.current.has(n.id)) return n.id;
    seenRef.current.add(n.id);
    const uid = `${n.id}-${Date.now()}`;
    setNotifications((prev) => {
      const next: NotificationEntry = {
        uid,
        notification: n,
        mountedAt: Date.now(),
      };
      // newest at the top of stack visually; we render reversed.
      // here we cap visible — older ones bubble out.
      const merged = [...prev, next];
      return merged.slice(-MAX_VISIBLE);
    });
    return n.id;
  }, []);

  const dismiss = useCallback((uid: string) => {
    setNotifications((prev) => prev.filter((t) => t.uid !== uid));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // periodic sweep for expired entries
  useEffect(() => {
    const i = setInterval(() => {
      const now = Date.now();
      setNotifications((prev) => {
        const next = prev.filter((t) => {
          const ttl = t.notification.ttl_ms ?? DEFAULT_TTL_MS;
          return t.mountedAt + ttl > now;
        });
        return next.length === prev.length ? prev : next;
      });
    }, PRUNE_INTERVAL_MS);
    return () => clearInterval(i);
  }, []);

  return { notifications, push, dismiss, clearAll };
}
