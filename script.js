// 🎯 Example: Local vs Global Scope
let globalMessage = "I am everywhere!"; // Global

function greet(name) {
  let localMessage = "Hello"; // Local
  return `${localMessage}, ${name}! ${globalMessage}`;
}

console.log(greet("Parrot Lover"));

// 🎬 Interactivity: Add animation to the box when button is clicked
const button = document.getElementById("magicButton");
const box = document.getElementById("colorBox");

button.addEventListener("click", () => {
  // Toggle the animation class
  box.classList.toggle("spin");
});
