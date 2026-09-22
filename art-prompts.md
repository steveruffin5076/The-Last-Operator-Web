> **STATUS: Art v1.0 is DONE - finals in art/ (see lineup.png). Below is the original generation plan, kept for reference.**

# ART PROMPTS — Chibi Military (Locked Style)
**Tool:** Leonardo.ai (free) or Midjourney. Backup free packs: Kenney Top-Down Shooter + itch Tiny Heroes.
**Rule:** Pick ONE style, use SAME suffix + seed for ALL. Don't mix realistic + chibi.

## 1. Style Lock (Recommended: Chibi Military)
Why: AI consistent, readable at 32px, cute sells + cheap to animate (2-frame bob).
- Master suffix (append to EVERY prompt):
`, chibi military top-down game sprite, viewed from above, big head small body, flat colors + 1 shade, thick black outline 2px, centered, full body, white background, no shadow, no text, game asset`
- Settings: PNG, 512px gen → downscale in Godot to target, Alchemy OFF for sprites (keeps flat), Prompt Magic OFF, Seed LOCKED (e.g. 84211) after first good soldier. Use Image-to-Image with soldier as reference for zombies (strength 0.3).
- Export: Remove bg (Leonardo Remove BG or Photopea Select+Delete), trim, name per §6. Import Godot: Filter Off (crisp), Compress Lossy.

If you hate chibi: swap suffix to `realistic dark top-down shooter sprite, ...` but keep same seed rule.

## 2. Player — Tactical Soldier
Target in-game: 32x42. Gen 512 then scale.
- Base: `tactical operator soldier with black helmet and green vest holding assault rifle pointing up, top-down game sprite [MASTER SUFFIX]`
- Variants (same seed, change 1 word): `... pointing up, walking frame legs apart` / `... hurt flash version pale` (or do hurt via modulate, no extra art).
- Muzzle flash (separate 16x16): `small yellow star muzzle flash burst, top-down shooter VFX, flat orange-yellow, white background [VFX SUFFIX: , game VFX icon, no character, centered]`
- Animation: No walk cycle in Lite. Code: bob scale 1.0↔1.05 + rotate to move dir + recoil kick 2px on shot.

## 3. Zombies (same seed + soldier reference 0.3)
All centered white bg, no shadow.

- Walker 32x32: `infected civilian zombie green skin torn gray shirt arms forward shambling, top-down [SUFFIX]`
- Runner 32x32: `fast infected zombie red athletic shirt leaning forward running pose screaming, top-down [SUFFIX]`
- Riot Brute 48x48: `big riot police zombie dark helmet and vest holding small shield on arm bulky, top-down [SUFFIX]`
- Shooter Gunner 32x32: `ex-soldier zombie camo uniform helmet holding pistol rifle forward glowing red eyes tactical vest, top-down [SUFFIX] — gun must be visible sticking out`
- Warlord Boss 96x96: `huge zombie commander warlord beret scar minigun arm bulky armor spikes, top-down boss [SUFFIX]`
- Consistency test: Put all 6 in one 512 canvas. Same outline? Same skin shade? If not, regen outlier with same seed + higher reference strength 0.5.

## 4. Weapons / Projectiles / Pickups
- Tracer 12x3: Don't AI. Draw in Godot: ColorRect yellow + glow via modulate. Or `horizontal yellow tracer bullet streak [VFX]`.
- Shotgun pellet 6x6 orange dot: draw, no AI.
- Drone 24x24: `tiny military quadcopter drone top view gray with red light, top-down [SUFFIX]`
- XP gems 12-16px: `small green crystal gem icon glowing, game pickup [VFX]` + blue + gold variants (change color word only).
- HP/Magnet/Armor icons 24x24 for level-up cards: `military icon [plate carrier vest], flat UI, dark bg, [VFX]` Repeat: boots, scanner, kevlar, medic cross, bullet, trigger, mag, buckshot, blades, backup drone, airstrike jet.
- 12 upgrade icons: generate as SET in one image then slice: `set of 12 military upgrade icons grid, flat, dark background, chibi military UI [SUFFIX UI]` — or use Kenney UI pack to save time (recommended Week 2).

## 5. Background & Props (tileable)
- Base tile 256x256: `dark cracked asphalt top-down texture tileable seamless, subtle noise, military zone, no objects, top-down [BG SUFFIX: , game background texture, tileable, no character]`
- Test tile: 3x3 in Godot, no visible seams. If seam → regenerate with `seamless` + Guideline 0.4 or use Kenney asphalt.
- Decals (scattered, multiply 0.6 alpha): blood splatter dark, oil stain, shell casings pile, cracks. Prompt: `top-down [blood splatter dark] decal, grunge, transparent feel, white background [VFX]`
- Props 32-64px (collision OFF in Lite, visual only): sandbag line, wooden crate, explosive barrel red, traffic cone. `top-down [sandbag wall] game prop, chibi military [SUFFIX]`

## 6. Sizes & Naming
- In-game px: soldier 32x42, zombies 32/48, boss 96, drone 24, gems 12-16, tracer 12x3, muzzle 16, tiles 256, icons 24/32.
- Files: `art/chr_soldier.png, zmb_walker.png, zmb_runner.png, zmb_brute.png, zmb_shooter.png, boss_warlord.png, wpn_drone.png, vfx_muzzle.png, gem_green/blue/gold.png, bg_asphalt.png, prop_<name>.png, icon_<upgrade_id>.png`
- Import: Snap Off, Filter Off, Mipmaps On for BG only.

## 7. Week Plan for Art (don't block code)
- Week 1: Placeholders (ColorRect). No AI yet.
- Week 2: Soldier + walker/runner + gems (1 hr Leonardo batch).
- Week 3: Brute/shooter/boss + BG tile (1 hr).
- Week 4: Icons (use Kenney if rushed) + muzzle/casings + thumbnail art `chibi soldier surrounded by zombies night city dramatic` 1280x720 for itch.io.

## 8. Free Backup Packs (if AI fails)
- Kenney.nl: Top-Down Shooter + Roguelike Characters (CC0, consistent).
- itch.io: Tiny Heroes / Survivor Sprites ($0-15). Reskin names only, keep code same.
- Rule: Placeholder > No build. Swap art anytime, code doesn't change.
