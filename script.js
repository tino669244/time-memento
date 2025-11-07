// Chronomètre de vie
const countdown = document.getElementById("countdown");
const predictBtn = document.getElementById("predictBtn");
const randomBtn = document.getElementById("randomBtn");
const result = document.getElementById("result");

predictBtn.onclick = () => {
  const birthdate = new Date(document.getElementById("birthdate").value);
  if (!birthdate) return;
  const death = new Date(birthdate);
  death.setFullYear(death.getFullYear() + Math.floor(50 + Math.random() * 50));
  startCountdown(death);
  result.textContent = "🧬 Vie estimée jusqu'au " + death.toDateString();
};

randomBtn.onclick = () => {
  const death = new Date();
  death.setSeconds(death.getSeconds() + Math.floor(Math.random() * 999999));
  startCountdown(death);
};

function startCountdown(targetDate) {
  function update() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      countdown.textContent = "💀 Fin du temps 💀";
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    countdown.textContent = `${d.toString().padStart(3, '0')}d : ${h
      .toString()
      .padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s
      .toString()
      .padStart(2, '0')}s`;
  }
  update();
  const timer = setInterval(update, 1000);
}

// Audio controls
const fileInput = document.getElementById("fileInput");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const volumeSlider = document.getElementById("volumeSlider");

let audio = new Audio();

fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    audio.src = url;
  }
});

playBtn.onclick = () => audio.play();
pauseBtn.onclick = () => audio.pause();
stopBtn.onclick = () => {
  audio.pause();
  audio.currentTime = 0;
};
volumeSlider.oninput = e => {
  audio.volume = e.target.value;
};
