const canvas = document.getElementById("hallway");
const ctx = canvas.getContext("2d");
const note = document.getElementById("note");

const wakeupScene = document.getElementById("wakeupScene");
const wakeupText = document.getElementById("wakeupText");
const wakeupBtn = document.getElementById("wakeupBtn");

const introScene = document.getElementById("introScene");
const introText = document.getElementById("introText");
const surveyOptions = document.getElementById("surveyOptions");

let currentRoom = 0;
let hasJumped = false;
let endingTriggered = false;
let inFinalScene = false;
let mirrorDistortion = 0;

// ---- Wake-Up Sequence ----
const wakeupLines = [
  "...",
  "You open your eyes. The room is dark.",
  "Your PC screen flickers on by itself.",
  "There's a single icon on the desktop: MindMasterV6.66.exe",
  "Click to open it."
];
let wakeupIndex = 0;

wakeupBtn.addEventListener("click", () => {
  wakeupIndex++;
  if (wakeupIndex < wakeupLines.length) {
    wakeupText.textContent = wakeupLines[wakeupIndex];
  } else {
    wakeupScene.style.display = "none";
    introScene.style.display = "flex";
    showIntroQuestion();
  }
});

// ---- Survey Logic ----
const surveyQuestions = [
  {
    prompt: "🧠 Are you scared right now?",
    options: ["Yes", "No"]
  },
  {
    prompt: "👁 Is there something behind you?",
    options: ["Yes", "Not sure", "No"]
  },
  {
    prompt: "🔒 Do you think you have a choice in life?",
    options: ["I don't know", "Yes", "No"]
  }
];

let currentQuestion = 0;

function showIntroQuestion() {
  const q = surveyQuestions[currentQuestion];
  introText.textContent = q.prompt;
  surveyOptions.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "choiceBtn";
    btn.onclick = () => {
      currentQuestion++;
      if (currentQuestion < surveyQuestions.length) {
        showIntroQuestion();
      } else {
        triggerSurveyJumpscare();
      }
    };
    surveyOptions.appendChild(btn);
  });
}

function triggerSurveyJumpscare() {
  introText.textContent = "👁 JUMPSCARE: IT SAW YOU.";
  surveyOptions.innerHTML = "";
  document.body.style.backgroundColor = "#800000";
  setTimeout(() => {
    document.body.style.backgroundColor = "black";
    introScene.style.display = "none";
    drawHallway();
  }, 2000);
}

// ---- Hallway Logic ----
function drawHallway() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  ctx.font = "16px monospace";
  ctx.fillText(`Room ${currentRoom + 1} of 10`, 10, 20);

  if (currentRoom === 2) drawScrambledPainting();
  if (currentRoom === 4) drawMirror();
  if (currentRoom === 6 && !hasJumped) {
    hasJumped = true;
    flashNote("👁 Someone ran behind you");
  }
  if (currentRoom === 8) {
    drawMirror(true);
    flashNote("The reflection doesn't blink...");
  }
  if (currentRoom === 9) {
    ctx.fillStyle = "#000";
    ctx.fillRect(280, 150, 240, 100);
    ctx.fillStyle = "white";
    ctx.fillText("A bottomless pit blocks your path.", 290, 180);
    ctx.fillText("Press W to jump.", 320, 210);
  }

  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScrambledPainting() {
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 100 + 330;
    const y = Math.random() * 180 + 110;
    ctx.fillStyle = `rgb(${Math.random()*255}, 0, ${Math.random()*255})`;
    ctx.fillRect(x, y, 3, 3);
  }
  ctx.fillStyle = "white";
  ctx.fillText("Distorted Painting", 340, 280);
}

function drawMirror(distorted = false) {
  let r = distorted ? 200 : 100;
  ctx.fillStyle = `rgba(${r},${r},${r},0.7)`;
  ctx.fillRect(520, 80, 100, 240);
  ctx.fillStyle = "green";
  ctx.fillText("Mirror", 540, 210);
}

function flashNote(message) {
  note.textContent = message;
  note.style.display = "block";
  setTimeout(() => note.style.display = "none", 2500);
}

document.addEventListener("keydown", (e) => {
  if (inFinalScene || wakeupScene.style.display !== "none" || introScene.style.display !== "none") return;

  if (['w', 'a', 's', 'd'].includes(e.key)) {
    if (currentRoom < 9) {
      currentRoom++;
      drawHallway();
    } else if (!endingTriggered) {
      endingTriggered = true;
      triggerFinale();
    }
  }
});

// ---- Ending: Final Scene ----
function triggerFinale() {
  inFinalScene = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "20px monospace";
  ctx.fillText("You stand before a bottomless pit.", 200, 200);
  ctx.fillText("Press W to jump.", 270, 230);

  document.addEventListener("keydown", function handleFall(e) {
    if (e.key === "w") {
      document.removeEventListener("keydown", handleFall);
      fallIntoDarkness();
    }
  });
}

function fallIntoDarkness() {
  let darkness = 0;
  const interval = setInterval(() => {
    ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    darkness += 0.05;
    if (darkness > 3) {
      clearInterval(interval);
      wakeInBedroom();
    }
  }, 100);
}

function wakeInBedroom() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const messages = [
    "You wake up in your bed. Breathing hard.",
    "You're safe. You're home.",
    "You glance at your computer...",
    "MindMasterV6.66 is still running."
  ];

  let i = 0;
  const typer = setInterval(() => {
    if (i < messages.length) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "green";
      ctx.font = "18px monospace";
      ctx.fillText(messages[i], 120, 200);
      i++;
    } else {
      clearInterval(typer);
    }
  }, 2500);
}

// ---- Initialization ----
window.onload = () => {
  wakeupText.textContent = wakeupLines[0];
  wakeupScene.style.display = "flex";
};
