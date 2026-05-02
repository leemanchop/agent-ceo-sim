/**
 * Shapes returned by the Modal backend's /usage and /rate_limits endpoints.
 * Mirrors `usage_tracker.summarize()` and `current_rate_limits()` exactly —
 * keep these in sync if the backend signature drifts.
 */

export type UsageByAgent = Record<
  string,
  {
    calls: number;
    cost_usd: number;
    input_tokens: number;
    output_tokens: number;
  }
>;

export type UsageByModel = Record<
  string,
  {
    calls: number;
    cost_usd: number;
    input_tokens: number;
    output_tokens: number;
    cache_read: number;
    cache_write: number;
  }
>;

export type UsageSummary = {
  run_id: string | null;
  total_cost_usd: number;
  calls_count: number;
  by_agent: UsageByAgent;
  by_model: UsageByModel;
  last_24h_cost: number;
  current_run_cost: number | null;
};

export type RateLimitsForModel = {
  observed_at?: string;
  requests_remaining?: string;
  requests_reset?: string;
  tokens_remaining?: string;
  tokens_reset?: string;
  input_tokens_remaining?: string;
  input_tokens_reset?: string;
  output_tokens_remaining?: string;
  output_tokens_reset?: string;
};

export type RateLimitsByModel = Record<string, RateLimitsForModel>;

export type UsageRow = {
  id: number;
  ts: string;
  run_id: string | null;
  agent: string | null;
  model: string | null;
  input_tokens: number;
  output_tokens: number;
  cache_read: number;
  cache_write: number;
  cost_usd: number;
};
