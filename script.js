// === CHRONO ===
const chrono = document.getElementById("chrono");
const predictBtn = document.getElementById("predictBtn");
const randomBtn = document.getElementById("randomBtn");
const result = document.getElementById("result");

function updateChrono() {
  const now = new Date();
  const d = now.getDate().toString().padStart(2, "0");
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");
  const ms = now.getMilliseconds().toString().padStart(2, "0");
  chrono.textContent = `${d}d : ${h}h : ${m}m : ${s}s : ${ms}`;
}
setInterval(updateChrono, 50);

// === AUDIO PLAYER ===
let audio = new Audio();
const fileInput = document.getElementById("audioFile");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const volume = document.getElementById("volume");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    audio.src = url;
  }
});

playBtn.addEventListener("click", () => audio.play());
pauseBtn.addEventListener("click", () => audio.pause());
stopBtn.addEventListener("click", () => {
  audio.pause();
  audio.currentTime = 0;
});
volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

// === GEAR SOUND (optional) ===
const gearSound = new Audio("tick.mp3");
setInterval(() => {
  gearSound.currentTime = 0;
  gearSound.play();
}, 1200);
