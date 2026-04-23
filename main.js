const button = document.getElementById("button");
const scoreEl = document.getElementById("score");

let moveTimeout;
let score = 0;

function updateScore() {
  scoreEl.textContent = `Clicks: ${score}`;
}

function moveButton() {
  const maxX = window.innerWidth - button.offsetWidth;
  const maxY = window.innerHeight - button.offsetHeight;

  const x = Math.max(0, Math.floor(Math.random() * maxX));
  const y = Math.max(0, Math.floor(Math.random() * maxY));

  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
}

function scheduleRandomMove() {
  clearTimeout(moveTimeout);

  const delay = Math.floor(Math.random() * 1500) + 300;

  moveTimeout = setTimeout(() => {
    moveButton();
    scheduleRandomMove();
  }, delay);
}

button.addEventListener("click", () => {
  score++;
  updateScore();

  clearTimeout(moveTimeout);
  setTimeout(() => {
    moveButton();
    scheduleRandomMove();
  }, 120);
});

button.addEventListener("pointerenter", (e) => {
  if (e.pointerType === "mouse") {
    moveButton();
  }
});

moveButton();
updateScore();
scheduleRandomMove();