"""
Modal app for agent-ceo-sim backend.

This file wires the FastAPI app behind Modal, mounts the world/ corpus into
the image, and exposes the /usage, /usage/{run_id}, /rate_limits endpoints.

The full SSE streaming flow (researcher → per-turn CEO/Oracle/Editor →
post_mortem) lives in the agent modules; this file is the deployment + HTTP
shell.

Local entrypoints:
    modal run backend/modal_app.py::dump_usage --run-id=<id>
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, Optional

import modal


# ---- Modal image ---------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent

image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install(
        "anthropic>=0.40.0",
        "fastapi>=0.115.0",
        "uvicorn>=0.30.0",
        "pyyaml>=6.0",
        "httpx>=0.27.0",
        "pydantic>=2.8",
    )
    # Mount the world corpus so corpus_loader can read it at /world.
    .add_local_dir(str(REPO_ROOT / "world"), remote_path="/world")
    # Mount the game design canon (achievements.md, etc.) at /game so
    # achievement_engine can parse triggers at module load.
    .add_local_dir(str(REPO_ROOT / "game"), remote_path="/game")
    # And the backend source itself.
    .add_local_dir(str(REPO_ROOT / "backend"), remote_path="/root/backend")
)

app = modal.App("agent-ceo-sim", image=image)


# ---- Modal Volume for persistent run state -------------------------------
# Mounted at /data inside the container. SQLite DB lives at /data/runs.db.
# Cold-restarts rehydrate the in-memory _RUNS cache from this volume.
runs_volume = modal.Volume.from_name(
    "agent-ceo-sim-runs", create_if_missing=True,
)


# ---- FastAPI app ---------------------------------------------------------

def _build_fastapi():
    """Built lazily inside the Modal container so imports happen with the
    image's dependencies available."""
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware

    # Make the backend package importable inside the container (image mounts
    # backend/ -> /root/backend) AND locally under `modal serve`.
    for candidate in ("/root/backend", str(REPO_ROOT / "backend")):
        if os.path.isdir(candidate) and candidate not in sys.path:
            sys.path.insert(0, candidate)
    import usage_tracker  # type: ignore
    import run_store  # type: ignore  # SQLite-on-volume persistent run store
    import routes  # type: ignore  # SSE + per-run REST surface

    # Ensure the runs schema exists before any request lands. Idempotent —
    # safe to call on every container boot.
    run_store.init_db()

    fapi = FastAPI(title="agent-ceo-sim")

    # CORS — production domain + Vercel previews + local dev. Hackathon-open;
    # tighten before public launch.
    # CORS — accept apex + www + Vercel previews + localhost dev.
    # Browsers preflight POSTs with OPTIONS; this middleware short-circuits
    # those before they hit the route layer. Origins listed both as exact
    # matches (preferred) and as a regex (covers preview deploys).
    fapi.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://30u30.fail",
            "https://www.30u30.fail",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
        ],
        # vercel preview deploys + 30u30.fail subdomain catch-all
        allow_origin_regex=r"https://(.*\.vercel\.app|.*\.30u30\.fail)",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=86400,  # cache preflight for 24h
    )

    @fapi.get("/healthz")
    def healthz():
        # Surface achievement-engine status so a missing /game mount is
        # observable from the outside without grepping logs.
        ach_status: Dict[str, Any] = {"enabled": False, "loaded_count": 0}
        try:
            import achievement_engine  # type: ignore
            ach_status = achievement_engine.engine_status()
        except Exception:
            pass
        # Scripted-engine availability — surfaces the guarded-import failure
        # mode (routes falls back to the live engine silently otherwise).
        scripted: Dict[str, Any] = {"available": False}
        try:
            import showrunner  # type: ignore
            import playback  # type: ignore
            scripted = {"available": True}
        except Exception as e:
            scripted = {"available": False, "error": f"{type(e).__name__}: {e}"}
        return {"ok": True, "achievement_engine": ach_status,
                "scripted_engine": scripted}

    from fastapi import Request

    def _admin(request: Request) -> None:
        expected = os.environ.get("ACES_ADMIN_TOKEN", "")
        if not expected:
            return
        supplied = (request.query_params.get("token")
                    or request.headers.get("x-admin-token") or "")
        if supplied != expected:
            raise HTTPException(403, "admin token required")

    @fapi.get("/usage")
    def usage_all(request: Request):
        _admin(request)
        return usage_tracker.summarize(None)

    @fapi.get("/usage/{run_id}")
    def usage_one(run_id: str, request: Request):
        _admin(request)
        if not run_id:
            raise HTTPException(400, "run_id required")
        return usage_tracker.summarize(run_id)

    @fapi.get("/rate_limits")
    def rate_limits(request: Request):
        _admin(request)
        return usage_tracker.current_rate_limits()

    # Mount per-run SSE + REST routes (POST /run/create, GET /run/{id}/stream, …).
    routes.install_routes(fapi)

    return fapi


@app.function(
    secrets=[
        modal.Secret.from_name("anthropic"),
        # Optional admin token (ACES_ADMIN_TOKEN) gating /usage + /admin/*.
        modal.Secret.from_name("admin"),
    ],
    timeout=60 * 60,  # 1 hour for long runs
    volumes={"/data": runs_volume},  # persistent run-state SQLite
    # Pin to a single container so the in-memory _RUNS cache + decision
    # queues survive across requests within a run. Modal Volume sync between
    # replicas is eventually-consistent and would 404 GET /run/{id}/start
    # immediately after POST /run/create on a different replica. For the
    # hackathon's traffic this is fine — multi-replica scale-out comes later
    # via a real backing store (Postgres + Redis pubsub).
    # min_containers=0: spin down when idle (solo-dev / free-tier friendly —
    # a pinned warm container eats ~$15-30/mo of credits). Cold start ~5s.
    # max_containers=1 stays: in-memory run state requires a single replica.
    min_containers=0,
    max_containers=1,
)
# Each ASGI container handles many concurrent SSE connections. Bump the
# concurrent-input cap so one container can serve many in-flight runs.
@modal.concurrent(max_inputs=50)
@modal.asgi_app()
def fastapi_app():
    return _build_fastapi()


# ---- Local entrypoints ---------------------------------------------------

@app.local_entrypoint()
def dump_usage(run_id: Optional[str] = None, limit: int = 1000):
    """
    Dump usage rows from the SQLite DB to stdout as pretty JSON.

    Usage:
        modal run backend/modal_app.py::dump_usage
        modal run backend/modal_app.py::dump_usage --run-id=01H...

    NOTE: this runs *locally*, not inside the Modal container. It reads the
    LOCAL /tmp/usage.db. To inspect a deployed container's DB, you'd attach
    a Modal volume (see TODO in usage_tracker.py) and read it from a Modal
    function instead. For the hackathon, /tmp/usage.db on the local box (when
    running `modal serve`) is the source of truth.
    """
    sys.path.insert(0, str(REPO_ROOT / "backend"))
    import usage_tracker  # type: ignore

    rows = usage_tracker.dump_rows(run_id=run_id, limit=limit)
    summary = usage_tracker.summarize(run_id)
    print(json.dumps({"summary": summary, "rows": rows}, indent=2, default=str))


@app.local_entrypoint()
def usage_summary(run_id: Optional[str] = None):
    """Print just the summary block."""
    sys.path.insert(0, str(REPO_ROOT / "backend"))
    import usage_tracker  # type: ignore
    print(json.dumps(usage_tracker.summarize(run_id), indent=2, default=str))
