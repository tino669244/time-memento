// script.js - mise à jour countdown + conversions + fast tick visible (animation CSS)
const calcBtn = document.getElementById('calcBtn');
const birthInput = document.getElementById('birthdate');

const resultDiv = document.getElementById('result');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const hoursDays = document.getElementById('hours-days');
const minutesHours = document.getElementById('minutes-hours');
const secondsMinutes = document.getElementById('seconds-minutes');

const progressBar = document.getElementById('progressBar');
const percentLabel = document.getElementById('percentLabel');

let countdownInterval = null;

function pad(n, len=2){ return String(n).padStart(len, '0'); }

function calculateDeathDate(){
  const birthVal = birthInput.value;
  if(!birthVal){
    resultDiv.textContent = '⚠️ Veuillez entrer une date valide.';
    clearInterval(countdownInterval);
    return;
  }

  if(countdownInterval) clearInterval(countdownInterval);

  const birthDate = new Date(birthVal);
  // default lifespan: 51 years (modifiable later)
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(deathDate.getFullYear() + 51);

  // display death date
  const dd = pad(deathDate.getDate()), mm = pad(deathDate.getMonth()+1), yy = deathDate.getFullYear();
  resultDiv.innerHTML = `☠️ Vous êtes mort le : <strong style="color:#ff6b6b">${dd}/${mm}/${yy}</strong>`;

  const totalLifeMs = deathDate.getTime() - birthDate.getTime();

  // update function
  function update(){
    const now = Date.now();
    const remaining = deathDate.getTime() - now;
    if(remaining <= 0){
      clearInterval(countdownInterval);
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      hoursDays.textContent = '≈ 0 j';
      minutesHours.textContent = '≈ 0 h';
      secondsMinutes.textContent = '≈ 0 m';
      progressBar.style.width = '0%';
      percentLabel.textContent = '0%';
      return;
    }

    // compute hrs/min/sec remaining (absolute)
    const totalSeconds = Math.floor(remaining / 1000);
    const hours = Math.floor(remaining / (1000*60*60));
    const minutes = Math.floor((remaining % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((remaining % (1000*60)) / 1000);

    // set card values
    hoursEl.textContent = hours;
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);

    // conversions:
    const hoursToDays = (hours / 24);
    hoursDays.textContent = `≈ ${hoursToDays.toFixed(2)} j`;

    const minutesToHours = (minutes / 60);
    minutesHours.textContent = `≈ ${minutesToHours.toFixed(2)} h`;

    const secondsToMinutes = (seconds / 60);
    secondsMinutes.textContent = `≈ ${secondsToMinutes.toFixed(2)} m`;

    // progress percent remaining
    const elapsed = now - birthDate.getTime();
    let pct = Math.max(0, Math.min(100, ((totalLifeMs - elapsed) / totalLifeMs) * 100));
    progressBar.style.width = `${pct}%`;
    percentLabel.textContent = `${Math.round(pct)}%`;
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

// bind
calcBtn.addEventListener('click', calculateDeathDate);
birthInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') calculateDeathDate(); });

// optional: preload sample date (uncomment if desired)
// (function preload(){ const now=new Date(); birthInput.value = `${now.getFullYear()-25}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`; })();
