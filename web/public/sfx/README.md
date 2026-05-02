# SFX assets

Real audio sourced by the user, mixed with a few procedurally-generated placeholders for the slots that weren't covered. Place new files here matching the slot names below; components reference `/sfx/{slot}.{ext}`.

## Files (current)

| File | Slot | Source | Notes |
|---|---|---|---|
| `hum.m4a` | ambient terminal background loop | user (`room-tone.wav`, compressed) | 1.4MB; 64 kbps stereo AAC; original 52MB wav compressed via `afconvert -f m4af -d aac@44100 -b 64000 -c 2` |
| `tick.wav` | token streams / micro-events | user (`tick.wav`) | unused by components yet; available for typewriter-tap cue |
| `chime-cash.mp3` | revenue milestone, $1B valuation | user | |
| `slack-ping.mp3` | Slack leak in feed (`sound: ding`) | user (`slack message.mp3`) | wired into notification stack |
| `note-low.mp3` | FBI awareness ticks up (`sound: drone`) | user (`fbi-awareness.mp3`) | wired into notification stack |
| `siren-tasteful.mp3` | FBI raid endgame stinger (`sound: fbi_raid`) | user (`fbi-investigation.mp3` 387KB) | the loud / climactic cue |
| `fbi-investigation.mp3` | FBI tab unlock (`sound: fbi_unlock`) | user (`fbi investigation.mp3` 283KB) | the medium / "they're circling" cue |
| `glass.mp3` | negative milestone, fraud crosses 70 (`sound: glass`) | user (`negative-milestone.mp3`) | |
| `stamp.wav` | decision committed, stamp slap (`sound: stamp`) | procedural placeholder | replace when sourced |
| `fanfare-cursed.wav` | rare positive milestone (`sound: fanfare`) | procedural placeholder | replace when sourced |
| `crowd-murmur.wav` | live feed eruption | procedural placeholder | not yet wired into a `sound:` cue; keep for future |

## How sounds map to notifications

In `web/src/lib/types.ts`, `SimNotification.sound` is one of: `ding | drone | stamp | cash | glass | fbi_unlock | fbi_raid | fanfare | tick`. The mapping is in `web/src/components/run/notification-stack.tsx` → `SOUND_SRC`.

When a notification carries a `sound`, the stack renders a hidden `<audio>` element pointing at the slot's URL. Audio is muted by default — single mute toggle in the bottom controls strip flips `localStorage["aces:muted"]`, and the notification audio elements check that flag before playing.

## Replacing / adding

```bash
# drop new file in this folder using the canonical slot name
cp ~/sounds/MyNewStamp.mp3 stamp.mp3

# update notification-stack.tsx if extension changed
grep '/sfx/stamp' /Users/KZJer/Documents/GitHub/agent-ceo-sim/web/src/components/run/notification-stack.tsx

# rebuild
cd /Users/KZJer/Documents/GitHub/agent-ceo-sim/web && npm run build
```

## Compressing the hum

The 52MB `hum.wav` is too large for a public asset. To compress to ~5MB MP3:

```bash
ffmpeg -i hum.wav -codec:a libmp3lame -qscale:a 7 hum.mp3
# then update controls.tsx audio src from .wav to .mp3
```

Skipping for hackathon since audio is muted-by-default.

## Regenerating the procedural placeholders

`stamp.wav`, `fanfare-cursed.wav`, and `crowd-murmur.wav` are synthesized by `scripts/generate-sfx.py`. Re-run anytime — idempotent, overwrites in place. Real audio replacements should land in this folder with matching slot names; the script will skip slots that already have a real file (TODO if needed).
