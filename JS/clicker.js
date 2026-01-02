let score, time, timer, gameOver;

const clickBtn = document.getElementById("clickBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const leaderboard = document.getElementById("leaderboard");

clickBtn.addEventListener("click", handleClick);
restartBtn.addEventListener("click", initGame);

initGame();

// ===== Functions =====
function initGame() {
  score = 0;
  time = 10;
  gameOver = false;

  scoreText.textContent = score;
  timeText.textContent = time;
  clickBtn.disabled = false;

  clearInterval(timer);
  timer = setInterval(tick, 1000);

  renderLeaderboard();
}

function handleClick() {
  if (gameOver) return;
  score++;
  scoreText.textContent = score;
}

function tick() {
  time--;
  timeText.textContent = time;

  if (time === 0) {
    endGame();
  }
}

function endGame() {
  gameOver = true;
  clearInterval(timer);
  clickBtn.disabled = true;
  saveScore("clicker", score);
  renderLeaderboard();
}

function renderLeaderboard() {
  leaderboard.innerHTML = "";
  getScores("clicker").forEach(s => {
    const li = document.createElement("li");
    li.textContent = `${s.score} clicks`;
    leaderboard.appendChild(li);
  });
}
