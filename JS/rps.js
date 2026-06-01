// =====================
// GAME STATE
// =====================

const choices = ["rock", "paper", "scissors"];
let wins = 0;

// =====================
// DOM ELEMENTS
// =====================

const result = document.getElementById("result");
const winsText = document.getElementById("wins");
const leaderboard = document.getElementById("leaderboard");

// =====================
// GAME LOGIC
// =====================

function play(player) {
  const cpu = randomChoice();
  const outcome = getResult(player, cpu);

  result.textContent = `You: ${player}, CPU: ${cpu} → ${outcome}`;

  if (outcome === "Win") {
    wins++;
    winsText.textContent = wins;
  }
}

// Classic RPS rules: switch on "player-cpu" matchup to decide Win or Lose
function getResult(p, c) {
  if (p === c) return "Draw";

  switch (`${p}-${c}`) {
    case "rock-scissors":
    case "paper-rock":
    case "scissors-paper":
      return "Win";
    default:
      return "Lose";
  }
}

function randomChoice() {
  return choices[Math.floor(Math.random() * 3)];
}

function resetGame() {
  // Save current win streak to leaderboard before resetting the counter
  saveScore("rps", wins);
  wins = 0;
  winsText.textContent = wins;
  result.textContent = "Game reset!";
  renderLeaderboard();
}

// =====================
// LEADERBOARD UI
// =====================

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

// =====================
// EVENT LISTENERS
// =====================

// data-choice on each button holds "rock", "paper", or "scissors"
document.querySelectorAll(".choice").forEach(btn =>
  btn.addEventListener("click", () => play(btn.dataset.choice))
);

document.getElementById("restartBtn").addEventListener("click", resetGame);

renderLeaderboard();
