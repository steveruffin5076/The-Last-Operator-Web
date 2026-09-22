> **NOTE (web build):** same order/content, but Godot steps become web: F5 = refresh browser, scenes/scripts = index.html/game.js, export = zip for itch.io. Prompts: use claude-prompts-web.md.

# BUILD PLAN — 28 Days, 1-2 hrs/day
**Project:** Last Operator: Dead Zone Lite | **Stack:** Godot 4.3+ + Claude Code | **Output:** Playable 10-min web demo on itch.io

## 1. Time & Tools
- Daily: 60-120 min. 30 min prompting + 30 min testing. No marathon coding.
- Tools: Godot 4.3+ LTS, Claude Code (terminal in project folder), Git, Chrome (web test), Leonardo.ai free, freesound.org, Photopea (free Photoshop).
- Project location (create OUTSIDE this pack): `~/godot/last-operator/` — this pack stays docs-only.

## 2. Claude Code Workflow (repeat every session)
1. `cd ~/godot/last-operator` → `claude` → `/init` first time only.
2. Paste ONE prompt from `claude-prompts.md`. Say: "Implement only this. Show files changed. Keep it simple for beginner."
3. Review diff: `git diff --stat`. If >3 files or >200 lines for early tasks, ask: "Split smaller."
4. Run in Godot: F5. Play 5 min. Log bugs in `testing-checklist.md` format.
5. Paste errors back: "Error: [paste]. File: [path]. Fix minimal, don't rewrite."
6. Commit: `git add -A && git commit -m "feat: player movement"`
7. Tick `progress.md`. Stop. No bonus features.

Do: small steps, test after each, commit daily, keep prompts in order.
Don't: "make full game", multi-system in one prompt, refactor mid-week, add art before gameplay fun.

## 3. v1 vs v2 Strategy (Scope Safety)
- v1 (Day 1-28): ALL zombies MELEE. Shooter looks like holding gun but just chases (fast+tanky). Guarantees finish.
- v2 (After publish): Enable real enemy bullets + aim/shoot AI for Shooter + Boss spread. If v2 breaks, you still have shippable v1.

## 4. Day-by-Day

### WEEK 1 — Move + Swarm
**Day 1-2 — Soldier + Camera (90 min)**
- Prompt 0 Bootstrap + Prompt 1 Player. Goal: WASD 230 speed, Camera2D smooth, 1280x720, soldier placeholder rotates to move dir.
- Test: No jitter, stays in 2500x2500 bounds. Done = move + camera smooth.

**Day 3-4 — Walker + Damage (90 min)**
- Prompt 2 Enemy Base. Goal: Spawner 1/sec off-screen, walker speed 75, touch 10 dmg + 0.5s i-frames + HP bar.
- Test: 20 walkers chase 2 min, HP correct, no stuck off-screen.

**Day 5-7 — Pooling + Variety (2x90 min)**
- Prompt 2b Pooling + Runner/Brute placeholders. Goal: 100-pool, Runner speed 145, Brute HP 140 slow.
- Test: 80 alive, FPS ≥55. If lag → ask Claude to profile, cut particles/shadows.

### WEEK 2 — Guns + Levels
**Day 8-10 — Auto-Weapons (3x90 min, one weapon per day)**
- Pistol: 0.7s, dmg 12, nearest <600px, tracer + casing. Shotgun: 2.2s, 5 pellets. Drone: orbit 90px.
- Test each: kills, no crash with 50 projectiles, sounds placeholder OK.

**Day 11-12 — XP + Level-Up (2x90 min)**
- Gems fly at 80px magnet, curve `5+level*8`, pause + 3-choice UI.
- Test: Lv2 <30s, pause freezes enemies not UI, resume clean.

**Day 13-14 — Upgrades + HUD**
- Wire 12 upgrades (see game-design.md). HUD: Timer big top, XP top, HP bottom, kills.
- Test: Each upgrade applies once, no stacking bug. Full 10-min run reachable.

### WEEK 3 — Director + Boss
**Day 15-17 — Wave Director**
- Paste wave table from game-design.md. Caps: max alive per minute, shooters-melee cap 8 in v1.
- Test: Min 0-2 easy, Min 7 hard, Min 9 chaos but survivable 20s standing+dodging.

**Day 18-20 — Warlord + Screens**
- Boss HP 2500 melee v1 + summon 4 walkers/8s. Victory on kill, Game Over with stats, Restart.
- Test: Boss exactly 10:00, restart x5, no error.

**Day 21 — UI Polish**
- Pause Esc, damage numbers, boss warning banner.
- Test: Readable in browser, buttons clickable.

### WEEK 4 — Juice + Ship
**Day 22-23 — Juice (no features)**
- Hit flash 0.1s, muzzle flash, casings, shake fn, hurt vignette, death poof, level-up flash.
- Test: Guns punchy, shake subtle (max 6px), no FPS drop.

**Day 24-25 — Audio**
- 1 loop + 7 SFX, pitch rand 0.9-1.1, bus volumes. See game-design.md list.
- Test: Web audio OK after first click, mute works.

**Day 26-27 — Export + Page**
- Web preset, export, itch.io page: title, 3 GIFs, controls, tags: survivors-like, zombies, military, top-down-shooter.
- Test: Incognito play 10 min, 60 FPS, no console error.

**Day 28 — Playtest**
- 3 friends, ask only: "Would you play again? What killed you? What was boring first 2 min?"
- Log in progress.md. Decide v2 or fix fun first.

## 5. Risks & Fixes
- Lag at Min 7+: Cap alive, kill off-screen >1200px, fewer particles, damage numbers pooled, physics 60Hz fixed.
- Shooter unfair: Slower bullets 190, reload 3.2s, laser telegraph, cap 6, bright tracer.
- Scope creep: Any idea → Future list in game-design.md. If not in GDD Lite, don't build.
- Claude big rewrite: Say "Minimal diff. Fix only [file:line]. Don't refactor."
- Boring early game: Faster first level (<30s), more walkers Min 0-1, pistol stronger start.

## 6. Done Criteria (Must all pass to publish)
- 10:00 winnable, restart clean x5, FPS ≥55 Min 9, Lv 12-16 at win, 0 crash in 3 runs, web build playable, 2/3 friends say "one more".
