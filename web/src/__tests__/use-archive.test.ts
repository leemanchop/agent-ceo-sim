import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

// Per-file override: setup.ts globally mocks next-auth/react to return
// "unauthenticated". For this file we want to flip session state per test
// — re-mock with a closure over `sessionRef`. Vitest hoists vi.mock above
// imports automatically.
type AuthSession = { data: { user: { email: string; isAdmin: boolean } }; status: "authenticated" } | { data: null; status: "unauthenticated" };
const sessionRef: { current: AuthSession } = {
  current: { data: null, status: "unauthenticated" },
};
function makeAuthed(email: string): AuthSession {
  return {
    data: { user: { email, isAdmin: true } },
    status: "authenticated",
  };
}

vi.mock("next-auth/react", () => ({
  useSession: () => sessionRef.current,
  signIn: vi.fn(),
  signOut: vi.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Import AFTER mocks are registered.
import { useUserRuns, usePublicArchive } from "@/lib/api/use-archive";
import {
  API_MODE_OVERRIDE_KEY,
  getApiMode,
  setApiModeOverride,
} from "@/lib/api/client";

function clearOverride() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(API_MODE_OVERRIDE_KEY);
  }
}

describe("getApiMode resolution priority", () => {
  beforeEach(() => {
    clearOverride();
  });
  afterEach(() => {
    clearOverride();
  });

  it("returns env-default when no override is set", () => {
    // env mode in test is unset → falls through to "mock"
    expect(getApiMode()).toBe("mock");
  });

  it("override beats env var", () => {
    setApiModeOverride("prod");
    expect(getApiMode()).toBe("prod");
    setApiModeOverride("local");
    expect(getApiMode()).toBe("local");
    setApiModeOverride(null);
    expect(getApiMode()).toBe("mock");
  });

  it("invalid override values are ignored", () => {
    window.localStorage.setItem(API_MODE_OVERRIDE_KEY, "bogus");
    expect(getApiMode()).toBe("mock");
  });
});

describe("useUserRuns", () => {
  beforeEach(() => {
    sessionRef.current = { data: null, status: "unauthenticated" };
    clearOverride();
  });
  afterEach(() => {
    sessionRef.current = { data: null, status: "unauthenticated" };
    clearOverride();
    vi.restoreAllMocks();
  });

  it("returns mock list in mock mode", async () => {
    sessionRef.current = makeAuthed("admin@vimes.io");
    // mock mode is the default
    const { result } = renderHook(() => useUserRuns());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.isMock).toBe(true);
    expect(result.current.data.length).toBeGreaterThan(0);
  });

  it("calls fetch in prod mode when signed in", async () => {
    setApiModeOverride("prod");
    // The hook reads NEXT_PUBLIC_API_URL via requireApiUrl(); stub it.
    vi.stubEnv("NEXT_PUBLIC_API_MODE", "prod");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");

    sessionRef.current = makeAuthed("admin@vimes.io");

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          runs: [
            {
              run_id: "abc123",
              user_id: "admin@vimes.io",
              status: "completed",
              company_name: "test-co",
              started_at: "2026-04-01T00:00:00Z",
              ended_at: "2026-04-02T00:00:00Z",
              turns_elapsed: 12,
              endgame_id: "END · PRISON-08",
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      )
    );

    const { result } = renderHook(() => useUserRuns());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchSpy).toHaveBeenCalled();
    const calledUrl = String(fetchSpy.mock.calls[0]?.[0]);
    expect(calledUrl).toContain("/me/runs");
    expect(calledUrl).toContain("user_id=admin%40vimes.io");
    expect(result.current.isMock).toBe(false);
    expect(result.current.data.some((r) => r.id === "abc123")).toBe(true);

    vi.unstubAllEnvs();
  });

  it("returns empty list in prod mode when signed out", async () => {
    setApiModeOverride("prod");
    vi.stubEnv("NEXT_PUBLIC_API_MODE", "prod");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    sessionRef.current = { data: null, status: "unauthenticated" };

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const { result } = renderHook(() => useUserRuns());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.isMock).toBe(false);
    expect(result.current.data).toEqual([]);

    vi.unstubAllEnvs();
  });
});

describe("usePublicArchive", () => {
  beforeEach(() => {
    clearOverride();
  });
  afterEach(() => {
    clearOverride();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns mock list in mock mode", async () => {
    const { result } = renderHook(() => usePublicArchive());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.isMock).toBe(true);
    expect(result.current.data.length).toBeGreaterThan(0);
  });

  it("falls back to mock data on fetch error", async () => {
    setApiModeOverride("prod");
    vi.stubEnv("NEXT_PUBLIC_API_MODE", "prod");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");

    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => usePublicArchive());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.isMock).toBe(true);
    expect(result.current.data.length).toBeGreaterThan(0);
  });
});

// Smoke check: the refetch wiring listens for the API mode change event.
describe("api mode change event refetches", () => {
  beforeEach(() => {
    clearOverride();
  });
  afterEach(() => {
    clearOverride();
    vi.restoreAllMocks();
  });

  it("dispatches the change event on setApiModeOverride", async () => {
    const handler = vi.fn();
    window.addEventListener("aces:api_mode_change", handler);
    act(() => {
      setApiModeOverride("local");
    });
    expect(handler).toHaveBeenCalledTimes(1);
    act(() => {
      setApiModeOverride(null);
    });
    expect(handler).toHaveBeenCalledTimes(2);
    window.removeEventListener("aces:api_mode_change", handler);
  });
});
