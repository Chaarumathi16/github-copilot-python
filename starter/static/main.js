// Client-side rendering and interaction for the Flask-backed Sudoku
const SIZE = 9;
const STORAGE_KEY = 'sudoku_leaderboard';
const THEME_KEY = 'sudoku_theme';
let puzzle = [];
let timerInterval = null;
let elapsedSeconds = 0;
let hintsUsed = 0;
let currentDifficulty = 'medium';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
  const timer = document.getElementById('timer');
  timer.innerText = `Time: ${formatTime(elapsedSeconds)}`;
}

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.innerText = isDark ? 'Light Mode' : 'Dark Mode';
    toggle.setAttribute('aria-pressed', String(isDark));
  }
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

function toggleTheme() {
  const currentTheme = getStoredTheme();
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  saveTheme(nextTheme);
}

function loadTheme() {
  const theme = getStoredTheme();
  applyTheme(theme);
}

function loadLeaderboard() {
  const stored = localStorage.getItem(STORAGE_KEY);
  try {
    const scores = stored ? JSON.parse(stored) : [];
    return Array.isArray(scores) ? scores : [];
  } catch (error) {
    return [];
  }
}

function saveLeaderboardEntry(entry) {
  const entries = loadLeaderboard();
  entries.push(entry);
  entries.sort((a, b) => a.time - b.time);
  const topEntries = entries.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(topEntries));
  renderLeaderboard();
}

function renderLeaderboard() {
  const leaderboard = loadLeaderboard();
  const tbody = document.querySelector('#leaderboard-table tbody');
  tbody.innerHTML = '';

  if (leaderboard.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.innerText = 'No scores yet.';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${formatTime(entry.time)}</td>
      <td>${entry.difficulty}</td>
      <td>${entry.hints}</td>
    `;
    tbody.appendChild(row);
  });
}

function updateHintsDisplay() {
  const hints = document.getElementById('hints-used');
  hints.innerText = `Hints: ${hintsUsed}`;
}

function startTimer() {
  stopTimer();
  elapsedSeconds = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    elapsedSeconds += 1;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function hideSaveScoreSection() {
  const section = document.getElementById('save-score-section');
  section.style.display = 'none';
  document.getElementById('player-name').value = '';
  document.getElementById('save-score').disabled = true;
}

function showSaveScoreSection() {
  const section = document.getElementById('save-score-section');
  section.style.display = 'block';
}

function updateSaveButtonState() {
  const nameInput = document.getElementById('player-name');
  const saveButton = document.getElementById('save-score');
  saveButton.disabled = !nameInput.value.trim();
}

function resetGameState() {
  hintsUsed = 0;
  updateHintsDisplay();
  hideSaveScoreSection();
  stopTimer();
  startTimer();
  document.getElementById('message').innerText = '';
}

function createBoardElement() {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';
  for (let i = 0; i < SIZE; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'sudoku-row';
    for (let j = 0; j < SIZE; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'sudoku-cell';
      input.dataset.row = i;
      input.dataset.col = j;
      const boxClass = ((Math.floor(i / 3) + Math.floor(j / 3)) % 2 === 0) ? 'box-even' : 'box-odd';
      input.dataset.boxClass = boxClass;
      input.classList.add(boxClass);
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^1-9]/g, '');
        e.target.value = val;
        e.target.className = `sudoku-cell ${e.target.dataset.boxClass}`;
        if (isBoardFull()) {
          checkSolution();
        }
      });
      rowDiv.appendChild(input);
    }
    boardDiv.appendChild(rowDiv);
  }
}

function renderPuzzle(puz) {
  puzzle = puz;
  createBoardElement();
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = puzzle[i][j];
      const inp = inputs[idx];
      inp.className = `sudoku-cell ${inp.dataset.boxClass || ''}`;
      if (val !== 0) {
        inp.value = val;
        inp.disabled = true;
        inp.classList.add('prefilled');
      } else {
        inp.value = '';
        inp.disabled = false;
      }
    }
  }
}

function getBoard() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }
  return board;
}

function isBoardFull() {
  const board = getBoard();
  return board.every(row => row.every(cell => cell !== 0));
}

async function newGame() {
  const difficultySelect = document.getElementById('difficulty-select');
  const difficulty = difficultySelect ? difficultySelect.value : 'medium';
  currentDifficulty = difficulty;
  const res = await fetch(`/new?difficulty=${encodeURIComponent(difficulty)}`);
  const data = await res.json();
  renderPuzzle(data.puzzle);
  resetGameState();
}

function highlightIncorrectCells(incorrect) {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const incorrectIndices = new Set(incorrect.map(([row, col]) => row * SIZE + col));
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    if (inp.disabled) continue;
    inp.className = `sudoku-cell ${inp.dataset.boxClass || ''}`;
    if (incorrectIndices.has(idx)) {
      inp.classList.add('incorrect');
    }
  }
}

async function checkSolution() {
  const board = getBoard();
  const res = await fetch('/check', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();
  const msg = document.getElementById('message');
  if (data.error) {
    msg.style.color = '#d32f2f';
    msg.innerText = data.error;
    return;
  }

  highlightIncorrectCells(data.incorrect);

  if (data.incorrect.length === 0) {
    if (isBoardFull()) {
      msg.style.color = '#388e3c';
      msg.innerText = 'Congratulations! You solved it! Enter your name to save your score.';
      stopTimer();
      showSaveScoreSection();
    } else {
      msg.style.color = '#1976d2';
      msg.innerText = 'All entered values are correct so far.';
    }
  } else {
    msg.style.color = '#d32f2f';
    msg.innerText = 'Some cells are incorrect.';
  }
}

async function requestHint() {
  const board = getBoard();
  const res = await fetch('/hint', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();
  const msg = document.getElementById('message');

  if (data.error) {
    msg.style.color = '#d32f2f';
    msg.innerText = data.error;
    return;
  }

  const {row, col, value} = data.hint;
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const idx = row * SIZE + col;
  const input = inputs[idx];
  input.value = value;
  input.disabled = true;
  input.classList.add('prefilled');
  hintsUsed += 1;
  updateHintsDisplay();
  msg.style.color = '#1976d2';
  msg.innerText = 'Hint applied.';

  if (isBoardFull()) {
    checkSolution();
  }
}

function saveScore() {
  const nameInput = document.getElementById('player-name');
  const playerName = nameInput.value.trim();
  const msg = document.getElementById('message');

  if (!playerName) {
    msg.style.color = '#d32f2f';
    msg.innerText = 'Please enter your name to save your score.';
    return;
  }

  saveLeaderboardEntry({
    name: playerName,
    time: elapsedSeconds,
    difficulty: currentDifficulty,
    hints: hintsUsed,
  });

  msg.style.color = '#388e3c';
  msg.innerText = 'Score saved!';
  hideSaveScoreSection();
}

window.addEventListener('load', () => {
  document.getElementById('new-game').addEventListener('click', newGame);
  document.getElementById('check-solution').addEventListener('click', checkSolution);
  document.getElementById('hint-button').addEventListener('click', requestHint);
  document.getElementById('player-name').addEventListener('input', updateSaveButtonState);
  document.getElementById('save-score').addEventListener('click', saveScore);
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  loadTheme();
  renderLeaderboard();
  // initialize
  newGame();
});
