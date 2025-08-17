document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".reservar-btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".item");
      const statusSpan = item.querySelector(".status span");

      if (statusSpan.textContent.trim() === "Disponível") {
        statusSpan.textContent = "Reservado";
        item.classList.add("reservado");
        button.textContent = "Desmarcar";
      } else {
        statusSpan.textContent = "Disponível";
        item.classList.remove("reservado");
        button.textContent = "Reservar";
      }
    });
  });
});