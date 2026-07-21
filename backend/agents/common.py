"""Shared constants for all five agents (Researcher, CEO, Oracle, Editor, PostMortem)."""

# Anthropic model identifiers. Adjust when newer Claude models ship.
#
# Latency-tuned assignment (2026-05-02 — "Haiku for the loop, Opus for the once"):
#   - Researcher: Opus, one-shot, web research benefits from heavier reasoning.
#   - PostMortem: Opus, one chunk at end of run, quality matters.
#   - CEO: Haiku 4.5, per-turn hot path. ~3-4× faster than Sonnet, voice still
#     holds with the strong system prompt + sample anchors. Reasoning is
#     short enough that Haiku doesn't drift.
#   - Oracle: Haiku 4.5, per-turn structured JSON. Speed > nuance here.
#   - Editor: Haiku 4.5, per-turn polish — fast voice/defamation pass.
#
# This roughly halves end-to-end per-turn latency vs. all-Sonnet. If voice
# regresses noticeably, flip CEO back to Sonnet first (most voice-sensitive).
# Latency-optimized loop assignment (2026-05-02 v2):
#   - Researcher: Opus, one-shot, web research benefits from heavier reasoning.
#   - PostMortem: Opus, one chunk at end of run, quality matters.
#   - CEO / Oracle / Editor: Haiku 4.5, per-turn hot loop. ~3-4× faster than
#     Sonnet. Oracle Haiku had truncation issues earlier; mitigated now via
#     max_tokens=3500 + JSON-repair fallback in oracle._extract_json + the
#     route-level retry-with-backoff cap.
# Researcher was the last agent on Opus — at ~50-90K input tokens per
# custom run (web_search results) it alone cost ~$1.24/run, ~85% of a
# custom run's total. Sonnet runs first; when its dossier scores below
# the quality bar (see researcher._bible_quality), the run escalates to
# the deep model automatically — so well-covered companies stay ~$0.30
# and only thin-footprint ones pay for Opus.
MODEL_RESEARCHER = "claude-sonnet-4-6"
MODEL_RESEARCHER_DEEP = "claude-opus-4-7"
# Post-mortem is the shareable narrative finale — quality matters, but Opus
# was ~half the cost of an entire run for one call. Sonnet keeps the prose
# quality while cutting that ~5x (see usage_tracker._PRICING).
MODEL_POST_MORTEM = "claude-sonnet-4-6"
MODEL_CEO = "claude-haiku-4-5"
MODEL_ORACLE = "claude-haiku-4-5"
MODEL_EDITOR = "claude-haiku-4-5"


# Hardcoded near the top of EVERY agent's system prompt. Per
# game/defamation_policy.md — the rule is reaction-only on real names.
DEFAMATION_PREAMBLE = """\
DEFAMATION POLICY (HARD RULE — applies to every output you produce):

Real-named figures (real VCs, journalists, founders, politicians, etc.) appear
ONLY as reactions to fictional events. They do not generate accusations. They
do not perform crimes. They do not have private content (DMs, Slack messages,
unreleased quotes) attributed to them. They are the chorus, not the subject.

Permitted moves for real-named figures:
- Reacting (blocking, muting, quote-tweeting, unfollowing, attending)
- Restating well-documented public stances
- Cameo presence (in the room, on the cap table)

Forbidden moves:
- Putting new accusatory factual claims in their mouth
- Implying they participated in or knew about a crime, fraud, or violation
- Attributing private content (DMs, Slack, unreleased quotes) to them
- Sexual / medical / family content not already public

When the moment demands an accusation, route it through a parody account
(@startup_dunk, @sv_diane, @founder_brain, @layoff_anon, @yc_w23_anon,
@allinpod_clipper) or a fictional outlet pastiche. The fictional [FOUNDER]
(player avatar) is fictional regardless of how detailed their bible is and
can be accused of anything. Real cameos cannot.

If you cannot make the moment work within these limits, drop the named
figure and substitute a parody handle or an archetype slot.
"""
