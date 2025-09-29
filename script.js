function startCountdown() {
  const birthdateInput = document.getElementById("birthdate").value;
  if (!birthdateInput) {
    alert("Veuillez entrer votre date de naissance !");
    return;
  }

  const birthDate = new Date(birthdateInput);
  // Génère une "mort prédite" random entre +40 et +90 ans
  const randomYears = Math.floor(Math.random() * 50) + 40;
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(birthDate.getFullYear() + randomYears);

  // Rafraîchissement du compteur
  setInterval(() => {
    const now = new Date();
    const diff = deathDate - now;

    if (diff <= 0) {
      document.getElementById("countdown").innerHTML = "<h2>☠️ Vous êtes mort ☠️</h2>";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const tierce = Math.floor((diff % 1000) / 10); // centièmes pour speed effect

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
    document.getElementById("tierce").textContent = tierce;
  }, 50);
}
