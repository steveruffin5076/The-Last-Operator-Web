# GAME DESIGN DOC Lite — Last Operator: Dead Zone
**Version:** Lite v1.0 (itch.io free demo) | **Engine:** Godot 4 | **View:** Top-down 2D | **Run:** 10:00 | **Controls:** WASD + auto-fire (mouse not needed, Esc pause)

## 1. High Concept & Pillars
- Fantasy: Last tactical operator vs evolving zombie army. From helpless walkers to armed ex-soldiers.
- Pillars: 1) Move-only + auto-shoot (accessible) 2) Build power every ~40s (dopamine) 3) Fair but pressuring swarms (tension).
- Loop: Move → Auto-kill → Gems → Level → Pick 1/3 → Stronger → Harder wave → Boss 10:00 → Win/Lose → Retry.

## 2. Controls & Camera
- WASD/Arrows move, speed 230. No aim (auto). Esc pause. R restart on end screens. Web: same keyboard.
- Camera2D follow smooth (drag 5,0,0,5), zoom 1.0, 1280x720 viewport, bounds 2500x2500 infinite-feel grass/asphalt.
- Player rotates sprite to move dir. Weapons auto-target nearest.

## 3. Player — Tactical Soldier
- HP 100, Speed 230, Magnet 80px, i-frames 0.5s after hit, size 32x42 collision circle r14.
- Visual: Helmet+vest top-down, rifle forward, muzzle flash on shot. Hurt: red flash + knock 80px.
- Audio: footsteps soft, hurt grunt, level-up sting.

## 4. Weapons (3 ONLY in Lite)
All auto-fire, pooled projectiles, screen kick tiny.

**W1 P19 Pistol (starter)**
- Behavior: Every 0.7s fire 1 tracer to nearest <600px. Speed 650, dmg 12, pierce 0.
- Visual: Yellow tracer 12x3 + muzzle flash 0.05s + casing eject right.
- Sound: pew, pitch 0.9-1.1. Upgrades: +3 dmg, -0.08s CD (min 0.3s), +1 projectile at Lv5 (max 2 in Lite).

**W2 M4 Shotgun (unlock Lv3 choice)**
- Behavior: Every 2.2s, 5 pellets cone 40°, range 280px, dmg 8 each, knockback 120.
- Visual: Wide flash + smoke puff. Sound: boom + pump.
- Upgrades: +1 pellet (max 7), +4 dmg.

**W3 Orbit Drone (unlock Lv5 choice)**
- Behavior: 1-3 drones orbit r90px, 180°/s, dmg 18 on contact CD 0.4s per enemy.
- Visual: 24x24 quad, blade blur, buzz loop quiet.
- Upgrades: +12 dmg, +1 drone max 3, +20px radius.

Balance target: Pistol kills walker (22HP) in 2 hits. Shotgun clears pack <300px. Drone saves when swarmed.

## 5. Enemies (4 + Boss)
All CharacterBody2D, move_and_slide to player, separation to avoid stack, flash white on hit, die → particles + gems.

**E1 Walker (civilian) Min 0-10**
- HP 22, Dmg touch 10, Speed 75, XP 1, r12. Behavior: straight chase. Sound: moan.
- Visual: 32x32 green skin torn shirt. Count: bulk.

**E2 Runner (athlete) Min 2+**
- HP 14, Dmg 8, Speed 145 + zigzag sin 2Hz amp 30, XP 2, r11. Fast pressure.
- Visual: 32x32 red shirt lean. Sound: screech.

**E3 Riot Brute (ex-police) Min 5+**
- HP 140, Dmg 20, Speed 48, XP 8, r20, knock resist. Slow tank.
- Visual: 48x48 helmet+vest+shield arm. Sound: clank on hit.

**E4 Shooter — Infected Gunner (ex-soldier) Min 7+**
- v1 MELEE (ship this): HP 60, Dmg 14, Speed 95, XP 5, r13. Looks with rifle, chases. Cap 8 alive.
- v2 RANGED (after publish): Same + State: CHASE to 350px → AIM 0.8s (red laser Line2D + charge sound) → SHOOT 1 green bullet speed 190-220 dmg 12 → RELOAD 2.5-3.2s. Cap 6 alive. Bullet pooled 30, r5 bright + glow, dies on wall/player.
- Visual: 32x32 camo + helmet + rifle + red eyes. Must read as threat in 0.2s.

**BOSS Warlord (ex-commander) 10:00**
- HP 2500, Touch 30, Speed 55, r40, XP 50. v1: chase + summon 4 walkers/8s. v2: + spread 5-fan every 3s (bullet dmg 15 speed 200 gap >60px).
- Visual: 96x96 beret + minigun arm + scar. Spawn: WARNING banner + shake + roar.
- Win: Kill → Victory screen with time/kills/level.

## 6. Spawner Director (paste to Claude)
- Min 0-2: Walker 1.0s, max 25. First Lv <30s.
- Min 2-5: Walker 0.7s + Runner 2.5s, max 50.
- Min 5-7: + Brute 6s, max 80.
- Min 7-9: + Shooter 4s cap 6-8, max 90.
- Min 9-10: x1.5 rate, max 100.
- 10:00: Stop normals, spawn Warlord + 4 walkers. Kill = Win.
- Spawn: ring 700-900px from player, despawn >1300px (refund no XP). Separation radius 18px.

## 7. XP & Upgrades
- Gems: small 1 (green), med 3 (blue from runners/brutes), big 10 (gold from brute+). Fly to player <magnet, collect <20px with blip pitch rising.
- Curve: need `5 + level*8`. Lv1→2=13? Tune to Lv2 <30s: start need 8. Use: need = 8 + (level-1)*9. Target Lv 12-16 @10:00.
- Level-up: pause tree, dim bg, 3 random distinct cards, click/Space 1-3 to pick, resume. Reroll none in Lite. Duplicates allowed if stackable.

Pool 12 (IDs for code):
1. pistol_dmg +3 2. pistol_cd -0.08s 3. shotgun_pellet +1 4. shotgun_dmg +4 5. drone_dmg +12 6. drone_count +1 max3 7. hp_max +20 & heal 20 8. speed +12% max +40% 9. magnet +50px 10. armor -3 taken min1 11. regen +0.8/s 12. airstrike 80 all-screen + shake (once per pick, fun)

## 8. UI/UX
- HUD CanvasLayer: Top-center Timer MM:SS big 32px, Top XP bar + Lv, Bottom HP bar + numbers, Bottom-left Kills, Bottom-right weapon icons Lv pips, Boss HP top on boss.
- LevelUp Panel: Title "LEVEL UP — Pick 1", 3 cards (icon+name+desc), keyboard 1-3.
- GameOver: "KIA — Time, Kills, Level, [R] Retry [M] Menu". Victory: "ZONE CLEARED!" same + damage dealt.
- Pause: Esc → Resume/Restart/Quit to title (title minimal in Lite).
- Readability: 1280x720, fonts 16-32, HP red/green, XP cyan, damage white/yellow crit.

## 9. Juice & Feel (mandatory)
- Muzzle flash, tracer, casing (despawn 0.6s), hit flash 0.1s, damage numbers float+fade pooled, death poof + gem pop, hurt vignette + shake 4-6px 0.15s, level-up ring + freeze 0.15s, boss warning shake, shotgun knockback, pickup magnet streak.
- No screen flash >100ms (photosafety). Shake toggle in pause.

## 10. Audio (1 loop + 9 SFX)
- Music: dark synth intense 120bpm 2-min loop, -18dB. Prompt for Suno: "dark synth military survivors loop, driving bass 120bpm, no vocals, tense, loopable".
- SFX: pistol_pew, shotgun_boom, drone_tick, hit_flesh, zombie_die, gem_pickup (pitch+ per combo), levelup, player_hurt, airstrike_whistle+boom, boss_roar, ui_click. Volumes -6 to -12dB, pitch rand 0.9-1.1.
- Naming: `sfx_<name>.ogg` 44.1kHz mono, `mus_zone_loop.ogg` stereo.

## 11. Art Style (locked — see art-prompts.md)
- Style B Chibi Military (recommended): big-head soldier, cute-but-gritty zombies, thick outline, flat + 1 shade, dark asphalt BG.
- Sizes: soldier 32x42, walker/runner/shooter 32x32, brute 48x48, warlord 96x96, gems 12-16px, tracer 12x3, drone 24x24.
- Background: 256x256 tileable cracked asphalt + blood decals + props (sandbag, crate, barrel) scattered, vignette.

## 12. Out of Scope (Lite NO)
No shop/meta coins, no save (only best time PlayerPrefs), no 2nd map/character, no weapon evolution, no minimap, no story/dialogue, no daily/leaderboard, no mobile joystick (v2), no multiplayer.

## 13. Future Steam $5.99 (Phase 2, AFTER Lite validates)
- 3 zones (Street/Base/Lab), 8 guns + evolutions (Pistol8+Boots→SMG), 5 heroes, 10 zombies incl Sniper/Spawner, meta coins+shop, achievements, 30s trailer, Next Fest demo.
- Go if: 500+ itch plays, 60%+ positive.

## 14. Commercial Hooks
- Names: Last Operator: Dead Zone / Zombie Frontline Survivor. Tags: survivors-like, zombies, military, top-down-shooter, singleplayer, pixel/chibi.
- Trailer beats 0-5s: 100 zombies swarm → shotgun boom clears → "10 MINUTES. 1 OPERATOR." → boss fan shot dodge.
