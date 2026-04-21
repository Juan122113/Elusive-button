const button = document.getElementById("button");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

let moveTimeout;
let timerInterval;

let score = 0;
let timeLeft = 10;
let gameOver = false;
let ignoreNextClick = false;

// ---------- UI ----------
function updateScore() {
  scoreEl.textContent = `Clicks: ${score}`;
}

function updateTimer() {
  timerEl.textContent = `Time: ${timeLeft}s`;
}

// ---------- Movimiento ----------
function moveButton() {
  const maxX = window.innerWidth - button.offsetWidth;
  const maxY = window.innerHeight - button.offsetHeight;

  const x = Math.max(0, Math.floor(Math.random() * maxX));
  const y = Math.max(0, Math.floor(Math.random() * maxY));

  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
}

function scheduleRandomMove() {
  if (gameOver) return;

  clearTimeout(moveTimeout);

  const delay = Math.floor(Math.random() * 1500) + 300;

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

// ---------- Fin del juego ----------
function endGame() {
  gameOver = true;

  clearTimeout(moveTimeout);
  clearInterval(timerInterval);

  timerEl.textContent = "Time: 0s";

  finalScoreEl.textContent = `Final score: ${score}`;
  gameOverScreen.classList.remove("hidden");
}

// ---------- Eventos ----------

// Click (desktop + fallback móvil)
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
    if (gameOver) return;
    moveButton();
    scheduleRandomMove();
  }, 120);
});

// Touch (móvil)
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

// Hover (mouse)
button.addEventListener("pointerenter", (e) => {
  if (gameOver) return;

  if (e.pointerType === "mouse") {
    moveButton();
  }
});

// Reiniciar juego
restartBtn.addEventListener("click", () => {
  score = 0;
  timeLeft = 10;
  gameOver = false;

  updateScore();
  updateTimer();

  gameOverScreen.classList.add("hidden");

  moveButton();
  startTimer();
  scheduleRandomMove();
});

// ---------- Init ----------
moveButton();
updateScore();
startTimer();
scheduleRandomMove();