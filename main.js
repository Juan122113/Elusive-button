
const button = document.getElementById("button");
let moving = false; // flag to prevent multiple movements

function moveButton() {
  const bottom = Math.random() * 90;
  const left = Math.random() * 90;
  button.style.bottom = bottom + "vh";
  button.style.left = left + "vw";
}

// Initial position
moveButton();

button.addEventListener("mouseover", () => {
  if (moving) return; // prevent new movements if one is already pending
  moving = true;

  setTimeout(() => {
    moveButton();
    moving = false; // allow movement again
  }, Math.random() * 500);
});