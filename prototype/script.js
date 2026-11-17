// Petit exemple d'interaction : à remplacer par la logique du prototype.
const bouton = document.getElementById("bouton-sourire");
const message = document.getElementById("message");

bouton.addEventListener("click", () => {
  message.textContent = "Bonjour ! Prêt·e à prototyper ? 😊";
  message.hidden = false;
});
