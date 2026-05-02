// Test-only stub for next-auth/react. Wired into vitest via a resolver
// alias (vitest.config.ts) so tests can run before the real package is
// installed locally. The real production code paths are unaffected.
import React from "react";

export function useSession() {
  return { data: null, status: "unauthenticated" as const };
}

export function signIn(..._args: unknown[]) {
  return Promise.resolve(undefined);
}

export function signOut(..._args: unknown[]) {
  return Promise.resolve(undefined);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}
