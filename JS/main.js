// =====================
// DOM ELEMENTS
// =====================

const header = document.querySelector(".rf-header");

// =====================
// STATE
// =====================

let lastScrollY = window.scrollY;

// =====================
// LEADERBOARD (localStorage)
// =====================

// Persist score per game; keep only the top 5 entries after sorting
function saveScore(game, score) {
  const data = JSON.parse(localStorage.getItem("leaderboards")) || {};
  if (!data[game]) data[game] = [];

  data[game].push({
    score,
    date: new Date().toLocaleDateString()
  });

  data[game].sort((a, b) => b.score - a.score);
  data[game] = data[game].slice(0, 5);

  localStorage.setItem("leaderboards", JSON.stringify(data));
}

function getScores(game) {
  const data = JSON.parse(localStorage.getItem("leaderboards")) || {};
  return data[game] || [];
}

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
