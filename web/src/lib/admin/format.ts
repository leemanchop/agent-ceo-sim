/**
 * Tiny formatters shared by the admin usage screens. Kept here so both
 * /admin/usage and /admin/usage/[run_id] render numbers the same way.
 */

export function fmtUsd(n: number | null | undefined, digits = 4): string {
  if (n == null || Number.isNaN(n)) return "$0.00";
  // Show 4 decimals for sub-dollar, 2 for >= $1.
  const d = Math.abs(n) >= 1 ? 2 : digits;
  return `$${n.toFixed(d)}`;
}

export function fmtInt(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "0";
  return n.toLocaleString("en-US");
}

/**
 * Best-effort relative timestamp ("in 47s", "8s ago"). Accepts ISO strings
 * that may or may not have a `Z`. Returns "—" on garbage.
 */
export function fmtRelative(iso: string | undefined, now = Date.now()): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  const dSec = Math.round((t - now) / 1000);
  if (Math.abs(dSec) < 60) {
    return dSec >= 0 ? `in ${dSec}s` : `${-dSec}s ago`;
  }
  const dMin = Math.round(dSec / 60);
  if (Math.abs(dMin) < 60) {
    return dMin >= 0 ? `in ${dMin}m` : `${-dMin}m ago`;
  }
  const dHr = Math.round(dMin / 60);
  return dHr >= 0 ? `in ${dHr}h` : `${-dHr}h ago`;
}

export function shortRunId(runId: string | null | undefined): string {
  if (!runId) return "—";
  if (runId.length <= 12) return runId;
  return `${runId.slice(0, 6)}…${runId.slice(-4)}`;
}

export function shortModel(model: string): string {
  // claude-opus-4-7 → opus-4-7
  return model.replace(/^claude-/, "");
}
