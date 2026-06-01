// =====================
// GAME STATE
// =====================

let targetNumber;
let attemptsLeft;
let gameOver;

// =====================
// DOM ELEMENTS
// =====================

const input = document.getElementById("guessInput");
const message = document.getElementById("message");
const attempts = document.getElementById("attempts");
const guessBtn = document.getElementById("guessBtn");
const restartBtn = document.getElementById("restartBtn");
const leaderboard = document.getElementById("leaderboard");
const gamePanel = getGamePanel();

// =====================
// INITIALIZATION
// =====================

function initGame() {
  targetNumber = generateRandomNumber();
  attemptsLeft = 5;
  gameOver = false;

  input.value = "";
  input.disabled = false;
  guessBtn.disabled = false;
  gamePanel.classList.remove("outcome-win", "outcome-lose");

  updateAttempts();
  updateMessage("Start guessing!");
  renderLeaderboard();
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

// =====================
// GAME LOGIC
// =====================

function handleGuess() {
  // Block further guesses after win or loss
  if (gameOver) return;

  const value = input.value.trim();
  const validation = validateInput(value);

  if (!validation.valid) {
    updateMessage(validation.message);
    return;
  }

  processGuess(Number(value));
}

function validateInput(value) {
  if (value === "") {
    return { valid: false, message: "Please enter a number." };
  }

  const number = Number(value);

  // Reject decimals (e.g. 50.5) even though input type is "number"
  if (!Number.isInteger(number)) {
    return { valid: false, message: "Please enter a whole number." };
  }

  if (number < 1 || number > 100) {
    return { valid: false, message: "Number must be between 1 and 100." };
  }

  return { valid: true };
}

function processGuess(guess) {
  attemptsLeft--;
  updateAttempts();

  // Higher score = more attempts left when the player wins
  if (guess === targetNumber) {
    endGame("🎉 Correct! You win!", attemptsLeft);
  } else if (attemptsLeft === 0) {
    endGame(`💀 Game Over! The number was ${targetNumber}`, 0);
  } else {
    updateMessage(guess > targetNumber ? "📉 Too high!" : "📈 Too low!");
  }
}

function endGame(text, score) {
  gameOver = true;
  updateMessage(text);

  // Disable controls so the player cannot keep guessing after the round ends
  input.disabled = true;
  guessBtn.disabled = true;

  saveScore("number-guess", score);
  renderLeaderboard();
  playOutcomeAnimation(gamePanel, score > 0 ? "win" : "lose");
}

// =====================
// UI UPDATES
// =====================

function updateMessage(text) {
  message.textContent = text;
}

function updateAttempts() {
  attempts.textContent = `Attempts left: ${attemptsLeft}`;
}

// =====================
// LEADERBOARD UI
// =====================

function renderLeaderboard() {
  leaderboard.innerHTML = "";

  const scores = getScores("number-guess");

  if (scores.length === 0) {
    leaderboard.innerHTML = "<li>No scores yet</li>";
    return;
  }

  scores.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} — ${getDisplayName(item)}: ${item.score} (${item.date})`;

    if (index === 0) li.classList.add("rank-1");
    if (index === 1) li.classList.add("rank-2");
    if (index === 2) li.classList.add("rank-3");

    leaderboard.appendChild(li);
  });
}

// =====================
// EVENT LISTENERS
// =====================

guessBtn.addEventListener("click", handleGuess);
restartBtn.addEventListener("click", initGame);

// Submit guess with Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleGuess();
});

setupNickname();
setupClearLeaderboard("number-guess", renderLeaderboard);
initGame();
