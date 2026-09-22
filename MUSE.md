# MUSE.md — Last Operator: Dead Zone (WEB BUILD)
Stack: vanilla HTML5 + JavaScript + Canvas 2D. NO game engine, NO build tools,
NO npm, NO frameworks, NO ES modules, NO fetch(). The game MUST run by
double-clicking index.html (file:// protocol).

Rules:
- Plain <script src="game.js"> only (modules break on file://). Images via
  relative paths art/*.png loaded with new Image(). No external URLs anywhere.
- Canvas 1280x720 internal, CSS-scaled responsive. requestAnimationFrame loop,
  dt clamped to 0.033. All game code in game.js (sections: config/state/input/
  audio/update/render). DOM only for HUD + overlays.
- Audio: WebAudio oscillator bleeps only (no audio files). Init on first user
  click (title screen Start button). M toggles mute.
- Small chunks: max 2-3 files per change. Beginner-commented code. No rewrites.
- Juice is mandatory, not optional: screen shake, hit flash, damage numbers,
  particles, muzzle flash, hurt vignette.
- After each change: list files changed, how to test (refresh browser + F12
  console must show zero errors), 3 likely bugs to check.

Structure:
index.html (canvas + HUD divs + overlay div, links game.js + inline <style>)
game.js (all logic)
art/*.png (16 final sprites - READ-ONLY, never overwrite or regenerate)

Scope Lock (Lite v1.0):
1 map 2500x2500, 1 soldier HP100 speed230, 3 auto-weapons
(pistol/shotgun/drone), 4 zombies melee-only + Warlord boss, 10:00 run,
12 upgrades, win on boss kill. No shop/save/multiplayer/touch (desktop v1).

Test: double-click index.html -> title -> click Start -> WASD moves, weapons
autofire. Also test Chrome incognito. F12 console: zero errors, always.

Ask before adding: any library, any new file, any feature not in game-design.md.
