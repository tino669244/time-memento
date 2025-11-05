/* ========= Ruine Time — full interactive script =========
 - infernal background canvas (audio-reactive)
 - chrono de vie (center) with tierces (0..99, update 10ms)
 - file picker -> AudioContext analyser -> visualizer & background pulses
 - Play / Pause / Stop, volume, random/predict target date
========================================================= */

/* ---------- Canvas Infernal (top background) ---------- */
const infernalCanvas = document.getElementById('infernalCanvas');
const icx = infernalCanvas.getContext('2d');

function resizeInfernal(){
  infernalCanvas.width = window.innerWidth;
  infernalCanvas.height = Math.max(window.innerHeight * 0.62, 360);
}
window.addEventListener('resize', resizeInfernal);
resizeInfernal();

// simple flame-ish field made with layered noise + radial gradients
let tOff = 0;
function drawInfernal(intensity=0){
  const w = infernalCanvas.width, h = infernalCanvas.height;
  icx.clearRect(0,0,w,h);

  // base radial gradient (glow)
  const g = icx.createRadialGradient(w*0.5, h*0.85, 40, w*0.5, h*0.4, Math.max(w,h));
  const glowAlpha = 0.35 + Math.min(0.9, intensity*0.9);
  g.addColorStop(0, `rgba(255,120,30,${0.9*glowAlpha})`);
  g.addColorStop(0.3, `rgba(255,40,40,${0.6*glowAlpha})`);
  g.addColorStop(1, `rgba(0,0,0,0.95)`);
  icx.fillStyle = g;
  icx.fillRect(0,0,w,h);

  // animated flames (simple sine layers)
  const layers = 5;
  for(let L=0; L<layers; L++){
    icx.beginPath();
    const amp = 28 + L*18 + intensity*120;
    const freq = 0.0025 + L*0.0012;
    const yBase = h*0.72 - L*12;
    icx.moveTo(0,h);
    for(let x=0; x<=w; x+=8){
      const noise = Math.sin((x*freq) + (tOff*0.012*(L+1))) * amp * Math.sin((tOff*0.006)+L);
      const y = yBase - Math.abs(noise) - Math.pow((x - w/2)/(w/2), 4) * 120;
      icx.lineTo(x, y);
    }
    icx.lineTo(w,h);
    icx.closePath();
    const hue = 20 + L*8;
    icx.fillStyle = `rgba(${200+(L*10)}, ${40 + L*18}, ${10}, ${0.04 + (0.06*(layers-L)) + intensity*0.12})`;
    icx.fill();
  }

  // subtle sparks
  const sparkCount = Math.floor(6 + intensity*20);
  for(let i=0;i<sparkCount;i++){
    const sx = Math.random()*w;
    const sy = h*0.6 + (Math.random()*h*0.25) * (1 - intensity*0.6);
    const sr = 0.6 + Math.random()*2.4;
    icx.beginPath();
    icx.fillStyle = `rgba(255, ${120+Math.floor(Math.random()*120)}, 20, ${0.06 + Math.random()*0.22})`;
    icx.arc(sx, sy, sr, 0, Math.PI*2);
    icx.fill();
  }

  tOff += 1;
}

/* ---------- Chrono de Vie (center) ---------- */
const chronoLarge = document.getElementById('chronoLarge');
const chronoSub = document.getElementById('chronoSub');
const progressFill = document.getElementById('progressFill');
const birthInput = document.getElementById('birthdate');
const predictBtn = document.getElementById('predictBtn');
const randomBtn = document.getElementById('randomBtn');
const resultEl = document.getElementById('result');

let targetDate = null;
let countdownInterval = null;

/* deterministic hash -> days offset (same as earlier) */
function hashCode(str){
  let h = 2166136261 >>> 0;
  for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h,16777619) >>> 0; }
  return h;
}
function daysOffsetFromBirthString(birthStr){
  const seed = hashCode(birthStr);
  return (seed % 365000) + 1;
}

function setTargetFromBirthString(birthStr){
  const birth = new Date(birthStr + 'T00:00:00');
  if(isNaN(birth)) return false;
  const offsetDays = daysOffsetFromBirthString(birthStr);
  targetDate = new Date(birth.getTime() + offsetDays * 24*60*60*1000);
  resultEl.textContent = `Date prédite : ${targetDate.toDateString()} (offset ${offsetDays} j)`;
  startCountdown(birth);
  return true;
}
function setTargetRandomNow(){
  const today = new Date();
  const seed = Math.floor(Math.random()*1000000);
  const offsetDays = (seed % 365000) + 1;
  targetDate = new Date(today.getTime() + offsetDays * 24*60*60*1000);
  resultEl.textContent = `Date prédite (random): ${targetDate.toDateString()} (offset ${offsetDays} j)`;
  startCountdown(today);
}

function updateCountdownOnce(birthDateForTotal){
  if(!targetDate) return;
  const now = Date.now();
  const diff = targetDate.getTime() - now;
  if(diff <= 0){
    chronoLarge.textContent = `000d : 00h : 00m : 00s : 00`;
    progressFill.style.width = '0%';
    return;
  }
  const tierces = Math.floor((diff % 1000) / 10);
  const totalSec = Math.floor(diff / 1000);
  const s = totalSec % 60;
  const m = Math.floor((totalSec / 60) % 60);
  const h = Math.floor((totalSec / 3600) % 24);
  const d = Math.floor(totalSec / (3600*24));
  chronoLarge.textContent = `${String(d).padStart(3,'0')}d : ${String(h).padStart(2,'0')}h : ${String(m).padStart(2,'0')}m : ${String(s).padStart(2,'0')}s : ${String(tierces).padStart(2,'0')}`;
  // progress percent
  if(birthDateForTotal && !isNaN(birthDateForTotal.getTime())){
    const totalLifeMs = targetDate.getTime() - birthDateForTotal.getTime();
    const elapsed = Date.now() - birthDateForTotal.getTime();
    let pct = Math.max(0, Math.min(100, ((totalLifeMs - elapsed) / totalLifeMs) * 100));
    progressFill.style.width = `${pct}%`;
  }
}

function startCountdown(birthDateForTotal){
  if(countdownInterval) clearInterval(countdownInterval);
  updateCountdownOnce(birthDateForTotal);
  countdownInterval = setInterval(()=> updateCountdownOnce(birthDateForTotal), 100);
}

predictBtn.addEventListener('click', ()=>{
  const v = birthInput.value;
  if(!v){ alert('Veuillez entrer votre date de naissance.'); return; }
  if(!setTargetFromBirthString(v)) alert('Date invalide.');
});
randomBtn.addEventListener('click', ()=> setTargetRandomNow());

/* ---------- Audio: file picker, play/pause/stop, analyser ---------- */
const filePicker = document.getElementById('filePicker');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const volSlider = document.getElementById('volSlider');
const audioCanvas = document.getElementById('audioCanvas') || (() => {
  // create fallback canvas in bottom if not present
  const c = document.createElement('canvas'); c.id='audioCanvas'; document.getElementById('bottom').appendChild(c); return c;
})();
const acx = audioCanvas.getContext('2d');

let audioEl = null;
let audioCtx = null;
let analyser = null;
let dataArray = null;
let bufferLen = 0;
let sourceNode = null;
let rafLoop = null;

function resetAudio(){
  if(rafLoop) cancelAnimationFrame(rafLoop);
  if(audioCtx){ try{ audioCtx.close(); }catch(e){} audioCtx = null; analyser = null; sourceNode = null; }
  if(audioEl){ audioEl.pause(); audioEl.src = ''; audioEl = null; }
  playBtn.disabled = false; pauseBtn.disabled = true; stopBtn.disabled = true;
}

filePicker.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  if(audioEl){ resetAudio(); }
  const url = URL.createObjectURL(file);
  audioEl = new Audio(url);
  audioEl.crossOrigin = 'anonymous';
  audioEl.loop = false;
  audioEl.volume = parseFloat(volSlider.value || 0.7);

  // setup AudioContext & analyser
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  bufferLen = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLen);
  sourceNode = audioCtx.createMediaElementSource(audioEl);
  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  // enable controls
  playBtn.disabled = false; pauseBtn.disabled = true; stopBtn.disabled = true;

  // play immediately
  audioEl.play().then(()=> {
    // resume context for autoplay policy
    if(audioCtx.state === 'suspended') audioCtx.resume();
    pauseBtn.disabled = false; stopBtn.disabled = false; playBtn.disabled = true;
    visualize(); // start visualization loop
  }).catch((err)=>{ console.warn('Play blocked', err); playBtn.disabled = false; pauseBtn.disabled = true; stopBtn.disabled = true; });
});

playBtn.addEventListener('click', async ()=>{
  if(!audioEl) return;
  if(!audioCtx) return;
  if(audioCtx.state === 'suspended') await audioCtx.resume();
  audioEl.play();
  playBtn.disabled = true; pauseBtn.disabled = false; stopBtn.disabled = false;
  visualize();
});
pauseBtn.addEventListener('click', ()=>{
  if(audioEl) { audioEl.pause(); playBtn.disabled = false; pauseBtn.disabled = true; }
});
stopBtn.addEventListener('click', ()=>{
  if(audioEl){ audioEl.pause(); audioEl.currentTime = 0; playBtn.disabled = false; pauseBtn.disabled = true; stopBtn.disabled = true; }
});
volSlider.addEventListener('input', (e)=>{
  if(audioEl) audioEl.volume = parseFloat(e.target.value);
});

/* ---------- Visualizer + background linkage ---------- */
function resizeAudioCanvas(){
  audioCanvas.width = Math.min(window.innerWidth - 40, 1400);
  audioCanvas.height = 160;
}
window.addEventListener('resize', resizeAudioCanvas);
resizeAudioCanvas();

let lastBass = 0;
function visualize(){
  if(!analyser) return;
  rafLoop = requestAnimationFrame(visualize);
  analyser.getByteFrequencyData(dataArray);

  // draw bars
  const w = audioCanvas.width, h = audioCanvas.height;
  acx.clearRect(0,0,w,h);

  const barCount = Math.min(80, dataArray.length);
  const step = Math.floor(dataArray.length / barCount);
  let x = 0;
  const barW = Math.max(2, (w / barCount) - 2);

  // compute simple bands (bass / mid / treble)
  let bassSum = 0, bassCount = 0;
  for(let i=0;i<barCount;i++){
    const v = dataArray[i*step];
    const barH = (v / 255) * h;
    const hue = 10 + (v/255)*40;
    acx.fillStyle = `hsl(${hue} 100% 50%)`;
    acx.fillRect(x, h - barH, barW, barH);
    if(i < Math.floor(barCount*0.15)){ bassSum += v; bassCount++; }
    x += barW + 2;
  }
  const bassAvg = bassCount ? (bassSum / bassCount) / 255 : 0;

  // use bassAvg to pulse the infernal background and title glow
  const intensity = Math.min(1, bassAvg * 2.8 + 0.02); // scale
  drawInfernal(intensity);

  // pulse title glow stronger on beats
  const title = document.querySelector('.title-glow');
  const glowSize = 12 + Math.round(intensity*36);
  title.style.textShadow = `0 0 ${glowSize}px rgba(255,60,60,${0.6 + intensity*0.4}), 0 0 ${glowSize*2}px rgba(255,20,20,${0.18 + intensity*0.3})`;

  // subtle reactive shake of zombie poster on strong bass peaks
  if(bassAvg > 0.42 && lastBass <= 0.42){
    const zp = document.getElementById('zombiePoster');
    zp.animate([{ transform: 'translate(-50%, -1%) scale(1.02)' }, { transform: 'translate(-50%, 0) scale(1)' }], { duration: 360, easing: 'ease-out' });
  }
  lastBass = bassAvg;
}

/* ---------- small init: set a sample birthdate (optional) ---------- */
(function preloadSample(){
  const now = new Date();
  const sY = now.getFullYear() - 25;
  const mm = String(now.getMonth()+1).padStart(2,'0');
  const dd = String(now.getDate()).padStart(2,'0');
  birthInput.value = `${sY}-${mm}-${dd}`;
})();
