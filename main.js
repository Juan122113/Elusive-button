const button = document.getElementById("button");

let moveTimeout;

function moveButton() {
  const bottom = Math.floor(Math.random() * 90);
  const left = Math.floor(Math.random() * 90);

  button.style.bottom = bottom + "vh";
  button.style.left = left + "vw";
}

function scheduleRandomMove() {
  clearTimeout(moveTimeout);

  const delay = Math.floor(Math.random() * 1000) + 500; // 500ms to 1500ms

  moveTimeout = setTimeout(() => {
    moveButton();
    scheduleRandomMove();
  }, delay);
}

moveButton();
scheduleRandomMove();

button.addEventListener("pointerenter", (e) => {
  if (e.pointerType === "mouse") {
    moveButton();
  }
});

button.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "touch" || e.pointerType === "pen") {
    e.preventDefault();
    moveButton();
  }
});