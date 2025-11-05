// ---- Chronomètre de Vie ----
function updateChrono(targetDate) {
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff <= 0) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const ms = Math.floor((diff % 1000) / 10);

  document.getElementById("chrono").innerText =
    `${days.toString().padStart(3,'0')}d : ${hours.toString().padStart(2,'0')}h : ${minutes.toString().padStart(2,'0')}m : ${seconds.toString().padStart(2,'0')}s : ${ms.toString().padStart(2,'0')}`;

  requestAnimationFrame(() => updateChrono(targetDate));
}

document.getElementById("predict").addEventListener("click", () => {
  const birthdate = document.getElementById("birthdate").value;
  if (birthdate) {
    const lifeExpectancy = 80;
    const birth = new Date(birthdate);
    const deathDate = new Date(birth.setFullYear(birth.getFullYear() + lifeExpectancy));
    updateChrono(deathDate);
  }
});

document.getElementById("random").addEventListener("click", () => {
  const randYear = 1950 + Math.floor(Math.random() * 60);
  document.getElementById("birthdate").value = `01/01/${randYear}`;
});

// ---- Date & Heure ----
function updateDateTime() {
  const now = new Date();
  document.getElementById("current-time").innerText =
    now.toLocaleTimeString('fr-FR');
  document.getElementById("calendar").innerText =
    now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ---- Audio Visualizer ----
const audio = document.getElementById('music');
const canvas = document.getElementById('audioVisualizer');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = 150;

let audioCtx, analyser, source, bufferLength, dataArray;

audio.onplay = () => {
  if (!audioCtx) {
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
};

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);
  
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    const r = barHeight + (25 * (i / bufferLength));
    const g = 250 * (i / bufferLength);
    const b = 50;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    x += barWidth + 1;
  }
}
