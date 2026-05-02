/**
 * Canned mock data for the /admin/usage dashboard when NEXT_PUBLIC_API_URL
 * is missing or NEXT_PUBLIC_API_MODE === "mock". Numbers are hand-tuned to
 * resemble a healthy mid-day workspace: 2 runs in flight, ~$3.40 spend,
 * Opus on Researcher, Sonnet on the per-turn loop, no Haiku.
 */
import type {
  RateLimitsByModel,
  UsageRow,
  UsageSummary,
} from "./types";

export const MOCK_RUN_IDS = [
  "01HZX7T2A1Q4N9V2RY8KJM5BPQ",
  "01HZX5K9P3F2H7G1ER4VWN8DCM",
  "01HZX1B0M7C4Z3X9YA2KLP6QRT",
] as const;

const NOW = "2026-05-02T18:14:22+00:00";

export const MOCK_USAGE_GLOBAL: UsageSummary = {
  run_id: null,
  total_cost_usd: 3.4127,
  calls_count: 218,
  by_agent: {
    researcher: {
      calls: 3,
      cost_usd: 0.4012,
      input_tokens: 14_820,
      output_tokens: 3_140,
    },
    ceo: {
      calls: 84,
      cost_usd: 1.2884,
      input_tokens: 218_400,
      output_tokens: 41_200,
    },
    oracle: {
      calls: 84,
      cost_usd: 0.8421,
      input_tokens: 162_300,
      output_tokens: 18_400,
    },
    editor: {
      calls: 45,
      cost_usd: 0.5604,
      input_tokens: 92_800,
      output_tokens: 11_200,
    },
    post_mortem: {
      calls: 2,
      cost_usd: 0.3206,
      input_tokens: 12_400,
      output_tokens: 2_900,
    },
  },
  by_model: {
    "claude-opus-4-7": {
      calls: 5,
      cost_usd: 0.7218,
      input_tokens: 27_220,
      output_tokens: 6_040,
      cache_read: 0,
      cache_write: 18_400,
    },
    "claude-sonnet-4-6": {
      calls: 213,
      cost_usd: 2.6909,
      input_tokens: 473_500,
      output_tokens: 70_800,
      cache_read: 7_240_000,
      cache_write: 64_500,
    },
    "claude-haiku-4-5": {
      calls: 0,
      cost_usd: 0,
      input_tokens: 0,
      output_tokens: 0,
      cache_read: 0,
      cache_write: 0,
    },
  },
  last_24h_cost: 3.4127,
  current_run_cost: null,
};

export const MOCK_USAGE_PER_RUN: Record<string, UsageSummary> = {
  [MOCK_RUN_IDS[0]]: {
    run_id: MOCK_RUN_IDS[0],
    total_cost_usd: 1.6531,
    calls_count: 102,
    by_agent: {
      researcher: { calls: 1, cost_usd: 0.1402, input_tokens: 5_240, output_tokens: 1_080 },
      ceo: { calls: 42, cost_usd: 0.6244, input_tokens: 108_400, output_tokens: 20_300 },
      oracle: { calls: 42, cost_usd: 0.4112, input_tokens: 81_200, output_tokens: 9_100 },
      editor: { calls: 16, cost_usd: 0.3018, input_tokens: 48_400, output_tokens: 5_900 },
      post_mortem: { calls: 1, cost_usd: 0.1755, input_tokens: 6_240, output_tokens: 1_500 },
    },
    by_model: {
      "claude-opus-4-7": {
        calls: 2,
        cost_usd: 0.3157,
        input_tokens: 11_480,
        output_tokens: 2_580,
        cache_read: 0,
        cache_write: 9_200,
      },
      "claude-sonnet-4-6": {
        calls: 100,
        cost_usd: 1.3374,
        input_tokens: 231_760,
        output_tokens: 35_300,
        cache_read: 3_640_000,
        cache_write: 32_200,
      },
    },
    last_24h_cost: 3.4127,
    current_run_cost: 1.6531,
  },
  [MOCK_RUN_IDS[1]]: {
    run_id: MOCK_RUN_IDS[1],
    total_cost_usd: 1.2104,
    calls_count: 78,
    by_agent: {
      researcher: { calls: 1, cost_usd: 0.1305, input_tokens: 4_900, output_tokens: 1_020 },
      ceo: { calls: 30, cost_usd: 0.4612, input_tokens: 78_200, output_tokens: 14_900 },
      oracle: { calls: 30, cost_usd: 0.3010, input_tokens: 58_200, output_tokens: 6_500 },
      editor: { calls: 16, cost_usd: 0.2025, input_tokens: 33_400, output_tokens: 4_000 },
      post_mortem: { calls: 1, cost_usd: 0.1152, input_tokens: 4_080, output_tokens: 980 },
    },
    by_model: {
      "claude-opus-4-7": {
        calls: 2,
        cost_usd: 0.2457,
        input_tokens: 8_980,
        output_tokens: 2_000,
        cache_read: 0,
        cache_write: 7_200,
      },
      "claude-sonnet-4-6": {
        calls: 76,
        cost_usd: 0.9647,
        input_tokens: 169_820,
        output_tokens: 25_400,
        cache_read: 2_600_000,
        cache_write: 23_300,
      },
    },
    last_24h_cost: 3.4127,
    current_run_cost: 1.2104,
  },
  [MOCK_RUN_IDS[2]]: {
    run_id: MOCK_RUN_IDS[2],
    total_cost_usd: 0.5492,
    calls_count: 38,
    by_agent: {
      researcher: { calls: 1, cost_usd: 0.1305, input_tokens: 4_680, output_tokens: 1_040 },
      ceo: { calls: 12, cost_usd: 0.2028, input_tokens: 31_800, output_tokens: 6_000 },
      oracle: { calls: 12, cost_usd: 0.1299, input_tokens: 22_900, output_tokens: 2_800 },
      editor: { calls: 13, cost_usd: 0.0561, input_tokens: 11_000, output_tokens: 1_300 },
    },
    by_model: {
      "claude-opus-4-7": {
        calls: 1,
        cost_usd: 0.1604,
        input_tokens: 6_760,
        output_tokens: 1_460,
        cache_read: 0,
        cache_write: 2_000,
      },
      "claude-sonnet-4-6": {
        calls: 37,
        cost_usd: 0.3888,
        input_tokens: 71_920,
        output_tokens: 10_100,
        cache_read: 1_000_000,
        cache_write: 9_000,
      },
    },
    last_24h_cost: 3.4127,
    current_run_cost: 0.5492,
  },
};

export const MOCK_USAGE_ROWS: Record<string, UsageRow[]> = {
  [MOCK_RUN_IDS[0]]: [
    { id: 1, ts: "2026-05-02T17:51:02Z", run_id: MOCK_RUN_IDS[0], agent: "researcher", model: "claude-opus-4-7", input_tokens: 5240, output_tokens: 1080, cache_read: 0, cache_write: 4600, cost_usd: 0.1402 },
    { id: 2, ts: "2026-05-02T17:53:14Z", run_id: MOCK_RUN_IDS[0], agent: "oracle", model: "claude-sonnet-4-6", input_tokens: 1900, output_tokens: 220, cache_read: 0, cache_write: 22000, cost_usd: 0.0997 },
    { id: 3, ts: "2026-05-02T17:53:16Z", run_id: MOCK_RUN_IDS[0], agent: "ceo", model: "claude-sonnet-4-6", input_tokens: 2600, output_tokens: 480, cache_read: 22000, cache_write: 0, cost_usd: 0.0156 },
    { id: 4, ts: "2026-05-02T17:53:21Z", run_id: MOCK_RUN_IDS[0], agent: "editor", model: "claude-sonnet-4-6", input_tokens: 3020, output_tokens: 360, cache_read: 22000, cache_write: 0, cost_usd: 0.0186 },
    { id: 5, ts: "2026-05-02T17:55:48Z", run_id: MOCK_RUN_IDS[0], agent: "oracle", model: "claude-sonnet-4-6", input_tokens: 1840, output_tokens: 200, cache_read: 22000, cache_write: 0, cost_usd: 0.0123 },
    { id: 6, ts: "2026-05-02T17:55:50Z", run_id: MOCK_RUN_IDS[0], agent: "ceo", model: "claude-sonnet-4-6", input_tokens: 2540, output_tokens: 460, cache_read: 22000, cache_write: 0, cost_usd: 0.0151 },
    { id: 7, ts: "2026-05-02T17:55:55Z", run_id: MOCK_RUN_IDS[0], agent: "editor", model: "claude-sonnet-4-6", input_tokens: 2980, output_tokens: 340, cache_read: 22000, cache_write: 0, cost_usd: 0.0182 },
    { id: 8, ts: "2026-05-02T17:58:12Z", run_id: MOCK_RUN_IDS[0], agent: "ceo", model: "claude-sonnet-4-6", input_tokens: 2700, output_tokens: 540, cache_read: 22000, cache_write: 0, cost_usd: 0.0167 },
  ],
  [MOCK_RUN_IDS[1]]: [
    { id: 101, ts: "2026-05-02T16:42:00Z", run_id: MOCK_RUN_IDS[1], agent: "researcher", model: "claude-opus-4-7", input_tokens: 4900, output_tokens: 1020, cache_read: 0, cache_write: 3600, cost_usd: 0.1305 },
    { id: 102, ts: "2026-05-02T16:44:12Z", run_id: MOCK_RUN_IDS[1], agent: "oracle", model: "claude-sonnet-4-6", input_tokens: 1820, output_tokens: 210, cache_read: 0, cache_write: 19000, cost_usd: 0.0863 },
    { id: 103, ts: "2026-05-02T16:44:14Z", run_id: MOCK_RUN_IDS[1], agent: "ceo", model: "claude-sonnet-4-6", input_tokens: 2540, output_tokens: 460, cache_read: 19000, cache_write: 0, cost_usd: 0.0151 },
  ],
  [MOCK_RUN_IDS[2]]: [
    { id: 201, ts: "2026-05-02T15:20:11Z", run_id: MOCK_RUN_IDS[2], agent: "researcher", model: "claude-opus-4-7", input_tokens: 4680, output_tokens: 1040, cache_read: 0, cache_write: 2000, cost_usd: 0.1305 },
    { id: 202, ts: "2026-05-02T15:22:33Z", run_id: MOCK_RUN_IDS[2], agent: "oracle", model: "claude-sonnet-4-6", input_tokens: 1810, output_tokens: 200, cache_read: 0, cache_write: 9000, cost_usd: 0.0426 },
    { id: 203, ts: "2026-05-02T15:22:35Z", run_id: MOCK_RUN_IDS[2], agent: "ceo", model: "claude-sonnet-4-6", input_tokens: 2480, output_tokens: 460, cache_read: 9000, cache_write: 0, cost_usd: 0.0149 },
  ],
};

export const MOCK_RUN_META: { run_id: string; started_at: string; agent_count: number; cost_usd: number }[] = [
  { run_id: MOCK_RUN_IDS[0], started_at: "2026-05-02T17:51:02Z", agent_count: 5, cost_usd: 1.6531 },
  { run_id: MOCK_RUN_IDS[1], started_at: "2026-05-02T16:42:00Z", agent_count: 5, cost_usd: 1.2104 },
  { run_id: MOCK_RUN_IDS[2], started_at: "2026-05-02T15:20:11Z", agent_count: 4, cost_usd: 0.5492 },
];

// Sonnet at ~8% remaining requests so the alarm bar tint renders.
export const MOCK_RATE_LIMITS: RateLimitsByModel = {
  "claude-opus-4-7": {
    observed_at: NOW,
    requests_remaining: "48",
    requests_reset: "2026-05-02T18:15:00Z",
    tokens_remaining: "190000",
    tokens_reset: "2026-05-02T18:15:00Z",
  },
  "claude-sonnet-4-6": {
    observed_at: NOW,
    requests_remaining: "76",
    requests_reset: "2026-05-02T18:15:00Z",
    tokens_remaining: "32000",
    tokens_reset: "2026-05-02T18:15:00Z",
    input_tokens_remaining: "32000",
    input_tokens_reset: "2026-05-02T18:15:00Z",
  },
};

// Caps used to compute "% remaining" bars when the API doesn't tell us.
export const MODEL_CAPS: Record<string, { requests: number; tokens: number }> = {
  "claude-opus-4-7": { requests: 50, tokens: 200_000 },
  "claude-sonnet-4-6": { requests: 1000, tokens: 400_000 },
  "claude-haiku-4-5": { requests: 1000, tokens: 400_000 },
};
