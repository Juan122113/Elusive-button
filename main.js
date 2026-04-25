// ---------- DOM ----------
const button = document.getElementById("button");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

// ---------- State ----------
let moveTimeout;
let timerInterval;
let distortionTimeout;

let score = 0;
let timeLeft = 10;
let gameOver = true;
let ignoreNextClick = false;
let distortionActive = false;

// ---------- UI ----------
function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
}

function updateTimer() {
  timerEl.textContent = `Time: ${timeLeft}s`;
}

// ---------- Difficulty ----------
function getLevel() {
  return Math.floor(score / 2);
}

// ---------- Helpers ----------
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// ---------- Shapes ----------
function randomBlobBorderRadius() {
  const r = () => Math.floor(Math.random() * 100) + "%";
  return `${r()} ${r()} ${r()} ${r()} / ${r()} ${r()} ${r()} ${r()}`;
}

function randomGeometricClipPath() {
  const shapes = [
    "circle(50% at 50% 50%)",
    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    "polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)",
    "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)"
  ];

  return shapes[Math.floor(Math.random() * shapes.length)];
}

// ---------- Visual logic (scale + shape) ----------
function updateButtonLook() {
  const level = getLevel();

  // Base shrinking with level
  const baseScale = Math.max(0.5, 1 - level * 0.05);

  // Uneven stretch/squash
  const scaleX = Math.max(0.45, Math.min(1.8, baseScale * randomBetween(0.75, 1.35)));
  const scaleY = Math.max(0.45, Math.min(1.8, baseScale * randomBetween(0.75, 1.35)));

  // Set CSS variables (no direct transform overwrite)
  button.style.setProperty("--scale-x", scaleX);
  button.style.setProperty("--scale-y", scaleY);

  // Random shape type
  if (Math.random() < 0.4) {
    button.style.borderRadius = "0";
    button.style.clipPath = randomGeometricClipPath();
  } else {
    button.style.clipPath = "none";
    button.style.borderRadius = randomBlobBorderRadius();
  }
}

// ---------- Random distortion (independent layer) ----------
function applyRandomDistortion() {
  if (gameOver || distortionActive) return;

  distortionActive = true;

  const dx = randomBetween(0.001, 25.6);
  const dy = randomBetween(0.001, 25.6);

  // Apply temporary distortion
  button.style.setProperty("--distort-x", dx);
  button.style.setProperty("--distort-y", dy);

  setTimeout(() => {
    if (gameOver) return;

    distortionActive = false;

    // Reset distortion
    button.style.setProperty("--distort-x", 1);
    button.style.setProperty("--distort-y", 1);

    scheduleRandomDistortion();
  }, Math.random() * 220 + 80);
}

function scheduleRandomDistortion() {
  clearTimeout(distortionTimeout);

  const delay = Math.random() * 2500 + 700;

  distortionTimeout = setTimeout(() => {
    applyRandomDistortion();
  }, delay);
}

// ---------- Movement ----------
function moveButton() {
  updateButtonLook();

  const rect = button.getBoundingClientRect();

  const maxX = Math.max(0, window.innerWidth - rect.width);
  const maxY = Math.max(0, window.innerHeight - rect.height);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
}

// ---------- Speed ----------
function getRandomMoveDelay() {
  const maxDelay = 1500;
  const minDelay = 120;
  const reductionPerPoint = 40;

  return Math.max(minDelay, maxDelay - score * reductionPerPoint);
}

function scheduleRandomMove() {
  if (gameOver) return;

  clearTimeout(moveTimeout);

  const delay = Math.random() * getRandomMoveDelay() + 100;

  moveTimeout = setTimeout(() => {
    if (gameOver) return;
    moveButton();
    scheduleRandomMove();
  }, delay);
}

// ---------- Timer ----------
function startTimer() {
  updateTimer();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// ---------- Game flow ----------
function startGame() {
  score = 0;
  timeLeft = 20;
  gameOver = false;
  ignoreNextClick = false;
  distortionActive = false;

  updateScore();
  updateTimer();

  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");

  moveButton();
  startTimer();
  scheduleRandomMove();
  scheduleRandomDistortion();
}

function endGame() {
  gameOver = true;

  clearTimeout(moveTimeout);
  clearInterval(timerInterval);
  clearTimeout(distortionTimeout);

  timerEl.textContent = "Time: 0s";
  finalScoreEl.textContent = `Final score: ${score}`;

  gameOverScreen.classList.remove("hidden");
}

// ---------- Events ----------

// Desktop click
button.addEventListener("click", () => {
  if (gameOver) return;

  if (ignoreNextClick) {
    ignoreNextClick = false;
    return;
  }

  score++;
  updateScore();

  clearTimeout(moveTimeout);

  setTimeout(() => {
    if (!gameOver) {
      moveButton();
      scheduleRandomMove();
    }
  }, 120);
});

// Mobile touch
button.addEventListener("pointerdown", (e) => {
  if (gameOver) return;

  if (e.pointerType === "touch" || e.pointerType === "pen") {
    e.preventDefault();
    ignoreNextClick = true;

    score++;
    updateScore();

    clearTimeout(moveTimeout);
    moveButton();
    scheduleRandomMove();
  }
});

// ---------- Buttons ----------
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

// ---------- Init ----------
updateScore();
updateTimer();

gameOverScreen.classList.add("hidden");
startScreen.classList.remove("hidden");