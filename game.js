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

  // (future gameplay code goes here)
}

// -------------------------------------------------------------
// SECTION: RENDER (stub)
// Draws the current frame to the canvas. Runs every frame
// regardless of mode, so the screen never looks frozen/blank.
// -------------------------------------------------------------
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

function render() {
  // Dark arena background for now -- real tiled bg_asphalt.png
  // comes in the next prompt (Soldier + Camera).
  ctx.fillStyle = "#141414";
  ctx.fillRect(0, 0, CONFIG.CANVAS_W, CONFIG.CANVAS_H);

  if (!assetsReady) {
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
