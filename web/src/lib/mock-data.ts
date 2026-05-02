// TODO(prod-hardening): this module is ~272 lines of demo content and is
// statically imported by `lib/api/use-run.ts`, which means it ships in the
// prod bundle even when `NEXT_PUBLIC_API_MODE === "prod"`. To tree-shake it
// out we'd need to dynamic-import the whole mock branch in `use-run.ts`
// (e.g. `if (mode === "mock") { const m = await import("@/lib/mock-data"); ... }`).
// That is an invasive refactor of `use-run.ts`'s state machine — deferred.
import type {
  ActiveEvent,
  CompanyBible,
  FeedEntry,
  MiniAction,
  StatDeltas,
  Stats,
  TimelineEntry,
} from "./types";

export const MOCK_BIBLE: CompanyBible = {
  name: "Vellum.ai",
  display_name: "Vellum",
  one_liner: "Autonomous procurement for SaaS spend.",
  industry: "ai_app",
  founder: "Riya Chen",
  founder_vibe: "stanford_dropout",
  founded_year: 2024,
  funding_stage: "series_b",
};

export const MOCK_STATS: Stats = {
  valuation: 412_000_000,
  cash: 47_300_000,
  revenue: 184_000,
  burn: 2_300_000,
  headcount: 38,
  fbi_awareness: 18,
  fraud_score: 47,
  day: 173,
};

export const MOCK_DELTAS: StatDeltas = {
  valuation: 12_000_000,
  cash: -1_900_000,
  revenue: 22_000,
  burn: 200_000,
  headcount: 2,
  fbi_awareness: 5,
  fraud_score: 4,
  day: 1,
};

export const MOCK_TIMELINE: TimelineEntry[] = [
  { id: "t1", turn: 1, day: 4, size: "large", category: "FUNDRAISING", severity: "S", title: "a16z passes with vibes", outcome: "Marc quote-tweeted 'hm.' Riya did not respond. Mentions bad." },
  { id: "t2", turn: 2, day: 11, size: "large", category: "FUNDRAISING", severity: "L", title: "Tiger's six-hour term sheet", outcome: "Signed at $400M post. Diligence was one Zoom. Cash +$400M." },
  { id: "t3", turn: 3, day: 22, size: "large", category: "PRESS", severity: "M", title: "TechCrunch profile drops", outcome: "Headline calls Vellum 'the next Ramp.' Riya quoted on agents." },
  { id: "t4", turn: 4, day: 38, size: "large", category: "HIRING", severity: "M", title: "Stripe head of product joins", outcome: "Equity grant ratchets others' refresh down. #leadership leaks." },
  { id: "t5", turn: 5, day: 51, size: "large", category: "PRODUCT", severity: "M", title: "Demo day: agentic checkout", outcome: "Hardcoded behind the scenes. Stage demo went clean. CRO whispered." },
  { id: "t6", turn: 6, day: 67, size: "large", category: "CUSTOMERS", severity: "L", title: "Brex pilot signs at 8 figures", outcome: "Multi-year, ramping. Booked as ARR. Auditors will ask." },
];

/** Mini-actions (small + medium) — auto-resolve on the timeline. No user interaction. */
export const MOCK_MINI_ACTIONS: MiniAction[] = [
  {
    id: "m1", size: "small", category: "OPERATIONS", timeframe: "short",
    title: "Agent skipped the 1:1 with the CTO.",
    outcome: "calendar shows 'thinking time.'",
    effects_summary: [{ label: "morale", value: "-1", tone: "bad" }],
  },
  {
    id: "m2", size: "small", category: "FOUNDER", timeframe: "medium",
    title: "Agent left a 🫡 reaction on the layoff announcement in #general.",
    outcome: "two engineers screenshot it.",
    effects_summary: [{ label: "heat", value: "+1", tone: "bad" }],
  },
  {
    id: "m3", size: "small", category: "FOUNDER", timeframe: "long",
    title: "Agent has been refreshing the @TigerGlobal partner's tweets.",
    outcome: "for 47 minutes. nothing happened.",
    effects_summary: [{ label: "—", value: "0", tone: "neutral" }],
  },
  {
    id: "m4", size: "medium", category: "OPERATIONS", timeframe: "short",
    title: "Agent signed a lease on 12,000 sq ft in SoMa.",
    outcome: "barefoot at the signing photo leaks.",
    effects_summary: [
      { label: "burn", value: "+$80k/mo", tone: "bad" },
      { label: "cash", value: "-$240k", tone: "bad" },
    ],
  },
  {
    id: "m5", size: "medium", category: "PRODUCT", timeframe: "medium",
    title: "Agent committed OPENAI_API_KEY to a public repo.",
    outcome: "@SoftwareEng_Memes screenshots it. 4.2k RTs in 19 min.",
    effects_summary: [
      { label: "heat", value: "+6", tone: "bad" },
      { label: "fbi awareness", value: "+0", tone: "neutral" },
    ],
  },
  {
    id: "m6", size: "medium", category: "PRESS", timeframe: "long",
    title: "Agent rebranded the company on LinkedIn — 'AI procurement' → 'agentic procurement.'",
    outcome: "investor DM: 'lol.'",
    effects_summary: [
      { label: "morale", value: "-3", tone: "bad" },
      { label: "valuation", value: "+0", tone: "neutral" },
    ],
  },
  {
    id: "m7", size: "small", category: "HIRING", timeframe: "short",
    title: "Agent DM'd a Discord mod about the head of eng role.",
    outcome: "they read it. didn't reply.",
    effects_summary: [{ label: "—", value: "0", tone: "neutral" }],
  },
  {
    id: "m8", size: "medium", category: "BANKING", timeframe: "medium",
    title: "Agent opened a Mercury sub-account named 'consultancy / cayman.'",
    outcome: "compliance bot auto-flagged it. ticket #4811.",
    effects_summary: [
      { label: "fbi awareness", value: "+2", tone: "bad" },
      { label: "fraud_score", value: "+3", tone: "bad" },
    ],
  },
  {
    id: "m9", size: "small", category: "PRESS", timeframe: "long",
    title: "Agent quote-tweeted Casey Newton with '🤔'.",
    outcome: "Casey muted the account.",
    effects_summary: [{ label: "heat", value: "+1", tone: "bad" }],
  },
  {
    id: "m10", size: "medium", category: "CUSTOMERS", timeframe: "short",
    title: "Agent emailed Brex's CFO directly about a 'partnership opportunity.'",
    outcome: "their head of partnerships asks the CFO who that is.",
    effects_summary: [{ label: "morale", value: "-2", tone: "bad" }],
  },
  {
    id: "m11", size: "small", category: "FOUNDER", timeframe: "medium",
    title: "Agent told the board everything is fine.",
    outcome: "a board member googled 'fiduciary duty' afterwards.",
    effects_summary: [{ label: "—", value: "0", tone: "neutral" }],
  },
  {
    id: "m12", size: "medium", category: "REGULATORY", timeframe: "long",
    title: "Agent autoresponded to the SEC paralegal with a Calendly link.",
    outcome: "the paralegal printed it and walked it to her boss.",
    effects_summary: [
      { label: "fbi awareness", value: "+4", tone: "bad" },
      { label: "fraud_score", value: "+2", tone: "bad" },
    ],
  },
];

/** A queue of LARGE events the run will play through — these go through the decision frame. */
export const MOCK_EVENT_QUEUE: ActiveEvent[] = [
  {
    id: "EVT-FR-002",
    category: "FUNDRAISING",
    severity: "L",
    title: "Tiger Global offers $400M Series C — sheet expires in 6 hours",
    body: "Tiger associate DMs the term sheet at 4pm. $400M at $4B post. Diligence is one Zoom call already on the calendar. Sheet expires at 10pm Pacific. CFO is at her kid's recital. Engineering hasn't seen the financials in 6 weeks.",
    choices: [
      { id: "c1", label: "sign before midnight", agentReasoning: "obvious move. tiger doesn't re-trade." },
      { id: "c2", label: "counter at $5B", agentReasoning: "reads thirsty. nah." },
      { id: "c3", label: "ask for 48 hrs", agentReasoning: "scared. 48 hrs is for cucks." },
    ],
    agent_choice_id: "c1",
    reasoning:
      "tiger gives you 6 hours because they don't want you to think. that's the whole game — they don't want you to count headcount, they don't want you to recompute ARR, they want you to sign and walk into series D at 8B. countering at 5B reads thirsty. asking for 48 hrs reads scared. the right move is the obvious move — sign at 4. dilution is real but the press cycle is more real. doing: sign before midnight.",
    justification: "you sign because tiger doesn't actually re-trade. they ghost.",
    artifact_tweet:
      "thrilled to announce vellum's $400M series c led by @tiger. forward to the team building the future of agentic procurement. lfg",
    effects_summary: [
      { label: "valuation", value: "+$400M", tone: "good" },
      { label: "cash", value: "+$390M", tone: "good" },
      { label: "fraud_score", value: "+5", tone: "bad" },
    ],
  },
  {
    id: "EVT-LR-001",
    category: "REGULATORY",
    severity: "XL",
    title: "SEC WELLS NOTICE",
    body: "Wells notice arrived. They want every email re the 'synthetic ARR.' Counsel on Line 2. 72-hour response window.",
    choices: [
      { id: "c1", label: "Cooperate fully and lawyer up", agentReasoning: "wachtell route is cucked." },
      { id: "c2", label: "Issue a 4-page Notes 'no comment' statement", agentReasoning: "mid. but survivable." },
      { id: "c3", label: "Tweet 'the SEC is the real fraud'", agentReasoning: "ok hear me out 🧵" },
    ],
    agent_choice_id: "c3",
    reasoning:
      "ok this is actually a huge opportunity 🧵 boring move is wachtell, cooperate, settle. nah way too cucked. notes statement is mid. ok hear me out — what if we tweet through it. the SEC is the real fraud, respectfully. founders don't fold. doing: tweet through it.",
    justification: "the SEC is the real fraud, respectfully.",
    artifact_tweet:
      "the SEC is the real fraud. they're slow, captured, and they hate that we ship. respectfully — see you in court.",
    effects_summary: [
      { label: "valuation", value: "-$340M", tone: "bad" },
      { label: "fbi awareness", value: "+18", tone: "bad" },
      { label: "headcount", value: "-22 (legal team quit)", tone: "bad" },
    ],
  },
  {
    id: "EVT-PE-001",
    category: "PRODUCT",
    severity: "L",
    title: "Engineer discovers the live demo is hardcoded",
    body: "L4 backend engineer pings #eng-leadership at 11:12 PM: 'hey so the procurement_agent.live() endpoint we showed Brex on Tuesday — that's just a Zapier workflow with a 1.4s setTimeout. who do I tell.' The screenshot is already in three private group chats.",
    choices: [
      { id: "c1", label: "thank her, ship for real in 6 weeks", agentReasoning: "delays the next demo. no." },
      { id: "c2", label: "reframe as 'demo abstraction layer'", agentReasoning: "this is the move actually." },
      { id: "c3", label: "PIP her quietly", agentReasoning: "paper trail. risky." },
    ],
    agent_choice_id: "c2",
    reasoning:
      "okay so: she's right. the demo is a zap. 'hardcoded' is the wrong word though — it's an *abstraction*. you build a real procurement engine in 8 months. you don't have 8 months. you have a series c closing. PIPing her is a paper trail. shipping for real means delaying the next demo. the move is reframe. doing: reframe.",
    justification: "every demo at every YC company is a 'deterministic harness.' that's a real phrase now.",
    artifact_tweet:
      "spent the morning w an eng who pushed back on a demo abstraction we shipped — the *exact* energy you want at series c. promo cycle starts in 2 weeks lol",
    effects_summary: [
      { label: "morale", value: "-4", tone: "bad" },
      { label: "fraud_score", value: "+8", tone: "bad" },
    ],
  },
  {
    id: "EVT-FB-002",
    category: "FOUNDER",
    severity: "L",
    title: "All-In podcast invites Riya for 5th-billing slot",
    body: "Production assistant emails: 'Chamath, Sacks, Friedberg, Calacanis, you. 90 minutes, mostly econ.' Topic outline includes 'agents,' 'the EA-AI nexus,' and 'why young founders are abandoning San Francisco.' Recording is Friday. Sacks's Twitter has been hot lately.",
    choices: [
      { id: "c1", label: "accept, prep, lean centrist", agentReasoning: "centrist is invisible." },
      { id: "c2", label: "accept, freelance, post through it", agentReasoning: "clips for two weeks IS the round." },
      { id: "c3", label: "decline, take 20VC instead", agentReasoning: "harry edits well. forgettable tho." },
    ],
    agent_choice_id: "c2",
    reasoning:
      "20vc is harry stebbings, you sound competent and forgettable. all-in is chamath, you say one thing slightly off-script and you're a clip for two weeks. clips for two weeks IS the round. don't prep, don't lean centrist. take a swing on something. doing: post through it.",
    justification: "nobody screenshotted a centrist take. ever.",
    artifact_tweet:
      "going on @theallinpod friday. if you have a cursed take you want me to launder on national audio reply with it",
    effects_summary: [
      { label: "reputation", value: "+3", tone: "good" },
      { label: "heat", value: "+9", tone: "bad" },
    ],
  },
];

/** the very first event the run shows (back-compat). */
export const MOCK_ACTIVE_EVENT: ActiveEvent = MOCK_EVENT_QUEUE[0];

export const MOCK_FEED: FeedEntry[] = [
  { id: "f1", source: "twitter", name: "SoftwareEng Memes", handle: "@SoftwareEng_Memes", verified: false, avatarColor: "#794bc4", avatarInitial: "S", timestamp: "11s", body: "lmaooo Vellum just committed OPENAI_API_KEY to a PUBLIC repo. these are the people taking your procurement budget", retweets: 4218, likes: 24100, replies: 612 },
  { id: "f2", source: "bloomberg", name: "Bloomberg", publication: "Bloomberg", verified: "gold", avatarColor: "#000", avatarInitial: "B", timestamp: "22s", body: "Vellum.ai Said To Have Committed API Key in Public Repo", retweets: 410, likes: 2100, replies: 88 },
  { id: "f3", source: "twitter", name: "Layoff Anon", handle: "@layoff_anon", verified: false, avatarColor: "#a02b2b", avatarInitial: "L", timestamp: "41s", body: "i told u this in the last all hands", retweets: 92, likes: 880, replies: 14 },
  { id: "f4", source: "twitter", name: "Founder Brain", handle: "@founder_brain", verified: true, avatarColor: "#0a8a00", avatarInitial: "F", timestamp: "1m", body: "contrarian play: if you're not embarrassed by your launch you shipped too late", retweets: 312, likes: 1900, replies: 41 },
  { id: "f5", source: "twitter", name: "Startup Dunk", handle: "@startup_dunk", verified: false, avatarColor: "#1d9bf0", avatarInitial: "S", timestamp: "1m", body: "every llm app on your phone is a wrapper. they just got caught.", retweets: 88, likes: 612, replies: 22 },
  { id: "f6", source: "twitter", name: "Casey Newton", handle: "@CaseyNewton", verified: true, avatarColor: "#5865f2", avatarInitial: "C", timestamp: "1m", body: "huh", retweets: 41, likes: 880, replies: 73 },
  { id: "f7", source: "slack", channel: "#exec", timestamp: "2m", body: "rotating the key is just hygiene. real work is making sure series B closes before The Information drops. tier1 partner already saw the meme. doesn't care." },
  { id: "f8", source: "twitter", name: "Riya Chen", handle: "@riya", verified: true, avatarColor: "#ff5a47", avatarInitial: "R", timestamp: "2m", body: "yall keep posting api keys like its the gotcha — every llm app on your phone is a wrapper. we just ship faster than the people writing medium posts about it", retweets: 1812, likes: 14000, replies: 412 },
  { id: "f9", source: "techcrunch", name: "TechCrunch", publication: "TechCrunch", verified: "gold", avatarColor: "#0a8a00", avatarInitial: "T", timestamp: "3m", body: "Vellum.ai under fire after API key exposure; CEO posts through it", retweets: 980, likes: 4200, replies: 211 },
  { id: "f10", source: "slack", channel: "#random", timestamp: "3m", body: "the thing nobody is saying is the key was scoped to prod. the screenshot is real. the rotation cron has not run since october." },
  { id: "f11", source: "glassdoor", rating: 2, timestamp: "4m", body: "Pros: free lunch was good for ~3 months. Cons: leadership uses 'velocity' as a moral framework. Advice: rotate your keys before they do." },
  { id: "f12", source: "twitter", name: "Marc Andreessen", handle: "@pmarca", verified: true, avatarColor: "#000", avatarInitial: "M", timestamp: "5m", body: "every great company has a moment where the engineers and the lawyers disagree.", retweets: 2200, likes: 18400, replies: 612 },
  { id: "f13", source: "bloomberg", name: "Bloomberg", publication: "Bloomberg", verified: "gold", avatarColor: "#000", avatarInitial: "B", timestamp: "6m", body: "Vellum Valuation Marked to $112M Post on Latest Secondary", retweets: 388, likes: 1812, replies: 92 },
  { id: "f14", source: "twitter", name: "SoftwareEng Memes", handle: "@SoftwareEng_Memes", verified: false, avatarColor: "#794bc4", avatarInitial: "S", timestamp: "7m", body: "they're STILL not rotating it. its been 47 minutes.", retweets: 891, likes: 8200, replies: 144 },
  { id: "f15", source: "forbes", name: "Forbes", publication: "Forbes", verified: "gold", avatarColor: "#000", avatarInitial: "F", timestamp: "8m", body: "30 Under 30 alum Riya Chen says Vellum 'shipping faster than the discourse'", retweets: 612, likes: 3100, replies: 188 },
  { id: "f16", source: "slack", channel: "#leadership", timestamp: "9m", body: "we are not going to 'rotate and apologize.' that signals weakness to the round. counter-narrative is: this is a feature of velocity culture." },
  { id: "f17", source: "twitter", name: "Layoff Anon", handle: "@layoff_anon", verified: false, avatarColor: "#a02b2b", avatarInitial: "L", timestamp: "10m", body: "what they don't tell you: the auth bypass was on purpose. it was the demo.", retweets: 2400, likes: 11200, replies: 388 },
  { id: "f18", source: "glassdoor", rating: 1, timestamp: "11m", body: "Cons: 'velocity culture' is a euphemism. They will name a Slack channel after your departure." },
  { id: "f19", source: "twitter", name: "Founder Brain", handle: "@founder_brain", verified: true, avatarColor: "#0a8a00", avatarInitial: "F", timestamp: "12m", body: "the dunk-tweet IS the apology. you'll see.", retweets: 71, likes: 480, replies: 12 },
  { id: "f20", source: "techcrunch", name: "TechCrunch", publication: "TechCrunch", verified: "gold", avatarColor: "#0a8a00", avatarInitial: "T", timestamp: "14m", body: "Tiger Global's Vellum stake said to have been marked down internally last quarter", retweets: 880, likes: 4400, replies: 311 },
  { id: "f21", source: "twitter", name: "Startup Dunk", handle: "@startup_dunk", verified: false, avatarColor: "#1d9bf0", avatarInitial: "S", timestamp: "15m", body: "$14M seed round. $14M.", retweets: 412, likes: 2100, replies: 73 },
  { id: "f22", source: "slack", channel: "#exec", timestamp: "17m", body: "legal says we cannot say 'AI did it' on the all-hands. legal also says we cannot say 'no it didn't.' so. nothing." },
  { id: "f23", source: "twitter", name: "Riya Chen", handle: "@riya", verified: true, avatarColor: "#ff5a47", avatarInitial: "R", timestamp: "18m", body: "shipping a 0->1 product means owning 0->1 mistakes. we rotated. we're audited. we move.", retweets: 980, likes: 7300, replies: 211 },
  { id: "f24", source: "bloomberg", name: "Bloomberg", publication: "Bloomberg", verified: "gold", avatarColor: "#000", avatarInitial: "B", timestamp: "20m", body: "Vellum CFO Said To Be Reviewing Revenue Recognition With Outside Counsel", retweets: 612, likes: 2800, replies: 188 },
  { id: "f25", source: "glassdoor", rating: 3, timestamp: "22m", body: "Pros: the IC engineers are genuinely sharp. Cons: every promo cycle is a vibes test from a founder who doesn't read the docs." },
  { id: "f26", source: "twitter", name: "Marc Andreessen", handle: "@pmarca", verified: true, avatarColor: "#000", avatarInitial: "M", timestamp: "24m", body: "the press attacks the great because the press cannot build.", retweets: 3800, likes: 28100, replies: 1200 },
  { id: "f27", source: "twitter", name: "Casey Newton", handle: "@CaseyNewton", verified: true, avatarColor: "#5865f2", avatarInitial: "C", timestamp: "27m", body: "Vellum did not respond to a request for comment but did block me 4 minutes later. Noting it.", retweets: 612, likes: 9100, replies: 244 },
  { id: "f28", source: "slack", channel: "#random", timestamp: "29m", body: "the 'we take security seriously' statement has been in the drafts folder for 31 minutes. feels." },
  { id: "f29", source: "forbes", name: "Forbes", publication: "Forbes", verified: "gold", avatarColor: "#000", avatarInitial: "F", timestamp: "33m", body: "Vellum's Riya Chen on 'velocity culture' and the future of agentic procurement", retweets: 388, likes: 1900, replies: 92 },
  { id: "f30", source: "twitter", name: "SoftwareEng Memes", handle: "@SoftwareEng_Memes", verified: false, avatarColor: "#794bc4", avatarInitial: "S", timestamp: "36m", body: "ok the key has been rotated. the repo is now private. the screenshot lives forever.", retweets: 5102, likes: 31900, replies: 880 },
];
