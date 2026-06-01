// =====================
// GAME STATE
// =====================

const ARENA_WIDTH = 372;
const PLAYER_WIDTH = 44;
const OBJECT_SIZE = 34;
const MOVE_STEP = 18;
const FALL_SPEED = 4;
const SPAWN_INTERVAL = 900;

let playerX = ARENA_WIDTH / 2 - PLAYER_WIDTH / 2;
let objects = [];
let score = 0;
let dodged = 0;
let playing = false;
let gameLoopId = null;
let spawnTimer = null;
let keys = { left: false, right: false };

// =====================
// DOM ELEMENTS
// =====================

const arena = document.getElementById("arena");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const dodgedText = document.getElementById("dodged");
const status = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const leaderboard = document.getElementById("leaderboard");
const gamePanel = getGamePanel();

// =====================
// INITIALIZATION
// =====================

function resetGame() {
  stopGame();
  objects.forEach((obj) => obj.el.remove());
  objects = [];
  playerX = arena.clientWidth / 2 - PLAYER_WIDTH / 2;
  score = 0;
  dodged = 0;
  scoreText.textContent = score;
  dodgedText.textContent = dodged;
  status.textContent = "Press Start to play!";
  startBtn.textContent = "Start";
  startBtn.disabled = false;
  gamePanel.classList.remove("outcome-win", "outcome-lose");
  updatePlayerPosition();
  renderLeaderboard();
}

function startGame() {
  if (playing) return;

  objects.forEach((obj) => obj.el.remove());
  objects = [];
  score = 0;
  dodged = 0;
  scoreText.textContent = score;
  dodgedText.textContent = dodged;
  playing = true;
  status.textContent = "Dodge the blocks!";
  startBtn.textContent = "Playing…";
  startBtn.disabled = true;
  gamePanel.classList.remove("outcome-win", "outcome-lose");

  spawnTimer = setInterval(spawnObject, SPAWN_INTERVAL);
  gameLoopId = requestAnimationFrame(gameLoop);
}

function stopGame() {
  playing = false;
  clearInterval(spawnTimer);
  cancelAnimationFrame(gameLoopId);
}

// =====================
// GAME LOGIC
// =====================

function spawnObject() {
  if (!playing) return;

  const maxX = arena.clientWidth - OBJECT_SIZE;
  const el = document.createElement("div");
  el.className = "falling-object";
  el.style.left = `${Math.random() * maxX}px`;
  el.style.top = `-${OBJECT_SIZE}px`;
  arena.appendChild(el);

  objects.push({ el, x: parseFloat(el.style.left), y: -OBJECT_SIZE });
}

function gameLoop() {
  if (!playing) return;

  if (keys.left) playerX = Math.max(0, playerX - MOVE_STEP);
  if (keys.right) playerX = Math.min(arena.clientWidth - PLAYER_WIDTH, playerX + MOVE_STEP);
  updatePlayerPosition();

  const arenaHeight = arena.clientHeight;

  objects.forEach((obj) => {
    obj.y += FALL_SPEED;
    obj.el.style.top = `${obj.y}px`;
  });

  objects = objects.filter((obj) => {
    if (obj.y > arenaHeight) {
      obj.el.remove();
      dodged++;
      dodgedText.textContent = dodged;
      score += 10;
      scoreText.textContent = score;
      return false;
    }
    return true;
  });

  if (checkCollision()) {
    endGame();
    return;
  }

  gameLoopId = requestAnimationFrame(gameLoop);
}

function checkCollision() {
  const playerY = arena.clientHeight - 30;
  const playerBox = {
    x: playerX,
    y: playerY,
    w: PLAYER_WIDTH,
    h: 18
  };

  return objects.some((obj) => {
    const box = { x: obj.x, y: obj.y, w: OBJECT_SIZE, h: OBJECT_SIZE };
    return (
      playerBox.x < box.x + box.w &&
      playerBox.x + playerBox.w > box.x &&
      playerBox.y < box.y + box.h &&
      playerBox.y + playerBox.h > box.y
    );
  });
}

function endGame() {
  stopGame();
  status.textContent = `💥 Hit! Final score: ${score}`;
  startBtn.textContent = "Restart";
  startBtn.disabled = false;

  if (score > 0) {
    saveScore("avoid-falling", score);
    playOutcomeAnimation(gamePanel, score >= 30 ? "win" : "lose");
  } else {
    playOutcomeAnimation(gamePanel, "lose");
  }

  renderLeaderboard();
}

function updatePlayerPosition() {
  player.style.left = `${playerX}px`;
  player.style.marginLeft = "0";
}

// =====================
// LEADERBOARD UI
// =====================

function renderLeaderboard() {
  leaderboard.innerHTML = "";
  const scores = getScores("avoid-falling");

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
// CONTROLS
// =====================

function bindHold(button, direction) {
  button.addEventListener("mousedown", () => { keys[direction] = true; });
  button.addEventListener("mouseup", () => { keys[direction] = false; });
  button.addEventListener("mouseleave", () => { keys[direction] = false; });
  button.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys[direction] = true;
  });
  button.addEventListener("touchend", () => { keys[direction] = false; });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

startBtn.addEventListener("click", () => {
  if (playing) return;
  if (startBtn.textContent === "Restart") {
    resetGame();
    startGame();
  } else {
    startGame();
  }
});

bindHold(leftBtn, "left");
bindHold(rightBtn, "right");

setupNickname();
setupClearLeaderboard("avoid-falling", renderLeaderboard);
resetGame();
