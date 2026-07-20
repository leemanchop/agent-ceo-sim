"""
World corpus loader.

Reads the markdown files under /world (added to the Modal image via add_local_dir)
and produces a structured Python representation that the Oracle reads on every turn.

The parsing is deliberately simple — regex over the `## EVT-...`, `## FIG-...`,
`## END-...`, `## SF-...` headers in `world/`. We don't try to fully parse the
metadata into structured fields; we just chunk the records and keep the raw
markdown so the Oracle can reason over the text directly. This keeps prompt
caching cheap (the corpus is ~50k tokens, cached once per Modal container).

The result is module-level cached on first import; subsequent imports are free.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional


# Default world path — Modal image mounts world/ at /world via add_local_dir.
# Falls back to a sibling repo path for local `modal serve` development.
DEFAULT_WORLD_ROOTS = [
    "/world",
    str(Path(__file__).parent.parent / "world"),
]


@dataclass
class CorpusRecord:
    """A single ## record (event, figure, endgame, secret finding, source)."""
    record_id: str             # e.g. "EVT-FR-002", "FIG-VC-008", "END-PRISON-001"
    kind: str                  # "EVT" | "FIG" | "END" | "SF" | "SRC"
    category: str              # "FR", "PRESS", "PRISON", etc.
    title: str                 # the human title after the em-dash
    raw_markdown: str          # full record text including header
    source_file: str           # filename it came from
    tags: List[str] = field(default_factory=list)
    severity: Optional[str] = None
    length_eligibility: List[str] = field(default_factory=list)
    prereqs: List[str] = field(default_factory=list)       # ALL must be active
    prereqs_any: List[str] = field(default_factory=list)   # at least ONE active


@dataclass
class WorldCorpus:
    """Full parsed corpus."""
    events: List[CorpusRecord] = field(default_factory=list)
    figures: List[CorpusRecord] = field(default_factory=list)
    endgames: List[CorpusRecord] = field(default_factory=list)
    secret_findings: List[CorpusRecord] = field(default_factory=list)
    sources: List[CorpusRecord] = field(default_factory=list)
    templates: Dict[str, str] = field(default_factory=dict)  # template_id -> raw markdown
    schemas_md: str = ""
    tags_md: str = ""

    def all_records(self) -> List[CorpusRecord]:
        return (
            self.events + self.figures + self.endgames
            + self.secret_findings + self.sources
        )

    def total_chars(self) -> int:
        return sum(len(r.raw_markdown) for r in self.all_records())


# Header pattern — matches `## EVT-FR-002 — "Tiger's six-hour term sheet"`
# and `### FIG-VC-001 — ...` (figures/findings/sources files use h3 headings;
# the old `##`-only pattern silently parsed cast.md, secret_findings.md, and
# sources/systems.md to ZERO records — the Oracle never saw the cast).
# Also handles unicode em-dash and hyphen variants.
_HEADER_RE = re.compile(
    r"^#{2,3}\s+(?P<id>(EVT|FIG|END|SF|SRC)-[A-Z0-9_]+-[A-Z0-9_]+)\s*[—\-–]\s*(?P<title>.+?)\s*$",
    re.MULTILINE,
)

_TAGS_RE = re.compile(r"^\s*-\s*tags:\s*\[(?P<tags>[^\]]*)\]", re.MULTILINE)
_SEVERITY_RE = re.compile(r"^\s*-\s*severity:\s*(?P<sev>[SMLX]+)", re.MULTILINE)
_LEN_ELIG_RE = re.compile(r"^\s*-\s*length_eligibility:\s*\[(?P<le>[^\]]*)\]", re.MULTILINE)
_PREREQS_RE = re.compile(r"^\s*-\s*prereqs:\s*\[(?P<p>[^\]]*)\]", re.MULTILINE)
_PREREQS_ANY_RE = re.compile(r"^\s*-\s*prereqs_any:\s*\[(?P<p>[^\]]*)\]", re.MULTILINE)


def _split_records(text: str, source_file: str) -> List[CorpusRecord]:
    """Split a markdown file into individual records based on `## ID` headers."""
    records: List[CorpusRecord] = []
    matches = list(_HEADER_RE.finditer(text))
    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        body = text[start:end].strip()
        rid = m.group("id")
        kind = rid.split("-", 1)[0]
        parts = rid.split("-")
        category = parts[1] if len(parts) > 1 else ""
        title = m.group("title").strip().strip('"').strip("'")

        rec = CorpusRecord(
            record_id=rid,
            kind=kind,
            category=category,
            title=title,
            raw_markdown=body,
            source_file=source_file,
        )
        # Best-effort metadata extraction.
        tm = _TAGS_RE.search(body)
        if tm:
            rec.tags = [t.strip().strip(",") for t in tm.group("tags").split(",") if t.strip()]
        sm = _SEVERITY_RE.search(body)
        if sm:
            rec.severity = sm.group("sev")
        lm = _LEN_ELIG_RE.search(body)
        if lm:
            rec.length_eligibility = [
                t.strip().strip(",") for t in lm.group("le").split(",") if t.strip()
            ]
        pm = _PREREQS_RE.search(body)
        if pm:
            rec.prereqs = [t.strip().strip(",") for t in pm.group("p").split(",") if t.strip()]
        pam = _PREREQS_ANY_RE.search(body)
        if pam:
            rec.prereqs_any = [t.strip().strip(",") for t in pam.group("p").split(",") if t.strip()]
        records.append(rec)
    return records


def _resolve_world_root() -> Path:
    """Find the world/ directory at runtime."""
    for candidate in DEFAULT_WORLD_ROOTS:
        p = Path(candidate)
        if p.exists() and (p / "schemas.md").exists():
            return p
    raise RuntimeError(
        f"Could not locate world/ corpus. Tried: {DEFAULT_WORLD_ROOTS}. "
        "If running on Modal, ensure add_local_dir mounts world/ to /world."
    )


def _read(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""


def load_corpus() -> WorldCorpus:
    """Parse all corpus files. Called once at module import."""
    root = _resolve_world_root()
    corpus = WorldCorpus(
        schemas_md=_read(root / "schemas.md"),
        tags_md=_read(root / "tags.md"),
    )

    events_dir = root / "events"
    if events_dir.exists():
        for f in sorted(events_dir.glob("*.md")):
            corpus.events.extend(_split_records(_read(f), f.name))

    figures_dir = root / "figures"
    if figures_dir.exists():
        for f in sorted(figures_dir.glob("*.md")):
            corpus.figures.extend(_split_records(_read(f), f.name))

    endgames_dir = root / "endgames"
    if endgames_dir.exists():
        for f in sorted(endgames_dir.glob("*.md")):
            corpus.endgames.extend(_split_records(_read(f), f.name))

    sf_path = root / "secret_findings.md"
    if sf_path.exists():
        corpus.secret_findings.extend(_split_records(_read(sf_path), "secret_findings.md"))

    sources_dir = root / "sources"
    if sources_dir.exists():
        for f in sorted(sources_dir.glob("*.md")):
            corpus.sources.extend(_split_records(_read(f), f.name))

    templates_dir = root / "templates"
    if templates_dir.exists():
        for f in sorted(templates_dir.glob("*.md")):
            corpus.templates[f.stem] = _read(f)

    return corpus


# Module-level cache. Imported once per container; the corpus does not change at runtime.
_CORPUS: Optional[WorldCorpus] = None


def get_corpus() -> WorldCorpus:
    global _CORPUS
    if _CORPUS is None:
        _CORPUS = load_corpus()
    return _CORPUS


# ---- helpers used by the Oracle prompt builder ----


def filter_events(
    corpus: WorldCorpus,
    *,
    length_mode: str,
    craziness: str,
    severity_floor: Optional[str] = None,
    industry: Optional[str] = None,
    exclude_ids: Optional[List[str]] = None,
) -> List[CorpusRecord]:
    """Cheap pre-filter on length, craziness band, severity. The Oracle does
    the real chain-weight selection in-prompt — we just cut down the candidate
    pool before stuffing it in."""
    sev_rank = {"S": 1, "M": 2, "L": 3, "XL": 4}
    floor = sev_rank.get(severity_floor or "S", 1)
    exclude = set(exclude_ids or [])
    industry_tag = (industry or "").lower().strip() or None
    out = []
    for ev in corpus.events:
        if ev.record_id in exclude:
            continue
        if ev.length_eligibility and length_mode not in ev.length_eligibility:
            continue
        if ev.severity and sev_rank.get(ev.severity, 1) < floor:
            continue
        if f"craze_{craziness}" not in ev.tags and any(t.startswith("craze_") for t in ev.tags):
            # event has a craze tag but not one matching ours — skip
            continue
        if industry_tag and any(
            t.startswith("industry_") and t != f"industry_{industry_tag}" for t in ev.tags
        ):
            # event is tagged for a different industry — skip
            continue
        out.append(ev)
    return out


def render_corpus_for_prompt(corpus: WorldCorpus, *, max_chars: int = 180_000) -> str:
    """Render the full corpus as a single string suitable for prompt-caching.
    The Oracle reads this once; ephemeral cache_control on the surrounding
    system block makes it nearly free per turn."""
    # ORDER MATTERS: the tail gets truncated at max_chars. Figures (the cameo
    # cast + chorus handles) and endgames are small and load-bearing for voice;
    # events are the bulk and are ALSO surfaced per-turn via the uncached
    # candidate shortlist (full text) — so events go last and absorb the cut.
    parts: List[str] = []
    parts.append("# WORLD CORPUS — schemas\n\n" + corpus.schemas_md)
    parts.append("\n\n# WORLD CORPUS — tag vocabulary\n\n" + corpus.tags_md)

    parts.append("\n\n# WORLD CORPUS — figures (cameo cast — use these names/handles for reactions)\n")
    for fg in corpus.figures:
        parts.append("\n\n" + fg.raw_markdown)

    parts.append("\n\n# WORLD CORPUS — endgames\n")
    for eg in corpus.endgames:
        parts.append("\n\n" + eg.raw_markdown)

    parts.append("\n\n# WORLD CORPUS — events\n")
    for ev in corpus.events:
        parts.append("\n\n" + ev.raw_markdown)

    text = "".join(parts)
    if len(text) > max_chars:
        # Trim the tail (events) — the per-turn shortlist re-surfaces event
        # text uncached, so truncated events remain reachable.
        text = text[:max_chars] + "\n\n[corpus truncated to fit prompt budget]"
    return text


# Eagerly load on import so cold-start cost lands at container boot, not turn 1.
try:
    get_corpus()
except Exception:  # pragma: no cover — local dev without /world
    pass
