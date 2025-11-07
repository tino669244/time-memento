/* Ruine Time — main JS
   Requirements: robot.png, zombie.png, horloge.png, gears.png in same folder
*/

const $ = id => document.getElementById(id);

/* ---------- helpers ---------- */
const clamp = (v,min,max)=> Math.max(min, Math.min(max, v));

/* ---------- bg infernal canvas ---------- */
const bgCanvas = $('bgCanvas'), bgCtx = bgCanvas.getContext('2d');
function resizeBG(){ bgCanvas.width = innerWidth; bgCanvas.height = Math.max(innerHeight * 0.62, 360); }
window.addEventListener('resize', ()=>{ resizeBG(); resizeHands(); resizeAudioViz(); });
resizeBG();

let flameTime = 0;
function drawInfernal(intensity=0){
  const w = bgCanvas.width, h = bgCanvas.height;
  bgCtx.clearRect(0,0,w,h);

  const grd = bgCtx.createRadialGradient(w/2, h*0.85, 40, w/2, h*0.35, Math.max(w,h));
  grd.addColorStop(0, `rgba(255,140,40,${0.9*clamp(0.3 + intensity*0.7,0,1)})`);
  grd.addColorStop(0.35, `rgba(255,50,50,${0.55*clamp(0.6 + intensity*0.7,0,1)})`);
  grd.addColorStop(1, `rgba(0,0,0,0.95)`);
  bgCtx.fillStyle = grd; bgCtx.fillRect(0,0,w,h);

  const layers = 5;
  for(let L=0; L<layers; L++){
    bgCtx.beginPath();
    const amp = 18 + L*12 + intensity*120;
    const freq = 0.002 + L*0.0012;
    const baseY = h*0.72 - L*10;
    bgCtx.moveTo(0,h);
    for(let x=0;x<=w;x+=8){
      const n = Math.sin((x*freq) + (flameTime*0.012*(L+1))) * amp * Math.sin((flameTime*0.006)+L);
      const y = baseY - Math.abs(n) - Math.pow((x - w/2)/(w/2), 4) * 120;
      bgCtx.lineTo(x, y);
    }
    bgCtx.lineTo(w,h); bgCtx.closePath();
    bgCtx.fillStyle = `rgba(${200 + L*10}, ${40 + L*18}, 12, ${0.04 + (0.06*(layers-L)) + intensity*0.12})`;
    bgCtx.fill();
  }

  const sparks = Math.floor(4 + intensity*18);
  for(let i=0;i<sparks;i++){
    const sx = Math.random()*w;
    const sy = h*0.6 + (Math.random()*h*0.25)*(1 - intensity*0.6);
    const sr = 0.5 + Math.random()*2.2;
    bgCtx.beginPath(); bgCtx.fillStyle = `rgba(255, ${120+Math.floor(Math.random()*120)}, 20, ${0.06 + Math.random()*0.2})`;
    bgCtx.arc(sx, sy, sr, 0, Math.PI*2); bgCtx.fill();
  }

  flameTime++;
}
(function infernalLoop(){ requestAnimationFrame(infernalLoop); drawInfernal( (Math.sin(Date.now()*0.0009)+1)/2 * 0.18 ); })();

/* ---------- horloge hands ---------- */
const horlogeImg = $('horlogeImg');
const handsCanvas = $('handsCanvas');
const handsCtx = handsCanvas.getContext('2d');

function resizeHands(){
  const rect = horlogeImg.getBoundingClientRect();
  handsCanvas.style.width = rect.width + 'px';
  handsCanvas.style.height = rect.height + 'px';
  handsCanvas.width = Math.floor(rect.width * devicePixelRatio);
  handsCanvas.height = Math.floor(rect.height * devicePixelRatio);
  handsCtx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
window.addEventListener('load', ()=>{ resizeHands(); setTimeout(resizeHands,200); });
window.addEventListener('resize', resizeHands);

let lastSecond = -1;
function drawHands(){
  if(!horlogeImg.complete){ requestAnimationFrame(drawHands); return; }
  const w = handsCanvas.width / devicePixelRatio;
  const h = handsCanvas.height / devicePixelRatio;
  handsCtx.clearRect(0,0,w,h);

  const cx = w/2, cy = h/2;
  const radius = Math.min(w,h)/2 * 0.88;

  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();

  const secAngle = ((seconds + ms/1000)/60)*Math.PI*2 - Math.PI/2;
  const minAngle = ((minutes + seconds/60)/60)*Math.PI*2 - Math.PI/2;
  const hourAngle = ((hours + minutes/60)/12)*Math.PI*2 - Math.PI/2;

  // hour
  handsCtx.beginPath(); handsCtx.lineCap='round';
  handsCtx.strokeStyle = 'rgba(255,180,180,0.95)'; handsCtx.lineWidth = Math.max(3, radius*0.08);
  handsCtx.moveTo(cx,cy); handsCtx.lineTo(cx + Math.cos(hourAngle)*radius*0.45, cy + Math.sin(hourAngle)*radius*0.45); handsCtx.stroke();

  // minute
  handsCtx.beginPath(); handsCtx.strokeStyle='rgba(255,120,120,0.98)'; handsCtx.lineWidth=Math.max(2, radius*0.056);
  handsCtx.moveTo(cx,cy); handsCtx.lineTo(cx + Math.cos(minAngle)*radius*0.65, cy + Math.sin(minAngle)*radius*0.65); handsCtx.stroke();

  // second
  handsCtx.beginPath(); handsCtx.strokeStyle='rgba(255,60,60,1)'; handsCtx.lineWidth=Math.max(1.2, radius*0.028);
  handsCtx.moveTo(cx - Math.cos(secAngle)*radius*0.06, cy - Math.sin(secAngle)*radius*0.06); handsCtx.lineTo(cx + Math.cos(secAngle)*radius*0.82, cy + Math.sin(secAngle)*radius*0.82); handsCtx.stroke();

  // center dot
  handsCtx.beginPath(); handsCtx.fillStyle='rgba(255,200,200,1)'; handsCtx.arc(cx,cy, Math.max(2, radius*0.03),0,Math.PI*2); handsCtx.fill();

  // update digital
  if(window._targetDate){
    const diff = window._targetDate.getTime() - Date.now();
    if(diff <= 0){ $('digitalClock').textContent = '000d : 00h : 00m : 00s : 00'; }
    else {
      const tierces = Math.floor((diff%1000)/10);
      const tot = Math.floor(diff/1000);
      const s = tot%60, m = Math.floor((tot/60)%60), h2 = Math.floor((tot/3600)%24), d = Math.floor(tot/(3600*24));
      $('digitalClock').textContent = `${String(d).padStart(3,'0')}d : ${String(h2).padStart(2,'0')}h : ${String(m).padStart(2,'0')}m : ${String(s).padStart(2,'0')}s : ${String(tierces).padStart(2,'0')}`;
    }
  } else {
    const now2 = new Date();
    $('digitalClock').textContent = `${String(now2.getDate()).padStart(3,'0')}d : ${String(now2.getHours()).padStart(2,'0')}h : ${String(now2.getMinutes()).padStart(2,'0')}m : ${String(now2.getSeconds()).padStart(2,'0')}s : ${String(Math.floor(now2.getMilliseconds()/10)).padStart(2,'0')}`;
  }

  if(seconds !== lastSecond){ lastSecond = seconds; if(window._tickSound){ try{ window._tickSound.currentTime=0; window._tickSound.play(); }catch(e){} } }

  requestAnimationFrame(drawHands);
}
drawHands();

// slow image rotation
let imgRotation = 0;
(function rotateImageLoop(){ imgRotation += 0.02; horlogeImg.style.transform = `rotate(${imgRotation}deg)`; requestAnimationFrame(rotateImageLoop); })();

// spin gears
(function spinGears(){
  const gA = $('gearA'), gB = $('gearB'), gC = $('gearC');
  let a = 0;
  function loop(){ a += 0.45; if(gA) gA.style.transform = `rotate(${a}deg)`; if(gB) gB.style.transform = `rotate(${-a*0.78}deg)`; if(gC) gC.style.transform = `rotate(${a*1.2}deg)`; requestAnimationFrame(loop); }
  loop();
})();

// tick sound (optional)
try{ window._tickSound = new Audio('tick.mp3'); window._tickSound.volume = 0.45; }catch(e){ window._tickSound = null; }

/* Predict / Random */
function hashCode(str){ let h = 2166136261>>>0; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h,16777619)>>>0; } return h; }
function daysOffsetFromBirthString(birthStr){ const seed = hashCode(birthStr); return (seed % 365000) + 1; }
function setTargetFromBirthString(birthStr){
  const b = new Date(birthStr + 'T00:00:00'); if(isNaN(b)) return false;
  const offset = daysOffsetFromBirthString(birthStr);
  window._targetDate = new Date(b.getTime() + offset * 24*60*60*1000);
  $('result').textContent = `Date prédite : ${window._targetDate.toDateString()} (offset ${offset} j)`;
  return true;
}
$('predictBtn').addEventListener('click', ()=>{ const v = $('birthdate').value; if(!v){ alert('Veuillez entrer une date'); return; } if(!setTargetFromBirthString(v)) alert('Date invalide'); });
$('randomBtn').addEventListener('click', ()=>{ const seed = Math.floor(Math.random()*1000000); const offset = (seed % 365000)+1; window._targetDate = new Date(Date.now() + offset*24*60*60*1000); $('result').textContent = `Date prédite (random): ${window._targetDate.toDateString()}`; });

/* Audio visualizer */
const filePicker = $('filePicker'), playBtn = $('playBtn'), pauseBtn = $('pauseBtn'), vol = $('vol'), audioViz = $('audioViz');
const vctx = audioViz.getContext('2d');
let audioEl=null, audioCtx=null, analyser=null, dataArr=null, bufferLen=0, source=null, raf=null;

function resizeAudioViz(){ audioViz.width = Math.min(window.innerWidth - 40, 1400); audioViz.height = 140; }
resizeAudioViz();

filePicker.addEventListener('change', (e)=>{
  const f = e.target.files[0]; if(!f) return;
  if(audioEl){ try{ audioEl.pause(); }catch(e){} audioEl=null; if(audioCtx) try{ audioCtx.close(); }catch(e){} audioCtx=null; analyser=null; }
  const url = URL.createObjectURL(f);
  audioEl = new Audio(url); audioEl.crossOrigin='anonymous'; audioEl.volume = parseFloat(vol.value || 0.7);
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser(); analyser.fftSize = 1024; bufferLen = analyser.frequencyBinCount; dataArr = new Uint8Array(bufferLen);
  source = audioCtx.createMediaElementSource(audioEl); source.connect(analyser); analyser.connect(audioCtx.destination);

  playBtn.disabled = false; pauseBtn.disabled = true;
  playBtn.onclick = async ()=>{
    if(audioCtx.state === 'suspended') await audioCtx.resume();
    audioEl.play(); playBtn.disabled = true; pauseBtn.disabled = false; visualLoop();
  };
  pauseBtn.onclick = ()=>{ if(audioEl){ audioEl.pause(); playBtn.disabled=false; pauseBtn.disabled=true; } };
  vol.addEventListener('input', ()=>{ if(audioEl) audioEl.volume = parseFloat(vol.value); });

  audioEl.play().then(()=>{ playBtn.disabled = true; pauseBtn.disabled = false; visualLoop(); }).catch(()=>{ /* autoplay blocked */ });
});

function visualLoop(){
  if(!analyser) return;
  analyser.getByteFrequencyData(dataArr);

  const w = audioViz.width, h = audioViz.height;
  vctx.clearRect(0,0,w,h);
  const barCount = Math.min(80, bufferLen);
  const step = Math.floor(bufferLen / barCount);
  let x=0, bassSum=0, bassCount=0, barW = Math.max(2, (w/barCount)-2);
  for(let i=0;i<barCount;i++){
    const v = dataArr[i*step];
    const barH = (v/255)*h;
    const hue = 20 + (v/255)*40;
    vctx.fillStyle = `hsl(${hue} 100% 50%)`;
    vctx.fillRect(x, h - barH, barW, barH);
    if(i < Math.floor(barCount*0.12)){ bassSum += v; bassCount++; }
    x += barW + 2;
  }
  const bassAvg = bassCount ? (bassSum / bassCount) / 255 : 0;
  const intensity = clamp(bassAvg*2.2 + 0.02, 0, 1);
  drawInfernal(intensity);
  const title = document.querySelector('.title'); if(title){ const glow = 12 + Math.round(intensity*36); title.style.textShadow = `0 0 ${glow}px rgba(255,60,60,${0.6 + intensity*0.4}), 0 0 ${glow*2}px rgba(255,20,20,${0.18 + intensity*0.3})`; }
  raf = requestAnimationFrame(visualLoop);
}

/* cleanup */
window.addEventListener('beforeunload', ()=>{ if(raf) cancelAnimationFrame(raf); if(audioCtx) try{ audioCtx.close(); }catch(e){} });
