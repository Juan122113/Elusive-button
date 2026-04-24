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
  scoreEl.textContent = `Clicks: ${score}`;
}

function updateTimer() {
  timerEl.textContent = `Time: ${timeLeft}s`;
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

function getRandomMoveDelay() {
  // Base delay gets smaller as the score increases
  // Minimum delay: 150ms
  // Maximum delay: 1500ms
  const maxDelay = 1500;
  const minDelay = 150;
  const reductionPerPoint = 50;

  return Math.max(minDelay, maxDelay - score * reductionPerPoint);
}

function scheduleRandomMove() {
  if (gameOver) return;

  clearTimeout(moveTimeout);

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
  score = 0;
  timeLeft = 10;
  gameOver = false;
  ignoreNextClick = false;

  updateScore();
  updateTimer();

  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");

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

  if (ignoreNextClick) {
    ignoreNextClick = false;
    return;
  }

  score++;
  updateScore();

  // Move the button shortly after the click
  clearTimeout(moveTimeout);
  setTimeout(() => {
    if (gameOver) return;
    moveButton();
    scheduleRandomMove();
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

    // Move immediately after the tap
    clearTimeout(moveTimeout);
    moveButton();
    scheduleRandomMove();
  }
});

// Mouse hover
// button.addEventListener("pointerenter", (e) => {
//   if (gameOver) return;

//   if (e.pointerType === "mouse") {
//     moveButton();
//   }
// });

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", startGame);

// ---------- Init ----------
updateScore();
updateTimer();
gameOverScreen.classList.add("hidden");
startScreen.classList.remove("hidden");