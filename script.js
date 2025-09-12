function calculateDeath() {
  const birthInput = document.getElementById("birthdate").value;
  if (!birthInput) {
    document.getElementById("result").innerText = "⚠️ Veuillez entrer une date.";
    return;
  }

  const birthDate = new Date(birthInput);

  // Génération aléatoire entre +30 ans et +100 ans
  const randomYears = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(deathDate.getFullYear() + randomYears);

  // Formatage joli en français
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const deathString = deathDate.toLocaleDateString('fr-FR', options);

  document.getElementById("result").innerText =
    "💀 Vous êtes mort le : " + deathString;
}
