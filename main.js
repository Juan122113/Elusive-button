// const button = document.getElementById("button");
// let buttonMovement = false;

// button.style.bottom = Math.floor(Math.random() * 90).toString() + "vh";
// button.style.left = Math.floor(Math.random() * 90).toString() + "vw";

// button.addEventListener("mouseover", function() {

//     buttonMovement = true;

//     setTimeout(() => {
//         button.style.bottom = Math.floor(Math.random() * 90).toString() + "vh";
//         button.style.left = Math.floor(Math.random() * 90).toString() + "vw";

//         buttonMovement = false
//     }, 500);
// })

// if (buttonMovement == false) {
//     button.removeEventListener("mouseover")
// }

const button = document.getElementById("button");
let moving = false; // bandera para evitar múltiples movimientos

function moveButton() {
  const bottom = Math.random() * 90;
  const left = Math.random() * 90;
  button.style.bottom = bottom + "vh";
  button.style.left = left + "vw";
}

// Posición inicial
moveButton();

button.addEventListener("mouseover", () => {
  if (moving) return; // evita nuevos movimientos si ya hay uno pendiente
  moving = true;

  setTimeout(() => {
    moveButton();
    moving = false; // habilita nuevamente el movimiento
  }, Math.random() * 500);
});
