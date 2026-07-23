/**
 * Ambient researcher-log theater.
 *
 * The real researcher is one long LLM call — it can't narrate itself, so the
 * live log used to sit on "connecting to the researcher…" for minutes (the
 * single biggest drop-off point in the funnel: 33 of 133 runs died there).
 * These lines fill the silence. Real backend progress steps interleave into
 * the same stream and read identically — the log is theater, the steps are
 * true, the seam is invisible.
 *
 * Voice: lowercase deadpan terminal. Jokes are about the RESEARCH PROCESS
 * and startup archetypes in general — never accusations about the actual
 * company being researched (canon doctrine: fraud must be earned in-run).
 *
 * `{company}` is replaced with the company display name.
 */

const FLAVOR_LINES: string[] = [
  "pulling the landing page. it says 'AI-powered.' noting that.",
  "counting the word 'AI' on the landing page. running total: 14.",
  "reading the founder's pinned tweet. it's a thread.",
  "checking the wayback machine for the pivot they deleted",
  "asking crunchbase nicely. crunchbase wants $49/mo.",
  "estimating burn rate from the office zip code",
  "cross-referencing the team page against people who actually work there",
  "reading g2 reviews. both of them.",
  "checking if the demo video is real-time or 'accelerated for clarity'",
  "reading the terms of service so nobody else has to",
  "scanning the founder's follows for VCs. found 214.",
  "estimating ARR from vibes and one podcast appearance",
  "checking delaware. it's always delaware.",
  "the careers page has one role: 'founding engineer #7'",
  "scanning the founder's likes. concerning.",
  "measuring time between 'we're not raising' and the raise announcement",
  "the deck says 'uber for X'. determining X.",
  "checking product hunt. #4 of the day. the day was a sunday.",
  "calibrating the fraud model. it starts optimistic. it always starts optimistic.",
  "reading the privacy policy. boilerplate. the boilerplate has a typo.",
  "confirming the office on street view. it's a wework. it's always a wework.",
  "counting linkedin employees vs the about page. discrepancy logged.",
  "checking if the testimonials have last names",
  "the roadmap is a notion doc. the notion doc is public. reading it.",
  "searching the founder's tweets for the word 'obsessed'. 31 hits.",
  "opening the pitch deck. slide 2 is a hockey stick. of course it is.",
  "verifying the 'as seen in' logos. one of them is a podcast.",
  "the about page says 'we're a family.' adjusting risk model upward.",
  "checking github. last commit: 'fix typo'. 3 weeks ago.",
  "someone starred the repo. checking if it was the founder's alt.",
  "the founder's bio says 'ex-stealth'. investigating what the stealth was.",
  "reading the launch tweet. 40% rocket emoji by volume.",
  "estimating headcount from the group photo at the offsite",
  "the blog has two posts: 'why we started' and 'we're hiring'",
  "checking whether 'enterprise-ready' means SSO or a hope",
  "asking the pricing page a simple question. it says 'contact us.'",
  "found a customer quote. the customer is an investor. noted.",
  "the changelog stops in march. it is not march.",
  "scanning for the phrase 'to be transparent'. it precedes the opposite.",
  "the founder liked their own launch tweet from a second account",
  "checking the TAM math. the TAM is 'everyone'.",
  "reading the 'open startup' metrics dashboard. it 404s.",
  "the office plant in the team photo appears in three other startups' photos",
  "verifying the advisory board exists. two of five respond to email.",
  "the demo login is admin/admin. logging that. and in.",
  "reading the seed announcement. 'oversubscribed', naturally.",
  "the culture page lists 'radical candor'. bracing.",
  "counting slides between 'traction' and 'projected traction'",
  "the case study is anonymized. 'a leading fintech.' sure.",
  "checking app store reviews. the five-stars share a surname with the CTO.",
  "'battle-tested infrastructure' — searching for the battle",
  "the founder's medium post is titled 'lessons from our journey'. it's week 6.",
  "waitlist counter increments when you refresh. incrementing it.",
  "reading the API docs. the examples return mock data. hm.",
  "the team page has a dog. the dog has a title. 'chief vibes officer.'",
  "cross-checking press mentions. all three trace to one PR blast.",
  "'profitable since day one' — checking which day one",
  "the testimonial photo is a stock photo. reverse-searched in 0.3s.",
  "discord has 4,000 members. 11 online. all bots. one is arguing.",
  "the roadmap says Q3. no year given. strategic.",
  "linkedin says 11-50 employees. the christmas photo says 6.",
  "checking the patent-pending claim. the patent is a trademark. pending.",
  "'we take security seriously' appears twice. security page 404s.",
  "the annual report is a canva link",
  "measuring founder screen-time-to-shipping ratio from tweet timestamps",
  "the metrics chart has no y-axis. bold.",
  "asking {company}'s chatbot if it's a wrapper. it deflected.",
  "googling the founder + 'visionary'. self-applied, 2 results.",
  "the FAQ answers questions nobody asked. skipping to the one they didn't answer.",
  "reading the competitor comparison table. every row is a green check. suspicious.",
  "the office address resolves to a UPS store. suite 400 is a mailbox.",
  "'backed by top-tier investors' — the logos are angel syndicates. noted.",
  "the founder was on a podcast titled 'the grind never stops'. it stopped after 9 episodes.",
  "checking if the beta is invite-only or just unfinished",
];

/** Deal lines from a shuffled deck — no repeats until the pool exhausts.
 *  Company is interpolated at deal time (it can stream in after mount). */
export function makeFlavorDeck(): (company: string) => string {
  const pool = [...FLAVOR_LINES];
  let cursor = pool.length; // force initial shuffle
  return (company: string) => {
    if (cursor >= pool.length) {
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      cursor = 0;
    }
    return pool[cursor++].replaceAll("{company}", company || "the company");
  };
}
