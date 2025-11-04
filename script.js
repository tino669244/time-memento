const chrono = document.getElementById("chrono");
const dateClock = document.getElementById("dateClock");
const miniCalendar = document.getElementById("miniCalendar");

const audioUpload = document.getElementById("audioUpload");
const playBtn = document.getElementById("playBtn");
const volumeControl = document.getElementById("volumeControl");
const canvas = document.getElementById("visualCanvas");
const ctx = canvas.getContext("2d");
let audioContext, analyser, source, dataArray, bufferLength, audio, animationId;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.4;

// ⏳ Chrono de Vie
function startChrono() {
  const birthDate = new Date("2005-04-12"); // ovay raha mila manokana
  setInterval(() => {
    const now = new Date();
    const diff = now - birthDate;
    const years = Math.floor(diff / (1000*60*60*24*365));
    const days = Math.floor((diff / (1000*60*60*24)) % 365);
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    chrono.textContent = `${years}Y ${days}D ${hours}:${minutes}:${seconds}`;
  }, 1000);
}

// 📅 Date + mini calendar
function updateDate() {
  const now = new Date();
  dateClock.textContent = now.toLocaleTimeString();
  miniCalendar.textContent = now.toLocaleDateString();
}
setInterval(updateDate, 1000);

// 🔥 Audio Reactive Fire
function drawFire() {
  animationId = requestAnimationFrame(drawFire);
  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;
  for(let i = 0; i < bufferLength; i++){
    const barHeight = dataArray[i]*1.6;
    const hue = 20 + (barHeight / 2);
    ctx.fillStyle = `hsl(${hue},100%,50%)`;
    ctx.fillRect(x, canvas.height - barHeight/2, barWidth, barHeight);
    x += barWidth + 1;
  }
}

// 🎵 Audio Setup
function setupAudio(file){
  if(audioContext){
    cancelAnimationFrame(animationId);
    audioContext.close();
  }
  audio = new Audio(URL.createObjectURL(file));
  audio.crossOrigin = "anonymous";
  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 256;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  playBtn.onclick = () => {
    if(audio.paused){
      audio.play();
      audioContext.resume();
      drawFire();
      playBtn.textContent = "⏸ Pause";
    }else{
      audio.pause();
      playBtn.textContent = "▶️ Play";
    }
  };
  volumeControl.oninput = () => {
    audio.volume = volumeControl.value;
  };
}

audioUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if(file) setupAudio(file);
});

// 🔛 Start chrono + date
startChrono();
updateDate();
