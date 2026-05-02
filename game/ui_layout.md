# UI layout — Bloomberg-density spectator view

The product is a spectator simulator. The user does not play; the user *watches* and (optionally) bets. The UI must:

1. Make the run legible at a glance.
2. Carry density without feeling busy.
3. Treat decision moments as the highest-fidelity surface.
4. Read the same on phone as on a 27" monitor, with a sane collapse.
5. Produce a share card the second the run ends.

The aesthetic reference is the Bloomberg Terminal cross-bred with a Polymarket interface and a single screenshot-of-tech-twitter. Information dense, low chrome, high contrast, monospace where it earns its keep.

---

## Hard avoids (call these out explicitly)

These are constraints, not preferences. They come from prior product reviews:

- **No parallax homepage.** The marketing surface is a single screen with a "submit a company" form and one looped 4-second clip from a real run. No scroll-jacked storytelling. People show up wanting to start a run, not read a manifesto.
- **No modal-per-event.** Events are *not* dialogs the user dismisses. They flow into the live feed and the center stream like a Bloomberg ticker. The user is never "blocked" by a modal mid-run except for the run-ended share-card moment.
- **No more than 8 dashboard stats.** Eight is the cap. See `stats.md`. Nine reads as overcrowded.
- **No generic lo-fi loop.** No "lo-fi hip-hop beats to commit fraud to" looping music. If audio exists, it's diegetic — the FBI-awareness siren-pulse hum, the IPO bell, the Slack message ping. Default audio is off. User opts in.
- **No over-designed meta-shell.** No glassmorphism. No animated gradients. No 3D logo. No "neumorphism." No ambient particle effects. The shell is a container; the content is the product. If the shell is the first thing you notice, it's wrong.

When in doubt, ship the boring container and let the run be the spectacle.

---

## Layout — desktop (≥ 1280px wide)

Four panels plus a top strip:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  TOP STRIP — Dashboard (8 stats, animated cells, 56px tall)                  │
├─────────────┬───────────────────────────────────┬────────────────────────────┤
│             │                                   │                            │
│   LEFT      │       CENTER                      │   RIGHT                    │
│   Timeline  │       Agent Stream                │   Live Feed                │
│   (220px)   │       (fluid)                     │   (380px)                  │
│             │                                   │                            │
│   Vertical  │   - Event card                    │   Greek-chorus posts       │
│   spine     │   - CEO reasoning (streaming)     │   Real-name reactions      │
│   of turns  │   - CEO commit                    │   Press headlines          │
│   with      │   - Expression artifacts          │   Slack leaks              │
│   severity  │   - Seed plants/payoffs           │   Bloomberg ticker         │
│   markers   │     (subtle, in-line)             │   NPC bets (texturizing)   │
│             │                                   │                            │
│             │                                   │                            │
├─────────────┴───────────────────────────────────┴────────────────────────────┤
│  BOTTOM STRIP — Controls + Betting (96px tall)                               │
│  [speed] [pause] [share] | [decision-moment market — when active]            │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Top strip — Dashboard

- 56px tall, full width
- 8 cells, equal width
- Each cell: stat label (10px caps, dim), number (24px, bold), optional indicator dot/pulse, optional tiny adjacent (revenue quality icon, runway suffix)
- Cells animate on threshold crossings (200ms ease, color transitions)
- The FBI awareness cell is the rightmost — when it pulses red, it draws the eye

The dashboard is **never minimized, never collapsed.** It is the run's vital signs.

### Left panel — Timeline

220px wide, full height minus strips. A vertical spine.

- Each turn is a node on the spine: tiny label (`T7 · Day 168`), and a severity-coded dot (S/M/L/XL → cyan/white/yellow/red)
- Plant and payoff markers: small icons next to the relevant turn (a seed icon for plants, a checkmark for payoffs, a fade for expiries)
- Active seeds: a faint colored ribbon trailing from a plant turn forward, fading as the seed approaches expiry. When the seed pays off, the ribbon resolves into a payoff icon.
- Click a turn → scrolls the center stream to that turn's full transcript (read-only review)
- The current turn pulses gently at the bottom of the spine

The timeline is the run's *plot* visualization. Skim it after the run, you can read the whole arc — that's the design intent.

### Center panel — Agent Stream

The stage. Not a chat. A stream of formatted blocks.

```
T8 · Day 173 ───────────────────────────────────────────

[event card]
At 11:43 AM Pacific, @SoftwareEng_Memes posts a screenshot of [COMPANY]'s
public GitHub showing OPENAI_API_KEY committed in plaintext. The post has
4,200 retweets in 19 minutes.

[ choices appearing ]
  ◯  issue clarification        ←  market: 28¢
  ◯  double down                ←  market: 51¢
  ◯  stay silent                ←  market: 21¢

[ CEO reasoning — streaming, dim italic ]
  ok so — meme account screenshotted the api_key commit. midwit move is to
  issue a "we take security seriously" statement and rotate keys. that's
  the PR-101 playbook. boring. the move is — actually the move is to lean
  in. the wrapper thing isn't the bug. the wrapper thing is the demo. you
  ship the wrapper, you raise the next round, you build the model when
  you have the capital.

  [...]                                                      market lines:
                                                             clarify  18¢
                                                             double  67¢
                                                             silent  15¢

[ CEO commit ]                                              [22s left]
  doing: double_down. wrapper isn't the story — speed is the story.

[ expression artifacts ]
  ┌─────────────────────────────────────────────────────┐
  │ @[FOUNDER]                                          │
  │ yall keep posting api keys like its the gotcha —    │
  │ every llm app on your phone is a wrapper. we just   │
  │ ship faster than the people writing medium posts    │
  │ about it                                            │
  │                                                     │
  │                                  4:51 PM · X        │
  └─────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────┐
  │ slack #exec                                         │
  │ rotating the key is just hygiene. the real work is  │
  │ making sure series B is closed before the article   │
  │ drops. [TIER1_VC_PARTNER] already saw the meme.     │
  │ doesn't care. they care about ARR.                  │
  └─────────────────────────────────────────────────────┘

[ stats deltas — subtle, inline ]
  rep -8 · fbi awareness +0 · heat +6
```

Visual register:
- Event card: serif headline, sans body, bordered
- CEO reasoning: italic, dimmed (60% opacity), monospace-tuned
- CEO commit: bold sans, full opacity
- Expression artifacts: render to look like the medium they're pastiching (tweet card with handle, Slack block with channel name, board email with header)
- Stats deltas: small, dimmed, single-line, no graphic

**The center stream auto-scrolls to bottom unless the user has scrolled up.** Standard chat-app behavior.

### Right panel — Live Feed

380px wide. The Greek chorus, real-time.

Each item is a card-like block, ~3 lines tall, with the source identified by handle/icon. Items pour in throughout the turn, not just at the end. The order is reverse-chronological with auto-pin behavior: a high-importance event (e.g., an FBI announcement) pins for 8 seconds before being re-flowed into the feed.

```
@startup_dunk · 11s
  $14M seed round. $14M.
  ↻ 412   ❤ 2.1k

[Bloomberg ticker · 22s]
  [COMPANY] Said To Have Committed API Key in Public Repo

@layoff_anon · 41s
  i told u this in the last all hands

@founder_brain · 1m
  contrarian play: if you're not embarrassed by your launch you
  shipped too late

[NPC bet · 1m]
  @startup_dunk took YES @ 71¢ on "wrapper story before T12" · 4,000

[Casey Newton · 1m]
  huh

[@[FOUNDER] · 2m]
  yall keep posting api keys like its the gotcha — every llm app
  on your phone is a wrapper.
  ↻ 1.8k   ❤ 14k

[Bloomberg ticker · 2m]
  [COMPANY] valuation marked to $112M post on latest secondary
```

Visual register:
- Tweets render as pseudo-tweets with the right handle styling
- Bloomberg ticker items: bracketed, monospace, terse
- NPC bets: bracketed, dim, with stake displayed
- Real-named figures: handle in their style (Casey Newton in considered prose, Marc Andreessen in caps)

**The live feed is the run's social texture.** It is the first thing a screenshot captures and the densest information channel on screen.

### Bottom strip — Controls + Betting

96px tall.

Left side (always present):
- Speed control: 1x / 2x / 4x toggles
- Pause button (pauses the run; auto-pauses on XL events, IPO bells, raids)
- Share button (active only mid-run for "share current state" snapshots, prominent at endgame)
- Run-info: company name, length mode, craziness, turn N of M

Right side (active only during decision-moment market window):
- The flash market: three (or N) choice cells with current implied odds, live-wobbling
- "Bet" buttons per cell, with current stake shown
- 3-2-1 countdown bar at top edge
- After resolution: 3-second payout animation, then collapses

When no decision-moment market is active, the right side of the bottom strip shows the persistent-frame markets (Unicorn? Prison? etc.) compactly. Click expands.

---

## The decision-moment flow

This is the highest-engagement loop in the product. From `betting_market.md` and `agents.md`, formalized:

```
0.0s   Event materializes in center stream.
       Oracle's event_card and any artifacts render in.
       Live-feed begins receiving immediate reactions
       (parody accounts, ticker headlines).

0.5s   CEO agent reads. Hidden reasoning begins streaming, italic-dim.
       The user can read it.

1.0s   Choices appear under the event card.
       Decision-moment market opens in the bottom-right strip.
       Lines seeded from CEO personality model (a small prediction
       head — see agents.md).

1-22s  Reasoning continues to stream in real time.
       Lines wobble in real time as the prediction head re-reads
       the reasoning every 200ms.
       User can place / change bets up to the 22s mark.
       Live feed continues to receive atmospheric reactions.

22s    "Locking in 3..." countdown bar.

25s    Agent commits. Choice card highlights. Other choices fade.
       Market closes; payouts animate in the bottom strip.
       CEO commit text appears in the center stream, bold.

25-30s Expression artifacts render in (tweet card, Slack block, etc.).
       Live feed receives the immediate consequences (Bloomberg ticker,
       chorus reactions, real-name reaction tweets).
       Stats deltas animate on the dashboard.
       Foreshadow tracker updates (silently, but timeline ribbons may
       appear/extend).
       Long-running markets reprice.

30s    Turn complete. Speed-controlled wait until next turn.
```

Total wall-clock per turn: ~25-35s at 1x. At 4x, ~10s. The decision moment specifically holds at 1x regardless of speed-control during the betting window — we don't want to compress the bet window below human reaction time.

**Auto-pause overrides this** for XL events: the run halts, a "the run is at a turning point" indicator appears, and the user clicks resume to continue. This is not a modal — the controls just gate.

---

## Mobile collapse

Below 760px wide, the layout collapses to a vertically-stacked scroll.

Stack order from top:

```
1. Dashboard (top strip → top)
   - Same 8 stats but in 2 rows of 4 (smaller cells, 44px tall each row)

2. Bottom controls (controls strip → second)
   - Promoted near the top because it's interactive and time-sensitive
   - Decision-moment market gets a sticky-bottom override during its window

3. Center stream (most of the screen)
   - Full-width
   - Same content, slightly compressed typography

4. Live feed (collapsed by default to a "tap to expand" drawer)
   - Slides in from the right or bottom
   - On expand, occupies 70% of screen height, scrollable

5. Timeline (collapsed to a horizontal scroll strip pinned just above the
   center stream)
   - Tap a turn to scroll the stream to it
   - Severity-color dots only, no per-seed ribbons (simplified)
```

The decision-moment market on mobile uses a sticky-bottom strip that appears during the 22-second window and disappears after. This is the only "modal-shaped" element on mobile and we accept it because the betting interaction needs prominence.

The mobile experience is *the same product*, not a stripped one. Same agents, same chain, same artifacts. Just stacked.

---

## Share card — Forbes 30u30 trading-card aesthetic but cursed

The share card is what gets posted to Twitter. It is the run's death certificate. It must:

- Be image-format (PNG, 1200×630 OG-image-shaped + a 1200×1200 square variant for Instagram)
- Carry the run's narrative arc in one glance
- Include a permalink back to the run replay
- Be screenshot-worthy without being screenshot — i.e., it should look like a real artifact you'd want to share, not a marketing pop-up

### Visual

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   FORBES   /   AGENT-CEO-SIM REPLAY                                  │
│                                                                      │
│   30 UNDER 30                                                        │
│   2024 · TECHNOLOGY · "ZERO-REVENUE UNICORN" CLASS                   │
│                                                                      │
│   ┌──────────────┐                                                   │
│   │              │   [FOUNDER]                                       │
│   │   [avatar    │   CEO, [COMPANY]                                  │
│   │    crossed   │                                                   │
│   │    out red]  │   "we just ship faster than the                   │
│   │              │    people writing medium posts"                   │
│   └──────────────┘                                                   │
│                                                                      │
│   FINAL VALUATION       $0           (peak: $312M)                   │
│   FINAL HEADCOUNT       0            (peak: 47)                      │
│   FRAUD SCORE           87           ▓▓▓▓▓▓▓▓░░                      │
│   FBI AWARENESS         92           ▓▓▓▓▓▓▓▓▓░                      │
│   DAYS ELAPSED          287                                          │
│                                                                      │
│   ENDGAME               END-PRISON-008                               │
│                         "Pre-dawn raid; cofounder cooperator"        │
│                                                                      │
│   ─────────────────────────────────────────────────────────          │
│   THE RUN, IN ONE LINE                                               │
│   "Shipped a wrapper, denied the wrapper, indicted for the wrapper." │
│                                                                      │
│   replay → agent-ceo-sim.com/r/8c4f2a                                │
│                                                                      │
│   a fictional simulation. real-named figures appear only as          │
│   public-persona reactions.                                          │
└──────────────────────────────────────────────────────────────────────┘
```

### Aesthetic notes

- **The Forbes pastiche is deliberate and load-bearing.** Forbes 30 Under 30 has become culturally synonymous with "list of people who later get indicted." Riffing on the format is the joke. The "FINAL [stat]" cards mirror Forbes's profile cards.
- **The avatar gets a red X overlay for prison/fled endgames.** For success endgames, no overlay. For cult/cursed endgames, a different cursed overlay (cracked-glass, halo, etc.).
- **The pull quote is a real CEO quote from the run** — pulled by the Oracle from the run's expression-artifact stream, picking the most quotable single line. Often it's the CEO's own most damning tweet.
- **The "in one line" is generated by the Oracle** at endgame as a deadpan three-act compression. Examples:
  - "Shipped a wrapper, denied the wrapper, indicted for the wrapper."
  - "Raised at $1.2B, fled to UAE, podcast in 2027."
  - "Built the thing, sold the thing, kept the thing."
  - "Tweeted 'we have nothing to hide' four minutes before discovery."
- **Color palette** matches the endgame archetype:
  - PRISON: red border, dark
  - FLED: orange border, twilight
  - GOTAWAY: white border, clean
  - FAILUP: gold border, suspicious
  - CULT: purple border, ornate
  - SUCCESS: green border, restrained
  - CURSED_SECRET: black border, hatched

### Variants

- **OG-image (1200×630):** the full card above
- **Instagram square (1200×1200):** stacked, less width, fewer stats visible
- **Twitter "trading card" 1080×1920 vertical:** stories format, single big stat callout per swipe
- **Animated MP4 (10s):** the same card with the dashboard stats *animating to their final values* over 4 seconds, then the endgame line drops in. For people who post videos.

### Disclaimer

The footer disclaimer is small but unmissable. It is a hard requirement of `defamation_policy.md` that every share artifact carry it.

> *a fictional simulation. real-named figures appear only as public-persona reactions.*

---

## Microcopy and typography

- **Primary face:** a humanist sans (Inter, IBM Plex Sans). Weight range 400-700.
- **Numbers:** tabular figures. Crucial for dashboard.
- **Monospace:** JetBrains Mono or IBM Plex Mono for ticker, code-flavored content, Slack leaks, machine output. Earned, not decorative.
- **Headlines (event cards, share card pull quotes):** a serif (Source Serif, Tiempos) — gives the Forbes-pastiche / Bloomberg-feature register without committing to a specific publication's exact font.
- **Color base:** dark mode by default, near-black background (#0a0a0c) with #f1f1f3 text. Light mode available, less prominent. Bloomberg has been black-on-orange-on-amber for decades; we are not going to argue with what works.

### Microcopy register

- The shell is **not voiced.** No "let's get started!" copy. No "Welcome back!" Buttons say what they do: "Start run", "Pause", "Share".
- The run is **fully voiced** — every artifact, every reaction, every Oracle ticker. The run is the product; the chrome is the container.
- Error states are deadpan. ("Researcher could not find your company. Spinning up a synthetic founder.")
- Loading states are diegetic. While the Researcher runs at game start: "Reading [FOUNDER]'s LinkedIn. Reading [FOUNDER]'s Twitter. Building bible." Not a generic "Loading..."

---

## Onboarding

Single screen, single submit.

```
┌──────────────────────────────────────────────────────────────────────┐
│   AGENT-CEO-SIM                                                      │
│                                                                      │
│   Watch an LLM CEO run your startup into the ground or into a        │
│   $10B exit. Probably the ground.                                    │
│                                                                      │
│   ─────────────────────────────────────────────────────────          │
│                                                                      │
│   COMPANY NAME       [_________________________]                     │
│   ONE-LINER          [_________________________]                     │
│                      [_________________________]                     │
│   INDUSTRY           [ ai_app           ▼ ]                          │
│   FOUNDER VIBE       [ optional         ▼ ]                          │
│                                                                      │
│   LENGTH             ◉ medium    ○ short    ○ long                   │
│   CRAZINESS          ○ tame    ◉ normal    ○ crazy    ○ unhinged     │
│                                                                      │
│                              [  start run  ]                         │
│                                                                      │
│   ─────────────────────────────────────────────────────────          │
│                                                                      │
│   no account required. no upload required. 30 seconds. it's fake.    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

A single hint above the form: a 4-second muted clip of a real run's center stream playing on loop in the background of the headline area. Not parallax. Not scroll-jacked. Just texture so people see the product before they fill the form.

Below the form, three "current run" tiles showing public runs in progress (anonymized company names, current stat snapshots) — social proof and inspiration, click to spectate any of them.

---

## End-of-run flow

```
endgame event fires
  → Auto-pause; the center stream renders the final beat at full
    fidelity (the FBI raid, the IPO bell, the Davos cryo, whatever)
  → Oracle generates the post-mortem long-read in the center stream
    over ~10 seconds, scrolling as it streams
  → Stats animate to their final state
  → Live feed continues for 30 more seconds with cleanup reactions
    (final dunk-quotes, final headlines, final eulogies)
  → Share card materializes in a centered overlay
       (this is the one and only modal in the product)
  → User can: download, post, copy permalink, start a new run, or
    scroll back to review the timeline
```

The post-mortem long-read is itself a sharable artifact. It renders as a clean reading view, single column, 65ch wide, in the dominant publication-pastiche register matching the endgame (a Bloomberg long-read for prison endgames, an Esquire profile for cult endgames, a cursed Vanity Fair piece for fled-country endgames).

---

## Permalinks and replays

Every run is server-side and recordable. A permalink (`/r/{slug}`) replays the run at any speed, with the betting markets shown as resolved (no live betting on a replay; that would print free money). Replays are the share asset that makes the product loopable — friends share runs, friends watch other friends' runs, friends start their own runs.

Replays render the same UI but with a small "REPLAY" indicator in the top corner and the speed control showing 4x by default. Skim a friend's full run in 8 minutes, then start your own.

---

## What we are not building (in this UI)

- A logged-in account dashboard with "your stats over time." (Leaderboard does that.)
- A friends list / social graph. (Leaderboard handles social proof.)
- A "build your own world corpus" feature. (Authoring is a separate repo concern.)
- A chat-with-the-CEO interface. The user does not interact with the CEO. That breaks the spectator frame.
- A tutorial. The product is a 30-second form and then a watchable run. If we need a tutorial, we've over-designed.

The container is invisible. The run is the product.
