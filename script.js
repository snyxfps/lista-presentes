import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQQrdrcFtMqljDnmcc0qGpIVdxA63Dq-4",
  authDomain: "lista-presentes-d96fd.firebaseapp.com",
  projectId: "lista-presentes-d96fd",
  storageBucket: "lista-presentes-d96fd.appspot.com",
  messagingSenderId: "883184779255",
  appId: "1:883184779255:web:04dde7967849ad125638f2",
  databaseURL: "https://lista-presentes-d96fd-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
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
