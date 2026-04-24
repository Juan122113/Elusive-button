const button = document.getElementById("button");

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

let moveTimeout;
let timerInterval;

let score = 0;
let timeLeft = 10;
let gameOver = true;
let ignoreNextClick = false;

// ---------- UI ----------
function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
}

function updateTimer() {
  timerEl.textContent = `Time: ${timeLeft}s`;
}

// ---------- Difficulty ----------
function getLevel() {
  // Increase level every 5 points
  return Math.floor(score /2);
}

// ---------- Button size (difficulty scaling) ----------
function updateButtonSize() {
  const level = getLevel();

  // Base sizes
  // const baseFont = 28;
  // const basePaddingY = 20;
  // const basePaddingX = 40;

  // Shrink rate per level
  // const shrinkFactor = 2;

  // Minimum sizes (to avoid impossible gameplay)
  // const minFont = 12;
  // const minPaddingY = 6;
  // const minPaddingX = 12;

  // const fontSize = Math.max(minFont, baseFont - level * shrinkFactor);
  // const paddingY = Math.max(minPaddingY, basePaddingY - level * 1.5);
  // const paddingX = Math.max(minPaddingX, basePaddingX - level * 2);

  // button.style.fontSize = fontSize + "px";
  // button.style.padding = `${paddingY}px ${paddingX}px`;



  // Each level reduces size slightly
  const scale = Math.max(0.25, 1 - level * 0.05);

  button.style.setProperty("--scale", scale);

}

// ---------- Movement ----------
function moveButton() {
  const maxX = window.innerWidth - button.offsetWidth;
  const maxY = window.innerHeight - button.offsetHeight;

  const x = Math.max(0, Math.floor(Math.random() * maxX));
  const y = Math.max(0, Math.floor(Math.random() * maxY));

  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
}

// Calculate delay based on score (higher score = faster movement)
function getRandomMoveDelay() {
  const maxDelay = 1500;
  const minDelay = 150;
  const reductionPerPoint = 50;

  // Delay decreases as score increases but never below minDelay
  return Math.max(minDelay, maxDelay - score * reductionPerPoint);
}

function scheduleRandomMove() {
  if (gameOver) return;

  clearTimeout(moveTimeout);

  // Random delay within the allowed range
  const delay = Math.floor(Math.random() * getRandomMoveDelay()) + 100;

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
  // Reset game state
  score = 0;
  timeLeft = 20;
  gameOver = false;
  ignoreNextClick = false;

  updateScore();
  updateTimer();
  updateButtonSize();

  // Hide overlays
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");

  // Start game
  moveButton();
  startTimer();
  scheduleRandomMove();
}

function endGame() {
  gameOver = true;

  clearTimeout(moveTimeout);
  clearInterval(timerInterval);

  timerEl.textContent = "Time: 0s";
  finalScoreEl.textContent = `Final score: ${score}`;

  gameOverScreen.classList.remove("hidden");
}

// ---------- Events ----------

// Desktop click
button.addEventListener("click", () => {
  if (gameOver) return;

  // Prevent double count from touch
  if (ignoreNextClick) {
    ignoreNextClick = false;
    return;
  }

  score++;
  updateScore();
  updateButtonSize();

  // Move shortly after click for better gameplay feel
  clearTimeout(moveTimeout);
  setTimeout(() => {
    if (gameOver) return;
    moveButton();
    scheduleRandomMove();
  }, 120);
});

// Mobile touch (instant reaction)
button.addEventListener("pointerdown", (e) => {
  if (gameOver) return;

  if (e.pointerType === "touch" || e.pointerType === "pen") {
    e.preventDefault();
    ignoreNextClick = true;

    score++;
    updateScore();
    updateButtonSize();

    // Move immediately on touch
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
updateButtonSize();

gameOverScreen.classList.add("hidden");
startScreen.classList.remove("hidden");