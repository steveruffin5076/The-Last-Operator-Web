> **NOTE (web build):** same order/content, but Godot steps become web: F5 = refresh browser, scenes/scripts = index.html/game.js, export = zip for itch.io. Prompts: use claude-prompts-web.md.

# PROGRESS TRACKER — Last Operator: Dead Zone Lite
**Engine:** Godot 4.3+ | **AI:** Claude Code | **Platform:** PC/Web (itch.io) | **Run:** 10:00 win
**Scope lock:** 1 map, 1 soldier, 3 weapons, 4 zombies + Warlord boss. No shop, no save, no multiplayer.

How to use: Check `[x]` when DONE + tested with F5. Add date. Don't skip. If blocked >1 day, log in Blockers.

## Phase 0 — Setup (Day 0)
- [ ] Godot 4.3+ installed, new 2D project `last-operator` (1280x720, stretch Canvas Items)
- [ ] Claude Code installed, `claude init` in project folder, MUSE.md pasted (see tech-claude-godot.md)
- [ ] Git init + first commit `chore: bootstrap`
- [ ] itch.io account created, draft page reserved
- [ ] This file copied to project docs (or keep link) — Date: ____

Definition of Done: Project opens, F5 runs empty Main with soldier placeholder moving.

## Week 1 — Movement + Swarm (v1, no weapons yet)
Goal: Run 3 min with 50 walkers chasing, 60 FPS, no crash.

- [ ] Day 1-2: Player soldier WASD + Camera2D follow + bounds
  - Test: WASD smooth, speed 230, camera no jitter. Date: ____
- [ ] Day 3-4: Walker base (CharacterBody2D) + spawner off-screen + touch damage + i-frames 0.5s
  - Test: 20 walkers chase, HP drops, no stuck. Date: ____
- [ ] Day 5-7: Pooling for 100+ enemies + Runner + Riot placeholder (melee only)
  - Test: 80 alive, FPS 55-60 on PC web export. Date: ____
- [ ] Week 1 sign-off: 3-min survival run recorded. Fun? Y/N. FPS: ____

## Week 2 — Combat + XP (Core Fun)
Goal: Auto-weapons + level-ups = "one more run" feeling.

- [ ] Day 8-10: Pistol auto-fire nearest + Shotgun spread + Drone orbit (pool projectiles)
  - Test: kills feel punchy, no lag with 50 projectiles. Date: ____
- [ ] Day 11-12: XP gems (magnet 80px) + XP curve `5 + level*8` + level-up pause + 3-choice UI
  - Test: Lv2 in <30s, pause works, resume works. Date: ____
- [ ] Day 13-14: 12-upgrade pool wired + HUD (Timer, HP, XP, Kills)
  - Test: all 12 apply correctly, no dupe bug. Date: ____
- [ ] Week 2 sign-off: Full 10-min run possible (no boss yet). Avg level at 10:00: ____ (target 12-16)

## Week 3 — Waves + Boss + Screens
Goal: Complete game loop Win/Lose.

- [ ] Day 15-17: Wave director table (Min 0-10) + caps (max alive, max shooters-melee v1)
  - Test: difficulty ramps, Min 7 hard but survivable. Date: ____
- [ ] Day 18-20: Warlord boss (big HP, summon walkers, melee v1) + Victory screen + Game Over + Restart
  - Test: boss at 10:00, win on kill, restart x5 no bug. Date: ____
- [ ] Day 21: HUD polish + Pause (Esc) + damage numbers placeholder
  - Test: UI readable 1280x720 + web. Date: ____
- [ ] Week 3 sign-off: 3 full runs logged. Wins: __/3. Avg FPS Min 9: ____

## Week 4 — Juice + Audio + Publish (No new features)
Goal: Publish v1 Lite to itch.io.

- [ ] Day 22-23: Juice pack — hit flash, muzzle flash, casings, shake, hurt vignette, death particles
  - Test: guns feel powerful, shake not nauseating. Date: ____
- [ ] Day 24-25: Audio — 1 music loop + 7 SFX hooked with pitch variation + volume mix
  - Test: mute/unmute, web audio autoplay OK. Date: ____
- [ ] Day 26-27: Web export + itch.io page (thumbnail, tags, description) + 30s TikTok clip
  - Test: web build 60 FPS, controls work in browser. Link: ____
- [ ] Day 28: Friends playtest x3 — "one more run"? Y/N. Feedback notes: ____
- [ ] v1 PUBLISHED: itch.io URL: ____ Date: ____ Plays Week 1: ____

## v2 Upgrade — Real Shooter Zombies (Only AFTER v1 published)
- [ ] Enemy bullet pool (30) + layers + bright green tracer
- [ ] Shooter AI: CHASE → AIM 0.8s laser → SHOOT → RELOAD 2.5s, cap 6 alive
- [ ] Boss spread shot (5-fan) + telegraphs
- [ ] Fairness pass: all bullets dodgeable, warning sound, i-frames OK
- [ ] Re-publish as v1.1 + changelog. Date: ____

## Metrics Log (fill weekly)
| Date | Version | FPS Min9 | Level@10 | Result W/L | Death cause | Fun 1-5 | Note |
|------|---------|----------|----------|------------|-------------|---------|------|
|      | v0.1    |          |          |            |             |         |      |
|      | v1.0    |          |          |            |             |         |      |
|      | v1.1    |          |          |            |             |         |      |

Target: FPS ≥55, Level 12-16, Win rate 30-50% for new player, Fun ≥4.

## Blockers / Decisions
- Date | Blocker | Tried | Decision:
- Example: Shooter too hard → bullet 220→190, reload 2.5→3.2s

## Steam Go / No-Go (after 500 itch plays)
- [ ] 500+ plays, 60%+ positive, 3+ strangers asked for more
- Decision: Polish for Steam $5.99 / Iterate Lite / Pivot theme. Date: ____
