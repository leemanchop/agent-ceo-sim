/**
 * Auth.js v5 catch-all route handler. Dispatches to the GET/POST
 * handlers from /lib/auth/config.
 */
import { handlers } from "@/lib/auth/config";

export const { GET, POST } = handlers;

// OAuth callbacks are dynamic by definition.
export const dynamic = "force-dynamic";
