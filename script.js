/* ======================
   Ruine Time — main JS
=======================*/

/* -------------------------
   Chrono de vie + tierces
------------------------- */
const chronoEl = document.getElementById('chrono');
let totalTierces = 0;

function updateChrono(){
  totalTierces++;
  const tierce = totalTierces % 100;
  const totalSeconds = Math.floor(totalTierces / 100);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  chronoEl.textContent = `${String(days).padStart(3,'0')}j | ${String(hours).padStart(2,'0')}h : ${String(minutes).padStart(2,'0')}m : ${String(seconds).padStart(2,'0')}s : ${String(tierce).padStart(2,'0')}`;
}
setInterval(updateChrono, 10); // every 10ms → tierce update

/* -------------------------
   Robot info: Date + horloge
------------------------- */
const dateEl = document.getElementById('currentDate');
