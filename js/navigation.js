/* =========================================================
   ARMAN IRON CRAFT - navigation.js
   Opens and closes the mobile menu.
   ========================================================= */

const toggleButton = document.querySelector(".nav-toggle");
const menu = document.querySelector("#nav-menu");

function setMenu(open) {
  menu.classList.toggle("is-open", open);                // CSS slides the menu in/out
  toggleButton.setAttribute("aria-expanded", open);      // tells screen readers the state
  toggleButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

// Click the hamburger: open if closed, close if open
toggleButton.addEventListener("click", function () {
  setMenu(!menu.classList.contains("is-open"));
});

// Close the menu when a link inside it is tapped
menu.addEventListener("click", function (event) {
  if (event.target.closest("a")) setMenu(false);
});

// Close with the Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") setMenu(false);
});

// Close if the screen is resized up to desktop width
window.addEventListener("resize", function () {
  if (window.innerWidth >= 900) setMenu(false);
});