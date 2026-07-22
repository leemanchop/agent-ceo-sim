import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/navigation BEFORE importing the page.
const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({ get: () => null }),
  useParams: () => ({}),
  usePathname: () => "/",
}));

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

import LandingPage from "@/app/page";

describe("Landing page", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("renders the START RUN button", () => {
    render(<LandingPage />);
    // case-insensitive substring match — UI is being reskinned, so be loose.
    const btn = screen.getByText(/start run/i);
    expect(btn).toBeTruthy();
  });

  it("does NOT render the retired Be-the-CEO mode toggle (spectate-only)", () => {
    render(<LandingPage />);
    expect(screen.queryByText(/be the ceo/i)).toBeNull();
    expect(screen.queryByText(/who decides/i)).toBeNull();
  });

  it("renders all three length options", () => {
    render(<LandingPage />);
    // looser query: each label appears in the doc somewhere as a chip.
    expect(screen.getAllByText(/^short$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^medium$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^long$/i).length).toBeGreaterThan(0);
  });

  it("renders all four craziness options", () => {
    render(<LandingPage />);
    expect(screen.getAllByText(/^tame$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^normal$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^crazy$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^unhinged$/i).length).toBeGreaterThan(0);
  });

  it("renders the three template buttons (Delve, Theranos, FTX)", () => {
    render(<LandingPage />);
    expect(screen.getByText(/delve/i)).toBeTruthy();
    expect(screen.getByText(/theranos/i)).toBeTruthy();
    expect(screen.getByText(/ftx/i)).toBeTruthy();
  });
});
