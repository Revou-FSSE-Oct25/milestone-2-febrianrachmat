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

clickBtn.classList.add("shake");
setTimeout(() => clickBtn.classList.remove("shake"), 200);

const totalTime = 10;
const timeProgress = document.getElementById("timeProgress");

time--;
timeDisplay.textContent = time;

const percentage = (time / totalTime) * 100;
timeProgress.style.width = percentage + "%";

timeProgress.style.width = "0%";

leaderboard.innerHTML = "";

scores.forEach((item, index) => {
  const li = document.createElement("li");
  li.textContent = `${item.name} - ${item.score}`;

  if (index === 0) li.classList.add("rank-1");
  if (index === 1) li.classList.add("rank-2");
  if (index === 2) li.classList.add("rank-3");

  leaderboard.appendChild(li);
});

