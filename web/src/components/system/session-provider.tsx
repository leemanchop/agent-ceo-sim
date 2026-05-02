"use client";

/**
 * Thin client wrapper around next-auth/react's SessionProvider.
 * Mounted in the root layout so client components can call
 * `useSession()` without each route importing it directly.
 */
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export function AppSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
