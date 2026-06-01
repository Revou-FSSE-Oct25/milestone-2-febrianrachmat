// =====================
// GAME STATE
// =====================

let score = 0;
let time = 10;
let timer = null;
let countdownTimer = null;
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
const gameStatus = document.getElementById("gameStatus");
const gamePanel = getGamePanel();

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
  clickBtn.disabled = true;

  clearInterval(timer);
  clearTimeout(countdownTimer);
  gamePanel.classList.remove("outcome-win", "outcome-lose");

  renderLeaderboard();
  startCountdown();
}

function startCountdown() {
  let count = 3;
  gameStatus.textContent = String(count);
  gameStatus.classList.add("countdown");

  function tickCountdown() {
    count--;
    if (count > 0) {
      gameStatus.textContent = String(count);
      countdownTimer = setTimeout(tickCountdown, 1000);
    } else if (count === 0) {
      gameStatus.textContent = "Go!";
      countdownTimer = setTimeout(startRound, 500);
    }
  }

  countdownTimer = setTimeout(tickCountdown, 1000);
}

function startRound() {
  gameStatus.classList.remove("countdown");
  gameStatus.textContent = "";
  clickBtn.disabled = false;
  timer = setInterval(tick, 1000);
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
  clearTimeout(countdownTimer);
  // Stop clicks once the countdown reaches zero
  clickBtn.disabled = true;
  gameStatus.textContent = `Time's up! Final score: ${score}`;

  saveScore("clicker", score);
  renderLeaderboard();
  playOutcomeAnimation(gamePanel, score > 0 ? "win" : "lose");
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
      <span>#${index + 1} ${getDisplayName(item)}</span>
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

setupNickname();
setupClearLeaderboard("clicker", renderLeaderboard);
initGame();
