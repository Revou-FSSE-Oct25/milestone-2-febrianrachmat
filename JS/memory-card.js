// =====================
// GAME STATE
// =====================

const PAIRS = ["🎮", "🎯", "🎲", "🚀"];
const TOTAL_PAIRS = PAIRS.length;

let deck = [];
let flipped = [];
let moves = 0;
let matchedPairs = 0;
let locked = false;
let gameOver = false;

// =====================
// DOM ELEMENTS
// =====================

const board = document.getElementById("board");
const movesText = document.getElementById("moves");
const pairsText = document.getElementById("pairs");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const leaderboard = document.getElementById("leaderboard");
const gamePanel = getGamePanel();

// =====================
// INITIALIZATION
// =====================

function initGame() {
  deck = shuffle(
    PAIRS.flatMap((emoji, pairId) => [
      { pairId, emoji, matched: false },
      { pairId, emoji, matched: false }
    ])
  );

  flipped = [];
  moves = 0;
  matchedPairs = 0;
  locked = false;
  gameOver = false;

  movesText.textContent = moves;
  pairsText.textContent = `0/${TOTAL_PAIRS}`;
  status.textContent = "Find matching pairs!";
  gamePanel.classList.remove("outcome-win", "outcome-lose");

  renderBoard();
  renderLeaderboard();
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// =====================
// GAME LOGIC
// =====================

function flipCard(index) {
  if (locked || gameOver) return;

  const card = deck[index];
  if (card.matched || flipped.includes(index)) return;

  flipped.push(index);
  renderBoard();

  if (flipped.length < 2) return;

  moves++;
  movesText.textContent = moves;
  locked = true;

  const [firstIndex, secondIndex] = flipped;
  const first = deck[firstIndex];
  const second = deck[secondIndex];

  if (first.pairId === second.pairId) {
    first.matched = true;
    second.matched = true;
    matchedPairs++;
    pairsText.textContent = `${matchedPairs}/${TOTAL_PAIRS}`;
    flipped = [];
    locked = false;
    renderBoard();

    if (matchedPairs === TOTAL_PAIRS) {
      finishGame(true);
    }
    return;
  }

  setTimeout(() => {
    flipped = [];
    locked = false;
    renderBoard();
  }, 700);
}

function finishGame(won) {
  gameOver = true;

  if (won) {
    const score = Math.max(100 - moves * 8, 10);
    status.textContent = `🎉 You win in ${moves} moves! Score: ${score}`;
    saveScore("memory", score);
    playOutcomeAnimation(gamePanel, "win");
  } else {
    status.textContent = "Game over!";
    playOutcomeAnimation(gamePanel, "lose");
  }

  renderLeaderboard();
}

// =====================
// UI
// =====================

function renderBoard() {
  board.innerHTML = "";

  deck.forEach((card, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "memory-card";
    btn.setAttribute("aria-label", card.matched ? `Matched ${card.emoji}` : "Hidden card");

    if (card.matched || flipped.includes(index)) {
      btn.classList.add("flipped");
    }
    if (card.matched) {
      btn.classList.add("matched");
    }

    btn.innerHTML = `
      <span class="card-back">?</span>
      <span class="card-front">${card.emoji}</span>
    `;

    btn.addEventListener("click", () => flipCard(index));
    board.appendChild(btn);
  });
}

function renderLeaderboard() {
  leaderboard.innerHTML = "";
  const scores = getScores("memory");

  if (scores.length === 0) {
    leaderboard.innerHTML = "<li>No scores yet</li>";
    return;
  }

  scores.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} — ${getDisplayName(item)}: ${item.score} pts (${item.date})`;

    if (index === 0) li.classList.add("rank-1");
    if (index === 1) li.classList.add("rank-2");
    if (index === 2) li.classList.add("rank-3");

    leaderboard.appendChild(li);
  });
}

// =====================
// EVENT LISTENERS
// =====================

restartBtn.addEventListener("click", initGame);

setupNickname();
setupClearLeaderboard("memory", renderLeaderboard);
initGame();
