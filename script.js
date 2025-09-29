// script.js - graffiti canvas + deterministic death-date generator + countdown

/* -------------------------
   Graffiti animated canvas
   ------------------------- */
const canvas = document.getElementById('graffitiCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const G_TAGS = ["💀","🔥","☠️","⏳","⚡","✞","☩"];
let particles = [];

class Tag {
  constructor(x,y,txt){
    this.x = x; this.y = y; this.txt = txt;
    this.size = 18 + Math.random()*46;
    this.vx = (Math.random()-0.5)*1.6;
    this.vy = (Math.random()-0.5)*1.6;
    this.rot = (Math.random()-0.5)*0.4;
    this.alpha = 0.28 + Math.random()*0.6;
  }
  update(){
    this.x += this.vx; this.y += this.vy;
    this.rot += (Math.random()-0.5)*0.02;
    if(this.x < -50 || this.x > canvas.width+50) this.vx *= -1;
    if(this.y < -50 || this.y > canvas.height+50) this.vy *= -1;
  }
  draw(){
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.alpha;
    // red-ish stroke + fill
    ctx.font = `${this.size}px Impact, Arial Black, sans-serif`;
    ctx.fillStyle = `rgba(255,30,30,${0.9*this.alpha})`;
    ctx.strokeStyle = `rgba(0,0,0,${0.6*this.alpha})`;
    ctx.lineWidth = Math.max(2, this.size*0.06);
    ctx.strokeText(this.txt, 0, 0);
    ctx.fillText(this.txt, 0, 0);
    ctx.restore();
  }
}

function initTags(count=30){
  particles = [];
  for(let i=0;i<count;i++){
    const x = Math.random()*canvas.width;
    const y = Math.random()*canvas.height;
    const t = G_TAGS[Math.floor(Math.random()*G_TAGS.length)];
    particles.push(new Tag(x,y,t));
  }
}
initTags(30);

function animate(){
  // subtle background "fade"
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // draw faint vignette (optional)
  // draw tags
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

/* -------------------------
   Deterministic "death date"
   ------------------------- */
/**
 * Simple deterministic hash for a string (date string)
 * returns non-negative integer
 */
function hashCode(str){
  let h = 2166136261 >>> 0;
  for(let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/**
 * Given birthDateString (YYYY-MM-DD), compute unique offset in days.
 * We allow large offsets (up to ~365000 days = ~1000 years).
 */
function daysOffsetFromBirthString(birthStr){
  // use hashCode to derive pseudo-random but deterministic offset
  const seed = hashCode(birthStr);
  // map seed to 1..365000 (1..1000 years approx)
  const maxDays = 365000;
  const offset = (seed % maxDays) + 1;
  return offset;
}

/* -------------------------
   Countdown logic
   ------------------------- */
const goBtn = document.getElementById('goBtn');
const randomBtn = document.getElementById('randomBtn');

let targetDate = null;
let countdownTimer = null;

function setTargetFromBirthString(birthStr){
  // birthStr expected like "YYYY-MM-DD"
  const birth = new Date(birthStr + 'T00:00:00');
  if(isNaN(birth)) return false;
  const offsetDays = daysOffsetFromBirthString(birthStr);
  const t = new Date(birth.getTime() + offsetDays * 24*60*60*1000);
  targetDate = t;
  // show formatted
  const opts = { year:'numeric', month:'long', day:'numeric' };
  document.getElementById('result').textContent = `Date prédite : ${t.toLocaleDateString(undefined, opts)}  (offset ${offsetDays} j)`;
  startCountdownLoop();
  return true;
}

function setTargetRandomNow(){
  const today = new Date();
  // make pseudo-random based on now (not deterministic)
  const seed = Math.floor(Math.random()*1000000);
  const offsetDays = (seed % 365000) + 1;
  targetDate = new Date(today.getTime() + offsetDays * 24*60*60*1000);
  const opts = { year:'numeric', month:'long', day:'numeric' };
  document.getElementById('result').textContent = `Date prédite (random) : ${targetDate.toLocaleDateString(undefined, opts)} (offset ${offsetDays} j)`;
  startCountdownLoop();
}

/* update display */
function updateCountdownOnce(){
  if(!targetDate) return;
  const now = Date.now();
  const diff = targetDate.getTime() - now;
  if(diff <= 0){
    // finished
    document.getElementById('days').textContent = '0';
    document.getElementById('hours').textContent = '0';
    document.getElementById('minutes').textContent = '0';
    document.getElementById('seconds').textContent = '0';
    document.getElementById('tierces').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressPct').textContent = '0%';
    document.getElementById('result').textContent = "💀 Temps écoulé.";
    return;
  }

  const totalLifeMs = targetDate.getTime() - (new Date(document.getElementById('birthdate').value + 'T00:00:00')).getTime();
  // breakdown
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const minutes = Math.floor((diff / (1000*60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const tierces = Math.floor((diff % 1000) / 10); // centiseconds-ish (0..99)

  document.getElementById('days').textContent = days.toLocaleString();
  document.getElementById('hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
  document.getElementById('tierces').textContent = String(tierces).padStart(2,'0');

  // progress percent (remaining / total)
  if(!isNaN(totalLifeMs) && totalLifeMs>0){
    const elapsed = (Date.now() - (new Date(document.getElementById('birthdate').value + 'T00:00:00')).getTime());
    let pct = Math.max(0, Math.min(100, ((totalLifeMs - elapsed) / totalLifeMs) * 100));
    document.getElementById('progressFill').style.width = `${pct}%`;
    document.getElementById('progressPct').textContent = `${Math.round(pct)}%`;
  }
}

function startCountdownLoop(){
  if(countdownTimer) clearInterval(countdownTimer);
  // update quickly: tierces visible -> 50ms or 100ms
  updateCountdownOnce();
  countdownTimer = setInterval(updateCountdownOnce, 100); // every 100ms
}

/* -------------------------
   UI bindings
   ------------------------- */
goBtn.addEventListener('click', ()=> {
  const birthVal = document.getElementById('birthdate').value;
  if(!birthVal){
    alert('Veuillez entrer une date (YYYY-MM-DD).');
    return;
  }
  const ok = setTargetFromBirthString(birthVal);
  if(!ok) alert('Date invalide.');
});

randomBtn.addEventListener('click', ()=> {
  setTargetRandomNow();
});

/* optional: preload sample birthdate for demo */
(function preloadSample(){
  const now = new Date();
  const sYYYY = now.getFullYear() - 25;
  const mm = String(now.getMonth()+1).padStart(2,'0');
  const dd = String(now.getDate()).padStart(2,'0');
  const sample = `${sYYYY}-${mm}-${dd}`;
  document.getElementById('birthdate').value = sample;
  // do not auto-run; wait user click
})();
