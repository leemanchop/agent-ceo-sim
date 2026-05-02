import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/navigation BEFORE importing the page.
vi.mock("next/navigation", () => {
  const sp = new URLSearchParams("mode=spectate");
  return {
    useParams: () => ({ id: "demo" }),
    useSearchParams: () => ({
      get: (k: string) => sp.get(k),
    }),
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => "/run/demo",
  };
});

// Mock next/link to a plain <a> for jsdom.
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...rest
  }: React.ComponentProps<"a"> & { children: React.ReactNode }) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  ),
}));

import RunPage from "@/app/run/[id]/page";
import { MOCK_BIBLE } from "@/lib/mock-data";

describe("Run page (smoke)", () => {
  beforeEach(() => {
    // suppress rAF loops to keep the render deterministic
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(
      // run once then stop — avoids infinite loops in animation hooks
      (() => 0) as unknown as typeof window.requestAnimationFrame
    );
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(
      (() => undefined) as unknown as typeof window.cancelAnimationFrame
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("mounts without throwing", () => {
    expect(() => render(<RunPage />)).not.toThrow();
  });

  it("shows the company display name in the header", () => {
    render(<RunPage />);
    // case-insensitive — display name is uppercased in the header.
    const matches = screen.getAllByText(
      new RegExp(MOCK_BIBLE.display_name, "i")
    );
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders something resembling the LIVE badge or run id", () => {
    render(<RunPage />);
    // very loose — look for at least one of these substrings.
    const live = screen.queryAllByText(/live/i);
    const run = screen.queryAllByText(/run/i);
    expect(live.length + run.length).toBeGreaterThan(0);
  });
});
