// =====================
// LEADERBOARD (localStorage)
// =====================

// Shared helpers — one object in localStorage, keyed by game name
function saveScore(game, score) {
  const data = JSON.parse(localStorage.getItem("leaderboards")) || {};
  if (!data[game]) data[game] = [];

  data[game].push({
    score,
    date: new Date().toLocaleDateString()
  });

  data[game].sort((a, b) => b.score - a.score);
  // Keep only the top 5 entries after sorting
  data[game] = data[game].slice(0, 5);

  localStorage.setItem("leaderboards", JSON.stringify(data));
}

function getScores(game) {
  const data = JSON.parse(localStorage.getItem("leaderboards")) || {};
  return data[game] || [];
}
