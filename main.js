const button = document.getElementById("button");

button.addEventListener("mouseover", function() {
    button.style.bottom = Math.floor(Math.random() * 90).toString() + "vh";
    button.style.left = Math.floor(Math.random() * 90).toString() + "vw";
})