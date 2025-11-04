// 🔥 Infernal fire background generator
const canvas = document.getElementById('infernalCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.6;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawInfernal() {
  const grd = ctx.createRadialGradient(
    canvas.width / 2, canvas.height * 0.7, 50,
    canvas.width / 2, canvas.height * 0.4, canvas.height
  );
  grd.addColorStop(0, 'rgba(255, 100, 0, 0.9)');
  grd.addColorStop(0.4, 'rgba(255, 0, 0, 0.6)');
  grd.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(drawInfernal);
}
drawInfernal();

// 🕰 Chrono de vie
let targetDate = null;
let countdownTimer = null;

function hashCode(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
function daysOffsetFromBirthString(birthStr) {
  const seed = hashCode(birthStr);
  return (seed % 365000) + 1;
}

function setTargetFromBirthString(birthStr) {
  const birth = new Date(birthStr + "T00:00:00");
  if (isNaN(birth)) return false;
  const offsetDays = daysOffsetFromBirthString(birthStr);
  const t = new Date(birth.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  targetDate = t;
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('result').textContent =
    `Date prédite : ${t.toLocaleDateString(undefined, opts)} (offset ${offsetDays} j)`;
  startCountdownLoop();
  return true;
}

function setTargetRandomNow() {
  const today = new Date();
  const seed = Math.floor(Math.random() * 1000000);
  const offsetDays = (seed % 365000) + 1;
  targetDate = new Date(today.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('result').textContent =
    `Date prédite (aléatoire) : ${targetDate.toLocaleDateString(undefined, opts)} (offset ${offsetDays} j)`;
  startCountdownLoop();
}

function updateCountdownOnce() {
  if (!targetDate) return;
  const now = Date.now();
  const diff = targetDate.getTime() - now;
  if (diff <= 0) {
    document.getElementById('days').textContent = '0';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    document.getElementById('tierces').textContent = '00';
    document.getElementById('progressFill').style.width = '0%';
    return;
  }

  const birthVal = document.getElementById('birthdate').value;
  const totalLifeMs =
    targetDate.getTime() - new Date(birthVal + 'T00:00:00').getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const tierces = Math.floor((diff % 1000) / 10);

  document.getElementById('days').textContent = days.toLocaleString();
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  document.getElementById('tierces').textContent = String(tierces).padStart(2, '0');

  const elapsed =
    Date.now() - new Date(birthVal + 'T00:00:00').getTime();
  let pct = Math.max(0, Math.min(100, ((totalLifeMs - elapsed) / totalLifeMs) * 100));
  document.getElementById('progressFill').style.width = `${pct}%`;
}

function startCountdownLoop() {
  if (countdownTimer) clearInterval(countdownTimer);
  updateCountdownOnce();
  countdownTimer = setInterval(updateCountdownOnce, 100);
}

document.getElementById('goBtn').addEventListener('click', () => {
  const birthVal = document.getElementById('birthdate').value;
  if (!birthVal) {
    alert('Veuillez entrer une date (YYYY-MM-DD).');
    return;
  }
  const ok = setTargetFromBirthString(birthVal);
  if (!ok) alert('Date invalide.');
});

document.getElementById('randomBtn').addEventListener('click', () => {
  setTargetRandomNow();
});
