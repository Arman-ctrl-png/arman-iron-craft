/* =========================================================
   ARMAN IRON CRAFT - gallery.js
   The gallery is built from the counts below.
   TO ADD PHOTOS: put them in assets/images/gallery/ named
   gate-1.jpg, gate-2.jpg ... then raise the count here.
   ========================================================= */

const GALLERY = {
  gates:    { count: 6,  file: "gate",    name: "Iron Gate" },
  stairs:   { count: 3,  file: "stair",   name: "Staircase" },
  railings: { count: 6,  file: "railing", name: "Railing & Grill" },
  doors:    { count: 7,  file: "door",    name: "Iron Door" },
  custom:   { count: 25, file: "custom",  name: "Custom Work" }
};

const PAGE_SIZE = 12;   // how many photos show at first, and per "Show more" click

const categoryNames = {
  gates: "Gates", stairs: "Stairs", railings: "Railings & Grills", doors: "Doors", custom: "Custom Work"
};

const grid = document.querySelector("#gallery-grid");
const moreButton = document.querySelector("#gallery-more");
const countText = document.querySelector("#gallery-count");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let limit = PAGE_SIZE;
let matching = [];   // photos that match the current filter

/* ---------- Build the tiles ----------
   Photos are mixed (gate, grill, railing...) so "All" shows variety. */
function addTile(category, number) {
  const config = GALLERY[category];
  const title = config.name + " " + number;
  const src = "assets/images/gallery/" + config.file + "-" + number + ".jpg";

  const li = document.createElement("li");
  li.hidden = true;
  li.innerHTML =
    '<button class="gallery-item" type="button" data-category="' + category + '" data-title="' + title + '" data-src="' + src + '">' +
    '<span class="img-box" data-label="' + src + '"><img src="' + src + '" alt="' + title + '" width="800" height="600" loading="lazy"></span>' +
    '<span class="gallery-item__caption">' + title + "</span></button>";

  // If a photo file is missing, remove its tile instead of showing a broken box
  li.querySelector("img").addEventListener("error", function () { li.remove(); update(); });
  grid.appendChild(li);
}

const longest = Math.max.apply(null, Object.values(GALLERY).map(function (c) { return c.count; }));
for (let n = 1; n <= longest; n++) {
  Object.keys(GALLERY).forEach(function (category) {
    if (n <= GALLERY[category].count) addTile(category, n);
  });
}

/* ---------- Filters + "Show more" ---------- */
function update() {
  const tiles = Array.from(grid.children);
  matching = tiles.filter(function (li) {
    return currentFilter === "all" || li.firstElementChild.dataset.category === currentFilter;
  });
  const shown = matching.slice(0, limit);

  tiles.forEach(function (li) {
    const shouldHide = shown.indexOf(li) === -1;
    if (li.hidden !== shouldHide) li.hidden = shouldHide;   // only touch tiles that changed
  });

  countText.textContent = "Showing " + shown.length + " of " + matching.length + " photos";
  moreButton.hidden = matching.length <= limit;
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    limit = PAGE_SIZE;
    filterButtons.forEach(function (b) {
      const active = b === button;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", active);
    });
    update();
  });
});

moreButton.addEventListener("click", function () {
  limit += PAGE_SIZE;
  update();
});

update();

/* ---------- Lightbox ---------- */
const lightbox = document.querySelector("#lightbox");
const lbImage = lightbox.querySelector(".lightbox__img");
const lbTitle = lightbox.querySelector(".lightbox__title");
const lbCategory = lightbox.querySelector(".lightbox__category");
const lbFigure = lightbox.querySelector(".lightbox__figure");
const closeBtn = lightbox.querySelector(".lightbox__close");
const prevBtn = lightbox.querySelector(".lightbox__prev");
const nextBtn = lightbox.querySelector(".lightbox__next");

let slides = [];         // every photo in the current filter (even ones not shown yet)
let currentIndex = 0;
let lastFocused = null;

function showImage() {
  const item = slides[currentIndex];
  lbFigure.classList.add("is-changing");
  lbFigure.classList.remove("is-missing");
  lbImage.onload = function () { lbFigure.classList.remove("is-changing"); };
  lbImage.onerror = function () {
    lbFigure.classList.add("is-missing");
    lbFigure.classList.remove("is-changing");
  };
  lbImage.src = item.dataset.src;
  lbImage.alt = item.dataset.title;
  lbTitle.textContent = item.dataset.title;
  lbCategory.textContent = categoryNames[item.dataset.category];
}

function openLightbox(item) {
  slides = matching.map(function (li) { return li.firstElementChild; });
  currentIndex = slides.indexOf(item);
  lastFocused = item;
  showImage();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  closeBtn.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (lastFocused) lastFocused.focus();
}

function step(direction) {
  currentIndex = (currentIndex + direction + slides.length) % slides.length;
  showImage();
}

// One listener on the grid handles clicks on every tile (also tiles added later)
grid.addEventListener("click", function (event) {
  const item = event.target.closest(".gallery-item");
  if (item) openLightbox(item);
});

closeBtn.addEventListener("click", closeLightbox);
prevBtn.addEventListener("click", function () { step(-1); });
nextBtn.addEventListener("click", function () { step(1); });
lightbox.addEventListener("click", function (event) {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", function (event) {
  if (!lightbox.classList.contains("is-open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") step(-1);
  if (event.key === "ArrowRight") step(1);
  if (event.key === "Tab") {
    const first = closeBtn, last = nextBtn;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});