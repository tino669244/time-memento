function updateCountdownOnce(){
  if(!targetDate) return;
  const now = Date.now();
  const diff = targetDate.getTime() - now;

  const birthStr = document.getElementById('birthdate').value;
  const birth = new Date(birthStr + 'T00:00:00');
  const totalLifeMs = targetDate - birth;

  if(diff <= 0){
    document.getElementById('chrono').textContent = "💀 00:00:00";
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressPct').textContent = '0%';
    document.getElementById('result').textContent = "💀 Temps écoulé.";
    return;
  }

  // Chrono tokana = “HH:MM:SS” (rehefa latsaka andro)
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const chronoText = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  document.getElementById('chrono').textContent = chronoText;

  // progress %
  if(!isNaN(totalLifeMs) && totalLifeMs > 0){
    const elapsed = now - birth.getTime();
    let pct = Math.max(0, Math.min(100, ((totalLifeMs - elapsed) / totalLifeMs) * 100));
    document.getElementById('progressFill').style.width = `${pct}%`;
    document.getElementById('progressPct').textContent = `${Math.round(pct)}%`;
  }
}
