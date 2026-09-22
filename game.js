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
  MUZZLE_FLASH_SIZE: 24,
  MUZZLE_TIP_DIST: 18, // how far in front of the player the flash is drawn

  FIRE_SHAKE_AMOUNT: 2, // px, "tiny shake" on every shot
  SHAKE_DECAY_RATE: 40, // px/sec -- how fast shake settles back to 0

  DAMAGE_NUMBER_LIFE: 0.6, // seconds a floating damage number stays up
  DAMAGE_NUMBER_RISE: 40, // px/sec it drifts upward while fading
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
};

// Camera = top-left corner of the view into the world, in world pixels.
var camera = {
  x: 0,
  y: 0,
};

// All enemies currently alive (walkers/runners/brutes), as plain objects.
var enemies = [];
var walkerSpawnTimer = 0;
var runnerSpawnTimer = 0;
var bruteSpawnTimer = 0;
var perfLogTimer = 2; // logs enemy count to console every 2s (Prompt 2b perf check)

// Pistol bullets currently in flight, as plain {x, y, vx, vy, life, dmg, radius}.
var bullets = [];
var pistolCooldown = 0; // counts down to the next shot

// Floating "-12" style damage numbers, as plain {x, y, value, life}.
var damageNumbers = [];

// Muzzle flash: a short-lived sprite drawn at the last shot's origin.
var muzzleFlashTimer = 0;
var muzzleFlashX = 0;
var muzzleFlashY = 0;
var muzzleFlashAngle = 0;

// Tiny screen shake magnitude (px), decays back to 0 every frame.
var screenShake = 0;

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
  enemies.push(props);
}

function spawnWalker() {
  spawnEnemyInRing({
    type: "walker",
    hp: CONFIG.WALKER_HP,
    radius: CONFIG.WALKER_RADIUS,
    speed: CONFIG.WALKER_SPEED,
    touchDmg: CONFIG.WALKER_TOUCH_DMG,
  });
}

function spawnRunner() {
  spawnEnemyInRing({
    type: "runner",
    hp: CONFIG.RUNNER_HP,
    radius: CONFIG.RUNNER_RADIUS,
    speed: CONFIG.RUNNER_SPEED,
    touchDmg: CONFIG.RUNNER_TOUCH_DMG,
    phase: Math.random() * Math.PI * 2, // offsets the wiggle so runners don't all sway in sync
  });
}

function spawnBrute() {
  // Knock-resist (GDD) has nothing to resist yet -- there's no
  // knockback system until the Juice Pack prompt -- so it's not
  // tracked here.
  spawnEnemyInRing({
    type: "brute",
    hp: CONFIG.BRUTE_HP,
    radius: CONFIG.BRUTE_RADIUS,
    speed: CONFIG.BRUTE_SPEED,
    touchDmg: CONFIG.BRUTE_TOUCH_DMG,
  });
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
      player.hp = clamp(player.hp - e.touchDmg, 0, CONFIG.PLAYER_HP_MAX);
      player.iframe = CONFIG.PLAYER_IFRAME_TIME;
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
    dmg: CONFIG.PISTOL_DMG,
    radius: CONFIG.PISTOL_BULLET_RADIUS,
  });

  // Muzzle flash + tiny shake, both purely cosmetic.
  muzzleFlashX = player.x + dirX * CONFIG.MUZZLE_TIP_DIST;
  muzzleFlashY = player.y + dirY * CONFIG.MUZZLE_TIP_DIST;
  muzzleFlashAngle = Math.atan2(dirY, dirX);
  muzzleFlashTimer = CONFIG.MUZZLE_FLASH_TIME;
  screenShake = Math.max(screenShake, CONFIG.FIRE_SHAKE_AMOUNT);
}

function updatePistol(dt) {
  pistolCooldown -= dt;
  if (pistolCooldown <= 0) {
    var target = findNearestEnemy(CONFIG.PISTOL_RANGE);
    if (target) {
      firePistol(target);
      pistolCooldown = CONFIG.PISTOL_FIRE_INTERVAL;
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
          e.hp -= b.dmg;
          spawnDamageNumber(e.x, e.y, b.dmg);

          if (e.hp <= 0) {
            enemies.splice(j, 1);
            STATE.kills++;
          }

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
  player.x += move.dx * CONFIG.PLAYER_SPEED * dt;
  player.y += move.dy * CONFIG.PLAYER_SPEED * dt;

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

  // --- camera follows player, clamped so it never shows outside the world ---
  camera.x = clamp(player.x - CONFIG.CANVAS_W / 2, 0, CONFIG.WORLD_W - CONFIG.CANVAS_W);
  camera.y = clamp(player.y - CONFIG.CANVAS_H / 2, 0, CONFIG.WORLD_H - CONFIG.CANVAS_H);

  updateEnemies(dt);
  updatePistol(dt);
  updateBullets(dt);
  updateDamageNumbers(dt);
  updateHud();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function updateHud() {
  var pct = player.hp / CONFIG.PLAYER_HP_MAX;
  hpBarEl.style.width = pct * 100 + "%";
  hpBarEl.style.background = pct < 0.3 ? "#e33" : "#3ecf5e"; // red warning when low
  hpTextEl.textContent = Math.ceil(player.hp) + "/" + CONFIG.PLAYER_HP_MAX;
  killsEl.textContent = "Kills: " + STATE.kills;
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
    drawEnemies();
    drawBullets();
    drawPlayer();
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
    -CONFIG.MUZZLE_FLASH_SIZE / 2,
    -CONFIG.MUZZLE_FLASH_SIZE / 2,
    CONFIG.MUZZLE_FLASH_SIZE,
    CONFIG.MUZZLE_FLASH_SIZE
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
