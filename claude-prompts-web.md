# CLAUDE CODE PROMPTS — WEB BUILD (paste ONE at a time, in order)
Stack: vanilla HTML5 + JS + Canvas. No engine/tools/modules. Must run via
double-clicked index.html. MUSE.md + game-design.md already in repo — Claude
must read them first. After each prompt: refresh browser, F12 = zero errors.

## Prompt 0 — Bootstrap (Day 1, once)
```
Read MUSE.md, HANDOFF.md and game-design.md first. You are a senior web game
dev teaching a beginner. Stack: vanilla HTML5 + JS + Canvas 2D, NO engine,
NO modules, must run from double-clicked index.html (file://).
Task: Bootstrap only, no gameplay yet.
1. index.html: <canvas id="game" 1280x720>, HUD divs (timer, xp bar, hp bar,
   kills - empty for now), overlay div, inline <style> dark theme responsive,
   <script src="game.js">. No external URLs.
2. game.js sections: config/state/input/audio-stub/update-stub/render-stub +
   asset loader for the 16 PNGs in art/ via relative paths + requestAnimationFrame
   loop (dt clamp 0.033) + title overlay with Start button (click hides overlay).
3. Keep code beginner-commented. List files created + how to test
(double-click index.html, click Start, dark arena shows, F12 zero errors).
```

## Prompt 1 — Soldier + Camera (Day 1-2)
```
Add player + camera only.
Player: WASD/arrows, speed 230, clamped to 2500x2500 world, HP 100, magnet 80.
Draw chr_soldier.png rotated to move dir (rot=atan2(dx,-dy), art faces UP at 0).
Camera follows (clamp to world). Tile bg_asphalt.png with createPattern.
Test: double-click, Start, move all dirs smooth, soldier rotates, F12 clean.
```

## Prompt 2 — Walker + Damage (Day 3-4)
```
Add enemy base + spawner + touch damage.
Walker: HP22, touch 10, speed 75, XP 1, r13, draw 40px. Spawner: ring 720-940px
from player, 1.0s interval, cap 25 alive (Min 0-2). Enemies chase player,
despawn beyond 1300px. Player touch: 10 dmg with 0.5s iframes + HP HUD bar.
Test: 20 walkers chase 2 min, HP drops correctly, no stuck enemies.
```

## Prompt 2b — Variety + Perf (Day 5-7)
```
Add Runner (HP14, speed 145 + zigzag, XP 2) from Min 2 every 2.5s, and Brute
(HP140, speed 48, r20, XP 8, knock-resist) from Min 5 every 6s. Add cheap pair
separation (push 18px), alive caps per minute (25/50/80), entity counters in
console every 2s. No shadows/filters yet. Test: 80 alive, smooth 60fps.
```

## Prompt 3a — Pistol (Day 8)
```
Add auto-pistol. Every 0.7s: nearest enemy within 620px, bullet speed 650,
dmg 12, life 1.4s, r5. Draw yellow tracer (glow circle + core). On fire: draw
vfx_muzzle.png at gun tip 0.06s + tiny shake. Bullet hits: damage + number.
Test: walker dies in 2 hits, no error with 50 bullets alive.
```

## Prompt 3b — Shotgun (Day 9, locked behind upgrade but test unlocked now)
```
Every 2.2s: 5 pellets cone 40deg toward nearest, each dmg 8, life 0.5s,
knockback nudge. Wide muzzle draw + stronger shake + boom sound stub.
Test: clears packs under 300px, doesn't crash.
```

## Prompt 3c — Drone Orbit (Day 10, locked behind upgrade, test unlocked)
```
Orbit controller on player: count 1, radius 95, 3.2 rad/s, draw wpn_drone.png
30px. Contact dmg 18 with 0.4s per-enemy cooldown. Test: circles, hits, no stuck.
```

## Prompt 4 — XP + Level Curve (Day 11-12)
```
Enemy dies: drop gem (value=xp: 1 green, 2-5 blue, 8+ gold). Gems within
magnet 80 chase player at 430, collect under 22px with blip (pitch rises with
combo). Curve: need = 8 + (level-1)*9. Emit levelup event. HUD XP bar + Lv.
Test: Lv2 under 30s of killing walkers.
```

## Prompt 5 — Level-Up UI (Day 13-14)
```
Pause loop on levelup (stop update, keep render), dim + DOM overlay with 3
random distinct upgrade cards (click or keys 1-3), resume on pick. Implement
all 12: pistol_dmg+3, pistol_cd-0.08(min .32), shotgun unlock/+1 pellet(max7)/
+4dmg, drone unlock/+12dmg/+1(max3), hpmax+20&heal, speed+12%(max+60%),
magnet+50, armor-3(min1dmg), regen+0.8, airstrike 80-to-all + big shake.
Chain if multiple pending levels. Test: all 12 apply, resume clean.
```

## Prompt 6 — Wave Director (Day 15-17)
```
Implement table exactly: Min0-2 Walker1.0s max25; 2-5 +Runner2.5s max50;
5-7 +Brute6s max80; 7-9 +Shooter-as-melee-v1 (HP60,spd95,XP5) every 4s cap8
max90; 9-10 x1.5 rate max100; 10:00 stop normals. MM:SS timer HUD + kill count.
Test: ramps fairly, Min7 hard but 20s dodge-able.
```

## Prompt 7 — Boss + End Screens (Day 18-20)
```
At 10:00: WARNING banner 2.5s + shake + roar stub, spawn Warlord (HP2500,
touch30, speed55, r40, draw 130px) + summon 4 walkers/8s. Kill = Victory
overlay (time/kills/level + damage dealt). HP0 = Game Over overlay. Both:
Restart button + R key resets state. Boss mini HP bar above it.
Test: boss exactly 10:00, win on kill, restart x5 clean.
```

## Prompt 8 — Juice Pack (Day 22-23, NO new features)
```
Juice only: enemy white hit-flash 0.1s (ctx.filter), floating damage numbers
(float+fade 0.6s, pooled 40), camera shake(strength) 2-6px, red hurt vignette,
death particle burst (cap 250), level-up ring flash, shotgun knockback feel.
Pause menu on Esc (Resume/Restart). Test: punchy, fps unchanged, no long flash.
```

## Prompt 9 — Audio (Day 24-25)
```
WebAudio synth, init on Start click, M mute. tone(f0,f1,dur,type,vol):
pistol pew, shotgun boom, pickup blip (combo pitch), levelup arp, hurt,
enemy die (throttled 0.06s), win/lose jingles, ui click. Master gain 0.22.
Wrap all in try/catch. Test: sound after Start click, M works, incognito OK.
```

## Prompt 10 — v2 Shooter Ranged (AFTER v1 published ONLY)
```
Behind const USE_RANGED=true. Shooter AI: CHASE to 350px -> AIM 0.8s (red
laser line + charge blip) -> 1 green bullet (speed 200, dmg 12, r6) ->
RELOAD 2.8s. Cap 6 alive, pool 30 bullets. Boss: + 5-fan spread every 3s
(gaps >60px). Respect player iframes. Test: visible, dodgeable, warned.
```

## Debug prompts (anytime)
- Lag: `Log alive enemies/bullets/particles/gems. List top 3 perf fixes for
  60fps Canvas, implement smallest first. No new features.`
- Error: `Console error: [paste]. File [line]. Minimal fix, show diff only,
  don't refactor. Explain cause in 2 lines.`
- Balance: `Current: [paste stats]. Problem: [e.g. die Min7]. Suggest 2
  number tweaks only, implement + log old->new.`
- Scope guard: `Before adding [idea], check game-design.md Lite scope.
  If out-of-scope, say NO + append to Future list at file end.`
