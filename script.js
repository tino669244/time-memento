// script.js
// Launcher + live clock + death date + countdown + progress bar

const launcher = document.getElementById('launcher');
const enterBtn = document.getElementById('enterBtn');
const launcherClock = document.getElementById('launcherClock');

const appMain = document.getElementById('app');
const liveClock = document.getElementById('liveClock');

const birthInput = document.getElementById('birthdate');
const calcBtn = document.getElementById('calcBtn');
const resultDiv = document.getElementById('result');
const countdownDiv = document.getElementById('countdown');
const progressBar = document.getElementById('progressBar');
const percentLabel = document.getElementById('percentLabel');

let countdownInterval = null;

// UTILS
function pad(n, len = 2){ return String(n).padStart(len, '0'); }
function formatTimeHHMMSS(date){
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// LAUNCHER CLOCK (smooth with RAF)
function updateLauncherClock(){
  const now = new Date();
  launcherClock.textContent = formatTimeHHMMSS(now);
  requestAnimationFrame(updateLauncherClock);
}
requestAnimationFrame(updateLauncherClock);

// Enter app (close launcher)
enterBtn.addEventListener('click', () => {
  // fade out the launcher
  launcher.style.transition = 'opacity 0.6s ease';
  launcher.style.opacity = '0';
  setTimeout(()=> {
    launcher.style.display = 'none';
    appMain.setAttribute('aria-hidden', 'false');
  }, 650);
});

// LIVE CLOCK in header (updates every second)
function tickLiveClock(){
  const now = new Date();
  liveClock.textContent = formatTimeHHMMSS(now);
}
setInterval(tickLiveClock, 1000);
tickLiveClock(); // init

// CALC & COUNTDOWN
function calculateDeathDate(){
  const birthVal = birthInput.value;
  if(!birthVal){
    resultDiv.textContent = '⚠️ Veuillez entrer une date valide.';
    countdownDiv.textContent = '';
    progressBar.style.width = '0%';
    percentLabel.textContent = '—';
    return;
  }

  // Clear previous interval
  if(countdownInterval) clearInterval(countdownInterval);

  const birthDate = new Date(birthVal);
  // default life span: 51 years (you said earlier default but per-user could change later)
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(deathDate.getFullYear() + 51);

  // show death date
  const dd = pad(deathDate.getDate()), mm = pad(deathDate.getMonth()+1), yy = deathDate.getFullYear();
  resultDiv.innerHTML = `☠️ Vous êtes mort le : <strong style="color:#ff6b6b">${dd}/${mm}/${yy}</strong>`;

  // total life ms
  const totalLifeMs = deathDate.getTime() - birthDate.getTime();

  function update(){
    const now = Date.now();
    const remaining = deathDate.getTime() - now;

    if(remaining <= 0){
      clearInterval(countdownInterval);
      countdownDiv.textContent = '💀 Votre temps est écoulé !';
      progressBar.style.width = '0%';
      percentLabel.textContent = '0%';
      return;
    }

    // breakdown
    const days = Math.floor(remaining / (1000*60*60*24));
    const hours = Math.floor((remaining % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((remaining % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((remaining % (1000*60)) / 1000);

    countdownDiv.textContent = `⏳ Temps restant : ${days}j ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

    // progress percent remaining
    const elapsed = now - birthDate.getTime();
    let pct = Math.max(0, Math.min(100, ((totalLifeMs - elapsed) / totalLifeMs) * 100));
    progressBar.style.width = `${pct}%`;
    percentLabel.textContent = `${Math.round(pct)}%`;
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

// bind button
calcBtn.addEventListener('click', calculateDeathDate);

// allow Enter key on date input
birthInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter') calculateDeathDate();
});

// optional: auto-run with a default date (comment if not wanted)
(function preload(){
  const now = new Date();
  const defaultDate = `${now.getFullYear()-25}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  birthInput.value = defaultDate;
  // calculateDeathDate(); // uncomment to auto-calc on load
})();
