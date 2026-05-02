"use client";

/**
 * Brutalist sign-in screen. The "or don't" copy is intentional —
 * we don't want the corporate "Welcome back!" energy. Spectator
 * fallback is a click away.
 */

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { markGuest } from "@/lib/user/local-runs";

function SignInInner() {
  const search = useSearchParams();
  const callbackUrl = search?.get("callbackUrl") ?? "/";
  const reason = search?.get("reason");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // pre-warm the guest flag clearing if the user came via callback
    if (reason === "admin_required") return;
  }, [reason]);

  return (
    <main className="min-h-screen bg-paper text-ink font-body">
      {/* top bar */}
      <header
        className="flex items-center justify-between px-6 h-12"
        style={{ borderBottom: "1.4px solid var(--ink)" }}
      >
        <Link
          href="/"
          className="font-mono uppercase tracking-wider hover:text-alarm"
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textDecoration: "none",
            color: "var(--ink)",
          }}
        >
          ← FORBES · 30u30 SIMULATOR
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {reason === "admin_required" && (
          <div
            className="mb-6"
            style={{
              border: "1.4px solid var(--alarm)",
              background: "var(--alarm-soft)",
              padding: "10px 14px",
              color: "var(--alarm)",
              fontSize: 11,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
            }}
          >
            🔒 admin only — sign in with an allowlisted email.
          </div>
        )}

        <h1
          className="font-body"
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          sign in. or don&apos;t. the agent doesn&apos;t know either way.
        </h1>

        <p
          className="mt-4 font-body"
          style={{ fontSize: 14, color: "var(--soft)", lineHeight: 1.55 }}
        >
          we use your google account to remember which runs were yours,
          score your predictions, and stamp your name on the leaderboard.
          that&apos;s it. we do not sell your data because we have no
          business model.
        </p>

        <div
          className="mt-8"
          style={{
            border: "1.6px solid var(--alarm)",
            background: "var(--paper)",
            padding: 0,
          }}
        >
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setSubmitting(true);
              void signIn("google", { callbackUrl });
            }}
            className="font-mono uppercase"
            style={{
              width: "100%",
              padding: "18px 22px",
              fontSize: 14,
              letterSpacing: "0.12em",
              fontWeight: 700,
              background: "var(--paper)",
              color: "var(--ink)",
              border: 0,
              cursor: submitting ? "wait" : "pointer",
              textAlign: "left",
            }}
          >
            {submitting ? "→ REDIRECTING…" : "→ CONTINUE WITH GOOGLE"}
          </button>
        </div>

        <div className="mt-6">
          <Link
            href="/?guest=1"
            onClick={() => {
              if (typeof window !== "undefined") markGuest();
            }}
            className="font-mono uppercase tracking-wider hover:text-ink"
            style={{
              fontSize: 11,
              color: "var(--soft)",
              letterSpacing: "0.08em",
              textDecoration: "none",
            }}
          >
            → skip — i&apos;ll spectate as a guest
          </Link>
        </div>

        <div
          className="mt-16 text-center font-mono uppercase tracking-wider"
          style={{ fontSize: 10, color: "var(--soft)" }}
        >
          oauth via google · no password to forget · no newsletter
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  // useSearchParams must be inside a Suspense boundary in app router.
  return (
    <Suspense fallback={null}>
      <SignInInner />
    </Suspense>
  );
}
