// =====================
// LEADERBOARD (localStorage)
// =====================

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
// GAME STATE
// =====================

let score = 0;
let time = 10;
let timer = null;
let gameOver = false;

// =====================
// DOM ELEMENTS
// =====================

const clickBtn = document.getElementById("clickBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const timeProgress = document.getElementById("timeProgress");
const leaderboard = document.getElementById("leaderboard");

// =====================
// INITIALIZATION
// =====================

function initGame() {
  score = 0;
  time = 10;
  gameOver = false;

  scoreText.textContent = score;
  timeText.textContent = time;
  timeProgress.style.width = "100%";
  clickBtn.disabled = false;

  // Clear previous interval before starting a new round (avoids multiple timers)
  clearInterval(timer);
  timer = setInterval(tick, 1000);

  renderLeaderboard();
}

// =====================
// GAME LOGIC
// =====================

function handleClick() {
  if (gameOver) return;
  score++;
  scoreText.textContent = score;

  // Brief shake animation on each click for visual feedback
  clickBtn.classList.add("shake");
  setTimeout(() => clickBtn.classList.remove("shake"), 150);
}

function tick() {
  time--;
  timeText.textContent = time;
  // Shrink progress bar as remaining time decreases (10s total)
  timeProgress.style.width = (time / 10) * 100 + "%";

  if (time === 0) {
    endGame();
  }
}

function endGame() {
  gameOver = true;
  clearInterval(timer);
  // Stop clicks once the countdown reaches zero
  clickBtn.disabled = true;

  saveScore("clicker", score);
  renderLeaderboard();
}

// =====================
// LEADERBOARD UI
// =====================

function renderLeaderboard() {
  leaderboard.innerHTML = "";

  const scores = getScores("clicker");

  if (scores.length === 0) {
    leaderboard.innerHTML = "<li>No scores yet</li>";
    return;
  }

  scores.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>#${index + 1}</span>
      <span>${item.score} clicks</span>
    `;

    if (index === 0) li.classList.add("rank-1");
    if (index === 1) li.classList.add("rank-2");
    if (index === 2) li.classList.add("rank-3");

    leaderboard.appendChild(li);
  });
}

// =====================
// EVENT LISTENERS
// =====================

clickBtn.addEventListener("click", handleClick);
restartBtn.addEventListener("click", initGame);

initGame();
