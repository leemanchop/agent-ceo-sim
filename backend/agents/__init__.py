"""LLM agent implementations for agent-ceo-sim.

Five agents:
- Researcher  (one-shot, run-start,  claude-opus-4-7   with web_search)
- CEO         (per-turn,              claude-sonnet-4-6, streaming)
- Oracle      (per-turn,              claude-sonnet-4-6, prompt-cached corpus)
- Editor      (per-turn,              claude-sonnet-4-6) — was Haiku, upgraded
- PostMortem  (one-shot, run-end,     claude-opus-4-7)  — Bloomberg/Levine long read

All agents share the defamation preamble in DEFAMATION_PREAMBLE, and every
Anthropic SDK call goes through `usage_tracker.tracked_messages_create` so we
get cost + rate-limit telemetry on every response.
"""

from .common import (
    DEFAMATION_PREAMBLE,
    MODEL_RESEARCHER,
    MODEL_POST_MORTEM,
    MODEL_CEO,
    MODEL_ORACLE,
    MODEL_EDITOR,
)

__all__ = [
    "DEFAMATION_PREAMBLE",
    "MODEL_RESEARCHER",
    "MODEL_POST_MORTEM",
    "MODEL_CEO",
    "MODEL_ORACLE",
    "MODEL_EDITOR",
]
