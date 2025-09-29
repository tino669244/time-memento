// -----------------------------
// GRAFFITI BACKGROUND (Canvas)
// -----------------------------
const canvas = document.getElementById("graffitiCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tags = ["💀", "🔥", "☠️", "⏳", "⚡"];
let particles = [];

class Particle {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.size = 20 + Math.random() * 30;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.font = `${this.size}px Impact`;
    ctx.fillStyle = "rgba(255,0,0,0.7)";
    ctx.fillText(this.text, this.x, this.y);
  }
}

function initGraffiti() {
  for (let i = 0; i < 25; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let text = tags[Math.floor(Math.random() * tags.length)];
    particles.push(new Particle(x, y, text));
  }
}

function animateGraffiti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateGraffiti);
}

initGraffiti();
animateGraffiti();

// -----------------------------
// COUNTDOWN SYSTEM
// -----------------------------
let targetDate = null;

function calculateDeathDate() {
  const birthInput = document.getElementById("birthdate").value;
  if (!birthInput) {
    alert("Veuillez entrer une date de naissance !");
    return;
  }

  const birthDate = new Date(birthInput);
  // Exemple: on ajoute 80 ans comme durée de vie "aléatoire"
  targetDate = new Date(birthDate);
  targetDate.setFullYear(birthDate.getFullYear() + 80);

  document.getElementById("result").textContent =
    `Date de mort prédite : ${targetDate.toLocaleDateString()}`;
}

function updateCountdown() {
  if (!targetDate) return;

  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML = "<h2>💀 Temps écoulé 💀</h2>";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const tierces = Math.floor((diff / 100) % 10); // subdivision rapide

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
  document.getElementById("tierces").textContent = tierces;
}

setInterval(updateCountdown, 100);
