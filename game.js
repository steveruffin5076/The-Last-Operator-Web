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

  SPAWN_RING_MIN: 720, // enemies spawn in a ring this far from the player...
  SPAWN_RING_MAX: 940, // ...so they never pop into view
  DESPAWN_DIST: 1300, // enemies this far away get removed (no XP refund)

  // Alive cap ramps up as the run goes on (Min 0-2 / 2-5 / 5+ per wave table).
  CAP_MIN_0_2: 25,
  CAP_MIN_2_5: 50,
  CAP_MIN_5_PLUS: 80,

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
};

// -------------------------------------------------------------
// SECTION: STATE
// All the "current situation" data lives here. One object so
// it's easy to find/reset/debug.
// -------------------------------------------------------------
var STATE = {
  mode: "title", // title -> play -> ... (more modes added in later prompts)
  lastTime: 0,   // timestamp of previous animation frame, for computing dt
  elapsed: 0,    // seconds spent in "play" mode -- drives spawn timing/caps
  kills: 0,
};

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

// All enemies currently alive (walkers/runners/brutes), as plain objects.
var enemies = [];
var walkerSpawnTimer = 0;
var runnerSpawnTimer = 0;
var bruteSpawnTimer = 0;
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
// SECTION: AUDIO (stub)
// Real WebAudio oscillator SFX come in a later prompt. For now
// this is just a placeholder so the section exists and other
// code can safely call audioInit() without erroring.
// -------------------------------------------------------------
var audioCtx = null;

function audioInit() {
  // Browsers require a user gesture (like clicking Start) before
  // audio can play, so this is called from the Start button handler.
  // Real oscillator sounds are added in a later prompt.
}

// Named hook so weapon code can call playSound('pistol_pew') etc. now,
// without needing to change when Prompt 9 wires up real WebAudio SFX.
function playSound(name) {
  // no-op stub
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

// Removes a dead enemy, counts the kill, and drops its gem. Shared by
// every damage source (bullets, drone contact) so there's one place
// that knows what happens when something dies.
function killEnemy(index, e) {
  enemies.splice(index, 1);
  STATE.kills++;
  spawnGem(e.x, e.y, e.xp);
}

// Applies damage + a floating number to one enemy, killing it if it drops
// to 0 HP. Shared by bullets, the drone, and the airstrike upgrade so
// they don't each re-implement "hit it, show a number, maybe kill it".
function damageEnemyAt(index, e, amount) {
  e.hp -= amount;
  spawnDamageNumber(e.x, e.y, amount);
  if (e.hp <= 0) {
    killEnemy(index, e);
  }
}

// How many enemies are allowed alive at once, based on run time so
// far. Widens in steps as the wave table calls for tougher minutes.
function getAliveCap() {
  var elapsedMin = STATE.elapsed / 60;
  if (elapsedMin >= 5) return CONFIG.CAP_MIN_5_PLUS;
  if (elapsedMin >= 2) return CONFIG.CAP_MIN_2_5;
  return CONFIG.CAP_MIN_0_2;
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

  // --- spawners: walkers always run, runners/brutes unlock at their minute ---
  walkerSpawnTimer -= dt;
  if (walkerSpawnTimer <= 0) {
    walkerSpawnTimer = CONFIG.SPAWN_INTERVAL;
    if (enemies.length < cap) spawnWalker();
  }

  if (elapsedMin >= CONFIG.RUNNER_MIN_START) {
    runnerSpawnTimer -= dt;
    if (runnerSpawnTimer <= 0) {
      runnerSpawnTimer = CONFIG.RUNNER_SPAWN_INTERVAL;
      if (enemies.length < cap) spawnRunner();
    }
  }

  if (elapsedMin >= CONFIG.BRUTE_MIN_START) {
    bruteSpawnTimer -= dt;
    if (bruteSpawnTimer <= 0) {
      bruteSpawnTimer = CONFIG.BRUTE_SPAWN_INTERVAL;
      if (enemies.length < cap) spawnBrute();
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

  // Shake settles back to 0 at a fixed rate regardless of how big it was.
  screenShake = Math.max(0, screenShake - CONFIG.SHAKE_DECAY_RATE * dt);
}

function spawnDamageNumber(x, y, value) {
  damageNumbers.push({
    x: x,
    y: y,
    value: value,
    life: CONFIG.DAMAGE_NUMBER_LIFE,
  });
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
  updatePistol(dt);
  updateShotgun(dt);
  updateDrones(dt);
  updateBullets(dt);
  updateDamageNumbers(dt);
  updateGems(dt);
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

function updateHud() {
  var pct = player.hp / player.hpMax;
  hpBarEl.style.width = pct * 100 + "%";
  hpBarEl.style.background = pct < 0.3 ? "#e33" : "#3ecf5e"; // red warning when low
  hpTextEl.textContent = Math.ceil(player.hp) + "/" + player.hpMax;
  killsEl.textContent = "Kills: " + STATE.kills;
  xpBarEl.style.width = (player.xp / player.xpToNext) * 100 + "%";
  levelEl.textContent = "Lv " + player.level;
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
    drawEnemies();
    drawBullets();
    drawPlayer();
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
};

// Draws every enemy at its screen position (world pos minus camera).
// No rotation, no shadows/filters -- keep it cheap with 80+ alive.
function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    var e = enemies[i];
    var visual = ENEMY_VISUALS[e.type];
    var screenX = e.x - camera.x;
    var screenY = e.y - camera.y;

    ctx.drawImage(
      ASSETS[visual.asset],
      screenX - visual.size / 2,
      screenY - visual.size / 2,
      visual.size,
      visual.size
    );
  }
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
