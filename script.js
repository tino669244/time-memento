let countdownInterval;

function calculateDeathDate() {
  const birthInput = document.getElementById("birthdate").value;
  const resultDiv = document.getElementById("result");
  const countdownDiv = document.getElementById("countdown");

  if (!birthInput) {
    resultDiv.innerHTML = "⚠️ Veuillez entrer une date valide.";
    countdownDiv.innerHTML = "";
    return;
  }

  // Effacer countdown teo aloha raha nisy
  clearInterval(countdownInterval);

  // Convertir la date de naissance
  const birthDate = new Date(birthInput);

  // 51 ans après
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(deathDate.getFullYear() + 51);

  // Formatage JJ/MM/AAAA
  const day = String(deathDate.getDate()).padStart(2, '0');
  const month = String(deathDate.getMonth() + 1).padStart(2, '0');
  const year = deathDate.getFullYear();

  resultDiv.innerHTML = `☠️ Vous êtes mort le : <span style="color:#ff5555">${day}/${month}/${year}</span>`;

  // Mampandeha ny compte à rebours
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = deathDate.getTime() - now;

    if (distance <= 0) {
      clearInterval(countdownInterval);
      countdownDiv.innerHTML = "💀 Votre temps est écoulé !";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownDiv.innerHTML = `⏳ Temps restant : ${days}j ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}
