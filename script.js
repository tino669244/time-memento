// RuineTime Off - "démoniaque" edition
// Affiche temps vécu en temps réel (avec millisecondes) et "Si vous mouriez maintenant" = heure actuelle précise.

// Elements
const birthInput = document.getElementById('birthdate');
const resultSection = document.getElementById('result');
const livedEl = document.getElementById('lived');
const livedBreak = document.getElementById('lived-breakdown');
const deathEl = document.getElementById('death');
const deathMs = document.getElementById('death-ms');
const ageExact = document.getElementById('ageExact');
const secondsTotal = document.getElementById('secondsTotal');

let birthday = null;
let tick = null;

function parseDate(val){
  if(!val) return null;
  const d = new Date(val + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function pad(n, len=2){ return String(n).padStart(len,'0'); }

function formatDurationDetailed(ms){
  if(ms < 0) ms = Math.abs(ms);
  let s = Math.floor(ms/1000);
  const years = Math.floor(s / (3600*24*365));
  s -= years * 3600*24*365;
  const days = Math.floor(s / (3600*24));
  s -= days * 3600*24;
  const hours = Math.floor(s / 3600);
  s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  const seconds = s - minutes*60;
  const totalSeconds = Math.floor(ms/1000);

  // precise years with decimals
  const yearsDecimal = (ms / (1000 * 3600 * 24 * 365)).toFixed(8);

  const human = `${yearsDecimal} ans`;
  const breakdown = `${days} jours, ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  return { human, breakdown, totalSeconds };
}

function updateNow(){
  if(!birthday) return;

  const now = new Date();
  const livedMs = now - birthday;
  if(livedMs < 0){
    // future date entered
    livedEl.textContent = 'Date invalide (futur)';
    livedBreak.textContent = '';
    deathEl.textContent = '—';
    deathMs.textContent = '';
    resultSection.setAttribute('aria-hidden','true');
    return;
  }

  const fmt = formatDurationDetailed(livedMs);
  livedEl.textContent = fmt.human;
  livedBreak.textContent = fmt.breakdown;

  // death = now (precise)
  const iso = now.toLocaleString();
  const msStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${String(now.getMilliseconds()).padStart(3,'0')}`;
  deathEl.textContent = `${iso}`;
  deathMs.textContent = `Heure précise : ${msStr}`;

  ageExact.textContent = fmt.human;
  secondsTotal.textContent = `${fmt.totalSeconds.toLocaleString()} s`;

  resultSection.setAttribute('aria-hidden','false');
  resultSection.style.display = 'grid';
}

function startTicker(){
  if(tick) cancelAnimationFrame(tick);
  // Use RAF for smoother updates; update about 60fps
  (function loop(){
    updateNow();
    tick = requestAnimationFrame(loop);
  })();
}

birthInput.addEventListener('input', (e) => {
  const d = parseDate(e.target.value);
  birthday = d;
  if(!d){
    resultSection.style.display = 'none';
    if(tick) cancelAnimationFrame(tick);
    return;
  }
  startTicker();
});

// optional preload (25y) - comment or remove if undesired
(function preload(){
  const now = new Date();
  const yyyy = now.getFullYear(), mm = String(now.getMonth()+1).padStart(2,'0'), dd = String(now.getDate()).padStart(2,'0');
  birthInput.value = `${yyyy-25}-${mm}-${dd}`;
  birthInput.dispatchEvent(new Event('input'));
})();
