# TECH SPEC — Web Build (HTML5 + JS + Canvas, no engine)

## File layout (final — only 3 code/file types + art)
```
index.html   # <canvas 1280x720> + HUD divs + overlay div + inline <style> + <script src="game.js">
game.js      # ALL logic: config / state / input / audio / update / render
art/*.png    # 16 sprites (read-only)
```

## Hard constraints (file:// must work)
DO: plain `<script src>`, `new Image()` + relative `art/x.png` paths,
WebAudio oscillators, `requestAnimationFrame`, DOM overlays for UI.
DON'T: ES modules (`import` fails on file://), `fetch()` (blocked on file://),
npm/vite/webpack, external CDN links, TypeScript. Zero toolchain, always.

## Core patterns
- Loop: `requestAnimationFrame`, `dt = min(0.033, delta)`. Update only when
  `mode==='play'`; render every frame (frozen frame behind pause/levelup).
- Modes: `title → play ⇄ pause ⇄ levelup → over | win`. Overlays are DOM divs.
- Camera: `cx = clamp(px-640, 0, WORLD-1280)`, same for y. Shake adds random
  offset decaying to 0. Tiled bg: `createPattern(bg,'repeat')` with translate.
- Sprites: `drawImage` centered, `size` set in code per GDD (soldier 32x42,
  zombies 32, brute 48, warlord 96, gems ~14). Rotate soldier to move dir:
  `rot = atan2(dx, -dy)` (art faces UP at rotation 0).
- Enemies: plain objects in array, circle collision, move-toward-player +
  cheap pair separation, despawn beyond 1300px. Cap ~110 alive.
- Damage numbers + particles: arrays with life timers, swept each frame.
- Hit flash: `ctx.filter='brightness(2.5)'` only while `flash>0`, then reset.
- Audio: one AudioContext created on Start click. `tone(f0,f1,dur,type,vol)`.
  M mutes (master gain 0). No audio files, ever.
- Persistence: `localStorage` best time/kills only (no save system in Lite).

## HUD (DOM, absolute over canvas)
Top-center Timer MM:SS · top XP bar + Lv · bottom-left portrait + HP bar ·
top-right kills · bottom-right weapon badges. Update via textContent/width.

## Performance rules
1. No per-frame allocations in hot loops (reuse arrays, sweep backwards).
2. Cap particles ~250, damage numbers ~40 alive.
3. `ctx.filter` only on flashing sprites, never fullscreen.
4. drawImage with integer coords where easy (`|0`), smoothing on (cartoon art).
5. Target 60fps with 100 enemies on a mid laptop Chrome.

## Debug
F12 Console = your error log: zero errors is the ship bar. Add `?debug` param
later for: F1 spawn 30 walkers, F2 +1 level, F3 godmode (strip before publish).

## Publish
- itch.io: zip with `index.html` at ROOT (+ `game.js`, `art/`). Viewport 1280x720.
- GitHub Pages: push repo → Settings → Pages → main branch → free playable URL.
- Test matrix before publish: double-click (Chrome) + incognito + Pages URL.
