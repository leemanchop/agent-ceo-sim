#!/usr/bin/env python3
"""Procedurally synthesize stub SFX placeholders for agent-ceo-sim.

Outputs to web/public/sfx/. Files are intentionally LOW-volume and SHORT —
they're holdovers until proper Freesound/Pixabay assets are sourced.

Usage:
    python3 scripts/generate-sfx.py
"""

from __future__ import annotations

import math
import struct
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "web" / "public" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)

SR = 44100  # sample rate


def write_wav(name: str, samples: list[float]) -> Path:
    """Write float samples in [-1, 1] to a 16-bit mono WAV at OUT/{name}.wav."""
    path = OUT / f"{name}.wav"
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        ints = (max(-1.0, min(1.0, s)) for s in samples)
        w.writeframes(b"".join(struct.pack("<h", int(s * 32767)) for s in ints))
    return path


def envelope(n: int, attack: float, release: float) -> list[float]:
    """Linear ADSR-lite envelope. attack/release in seconds."""
    a = max(1, int(SR * attack))
    r = max(1, int(SR * release))
    out = [1.0] * n
    for i in range(min(a, n)):
        out[i] = i / a
    for i in range(min(r, n)):
        idx = n - 1 - i
        if 0 <= idx < n:
            out[idx] = min(out[idx], i / r)
    return out


def hum(seconds: float = 30.0) -> list[float]:
    """Ambient Bloomberg-terminal hum: very quiet 60Hz drone with slight modulation."""
    n = int(SR * seconds)
    out = []
    for i in range(n):
        t = i / SR
        # 60Hz fundamental + 120Hz octave + slow LFO
        s = 0.04 * math.sin(2 * math.pi * 60 * t)
        s += 0.015 * math.sin(2 * math.pi * 120 * t + 0.3)
        s *= 1 + 0.15 * math.sin(2 * math.pi * 0.4 * t)
        out.append(s)
    return out


def tick(seconds: float = 0.05) -> list[float]:
    """Typewriter-key tap: short noise burst with sharp envelope."""
    n = int(SR * seconds)
    env = envelope(n, 0.001, 0.04)
    out = []
    for i in range(n):
        t = i / SR
        # filtered noise via simple alternating
        noise = ((i * 1664525 + 1013904223) % 65536) / 65535 - 0.5
        s = noise * 0.6 + 0.3 * math.sin(2 * math.pi * 1800 * t)
        out.append(s * env[i] * 0.4)
    return out


def chime_cash(seconds: float = 0.6) -> list[float]:
    """Cash-register single ding: high-freq partial stack with quick decay."""
    n = int(SR * seconds)
    env = envelope(n, 0.005, 0.45)
    out = []
    for i in range(n):
        t = i / SR
        s = 0.5 * math.sin(2 * math.pi * 1318 * t)  # E6
        s += 0.3 * math.sin(2 * math.pi * 1568 * t)  # G6
        s += 0.2 * math.sin(2 * math.pi * 2093 * t)  # C7
        out.append(s * env[i] * 0.35)
    return out


def note_low(seconds: float = 1.2) -> list[float]:
    """Sickly low cello drone for FBI-awareness ticks."""
    n = int(SR * seconds)
    env = envelope(n, 0.05, 0.6)
    out = []
    for i in range(n):
        t = i / SR
        s = 0.45 * math.sin(2 * math.pi * 73.4 * t)  # D2
        s += 0.25 * math.sin(2 * math.pi * 110 * t + 0.4)  # A2
        # detune for queasy beating
        s += 0.18 * math.sin(2 * math.pi * 74.5 * t)
        out.append(s * env[i] * 0.4)
    return out


def siren_tasteful(seconds: float = 2.0) -> list[float]:
    """Distant single-note siren wail — for FBI-raid endgame."""
    n = int(SR * seconds)
    env = envelope(n, 0.1, 0.5)
    out = []
    for i in range(n):
        t = i / SR
        # slow vibrato 350-450Hz
        f = 400 + 50 * math.sin(2 * math.pi * 0.6 * t)
        s = 0.5 * math.sin(2 * math.pi * f * t)
        # add octave-down body
        s += 0.2 * math.sin(2 * math.pi * (f / 2) * t)
        out.append(s * env[i] * 0.35)
    return out


def stamp(seconds: float = 0.4) -> list[float]:
    """Rubber-stamp slap: low thud + brief click."""
    n = int(SR * seconds)
    out = []
    for i in range(n):
        t = i / SR
        # thud — low sine + noise burst, fast decay
        decay = math.exp(-t * 14)
        body = 0.7 * math.sin(2 * math.pi * 95 * t) * decay
        # click in first 20ms
        if t < 0.02:
            click_decay = math.exp(-t * 200)
            noise = ((i * 1664525 + 1013904223) % 65536) / 65535 - 0.5
            body += noise * 0.4 * click_decay
        out.append(body * 0.45)
    return out


def glass(seconds: float = 0.7) -> list[float]:
    """Single glass crack — high inharmonic partials with sharp decay."""
    n = int(SR * seconds)
    env = envelope(n, 0.001, 0.5)
    out = []
    for i in range(n):
        t = i / SR
        s = 0.4 * math.sin(2 * math.pi * 3100 * t)
        s += 0.25 * math.sin(2 * math.pi * 4700 * t + 0.7)
        s += 0.15 * math.sin(2 * math.pi * 6200 * t + 1.1)
        # fast damped
        s *= math.exp(-t * 7)
        out.append(s * env[i] * 0.3)
    return out


def fanfare_cursed(seconds: float = 1.5) -> list[float]:
    """Brief slightly-wrong fanfare — for genuine-success endings."""
    n = int(SR * seconds)
    env = envelope(n, 0.02, 0.7)
    out = []
    notes = [(0.0, 261.63), (0.18, 329.63), (0.36, 392.00), (0.54, 466.16)]  # C, E, G, A♭ (cursed)
    for i in range(n):
        t = i / SR
        s = 0.0
        for start, freq in notes:
            if t >= start:
                age = t - start
                if age < 0.55:
                    note_env = math.exp(-age * 2.5)
                    s += 0.25 * math.sin(2 * math.pi * freq * age) * note_env
                    s += 0.08 * math.sin(2 * math.pi * freq * 2 * age) * note_env
        out.append(s * env[i] * 0.4)
    return out


def slack_ping(seconds: float = 0.3) -> list[float]:
    """Two-tone Slack-style notification."""
    n = int(SR * seconds)
    out = []
    for i in range(n):
        t = i / SR
        # first tone 660Hz for 0.08s, then 880Hz
        if t < 0.09:
            f = 660
            age = t
            decay = math.exp(-age * 22)
        elif t < 0.22:
            f = 880
            age = t - 0.09
            decay = math.exp(-age * 18)
        else:
            f = 0
            decay = 0
        s = 0.5 * math.sin(2 * math.pi * f * t) * decay if f > 0 else 0
        out.append(s * 0.45)
    return out


def crowd_murmur(seconds: float = 4.0) -> list[float]:
    """Distant trading-floor hum — pink-ish noise with slow modulation, loopable."""
    n = int(SR * seconds)
    out = []
    # simple pink-ish via averaging white noise
    last = [0.0, 0.0, 0.0]
    for i in range(n):
        t = i / SR
        white = ((i * 1664525 + 1013904223) % 65536) / 65535 - 0.5
        # 3-tap moving average for low-pass
        last = [white] + last[:2]
        avg = sum(last) / 3
        # slow LFO so loop has motion
        mod = 1 + 0.2 * math.sin(2 * math.pi * 0.15 * t)
        out.append(avg * mod * 0.18)
    # crossfade ends so it loops cleanly
    fade = int(SR * 0.3)
    for i in range(fade):
        out[i] *= i / fade
        out[-1 - i] *= i / fade
    return out


def main() -> None:
    print(f"Generating SFX placeholders in {OUT}")
    paths = []
    paths.append(write_wav("hum", hum()))
    paths.append(write_wav("tick", tick()))
    paths.append(write_wav("chime-cash", chime_cash()))
    paths.append(write_wav("note-low", note_low()))
    paths.append(write_wav("siren-tasteful", siren_tasteful()))
    paths.append(write_wav("stamp", stamp()))
    paths.append(write_wav("glass", glass()))
    paths.append(write_wav("fanfare-cursed", fanfare_cursed()))
    paths.append(write_wav("slack-ping", slack_ping()))
    paths.append(write_wav("crowd-murmur", crowd_murmur()))
    for p in paths:
        size = p.stat().st_size
        print(f"  {p.name:24s} {size:>9,d} bytes")
    print(f"\nDone. {len(paths)} files written.")


if __name__ == "__main__":
    main()
