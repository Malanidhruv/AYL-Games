const learningText = document.getElementById("learning-text");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-assignment");
const assignmentSection = document.getElementById("assignment-section");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const resetBtn = document.getElementById("reset-game");
const levelNumber = document.getElementById("level-number");

let timer;
let timeLeft = 30;
let score = 0;
let level = 1;

const questions = {
  1: { q: "What is 2 + 2?", options: ["3","4","5"], answer: "4" },
  2: { q: "Capital of France?", options: ["Berlin","Paris","Rome"], answer: "Paris" },
  3: { q: "Which is largest planet?", options: ["Earth","Jupiter","Mars"], answer: "Jupiter" }
};

function startLearning() {
  startBtn.disabled = true;
  assignmentSection.classList.add("hidden");
  feedbackEl.textContent = "";
  timeLeft = 30;
  timerDisplay.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      startBtn.disabled = false;
    }
  }, 1000);
}

function startAssignment() {
  assignmentSection.classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  const q = questions[level];
  if (!q) {
    questionEl.textContent = "🎉 Congratulations! You finished all levels.";
    optionsEl.innerHTML = "";
    return;
  }

  questionEl.textContent = q.q;
  optionsEl.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(answer) {
  const q = questions[level];
  if (answer === q.answer) {
    feedbackEl.textContent = "✅ Correct!";
    score += 10;
    level++;
    levelNumber.textContent = level;
    localStorage.setItem("gameState", JSON.stringify({score, level}));
    setTimeout(startLearning, 1500);
  } else {
    feedbackEl.textContent = "❌ Wrong. Try again.";
  }
  scoreEl.textContent = score;
}

resetBtn.addEventListener("click", () => {
  score = 0;
  level = 1;
  localStorage.removeItem("gameState");
  scoreEl.textContent = score;
  levelNumber.textContent = level;
  startLearning();
});

startBtn.addEventListener("click", startAssignment);

// Load saved progress
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("gameState"));
  if (saved) {
    score = saved.score;
    level = saved.level;
    scoreEl.textContent = score;
    levelNumber.textContent = level;
  }
  startLearning();
};
