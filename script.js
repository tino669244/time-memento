function calculateDeathDate() {
  const birthdateInput = document.getElementById("birthdate").value;
  if (!birthdateInput) {
    alert("Veuillez entrer votre date de naissance !");
    return;
  }

  const birthDate = new Date(birthdateInput);

  // 👉 On fixe la "mort prédite" à 51 ans après la naissance
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(deathDate.getFullYear() + 51);

  document.getElementById("result").innerHTML = 
    `⚰️ Vous êtes destiné à mourir le <strong>${deathDate.toLocaleDateString()}</strong>`;

  // Déclenche le compteur
  startCountdown(deathDate);
}

function startCountdown(deathDate) {
  setInterval(() => {
    const now = new Date();
    const diff = deathDate - now;

    if (diff <= 0) {
      document.getElementById("countdown").innerHTML = "<h2>💀 Votre temps est écoulé.</h2>";
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
  }, 1000);
}
