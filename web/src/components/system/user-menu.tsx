"use client";

/**
 * <UserMenu /> — top-right pill that swaps between four states:
 *   1. unauthenticated         → "SIGN IN" pill
 *   2. unauthenticated + guest → "GUEST" pill with upgrade option
 *   3. authenticated           → avatar + name + dropdown
 *   4. authenticated + admin   → same, with extra ADMIN · USAGE row
 *
 * Brutalist register: ink border, mono uppercase, no rounding, no
 * shadow. Dropdown is absolutely-positioned below the pill.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { isGuest, clearGuest } from "@/lib/user/local-runs";

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1)}…`;
}

export function UserMenu() {
  const { data: session, status } = useSession();
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [guest, setGuest] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // reconcile localStorage guest flag client-side
  useEffect(() => {
    setGuest(isGuest());
  }, [status]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // ─ unauthenticated ───────────────────────────────────────────
  if (status !== "authenticated" || !session?.user) {
    if (guest) {
      return (
        <div ref={wrapRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="pill"
            style={{
              cursor: "pointer",
              fontSize: 11,
              letterSpacing: "0.08em",
            }}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            GUEST ▾
          </button>
          {open && (
            <Dropdown>
              <DropdownItem
                onClick={() => {
                  clearGuest();
                  setGuest(false);
                  setOpen(false);
                  signIn("google", { callbackUrl: pathname });
                }}
              >
                → SIGN IN WITH GOOGLE
              </DropdownItem>
              <DropdownItem
                href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`}
                onClick={() => setOpen(false)}
              >
                ABOUT SIGN-IN
              </DropdownItem>
            </Dropdown>
          )}
        </div>
      );
    }
    return (
      <Link
        href={`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`}
        className="pill"
        style={{
          textDecoration: "none",
          fontSize: 11,
          letterSpacing: "0.08em",
        }}
      >
        SIGN IN
      </Link>
    );
  }

  // ─ authenticated ─────────────────────────────────────────────
  const user = session.user;
  const isAdmin = Boolean(user.isAdmin);
  const display = truncate(user.name ?? user.email ?? "you", 12);

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-mono uppercase tracking-wider"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          border: "1.4px solid var(--ink)",
          background: "var(--paper)",
          color: "var(--ink)",
          cursor: "pointer",
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.image ? (
          // Plain <img> — Google avatars use lh3.googleusercontent.com which
          // would require next.config remotePatterns. Skip that complexity.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            width={22}
            height={22}
            style={{
              borderRadius: "50%",
              border: "1px solid var(--ink)",
              objectFit: "cover",
              display: "inline-block",
            }}
          />
        ) : (
          <span
            aria-hidden
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: "1px solid var(--ink)",
              display: "inline-block",
            }}
          />
        )}
        <span>{display}</span>
        <span style={{ fontSize: 9 }}>▾</span>
      </button>
      {open && (
        <Dropdown>
          <DropdownItem href="/me/runs" onClick={() => setOpen(false)}>
            MY RUNS
          </DropdownItem>
          <DropdownItem href="/me/runs?tab=leaderboards" onClick={() => setOpen(false)}>
            LEADERBOARDS
          </DropdownItem>
          {isAdmin && (
            <DropdownItem
              href="/admin/usage"
              onClick={() => setOpen(false)}
              alarm
            >
              ADMIN · USAGE
            </DropdownItem>
          )}
          <Separator />
          <DropdownItem
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
          >
            SIGN OUT
          </DropdownItem>
        </Dropdown>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// dropdown primitives — brutalist; no shadow, no rounding
// ─────────────────────────────────────────────────────────────────────

function Dropdown({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="menu"
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        right: 0,
        minWidth: 180,
        zIndex: 50,
        border: "1.4px solid var(--ink)",
        background: "var(--paper)",
      }}
    >
      {children}
    </div>
  );
}

function DropdownItem({
  href,
  onClick,
  children,
  alarm,
}: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  alarm?: boolean;
}) {
  const style: React.CSSProperties = {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "8px 12px",
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: alarm ? "var(--alarm)" : "var(--ink)",
    background: "transparent",
    border: 0,
    cursor: "pointer",
    textDecoration: "none",
  };
  if (href) {
    return (
      <Link href={href} onClick={onClick} role="menuitem" style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" role="menuitem" onClick={onClick} style={style}>
      {children}
    </button>
  );
}

function Separator() {
  return <div style={{ borderTop: "1.2px solid var(--ink)" }} />;
}
