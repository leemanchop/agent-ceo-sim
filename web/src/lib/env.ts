/**
 * Runtime environment-variable validation.
 *
 * Both the server and the browser read these vars; we validate at import time
 * and degrade gracefully (warn + fall back to mock) on misconfigure rather
 * than crashing the page. The `requireApiUrl()` helper hard-throws when an
 * HTTP call is actually attempted in a non-mock mode without a base URL — that
 * is the right place to fail loudly, not at module load.
 *
 * Contract:
 *   NEXT_PUBLIC_API_MODE: "mock" | "local" | "prod"  (default "mock")
 *   NEXT_PUBLIC_API_URL:  absolute URL, required iff API_MODE === "prod"
 */
import { z } from "zod";

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_API_MODE: z.enum(["mock", "local", "prod"]).default("mock"),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

/**
 * Server-only env. Auth secrets live here. All optional — when
 * unset, OAuth fails closed (no users can sign in) and the rest
 * of the app continues to render. This is the desired hackathon
 * degrade path.
 */
export const ServerEnvSchema = ClientEnvSchema.extend({
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  ADMIN_EMAILS: z.string().optional(),
});

const _parsed = ClientEnvSchema.safeParse({
  NEXT_PUBLIC_API_MODE: process.env.NEXT_PUBLIC_API_MODE,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

export const env = _parsed.success
  ? _parsed.data
  : (() => {
      // Don't crash — degrade. Browsers can't recover from a thrown import.
      if (typeof window === "undefined") {
        // eslint-disable-next-line no-console
        console.warn(
          "[env] invalid env config:",
          _parsed.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join("; ")
        );
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          "[env] frontend env misconfigured — degrading to mock mode"
        );
      }
      return {
        NEXT_PUBLIC_API_MODE: "mock" as const,
        NEXT_PUBLIC_API_URL: undefined,
      };
    })();

/**
 * Returns the API base URL with no trailing slash. Throws if called in mock
 * mode (callers must check the mode first) or if the URL is missing in a
 * mode that needs it.
 */
export function requireApiUrl(): string {
  if (env.NEXT_PUBLIC_API_MODE === "mock") {
    throw new Error("requireApiUrl called in mock mode");
  }
  if (env.NEXT_PUBLIC_API_MODE === "local") {
    return (env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(
      /\/$/,
      ""
    );
  }
  // prod
  if (!env.NEXT_PUBLIC_API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is required when NEXT_PUBLIC_API_MODE=prod. Set it to your Modal deploy URL."
    );
  }
  return env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
}

/**
 * Test-only: re-parse an explicit env object. Not exposed in production paths.
 */
export function parseEnvForTest(input: Record<string, string | undefined>) {
  return ClientEnvSchema.safeParse(input);
}
