// script.js - RuineTime Off (no life expectancy)
// Shows time already lived and "if you died now" timestamp.
// Safe, minimal, updates every second.

const birthInput = document.getElementById('birthdate');
const resultBox = document.getElementById('result');
const livedEl = document.getElementById('lived');
const livedBreak = document.getElementById('lived-breakdown');
const deathEl = document.getElementById('death');
const deathSub = document.getElementById('death-sub');

let timer = null;
let birthday = null;

function parseDateValue(val){
  // Accepts yyyy-mm-dd from input
  if(!val) return null;
  const d = new Date(val + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function formatDuration(ms){
  if(ms < 0) ms = Math.abs(ms);
  let s = Math.floor(ms / 1000);
  const years = Math.floor(s / (3600*24*365));
  s -= years * 3600*24*365;
  const days = Math.floor(s / (3600*24));
  s -= days * 3600*24;
  const hours = Math.floor(s / 3600);
  s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  const seconds = s - minutes*60;

  // years with decimals for more human-readable precision
  const yearsDecimal = (ms / (1000 * 3600 * 24 * 365)).toFixed(8);

  const display = `${yearsDecimal} ans`;
  const breakdown = `${days} jours, ${hours} heures, ${minutes} minutes, ${seconds} secondes`;
  return { display, breakdown, secondsTotal: Math.floor(ms/1000) };
}

function updateNow(){
  if(!birthday) return;
  const now = new Date();
  const livedMs = now - birthday;
  if(livedMs < 0) {
    // birth date in the future
    livedEl.textContent = 'Date de naissance invalide (futur)';
    livedBreak.textContent = '';
    deathEl.textContent = '—';
    deathSub.textContent = '';
    return;
  }

  const fmt = formatDuration(livedMs);
  livedEl.textContent = fmt.display;
  livedBreak.textContent = fmt.breakdown;

  // "If you died now" simply shows the current timestamp & repeat summary
  deathEl.textContent = now.toLocaleString();
  deathSub.textContent = `Votre âge actuel : ${fmt.display} (${fmt.secondsTotal.toLocaleString()} secondes)`;

  resultBox.setAttribute('aria-hidden','false');
  resultBox.style.display = 'grid';
}

function startTicker(){
  if(timer) clearInterval(timer);
  timer = setInterval(updateNow, 1000);
  updateNow();
}

birthInput.addEventListener('input', (e) => {
  const val = e.target.value;
  const d = parseDateValue(val);
  birthday = d;
  if(!d){
    // hide results if invalid
    resultBox.style.display = 'none';
    if(timer){ clearInterval(timer); timer = null; }
    return;
  }
  startTicker();
});

// preload example value (optional) - remove if you don't want default
(function preloadSample(){
  const now = new Date();
  const yyyy = now.getFullYear(), mm = String(now.getMonth()+1).padStart(2,'0'), dd = String(now.getDate()).padStart(2,'0');
  birthInput.value = `${yyyy-25}-${mm}-${dd}`;
  birthInput.dispatchEvent(new Event('input'));
})();
