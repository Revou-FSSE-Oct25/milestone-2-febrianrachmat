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

const choices = ["rock", "paper", "scissors"];
let wins = 0;

const result = document.getElementById("result");
const winsText = document.getElementById("wins");
const leaderboard = document.getElementById("leaderboard");

document.querySelectorAll(".choice").forEach(btn =>
  btn.addEventListener("click", () => play(btn.dataset.choice))
);

document.getElementById("restartBtn").addEventListener("click", resetGame);

renderLeaderboard();

function play(player) {
  const cpu = randomChoice();
  const outcome = getResult(player, cpu);

  result.textContent = `You: ${player}, CPU: ${cpu} → ${outcome}`;

  if (outcome === "Win") {
    wins++;
    winsText.textContent = wins;
  }
}

function getResult(p, c) {
  if (p === c) return "Draw";
  if (
    (p === "rock" && c === "scissors") ||
    (p === "paper" && c === "rock") ||
    (p === "scissors" && c === "paper")
  ) return "Win";
  return "Lose";
}

function resetGame() {
  saveScore("rps", wins);
  wins = 0;
  winsText.textContent = wins;
  result.textContent = "Game reset!";
  renderLeaderboard();
}

function randomChoice() {
  return choices[Math.floor(Math.random() * 3)];
}

function renderLeaderboard() {
  leaderboard.innerHTML = "";

  const scores = getScores("rps");

  if (scores.length === 0) {
    leaderboard.innerHTML = "<li class='empty'>No scores yet</li>";
    return;
  }

  scores.forEach((s, index) => {
    const li = document.createElement("li");

    li.textContent = `#${index + 1} — Wins: ${s.score} (${s.date})`;

    if (index === 0) li.classList.add("rank-1");
    if (index === 1) li.classList.add("rank-2");
    if (index === 2) li.classList.add("rank-3");

    leaderboard.appendChild(li);
  });
}
