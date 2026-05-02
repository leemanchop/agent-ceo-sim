/**
 * Tiny strip rendered above any admin-section page. Confirms which
 * email is currently authed and reminds the operator that this is
 * gated by ADMIN_EMAILS allowlist.
 *
 * Server-rendered so it ships with the page on first paint.
 */
export function AdminIdentityBanner({ email }: { email: string }) {
  return (
    <div
      className="px-6 py-1.5 flex items-center justify-between"
      style={{
        borderBottom: "1.4px solid var(--ink)",
        background: "var(--paper)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <span
        className="uppercase tracking-wider"
        style={{ fontSize: 10, letterSpacing: "0.10em", color: "var(--ink)" }}
      >
        🔒 ADMIN · {email}
      </span>
      <span style={{ fontSize: 10, color: "var(--soft)" }}>
        allowlist via ADMIN_EMAILS
      </span>
    </div>
  );
}
