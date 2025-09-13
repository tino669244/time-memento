function calculateDeathDate() {
  const birthInput = document.getElementById("birthdate").value;
  if (!birthInput) {
    alert("Veuillez entrer votre date de naissance !");
    return;
  }

  const birthDate = new Date(birthInput);
  
  // Aleo atao hoe manome 51 taona default (ohatra)
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(birthDate.getFullYear() + 51);

  document.getElementById("result").innerText =
    `🪦 Votre mort prédite : ${deathDate.toLocaleDateString()}`;

  // Mampandeha compteur
  setInterval(() => updateCountdown(deathDate), 1000);
  // Tierces haingana (isaky ny 100ms)
  setInterval(() => updateTierces(deathDate), 100);
}

function updateCountdown(deathDate) {
  const now = new Date();
  const diff = deathDate - now;

  if (diff <= 0) {
    document.getElementById("result").innerText = "💀 Vous êtes mort.";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;
}

function updateTierces(deathDate) {
  const now = new Date();
  const diff = deathDate - now;
  const tierces = Math.floor((diff % 1000) / 100); // 0–9 (isaky ny 100ms)
  document.getElementById("tierces").innerText = tierces;
}
