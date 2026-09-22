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
};

// -------------------------------------------------------------
// SECTION: STATE
// All the "current situation" data lives here. One object so
// it's easy to find/reset/debug.
// -------------------------------------------------------------
var STATE = {
  mode: "title", // title -> play -> ... (more modes added in later prompts)
  lastTime: 0,   // timestamp of previous animation frame, for computing dt
};

// The player, dropped in the middle of the world to start.
var player = {
  x: CONFIG.WORLD_W / 2,
  y: CONFIG.WORLD_H / 2,
  hp: CONFIG.PLAYER_HP_MAX,
  angle: 0, // radians, which way the sprite is rotated to face
};

// Camera = top-left corner of the view into the world, in world pixels.
var camera = {
  x: 0,
  y: 0,
};

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
// SECTION: UPDATE (stub)
// Game logic (movement, collisions, spawning...) goes here in
// later prompts. Right now there's nothing to simulate yet.
// -------------------------------------------------------------
function update(dt) {
  if (STATE.mode !== "play") return; // only simulate while actually playing

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

  // --- camera follows player, clamped so it never shows outside the world ---
  camera.x = clamp(player.x - CONFIG.CANVAS_W / 2, 0, CONFIG.WORLD_W - CONFIG.CANVAS_W);
  camera.y = clamp(player.y - CONFIG.CANVAS_H / 2, 0, CONFIG.WORLD_H - CONFIG.CANVAS_H);

  // (future gameplay code goes here)
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

function render() {
  // Fallback flat color in case the pattern isn't ready yet.
  ctx.fillStyle = "#141414";
  ctx.fillRect(0, 0, CONFIG.CANVAS_W, CONFIG.CANVAS_H);

  if (assetsReady) {
    drawTiledBackground();
    drawPlayer();
  } else {
    ctx.fillStyle = "#e6e6e6";
    ctx.font = "20px Arial";
    ctx.fillText(
      "Loading art... (" + assetsLoaded + "/" + assetsTotal + ")",
      20,
      40
    );
  }

  // (future gameplay drawing goes here)
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
