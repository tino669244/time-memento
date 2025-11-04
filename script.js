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
setInterval(updateChrono, 10); // 10ms → tierce

/* -------------------------
   Robot info: Date + horloge live
------------------------- */
const dateEl = document.getElementById('currentDate');
const timeEl = document.getElementById('currentTime');

function updateRobotInfo(){
  const now = new Date();
  const dd = String(now.getDate()).padStart(2,'0');
  const mm = String(now.getMonth()+1).padStart(2,'0');
  const yyyy = now.getFullYear();
  dateEl.textContent = `${dd} / ${mm} / ${yyyy}`;

  const hh = String(now.getHours()).padStart(2,'0');
  const min = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  timeEl.textContent = `${hh} : ${min} : ${ss}`;
}
setInterval(updateRobotInfo, 1000);

/* -------------------------
   Audio + fire reactive visualizer
------------------------- */
const audio = document.getElementById('audio');
const audioFile = document.getElementById('audioFile');
const playBtn = document.getElementById('playBtn');
const volRange = document.getElementById('volRange');
const canvas = document.getElementById('visualCanvas');
const ctx = canvas.getContext('2d');

let audioCtx, analyser, source, dataArray, bufferLength;

function setupAudio(){
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
}

audioFile.addEventListener('change', function(e){
  const file = e.target.files[0];
  if(file){
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.load();
  }
});

playBtn.addEventListener('click', function(){
  if(audioCtx==null) setupAudio();
  if(audio.paused) audio.play();
  else audio.pause();
});

volRange.addEventListener('input', function(){
  audio.volume = volRange.value;
});

/* Canvas resize */
function resizeCanvas(){
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* Fire effect */
function drawFire(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  const barWidth = canvas.width / bufferLength;
  for(let i=0;i<bufferLength;i++){
    const value = dataArray[i];
    const percent = value / 255;
    const hue = 20 + percent*30; // fire hue
    const alpha = 0.4 + 0.6*percent;

    ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`;
    const barHeight = percent * canvas.height;
    ctx.fillRect(i*barWidth, canvas.height - barHeight, barWidth, barHeight);
  }

  requestAnimationFrame(drawFire);
}
drawFire();

/* -------------------------
   Navigation menu
------------------------- */
const pages = document.querySelectorAll('.page');
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.addEventListener('click', function(e){
    e.preventDefault();
    const target = this.getAttribute('href').substring(1);
    pages.forEach(p=>p.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});
