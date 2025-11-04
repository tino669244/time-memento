/* -----------------------------
   Audio-reactive terror canvas
------------------------------ */
const canvas = document.getElementById("graffitiCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.7;

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
    const barHeight = dataArray[i] * 1.5;
    const r = barHeight + 25 * (i / bufferLength);
    const g = 0;
    const b = 0;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.shadowColor = `rgba(255,0,0,0.8)`;
    ctx.shadowBlur = 20;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

/* Little terror glitch every few seconds */
setInterval(() => {
  document.body.style.filter = "contrast(150%) hue-rotate(10deg)";
  setTimeout(() => (document.body.style.filter = "none"), 100);
}, 2000);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.7;
});
