// =====================
// NICKNAME (localStorage)
// =====================

const NICKNAME_KEY = "revofun-nickname";

function getNickname() {
  const name = localStorage.getItem(NICKNAME_KEY);
  return name && name.trim() ? name.trim() : "Guest";
}

function setNickname(name) {
  const trimmed = (name || "").trim().slice(0, 20);
  if (trimmed) {
    localStorage.setItem(NICKNAME_KEY, trimmed);
  } else {
    localStorage.removeItem(NICKNAME_KEY);
  }
}

function updateNicknameStatus(note) {
  const status = document.getElementById("nicknameStatus");
  if (!status) return;

  let text = `Playing as: ${getNickname()}`;
  if (note) text += ` · ${note}`;
  status.textContent = text;
}

// Wire nickname input on each game page (call once after DOM is ready)
function setupNickname() {
  const input = document.getElementById("nicknameInput");
  const btn = document.getElementById("saveNicknameBtn");
  if (!input) return;

  const bar = input.closest(".nickname-bar");
  if (bar && !document.getElementById("nicknameStatus")) {
    const status = document.createElement("p");
    status.id = "nicknameStatus";
    status.className = "nickname-status";
    status.setAttribute("aria-live", "polite");
    bar.appendChild(status);
  }

  const stored = localStorage.getItem(NICKNAME_KEY);
  if (stored) input.value = stored;

  function persist() {
    setNickname(input.value);
    updateNicknameStatus();
  }

  if (btn) btn.addEventListener("click", persist);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      persist();
    }
  });

  updateNicknameStatus();
}

function getDisplayName(entry) {
  return entry.nickname || "Guest";
}

// =====================
// LEADERBOARD (localStorage)
// =====================

function saveScore(game, score) {
  const data = JSON.parse(localStorage.getItem("leaderboards")) || {};
  if (!data[game]) data[game] = [];

  data[game].push({
    score,
    nickname: getNickname(),
    date: new Date().toLocaleDateString()
  });

  data[game].sort((a, b) => b.score - a.score);
  // Keep only the top 5 entries after sorting
  data[game] = data[game].slice(0, 5);

  localStorage.setItem("leaderboards", JSON.stringify(data));

  if (getNickname() === "Guest" && score > 0) {
    updateNicknameStatus("Score saved as Guest — set a nickname above to use your name.");
  }
}

function getScores(game) {
  const data = JSON.parse(localStorage.getItem("leaderboards")) || {};
  return data[game] || [];
}
