# HANDOFF — The Last Operator: Dead Zone (WEB BUILD, paste into a new chat)

## What this is
Top-down 2D zombie survivors-lite (Vampire Survivors formula). Solo beginner dev
(Director/Tester background, no coding) + AI. Goal: commercial indie studio.
WEB BUILD: pure HTML5/JS + Canvas, NO game engine. Runs by double-clicking index.html.

## Locked decisions (do NOT relitigate)
- Stack: vanilla HTML5 + JavaScript + Canvas 2D. No Godot/Unity/frameworks/npm.
  No ES modules, no fetch() (both break on file://).
- Platform: Browser FIRST. Test = double-click index.html. Publish = zip with
  index.html at root to itch.io HTML5 (+ optional free URL via GitHub Pages).
- Scope Lite v1.0: 1 map 2500x2500, 1 soldier, 3 auto-weapons (pistol/shotgun/drone),
  4 melee zombies + Warlord boss, 10:00 run, 12 upgrades. No shop/save/multiplayer.
- Art: DONE. 16 chibi-military PNGs in art/ (transparent). Zero sprite sheets needed.
- AI workflow: Claude Code in project folder, ONE prompt from claude-prompts-web.md
  at a time, test = refresh browser + F12 zero errors, commit to git.

## Repo map
MUSE.md (AI rules — obey it) · plan.md (28-day plan) · game-design.md (GDD) ·
claude-prompts-web.md (Prompts 0–10 in order — USE THIS, not Godot prompts) ·
tech-web.md (web tech spec) · testing-checklist.md · progress.md (tracker) ·
art/ (16 PNGs below) · lineup.png

## Art manifest (all in art/, transparent except bg)
chr_soldier.png (player top-down) · chr_portrait.png (UI portrait) ·
zmb_walker.png · zmb_runner.png · zmb_brute.png · zmb_shooter.png ·
boss_warlord.png · gem_green/blue/gold.png · wpn_drone.png · vfx_muzzle.png ·
prop_sandbag/crate/barrel.png · bg_asphalt.png (full-bleed tile, not transparent)

## Current status
Day 0 done: repo + docs + art ready. Code NOT started.
Next step: Prompt 0 Web Bootstrap from claude-prompts-web.md.

## How to work with this user
- Beginner: explain like to a smart non-coder. Small chunks, no jargon dumps.
- Director/Tester strengths: give test checklists + cut/scope decisions.
- Keep answers short; he dislikes long messy instructions.
- Never generate a "full game" at once; max 2–3 files per change.
- Timezone Asia/Kuala_Lumpur, Malaysia. Simple English.
