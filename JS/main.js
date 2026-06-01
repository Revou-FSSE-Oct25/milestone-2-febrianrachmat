// =====================
// DOM ELEMENTS
// =====================

const header = document.querySelector(".rf-header");

// =====================
// STATE
// =====================

let lastScrollY = window.scrollY;

// =====================
// EVENT LISTENERS
// =====================

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  // Add background/shadow once user scrolls past the hero
  if (currentScrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Hide header when scrolling down on desktop (not on mobile)
  if (
    currentScrollY > lastScrollY &&
    currentScrollY > 100 &&
    window.innerWidth > 768
  ) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollY = currentScrollY;
});
