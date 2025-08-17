import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  const db = window.firebaseDatabase;
  const buttons = document.querySelectorAll(".reservar-btn");

  onValue(ref(db, 'reservas'), (snapshot) => {
    const reservas = snapshot.val() || {};

    document.querySelectorAll(".item").forEach(item => {
      const id = item.getAttribute("id");
      const statusSpan = item.querySelector(".status span");
      const button = item.querySelector(".reservar-btn");

      if (reservas[id] && reservas[id].reservado) {
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

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".item");
      const id = item.getAttribute("id");
      const statusSpan = item.querySelector(".status span");
      const reservado = statusSpan.textContent.trim() !== "Reservado";

      const itemRef = ref(db, 'reservas/' + id);
      set(itemRef, {
        reservado: reservado
      });
    });
  });
});
