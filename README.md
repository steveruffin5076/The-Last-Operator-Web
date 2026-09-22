# The Last Operator: Dead Zone (WEB BUILD)

Top-down 2D zombie survivors-lite. Solo dev + AI.
Stack: vanilla HTML5 + JavaScript + Canvas. No engine. Double-click to play.

**Status:** Docs ✅ · Art v1.0 ✅ (16 assets in `art/`) · Code ⬜ (starts Day 1)

## What's here

| File / folder | What it is |
|---|---|
| `MUSE.md` | Instructions for Claude Code (AI reads this first) |
| `HANDOFF.md` | Paste into any new chat to transfer this project |
| `plan.md` | 28-day plan (order still applies; F5 = refresh browser) |
| `game-design.md` | Locked GDD: soldier, 3 guns, 5 zombies, 10:00 run |
| `claude-prompts-web.md` | 11 copy-paste prompts in build order (USE THIS) |
| `tech-web.md` | Web tech spec: loop, input, audio, publish |
| `testing-checklist.md` | QA gates (test = index.html + F12 zero errors) |
| `progress.md` | Tracker — tick boxes as you build |
| `art/` | 16 final PNGs (transparent, ready) |
| `lineup.png` | Preview of all 16 assets |

## Quickstart (Day 1)

```bash
git clone https://github.com/YOURNAME/YOUR-NEW-REPO.git
cd YOUR-NEW-REPO
claude
```

1. Paste Prompt 0 from `claude-prompts-web.md`.
2. Double-click the generated `index.html` → title screen → Start.
3. WASD moves. F12 console must show zero errors. Commit + tick `progress.md`.

## Publish (Week 4)

- **itch.io:** zip containing `index.html` + `art/` (+ `game.js`) at root → upload as HTML5 project, viewport 1280x720.
- **GitHub Pages (free URL):** repo Settings → Pages → Deploy from branch → play via `https://YOURNAME.github.io/REPO/`.

## Art (v1.0, in `art/`)

Soldier (top-down + portrait), 5 zombies, 3 gems, drone, muzzle flash,
3 props, asphalt tile. Transparent PNGs — draw with `drawImage`, scale in code.
Never overwrite; `MUSE.md` marks them read-only.
