# Balance Review — Last Operator: Dead Zone

Reviewed against the live numbers in `game.js` (CONFIG, UPGRADES, spawner/boss logic) cross-checked with `game-design.md`. All formulas and figures below are computed directly from those files, not estimated from the GDD prose alone. Monetization/economy is out of scope per the brief (premium one-time-purchase game).

---

## 1. Difficulty Ramp (Min 0→10)

**Alive caps:** 25 (0-2) → 50 (2-5) → 80 (5-7) → 90 (7-9) → 100 (9-10), plus a 1.5x spawn-interval multiplier (`RATE_MULT_MIN_9_10`) for the last minute.

**Raw spawn-attempt rate** (spawns/sec, ignoring caps, summing every active spawner's `1/interval`):

| Phase | Spawners active | Attempts/sec | Δ vs prior |
|---|---|---|---|
| 0-2 | Walker (1.0s) | 1.00 | — |
| 2-5 | + Runner (2.5s) | 1.40 | +40% |
| 5-7 | + Brute (6.0s) | 1.57 | +12% |
| 7-9 | + Shooter (4.0s, cap 6) | 1.82 | +16% |
| 9-10 | ×1.5 rate mult | 2.73 | **+50%** |

Verdict: **the ramp from Min 0 to Min 9 is smooth.** Each new enemy type lands with a proportionally modest bump in raw spawn pressure (12-40%), and the type introductions are staggered 2+ minutes apart, giving the player's build (which is also compounding every ~1-2 levels) time to absorb each new threat before the next one arrives. The alive-cap curve tells the same story: relative growth is 25→50 (+100%), 50→80 (+60%), 80→90 (+12.5%), 90→100 (+11%) — front-loaded numeric growth that lines up with when the arena is still easy (early walkers are trivial 1-hit-kill fodder), then flattens once the enemy roster is fully diversified.

**One real spike worth flagging:** the Min 9 transition stacks *two* escalation vectors at once — the alive cap ticks up (90→100) **and** every spawn interval is divided by 1.5 in the same instant, producing the single sharpest spawn-rate jump in the whole run (+50%, vs +12-16% for every earlier transition), landing just 60 seconds before the Warlord fight. It's probably intentional ("final stretch" tension), and it isn't a hard wall since the player already has most of their build online by then, but it is measurably the steepest ramp point in the design, immediately followed by the hardest fight in the game with minimal recovery window between them.

**A genuine strength worth calling out:** the Shooter's ranged AI (Min 7+, telegraphed via a 0.8s red laser before it fires) functions as an implicit tutorial for the boss's own 5-bullet spread attack. By the time the Warlord shows up at 10:00, the player has already had ~3 minutes of low-stakes practice reading "red laser = dodge" against a single, weak (60 HP) shooter before facing the same pattern from something far scarier. That's good sequencing, not a coincidence worth "fixing."

No difficulty plateaus were found — every phase either adds a new spawner or raises the cap, so there's no stretch where the game just idles at the same pressure for multiple minutes.

---

## 2. Upgrade Pool Balance

Twelve cards, all in `weapons`/`player`/CONFIG. Checked each for uncapped scaling (`isMaxed` always `false`) vs hard caps, and modeled rough DPS/EHP contribution.

**Weapon triangle (pistol/shotgun/drone) is reasonably balanced:**
- Pistol: 12 dmg / 0.7s = 17.1 DPS base, single-target, 0 pierce, 620 range. Confirms the GDD's own balance target exactly: 2 hits (24 dmg) kill a 22 HP walker.
- Shotgun: 5×8 dmg / 2.2s = 18.2 DPS base if every pellet connects, 280 range, but pellets fan out over a 40° cone and each pellet resolves against the *first* enemy it touches independently — so in practice it spreads damage across multiple targets in a cluster rather than deleting one enemy per shot. Good area-denial tool against the fodder swarm, as intended.
- Drone: 18 dmg per hit, but **the 0.4s hit-cooldown lives on the enemy, not the drone** (`e.droneHitCooldown`), so a second or third orbiting drone does *not* multiply damage against a single stationary target (e.g. a Brute or the Boss) — it only lets you tag more *simultaneous, distinct* enemies. That's a correct and non-obvious design detail: `drone_count` is a swarm-clearing stat, `drone_dmg` is the single-target (boss/brute) scaling stat. Both have a clear, non-overlapping niche — this is good design, not a flaw.

No card in the pistol/shotgun/drone line is dead weight; `pistol_dmg`/`shotgun_dmg`/`drone_dmg` are uncapped and remain relevant all run, while the capped variants (`pistol_cd` floor 0.32s, `shotgun_pellet` cap 7, `drone_count` cap 3) naturally rotate out of the pool once maxed, which is correct pool hygiene (players never see a literally-useless "this does nothing" card).

**One card is a likely standout ("safe pick") early:** `pistol_cd` (-0.08s, floor 0.32s). Because DPS = dmg/interval, each successive pick's *percentage* gain actually *increases* as the interval shrinks: 0.70→0.62s is +12.9% DPS, but 0.46→0.38s is +21%, and by the time it floors at 0.32s the pistol's DPS has grown from 17.1 to 37.5 (+119%) off this card alone. It's a very strong, low-opportunity-cost pick in the first ~5 level-ups (before it caps out and leaves the pool). This isn't broken — it's a normal "attack speed is king early" pattern seen across the genre — but it's worth knowing it's probably the most commonly "correct" pick in a fresh run.

**Armor Plating is the one card I'd flag as genuinely overtuned relative to the rest of the pool.** Two mechanics compound:
1. `damagePlayer()` applies a **flat** `-3` per pick with a hard floor of 1 dmg, and `isMaxed` always returns `false` — there is no cap, so it can be picked every single level-up.
2. The player has a single **global** 0.5s i-frame (`player.iframe`) that applies after *any* hit, from *any* source — meaning no matter how many enemies are touching the player simultaneously, damage can only land once per 0.5s window. This makes a flat per-hit reduction extremely powerful, because it applies to literally every damage instance the player will ever take, with no way for the swarm to "gang up" around it.

Concretely, against the two most common damage sources in the game:
- Walker touch (10 dmg): 1 pick → 7 dmg (-30%), 2 picks → 4 dmg (-60%), **3 picks → 1 dmg (-90%, min-clamped)**.
- Boss spread bullet (15 dmg) / Shooter bullet (12 dmg): 3 picks (-9) → 6 / 3 dmg (-60% / -75%); 5 picks (-15) → both bullets deal the 1-dmg floor.
- Even the Brute (20 dmg) and Boss touch (30 dmg) — the two hardest-hitting sources in the game — drop to the 1-dmg floor by 7 and 10 picks respectively.

Comparing survivability-per-pick against `hp_max` (+20 & full heal, also uncapped): against sustained walker pressure (worst case 10 dmg every 0.5s = 20 DPS), base 100 HP survives 5s. Three `hp_max` picks (→160 HP) survive 8s (**1.6x**). Three `armor` picks (10→1 dmg/hit = 2 DPS) survive **50s** (**10x**) for the same three level-up slots. Armor isn't just "good," it's an order of magnitude more efficient than the game's other pure-defense card once stacked, and because there's no cap, a player who prioritizes it can make the majority of the bestiary (everything dealing ≤15 dmg per hit — Walker, Runner, Shooter melee and bullet, Boss bullet) functionally harmless well before the 10:00 mark.

**Weakest/lowest-impact card:** `magnet` (+50px pickup range, base 80px, uncapped). It doesn't affect damage or the effective-HP calculus at all, and its practical value is smaller than it looks: because the pistol auto-targets the *nearest* enemy every shot (not a fixed target), most kills happen as an enemy closes toward the player rather than at the pistol's full 620px range, so a large share of gem drops already land inside or near the 80px base radius without any investment. It's not dead weight (it does meaningfully help scoop up strays while kiting, especially once Runners are in the mix), but it's the one card that never competes with the dmg/defense picks on impact — it's a "if nothing else is offered" pick more than a priority target.

**Note on weapon-unlock pacing vs. the GDD:** the GDD text says the Shotgun/Drone are "unlock Lv3 choice" / "unlock Lv5 choice," but the actual `UPGRADES` array has no level gate at all — `pickRandomUpgrades()` only filters on `isMaxed()`, so all 12 cards (including both weapon-unlock cards) are eligible from the very first level-up. With 4 of the 12 cards being weapon-unlock-capable (`shotgun_pellet`, `shotgun_dmg`, `drone_dmg`, `drone_count`) and 3 cards shown per level-up, there's a ~75% chance (1 − C(8,3)/C(12,3) = 1 − 56/220) that at least one weapon-unlock card appears at *any given* level-up — meaning most runs will have both extra weapons online well before the GDD's narrative Lv3/Lv5 targets. This is a documentation/implementation mismatch rather than a balance bug per se (getting your full 3-weapon kit earlier just feels good), but it's worth knowing the shipped pacing is faster and more RNG-driven than the GDD describes.

---

## 3. XP Curve Pacing

Formula: `need(level) = 8 + (level-1)*9`. Cumulative XP to reach each level:

| Level | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Cumulative XP | 8 | 25 | 51 | 86 | 130 | 183 | 245 | 316 | 396 | 485 | 583 | 690 | 806 | 931 | 1065 |

GDD's stated target is Lv 12-16 by 10:00, i.e. an **average** XP rate of 0.97-1.78 XP/sec sustained across the full 600s.

Sanity-checking against actual kill throughput: with the pistol alone (12 dmg / 0.7s, 2 hits to kill a 22 HP/1 XP walker), baseline kill rate is 1 kill per 1.4s = **0.71 XP/sec** — already close to the low end of the target band using *zero* upgrades. Once Shotgun and Drone come online (typically within the first few level-ups per the analysis in §2), the player has up to three independent, simultaneously-firing kill streams instead of one, which comfortably pushes the realized rate into or above the 0.97-1.78 XP/sec band, especially once Runners (2 XP) and Brutes (8 XP) enter the mix from Min 2 and Min 5 onward.

**Verdict: the curve paces well and isn't meaningfully front- or back-loaded.** The arithmetic `+9`/level growth in *XP required* is roughly matched by the player's power growth being closer to *linear-or-better* per level-up (each pick adds a flat dmg/rate bonus, and the weapon count itself doubles/triples over the run), so time-per-level should stay roughly flat to slightly-decreasing across the run rather than snowballing into a wall — consistent with the "power fantasy ramp" pillar the GDD states. The GDD's own "first level-up in <30s" target is comfortably beaten (~11s on pure base-pistol math), which is a good thing given the stated pillar of "build power every ~40s" — it means the loop's first dopamine hit arrives faster than the design's own floor, not slower.

No changes recommended here — the curve and the kill-rate math it's built against line up with the documented design intent.

---

## 4. Boss Fight Fairness

Warlord: 2500 HP, 55 speed (much slower than the player's 230 base), 30 touch dmg, 40 radius; summons 4 Walkers every 8s; fires a 5-bullet, 50°-cone spread every 3s (15 dmg/bullet, 200 px/s).

**Touch damage is easily avoidable.** At 55 speed vs. the player's 230 (or up to 368 with maxed Boots), simply not standing still neutralizes the 30-dmg melee hit almost entirely — this is a kiting boss, not a cornering one.

**The spread attack is well-designed to be dodgeable, with one caveat.** The 50° cone over 5 bullets spaces adjacent bullets ~76px apart at the ~350px range the CONFIG comment cites, well clear of the ~20px contact radius (player r14 + bullet r6) — so normally only one bullet in a volley can hit, capping a "failed dodge" at 15 dmg, not 75. However, that gap math assumes ~350px range; a build that leans on the **Orbit Drone** needs to sit within ~135px of the boss to land any hits at all, and at that range the same 50° cone's bullets are only ~29px apart — close enough that a poorly-timed dodge could clip two bullets instead of one. It's a minor inconsistency between the intended "always max 1 bullet lands" guarantee and what a melee-adjacent (drone) build actually experiences, not a fundamental fairness problem.

**HP vs. realistic endgame DPS is in a reasonable range.** Modeling a "spread investment" build (1 pistol dmg/cd pick each, shotgun and drone each unlocked + 1 follow-up pick) gives roughly pistol 24 DPS + shotgun ~33 DPS + drone ~75 DPS (drone capped by the per-enemy 0.4s cooldown noted in §2) ≈ **130 DPS**, killing the boss in **~19 seconds** — a satisfying, non-trivial boss-fight length for the genre. A maximally-optimized glass-cannon build (heavy pistol/shotgun/drone dmg stacking, ~230+ DPS) could burst it down in ~11s, but that's earned build variance, not a tuning failure — it's the reward for a player who spent their whole run investing in offense instead of survivability.

**Verdict: the boss fight is fair and reasonably tuned as shipped.** No changes recommended to its core numbers (HP/dmg/summon rate). The one thing worth a design look (not necessarily a number change) is that the "safe dodge gap" math implicitly assumes a mid-range engagement the Orbit Drone build can't maintain.

---

## Recommended Changes

Only two changes are confident enough to specify concrete numbers for; everything else above is either "working as intended" or a "watch this in playtesting" note rather than a hard recommendation.

1. **Armor Plating scaling (§2).** `UPGRADE_ARMOR_STEP` currently `3`, and `armor`'s `isMaxed()` always returns `false` (no cap). This is the single most efficient defensive investment in the game by a wide margin (§2 math: 3 picks ≈ 10x survival time vs. `hp_max`'s 3-pick 1.6x), and by 5 picks it floors nearly every non-Brute, non-Boss-melee damage source in the game to the 1-dmg minimum.
   - `UPGRADE_ARMOR_STEP: 3 → 2`
   - Add a cap so it can eventually leave the pool like the other capped cards, e.g. `isMaxed: function() { return player.armor >= 10; }` (5 picks at the new step) instead of `return false;`.
   - This keeps Armor the best pure-defense card in the pool (as it probably should be) without letting it single-handedly trivialize the majority of the bestiary's damage by the mid-game.

2. **Min 9-10 spawn-rate spike (§1).** `RATE_MULT_MIN_9_10` (1.5x) applied as a single hard step at exactly Min 9 is, by a clear margin, the steepest ramp transition in the run (+50% spawn attempts instantaneously, vs. +12-16% at every earlier transition), landing 60s before the boss fight with no recovery window in between.
   - Consider splitting it into two smaller steps instead of one big one, e.g. add `RATE_MULT_MIN_8_9: 1.25` at Min 8 and reduce the final step to `RATE_MULT_MIN_9_10: 1.5 → 1.35`.
   - This is a lower-confidence suggestion than #1 — it may well be an intentional "final stretch" tension spike, and only real playtest data (does anyone die specifically in the 9:00-10:00 window who wouldn't otherwise?) should decide whether it's worth touching.

Everything else reviewed — the pistol/shotgun/drone triangle, the walker/runner/brute/shooter unlock cadence and alive-cap curve, the XP formula, and the boss's core HP/damage/summon numbers — held up under the math and does not need changes.
