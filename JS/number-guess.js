let target, attemptsLeft, gameOver;

const input = document.getElementById("guessInput");
const message = document.getElementById("message");
const attempts = document.getElementById("attempts");
const guessBtn = document.getElementById("guessBtn");
const restartBtn = document.getElementById("restartBtn");
const leaderboard = document.getElementById("leaderboard");

guessBtn.addEventListener("click", handleGuess);
restartBtn.addEventListener("click", initGame);

initGame();


function initGame() {
  target = randomNumber();
  attemptsLeft = 5;
  gameOver = false;

  input.disabled = false;
  guessBtn.disabled = false;
  input.value = "";

  updateAttempts();
  updateMessage("Start guessing!");
  renderLeaderboard();
}

function handleGuess() {
  if (gameOver) return;

  const value = input.value.trim();
  const validation = validateInput(value);
  if (!validation.valid) {
    updateMessage(validation.message);
    return;
  }

  checkGuess(Number(value));
}

function validateInput(value) {
  if (!value) return { valid: false, message: "Enter a number" };
  if (!Number.isInteger(Number(value)))
    return { valid: false, message: "Whole numbers only" };
  if (value < 1 || value > 100)
    return { valid: false, message: "1–100 only" };

  return { valid: true };
}

function checkGuess(guess) {
  attemptsLeft--;
  updateAttempts();

  if (guess === target) {
    endGame("🎉 You win!", attemptsLeft);
  } else if (attemptsLeft === 0) {
    endGame(`💀 Lost! Number was ${target}`, 0);
  } else {
    updateMessage(guess > target ? "Too high!" : "Too low!");
  }
}

function endGame(text, score) {
  gameOver = true;
  updateMessage(text);
  input.disabled = true;
  guessBtn.disabled = true;
  saveScore("number-guess", score);
  renderLeaderboard();
}

function updateMessage(text) {
  message.textContent = text;
}

function updateAttempts() {
  attempts.textContent = `Attempts left: ${attemptsLeft}`;
}

function randomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function renderLeaderboard() {
  leaderboard.innerHTML = "";
  getScores("number-guess").forEach(s => {
    const li = document.createElement("li");
    li.textContent = `Score: ${s.score} (${s.date})`;
    leaderboard.appendChild(li);
  });
}
