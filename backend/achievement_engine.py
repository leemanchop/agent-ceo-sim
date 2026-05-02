"""
Achievement engine — parses the canonical achievement registry from
`game/achievements.md` and evaluates triggers on demand against a `RunState`.

Three responsibilities:

  1. Parse achievements at module load (with module-level cache).
  2. Evaluate triggers on demand and return newly-unlocked records.
  3. Stay defensive: malformed records are skipped with a warning, and
     a parse failure disables the engine for the run instead of 500-ing.

The trigger taxonomy in the markdown:
  - stat_threshold   : compare against `state.stats`
  - endgame_reached  : fire when `just_endgame` matches an id or archetype
  - event_chain      : require a list of foreshadow seeds to be active/paid
  - meta             : across-runs cumulative — currently SKIPPED (the
                       run-persistence agent is wiring the per-user store).

The engine is stdlib-only by design — no new pip deps.
"""

from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

logger = logging.getLogger("achievement_engine")


# ---------------------------------------------------------------------------
# Module-level state
# ---------------------------------------------------------------------------

# Disabled if parsing fails — /healthz can read this. The engine becomes a
# silent no-op when this is False so the rest of the run stays alive.
_achievement_engine_status: bool = True


def engine_status() -> Dict[str, Any]:
    return {
        "enabled": _achievement_engine_status,
        "loaded_count": len(_REGISTRY) if _REGISTRY is not None else 0,
        "skipped_count": _SKIPPED_COUNT,
    }


# ---------------------------------------------------------------------------
# Record dataclass
# ---------------------------------------------------------------------------


@dataclass
class AchievementRecord:
    id: str                                # ACH-RUN-001
    category: str                          # RUN | STAT | END | CHAIN | META | BET | SECRET
    rarity: str                            # common | uncommon | rare | legendary | hidden
    name: str
    description: str
    share_text: str
    icon_hint: str
    trigger_kind: str                      # stat_threshold | endgame_reached | event_chain | meta
    trigger: Dict[str, Any]                # structured trigger condition
    visible_before_unlock: bool = True
    repeatable: bool = False


# ---------------------------------------------------------------------------
# Parser
# ---------------------------------------------------------------------------

# Matches "### ACH-RUN-001 — \"Survived 365 Days\"" (also handles --, –, em/en dashes).
_HEADER_RE = re.compile(
    r"^###\s+(?P<id>ACH-[A-Z]+-\d+)\s*[—\-–]\s*(?P<name>.+?)\s*$",
    re.MULTILINE,
)

_FIELD_RE = re.compile(
    r"^\s*-\s*(?P<key>[a-z_]+)\s*:\s*(?P<val>.+?)\s*$",
    re.MULTILINE,
)


# Default search paths — Modal image mounts game/ at /game (added in modal_app.py).
# Falls back to a sibling repo path for `modal serve` local dev.
DEFAULT_GAME_ROOTS = [
    "/game",
    str(Path(__file__).parent.parent / "game"),
]


def _resolve_achievements_path() -> Optional[Path]:
    for candidate in DEFAULT_GAME_ROOTS:
        p = Path(candidate) / "achievements.md"
        if p.exists():
            return p
    return None


def _strip_comments(s: str) -> str:
    """Remove `# inline comments` from a value snippet without breaking strings."""
    in_str: Optional[str] = None
    out: List[str] = []
    for ch in s:
        if in_str:
            out.append(ch)
            if ch == in_str:
                in_str = None
            continue
        if ch in ('"', "'"):
            in_str = ch
            out.append(ch)
            continue
        if ch == "#":
            break
        out.append(ch)
    return "".join(out).strip()


def _coerce_scalar(s: str) -> Any:
    """Coerce a YAML-ish scalar token into Python."""
    s = s.strip()
    if s == "" or s.lower() == "null":
        return None
    if s.lower() == "true":
        return True
    if s.lower() == "false":
        return False
    # Quoted string
    if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
        return s[1:-1]
    # Number with optional underscores like 1_000_000_000
    cleaned = s.replace("_", "")
    try:
        if "." in cleaned:
            return float(cleaned)
        return int(cleaned)
    except ValueError:
        pass
    return s


def _parse_inline_dict(s: str) -> Any:
    """
    Parse the inline pseudo-YAML used in the `trigger:` field.

    Examples we need to handle:
      { stat: "valuation", op: ">=", value: 1_000_000_000, scope: "peak" }
      { all_of: [seed_a, seed_b], within_turns: 12 }
      { endgame_id: "END-PRISON-001" }
      { endgame_archetype: "FLED" }
      { all_of: [{ stat: "valuation", op: ">=", value: 1_000_000_000, scope: "peak" }, ...] }

    Strategy: hand-rolled descent parser, tolerant. Returns the parsed Python
    value, or {} if the input is unparseable.
    """
    s = s.strip()
    if not s:
        return {}
    try:
        val, idx = _parse_value(s, 0)
        return val
    except Exception as e:
        logger.warning("achievement trigger parse failed for %r: %s", s, e)
        return {}


def _skip_ws(s: str, i: int) -> int:
    while i < len(s) and s[i] in " \t\n\r,":
        i += 1
    return i


def _parse_value(s: str, i: int) -> Tuple[Any, int]:
    i = _skip_ws(s, i)
    if i >= len(s):
        return None, i
    ch = s[i]
    if ch == "{":
        return _parse_object(s, i)
    if ch == "[":
        return _parse_array(s, i)
    if ch in ('"', "'"):
        return _parse_string(s, i)
    # bare scalar — read until , } ] (also stop at whitespace + colon for keys)
    return _parse_bare(s, i)


def _parse_string(s: str, i: int) -> Tuple[str, int]:
    quote = s[i]
    i += 1
    start = i
    while i < len(s) and s[i] != quote:
        # no escape support — the corpus doesn't use it
        i += 1
    val = s[start:i]
    if i < len(s):
        i += 1  # consume closing quote
    return val, i


def _parse_bare(s: str, i: int) -> Tuple[Any, int]:
    start = i
    depth = 0
    while i < len(s):
        ch = s[i]
        if depth == 0 and ch in ",}]":
            break
        if ch in "[{":
            depth += 1
        elif ch in "]}":
            if depth == 0:
                break
            depth -= 1
        i += 1
    raw = s[start:i].strip()
    return _coerce_scalar(raw), i


def _parse_object(s: str, i: int) -> Tuple[Dict[str, Any], int]:
    assert s[i] == "{"
    i += 1
    out: Dict[str, Any] = {}
    while True:
        i = _skip_ws(s, i)
        if i >= len(s):
            break
        if s[i] == "}":
            i += 1
            break
        # parse key (bare ident or quoted)
        if s[i] in ('"', "'"):
            key, i = _parse_string(s, i)
        else:
            key_start = i
            while i < len(s) and s[i] not in ":}":
                i += 1
            key = s[key_start:i].strip()
        i = _skip_ws(s, i)
        if i < len(s) and s[i] == ":":
            i += 1
        val, i = _parse_value(s, i)
        if key:
            out[key] = val
        i = _skip_ws(s, i)
    return out, i


def _parse_array(s: str, i: int) -> Tuple[List[Any], int]:
    assert s[i] == "["
    i += 1
    out: List[Any] = []
    while True:
        i = _skip_ws(s, i)
        if i >= len(s):
            break
        if s[i] == "]":
            i += 1
            break
        val, i = _parse_value(s, i)
        out.append(val)
        i = _skip_ws(s, i)
    return out, i


def _parse_record(rid: str, name: str, body: str) -> Optional[AchievementRecord]:
    """Pull the metadata fields out of a single ACH-* block. Returns None if
    we can't extract enough to make the record useful."""
    fields: Dict[str, str] = {}
    for m in _FIELD_RE.finditer(body):
        key = m.group("key")
        raw_val = _strip_comments(m.group("val"))
        fields[key] = raw_val

    trigger_kind = fields.get("trigger_kind", "").strip()
    rarity = fields.get("rarity", "").strip() or "common"
    icon_hint = fields.get("icon_hint", "").strip()
    share_text = fields.get("share_text", "").strip().strip('"').strip("'")
    visible = fields.get("visible_before_unlock", "true").strip().lower() != "false"
    repeatable = fields.get("repeatable", "false").strip().lower() == "true"

    trigger_raw = fields.get("trigger", "").strip()
    trigger = _parse_inline_dict(trigger_raw) if trigger_raw else {}

    # Description = the prose paragraph(s) between the field block and the next
    # subheading. Cheap heuristic: take the line(s) after the last `- field:` line.
    description = _extract_description(body)

    # Category from the id: ACH-RUN-001 → RUN
    parts = rid.split("-")
    category = parts[1] if len(parts) >= 3 else "RUN"

    # Strip surrounding quotes/em-dash artefacts from name.
    name_clean = name.strip().strip('"').strip("'")

    if not trigger_kind:
        # Some hidden/secret entries might be malformed — skip rather than crash.
        return None

    return AchievementRecord(
        id=rid,
        category=category,
        rarity=rarity,
        name=name_clean,
        description=description,
        share_text=share_text,
        icon_hint=icon_hint,
        trigger_kind=trigger_kind,
        trigger=trigger if isinstance(trigger, dict) else {},
        visible_before_unlock=visible,
        repeatable=repeatable,
    )


def _extract_description(body: str) -> str:
    """Best-effort: grab the first non-list paragraph after the `- field:` block."""
    lines = body.splitlines()
    # Find the last line that starts with `- ` (i.e., the last meta-field).
    last_field_idx = -1
    for i, ln in enumerate(lines):
        if re.match(r"^\s*-\s+[a-z_]+\s*:", ln):
            last_field_idx = i
    if last_field_idx < 0:
        return ""
    # Take the next non-empty paragraph.
    paragraph: List[str] = []
    for ln in lines[last_field_idx + 1:]:
        if ln.startswith("###") or ln.startswith("## "):
            break
        if ln.strip() == "" and paragraph:
            break
        if ln.strip() == "":
            continue
        paragraph.append(ln.strip())
    return " ".join(paragraph).strip()


# Module-level cache.
_REGISTRY: Optional[List[AchievementRecord]] = None
_SKIPPED_COUNT: int = 0


def load_registry() -> List[AchievementRecord]:
    """Parse achievements.md once. Disables the engine on hard failure."""
    global _REGISTRY, _SKIPPED_COUNT, _achievement_engine_status
    if _REGISTRY is not None:
        return _REGISTRY

    path = _resolve_achievements_path()
    if path is None:
        logger.warning(
            "achievement_engine: no achievements.md found in %s — engine disabled",
            DEFAULT_GAME_ROOTS,
        )
        _achievement_engine_status = False
        _REGISTRY = []
        return _REGISTRY

    try:
        text = path.read_text(encoding="utf-8")
    except Exception as e:
        logger.warning("achievement_engine: failed to read %s: %s", path, e)
        _achievement_engine_status = False
        _REGISTRY = []
        return _REGISTRY

    matches = list(_HEADER_RE.finditer(text))
    records: List[AchievementRecord] = []
    skipped = 0
    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[start:end]
        rid = m.group("id")
        name = m.group("name")
        try:
            rec = _parse_record(rid, name, body)
        except Exception as e:
            logger.warning("achievement_engine: skipping %s: %s", rid, e)
            rec = None
        if rec is None:
            skipped += 1
            continue
        records.append(rec)

    _REGISTRY = records
    _SKIPPED_COUNT = skipped
    logger.info(
        "achievement_engine: loaded %d achievements (skipped %d) from %s",
        len(records), skipped, path,
    )
    return _REGISTRY


def get_registry() -> List[AchievementRecord]:
    return load_registry()


# ---------------------------------------------------------------------------
# Evaluators
# ---------------------------------------------------------------------------


def _stat_value(state: Any, stat_name: str) -> Optional[float]:
    """Pull a stat out of state.stats, including a couple of derived ones."""
    if not stat_name:
        return None
    s = getattr(state, "stats", None)
    if s is None:
        return None
    if hasattr(s, stat_name):
        return getattr(s, stat_name)
    # Aliases / derived stats.
    if stat_name == "days_elapsed":
        return getattr(s, "day", 0)
    if stat_name == "burn_rate":
        return getattr(s, "burn", 0)
    if stat_name == "cash_on_hand":
        return getattr(s, "cash", 0)
    if stat_name == "runway_months":
        burn = getattr(s, "burn", 0)
        cash = getattr(s, "cash", 0)
        if burn and burn > 0:
            return cash / burn
        return None
    return None


def _compare(left: Any, op: str, right: Any) -> bool:
    if left is None or right is None:
        return False
    try:
        if op == ">=":
            return left >= right
        if op == "<=":
            return left <= right
        if op == ">":
            return left > right
        if op == "<":
            return left < right
        if op == "==":
            return left == right
        if op == "!=":
            return left != right
    except Exception:
        return False
    return False


def _eval_stat_clause(state: Any, clause: Dict[str, Any]) -> bool:
    stat = clause.get("stat")
    op = clause.get("op")
    value = clause.get("value")
    if not stat or not op:
        return False
    actual = _stat_value(state, stat)
    return _compare(actual, op, value)


def _eval_stat_threshold(state: Any, trigger: Dict[str, Any]) -> bool:
    if not isinstance(trigger, dict):
        return False
    if "all_of" in trigger:
        clauses = trigger.get("all_of") or []
        return all(_eval_stat_clause(state, c) for c in clauses if isinstance(c, dict))
    return _eval_stat_clause(state, trigger)


def _eval_endgame_reached(
    state: Any, trigger: Dict[str, Any], just_endgame: Optional[str]
) -> bool:
    if not just_endgame or not isinstance(trigger, dict):
        return False
    eg_id = trigger.get("endgame_id")
    if eg_id and just_endgame == eg_id:
        return True
    arch = trigger.get("endgame_archetype") or trigger.get("archetype")
    if arch and just_endgame.upper().startswith(f"END-{arch.upper()}"):
        return True
    # Some achievements use `archetype` directly without END- prefix.
    if arch and arch.upper() in just_endgame.upper():
        return True
    return False


def _active_or_paid_seeds(state: Any) -> Set[str]:
    """All seed ids that are currently active OR have paid off in the run."""
    out: Set[str] = set()
    tracker = getattr(state, "tracker", None)
    if tracker is None:
        return out
    seeds = getattr(tracker, "seeds", {}) or {}
    for sid, seed in seeds.items():
        status = getattr(seed, "status", "active")
        if status in ("active", "paid", "paid_lite"):
            out.add(sid)
    return out


def _eval_event_chain(state: Any, trigger: Dict[str, Any]) -> bool:
    if not isinstance(trigger, dict):
        return False
    seeds_present = _active_or_paid_seeds(state)
    # all_of with a flat seed list (or nested stat clauses for hybrids).
    all_of = trigger.get("all_of")
    if isinstance(all_of, list):
        for item in all_of:
            if isinstance(item, dict):
                # Hybrid: stat clause inside event_chain.
                if "stat" in item:
                    if not _eval_stat_clause(state, item):
                        return False
                elif "endgame_archetype" in item:
                    # Evaluated via just_endgame at caller — ignore here.
                    return False
                else:
                    return False
            elif isinstance(item, str):
                if item not in seeds_present:
                    return False
        return True
    # count_of: { count_of: [seed_id], op: ">=", value: N }
    count_of = trigger.get("count_of")
    if isinstance(count_of, list) and "op" in trigger and "value" in trigger:
        # Each entry is a seed id — count how many are in seeds_present.
        n = sum(1 for sid in count_of if isinstance(sid, str) and sid in seeds_present)
        return _compare(n, trigger["op"], trigger["value"])
    return False


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------


def evaluate_triggers(
    state: Any,
    *,
    just_endgame: Optional[str] = None,
    just_event_id: Optional[str] = None,
) -> List[AchievementRecord]:
    """Return achievements newly unlocked this turn.

    Idempotent — already-unlocked records (tracked on
    `state.achievements_unlocked`) won't fire again. The caller is responsible
    for adding the returned ids to that set (this function does it for them
    so the caller doesn't have to think about ordering).
    """
    if not _achievement_engine_status:
        return []

    registry = get_registry()
    if not registry:
        return []

    already: Set[str] = getattr(state, "achievements_unlocked", None) or set()
    # Defensive: ensure the attribute exists so subsequent callers can read it.
    if not hasattr(state, "achievements_unlocked"):
        try:
            state.achievements_unlocked = already
        except Exception:
            pass

    newly: List[AchievementRecord] = []
    for rec in registry:
        if rec.id in already:
            continue
        try:
            fired = _evaluate_one(rec, state, just_endgame=just_endgame)
        except Exception as e:
            logger.warning("achievement_engine: %s eval crashed: %s", rec.id, e)
            fired = False
        if fired:
            newly.append(rec)
            already.add(rec.id)

    # Mirror back so the route layer can re-read.
    try:
        state.achievements_unlocked = already
    except Exception:
        pass
    return newly


def _evaluate_one(
    rec: AchievementRecord, state: Any, *, just_endgame: Optional[str]
) -> bool:
    kind = rec.trigger_kind
    if kind == "stat_threshold":
        return _eval_stat_threshold(state, rec.trigger)
    if kind == "endgame_reached":
        return _eval_endgame_reached(state, rec.trigger, just_endgame)
    if kind == "event_chain":
        return _eval_event_chain(state, rec.trigger)
    if kind == "meta":
        # TODO: meta achievements need run_store.user_aggregate(...) — wired
        # by the run-persistence agent. Skip for now so we don't false-fire.
        return False
    return False


# Eagerly attempt to load on import so cold-start parsing lands at container
# boot instead of turn 1. Safe — load_registry() handles missing file.
try:
    load_registry()
except Exception:  # pragma: no cover
    _achievement_engine_status = False
