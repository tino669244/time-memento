// --------------------
// Chrono + Navigation
// --------------------
const chrono = document.getElementById("chrono");
let seconds = 0;
setInterval(() => {
  seconds++;
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  chrono.textContent = `${h}:${m}:${s}`;
}, 1000);

// Navigation links
const links = document.querySelectorAll(".nav-links a");
const pages = document.querySelectorAll(".page");

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    pages.forEach(p => p.classList.remove("active"));
    target.classList.add("active");
  });
});

// --------------------
// Audio visualizer
// --------------------
const canvas = document.getElementById("graffitiCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.45;

const audio = document.getElementById("audio");
const fileInput = document.getElementById("audioFile");
const playBtn = document.getElementById("playBtn");

let audioCtx, analyser, source, dataArray, bufferLength;
let isPlaying = false;

fileInput.addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    audio.src = url;
  }
});

playBtn.addEventListener("click", () => {
  if (!audioCtx) setupAudio();
  if (isPlaying) {
    audio.pause();
    playBtn.textContent = "▶ Jouer";
  } else {
    audio.play();
    playBtn.textContent = "⏸ Pause";
  }
  isPlaying = !isPlaying;
});

function setupAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 1.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 1.4;
    const color = `rgb(${barHeight + 100}, 0, 0)`;
    ctx.fillStyle = color;
    ctx.shadowColor = "rgba(255,0,0,0.8)";
    ctx.shadowBlur = 20;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.45;
});
