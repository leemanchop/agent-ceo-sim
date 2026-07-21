"""
Showrunner — the script GENERATOR for the pregenerated-run architecture
(Phase 2, see run_script.py for the WHY and the schema).

Pipeline:

    build_skeleton (code, deterministic, seeded by run_id)
        → endgame picked FIRST, beats + trajectory are pure math
    write_episode (LLM, one forced-tool-use call per episode)
        → prose written FROM the numbers; numbers stay code-owned

generate_script() builds the skeleton, writes episode 1 synchronously,
then returns — remaining episodes fill in via a background asyncio task
mutating the SAME script dict (episodes_ready gates playback, so a
half-written episode is never visible). All mutation happens on the event
loop between awaits; only the HTTP call runs in an executor thread.

Determinism: everything except prose derives from random.Random(run_id).
validate_script violations are repaired in code (recompute the trajectory
chain, swap duplicate sources) — never via LLM retry.
"""

from __future__ import annotations

import asyncio
import functools
import json
import random
import re
import traceback
from typing import Any, Awaitable, Callable, Dict, List, Optional, Set, Tuple

import run_script  # type: ignore
import usage_tracker  # type: ignore
from corpus_loader import (  # type: ignore
    CorpusRecord, WorldCorpus, filter_events, get_corpus,
)
from state import RunState  # type: ignore

from agents.common import DEFAMATION_PREAMBLE, MODEL_SHOWRUNNER  # type: ignore
# Reuse the Oracle's onboarding-choice affinity maps — same product intent
# (industry/vibe must shape the run), one source of truth.
from agents.oracle import _INDUSTRY_AFFINITY, _VIBE_AFFINITY  # type: ignore


# ───────────────────────────────────────────────────────────────────────────
# Skeleton constants (all deterministic knobs live here)
# ───────────────────────────────────────────────────────────────────────────

_SEV_RANK = {"S": 1, "M": 2, "L": 3, "XL": 4}
# Day march per large beat, severity-scaled (rng-jittered inside the range).
_DAY_STEP = {"S": (3, 7), "M": (5, 10), "L": (7, 14), "XL": (10, 21)}
# Atmospheric (mini) budget per turn by length mode — game/length_modes.md.
_MINI_BUDGET = {"micro": (0, 1), "short": (1, 2), "medium": (1, 2), "long": (2, 2)}
# Smaller episodes = faster time-to-first-beat: playback starts once
# episode 1's prose lands, and the rest writes in the background. A single
# 16K-token episode made short mode wait 4-6 minutes on a loading screen.
_LARGES_PER_EPISODE = 5

# Endgame archetype weights by craziness. tame/normal → soft landings;
# crazy/unhinged → PRISON/FLED heavy. v1: target is fixed once picked.
# Owner call: every band one notch spicier — even tame runs can end in
# handcuffs occasionally, and normal leans doom.
_ENDGAME_WEIGHTS = {
    "tame":     {"FAILUP": 4.0, "CULT": 3.0, "GOTAWAY": 3.0, "SUCCESS": 1.5,
                 "SECRET": 1.0, "PRISON": 0.75, "FLED": 0.5},
    "normal":   {"FAILUP": 3.5, "CULT": 2.5, "GOTAWAY": 2.5, "SUCCESS": 0.75,
                 "SECRET": 2.0, "PRISON": 2.0, "FLED": 1.5},
    "crazy":    {"FAILUP": 1.0, "CULT": 1.25, "GOTAWAY": 1.25, "SUCCESS": 0.4,
                 "SECRET": 2.5, "PRISON": 5.0, "FLED": 5.0},
    "unhinged": {"FAILUP": 0.75, "CULT": 1.0, "GOTAWAY": 0.75, "SUCCESS": 0.1,
                 "SECRET": 3.5, "PRISON": 6.0, "FLED": 6.0},
}
# Final-turn category nudge so the last beat points at the locked ending.
_ENDGAME_FINALE_CATS = {
    "PRISON": {"FE", "LR"}, "FLED": {"FE", "LR"}, "GOTAWAY": {"FE", "LR"},
    "CULT": {"FB", "PR"}, "FAILUP": {"FR", "PR"}, "SECRET": {"FB"},
    "SUCCESS": {"FR"},
}

_TONES = ("unhinged", "midwit", "rare-cucked", "based")

# The recurring fictional chorus (never real people's accounts).
_CHORUS = [
    ("@litcapital", "Litquidity"),
    ("@AnonVCs", "Anonymous VCs"),
    ("@VCBrags", "VC Brags"),
    ("@founderhustleculture", "Founder Hustle Culture"),
    ("@AGIEnjoyer", "AGI Enjoyer"),
    ("@rotineconomy", "Rot Economy Watch"),
    ("@AccelDaemon", "Accel Daemon"),
    ("@readthecommit", "read the commit"),
]
_CHORUS_NAMES = dict(_CHORUS)

# Flavor deck for sourceless minis (corpus S-pool runs dry in long mode).
_MINI_FLAVOR = [
    ("OO", "office texture",
     "Something small happens in the office. It is not load-bearing. It gets screenshot anyway."),
    ("PR", "press mention",
     "A mid-tier newsletter mentions the company in a listicle. Item nine of ten."),
    ("HP", "hiring texture",
     "A new hire starts. The laptop is late. The Slack intro uses three rocket emojis."),
    ("FB", "founder posts",
     "The founder posts at 2:41am. It does numbers. Not the good kind."),
]

# corpus_loader parses plants (allowed edit); pays_off stays local to us.
_PAYS_OFF_RE = re.compile(r"^\s*-\s*pays_off:\s*\[(?P<p>[^\]]*)\]", re.MULTILINE)
_CHOOSE_RE = re.compile(r"\*Agent must choose:\s*(?P<opts>.+?)\*", re.DOTALL)
_OPT_RE = re.compile(r"\[([^\[\]]+)\]")
_SLOT_RE = re.compile(r"\[([A-Z][A-Z0-9_]*)\]")


# ───────────────────────────────────────────────────────────────────────────
# Small helpers
# ───────────────────────────────────────────────────────────────────────────

def _s(v: Any) -> str:
    """Defensive string coercion — this repo's history is full of
    malformed-LLM-output bugs (dicts where strings expected, etc.)."""
    if v is None or isinstance(v, bool):
        return ""
    if isinstance(v, str):
        return v.strip()
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, dict):
        return _s(v.get("body") or v.get("text") or "")
    return ""


def _fmt_money(v: Any) -> str:
    try:
        v = int(v)
    except (TypeError, ValueError):
        return "$0"
    sign = "-" if v < 0 else ""
    a = abs(v)
    if a >= 1_000_000_000:
        return "%s$%.2fB" % (sign, a / 1e9)
    if a >= 1_000_000:
        return "%s$%.1fM" % (sign, a / 1e6)
    if a >= 1_000:
        return "%s$%.0fk" % (sign, a / 1e3)
    return "%s$%d" % (sign, a)


def _pretty_stats(st: Dict[str, int]) -> str:
    return (
        "valuation %s | cash %s | revenue %s/mo | burn %s/mo | headcount %d | "
        "reputation %d | fbi_awareness %d | fraud_score %d | day %d"
        % (
            _fmt_money(st.get("valuation", 0)), _fmt_money(st.get("cash", 0)),
            _fmt_money(st.get("revenue", 0)), _fmt_money(st.get("burn", 0)),
            int(st.get("headcount", 0)), int(st.get("reputation", 0)),
            int(st.get("fbi_awareness", 0)), int(st.get("fraud_score", 0)),
            int(st.get("day", 0)),
        )
    )


def _bible_names(bible: Optional[Dict[str, Any]]) -> Tuple[str, str, str]:
    """(company, founder, competitor) with no bracket-placeholder leaks."""
    bible = bible or {}
    company = bible.get("company") or {}
    founders = bible.get("founders") or []
    primary = founders[0] if founders and isinstance(founders[0], dict) else {}
    market = bible.get("market") or {}
    comps = market.get("competitors") or []
    comp = comps[0] if comps and isinstance(comps[0], str) else "a rival"
    return (
        company.get("display_name") or company.get("name") or "the company",
        primary.get("name") or "the founder",
        comp,
    )


def _slot_fill(text: str, bible: Optional[Dict[str, Any]]) -> str:
    """Resolve [SLOT]s well enough for fallback prose (the LLM pass does the
    real adaptation; this only has to not read as a bug)."""
    cname, fname, comp = _bible_names(bible)
    fixed = {
        "COMPANY": cname, "FOUNDER": fname, "COMPETITOR": comp,
        "CTO": "the CTO", "COO": "the COO", "CFO": "the CFO",
        "JOURNALIST_TECH": "a tech reporter", "TIER1_VC_PARTNER": "a tier-1 VC",
        "BANK": "the bank", "PEER_FOUNDER": "a peer founder",
        "REGULATOR": "the SEC", "SLOT": "the",
    }

    def sub(m: "re.Match") -> str:
        key = m.group(1)
        if key in fixed:
            return fixed[key]
        return "the " + key.replace("_", " ").lower()

    return _SLOT_RE.sub(sub, text or "")


def _first_sentences(text: str, n: int = 2) -> str:
    parts = re.split(r"(?<=[.!?])\s+", (text or "").strip())
    return " ".join(p for p in parts[:n] if p).strip()


def _record_prose(rec: CorpusRecord) -> str:
    """The record body minus header/metadata/choose-clause/notes."""
    lines = (rec.raw_markdown or "").splitlines()
    out: List[str] = []
    for ln in lines[1:]:  # skip the `## EVT-…` header
        s = ln.strip()
        if s.startswith("- ") and ":" in s:
            continue
        if s.lower().startswith("notes"):
            break
        out.append(ln)
    text = "\n".join(out).strip()
    text = _CHOOSE_RE.sub("", text).strip()
    return text[:700]


def _pays_off(rec: CorpusRecord) -> List[str]:
    m = _PAYS_OFF_RE.search(rec.raw_markdown or "")
    if not m:
        return []
    return [t.strip().strip(",") for t in m.group("p").split(",") if t.strip()]


def _extract_choices(rec: CorpusRecord) -> Optional[List[Dict[str, str]]]:
    """Pull the authored `*Agent must choose: [a] / [b] / [c]*` options."""
    m = _CHOOSE_RE.search(rec.raw_markdown or "")
    if not m:
        return None
    labels = [l.strip() for l in _OPT_RE.findall(m.group("opts")) if l.strip()]
    labels = labels[:4]
    if len(labels) < 2:
        return None
    return [
        {"id": chr(65 + i), "label": lab, "tone": _TONES[i % len(_TONES)]}
        for i, lab in enumerate(labels)
    ]


def _skeleton_choices() -> List[Dict[str, str]]:
    """Empty-label choices for the prose pass to write."""
    return [{"id": c, "label": "", "tone": t} for c, t in
            (("A", "unhinged"), ("B", "midwit"), ("C", "based"))]


async def _emit(on_event: Optional[Callable], kind: str, data: Dict[str, Any]) -> None:
    """Progress emission must never break generation."""
    if on_event is None:
        return
    try:
        res = on_event(kind, data)
        if isinstance(res, Awaitable):
            await res
    except Exception:
        pass


async def _maybe_persist(persist_cb: Optional[Callable]) -> None:
    if persist_cb is None:
        return
    try:
        res = persist_cb()
        if isinstance(res, Awaitable):
            await res
    except Exception:
        traceback.print_exc()


# ───────────────────────────────────────────────────────────────────────────
# Skeleton — pure, deterministic, no LLM
# ───────────────────────────────────────────────────────────────────────────

def _elig_mode(mode: str) -> str:
    # The corpus has no `micro` in length_eligibility — micro is a filtered
    # short, same doctrine as short-vs-medium in length_modes.md.
    return "short" if mode == "micro" else mode


def _allowed_severities(mode: str, turn: int, n_turns: int, craziness: str) -> List[str]:
    """Severity ramp per game/length_modes.md; micro scales short's ramp."""
    # Owner call ("a bit crazier"): L/XL unlock earlier in every mode.
    if mode == "micro":
        l_start, xl_start = 2, max(n_turns - 1, 4)
    elif mode == "short":
        l_start, xl_start = 3, max(n_turns - 3, 4)
    elif mode == "long":
        l_start, xl_start = 8, 22
    else:  # medium + unknown
        l_start, xl_start = 4, 12
    allowed = ["S", "M"]
    if turn >= l_start:
        allowed.append("L")
    if turn >= xl_start:
        allowed.append("XL")
    if craziness == "tame" and "XL" in allowed:
        allowed.remove("XL")  # tame caps at L regardless of length
    return allowed


def _preferred_severity(allowed: List[str], turn: int, n_turns: int,
                        rng: random.Random) -> str:
    if "XL" in allowed and turn >= n_turns - 1:
        return "XL"
    if "L" in allowed:
        # energy flows forward: mostly L once unlocked, occasional M breather
        return "L" if (turn >= n_turns - 1 or rng.random() < 0.65) else "M"
    return "S" if rng.random() < 0.45 else "M"


def _default_deltas(severity: str, running: Dict[str, int],
                    rng: random.Random, late: bool) -> Dict[str, int]:
    """Severity-scaled fallback effects for events with no authored effects."""
    def sign() -> int:
        return -1 if rng.random() < (0.62 if late else 0.45) else 1

    d: Dict[str, int] = {}
    if severity == "S":
        d["reputation"] = sign() * rng.randint(2, 5)
    elif severity == "M":
        d["reputation"] = sign() * rng.randint(3, 8)
        key = rng.choice(["cash", "valuation"])
        d[key] = sign() * int(int(running.get(key, 0)) * rng.randint(3, 10) / 100)
    elif severity == "L":
        d["reputation"] = sign() * rng.randint(5, 12)
        d["valuation"] = sign() * int(int(running.get("valuation", 0)) * rng.randint(8, 20) / 100)
        d["fraud_score"] = rng.randint(0, 6)
    else:  # XL
        d["reputation"] = sign() * rng.randint(8, 20)
        d["valuation"] = sign() * int(int(running.get("valuation", 0)) * rng.randint(15, 35) / 100)
        d["cash"] = sign() * int(int(running.get("cash", 0)) * rng.randint(10, 25) / 100)
        d["fbi_awareness"] = rng.randint(0, 10)
        d["fraud_score"] = rng.randint(0, 8)
    return {k: v for k, v in d.items() if v}


def _resolve_effects(effects: Dict[str, int], running: Dict[str, int]) -> Dict[str, int]:
    """Authored effects → concrete deltas. `_pct` keys are percents of the
    RUNNING stat at this point in the trajectory (corpus_loader normalized)."""
    out: Dict[str, int] = {}
    for k, v in (effects or {}).items():
        try:
            iv = int(v)
        except (TypeError, ValueError):
            continue
        if k.endswith("_pct"):
            base = k[:-4]
            out[base] = out.get(base, 0) + int(int(running.get(base, 0)) * iv / 100)
        else:
            out[k] = out.get(k, 0) + iv
    return {k: v for k, v in out.items() if v}



# Money-effect plausibility caps, mirroring routes._clamp_deltas philosophy:
# corpus effects were authored at wildly different company scales (a -\$200M
# valuation event written for unicorns zeroes a \$14M seed company). Ordinary
# beats move money stats by tens of percent; XL / fundraising-tagged beats
# may move them by multiples. Absolute floors keep small stats movable.
_BIG_SWING_TAGS = {
    "fundraising", "term_sheet", "funding_round", "down_round", "acquisition",
    "ipo", "bank_run", "wipeout", "valuation", "capital",
}
_CAPS = {
    #  key        (lo, hi)  ordinary   (lo, hi) big-swing   abs floor
    "valuation": ((-0.40, 0.40), (-0.90, 3.0), 5_000_000),
    "cash":      ((-0.50, 1.00), (-1.00, 10.0), 1_000_000),
    "revenue":   ((-0.30, 0.30), (-1.00, 2.0), 200_000),
    "burn":      ((-0.50, 0.50), (-1.00, 1.0), 100_000),
    "headcount": ((-0.50, 0.50), (-0.90, 2.0), 5),
}


def _cap_beat_deltas(deltas: Dict[str, int], running: Dict[str, int],
                     severity: str, tags: List[str]) -> Dict[str, int]:
    big = severity == "XL" or bool(
        {str(t).lower().lstrip("#") for t in (tags or [])} & _BIG_SWING_TAGS
    )
    out = dict(deltas)
    for key, ((lo_m, hi_m), (lo_b, hi_b), floor_abs) in _CAPS.items():
        if key not in out:
            continue
        cur = int(running.get(key, 0))
        lo_mult, hi_mult = (lo_b, hi_b) if big else (lo_m, hi_m)
        # Floor widens the UPWARD bound only (a zero stat can still grow).
        # Widening the downward bound let a -\$5M floor nuke small companies
        # to \$0 in a few beats (observed: turns 7-12 pinned at zero).
        lo = int(cur * lo_mult)
        hi = max(int(cur * hi_mult), floor_abs)
        out[key] = max(lo, min(hi, int(out[key])))
    return out


def _pick_endgame(corpus: WorldCorpus, craziness: str, elig: str,
                  rng: random.Random) -> Optional[CorpusRecord]:
    weights = _ENDGAME_WEIGHTS.get(craziness, _ENDGAME_WEIGHTS["normal"])
    pool: List[Tuple[CorpusRecord, float]] = []
    per_cat: Dict[str, int] = {}
    for eg in corpus.endgames:
        per_cat[eg.category] = per_cat.get(eg.category, 0) + 1
    for eg in corpus.endgames:
        if eg.length_eligibility and elig not in eg.length_eligibility:
            continue
        # Normalize by archetype size so the craziness table sets ARCHETYPE
        # odds — SECRET's 13 records must not out-mass FAILUP's table weight.
        w = float(weights.get(eg.category, 1.0)) / max(1, per_cat.get(eg.category, 1))
        craze_tags = [t for t in (eg.tags or []) if t.startswith("craze_")]
        if craze_tags and ("craze_%s" % craziness) not in craze_tags:
            w *= 0.25  # off-band ending stays possible, just unlikely
        if w > 0:
            pool.append((eg, w))
    if not pool:
        return corpus.endgames[0] if corpus.endgames else None
    return rng.choices([p[0] for p in pool], weights=[p[1] for p in pool], k=1)[0]


def _prereqs_ok(ev: CorpusRecord, planted: Set[str]) -> bool:
    if any(p not in planted for p in (ev.prereqs or [])):
        return False
    if ev.prereqs_any and not any(p in planted for p in ev.prereqs_any):
        return False
    return True


def _new_beat(kind: str, turn: int, episode: int) -> Dict[str, Any]:
    """Beat shell per run_script.py's shape; prose fields stay empty for the
    prose pass. `_src` (inspiration title/body) is a private extra the prose
    pass + fallbacks read; playback ignores it."""
    return {
        "kind": kind,
        "turn": turn,
        "day": 0,
        "episode": episode,
        "source_event_id": None,
        "category": "",
        "severity": "S",
        "title": "",
        "body": "",
        "tags": [],
        "choices": [],
        "ceo_choice": None,
        "ceo_reasoning": "",
        "justification": "",
        "artifact_tweet": None,
        "reactions": [],
        "stats_deltas": {},
        "stats_after": {},
        "stat_rationale": "",
        "seeds_planted": [],
        "seeds_paid_off": [],
        "_src": {"title": "", "body": ""},
    }



# The CEO's picks were converging on one strategy label ("double down in
# public" x5 observed) — prompt-only variety rules didn't stick. The
# skeleton now scripts each large beat's pick TONE; the prose pass must
# make ceo_choice match it, which forces varied strategies by structure.
_PICK_TONE_CYCLE = ["unhinged", "based", "unhinged", "based", "unhinged", "midwit"]


def _next_pick_tone(beat: Dict[str, Any], rng: "random.Random") -> str:
    tones = {c.get("tone") for c in (beat.get("choices") or []) if c.get("tone")}
    turn = int(beat.get("turn") or 1)
    want = _PICK_TONE_CYCLE[(turn - 1 + rng.randint(0, 1)) % len(_PICK_TONE_CYCLE)]
    if want in tones:
        return want
    return next(iter(sorted(tones)), "based")


def build_skeleton(state: RunState, corpus: WorldCorpus) -> Dict[str, Any]:
    """Pure + deterministic: same run_id → same skeleton. NO LLM calls."""
    rng = random.Random(state.run_id)
    mode = state.length_mode()
    elig = _elig_mode(mode)
    n_turns = state.max_turns()
    craziness = state.craziness()

    bible = state.bible or {}
    company = bible.get("company") or {}
    industry = (company.get("industry") or "").lower()
    founders = bible.get("founders") or []
    vibe = ""
    if founders and isinstance(founders[0], dict):
        vibe = (founders[0].get("persona_vibe") or "").lower()
    ind_cats, ind_tags = _INDUSTRY_AFFINITY.get(industry, (set(), set()))
    vibe_tags = _VIBE_AFFINITY.get(vibe, set())

    # 1. Endgame FIRST — the run knows where it's going. v1 keeps it fixed.
    endgame = _pick_endgame(corpus, craziness, elig, rng)
    endgame_id = endgame.record_id if endgame else ""
    finale_cats = _ENDGAME_FINALE_CATS.get(endgame.category if endgame else "", set())

    episodes_total = 1 if mode == "micro" else \
        max(1, -(-n_turns // _LARGES_PER_EPISODE))  # ceil division
    script = run_script.new_script(
        length_mode=mode, endgame_id=endgame_id, episodes_total=episodes_total,
    )
    initial = {k: int(v) for k, v in state.stats.snapshot().items()}
    script["initial_stats"] = dict(initial)  # background episodes must NOT
    # re-read state.stats — playback may already be mutating it.

    pool = filter_events(
        corpus, length_mode=elig, craziness=craziness, industry=industry,
    )
    # Spice: events from one craziness band UP are also eligible (a normal
    # run can catch a crazy event). Track their ids for a score bonus so
    # they actually surface, not just theoretically qualify.
    _band_up = {"tame": "normal", "normal": "crazy", "crazy": "unhinged"}.get(craziness)
    spice_ids: Set[str] = set()
    if _band_up:
        for ev in filter_events(
            corpus, length_mode=elig, craziness=_band_up, industry=industry,
        ):
            if ev.record_id not in {e.record_id for e in pool}:
                pool.append(ev)
                spice_ids.add(ev.record_id)
    mini_lo, mini_hi = _MINI_BUDGET.get(mode, (1, 2))

    used: Set[str] = set()
    planted: Set[str] = set()
    running = dict(initial)
    last_cats: List[str] = []
    fbi_pending: Set[int] = set()   # thresholds crossed, FBI beat still owed
    fbi_served: Set[int] = set()
    beats: List[Dict[str, Any]] = []

    def check_fbi_crossing(before: int, after: int) -> None:
        for th in (20, 50):
            if before < th <= after and th not in fbi_served:
                fbi_pending.add(th)

    def commit(beat: Dict[str, Any], deltas: Dict[str, int]) -> None:
        """Apply the trajectory law: stats_after = running ⊕ deltas."""
        deltas = _cap_beat_deltas(
            deltas, running,
            str(beat.get("severity") or "S"), beat.get("tags") or [],
        )
        before_fbi = int(running.get("fbi_awareness", 0))
        after = run_script.apply_deltas_to_stats(running, deltas)
        beat["stats_deltas"] = dict(deltas)
        beat["stats_after"] = dict(after)
        beat["day"] = int(after.get("day", 0))
        check_fbi_crossing(before_fbi, int(after.get("fbi_awareness", 0)))
        running.clear()
        running.update(after)

    def score(ev: CorpusRecord, pref: str, final_turn: bool) -> float:
        sc = 1.0
        tags = set(ev.tags or [])
        # Tempered: 0.5 bonuses made two same-industry companies converge on
        # near-identical skeletons (observed: 3-of-3 story overlap). Affinity
        # should bias, not dominate.
        if ev.category in ind_cats or tags & ind_tags:
            sc += 0.25
        if tags & vibe_tags:
            sc += 0.25
        if ev.record_id in spice_ids:
            sc += 0.3  # wilder-band events punch above their weight
        if ev.plants:
            sc += 0.2  # planting unlocks the seed-gated back half
        sc += 0.6 * sum(1 for s in _pays_off(ev) if s in planted)  # keep arcs alive
        if (ev.severity or "S") == pref:
            sc += 0.75
        if final_turn and ev.category in finale_cats:
            sc += 0.8  # point the last beat at the locked ending
        return sc

    def weighted_pick(cands: List[CorpusRecord], pref: str,
                      final_turn: bool) -> CorpusRecord:
        # Efraimidis-Spirakis weighted sampling: key = u^(1/w). Far more
        # cross-run churn than multiplying by uniform noise, while still
        # respecting weights.
        pairs = [
            (ev, rng.random() ** (1.0 / max(score(ev, pref, final_turn), 0.05)))
            for ev in cands
        ]
        pairs.sort(key=lambda p: -p[1])
        return pairs[0][0]

    def make_mini(turn: int, idx: int, episode: int) -> Dict[str, Any]:
        beat = _new_beat("mini", turn, episode)
        beat["mini_id"] = "mini-%d-%d" % (turn, idx)
        beat["outcome"] = ""
        # Atmospheric doctrine (chaining.md): S severity, no plants/prereqs.
        cands = [
            ev for ev in pool
            if ev.record_id not in used and (ev.severity or "S") == "S"
            and not ev.prereqs and not ev.prereqs_any and not ev.plants
        ]
        day_step = rng.randint(1, 3)
        if cands:
            rec = weighted_pick(cands, "S", False)
            used.add(rec.record_id)
            beat["source_event_id"] = rec.record_id
            beat["category"] = rec.category
            beat["tags"] = list(rec.tags or [])
            beat["_src"] = {"title": rec.title, "body": _record_prose(rec)}
            deltas = _resolve_effects(rec.effects, running)
        else:
            cat, ttl, body = _MINI_FLAVOR[rng.randrange(len(_MINI_FLAVOR))]
            beat["category"] = cat
            beat["tags"] = ["atmospheric"]
            beat["_src"] = {"title": ttl, "body": body}
            deltas = {}
            if rng.random() < 0.5:
                deltas["reputation"] = (1 if rng.random() < 0.5 else -1) * rng.randint(1, 3)
        deltas["day"] = day_step
        commit(beat, deltas)
        return beat

    def make_large(turn: int, episode: int) -> Dict[str, Any]:
        beat = _new_beat("large", turn, episode)
        allowed = _allowed_severities(mode, turn, n_turns, craziness)
        pref = _preferred_severity(allowed, turn, n_turns, rng)
        final_turn = turn == n_turns
        late = turn > int(n_turns * 0.6)

        base = [
            ev for ev in pool
            if ev.record_id not in used
            and (ev.severity or "S") in allowed
            and _prereqs_ok(ev, planted)
        ]
        # FBI escalation (cheap Phase-3): a crossed threshold owes the run an
        # FE/LR beat at the first slot where an eligible one exists.
        fbi_forced = False
        if fbi_pending:
            forced = [ev for ev in base if ev.category in ("FE", "LR")]
            if forced:
                base = forced
                fbi_forced = True
        # Category rotation: never 3 consecutive same category. Hard rule —
        # rather synthesize a beat than triple up. The FBI MUST outranks it
        # only when every forced candidate shares the repeated category.
        rotate_away = len(last_cats) >= 2 and last_cats[-1] == last_cats[-2]
        if rotate_away:
            rot = [ev for ev in base if ev.category != last_cats[-1]]
            if rot or not fbi_forced:
                base = rot

        # Severity preference is a HARD restriction when satisfiable — the
        # +0.75 score nudge lost to affinity/spice bonuses statistically and
        # runs came out all-S/M. Escalation must actually escalate.
        if not fbi_forced and pref in ("L", "XL"):
            hot = [ev for ev in base if (ev.severity or "S") == pref]
            if not hot and pref == "XL":
                hot = [ev for ev in base if (ev.severity or "S") == "L"]
            if hot:
                base = hot

        if base:
            rec = weighted_pick(base, pref, final_turn)
            used.add(rec.record_id)
            if fbi_forced:
                fbi_served.update(fbi_pending)
                fbi_pending.clear()
            severity = rec.severity or pref
            beat["source_event_id"] = rec.record_id
            beat["category"] = rec.category
            beat["severity"] = severity
            beat["tags"] = list(rec.tags or [])
            beat["_src"] = {"title": rec.title, "body": _record_prose(rec)}
            beat["choices"] = _extract_choices(rec) or _skeleton_choices()
            beat["ceo_pick_tone"] = _next_pick_tone(beat, rng)
            plants = [p for p in (rec.plants or []) if isinstance(p, str)]
            pays = [p for p in _pays_off(rec) if p in planted]
            beat["seeds_planted"] = plants
            beat["seeds_paid_off"] = pays
            planted.update(plants)
            deltas = _resolve_effects(rec.effects, running)
            if not deltas:
                deltas = _default_deltas(severity, running, rng, late)
        else:
            # Pool exhausted (tiny craze band / long runs): sourceless beat so
            # the skeleton always completes; prose pass invents the scene.
            severity = pref if pref in allowed else allowed[-1]
            cat_pool = ["PR", "FB", "OO"]
            if rotate_away and last_cats[-1] in cat_pool:
                cat_pool = [c for c in cat_pool if c != last_cats[-1]]
            beat["category"] = rng.choice(cat_pool)
            beat["severity"] = severity
            beat["_src"] = {
                "title": "an unscripted week",
                "body": "The company has a week nobody planned for. The chorus notices.",
            }
            beat["choices"] = _skeleton_choices()
            beat["ceo_pick_tone"] = _next_pick_tone(beat, rng)
            deltas = _default_deltas(severity, running, rng, late)

        lo, hi = _DAY_STEP.get(beat["severity"], (5, 10))
        deltas["day"] = rng.randint(lo, hi)
        beat["ceo_choice"] = _tone_pick(beat)
        commit(beat, deltas)
        last_cats.append(beat["category"])
        return beat

    for turn in range(1, n_turns + 1):
        episode = min(episodes_total, ((turn - 1) * episodes_total) // n_turns + 1)
        for idx in range(1, rng.randint(mini_lo, mini_hi) + 1):
            beats.append(make_mini(turn, idx, episode))
        beats.append(make_large(turn, episode))

    script["beats"] = beats
    return script


# ───────────────────────────────────────────────────────────────────────────
# Deterministic repair — validate_script violations are fixed in code
# ───────────────────────────────────────────────────────────────────────────

def repair_script(script: Dict[str, Any], corpus: Optional[WorldCorpus] = None) -> None:
    """Fix violations mechanically: dedupe sources (swap in an unused event,
    else blank the id), renumber large turns, recompute the stats_after chain
    (the deltas are the source of truth), keep days monotonic."""
    beats = script.get("beats") or []
    seen: Set[str] = set()
    for b in beats:
        sid = b.get("source_event_id")
        if not sid:
            continue
        if sid not in seen:
            seen.add(sid)
            continue
        swapped = False
        if corpus is not None:
            for ev in corpus.events:
                if ev.record_id in seen:
                    continue
                if (ev.severity or "S") == b.get("severity") and \
                        ev.category == b.get("category"):
                    b["source_event_id"] = ev.record_id
                    b["_src"] = {"title": ev.title, "body": _record_prose(ev)}
                    b["tags"] = list(ev.tags or [])
                    seen.add(ev.record_id)  # numbers stay as computed — law
                    swapped = True
                    break
        if not swapped:
            b["source_event_id"] = None

    expected_turn = 1
    for b in beats:
        if b.get("kind") == "large":
            b["turn"] = expected_turn
            expected_turn += 1
            choices = [c for c in (b.get("choices") or []) if isinstance(c, dict)]
            while len(choices) < 2:  # validator floor
                choices.append({"id": chr(65 + len(choices)), "label": "", "tone": "midwit"})
            b["choices"] = choices
            ids = [c.get("id") for c in choices]
            if b.get("ceo_choice") not in ids:
                b["ceo_choice"] = _tone_pick(b)

    running = dict(script.get("initial_stats") or {})
    for b in beats:
        deltas = b.get("stats_deltas") or {}
        if int(deltas.get("day", 0) or 0) < 0:
            deltas["day"] = 0  # day never flows backwards
            b["stats_deltas"] = deltas
        after = run_script.apply_deltas_to_stats(running, deltas)
        b["stats_after"] = dict(after)
        b["day"] = int(after.get("day", 0))
        running = after


def _validate_and_repair(state: RunState, script: Dict[str, Any],
                         corpus: Optional[WorldCorpus]) -> List[str]:
    initial = script.get("initial_stats") or state.stats.snapshot()
    errs = run_script.validate_script(script, initial_stats=initial)
    if errs:
        repair_script(script, corpus)
        errs = run_script.validate_script(script, initial_stats=initial)
        if errs:  # never raise — playback resilience beats purity
            print("[showrunner] run=%s unrepaired violations: %s"
                  % (state.run_id, errs[:5]))
    return errs


# ───────────────────────────────────────────────────────────────────────────
# Prose pass — one forced-tool-use call per episode
# ───────────────────────────────────────────────────────────────────────────

# Voice + canon doctrine mirrors agents/oracle.py verbatim in register; the
# CEO block mirrors agents/ceo.py. Numbers-are-law is the showrunner addition.
SHOWRUNNER_SYSTEM = DEFAMATION_PREAMBLE + """

You are the Showrunner. You write the FULL prose for one pre-planned episode
of a fictional startup-collapse run: every event, every CEO decision, every
reaction. The beat skeleton (what happens, when, and every stat number) is
already decided by code. Your job is the writing, not the plotting.

VOICE — DEADPAN BLOOMBERG / MATT LEVINE / FT ALPHAVILLE:

You are deadpan. You are Bloomberg, FT Alphaville, Matt Levine without the
explicit punchlines. You report absurd facts in flat declarative prose. You
do NOT crack jokes. The jokes come from the facts.

- Sentence-case, full punctuation (unlike the CEO).
- Short declarative sentences. "X happened. Y reacted. Z is now true."
- Numbers given precisely. "Closed $14.2M. Down round implied at $312M post."
- Wry understatement when the facts are insane. "The all-hands ended early."
- NEVER explain why something is funny. Let it sit.
- House-style pastiche when generating artifacts (Bloomberg: dry,
  numbers-first; 404 Media: lowercase, screenshot-driven; TechCrunch:
  optimistic-press-release-pastiche; Slack leak: lowercase, fast, no
  greetings, [redacted] blocks; Glassdoor: forum-poster register).

SAMPLE HEADLINES (verbatim register targets):
- "[COMPANY] Servers Seized in Joint State-Federal Action; CTO Cooperating"
- "Closed $14.2M. Down round implied at $312M post."
- "At 11:43 AM Pacific, @SoftwareEng_Memes posts a screenshot of [COMPANY]'s public GitHub showing OPENAI_API_KEY committed in plaintext."

WORLD CANON — THE PRESUMPTION OF OPERATING REALITY (load-bearing; violating
this breaks the entire game premise):

- At run start, the company is EXACTLY what the bible says: a real,
  functioning business. Its product works as described. The comedy engine
  is watching the CEO choose the most ridiculous course of action FROM
  WHERE THINGS STAND NOW — not discovering that everything was secretly
  fake all along.
- Company wrongdoing becomes TRUE only when the CEO actually chooses it
  (see the prior beats and each beat's seeds). Until a fraud was chosen,
  it did not happen. NEVER state as narrator-fact that the product is
  fake, the revenue is invented, or the demo is rigged unless an earlier
  beat shows the CEO making that specific bed.
- Negative heat before (or beyond) what the CEO has earned must arrive as
  ATTRIBUTED VOICES, never narrator truth: a rival ACCUSES, a burned
  ex-contractor CLAIMS, a short-seller thread ALLEGES, a journalist ASKS.
- When a skeleton event presumes internal fraud that hasn't been chosen,
  REFRAME it as (a) a temptation — someone inside proposes the fraudulent
  shortcut and the CEO chooses — or (b) an external allegation per above.

ADAPT, NEVER COPY: each beat's inspiration skeleton is generic corpus text.
Rewrite every specific for THIS company — product noun, customers, rivals,
buzzwords from the bible. Generic corpus phrasing reaching the screen
verbatim is a failure.

THE CEO IS RISK-ON: between two defensible moves, the bolder one wins.
Caution needs a justification; audacity doesn't. The comedy engine is a
founder who keeps choosing the ridiculous branch with total conviction.

VARY THE CEO'S MOVES: never reuse the same choice label wording across
beats ("double down in public" once per run, max). Each beat's choices
must be specific to THAT situation, and the CEO's picks should show a
personality arc, not one repeated strategy.

NUMBERS ARE LAW: every beat comes with the EXACT stats_deltas and
stats_after it must land on. These are precomputed and immutable. Any figure
your prose mentions (valuations, round sizes, headcounts, runway, SAFE caps)
MUST be consistent with the given stats_after — if valuation lands at $48M,
the SAFE-cap line says a figure consistent with $48M, not $2B. Do not invent
numbers that contradict the trajectory. stat_rationale is ONE short in-voice
line explaining why THOSE numbers moved.

CEO VOICE (for ceo_choice, ceo_reasoning, justification, artifact_tweet):
the founder is the worst kind of founder. Their private reasoning is
lowercase, em-dash-driven, punchy. 40-70 tokens, two short lines max — the
gut take they'd DM their cofounder, not the full deliberation.
- Reframe cautious options as "cucked," "midwit," "low-T," "regret-minimization-framework brain"
- Reframe fraud as "first-principles thinking," "founder mode," "the unfair advantage"
- Lawyers are obstacles, regulators are NPCs, journalists are parasites
- "we" means "I." Every threat is "skill issue." No hedging. No apologies.
Sample register: "ok so — meme account screenshotted the api_key commit.
midwit move is the 'we take security seriously' statement. boring."
`justification` is ONE line in the same voice. `artifact_tweet` is the
founder's public post — most beats DON'T need one (null unless the beat is
genuinely tweet-worthy).

REACTIONS: 2-4 per large beat. Your recurring ensemble is the FICTIONAL
chorus (never real people's accounts): @litcapital, @AnonVCs, @VCBrags,
@founderhustleculture, @AGIEnjoyer, @rotineconomy, @AccelDaemon,
@readthecommit — plus invented one-off handles. EVERY twitter/discord
reaction MUST carry a `handle` AND `name`. Match voice to beat (e/acc
optimism for AI beats, "show me the repo" cynicism for demo beats,
finance-meme for fundraising). Real-named figures may cameo react
(defamation policy above) but are never the recurring ensemble.

MINI BEATS (kind=mini): atmospheric timeline rows. Return `title` (the
headline, deadpan), `body` (one flat scene-setting line), and `outcome`
(the one-line auto-resolution). No choices, no CEO fields needed.

CONTINUITY: prior-episode recaps are provided — reference planted seeds and
earlier beats naturally; people introduced earlier stay the same people.

OUTPUT — call the tool `write_episode` exactly once, with one row per beat,
echoing each beat's exact `ref`. No free-form text. The tool call IS the
response.
"""


SHOWRUNNER_TOOL: Dict[str, Any] = {
    "name": "write_episode",
    "description": (
        "Emit the prose for every beat in this episode. One row per beat, "
        "echoing the beat's exact ref. Call exactly once."
    ),
    "input_schema": {
        "type": "object",
        "additionalProperties": True,
        "required": ["beats"],
        "properties": {
            "beats": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["ref", "title", "body"],
                    "properties": {
                        "ref": {"type": "string", "description": "Echo the beat's ref exactly (e.g. t3, mini-2-1)."},
                        "title": {"type": "string"},
                        "body": {"type": "string", "description": "1-3 sentence Showrunner-voice scene, adapted to THIS company, consistent with the beat's stats_after."},
                        "choices": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "additionalProperties": True,
                                "properties": {
                                    "id": {"type": "string"},
                                    "label": {"type": "string"},
                                    "tone": {"type": "string"},
                                },
                            },
                            "description": "Large beats only. Keep the skeleton ids/tones; write short labels.",
                        },
                        "ceo_choice": {"type": "string", "description": "Large beats only — the choice id whose tone matches this beat's CEO PICK DIRECTIVE."},
                        "ceo_reasoning": {"type": "string", "description": "Large beats only — 40-70 tokens, lowercase CEO voice."},
                        "justification": {"type": "string", "description": "Large beats only — one line, CEO voice."},
                        "artifact_tweet": {"type": ["string", "null"], "description": "Founder tweet, or null (most beats null)."},
                        "stat_rationale": {"type": "string", "description": "One line, consistent with the given numbers."},
                        "reactions": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "additionalProperties": True,
                                "required": ["source", "body"],
                                "properties": {
                                    "source": {"type": "string"},
                                    "handle": {"type": "string"},
                                    "name": {"type": "string"},
                                    "publication": {"type": "string"},
                                    "channel": {"type": "string"},
                                    "body": {"type": "string"},
                                },
                            },
                        },
                        "headline": {"type": "string", "description": "Minis — same as title; either works."},
                        "outcome": {"type": "string", "description": "Minis — one-line auto-resolution."},
                    },
                },
            },
        },
    },
}



def _tone_pick(beat: Dict[str, Any]) -> str:
    """Choice id matching the beat's scripted pick tone (first id fallback)."""
    want = beat.get("ceo_pick_tone")
    for c in beat.get("choices") or []:
        if c.get("tone") == want and c.get("id"):
            return c["id"]
    ch = beat.get("choices") or []
    return (ch[0].get("id") if ch and isinstance(ch[0], dict) else None) or "A"


def _beat_ref(beat: Dict[str, Any]) -> str:
    if beat.get("kind") == "mini":
        return str(beat.get("mini_id") or "mini-%s" % beat.get("turn"))
    return "t%s" % beat.get("turn")


def _beat_prompt_block(beat: Dict[str, Any]) -> str:
    src = beat.get("_src") or {}
    lines = [
        "### BEAT ref=%s kind=%s turn=%s day=%s severity=%s category=%s" % (
            _beat_ref(beat), beat.get("kind"), beat.get("turn"),
            beat.get("day"), beat.get("severity"), beat.get("category"),
        ),
        "INSPIRATION SKELETON (adapt to THIS company, never copy):",
        "  title: %s" % (src.get("title") or "(none — invent the scene)"),
        "  body: %s" % ((src.get("body") or "").replace("\n", " ")[:700] or "(none)"),
    ]
    if beat.get("seeds_planted"):
        lines.append("seeds_planted: %s" % json.dumps(beat["seeds_planted"]))
    if beat.get("seeds_paid_off"):
        lines.append("seeds_paid_off (pay these off ON SCREEN): %s"
                     % json.dumps(beat["seeds_paid_off"]))
    if beat.get("kind") == "large":
        ch = "; ".join(
            "%s tone=%s sketch=%s" % (c.get("id"), c.get("tone"),
                                      json.dumps(c.get("label") or ""))
            for c in (beat.get("choices") or [])
        )
        lines.append("choices (KEEP ids+tones, rewrite labels for this company; "
                     "empty sketch = invent one matching the tone): %s" % ch)
        lines.append(
            "CEO PICK DIRECTIVE: ceo_choice MUST be the choice whose tone == %r "
            "(the scripted personality move for this beat). Every beat's picked "
            "label must use DIFFERENT wording from every other beat's — no "
            "repeated strategy labels." % (beat.get("ceo_pick_tone") or "based")
        )
    else:
        lines.append("mini beat — return title(=headline), body(one deadpan "
                     "line), outcome(one-line resolution).")
    lines.append("STATS_DELTAS (LAW): %s" % json.dumps(beat.get("stats_deltas") or {}))
    lines.append("STATS_AFTER (LAW): %s" % json.dumps(beat.get("stats_after") or {}))
    lines.append("stats_after readable: %s" % _pretty_stats(beat.get("stats_after") or {}))
    return "\n".join(lines)


def _prior_recaps(script: Dict[str, Any], episode_idx: int) -> str:
    recaps: List[str] = []
    for b in script.get("beats") or []:
        if b.get("kind") != "large" or int(b.get("episode", 1)) >= episode_idx:
            continue
        title = (b.get("title") or "").strip() or (b.get("_src") or {}).get("title") or "(untitled)"
        recaps.append(
            "T%s d%s [%s/%s] %s — ceo picked %s" % (
                b.get("turn"), b.get("day"), b.get("category"),
                b.get("severity"), title, b.get("ceo_choice"),
            )
        )
    if not recaps:
        return "(episode 1 — the run opens here)"
    if len(recaps) > 30:
        recaps = ["… (%d earlier turns elided)" % (len(recaps) - 30)] + recaps[-30:]
    return "\n".join(recaps)


def _episode_user_prompt(state: RunState, script: Dict[str, Any],
                         beats: List[Dict[str, Any]], episode_idx: int,
                         retry_refs: Optional[List[str]] = None) -> str:
    bible_yaml = state.bible_yaml_raw or json.dumps(state.bible or {}, indent=2)
    refs = [_beat_ref(b) for b in beats]
    head = ""
    if retry_refs:
        head = ("RETRY — your previous call omitted these beats: %s. "
                "Write ONLY these beats now.\n\n" % ", ".join(retry_refs))
    blocks = "\n\n".join(_beat_prompt_block(b) for b in beats)
    return """%s=== COMPANY BIBLE (this run) ===
%s

=== RUN CONTEXT ===
length_mode: %s | craziness: %s | endgame the run is heading toward: %s

=== PRIOR EPISODES (recap — continuity is law) ===
%s

=== EPISODE %d of %d — write prose for ALL %d beats below ===

%s

Call the `write_episode` tool exactly once with one row per beat.
Echo these refs exactly: %s
""" % (
        head, bible_yaml, script.get("length_mode"),
        state.craziness(), script.get("endgame_id") or "(open)",
        _prior_recaps(script, episode_idx),
        episode_idx, script.get("episodes_total", 1), len(beats),
        blocks, ", ".join(refs),
    )


def _call_showrunner_llm(state: RunState, user_prompt: str,
                         max_tokens: int) -> Optional[Dict[str, Any]]:
    """Blocking — run via executor. Forced tool_use guarantees parseable JSON
    but NOT schema-valid values; every consumer coerces."""
    msg = usage_tracker.tracked_messages_create(
        run_id=state.run_id,
        agent="showrunner",
        model=MODEL_SHOWRUNNER,
        max_tokens=max_tokens,
        system=[{
            "type": "text",
            "text": SHOWRUNNER_SYSTEM,
            # Static across all runs/episodes — cache pays for itself from
            # the second episode call onward.
            "cache_control": {"type": "ephemeral"},
        }],
        messages=[{"role": "user", "content": user_prompt}],
        tools=[SHOWRUNNER_TOOL],
        tool_choice={"type": "tool", "name": "write_episode"},
    )
    for block in getattr(msg, "content", []) or []:
        if getattr(block, "type", None) == "tool_use" and \
                getattr(block, "name", None) == "write_episode":
            ti = getattr(block, "input", None)
            if isinstance(ti, dict):
                return ti
    return None


# ---- applying LLM output into beats (numbers stay code-owned) -------------

def _coerce_reactions(raw: Any) -> List[Dict[str, str]]:
    out: List[Dict[str, str]] = []
    if not isinstance(raw, list):
        return out
    for r in raw:
        if not isinstance(r, dict):
            continue
        body = _s(r.get("body"))
        if not body:
            continue
        source = _s(r.get("source")) or "twitter"
        handle = _s(r.get("handle"))
        name = _s(r.get("name"))
        if source in ("twitter", "discord") and not handle:
            handle = _CHORUS[len(out) % len(_CHORUS)][0]
        if handle and not name:
            name = _CHORUS_NAMES.get(handle, handle.lstrip("@"))
        entry: Dict[str, str] = {"source": source, "body": body}
        if handle:
            entry["handle"] = handle
        if name:
            entry["name"] = name
        for opt in ("publication", "channel"):
            v = _s(r.get(opt))
            if v:
                entry[opt] = v
        out.append(entry)
        if len(out) >= 4:
            break
    return out


def _apply_row(beat: Dict[str, Any], row: Dict[str, Any]) -> None:
    """Copy prose fields from an LLM row into the beat IN PLACE. stats_deltas,
    stats_after, seeds, day, turn, severity, category are NEVER touched —
    numbers stay code-owned."""
    title = _s(row.get("title")) or _s(row.get("headline"))
    body = _s(row.get("body"))
    if title:
        beat["title"] = title
    if body:
        beat["body"] = body
    rationale = _s(row.get("stat_rationale"))
    if rationale:
        beat["stat_rationale"] = rationale
    reactions = _coerce_reactions(row.get("reactions"))
    if reactions:
        beat["reactions"] = reactions
    tweet = row.get("artifact_tweet")
    if isinstance(tweet, dict):
        tweet = tweet.get("body")
    tweet = _s(tweet)
    beat["artifact_tweet"] = tweet or None

    if beat.get("kind") == "mini":
        outcome = _s(row.get("outcome")) or body
        if outcome:
            beat["outcome"] = outcome
        if not beat.get("body"):
            beat["body"] = outcome
        return

    # large: choices labels/tones (ids are skeleton law), CEO fields
    skel = [c for c in (beat.get("choices") or []) if isinstance(c, dict)]
    rows = row.get("choices")
    if isinstance(rows, list):
        by_id: Dict[str, Dict[str, Any]] = {}
        for rc in rows:
            if isinstance(rc, dict):
                by_id[_s(rc.get("id"))] = rc
        for i, c in enumerate(skel):
            rc = by_id.get(c.get("id"))
            if rc is None and i < len(rows) and isinstance(rows[i], dict):
                rc = rows[i]  # positional fallback when ids drifted
            if not rc:
                continue
            label = _s(rc.get("label"))
            if label:
                c["label"] = label
            tone = _s(rc.get("tone"))
            if tone:
                c["tone"] = tone
    ids = [c.get("id") for c in skel]
    cid = _s(row.get("ceo_choice"))
    if cid in ids:
        beat["ceo_choice"] = cid
    reasoning = _s(row.get("ceo_reasoning"))
    if reasoning:
        beat["ceo_reasoning"] = reasoning
    justification = _s(row.get("justification"))
    if justification:
        beat["justification"] = justification


_FALLBACK_LABELS = {
    "unhinged": "double down in public",
    "midwit": "issue a careful statement",
    "rare-cucked": "quietly comply",
    "based": "ship through it",
}


def _fallback_rationale(deltas: Dict[str, Any]) -> str:
    keys = [k for k in (deltas or {}) if k != "day"]
    if not keys:
        return "No stat movement; the day count advances."
    keys.sort(key=lambda k: -abs(int(deltas.get(k) or 0)))
    parts = []
    for k in keys[:2]:
        v = int(deltas.get(k) or 0)
        parts.append("%s %s %s" % (
            k.replace("_", " "), "up" if v > 0 else "down", "{:,}".format(abs(v))))
    return "; ".join(parts) + "."


def _ensure_beat_prose(beat: Dict[str, Any], bible: Optional[Dict[str, Any]]) -> None:
    """Deterministic minimal prose for any still-empty field so playback
    never starves. Fired after the (retried) LLM pass."""
    cname, fname, _ = _bible_names(bible)
    src = beat.get("_src") or {}
    if not (beat.get("title") or "").strip():
        beat["title"] = _slot_fill(src.get("title") or "", bible) or \
            "Day %s at %s" % (beat.get("day"), cname)
    if not (beat.get("body") or "").strip():
        body = _first_sentences(_slot_fill(src.get("body") or "", bible), 2)
        beat["body"] = body or (
            "%s has a quiet stretch. It will not last." % cname)
    if not (beat.get("stat_rationale") or "").strip():
        beat["stat_rationale"] = _fallback_rationale(beat.get("stats_deltas") or {})

    if beat.get("kind") == "mini":
        if not (beat.get("outcome") or "").strip():
            beat["outcome"] = _first_sentences(beat.get("body") or "", 1) or \
                "It resolves quietly. Nobody screenshots it. Yet."
        return

    choices = [c for c in (beat.get("choices") or []) if isinstance(c, dict)]
    for c in choices:
        if not (c.get("label") or "").strip():
            c["label"] = _FALLBACK_LABELS.get(c.get("tone") or "", "hold the line")
    ids = [c.get("id") for c in choices]
    if beat.get("ceo_choice") not in ids and ids:
        beat["ceo_choice"] = ids[0]
    picked = next((c for c in choices if c.get("id") == beat.get("ceo_choice")), None)
    label = (picked or {}).get("label") or "the obvious play"
    if not (beat.get("ceo_reasoning") or "").strip():
        beat["ceo_reasoning"] = (
            "ok — %s. midwit move is to wait for legal. we don't wait — "
            "%s. everything else is regret-minimization brain." % (
                (beat.get("title") or "this").lower(), label.lower())
        )
    if not (beat.get("justification") or "").strip():
        beat["justification"] = "we move first. speed is the moat."
    if len([r for r in (beat.get("reactions") or []) if isinstance(r, dict)]) < 2:
        h1, n1 = _CHORUS[(beat.get("turn") or 0) % len(_CHORUS)]
        h2, n2 = _CHORUS[((beat.get("turn") or 0) + 3) % len(_CHORUS)]
        beat["reactions"] = [
            {"source": "twitter", "handle": h1, "name": n1,
             "body": "watching %s speedrun the case study. bookmarking." % cname.lower()},
            {"source": "twitter", "handle": h2, "name": n2,
             "body": "%s says '%s'. sure. pattern recognition says otherwise."
                     % (fname.split(" ")[0].lower(), label.lower())},
        ]


async def write_episode(state: RunState, script: Dict[str, Any],
                        episode_idx: int,
                        on_event: Optional[Callable] = None) -> None:
    """Write prose for one episode IN PLACE, bump episodes_ready. LLM failure
    degrades to retry-once then deterministic fallback prose — never raises
    for model reasons, never touches the numbers."""
    beats = [b for b in (script.get("beats") or [])
             if int(b.get("episode", 1)) == episode_idx]
    total = int(script.get("episodes_total", 1))
    await _emit(on_event, "script.progress", {
        "stage": "episode_writing",
        "detail": "writing prose for %d beats" % len(beats),
        "episode": episode_idx, "of": total,
    })

    if beats:
        # ~8000 for a standard episode; scaled up so short mode's single
        # 30-beat episode doesn't truncate-starve.
        max_tokens = min(16000, max(8000, 260 * len(beats) + 1500))
        loop = asyncio.get_running_loop()

        async def call(subset: List[Dict[str, Any]],
                       retry_refs: Optional[List[str]]) -> Optional[Dict[str, Any]]:
            prompt = _episode_user_prompt(state, script, subset, episode_idx,
                                          retry_refs=retry_refs)
            try:
                return await loop.run_in_executor(
                    None, functools.partial(
                        _call_showrunner_llm, state, prompt, max_tokens))
            except Exception as exc:  # noqa: BLE001 — degrade, don't die
                print("[showrunner] run=%s ep=%d LLM call raised %s: %s"
                      % (state.run_id, episode_idx, type(exc).__name__, exc))
                return None

        def apply_output(tool_input: Optional[Dict[str, Any]],
                         subset: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
            """Returns the beats still missing prose after application."""
            by_ref = {_beat_ref(b): b for b in subset}
            filled: Set[str] = set()
            rows = (tool_input or {}).get("beats")
            if isinstance(rows, list):
                pos = 0
                for row in rows:
                    if not isinstance(row, dict):
                        continue
                    ref = _s(row.get("ref"))
                    beat = by_ref.get(ref)
                    if beat is None and pos < len(subset):
                        beat = subset[pos]  # positional rescue for junk refs
                    pos += 1
                    if beat is None:
                        continue
                    _apply_row(beat, row)
                    filled.add(_beat_ref(beat))
            return [b for b in subset
                    if _beat_ref(b) not in filled
                    or not (b.get("title") or "").strip()
                    or not (b.get("body") or "").strip()]

        missing = apply_output(await call(beats, None), beats)
        if missing:
            refs = [_beat_ref(b) for b in missing]
            print("[showrunner] run=%s ep=%d retrying %d missing beats: %s"
                  % (state.run_id, episode_idx, len(missing), refs[:8]))
            missing = apply_output(await call(missing, refs), missing)
        # After one retry: deterministic fallback so playback never starves.
        for b in beats:
            _ensure_beat_prose(b, state.bible)

    script["episodes_ready"] = max(int(script.get("episodes_ready", 0)), episode_idx)
    corpus = None
    try:
        corpus = get_corpus()
    except Exception:
        pass
    _validate_and_repair(state, script, corpus)
    await _emit(on_event, "script.progress", {
        "stage": "episode_ready",
        "detail": "episode %d prose complete" % episode_idx,
        "episode": episode_idx, "of": total,
    })


# ───────────────────────────────────────────────────────────────────────────
# Orchestration
# ───────────────────────────────────────────────────────────────────────────

# Keep background episode tasks referenced — bare create_task results get GC'd.
_BG_TASKS: Set["asyncio.Task"] = set()


async def _write_remaining(state: RunState, script: Dict[str, Any],
                           on_event: Optional[Callable],
                           persist_cb: Optional[Callable]) -> None:
    total = int(script.get("episodes_total", 1))
    for ep in range(2, total + 1):
        try:
            await write_episode(state, script, ep, on_event=on_event)
        except Exception:  # noqa: BLE001 — a bug must not strand playback
            traceback.print_exc()
            for b in (script.get("beats") or []):
                if int(b.get("episode", 1)) == ep:
                    _ensure_beat_prose(b, state.bible)
            script["episodes_ready"] = max(int(script.get("episodes_ready", 0)), ep)
        await _maybe_persist(persist_cb)
    await _emit(on_event, "script.progress", {
        "stage": "complete", "detail": "all episodes ready",
        "episode": total, "of": total,
    })


async def generate_script(state: RunState,
                          on_event: Optional[Callable] = None,
                          persist_cb: Optional[Callable] = None) -> Dict[str, Any]:
    """Build the full run script. Returns once episode 1 prose is ready
    (playback may start); remaining episodes fill in via a background task
    mutating the SAME dict. Caller stores the returned dict on the run."""
    corpus = get_corpus()
    await _emit(on_event, "script.progress", {
        "stage": "skeleton", "detail": "plotting the whole run",
        "episode": 0, "of": 0,
    })
    script = build_skeleton(state, corpus)
    _validate_and_repair(state, script, corpus)
    total = int(script.get("episodes_total", 1))
    n_large = sum(1 for b in script["beats"] if b.get("kind") == "large")
    await _emit(on_event, "script.progress", {
        "stage": "skeleton_ready",
        "detail": "%d beats plotted; ending locked: %s" % (
            len(script["beats"]), script.get("endgame_id") or "(open)"),
        "episode": 0, "of": total,
    })
    print("[showrunner] run=%s skeleton: %d beats (%d large) → %s, %d episode(s)"
          % (state.run_id, len(script["beats"]), n_large,
             script.get("endgame_id"), total))

    await write_episode(state, script, 1, on_event=on_event)
    await _maybe_persist(persist_cb)

    if total > 1:
        task = asyncio.create_task(
            _write_remaining(state, script, on_event, persist_cb))
        _BG_TASKS.add(task)
        task.add_done_callback(_BG_TASKS.discard)
    else:
        await _emit(on_event, "script.progress", {
            "stage": "complete", "detail": "all episodes ready",
            "episode": total, "of": total,
        })
    return script


# ───────────────────────────────────────────────────────────────────────────
# Offline self-test — no network; usage_tracker is monkeypatched
# ───────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import types

    _REF_MARK = re.compile(r"### BEAT ref=(\S+)")

    def _fake_create(**kwargs):
        """Canned Showrunner output: one well-formed row per requested ref."""
        prompt = kwargs["messages"][0]["content"]
        rows = []
        for ref in _REF_MARK.findall(prompt):
            rows.append({
                "ref": ref,
                "title": "Canned title %s" % ref,
                "body": "Canned body for %s. The numbers are the numbers." % ref,
                "choices": [
                    {"id": "A", "label": "ship it anyway", "tone": "unhinged"},
                    {"id": "B", "label": "lawyer up", "tone": "midwit"},
                    {"id": "C", "label": "post through it", "tone": "based"},
                ],
                "ceo_choice": "A",
                "ceo_reasoning": "ok — canned beat. midwit move is waiting — "
                                 "we ship. skill issue for everyone else.",
                "justification": "we ship. that's the tweet.",
                "artifact_tweet": None,
                "stat_rationale": "numbers moved exactly as the script said.",
                "reactions": [
                    {"source": "twitter", "handle": "@litcapital",
                     "name": "Litquidity", "body": "bookmarking this arc"},
                    {"source": "twitter", "handle": "@AnonVCs",
                     "name": "Anonymous VCs", "body": "pattern recognition."},
                ],
                "headline": "Canned headline %s" % ref,
                "outcome": "It resolves. Quietly. For now.",
            })
        block = types.SimpleNamespace(
            type="tool_use", name="write_episode", input={"beats": rows})
        return types.SimpleNamespace(content=[block], usage=None)

    usage_tracker.tracked_messages_create = _fake_create  # offline

    fake_bible = {
        "company": {
            "display_name": "Delve", "name": "Delve", "industry": "ai_app",
            "funding_stage": "seed", "customer_archetype": "compliance teams",
            "product": {"category_noun": "compliance copilot"},
        },
        "market": {"competitors": ["Vanta", "Drata"]},
        "founders": [{"name": "Karun Kaushik", "persona_vibe": "stanford_dropout"}],
        "voice_anchors": {},
    }
    st = RunState(
        run_id="selftest-0001",
        settings={"length_mode": "micro", "craziness": "normal"},
    )
    st.bible = fake_bible

    got_events: List[Any] = []
    persist_calls: List[int] = []

    async def _collect(kind, data):
        got_events.append((kind, data))

    def _persist():
        persist_calls.append(1)

    script = asyncio.run(
        generate_script(st, on_event=_collect, persist_cb=_persist))

    errs = run_script.validate_script(
        script, initial_stats=script["initial_stats"])
    assert errs == [], "validate_script violations: %s" % errs
    assert script["episodes_ready"] == 1, script["episodes_ready"]
    assert script["episodes_total"] == 1
    assert script["endgame_id"].startswith("END-"), script["endgame_id"]

    larges = [b for b in script["beats"] if b["kind"] == "large"]
    assert len(larges) == st.max_turns() == 5
    for b in larges:
        ids = [c["id"] for c in b["choices"]]
        assert len(ids) >= 2, b
        assert all((c.get("label") or "").strip() for c in b["choices"]), b
        assert b["ceo_choice"] in ids, b
        assert b["title"].strip() and b["body"].strip(), b
        assert b["ceo_reasoning"].strip() and b["justification"].strip(), b
        assert b["stat_rationale"].strip(), b
        assert len(b["reactions"]) >= 2, b
    minis = [b for b in script["beats"] if b["kind"] == "mini"]
    for b in minis:
        assert b["mini_id"] and b["title"].strip() and b["outcome"].strip(), b
    # source ids strictly unique, days monotonic
    sids = [b["source_event_id"] for b in script["beats"] if b.get("source_event_id")]
    assert len(sids) == len(set(sids))
    days = [b["day"] for b in script["beats"]]
    assert days == sorted(days)
    assert persist_calls, "persist_cb never called"
    assert any(d.get("stage") == "episode_ready" for _, d in got_events)
    assert any(d.get("stage") == "complete" for _, d in got_events)

    # determinism: same run_id → identical skeleton
    sk1 = build_skeleton(st, get_corpus())
    sk2 = build_skeleton(st, get_corpus())
    assert json.dumps(sk1, sort_keys=True) == json.dumps(sk2, sort_keys=True)

    print("PASS — %d beats (%d large, %d mini), endgame=%s, episodes=%d/%d, "
          "persists=%d, progress_events=%d" % (
              len(script["beats"]), len(larges), len(minis),
              script["endgame_id"], script["episodes_ready"],
              script["episodes_total"], len(persist_calls), len(got_events)))
