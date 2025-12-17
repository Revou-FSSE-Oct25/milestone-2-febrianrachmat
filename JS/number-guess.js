const randomNumber = Math.floor(Math.random() * 100) + 1;
let attemptsLeft = 5;

const message = document.getElementById("message");
const attempts = document.getElementById("attempts");
const input = document.getElementById("guessInput");

attempts.textContent = `Attempts left: ${attemptsLeft}`;

document.getElementById("guessBtn").addEventListener("click", () => {
  const userGuess = Number(input.value);

  if (!userGuess) {
    message.textContent = "Please enter a number";
    return;
  }

  attemptsLeft--;
  attempts.textContent = `Attempts left: ${attemptsLeft}`;

  if (userGuess === randomNumber) {
    message.textContent = "🎉 Correct! You win!";
  } else if (attemptsLeft === 0) {
    message.textContent = `Game Over! The number was ${randomNumber}`;
  } else if (userGuess > randomNumber) {
    message.textContent = "Too high!";
  } else {
    message.textContent = "Too low!";
  }
});