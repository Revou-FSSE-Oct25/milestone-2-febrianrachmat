let score = 0;
let timeLeft = 10;

const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");

document.getElementById("clickBtn").addEventListener("click", () => {
  score++;
  scoreText.textContent = score;
});

const timer = setInterval(() => {
  timeLeft--;
  timeText.textContent = timeLeft;

  if (timeLeft === 0) {
    clearInterval(timer);
    alert(`Game Over! Your score: ${score}`);
  }
}, 1000);
