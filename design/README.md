# Handoff: 30u30 Simulator

## Overview

The **30u30 Simulator** is a satirical, meme-coded web product. The user uploads their startup; an LLM agent then "runs" the company and visibly implodes it on stage — making increasingly unhinged decisions, getting ratio'd on a fake Twitter feed, attracting FBI attention, and eventually producing a shareable cursed-Forbes "trading card" of the run. The product is a watch-and-share artifact more than a game.

This handoff covers three surfaces:

1. **Landing / Onboarding** — 4 framings of the founder upload flow (one-screen, ~30 seconds to start).
2. **Main Cockpit (desktop)** — the 4-panel cockpit where the run plays out.
3. **Decision Moment** — the inline 15–30 second engagement loop where an event materializes, the agent "thinks" out loud, and the user predicts what it will pick.

Mobile and additional cockpit/decision variants were explored and removed; the chosen direction is the one captured in these files.

---

## About the Design Files

The files in this bundle are **design references created in HTML/JSX** — wireframe-fidelity prototypes showing intended structure, layout, copy tone, and the moment-to-moment behavior of the product. They are **not production code to copy verbatim**.

The goal of the implementing developer is to **recreate these wireframes inside the target codebase's existing environment** (React, Next.js, Vue, whatever exists), using its established patterns, component libraries, state management, and routing. If no codebase exists yet, the most appropriate framework should be chosen for an LLM-streaming product (Next.js + React + a server runtime that supports streaming responses is a good default).

The wireframes use a custom `<DesignCanvas>` host (pan/zoom + artboards) plus a `<TweaksPanel>` for live variant toggles — **neither belongs in the production app**. They exist purely to present multiple options side-by-side in the design phase. Strip them out; ship the artboard contents.

---

## Fidelity

**Low-fidelity wireframes.**

These mocks lock in:

- Information architecture — what panels exist, where they sit, what flows through them.
- Copy tone — the agent's "twitter-poisoned founder" voice, the feed's snark cadence, the Bloomberg-style data labels.
- The decision-moment **interaction sequence** (event → agent reaction → choices → prediction → commit → consequences).
- The dark, terminal-density visual register (warm-black background, off-white "ink", red alarm accent, typewriter-style typography).

These mocks **do not** lock in:

- Final brand palette beyond the warm-black + off-white + alarm-red triad.
- Final type system. The wireframes use Special Elite (typewriter) and JetBrains Mono (data) as a holding pattern; production may want a tighter pairing.
- Pixel-precise spacing, micro-interactions, motion design, sound design.
- Any production component-library styling — apply the codebase's design system on top of this structure.

Treat the wireframes as the spec for **what** to build and **how it behaves**, and apply the codebase's design system for **how it looks finished**.

---

## Visual Language (across all surfaces)

A consistent dark "Bloomberg-meets-typewriter" register. Density is on-brand — it makes the absurdity funnier.

### Color tokens

| Token | Value | Use |
|---|---|---|
| `--paper` | `#15130f` | Page / panel background (warm near-black) |
| `--paper-2` | `#1f1c17` | Slightly raised surface (tweet hover, avatar bg) |
| `--ink` | `#f1ede4` | Primary text, borders, rules (off-white, warm) |
| `--ink-2` | `#cfc8b8` | Secondary text |
| `--soft` | `#7a7363` | Tertiary / metadata text (timestamps, labels) |
| `--alarm` | `#ff5a47` | Alarm / negative state — burn rate, FBI awareness, red pills, stamps |
| `--alarm-soft` | `#3a1410` | Alarm fill backgrounds |

The Twitter feed panel is **pure black `#000`** with Twitter-correct grays (`#71767b` muted, `#1d9bf0` blue, `#e7e9ea` text) — this is intentional; it reads as an embedded X timeline, not as part of the app chrome.

### Typography

- **Body / UI / agent stream / event copy** — `Special Elite` (Google Fonts), fallback `Courier Prime`, `Courier New`, monospace. Typewriter feel.
- **Data, pills, tags, timestamps, the Bloomberg strip** — `JetBrains Mono` 400/500/700.
- **Twitter feed (right rail) only** — `Helvetica Neue, Helvetica, Segoe UI, system-ui` (matches X's chrome).
- The decision-moment frame (Decision A · Inline) is rendered fully in `JetBrains Mono` — it should feel like a terminal/log readout.

Sizes in the wireframes are wireframe-rough (11–14px body, 10–11px metadata). Production should re-derive these against the chosen design system, but **keep density high**. No oversized hero text in the cockpit.

### Borders, rules, shapes

- 1.4–1.6px solid borders in `--ink` are the default panel boundary.
- Dashed rules (`1px dashed var(--ink)`) separate items inside a panel (feed items, timeline entries).
- Pills: `border:1.4px solid var(--ink); border-radius:999px; padding:1px 8px; font-family:JetBrains Mono; text-transform:uppercase; font-size:11px; letter-spacing:.04em`. Solid variant inverts (ink bg, paper text). Red variant uses alarm color.
- "Stamps" (e.g. the AUTO-PAUSED / WELLS NOTICE marks): 2px alarm border, alarm color text, JetBrains Mono 700, uppercase, slight rotation (`-3deg` to `8deg`).
- No drop shadows. No gradients. Density and contrast carry the hierarchy.

---

## Screens

### ① Landing / Onboarding

Single screen. Goal: get the user from page load to "Start" in **under 30 seconds**. The user provides company name, one-line description, an industry tag, and a "founder vibe" — that's it.

Four explored framings (`LandingA`–`D` in `wf-landing.jsx`). The directional pick is the **Tabloid Hero (A)**, but B/C/D are kept in the file as reference for tone and alternative compositions if the chosen direction needs revisiting.

Common to all four:

- Top bar: small `FORBES · 30u30 SIMULATOR` wordmark left, `about` / `leaderboard` pills right.
- Headline / pitch: 1–2 lines, sets the satirical tone ("Watch an AI commit fraud in real time as your startup. Upload your company. Avg run: 18 min. Avg ending: prison.").
- Onboarding form: 3–4 inputs total.
  - **Company name** (text input)
  - **One-line description** (text input — fed to the LLM as event-personalization context)
  - **Industry tag** (chip pick — SaaS / AI / Fintech / Bio / +)
  - **Founder vibe** (chip pick — Stanford Dropout / Ex-McKinsey / Crypto Refugee / Nepo Baby / Believer / 2× Founder). Affects starting stats and event flavor weighting.
- Primary CTA: a single big `START RUN` (or equivalent) button.
- Secondary CTA: "demo run" path that generates a Markov-style fake startup name (e.g. `Substrate.ai`, `Vellum Labs`, `Paragon Protocol`) so the user can taste the product before committing their own company.

**Variant A — Tabloid Hero** (the pick): Bold headline with a hand-underlined word ("commit fraud"), the form sitting in a thick-bordered box below, an angled annotation pointing at it ("30 sec to start ↴"). Reads as a magazine pull-quote.

**Variant B — Terminal Boot**: Boot-sequence text ("[ booting agent... ]", "[ ethics module: skipped ]") with the form rendered as field prompts. Most "in-world" framing.

**Variant C — Founder Card**: The form is laid out as a press-pass / ID badge being filled out. Photo placeholder, fields, signature line.

**Variant D — Magazine Cover**: Forbes-cursed cover composition with the form as a coverline tease. Most editorial.

Implementation notes:

- Validation is light. Company name required, description required, industry and vibe each have a default selection. No multi-step wizard — everything visible at once.
- The `START` action needs to capture `{name, description, industry, founderVibe}` and pass it to the run-orchestration layer as the LLM's seed context.
- The demo path should generate a believable fake name client-side (Markov chain over a wordlist is fine) and skip directly into the cockpit.

---

### ② Main Cockpit (desktop) — 4-panel classic

This is **the** product screen. The chosen layout is `CockpitA` in `wf-cockpit.jsx`. Roughly 880×600 in the wireframe but the production layout should fluid-fill the viewport with sensible min-widths.

```
┌────────────────────────────────────────────────────────────┐
│  [ TOP STRIP — Bloomberg data ribbon ]                     │
├──────────┬──────────────────────────────┬──────────────────┤
│          │                              │                  │
│  LEFT    │         CENTER STAGE          │   RIGHT RAIL    │
│  RAIL    │     (agent reasoning +        │   (live feed —  │
│  (run    │      decision moments)        │   X-style)      │
│  timeline│                              │                  │
│          │                              │                  │
├──────────┴──────────────────────────────┴──────────────────┤
│  [ BOTTOM STRIP — speed controls + prediction layer ]      │
└────────────────────────────────────────────────────────────┘
```

#### Top strip — persistent data dashboard

A tight horizontal Bloomberg-style ribbon. Cells separated by 1.2px ink rules. Each cell: 9px uppercase mono label on top, 11px mono value below. **Pick 6–8 stats max.**

Fields shown in the wireframe: `Day · Valuation · Revenue · Burn / mo · Runway · Headcount · FBI Aware.` The last three are usually negative-state and render in `--alarm`.

Behavior:
- Numeric values tick visibly when they change (rolling-digit ticker, ~250ms ease-out).
- A brief color flash on big swings (>10% delta) — flash to alarm-red on negative, no flash on positive (good news is quieter).
- Direction glyphs (`▲`, `▲▲`, `▼`) appended to values that just moved.
- Updates can fire from any source: agent decision consequences, mini-events, scheduled tickers (burn accrues every simulated hour).

#### Left rail — run timeline

A vertical scroll of every event and decision in chronological order. Each row: a dot (default outline / solid for committed decisions / alarm for crises) + a timestamp + an event title. Mini-events (atmospheric, non-interactive — "Agent signed lease on 12,000 sq ft office") sit alongside major decisions.

Behavior:
- Auto-scrolls to bottom as new entries arrive.
- Click a row to jump the center panel back to that decision (read-only review — does not branch the simulation).
- This is the screenshot surface for "wait, when did things go off the rails."

#### Center stage — agent reasoning stream

The hero region. Two modes:

**Idle mode**: the agent's chain-of-thought streams in token-by-token in a chat/speech-bubble frame. This is the LLM streaming — **lean into it as a feature, not a load state**. Even slow generation feels alive when the user can watch it think.

**Decision mode**: an event card slides in over the stream (see [Decision Moment](#-decision-moment) below), the agent "reads" it, and deliberation streams beneath.

**Consequence mode**: numbers in the top strip animate, the right rail erupts with reactions, and the agent issues a one-line justification ("see, easy"). After a brief hold, returns to idle.

Typography: `Special Elite` for the agent's voice; `JetBrains Mono` for any structured event metadata.

#### Right rail — live feed

A simulated **X / Twitter** timeline. Pure black background `#000`, Helvetica family, real X visual cues:

- Tabs at top: `For You` (active) · `Following` · `Press` · `FBI 🔒` (locked until late game).
- Tweet rows: 32px circular avatar (color + initial letter), name + verified glyph (gold for "press" accounts, blue for users) + handle + relative timestamp on one line, body below, action row (`💬 ↻ ♥ ↗`) with counts.
- Verified glyphs: blue `✓` for normal, gold for press/Forbes/TechCrunch.
- Items dropped at the top with a fade-in; older items push down.
- Categories of content (drives population logic):
  - Fake tweets with avatars (anon VCs, journalist accounts, parody SEC, etc.)
  - TechCrunch / Forbes-style headlines
  - Slack messages from "employees"
  - Glassdoor reviews
  - FBI internal memos (later game only — the `FBI 🔒` tab unlocks once awareness crosses a threshold)
  - Discord / group-chat leaks

Behavior:
- Constantly populating — **never let this column go quiet**. Even between major events, low-stakes content drips in. This is the dead-air solution.
- Within ~2 seconds of any agent decision, the feed should react with quote-tweets / ratio'd replies / snarky journalist takes referencing the choice. This is where most of the rewatchable comedy lives.
- The reaction content is generated server-side from the decision context.

#### Bottom strip — controls + prediction layer

Speed: `1× · 2× · 4×` toggle, plus pause. Prominently placed — power users will chase specific endings at 4×.

Prediction layer: appears here when a decision is incoming. Renders the choice options as `pred-chip` pills (mono, uppercase, narrow) the user can tap to predict what the agent will pick. Single-click commit, **no confirmation dialog** — friction kills this loop. A small score readout sits in the corner (correct predictions / total).

#### Cockpit state machine

The cockpit cycles through states driven by the run engine. The wireframes show all three via the `tw.state` tweak (`idle` / `mid` / `consequence`). Apply the same pattern in production:

- `idle` — agent thinking-stream visible, no event card, prediction layer hidden, top strip ticking on background events only.
- `mid` (decision) — event card overlaid on center stage, agent reasoning inline below, choices visible, prediction chips active in the bottom strip with a 5–10 second timer ring.
- `consequence` — event card dismisses, top strip animates to new values, right rail erupts, agent commits one justifying line. A brief auto-pause (~1.5s) on dramatic outcomes (FBI raid, Forbes investigation, Big-4 auditor walkout) — these are the screenshot moments.

---

### ③ Decision Moment

The single most important UX pattern. Roughly 15–30 seconds at default speed. This is the unit of engagement — get this loop right and the rest is decoration.

Live frame: `DecisionA_Inline` in `wf-decision.jsx`. Rendered inline within the center-stage column of the cockpit (not as a modal). Production should keep this **inline**; modal hell kills momentum.

#### Frame structure

```
[ pill: REGULATORY EVENT ]    [ timestamp ]   [ pill: AUTO-PAUSED ]

╔═══════════════════════════════════╗
║  SEC WELLS NOTICE                 ║   ← event title
║  We have reason to believe you... ║   ← 2–3 sentence situation
╚═══════════════════════════════════╝

agent ›  ok this is actually a huge opportunity 🧵    ← streams in
agent ›  the SEC is the real fraud, respectfully

CHOICES                                            ← chips appear as
  [ ] Cooperate fully and lawyer up                  agent considers them
  [●] Tweet through it                               ← agent's hidden
  [ ] Restructure as a DAO and flee jurisdiction        reasoning streams
                                                        alongside, dismissing
PREDICT  →  what will the agent pick?  ⏱ 0:07          / favoring options
  [ A · cooperate ]   [ B · tweet ]   [ C · DAO ]
```

#### Sequence (the hero moment for every decision)

1. **Event materializes** in the agent stream. Typewriter or fade-in. Stamped with a category tag (e.g. `FUNDRAISING`, `REGULATORY`, `PRESS`), an event title, and the situation in 2–3 sentences. A subtle sound cue plays (see Sound section).
2. **Agent reads and reacts.** Its first thought streams in below the event ("ok this is actually a huge opportunity 🧵"). The user can already laugh here — this is the comedy beat that earns the prediction.
3. **Choices appear progressively** as the agent considers them. The agent's hidden reasoning streams alongside, audibly dismissing the boring option ("nah way too cucked") and seriously considering the unhinged one ("ok hear me out"). **This is the prediction window.**
4. **User predicts** which choice the agent will make — chip click in the bottom strip, 5–10 second timer ring, single-click commit, no confirm.
5. **Agent commits.** A small "decision confirmed" beat, the chosen choice highlights, agent gives one more justifying line.
6. **Consequences ripple.** Top strip numbers animate, right rail erupts, sometimes a follow-up flash event triggers immediately ("BREAKING: TechCrunch has questions").

The whole sequence is 15–30 seconds at 1×.

#### Implementation notes for the decision frame

- The decision frame's typography is **all `JetBrains Mono`** (terminal-log feel) — distinct from the rest of the cockpit which uses Special Elite. This is intentional and noted on the inline comment in the wireframe.
- The "auto-paused" stamp in the corner appears on dramatic events (Wells notice, FBI raid, Forbes investigation drops). Lower-stakes events skip the auto-pause and run at 1×.
- Prediction chips render in the **bottom strip**, not in the decision frame itself — this keeps the agent's reasoning visually uncluttered and the prediction action thumb-reachable on touch displays.
- The agent's own thinking on each choice should stream as **dimmed inline text next to each chip** ("nah", "ok hear me out", "this is the move actually"). Don't hide the reasoning — that's the joke.
- The 5–10s prediction timer is an animated stroke around the chip group, not a numeric countdown digit. Numeric countdowns feel like a quiz.

#### Agent voice (twitter-poisoned founder, mid-spicy)

The agent's persona has to be tight: cocky, twitter-poisoned, insists every fraudulent choice is actually "first-principles thinking." If the writing is mid, the design can't save it. Examples of the locked tone (mid-spice):

- *"ok hear me out — what if we tweet through it 🧵"*
- *"nah way too cucked"*
- *"first principles say: yes"*
- *"the SEC is the real fraud, respectfully"*

The voice should be consistent across every event. A mild and an unhinged variant exist (see Tweaks panel in wireframe) but are not the default.

---

## Interactions & Behavior

### Pacing & dead-air mitigation

The biggest UX risk is dead air. The LLM takes time to generate; even at 4× there will be stretches where nothing big is happening. Solutions, all baked into the design:

- **Always something moving.** The right rail constantly populates with low-stakes content. The top strip's burn-rate counter ticks every simulated hour. Background activity prevents the screen from ever feeling static.
- **Mini-events.** Between major decisions, the agent makes small "off-screen" decisions that just happen and appear in the timeline ("Agent signed lease on 12,000 sq ft office. Burn +$80k/mo."). These are atmospheric, not interactive. They keep momentum and feed the rail with copy.
- **Streaming is the feature.** Show the chain-of-thought streaming token-by-token. Resist the urge to wait for full responses before rendering.
- **Speed control prominence.** A run from "Series A" to "FBI raid" should run 15–25 minutes at 1×. Build the speed control where the user can find it without scanning.
- **Auto-pause on major moments.** When something legitimately dramatic happens (FBI raid, Forbes investigation drops), pause briefly with the auto-paused stamp. These are screenshot moments.

### Animation & motion

- Number tickers on the top strip: rolling digit, ~250ms, `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Color flash on big negative deltas: 1 frame to alarm, 600ms ease back.
- Event card materialize: 200ms fade + tiny vertical drop (8–12px).
- Agent typing: render tokens as they arrive — no fake typewriter delay; the real LLM cadence is the right cadence.
- Right rail item insert: 180ms fade-in at top, the list below it shifts down.
- Decision frame dismiss: 250ms fade out.

No bounces, no springs, no parallax. Restrained motion preserves the "serious financial professional" energy.

### Sound

Default **off**. Make muting one click. When on:

- Subtle Bloomberg-terminal hum / keyboard tick as ambient.
- Short cash-register chime when revenue hits a milestone.
- Sickly low note when FBI awareness ticks up.
- Dedicated stinger for the FBI-raid endgame (sirens, but tasteful).
- The agent's thoughts do **not** need a voice — text streaming is correct.
- **Do not** add a generic "lo-fi beats to commit fraud to" loop.

### Loading / error / empty states

- **Cockpit boot**: agent's first message streams in immediately on first load using the user's submitted company name and description as context. No splash screen.
- **LLM stall (>5s with no token)**: the agent stream renders a `…` pulse. The right rail keeps populating from its own queue (don't block on the agent).
- **LLM error**: surface as an in-character event (`SYSTEM EVENT · agent went silent. legal team confiscated phone.`). Don't break the fourth wall.
- **End of run**: the simulation stops at a defined ending (FBI raid, IPO, John-Oliver-feature, voluntary exit, etc.). Cockpit dims; a "view shareable card" CTA replaces the bottom strip.

### Responsive behavior

The cockpit is desktop-first (≥1100px). Below that, the chosen approach is **out of scope for this handoff** (mobile collapsed layouts were explored and de-scoped). Recommend handling mobile in a separate design pass once desktop ships. A holding strategy: collapse to a single column with the agent stream as the focal element and the feed/timeline as dismissible drawers.

---

## State Management

Suggested store shape (framework-agnostic — adapt to whatever the codebase uses):

```ts
type RunState = {
  // top strip
  day: number;
  valuation: number;       // dollars
  revenue: number;         // dollars / month
  burnPerMonth: number;    // dollars / month
  runwayMonths: number;    // derived
  headcount: number;
  fbiAwareness: number;    // 0–100
  // identity
  company: { name: string; description: string; industry: Industry; founderVibe: Vibe };
  // simulation
  speed: 1 | 2 | 4;
  paused: boolean;
  cockpitState: 'idle' | 'mid_decision' | 'consequence';
  // streams
  agentStream: AgentToken[];           // append-only, streamed from LLM
  timeline: TimelineEntry[];           // append-only
  feed: FeedItem[];                    // bounded ring (~200), most recent first
  // decision in flight
  currentDecision?: {
    id: string;
    category: 'FUNDRAISING' | 'REGULATORY' | 'PRESS' | 'OPS' | 'PRODUCT' | 'LEGAL';
    title: string;
    situation: string;
    choices: Choice[];                 // each with hidden agentReasoning string
    userPrediction?: string;           // chip id
    predictionDeadline: number;        // ms epoch
    autoPaused: boolean;
  };
  // scoring
  predictionScore: { correct: number; total: number };
  // ending
  ending?: EndingType;
};
```

Critical state transitions:

- `idle → mid_decision` when an event is dispatched. The right rail does **not** clear.
- `mid_decision → consequence` when the agent commits (LLM emits a final-choice token). Top-strip diff animates here.
- `consequence → idle` after the consequence beat completes (~1.5s + however long the rail eruption needs).

Streaming concerns:

- The agent's chain-of-thought is the LLM's streamed response — render tokens as they arrive. Use Server-Sent Events or fetch streaming.
- Feed reactions are generated server-side from the decision context and dripped into the rail with realistic-feeling timestamps.
- The top strip's deltas are computed server-side too (as part of the consequence payload) so the client doesn't have to reason about game balance.

---

## Design Tokens (consolidated)

Colors:

```css
--paper:      #15130f;
--paper-2:    #1f1c17;
--ink:        #f1ede4;
--ink-2:      #cfc8b8;
--soft:       #7a7363;
--alarm:      #ff5a47;
--alarm-soft: #3a1410;
/* Twitter feed only */
--x-bg:       #000;
--x-text:     #e7e9ea;
--x-muted:    #71767b;
--x-blue:     #1d9bf0;
--x-rule:     #2f3336;
```

Typography:

```css
--font-body:   'Special Elite', 'Courier Prime', 'Courier New', monospace;
--font-mono:   'JetBrains Mono', ui-monospace, monospace;
--font-x:      'Helvetica Neue', 'Helvetica', 'Segoe UI', system-ui, sans-serif;
```

Spacing: no formal scale yet — wireframes use ad-hoc 4 / 6 / 8 / 10 / 12 / 18 px paddings. Production should adopt a 4px-baseline scale (`4 8 12 16 20 24 32 48`).

Borders: 1.2px (subdivisions), 1.4px (default), 1.6px (emphasis), 2px (stamps). Always solid `--ink` unless it's an alarm element.

Border radius: `0` for almost everything; `999px` for pills only. Cards do not have rounded corners.

Shadows: none.

---

## Assets

No raster images, icons, or proprietary assets are used. Everything in the wireframes is composed from:

- Text glyphs (`▲`, `▼`, `✓`, `🧵`, `🔒`, `💬`, `↻`, `♥`, `↗`).
- CSS borders, repeating-linear-gradient hatches, and basic shape primitives.
- Two web fonts loaded from Google Fonts: `Special Elite`, `JetBrains Mono`.

Production should:

- Replace text glyphs with the codebase's icon library (Lucide, Heroicons, etc.) where appropriate. Keep the X-style action row's `💬 ↻ ♥ ↗` as glyphs or X-flavored icons; do not swap for a generic icon set there.
- Procure or commission a small wordmark for `FORBES · 30u30 SIMULATOR` (the wireframe uses a styled type-only treatment; final brand may want a lockup). Do not use Forbes' actual brand assets — it is a satire and must read as a parody.

---

## Files in This Bundle

| File | Role |
|---|---|
| `wireframes.html` | Top-level HTML host. Loads React + Babel, all JSX modules, and renders the design canvas. Open in a browser to see the wireframes side-by-side. |
| `wf-app.jsx` | Top-level React app. Composes the design canvas and the live tweaks panel. Lists all artboards. |
| `wf-landing.jsx` | The 4 landing-page variants (`LandingA_Tabloid`, `LandingB_Terminal`, `LandingC_Card`, `LandingD_Magazine`). |
| `wf-cockpit.jsx` | The cockpit. The shipping variant is `CockpitA`; supporting components include `StripA` (top data ribbon), `TwitterFeed` (right rail), and timeline / control primitives. |
| `wf-decision.jsx` | The decision-moment frame (`DecisionA_Inline`). |
| `design-canvas.jsx` | **Tooling only.** Pan/zoom canvas + artboards. Strip out — do not ship. |
| `tweaks-panel.jsx` | **Tooling only.** Live variant toggles for the design review. Strip out — do not ship. |

To preview: serve the folder with any static server and open `wireframes.html` in a browser (the HTML loads its sibling JSX files, so it must be served, not opened via `file://`).

---

## Things to Avoid (from the original brief)

- **Overdesigning the meta-shell.** No parallax homepage, no 3D hero. Landing is one screen, big start button.
- **Too many stats on the dashboard.** 6–8 max. Hide the rest behind a details toggle.
- **Modal hell.** Every event a modal kills momentum. Inline everything you can. The decision frame is inline; auto-pauses are a stamp + dim, not a takeover.
- **Inconsistent agent voice.** This is a writing problem disguised as a design problem and it's the highest-leverage thing in the product. The agent's persona has to be tight: cocky, twitter-poisoned, insists every fraudulent choice is "first-principles thinking."
- **Building a real game.** No resource management, skill trees, upgrade paths. Resist.
- **Generic lo-fi music loops.** Don't.

## Reference Stack (anchors, not blueprints)

- **Universal Paperclips** — the watching-numbers-go-up loop, gradual escalation, long-session text-driven engagement.
- **Reigns** — the swipe-decision loop. The 30u30 cockpit should be denser than this.
- **Bloomberg Terminal** — visual density and "I'm a serious financial professional" energy.
- **A Dark Room** — text-driven progression, atmospheric pacing.
- **The Founder (Francis Tseng, 2017)** — closest direct analog. Worth playing for an afternoon.
