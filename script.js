import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

// ===== Configuração Firebase =====
const firebaseConfig = {
  apiKey: "AIzaSyCQQrdrcFtMqljDnmcc0qGpIVdxA63Dq-4",
  authDomain: "lista-presentes-d96fd.firebaseapp.com",
  projectId: "lista-presentes-d96fd",
  storageBucket: "lista-presentes-d96fd.appspot.com",
  messagingSenderId: "883184779255",
  appId: "1:883184779255:web:04dde7967849ad125638f2",
  databaseURL: "https://lista-presentes-d96fd-default-rtdb.firebaseio.com"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".reservar-btn");

  // 🔄 Atualiza em tempo real
  onValue(ref(db, 'reservas'), (snapshot) => {
    const reservas = snapshot.val() || {};

    document.querySelectorAll(".item").forEach(item => {
      const id = item.getAttribute("id");
      const statusSpan = item.querySelector(".status span");
      const button = item.querySelector(".reservar-btn");

      if (reservas[id] && reservas[id].reservado) {
        statusSpan.textContent = "Reservado";
        statusSpan.classList.add("reservado");
        item.classList.add("reservado");
        button.textContent = "Desmarcar";
      } else {
        statusSpan.textContent = "Disponível";
        statusSpan.classList.remove("reservado");
        item.classList.remove("reservado");
        button.textContent = "Reservar";
      }
    });
  });

  // 🎁 Clique no botão de reserva
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".item");
      const id = item.getAttribute("id");
      const statusSpan = item.querySelector(".status span");

      const reservado = statusSpan.textContent.trim() !== "Reservado";
      const itemRef = ref(db, 'reservas/' + id);

      set(itemRef, { reservado: reservado }).then(() => {
        if (reservado) {
          alert("✅ Item reservado com sucesso!");
        } else {
          alert("❌ Reserva cancelada!");
        }
      });
    });
  });

  // 🔍 Filtro de itens
  document.getElementById("filtro-todos").addEventListener("click", () => {
    document.querySelectorAll(".item").forEach(item => item.style.display = "flex");
  });

  document.getElementById("filtro-disponiveis").addEventListener("click", () => {
    document.querySelectorAll(".item").forEach(item => {
      const status = item.querySelector(".status span").textContent;
      item.style.display = (status === "Disponível") ? "flex" : "none";
    });
  });

  // ⏳ Contador regressivo
  const evento = new Date("2025-09-20T13:00:00");
  const contador = document.getElementById("contador");

  function atualizarContador() {
    const agora = new Date();
    const diff = evento - agora;

    if (diff <= 0) {
      contador.textContent = "O chá de casa nova já começou!";
      return;
    }

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    contador.textContent = `Faltam ${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }

  setInterval(atualizarContador, 1000);
  atualizarContador();
});
