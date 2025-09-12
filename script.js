const birthdateInput = document.getElementById("birthdate");
const result = document.getElementById("result");
const lived = document.getElementById("lived");
const death = document.getElementById("death");

function updateTime() {
  const birthdate = new Date(birthdateInput.value);
  if (isNaN(birthdate)) return;

  const now = new Date();
  const diff = now - birthdate;

  if (diff <= 0) return;

  // Calcul du temps vécu
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = (days / 365.25).toFixed(8);

  lived.innerHTML = `${years} ans (${days} jours, ${hours} heures, ${minutes} minutes, ${seconds} secondes)`;

  // Date et heure du "décès" = maintenant
  death.innerHTML = now.toLocaleString();

  result.style.display = "block";
}

birthdateInput.addEventListener("input", () => {
  setInterval(updateTime, 1000);
});
