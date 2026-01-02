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

// ===== Functions =====
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
  getScores("rps").forEach(s => {
    const li = document.createElement("li");
    li.textContent = `Wins: ${s.score}`;
    leaderboard.appendChild(li);
  });
}
