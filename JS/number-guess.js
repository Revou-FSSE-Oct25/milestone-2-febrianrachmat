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


let targetNumber;
let attemptsLeft;
let gameOver;


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
  targetNumber = generateRandomNumber();
  attemptsLeft = 5;
  gameOver = false;

  input.value = "";
  input.disabled = false;
  guessBtn.disabled = false;

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

  processGuess(Number(value));
}

function validateInput(value) {
  if (value === "") {
    return { valid: false, message: "Please enter a number." };
  }

  const number = Number(value);

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

function generateRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}


function renderLeaderboard() {
  leaderboard.innerHTML = "";

  const scores = getScores("number-guess");

  if (scores.length === 0) {
    leaderboard.innerHTML = "<li>No scores yet</li>";
    return;
  }

  scores.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} — Score: ${item.score} (${item.date})`;

    if (index === 0) li.classList.add("rank-1");
    if (index === 1) li.classList.add("rank-2");
    if (index === 2) li.classList.add("rank-3");

    leaderboard.appendChild(li);
  });
}
