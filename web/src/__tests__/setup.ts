// vitest setup. polyfill bits jsdom doesn't ship with.
import React from "react";
import { vi } from "vitest";

// next-auth/react does its own context/provider work that pulls in
// server-only modules. Tests don't care about real auth, so stub the
// hook to "unauthenticated" globally and treat SessionProvider as a
// pass-through. Individual tests can override with `vi.mock(...)`.
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

// jsdom doesn't implement matchMedia
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

// jsdom: keep rAF deterministic-ish so animation hooks don't loop forever
if (typeof window !== "undefined") {
  // ensure rAF/cAF exist; default jsdom has them but be defensive.
  window.requestAnimationFrame ||= ((cb: FrameRequestCallback) =>
    setTimeout(() => cb(performance.now()), 0)) as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame ||= ((id: number) => clearTimeout(id)) as typeof window.cancelAnimationFrame;
}

// scrollIntoView is used by some Radix primitives; jsdom no-op.
if (typeof window !== "undefined") {
  // @ts-expect-error - jsdom Element prototype patch
  Element.prototype.scrollIntoView ||= function () {};
}
