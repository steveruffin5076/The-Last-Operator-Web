> **NOTE (web build):** same order/content, but Godot steps become web: F5 = refresh browser, scenes/scripts = index.html/game.js, export = zip for itch.io. Prompts: use claude-prompts-web.md.

# TESTING CHECKLIST — Director/Tester Power
**Rule:** 10-min playtest daily. No commit without F5. Log bugs in format below. Balance > Features.

## 1. Bug Report Template (paste to Claude)
```
Bug: [short]
Steps: 1) Start run 2) [action] 3) [observe]
Expected: [what should happen]
Actual: [what happened + error text + screenshot/clip]
Build: vX, Godot 4.x, PC/Web
Severity: Crash/Blocker/Major/Minor
File guess: [e.g. enemy.gd take_damage]
```
Then: `Fix minimal, show diff, list 2 regressions to retest.`

## 2. Daily Smoke (10 min, every day)
- [ ] F5 no errors in Output? - [ ] WASD all dirs smooth? - [ ] 1-min survive no crash?
- [ ] Kill 10 → gems → Lv2? - [ ] Pause Esc + Restart R work? - [ ] FPS ≥50 early?
If any fail → fix before new prompt.

## 3. Weekly Gates

### Week 1 Gate — Swarm
- [ ] 3-min run, 50+ walkers, FPS 55-60 PC, 45+ web?
- [ ] No stuck off-screen, no tunnel through player, i-frames 0.5s?
- [ ] Despawn >1300px works (no infinite count)?
- [ ] Bounds clamp, camera no jitter at edges?
Log: FPS Min3 ___, Alive max ___, Deaths ___.

### Week 2 Gate — Fun
- [ ] Lv2 <30s, Lv5 <3min? - [ ] All 3 weapons kill correctly?
- [ ] Level-up pauses enemies not UI, 3 distinct choices, 1-3 keys work?
- [ ] All 12 upgrades apply (test each once via debug F2)?
- [ ] 10-min run reachable (no boss)? Avg level __ (target 12-16)?
Fun: Would you retry? Y/N. Boring first 2 min? Fix spawns, not features.

### Week 3 Gate — Complete
- [ ] Boss exactly 10:00 + WARNING, win on kill, lose on HP0?
- [ ] Restart x5 clean, no orphan timers/enemies?
- [ ] Wave caps respected (see game-design.md)? Min7-9 hard but 20s dodge possible?
- [ ] HUD readable 1280x720 + browser, boss HP shows?
Log 3 runs: W/L, time, kills, level, death cause.

### Week 4 Gate — Ship
- [ ] Juice: muzzle, casings, hit flash, numbers, shake subtle, vignette?
- [ ] Audio: loop + 7 SFX, pitch var, M mute, web autoplay after click?
- [ ] Web export 1280x720, incognito 10-min no console error, controls OK?
- [ ] itch page: title, GIFs x3, controls, tags survivors-like/zombies/military/top-down-shooter?
- [ ] 3 friends: 2/3 say "one more"? Notes: ___

## 4. Shooter Fairness (v2 only, must all pass)
- [ ] Bullets bright green r5+glow, speed 190-220 (1.5s react @350px)?
- [ ] 0.8s red laser + charge sound before EVERY shot, no instant?
- [ ] Cap 6 alive (8 max Min9), reload 2.5-3.2s?
- [ ] No stun-lock: 0.5s i-frame respected by bullets?
- [ ] Boss 5-fan gaps >60px walkable?
- [ ] Deaths: if 80% to bullets → nerf dmg 12→8 or reload +0.7s, retest.
- [ ] Colorblind: bullets + laser distinct shape/size, not color-only?

## 5. Balance Logs (fill after each full run)
| Date | Ver | Time | W/L | Kills | Lv | Build (weapons/upgrades) | Death to | FPS Min9 | Fun1-5 |
|------|-----|------|-----|-------|----|--------------------------|----------|----------|--------|
|      |     |      |     |       |    |                          |          |          |        |

Tuning rules: Win rate new player 30-50%. If 0/3 wins → buff pistol +2 or HP+20. If 3/3 easy 100%HP → spawn +20% or enemy HP +15%. Change ONE number at a time, log old→new.

## 6. Audio Test
- [ ] All SFX ≤0.8s except loop/boom, no clipping, volumes Music -18 SFX -8?
- [ ] Pitch rand 0.9-1.1 on shots/pickups? - [ ] Mute M persists in pause?
- Files: `audio/sfx_<name>.ogg` 44.1k mono, `mus_zone_loop.ogg` stereo loop.

## 7. Publish Checklist itch.io
- [ ] Zip `index.html + index.js + index.wasm + index.pck` from build/web/
- [ ] Page: Title Last Operator: Dead Zone Lite, tagline 1-line, controls WASD/Esc/R, 3 GIFs (early swarm, level-up, boss), thumbnail 1280x720, tags, price Free, comments On.
- [ ] Test incognito + mobile page loads (play PC only in Lite).
- [ ] Version v1.0 + changelog + "Feedback: time survived? fun 1-5?" prompt.

## 8. Go/No-Go to v2 & Steam
- v2 if v1 stable + fun ≥4. Steam Phase 2 if 500+ plays 60%+ positive (see progress.md).
- Kill list: If FPS <45 after caps+cuts, cut particles/numbers first, not enemies feel.
