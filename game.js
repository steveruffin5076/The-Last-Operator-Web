// =============================================================
// LAST OPERATOR: DEAD ZONE — game.js
// Plain script, no modules, no build tools. Must work from
// double-clicked index.html (file:// protocol).
//
// File is organized into clearly labeled sections. Later prompts
// will fill in the "stub" sections with real gameplay code.
// =============================================================

// -------------------------------------------------------------
// SECTION: CONFIG
// Constants that describe the game world. Nothing in here
// changes while the game runs -- it's just numbers/settings.
// -------------------------------------------------------------
var CONFIG = {
  CANVAS_W: 1280,
  CANVAS_H: 720,
  DT_CLAMP: 0.033, // max seconds per frame (protects against tab-switch lag spikes)

  WORLD_W: 2500, // arena size (per game-design.md section 2)
  WORLD_H: 2500,

  PLAYER_SPEED: 230, // px/sec
  PLAYER_HP_MAX: 100,
  PLAYER_MAGNET: 80, // gem pickup radius, used in a later prompt
  PLAYER_SPRITE_W: 32, // draw size (GDD: soldier 32x42)
  PLAYER_SPRITE_H: 42,
  PLAYER_RADIUS: 14, // collision circle for touch damage
  PLAYER_IFRAME_TIME: 0.5, // seconds of invulnerability after being hit

  WALKER_HP: 22,
  WALKER_TOUCH_DMG: 10,
  WALKER_SPEED: 75,
  WALKER_XP: 1, // used once gems exist in a later prompt
  WALKER_RADIUS: 13,
  WALKER_DRAW_SIZE: 40,
  SPAWN_INTERVAL: 1.0, // seconds between walker spawns (always active)

  RUNNER_HP: 14,
  RUNNER_TOUCH_DMG: 8,
  RUNNER_SPEED: 145,
  RUNNER_XP: 2,
  RUNNER_RADIUS: 11,
  RUNNER_DRAW_SIZE: 40,
  RUNNER_ZIGZAG_HZ: 2, // wiggle frequency (GDD: sin 2Hz)
  RUNNER_ZIGZAG_AMP: 30, // sideways wiggle strength, added as extra speed
  RUNNER_MIN_START: 2, // runners start spawning at Min 2
  RUNNER_SPAWN_INTERVAL: 2.5,

  BRUTE_HP: 140,
  BRUTE_TOUCH_DMG: 20,
  BRUTE_SPEED: 48,
  BRUTE_XP: 8,
  BRUTE_RADIUS: 20,
  BRUTE_DRAW_SIZE: 60,
  BRUTE_MIN_START: 5, // brutes start spawning at Min 5
  BRUTE_SPAWN_INTERVAL: 6.0,

  SHOOTER_HP: 60,
  SHOOTER_TOUCH_DMG: 14,
  SHOOTER_SPEED: 95,
  SHOOTER_XP: 5,
  SHOOTER_RADIUS: 13,
  SHOOTER_DRAW_SIZE: 40,
  SHOOTER_MIN_START: 7, // shooters start spawning at Min 7 (melee-only v1 -- ranged AI is Prompt 10)
  SHOOTER_SPAWN_INTERVAL: 4.0,
  SHOOTER_CAP: 8, // separate alive-cap just for shooters, on top of the overall cap

  SPAWN_RING_MIN: 720, // enemies spawn in a ring this far from the player...
  SPAWN_RING_MAX: 940, // ...so they never pop into view
  DESPAWN_DIST: 1300, // enemies this far away get removed (no XP refund)

  // Alive cap ramps up as the run goes on, per the wave table.
  CAP_MIN_0_2: 25,
  CAP_MIN_2_5: 50,
  CAP_MIN_5_7: 80,
  CAP_MIN_7_9: 90,
  CAP_MIN_9_10: 100,
  RATE_MULT_MIN_9_10: 1.5, // Min 9-10: all spawn intervals divided by this

  RUN_DURATION: 600, // 10:00 -- normal spawners stop here (boss lands in Prompt 7)

  SEPARATION_PUSH: 18, // max px two overlapping enemies get shoved apart per frame

  PISTOL_FIRE_INTERVAL: 0.7, // seconds between shots
  PISTOL_RANGE: 620, // only fires at enemies within this range
  PISTOL_BULLET_SPEED: 650, // px/sec
  PISTOL_DMG: 12,
  PISTOL_BULLET_LIFE: 1.4, // seconds before a bullet expires
  PISTOL_BULLET_RADIUS: 5,

  MUZZLE_FLASH_TIME: 0.06, // seconds the muzzle flash sprite is visible
  MUZZLE_FLASH_SIZE: 24, // pistol's flash size
  MUZZLE_TIP_DIST: 18, // how far in front of the player the flash is drawn

  FIRE_SHAKE_AMOUNT: 2, // px, "tiny shake" on every pistol shot
  SHAKE_DECAY_RATE: 40, // px/sec -- how fast shake settles back to 0

  DAMAGE_NUMBER_LIFE: 0.6, // seconds a floating damage number stays up
  DAMAGE_NUMBER_RISE: 40, // px/sec it drifts upward while fading

  SHOTGUN_FIRE_INTERVAL: 2.2, // seconds between blasts
  SHOTGUN_RANGE: 280,
  SHOTGUN_PELLET_COUNT: 5,
  SHOTGUN_CONE_DEG: 40, // total spread angle, centered on the target
  SHOTGUN_PELLET_DMG: 8,
  SHOTGUN_PELLET_LIFE: 0.5,
  // speed = range / life, so a pellet that hits nothing fades out exactly at max range
  SHOTGUN_PELLET_SPEED: 280 / 0.5,
  SHOTGUN_PELLET_RADIUS: 4,
  SHOTGUN_KNOCKBACK: 120, // px shoved away from the player on hit

  SHOTGUN_MUZZLE_FLASH_SIZE: 40, // "wide muzzle" -- bigger than the pistol's
  SHOTGUN_SHAKE_AMOUNT: 6, // "stronger shake" than the pistol's tiny 2px

  DRONE_RADIUS: 95, // px from the player the drone orbits at
  DRONE_ANGULAR_SPEED: 3.2, // rad/s
  DRONE_DRAW_SIZE: 30,
  DRONE_DMG: 18,
  DRONE_HIT_COOLDOWN: 0.4, // seconds before the same enemy can be hit again

  GEM_CHASE_SPEED: 430, // px/sec once a gem is within the magnet radius
  GEM_COLLECT_DIST: 22, // px -- closer than this and it's picked up
  GEM_DRAW_SIZE: 14,
  GEM_COMBO_WINDOW: 0.5, // seconds since the last pickup before the combo resets

  XP_BASE: 8, // XP needed for Lv1 -> Lv2
  XP_PER_LEVEL: 9, // extra XP needed per level after that (need = 8 + (level-1)*9)

  // --- Level-up upgrade pool (Prompt 5, GDD section 7's Pool 12) ---
  UPGRADE_PISTOL_DMG_STEP: 3,
  UPGRADE_PISTOL_CD_STEP: 0.08,
  UPGRADE_PISTOL_CD_MIN: 0.32,
  UPGRADE_SHOTGUN_PELLET_MAX: 7,
  UPGRADE_SHOTGUN_DMG_STEP: 4,
  UPGRADE_DRONE_DMG_STEP: 12,
  UPGRADE_DRONE_COUNT_MAX: 3,
  DRONE_BASE_COUNT: 1, // drones granted the instant the drone is first unlocked
  UPGRADE_HP_MAX_STEP: 20,
  UPGRADE_SPEED_STEP: 0.12,
  UPGRADE_SPEED_MULT_MAX: 1.6, // +60%
  UPGRADE_MAGNET_STEP: 50,
  UPGRADE_ARMOR_STEP: 3,
  UPGRADE_REGEN_STEP: 0.8,
  AIRSTRIKE_DMG: 80,
  AIRSTRIKE_SHAKE_AMOUNT: 14, // "big shake" -- more than the shotgun's 6px

  // --- Juice Pack (Prompt 8) ---
  HIT_FLASH_TIME: 0.08, // seconds an enemy stays bright white after being hit
  MAX_DAMAGE_NUMBERS: 40, // hard cap so a huge fight can't spam unbounded text
  HURT_VIGNETTE_TIME: 0.35, // seconds the red screen edge glow takes to fade after taking damage
  PARTICLE_LIFE: 0.4,
  PARTICLE_SPEED_MIN: 60,
  PARTICLE_SPEED_MAX: 180,
  PARTICLE_COUNT_PER_DEATH: 6,
  MAX_PARTICLES: 250, // hard cap per game-design.md's performance rules
  LEVELUP_FLASH_TIME: 0.5, // seconds the ring around the player takes to expand + fade
  LEVELUP_RING_MAX_RADIUS: 90,

  AUDIO_MASTER_GAIN: 0.22, // overall volume, per tech-web.md
  ENEMY_DIE_SOUND_THROTTLE: 0.06, // seconds between "enemy_die" blips, so a kill spree isn't a wall of noise

  BOSS_HP: 2500,
  BOSS_TOUCH_DMG: 30,
  BOSS_SPEED: 55,
  BOSS_RADIUS: 40,
  BOSS_XP: 50,
  BOSS_DRAW_SIZE: 130,
  BOSS_WARNING_DURATION: 2.5, // seconds the WARNING banner shows before it spawns
  BOSS_SUMMON_INTERVAL: 8.0, // seconds between the boss summoning walkers
  BOSS_SUMMON_COUNT: 4,
  BOSS_SHAKE_AMOUNT: 20, // biggest shake in the game, on boss spawn
};

// -------------------------------------------------------------
// SECTION: STATE
// All the "current situation" data lives here. One object so
// it's easy to find/reset/debug.
// -------------------------------------------------------------
var STATE = {
  mode: "title", // title -> play -> pause/levelup -> gameover/victory
  lastTime: 0,   // timestamp of previous animation frame, for computing dt
  elapsed: 0,    // seconds spent in "play" mode -- drives spawn timing/caps
  kills: 0,
  damageDealt: 0, // total dmg the player has dealt, shown on the Victory screen
};

// Boss state, separate from the enemies array's chase timer bookkeeping --
// null until the WARNING banner finishes and spawnBoss() runs.
var bossSpawned = false; // guards the WARNING sequence from firing twice
var bossWarningTimer = 0; // counts down the WARNING banner before spawnBoss()

// The player, dropped in the middle of the world to start.
var player = {
  x: CONFIG.WORLD_W / 2,
  y: CONFIG.WORLD_H / 2,
  hp: CONFIG.PLAYER_HP_MAX,
  angle: 0, // radians, which way the sprite is rotated to face
  iframe: 0, // seconds left of "can't be hit again" after taking damage
  level: 1,
  xp: 0,
  xpToNext: CONFIG.XP_BASE, // recomputed via xpNeededForLevel() on every level-up

  // Upgradeable stats -- these start as copies of the CONFIG baseline and
  // get modified by level-up picks, so CONFIG itself never changes.
  hpMax: CONFIG.PLAYER_HP_MAX,
  speedMult: 1, // multiplies CONFIG.PLAYER_SPEED; +12%/pick, capped at UPGRADE_SPEED_MULT_MAX
  magnet: CONFIG.PLAYER_MAGNET,
  armor: 0, // flat damage reduction, taking at least 1 dmg always gets through
  regen: 0, // HP per second
};

// Camera = top-left corner of the view into the world, in world pixels.
var camera = {
  x: 0,
  y: 0,
};

// Weapon stats that level-up picks modify. Pistol starts active; shotgun
// and drone start locked and only turn on once their first upgrade card
// is picked (see ensureShotgunUnlocked()/ensureDroneUnlocked() below).
var weapons = {
  pistol: {
    dmg: CONFIG.PISTOL_DMG,
    fireInterval: CONFIG.PISTOL_FIRE_INTERVAL,
  },
  shotgun: {
    unlocked: false,
    pelletCount: CONFIG.SHOTGUN_PELLET_COUNT,
    dmg: CONFIG.SHOTGUN_PELLET_DMG,
  },
  drone: {
    unlocked: false,
    dmg: CONFIG.DRONE_DMG,
    count: 0,
  },
};

// Orbit drones: each is just an angle around the player. Starts empty --
// the drone is locked until a level-up pick unlocks it.
var drones = [];

// All enemies currently alive (walkers/runners/brutes/shooters), as plain objects.
var enemies = [];
var walkerSpawnTimer = 0;
var runnerSpawnTimer = 0;
var bruteSpawnTimer = 0;
var shooterSpawnTimer = 0;
var perfLogTimer = 2; // logs enemy count to console every 2s (Prompt 2b perf check)

// Bullets currently in flight (pistol tracers + shotgun pellets), as plain
// {x, y, vx, vy, life, dmg, radius, knockback}. knockback is 0 for pistol.
var bullets = [];
var pistolCooldown = 0; // counts down to the next shot
var shotgunCooldown = 0;

// Muzzle flash size varies per weapon (shotgun's is "wide"), set at fire time.
var muzzleFlashSize = CONFIG.MUZZLE_FLASH_SIZE;

// Floating "-12" style damage numbers, as plain {x, y, value, life}.
var damageNumbers = [];

// Muzzle flash: a short-lived sprite drawn at the last shot's origin.
var muzzleFlashTimer = 0;
var muzzleFlashX = 0;
var muzzleFlashY = 0;
var muzzleFlashAngle = 0;

// Tiny screen shake magnitude (px), decays back to 0 every frame.
var screenShake = 0;

// Gems dropped by dead enemies, as plain {x, y, value, color}.
var gems = [];
var gemComboCount = 0; // consecutive pickups -- for the pickup blip's rising pitch (Prompt 9)
var gemComboTimer = 0; // combo resets once this hits 0

// Death particle burst: small dots flying outward from a dead enemy,
// as plain {x, y, vx, vy, life}. Hard-capped so a big fight can't
// let this array grow forever.
var particles = [];

// Red screen-edge glow that flashes in when the player takes damage,
// then fades back out. Counts down to 0 like the other cosmetic timers.
var hurtVignetteTimer = 0;

// Expanding ring drawn around the player on every level-up, purely cosmetic.
var levelUpFlashTimer = 0;

// -------------------------------------------------------------
// SECTION: ASSET LOADER
// Loads the 16 PNGs from art/ using relative paths + new Image().
// No fetch() (blocked on file://) -- just the Image object's
// built-in onload/onerror events.
// -------------------------------------------------------------
var ASSET_LIST = [
  "chr_soldier",
  "chr_portrait",
  "zmb_walker",
  "zmb_runner",
  "zmb_brute",
  "zmb_shooter",
  "boss_warlord",
  "gem_green",
  "gem_blue",
  "gem_gold",
  "wpn_drone",
  "vfx_muzzle",
  "prop_sandbag",
  "prop_crate",
  "prop_barrel",
  "bg_asphalt",
];

var ASSETS = {};      // filled in as: ASSETS["chr_soldier"] = <Image>
var assetsLoaded = 0; // how many finished (loaded OR errored)
var assetsTotal = ASSET_LIST.length;
var assetsReady = false; // true once every image has finished loading

function loadAssets() {
  for (var i = 0; i < ASSET_LIST.length; i++) {
    var name = ASSET_LIST[i];
    var img = new Image();

    // Count this image as "done" whether it succeeds or fails, so a
    // single missing file can't freeze the loader forever.
    img.onload = onAssetDone;
    img.onerror = function (e) {
      console.error("Failed to load art file:", e.target.src);
      onAssetDone();
    };

    img.src = "art/" + name + ".png"; // relative path -- works on file://
    ASSETS[name] = img;
  }
}

function onAssetDone() {
  assetsLoaded++;
  if (assetsLoaded >= assetsTotal) {
    assetsReady = true;
    console.log("All " + assetsTotal + " art assets loaded.");
  }
}

// -------------------------------------------------------------
// SECTION: INPUT
// Tracks which keys are currently held down. Later prompts (WASD
// movement, etc.) will read from this object.
// -------------------------------------------------------------
var KEYS = {}; // e.g. KEYS["w"] === true while W is held

window.addEventListener("keydown", function (e) {
  KEYS[e.key.toLowerCase()] = true;

  // 1/2/3 pick a level-up card, same as clicking it.
  if (STATE.mode === "levelup" && (e.key === "1" || e.key === "2" || e.key === "3")) {
    pickUpgrade(Number(e.key) - 1);
  }
});

window.addEventListener("keyup", function (e) {
  KEYS[e.key.toLowerCase()] = false;
});

// Reads WASD + arrow keys and returns a normalized {dx, dy} direction,
// so diagonal movement isn't faster than straight movement.
function getMoveVector() {
  var dx = 0;
  var dy = 0;

  if (KEYS["w"] || KEYS["arrowup"]) dy -= 1;
  if (KEYS["s"] || KEYS["arrowdown"]) dy += 1;
  if (KEYS["a"] || KEYS["arrowleft"]) dx -= 1;
  if (KEYS["d"] || KEYS["arrowright"]) dx += 1;

  if (dx !== 0 && dy !== 0) {
    // Diagonal: scale down so length stays 1 (1/sqrt(2)).
    dx *= 0.7071;
    dy *= 0.7071;
  }

  return { dx: dx, dy: dy };
}

// -------------------------------------------------------------
// SECTION: AUDIO
// No audio files, ever (tech-web.md) -- every sound is a plain
// oscillator "bleep" built with tone(f0, f1, dur, type, vol). All of
// it is wrapped in try/catch: a browser that blocks/throws on audio
// (e.g. some incognito setups) should never crash the game over it.
// -------------------------------------------------------------
var audioCtx = null;
var masterGain = null; // single volume knob everything routes through
var muted = false; // toggled by the M key
var dieSoundCooldown = 0; // throttles "enemy_die" so a kill spree isn't a wall of noise

function audioInit() {
  // Browsers require a user gesture (like clicking Start) before audio
  // can play -- this is called from the Start button's click handler.
  if (audioCtx) return; // already set up
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = CONFIG.AUDIO_MASTER_GAIN;
    masterGain.connect(audioCtx.destination);
  } catch (e) {
    console.error("WebAudio init failed:", e);
  }
}

function toggleMute() {
  muted = !muted;
  if (masterGain) {
    masterGain.gain.value = muted ? 0 : CONFIG.AUDIO_MASTER_GAIN;
  }
}

window.addEventListener("keydown", function (e) {
  if (e.key.toLowerCase() === "m") toggleMute();
});

// One oscillator that glides from f0 to f1 Hz over `dur` seconds, with a
// short fade-in/out envelope so it doesn't click. `type` is the waveform
// (square/sawtooth/sine/triangle), `vol` is 0-1 on top of the master gain.
// This one helper covers every SFX in the game -- see playSound() below.
function tone(f0, f1, dur, type, vol) {
  if (!audioCtx || muted) return;
  try {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    var now = audioCtx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(f0, now);
    osc.frequency.linearRampToValueAtTime(f1, now + dur);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.01);
    gain.gain.linearRampToValueAtTime(0, now + dur);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + dur);
  } catch (e) {
    console.error("tone() failed:", e);
  }
}

// Named hook every gameplay system calls (playSound('pistol_pew') etc.)
// so this is the only place that needs to know what each SFX sounds like.
function playSound(name) {
  if (!audioCtx) return;
  try {
    switch (name) {
      case "pistol_pew":
        tone(900, 500, 0.08, "square", 1);
        break;

      case "shotgun_boom":
        tone(180, 60, 0.25, "sawtooth", 1);
        break;

      case "gem_pickup":
        // Pitch rises with the combo count (capped so it can't go ultrasonic).
        var basePitch = 600 + Math.min(gemComboCount, 10) * 40;
        tone(basePitch, basePitch * 1.4, 0.1, "sine", 0.8);
        break;

      case "levelup_arp":
        // Quick 3-note major arpeggio: C5, E5, G5.
        tone(523, 523, 0.08, "square", 0.9);
        window.setTimeout(function () { tone(659, 659, 0.08, "square", 0.9); }, 80);
        window.setTimeout(function () { tone(784, 784, 0.15, "square", 0.9); }, 160);
        break;

      case "hurt":
        tone(220, 120, 0.15, "sawtooth", 0.9);
        break;

      case "enemy_die":
        if (dieSoundCooldown > 0) return; // throttled -- see ENEMY_DIE_SOUND_THROTTLE
        dieSoundCooldown = CONFIG.ENEMY_DIE_SOUND_THROTTLE;
        tone(300, 100, 0.08, "square", 0.5);
        break;

      case "airstrike_whistle":
        tone(1600, 200, 0.5, "sine", 0.8);
        break;

      case "boss_roar":
        tone(90, 40, 0.6, "sawtooth", 1);
        break;

      case "win_jingle":
        // Rising 4-note fanfare: C5, E5, G5, C6.
        tone(523, 523, 0.12, "square", 0.9);
        window.setTimeout(function () { tone(659, 659, 0.12, "square", 0.9); }, 120);
        window.setTimeout(function () { tone(784, 784, 0.12, "square", 0.9); }, 240);
        window.setTimeout(function () { tone(1047, 1047, 0.3, "square", 0.9); }, 360);
        break;

      case "lose_jingle":
        // Falling minor tones.
        tone(300, 300, 0.15, "sawtooth", 0.9);
        window.setTimeout(function () { tone(250, 250, 0.15, "sawtooth", 0.9); }, 150);
        window.setTimeout(function () { tone(180, 90, 0.4, "sawtooth", 0.9); }, 300);
        break;

      case "ui_click":
        tone(700, 700, 0.04, "square", 0.5);
        break;
    }
  } catch (e) {
    console.error("playSound() failed:", e);
  }
}

// -------------------------------------------------------------
// SECTION: ENEMIES
// Enemies are plain objects in one array (no classes needed).
// Each has a "type" (walker/runner/brute) plus its own hp/speed/
// radius/touchDmg, so the shared movement+collision loop below
// doesn't need to know the differences -- except runners, which
// get an extra sideways wiggle.
// -------------------------------------------------------------

// Drops a new enemy in a ring around the player so it appears just
// off-screen instead of popping into view. `props` carries the
// type-specific stats (hp/speed/radius/touchDmg/...).
function spawnEnemyInRing(props) {
  var angle = Math.random() * Math.PI * 2;
  var dist = CONFIG.SPAWN_RING_MIN + Math.random() * (CONFIG.SPAWN_RING_MAX - CONFIG.SPAWN_RING_MIN);

  props.x = player.x + Math.cos(angle) * dist;
  props.y = player.y + Math.sin(angle) * dist;
  props.droneHitCooldown = 0; // can be hit by the orbit drone right away
  enemies.push(props);
}

function spawnWalker() {
  spawnEnemyInRing({
    type: "walker",
    hp: CONFIG.WALKER_HP,
    radius: CONFIG.WALKER_RADIUS,
    speed: CONFIG.WALKER_SPEED,
    touchDmg: CONFIG.WALKER_TOUCH_DMG,
    xp: CONFIG.WALKER_XP,
  });
}

function spawnRunner() {
  spawnEnemyInRing({
    type: "runner",
    hp: CONFIG.RUNNER_HP,
    radius: CONFIG.RUNNER_RADIUS,
    speed: CONFIG.RUNNER_SPEED,
    touchDmg: CONFIG.RUNNER_TOUCH_DMG,
    xp: CONFIG.RUNNER_XP,
    phase: Math.random() * Math.PI * 2, // offsets the wiggle so runners don't all sway in sync
  });
}

function spawnBrute() {
  // Knock-resist (GDD) is handled in updateBullets() by checking
  // e.type === "brute" directly, so there's nothing to set here.
  spawnEnemyInRing({
    type: "brute",
    hp: CONFIG.BRUTE_HP,
    radius: CONFIG.BRUTE_RADIUS,
    speed: CONFIG.BRUTE_SPEED,
    touchDmg: CONFIG.BRUTE_TOUCH_DMG,
    xp: CONFIG.BRUTE_XP,
  });
}

function spawnShooter() {
  // v1 is melee-only (just chases like everything else) -- the
  // aim/charge/shoot ranged AI is Prompt 10, behind USE_RANGED.
  spawnEnemyInRing({
    type: "shooter",
    hp: CONFIG.SHOOTER_HP,
    radius: CONFIG.SHOOTER_RADIUS,
    speed: CONFIG.SHOOTER_SPEED,
    touchDmg: CONFIG.SHOOTER_TOUCH_DMG,
    xp: CONFIG.SHOOTER_XP,
  });
}

// How many shooters are currently alive -- they have their own alive
// cap (8) on top of the overall per-minute cap.
function countShooters() {
  var count = 0;
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].type === "shooter") count++;
  }
  return count;
}

// Removes a dead enemy, counts the kill, and drops its gem. Shared by
// every damage source (bullets, drone contact) so there's one place
// that knows what happens when something dies.
function killEnemy(index, e) {
  enemies.splice(index, 1);
  STATE.kills++;
  spawnGem(e.x, e.y, e.xp);
  spawnDeathParticles(e.x, e.y);
  playSound("enemy_die");

  if (e.type === "boss") {
    triggerVictory();
  }
}

// Applies damage + a floating number to one enemy, killing it if it drops
// to 0 HP. Shared by bullets, the drone, and the airstrike upgrade so
// they don't each re-implement "hit it, show a number, maybe kill it".
function damageEnemyAt(index, e, amount) {
  e.hp -= amount;
  e.hitFlash = CONFIG.HIT_FLASH_TIME; // brief white flash, drawn in drawEnemies()
  STATE.damageDealt += amount;
  spawnDamageNumber(e.x, e.y, amount);
  if (e.hp <= 0) {
    killEnemy(index, e);
  }
}

// How many enemies are allowed alive at once, based on run time so
// far. Widens in steps as the wave table calls for tougher minutes.
function getAliveCap() {
  var elapsedMin = STATE.elapsed / 60;
  if (elapsedMin >= 9) return CONFIG.CAP_MIN_9_10;
  if (elapsedMin >= 7) return CONFIG.CAP_MIN_7_9;
  if (elapsedMin >= 5) return CONFIG.CAP_MIN_5_7;
  if (elapsedMin >= 2) return CONFIG.CAP_MIN_2_5;
  return CONFIG.CAP_MIN_0_2;
}

// Min 9-10 spawns 1.5x faster (shorter intervals) per the wave table.
function getSpawnRateMultiplier() {
  return STATE.elapsed / 60 >= 9 ? CONFIG.RATE_MULT_MIN_9_10 : 1;
}

// Cheap pair separation: any two overlapping enemies get nudged
// apart, capped to a small push per frame so it stays smooth even
// with dozens of enemies (an O(n^2) loop, but n stays under ~100).
function applySeparation() {
  var maxPush = CONFIG.SEPARATION_PUSH / 2; // half each, so the pair separates by the full amount

  for (var i = 0; i < enemies.length; i++) {
    for (var j = i + 1; j < enemies.length; j++) {
      var a = enemies[i];
      var b = enemies[j];
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var minDist = a.radius + b.radius;

      if (dist > 0 && dist < minDist) {
        var overlap = minDist - dist;
        var pushX = clamp((dx / dist) * overlap * 0.5, -maxPush, maxPush);
        var pushY = clamp((dy / dist) * overlap * 0.5, -maxPush, maxPush);
        a.x -= pushX;
        a.y -= pushY;
        b.x += pushX;
        b.y += pushY;
      }
    }
  }
}

function updateEnemies(dt) {
  var cap = getAliveCap();
  var elapsedMin = STATE.elapsed / 60;
  var rateMult = getSpawnRateMultiplier();

  // 10:00: stop all normal spawning (the boss takes over from here in
  // Prompt 7). Existing enemies keep fighting until the boss fight starts.
  var stopNormals = STATE.elapsed >= CONFIG.RUN_DURATION;

  // --- spawners: walkers always run, others unlock at their minute ---
  if (!stopNormals) {
    walkerSpawnTimer -= dt;
    if (walkerSpawnTimer <= 0) {
      walkerSpawnTimer = CONFIG.SPAWN_INTERVAL / rateMult;
      if (enemies.length < cap) spawnWalker();
    }

    if (elapsedMin >= CONFIG.RUNNER_MIN_START) {
      runnerSpawnTimer -= dt;
      if (runnerSpawnTimer <= 0) {
        runnerSpawnTimer = CONFIG.RUNNER_SPAWN_INTERVAL / rateMult;
        if (enemies.length < cap) spawnRunner();
      }
    }

    if (elapsedMin >= CONFIG.BRUTE_MIN_START) {
      bruteSpawnTimer -= dt;
      if (bruteSpawnTimer <= 0) {
        bruteSpawnTimer = CONFIG.BRUTE_SPAWN_INTERVAL / rateMult;
        if (enemies.length < cap) spawnBrute();
      }
    }

    if (elapsedMin >= CONFIG.SHOOTER_MIN_START) {
      shooterSpawnTimer -= dt;
      if (shooterSpawnTimer <= 0) {
        shooterSpawnTimer = CONFIG.SHOOTER_SPAWN_INTERVAL / rateMult;
        if (enemies.length < cap && countShooters() < CONFIG.SHOOTER_CAP) spawnShooter();
      }
    }
  }

  // Loop backwards so splice() (removing an enemy) doesn't skip the
  // next one -- a classic bug when removing items while looping forward.
  for (var i = enemies.length - 1; i >= 0; i--) {
    var e = enemies[i];
    var dx = player.x - e.x;
    var dy = player.y - e.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    // Wandered off too far (e.g. player ran away) -- just remove it,
    // no XP refund, per the spawner rules.
    if (dist > CONFIG.DESPAWN_DIST) {
      enemies.splice(i, 1);
      continue;
    }

    // Walk straight toward the player.
    if (dist > 0) {
      var dirX = dx / dist;
      var dirY = dy / dist;
      var moveX = dirX * e.speed * dt;
      var moveY = dirY * e.speed * dt;

      // Runners also wiggle side-to-side as they close in.
      if (e.type === "runner") {
        var perpX = -dirY;
        var perpY = dirX;
        var wiggle = Math.sin(STATE.elapsed * Math.PI * 2 * CONFIG.RUNNER_ZIGZAG_HZ + e.phase) * CONFIG.RUNNER_ZIGZAG_AMP;
        moveX += perpX * wiggle * dt;
        moveY += perpY * wiggle * dt;
      }

      e.x += moveX;
      e.y += moveY;
    }

    // Count down the hit-flash timer set by damageEnemyAt().
    if (e.hitFlash > 0) {
      e.hitFlash -= dt;
    }

    // Touch damage: only if close enough AND player isn't in i-frames.
    var touchDist = CONFIG.PLAYER_RADIUS + e.radius;
    if (dist < touchDist && player.iframe <= 0) {
      damagePlayer(e.touchDmg);
    }
  }

  applySeparation();

  // Perf check (Prompt 2b): log alive count every 2s so it's easy to
  // eyeball whether the cap ramp is behaving during a long test run.
  perfLogTimer -= dt;
  if (perfLogTimer <= 0) {
    perfLogTimer = 2;
    console.log("enemies alive:", enemies.length, "/ cap:", cap, "| elapsed:", STATE.elapsed.toFixed(1) + "s");
  }
}

// -------------------------------------------------------------
// SECTION: BOSS
// The Warlord is pushed into the same `enemies` array as everything
// else, with type "boss" -- so it gets chase movement, touch damage,
// bullet/drone hits, and death-handling completely for free from the
// generic loops above. This section only adds what's actually special
// about it: the WARNING countdown before it appears, and its walker
// summon timer.
// -------------------------------------------------------------

function findBoss() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].type === "boss") return enemies[i];
  }
  return null;
}

function spawnBoss() {
  spawnEnemyInRing({
    type: "boss",
    hp: CONFIG.BOSS_HP,
    radius: CONFIG.BOSS_RADIUS,
    speed: CONFIG.BOSS_SPEED,
    touchDmg: CONFIG.BOSS_TOUCH_DMG,
    xp: CONFIG.BOSS_XP,
    summonTimer: CONFIG.BOSS_SUMMON_INTERVAL,
  });
}

function startBossWarning() {
  bossWarningTimer = CONFIG.BOSS_WARNING_DURATION;
  screenShake = Math.max(screenShake, CONFIG.BOSS_SHAKE_AMOUNT);
  playSound("boss_roar");
  bossWarningEl.classList.remove("hidden");
}

function updateBoss(dt) {
  // 10:00 hits -> start the one-time WARNING sequence.
  if (!bossSpawned && bossWarningTimer <= 0 && STATE.elapsed >= CONFIG.RUN_DURATION) {
    bossSpawned = true;
    startBossWarning();
  }

  if (bossWarningTimer > 0) {
    bossWarningTimer -= dt;
    if (bossWarningTimer <= 0) {
      bossWarningEl.classList.add("hidden");
      spawnBoss();
    }
  }

  // Summon 4 walkers every 8s once the boss exists (its movement/touch
  // damage/death are already handled by the generic enemy loops).
  var boss = findBoss();
  if (boss) {
    boss.summonTimer -= dt;
    if (boss.summonTimer <= 0) {
      boss.summonTimer = CONFIG.BOSS_SUMMON_INTERVAL;
      for (var i = 0; i < CONFIG.BOSS_SUMMON_COUNT; i++) {
        spawnWalker();
      }
    }
  }
}

// -------------------------------------------------------------
// SECTION: WEAPONS
// The pistol auto-fires at whatever's nearest, no aiming needed.
// Bullets are plain objects in an array, same pattern as enemies.
// -------------------------------------------------------------

// Finds the closest enemy within range, or null if none qualify.
function findNearestEnemy(maxRange) {
  var nearest = null;
  var nearestDist = maxRange;

  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    var dx = e.x - player.x;
    var dy = e.y - player.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= nearestDist) {
      nearest = e;
      nearestDist = dist;
    }
  }

  return nearest;
}

function firePistol(target) {
  var dx = target.x - player.x;
  var dy = target.y - player.y;
  var dist = Math.sqrt(dx * dx + dy * dy) || 1; // avoid divide-by-zero
  var dirX = dx / dist;
  var dirY = dy / dist;

  bullets.push({
    x: player.x,
    y: player.y,
    vx: dirX * CONFIG.PISTOL_BULLET_SPEED,
    vy: dirY * CONFIG.PISTOL_BULLET_SPEED,
    life: CONFIG.PISTOL_BULLET_LIFE,
    dmg: weapons.pistol.dmg,
    radius: CONFIG.PISTOL_BULLET_RADIUS,
    knockback: 0,
  });

  // Muzzle flash + tiny shake, both purely cosmetic.
  muzzleFlashX = player.x + dirX * CONFIG.MUZZLE_TIP_DIST;
  muzzleFlashY = player.y + dirY * CONFIG.MUZZLE_TIP_DIST;
  muzzleFlashAngle = Math.atan2(dirY, dirX);
  muzzleFlashTimer = CONFIG.MUZZLE_FLASH_TIME;
  muzzleFlashSize = CONFIG.MUZZLE_FLASH_SIZE;
  screenShake = Math.max(screenShake, CONFIG.FIRE_SHAKE_AMOUNT);
  playSound("pistol_pew");
}

function fireShotgun(target) {
  var dx = target.x - player.x;
  var dy = target.y - player.y;
  var dist = Math.sqrt(dx * dx + dy * dy) || 1;
  var dirX = dx / dist;
  var dirY = dy / dist;
  var baseAngle = Math.atan2(dirY, dirX);

  // Spread the current pellet count evenly across the cone, centered
  // on the target's direction.
  var pelletCount = weapons.shotgun.pelletCount;
  var coneRad = (CONFIG.SHOTGUN_CONE_DEG * Math.PI) / 180;
  var step = pelletCount > 1 ? coneRad / (pelletCount - 1) : 0;
  var startAngle = baseAngle - coneRad / 2;

  for (var i = 0; i < pelletCount; i++) {
    var angle = startAngle + step * i;
    bullets.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * CONFIG.SHOTGUN_PELLET_SPEED,
      vy: Math.sin(angle) * CONFIG.SHOTGUN_PELLET_SPEED,
      life: CONFIG.SHOTGUN_PELLET_LIFE,
      dmg: weapons.shotgun.dmg,
      radius: CONFIG.SHOTGUN_PELLET_RADIUS,
      knockback: CONFIG.SHOTGUN_KNOCKBACK,
    });
  }

  // Wide muzzle flash + a noticeably stronger shake than the pistol's.
  muzzleFlashX = player.x + dirX * CONFIG.MUZZLE_TIP_DIST;
  muzzleFlashY = player.y + dirY * CONFIG.MUZZLE_TIP_DIST;
  muzzleFlashAngle = baseAngle;
  muzzleFlashTimer = CONFIG.MUZZLE_FLASH_TIME;
  muzzleFlashSize = CONFIG.SHOTGUN_MUZZLE_FLASH_SIZE;
  screenShake = Math.max(screenShake, CONFIG.SHOTGUN_SHAKE_AMOUNT);
  playSound("shotgun_boom");
}

function updateShotgun(dt) {
  if (!weapons.shotgun.unlocked) return; // locked until a shotgun card is picked

  shotgunCooldown -= dt;
  if (shotgunCooldown <= 0) {
    var target = findNearestEnemy(CONFIG.SHOTGUN_RANGE);
    if (target) {
      fireShotgun(target);
      shotgunCooldown = CONFIG.SHOTGUN_FIRE_INTERVAL;
    }
  }
}

function updatePistol(dt) {
  var target = findNearestEnemy(CONFIG.PISTOL_RANGE);

  // Face whatever we're about to shoot -- otherwise the soldier keeps
  // facing its last move direction while bullets fly out sideways,
  // which looks like the gun isn't aiming at anything.
  if (target) {
    var tdx = target.x - player.x;
    var tdy = target.y - player.y;
    player.angle = Math.atan2(tdx, -tdy); // same "art faces UP" convention as movement
  }

  pistolCooldown -= dt;
  if (pistolCooldown <= 0) {
    if (target) {
      firePistol(target);
      pistolCooldown = weapons.pistol.fireInterval;
    }
    // No target yet -- leave cooldown at/below 0 so we just check again
    // next frame instead of waiting out a full interval for nothing.
  }

  if (muzzleFlashTimer > 0) {
    muzzleFlashTimer -= dt;
  }
}

// Screen shake settles back to 0 at a fixed rate regardless of how big it
// was -- shared by every shake source (pistol/shotgun fire, airstrike,
// boss warning) since they all just raise `screenShake`, never set a timer.
function updateShake(dt) {
  screenShake = Math.max(0, screenShake - CONFIG.SHAKE_DECAY_RATE * dt);
}

// Red screen-edge glow that flashes in on damagePlayer() and fades back out.
function updateHurtVignette(dt) {
  if (hurtVignetteTimer > 0) {
    hurtVignetteTimer -= dt;
  }
  hurtVignetteEl.style.opacity = clamp(hurtVignetteTimer / CONFIG.HURT_VIGNETTE_TIME, 0, 1);
}

// Expanding ring around the player, triggered on every 'levelup' event.
// Just counts down here -- drawLevelUpFlash() in RENDER does the drawing.
function updateLevelUpFlash(dt) {
  if (levelUpFlashTimer > 0) {
    levelUpFlashTimer -= dt;
  }
}

function spawnDamageNumber(x, y, value) {
  damageNumbers.push({
    x: x,
    y: y,
    value: value,
    life: CONFIG.DAMAGE_NUMBER_LIFE,
  });

  // Hard cap: drop the oldest one so a big fight can't spam unbounded text.
  if (damageNumbers.length > CONFIG.MAX_DAMAGE_NUMBERS) {
    damageNumbers.shift();
  }
}

// Small burst of dots flying outward from a dead enemy. Capped so a big
// fight can't let this array grow forever -- oldest particles just get
// replaced by new ones once the cap is hit.
function spawnDeathParticles(x, y) {
  for (var i = 0; i < CONFIG.PARTICLE_COUNT_PER_DEATH; i++) {
    if (particles.length >= CONFIG.MAX_PARTICLES) {
      particles.shift();
    }
    var angle = Math.random() * Math.PI * 2;
    var speed = CONFIG.PARTICLE_SPEED_MIN + Math.random() * (CONFIG.PARTICLE_SPEED_MAX - CONFIG.PARTICLE_SPEED_MIN);
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: CONFIG.PARTICLE_LIFE,
    });
  }
}

function updateParticles(dt) {
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function updateBullets(dt) {
  // Loop backwards so splice() doesn't skip the next bullet.
  for (var i = bullets.length - 1; i >= 0; i--) {
    var b = bullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;

    var hitSomething = false;

    if (b.life > 0) {
      // Pistol has 0 pierce -- it stops at the first enemy it touches.
      for (var j = enemies.length - 1; j >= 0; j--) {
        var e = enemies[j];
        var dx = e.x - b.x;
        var dy = e.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < e.radius + b.radius) {
          // Shove the enemy away from the player (brutes shrug it off --
          // GDD calls them "knock-resist").
          if (b.knockback && e.type !== "brute") {
            var kdx = e.x - player.x;
            var kdy = e.y - player.y;
            var kdist = Math.sqrt(kdx * kdx + kdy * kdy) || 1;
            e.x += (kdx / kdist) * b.knockback;
            e.y += (kdy / kdist) * b.knockback;
          }

          damageEnemyAt(j, e, b.dmg);

          hitSomething = true;
          break;
        }
      }
    }

    if (hitSomething || b.life <= 0) {
      bullets.splice(i, 1);
    }
  }
}

function updateDamageNumbers(dt) {
  for (var i = damageNumbers.length - 1; i >= 0; i--) {
    var d = damageNumbers[i];
    d.y -= CONFIG.DAMAGE_NUMBER_RISE * dt;
    d.life -= dt;
    if (d.life <= 0) {
      damageNumbers.splice(i, 1);
    }
  }
}

// World-space position of an orbiting drone, given its current angle.
function droneWorldX(drone) {
  return player.x + Math.cos(drone.angle) * CONFIG.DRONE_RADIUS;
}
function droneWorldY(drone) {
  return player.y + Math.sin(drone.angle) * CONFIG.DRONE_RADIUS;
}

function updateDrones(dt) {
  if (!weapons.drone.unlocked) return; // locked until a drone card is picked

  for (var i = 0; i < drones.length; i++) {
    drones[i].angle += CONFIG.DRONE_ANGULAR_SPEED * dt;
  }

  // Loop backwards so splice() (an enemy dying) doesn't skip the next one.
  for (var j = enemies.length - 1; j >= 0; j--) {
    var e = enemies[j];

    if (e.droneHitCooldown > 0) {
      e.droneHitCooldown -= dt;
      continue; // still cooling down from the last hit -- can't be hit again yet
    }

    for (var i = 0; i < drones.length; i++) {
      var dx = droneWorldX(drones[i]) - e.x;
      var dy = droneWorldY(drones[i]) - e.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var contactDist = CONFIG.DRONE_DRAW_SIZE / 2 + e.radius;

      if (dist < contactDist) {
        e.droneHitCooldown = CONFIG.DRONE_HIT_COOLDOWN;
        damageEnemyAt(j, e, weapons.drone.dmg);
        break; // one drone's worth of damage per enemy per frame is enough
      }
    }
  }
}

// -------------------------------------------------------------
// SECTION: GEMS + XP
// Dead enemies drop a gem; gems within magnet range fly to the
// player and grant XP on pickup. Leveling up follows a simple
// curve and fires a DOM 'levelup' event so later prompts (the
// level-up card UI) can hook in without touching this code.
// -------------------------------------------------------------

// Picks the gem sprite color for a given XP value (GDD: 1 green,
// 2-5 blue, 8+ gold -- which lines up exactly with walker/runner/brute).
function gemColorForValue(value) {
  if (value >= 8) return "gold";
  if (value >= 2) return "blue";
  return "green";
}

function spawnGem(x, y, value) {
  gems.push({
    x: x,
    y: y,
    value: value,
    color: gemColorForValue(value),
  });
}

// XP required to go from `level` to `level + 1`.
function xpNeededForLevel(level) {
  return CONFIG.XP_BASE + (level - 1) * CONFIG.XP_PER_LEVEL;
}

function collectGem(g) {
  player.xp += g.value;

  // A while loop (not if) in case one big gem crosses more than one
  // level threshold at once.
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level++;
    player.xpToNext = xpNeededForLevel(player.level);
    window.dispatchEvent(new CustomEvent("levelup", { detail: { level: player.level } }));
  }

  // Combo tracking for the pickup blip's rising pitch -- audible once
  // Prompt 9 wires up real WebAudio; playSound() is a no-op until then.
  gemComboTimer = CONFIG.GEM_COMBO_WINDOW;
  gemComboCount++;
  playSound("gem_pickup");
}

function updateGems(dt) {
  // Combo resets after a short gap with no pickups.
  if (gemComboTimer > 0) {
    gemComboTimer -= dt;
    if (gemComboTimer <= 0) {
      gemComboCount = 0;
    }
  }

  for (var i = gems.length - 1; i >= 0; i--) {
    var g = gems[i];
    var dx = player.x - g.x;
    var dy = player.y - g.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < CONFIG.GEM_COLLECT_DIST) {
      collectGem(g);
      gems.splice(i, 1);
      continue;
    }

    if (dist < player.magnet && dist > 0) {
      g.x += (dx / dist) * CONFIG.GEM_CHASE_SPEED * dt;
      g.y += (dy / dist) * CONFIG.GEM_CHASE_SPEED * dt;
    }
  }
}

// -------------------------------------------------------------
// SECTION: UPDATE (stub)
// Game logic (movement, collisions, spawning...) goes here in
// later prompts. Right now there's nothing to simulate yet.
// -------------------------------------------------------------
function update(dt) {
  if (STATE.mode !== "play") return; // only simulate while actually playing

  STATE.elapsed += dt; // drives spawn timing/caps in updateEnemies()

  // --- move player ---
  var move = getMoveVector();
  var speed = CONFIG.PLAYER_SPEED * player.speedMult;
  player.x += move.dx * speed * dt;
  player.y += move.dy * speed * dt;

  // keep player inside the world bounds
  player.x = clamp(player.x, 0, CONFIG.WORLD_W);
  player.y = clamp(player.y, 0, CONFIG.WORLD_H);

  // rotate sprite to face movement direction (art faces UP at angle 0)
  if (move.dx !== 0 || move.dy !== 0) {
    player.angle = Math.atan2(move.dx, -move.dy);
  }

  // count down i-frames after being hit
  if (player.iframe > 0) {
    player.iframe -= dt;
  }

  // passive regen from the Regeneration upgrade (0 until picked)
  if (player.regen > 0) {
    player.hp = clamp(player.hp + player.regen * dt, 0, player.hpMax);
  }

  // --- camera follows player, clamped so it never shows outside the world ---
  camera.x = clamp(player.x - CONFIG.CANVAS_W / 2, 0, CONFIG.WORLD_W - CONFIG.CANVAS_W);
  camera.y = clamp(player.y - CONFIG.CANVAS_H / 2, 0, CONFIG.WORLD_H - CONFIG.CANVAS_H);

  updateEnemies(dt);
  updateBoss(dt);
  updatePistol(dt);
  updateShotgun(dt);
  updateDrones(dt);
  updateBullets(dt);
  updateDamageNumbers(dt);
  updateGems(dt);
  updateParticles(dt);
  updateShake(dt);
  updateHurtVignette(dt);
  updateLevelUpFlash(dt);

  if (dieSoundCooldown > 0) {
    dieSoundCooldown -= dt;
  }

  if (player.hp <= 0) {
    triggerGameOver();
  }

  updateHud();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Applies incoming damage after armor reduction (always at least 1 dmg
// gets through) and resets i-frames. The one place anything that hurts
// the player should go through.
function damagePlayer(amount) {
  var reduced = Math.max(1, amount - player.armor);
  player.hp = clamp(player.hp - reduced, 0, player.hpMax);
  player.iframe = CONFIG.PLAYER_IFRAME_TIME;
  hurtVignetteTimer = CONFIG.HURT_VIGNETTE_TIME; // red screen-edge flash
  playSound("hurt");
}

// -------------------------------------------------------------
// SECTION: RENDER (stub)
// Draws the current frame to the canvas. Runs every frame
// regardless of mode, so the screen never looks frozen/blank.
// -------------------------------------------------------------
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var bgPattern = null; // built once bg_asphalt.png has loaded

// DOM HUD elements (grabbed once, updated every frame in updateHud()).
var hpBarEl = document.getElementById("hud-hp-bar");
var hpTextEl = document.getElementById("hud-hp-text");
var killsEl = document.getElementById("hud-kills");
var xpBarEl = document.getElementById("hud-xp-bar");
var levelEl = document.getElementById("hud-level");
var timerEl = document.getElementById("hud-timer");
var hurtVignetteEl = document.getElementById("hurt-vignette");

function updateHud() {
  var pct = player.hp / player.hpMax;
  hpBarEl.style.width = pct * 100 + "%";
  hpBarEl.style.background = pct < 0.3 ? "#e33" : "#3ecf5e"; // red warning when low
  hpTextEl.textContent = Math.ceil(player.hp) + "/" + player.hpMax;
  killsEl.textContent = "Kills: " + STATE.kills;
  xpBarEl.style.width = (player.xp / player.xpToNext) * 100 + "%";
  levelEl.textContent = "Lv " + player.level;

  var remaining = Math.max(0, CONFIG.RUN_DURATION - STATE.elapsed);
  var mm = Math.floor(remaining / 60);
  var ss = Math.floor(remaining % 60);
  timerEl.textContent = mm + ":" + (ss < 10 ? "0" : "") + ss;
}

function render() {
  // Fallback flat color in case the pattern isn't ready yet.
  ctx.fillStyle = "#141414";
  ctx.fillRect(0, 0, CONFIG.CANVAS_W, CONFIG.CANVAS_H);

  if (assetsReady) {
    // Tiny shake: nudge the whole world draw by a random offset that
    // decays back to 0 in updatePistol(). Cosmetic only -- camera/game
    // logic never sees this offset.
    ctx.save();
    if (screenShake > 0) {
      ctx.translate(
        (Math.random() * 2 - 1) * screenShake,
        (Math.random() * 2 - 1) * screenShake
      );
    }

    drawTiledBackground();
    drawGems();
    drawParticles();
    drawEnemies();
    drawBossHealthBar();
    drawBullets();
    drawPlayer();
    drawLevelUpFlash();
    drawDrones();
    drawMuzzleFlash();
    drawDamageNumbers();

    ctx.restore();
  } else {
    ctx.fillStyle = "#e6e6e6";
    ctx.font = "20px Arial";
    ctx.fillText(
      "Loading art... (" + assetsLoaded + "/" + assetsTotal + ")",
      20,
      40
    );
  }
}

// Tiles bg_asphalt.png across the whole world, offset by the camera so it
// looks like one giant floor instead of a fixed image behind the canvas.
function drawTiledBackground() {
  if (!bgPattern) {
    bgPattern = ctx.createPattern(ASSETS["bg_asphalt"], "repeat");
  }

  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  ctx.fillStyle = bgPattern;
  // Fill exactly the area the camera can see (in world space).
  ctx.fillRect(camera.x, camera.y, CONFIG.CANVAS_W, CONFIG.CANVAS_H);
  ctx.restore();
}

// Draws every gem at its screen position (world pos minus camera).
function drawGems() {
  for (var i = 0; i < gems.length; i++) {
    var g = gems[i];
    var screenX = g.x - camera.x;
    var screenY = g.y - camera.y;

    ctx.drawImage(
      ASSETS["gem_" + g.color],
      screenX - CONFIG.GEM_DRAW_SIZE / 2,
      screenY - CONFIG.GEM_DRAW_SIZE / 2,
      CONFIG.GEM_DRAW_SIZE,
      CONFIG.GEM_DRAW_SIZE
    );
  }
}

// Which sprite + draw size to use per enemy type.
var ENEMY_VISUALS = {
  walker: { asset: "zmb_walker", size: CONFIG.WALKER_DRAW_SIZE },
  runner: { asset: "zmb_runner", size: CONFIG.RUNNER_DRAW_SIZE },
  brute: { asset: "zmb_brute", size: CONFIG.BRUTE_DRAW_SIZE },
  shooter: { asset: "zmb_shooter", size: CONFIG.SHOOTER_DRAW_SIZE },
  boss: { asset: "boss_warlord", size: CONFIG.BOSS_DRAW_SIZE },
};

// Draws every enemy at its screen position (world pos minus camera).
// No rotation/shadows -- keep it cheap with 80+ alive. The one exception
// is ctx.filter, only applied for the few frames an enemy is flashing
// from a fresh hit (never fullscreen, per game-design.md's perf rules).
function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    var visual = ENEMY_VISUALS[e.type];
    var screenX = e.x - camera.x;
    var screenY = e.y - camera.y;

    if (e.hitFlash > 0) {
      ctx.filter = "brightness(2.5)";
    }

    ctx.drawImage(
      ASSETS[visual.asset],
      screenX - visual.size / 2,
      screenY - visual.size / 2,
      visual.size,
      visual.size
    );

    if (e.hitFlash > 0) {
      ctx.filter = "none";
    }
  }
}

// Small fading dots from a dead enemy's death burst.
function drawParticles() {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    var screenX = p.x - camera.x;
    var screenY = p.y - camera.y;

    ctx.globalAlpha = clamp(p.life / CONFIG.PARTICLE_LIFE, 0, 1);
    ctx.fillStyle = "#ddd";
    ctx.beginPath();
    ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// Expanding cyan ring around the player, drawn on every level-up.
function drawLevelUpFlash() {
  if (levelUpFlashTimer <= 0) return;

  var t = 1 - levelUpFlashTimer / CONFIG.LEVELUP_FLASH_TIME; // 0 -> 1 as it plays out
  var radius = t * CONFIG.LEVELUP_RING_MAX_RADIUS;
  var screenX = player.x - camera.x;
  var screenY = player.y - camera.y;

  ctx.globalAlpha = 1 - t;
  ctx.strokeStyle = "#3dd6ff"; // same cyan as the XP bar
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// Small red HP bar hovering above the boss, GDD's "boss mini HP bar".
function drawBossHealthBar() {
  var boss = findBoss();
  if (!boss) return;

  var screenX = boss.x - camera.x;
  var screenY = boss.y - camera.y - CONFIG.BOSS_DRAW_SIZE / 2 - 16;
  var barWidth = 120;
  var barHeight = 10;
  var pct = clamp(boss.hp / CONFIG.BOSS_HP, 0, 1);

  ctx.fillStyle = "#222";
  ctx.fillRect(screenX - barWidth / 2, screenY, barWidth, barHeight);
  ctx.fillStyle = "#e33";
  ctx.fillRect(screenX - barWidth / 2, screenY, barWidth * pct, barHeight);
}

// Draws the soldier at its screen position (world pos minus camera),
// rotated to face the direction it's moving.
function drawPlayer() {
  var screenX = player.x - camera.x;
  var screenY = player.y - camera.y;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(player.angle);
  ctx.drawImage(
    ASSETS["chr_soldier"],
    -CONFIG.PLAYER_SPRITE_W / 2,
    -CONFIG.PLAYER_SPRITE_H / 2,
    CONFIG.PLAYER_SPRITE_W,
    CONFIG.PLAYER_SPRITE_H
  );
  ctx.restore();
}

// Draws each orbit drone at its current position around the player.
function drawDrones() {
  for (var i = 0; i < drones.length; i++) {
    var screenX = droneWorldX(drones[i]) - camera.x;
    var screenY = droneWorldY(drones[i]) - camera.y;

    ctx.drawImage(
      ASSETS["wpn_drone"],
      screenX - CONFIG.DRONE_DRAW_SIZE / 2,
      screenY - CONFIG.DRONE_DRAW_SIZE / 2,
      CONFIG.DRONE_DRAW_SIZE,
      CONFIG.DRONE_DRAW_SIZE
    );
  }
}

// Yellow tracer per bullet: a soft glow circle behind a solid core,
// no shadowBlur (stays cheap even with 50+ bullets alive).
function drawBullets() {
  for (var i = 0; i < bullets.length; i++) {
    var b = bullets[i];
    var screenX = b.x - camera.x;
    var screenY = b.y - camera.y;

    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#fff59d";
    ctx.beginPath();
    ctx.arc(screenX, screenY, b.radius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffd400";
    ctx.beginPath();
    ctx.arc(screenX, screenY, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Short-lived muzzle flash sprite, drawn just in front of the player
// facing whatever direction the last shot went.
function drawMuzzleFlash() {
  if (muzzleFlashTimer <= 0) return;

  var screenX = muzzleFlashX - camera.x;
  var screenY = muzzleFlashY - camera.y;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(muzzleFlashAngle);
  ctx.drawImage(
    ASSETS["vfx_muzzle"],
    -muzzleFlashSize / 2,
    -muzzleFlashSize / 2,
    muzzleFlashSize,
    muzzleFlashSize
  );
  ctx.restore();
}

// Floating "-12" text over anything a bullet just hit, fading + rising.
function drawDamageNumbers() {
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";

  for (var i = 0; i < damageNumbers.length; i++) {
    var d = damageNumbers[i];
    var screenX = d.x - camera.x;
    var screenY = d.y - camera.y;
    var alpha = clamp(d.life / CONFIG.DAMAGE_NUMBER_LIFE, 0, 1);

    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#fff";
    ctx.fillText("-" + d.value, screenX, screenY);
  }

  ctx.globalAlpha = 1;
  ctx.textAlign = "left"; // reset so other draw calls aren't affected
}

// -------------------------------------------------------------
// SECTION: MAIN LOOP
// requestAnimationFrame drives everything. dt (delta time, in
// seconds) is clamped so a lag spike can't cause a huge jump.
// -------------------------------------------------------------
function gameLoop(timestamp) {
  if (!STATE.lastTime) STATE.lastTime = timestamp;

  var dt = (timestamp - STATE.lastTime) / 1000; // ms -> seconds
  if (dt > CONFIG.DT_CLAMP) dt = CONFIG.DT_CLAMP;
  STATE.lastTime = timestamp;

  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

// -------------------------------------------------------------
// SECTION: LEVEL-UP UI
// On 'levelup' (dispatched from collectGem()), pause the simulation
// (update() already skips everything unless STATE.mode === "play")
// and show 3 random upgrade cards. Picking one applies it and either
// resumes play or -- if more level-ups are still pending from one
// big XP gain -- immediately shows a fresh set of 3 (chaining).
// -------------------------------------------------------------

// Shotgun/drone start locked; picking any of their upgrade cards for
// the first time unlocks the weapon in addition to applying its effect.
function ensureShotgunUnlocked() {
  weapons.shotgun.unlocked = true;
}

function ensureDroneUnlocked() {
  if (!weapons.drone.unlocked) {
    weapons.drone.unlocked = true;
    weapons.drone.count = CONFIG.DRONE_BASE_COUNT;
    rebuildDrones();
  }
}

// Rebuilds the drones array to match weapons.drone.count, spacing
// however many there are evenly around the orbit.
function rebuildDrones() {
  drones = [];
  for (var i = 0; i < weapons.drone.count; i++) {
    drones.push({ angle: (i / weapons.drone.count) * Math.PI * 2 });
  }
}

// One-time nuke: damages every enemy currently alive, plus a big shake.
function applyAirstrike() {
  for (var i = enemies.length - 1; i >= 0; i--) {
    damageEnemyAt(i, enemies[i], CONFIG.AIRSTRIKE_DMG);
  }
  screenShake = Math.max(screenShake, CONFIG.AIRSTRIKE_SHAKE_AMOUNT);
  playSound("airstrike_whistle");
}

// The 12-card pool (GDD section 7). Each `desc` is a function (not a
// plain string) so cards like "shotgun_pellet" can read as "Unlock
// Shotgun" the first time and "+1 pellet" afterward.
var UPGRADES = [
  {
    id: "pistol_dmg",
    name: "Pistol Damage",
    desc: function () { return "+" + CONFIG.UPGRADE_PISTOL_DMG_STEP + " dmg"; },
    isMaxed: function () { return false; },
    apply: function () { weapons.pistol.dmg += CONFIG.UPGRADE_PISTOL_DMG_STEP; },
  },
  {
    id: "pistol_cd",
    name: "Pistol Fire Rate",
    desc: function () { return "-" + CONFIG.UPGRADE_PISTOL_CD_STEP + "s cooldown"; },
    isMaxed: function () { return weapons.pistol.fireInterval <= CONFIG.UPGRADE_PISTOL_CD_MIN; },
    apply: function () {
      weapons.pistol.fireInterval = Math.max(
        CONFIG.UPGRADE_PISTOL_CD_MIN,
        weapons.pistol.fireInterval - CONFIG.UPGRADE_PISTOL_CD_STEP
      );
    },
  },
  {
    id: "shotgun_pellet",
    name: "Shotgun Pellets",
    desc: function () {
      return weapons.shotgun.unlocked ? "+1 pellet (max 7)" : "Unlock Shotgun (+1 pellet)";
    },
    isMaxed: function () {
      return weapons.shotgun.unlocked && weapons.shotgun.pelletCount >= CONFIG.UPGRADE_SHOTGUN_PELLET_MAX;
    },
    apply: function () {
      ensureShotgunUnlocked();
      weapons.shotgun.pelletCount = Math.min(CONFIG.UPGRADE_SHOTGUN_PELLET_MAX, weapons.shotgun.pelletCount + 1);
    },
  },
  {
    id: "shotgun_dmg",
    name: "Shotgun Damage",
    desc: function () {
      return (weapons.shotgun.unlocked ? "+" : "Unlock Shotgun (+") + CONFIG.UPGRADE_SHOTGUN_DMG_STEP + " dmg/pellet" + (weapons.shotgun.unlocked ? "" : ")");
    },
    isMaxed: function () { return false; },
    apply: function () {
      ensureShotgunUnlocked();
      weapons.shotgun.dmg += CONFIG.UPGRADE_SHOTGUN_DMG_STEP;
    },
  },
  {
    id: "drone_dmg",
    name: "Drone Damage",
    desc: function () {
      return (weapons.drone.unlocked ? "+" : "Unlock Drone (+") + CONFIG.UPGRADE_DRONE_DMG_STEP + " dmg" + (weapons.drone.unlocked ? "" : ")");
    },
    isMaxed: function () { return false; },
    apply: function () {
      ensureDroneUnlocked();
      weapons.drone.dmg += CONFIG.UPGRADE_DRONE_DMG_STEP;
    },
  },
  {
    id: "drone_count",
    name: "Extra Drone",
    desc: function () {
      return weapons.drone.unlocked ? "+1 drone (max 3)" : "Unlock Drone (+1 extra)";
    },
    isMaxed: function () {
      return weapons.drone.unlocked && weapons.drone.count >= CONFIG.UPGRADE_DRONE_COUNT_MAX;
    },
    apply: function () {
      ensureDroneUnlocked();
      weapons.drone.count = Math.min(CONFIG.UPGRADE_DRONE_COUNT_MAX, weapons.drone.count + 1);
      rebuildDrones();
    },
  },
  {
    id: "hp_max",
    name: "Vitality",
    desc: function () { return "+" + CONFIG.UPGRADE_HP_MAX_STEP + " max HP, full heal of that much"; },
    isMaxed: function () { return false; },
    apply: function () {
      player.hpMax += CONFIG.UPGRADE_HP_MAX_STEP;
      player.hp = clamp(player.hp + CONFIG.UPGRADE_HP_MAX_STEP, 0, player.hpMax);
    },
  },
  {
    id: "speed",
    name: "Boots",
    desc: function () { return "+12% move speed"; },
    isMaxed: function () { return player.speedMult >= CONFIG.UPGRADE_SPEED_MULT_MAX - 0.001; },
    apply: function () {
      player.speedMult = Math.min(CONFIG.UPGRADE_SPEED_MULT_MAX, player.speedMult + CONFIG.UPGRADE_SPEED_STEP);
    },
  },
  {
    id: "magnet",
    name: "Magnet",
    desc: function () { return "+" + CONFIG.UPGRADE_MAGNET_STEP + "px gem pickup range"; },
    isMaxed: function () { return false; },
    apply: function () { player.magnet += CONFIG.UPGRADE_MAGNET_STEP; },
  },
  {
    id: "armor",
    name: "Armor Plating",
    desc: function () { return "-" + CONFIG.UPGRADE_ARMOR_STEP + " dmg taken (min 1)"; },
    isMaxed: function () { return false; },
    apply: function () { player.armor += CONFIG.UPGRADE_ARMOR_STEP; },
  },
  {
    id: "regen",
    name: "Regeneration",
    desc: function () { return "+" + CONFIG.UPGRADE_REGEN_STEP + " HP/sec"; },
    isMaxed: function () { return false; },
    apply: function () { player.regen += CONFIG.UPGRADE_REGEN_STEP; },
  },
  {
    id: "airstrike",
    name: "Airstrike",
    desc: function () { return CONFIG.AIRSTRIKE_DMG + " dmg to everything alive right now"; },
    isMaxed: function () { return false; },
    apply: function () { applyAirstrike(); },
  },
];

var pendingLevelUps = 0; // how many level-up panels are queued (chaining)
var currentCards = []; // the (up to) 3 upgrades shown right now

window.addEventListener("levelup", function () {
  pendingLevelUps++;
  levelUpFlashTimer = CONFIG.LEVELUP_FLASH_TIME; // ring flash, every level regardless of chaining
  playSound("levelup_arp");
  if (STATE.mode === "play") {
    showLevelUpPanel();
  }
  // If a panel is already showing, the extra pending level-up gets
  // picked up automatically once the current pick resolves.
});

// Picks `count` distinct, not-yet-maxed upgrades at random.
function pickRandomUpgrades(count) {
  var pool = UPGRADES.filter(function (u) { return !u.isMaxed(); });
  var chosen = [];
  while (chosen.length < count && pool.length > 0) {
    var i = Math.floor(Math.random() * pool.length);
    chosen.push(pool[i]);
    pool.splice(i, 1);
  }
  return chosen;
}

var levelupOverlayEl = document.getElementById("levelup-overlay");
var levelupCardEls = [
  document.getElementById("levelup-card-1"),
  document.getElementById("levelup-card-2"),
  document.getElementById("levelup-card-3"),
];

function showLevelUpPanel() {
  STATE.mode = "levelup";
  currentCards = pickRandomUpgrades(3);

  for (var i = 0; i < levelupCardEls.length; i++) {
    var el = levelupCardEls[i];
    var upgrade = currentCards[i];

    if (!upgrade) {
      // Fewer than 3 upgrades left available (most things maxed out) --
      // just hide the extra card slot(s).
      el.style.display = "none";
      continue;
    }

    el.style.display = "";
    el.querySelector(".levelup-card-name").textContent = upgrade.name;
    el.querySelector(".levelup-card-desc").textContent = upgrade.desc();
  }

  levelupOverlayEl.classList.remove("hidden");
}

function pickUpgrade(index) {
  if (STATE.mode !== "levelup") return;
  var upgrade = currentCards[index];
  if (!upgrade) return;

  upgrade.apply();
  playSound("ui_click");
  pendingLevelUps--;

  if (pendingLevelUps > 0) {
    showLevelUpPanel(); // chain: another level-up was already queued
  } else {
    levelupOverlayEl.classList.add("hidden");
    STATE.mode = "play";
  }
}

levelupCardEls.forEach(function (el, i) {
  el.addEventListener("click", function () { pickUpgrade(i); });
});

// -------------------------------------------------------------
// SECTION: PAUSE MENU
// Esc toggles between "play" and "pause" (update() already no-ops
// outside "play", so pausing is just switching modes + showing the
// dimmed overlay -- same trick as the level-up panel). Restart wipes
// every piece of mutable state back to its starting value and jumps
// straight back into "play".
// -------------------------------------------------------------
var pauseOverlayEl = document.getElementById("pause-overlay");
var resumeBtn = document.getElementById("resume-btn");
var restartBtn = document.getElementById("restart-btn");

function pauseGame() {
  STATE.mode = "pause";
  pauseOverlayEl.classList.remove("hidden");
  playSound("ui_click");
}

function resumeGame() {
  STATE.mode = "play";
  pauseOverlayEl.classList.add("hidden");
  playSound("ui_click");
}

// Puts every piece of mutable state back to its starting value. Used by
// the pause menu's Restart button now, and reusable by Game Over /
// Victory's Restart once those exist (Prompt 7).
function resetGame() {
  STATE.elapsed = 0;
  STATE.kills = 0;
  STATE.damageDealt = 0;

  bossSpawned = false;
  bossWarningTimer = 0;
  bossWarningEl.classList.add("hidden");

  player.x = CONFIG.WORLD_W / 2;
  player.y = CONFIG.WORLD_H / 2;
  player.hp = CONFIG.PLAYER_HP_MAX;
  player.angle = 0;
  player.iframe = 0;
  player.level = 1;
  player.xp = 0;
  player.xpToNext = CONFIG.XP_BASE;
  player.hpMax = CONFIG.PLAYER_HP_MAX;
  player.speedMult = 1;
  player.magnet = CONFIG.PLAYER_MAGNET;
  player.armor = 0;
  player.regen = 0;

  camera.x = 0;
  camera.y = 0;

  weapons.pistol.dmg = CONFIG.PISTOL_DMG;
  weapons.pistol.fireInterval = CONFIG.PISTOL_FIRE_INTERVAL;
  weapons.shotgun.unlocked = false;
  weapons.shotgun.pelletCount = CONFIG.SHOTGUN_PELLET_COUNT;
  weapons.shotgun.dmg = CONFIG.SHOTGUN_PELLET_DMG;
  weapons.drone.unlocked = false;
  weapons.drone.dmg = CONFIG.DRONE_DMG;
  weapons.drone.count = 0;
  drones = [];

  enemies = [];
  walkerSpawnTimer = 0;
  runnerSpawnTimer = 0;
  bruteSpawnTimer = 0;
  shooterSpawnTimer = 0;
  perfLogTimer = 2;

  bullets = [];
  pistolCooldown = 0;
  shotgunCooldown = 0;
  muzzleFlashSize = CONFIG.MUZZLE_FLASH_SIZE;
  muzzleFlashTimer = 0;

  damageNumbers = [];
  screenShake = 0;
  particles = [];
  hurtVignetteTimer = 0;
  hurtVignetteEl.style.opacity = 0;
  levelUpFlashTimer = 0;
  dieSoundCooldown = 0;

  gems = [];
  gemComboCount = 0;
  gemComboTimer = 0;

  pendingLevelUps = 0;
  currentCards = [];
  levelupOverlayEl.classList.add("hidden");

  pauseOverlayEl.classList.add("hidden");
  gameoverOverlayEl.classList.add("hidden");
  victoryOverlayEl.classList.add("hidden");
  STATE.mode = "play";
  playSound("ui_click");
}

resumeBtn.addEventListener("click", resumeGame);
restartBtn.addEventListener("click", resetGame);

window.addEventListener("keydown", function (e) {
  if (e.key !== "Escape") return;
  if (STATE.mode === "play") pauseGame();
  else if (STATE.mode === "pause") resumeGame();
});

// -------------------------------------------------------------
// SECTION: END SCREENS
// HP0 = Game Over ("KIA"), boss killed = Victory ("ZONE CLEARED!").
// Both show time/kills/level (Victory adds damage dealt) and offer
// Restart via button or the R key.
// -------------------------------------------------------------
var bossWarningEl = document.getElementById("boss-warning");

var gameoverOverlayEl = document.getElementById("gameover-overlay");
var gameoverStatsEl = document.getElementById("gameover-stats");
var gameoverRestartBtn = document.getElementById("gameover-restart-btn");

var victoryOverlayEl = document.getElementById("victory-overlay");
var victoryStatsEl = document.getElementById("victory-stats");
var victoryRestartBtn = document.getElementById("victory-restart-btn");

// Same MM:SS format as the HUD timer, just for a fixed elapsed value.
function formatTime(seconds) {
  var mm = Math.floor(seconds / 60);
  var ss = Math.floor(seconds % 60);
  return mm + ":" + (ss < 10 ? "0" : "") + ss;
}

function triggerGameOver() {
  if (STATE.mode !== "play") return; // don't double-trigger
  STATE.mode = "gameover";
  gameoverStatsEl.textContent =
    "Time: " + formatTime(STATE.elapsed) + "   Kills: " + STATE.kills + "   Level: " + player.level;
  gameoverOverlayEl.classList.remove("hidden");
  playSound("lose_jingle");
}

function triggerVictory() {
  STATE.mode = "victory";
  victoryStatsEl.textContent =
    "Time: " + formatTime(STATE.elapsed) + "   Kills: " + STATE.kills + "   Level: " + player.level +
    "   Damage Dealt: " + STATE.damageDealt;
  victoryOverlayEl.classList.remove("hidden");
  playSound("win_jingle");
}

function restartFromEndScreen() {
  gameoverOverlayEl.classList.add("hidden");
  victoryOverlayEl.classList.add("hidden");
  resetGame();
}

gameoverRestartBtn.addEventListener("click", restartFromEndScreen);
victoryRestartBtn.addEventListener("click", restartFromEndScreen);

window.addEventListener("keydown", function (e) {
  if ((STATE.mode === "gameover" || STATE.mode === "victory") && e.key.toLowerCase() === "r") {
    restartFromEndScreen();
  }
});

// -------------------------------------------------------------
// SECTION: TITLE OVERLAY
// The Start button hides the overlay and switches mode to "play".
// Audio must init here too, since it needs a user click.
// -------------------------------------------------------------
var overlayEl = document.getElementById("overlay");
var startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", function () {
  audioInit();
  overlayEl.classList.add("hidden");
  STATE.mode = "play";
});

// -------------------------------------------------------------
// BOOT
// -------------------------------------------------------------
loadAssets();
requestAnimationFrame(gameLoop);
