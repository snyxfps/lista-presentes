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

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".item");
      const id = item.getAttribute("id");
      const statusSpan = item.querySelector(".status span");

      const reservado = statusSpan.textContent.trim() !== "Reservado";
      const itemRef = ref(db, 'reservas/' + id);

      set(itemRef, { reservado: reservado }).then(() => {
        if (reservado) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fda7df', '#a1c4fd', '#6c5ce7', '#ff7675']
          });

          const titleText = item.querySelector("h3").textContent;
          const isPix = titleText.toUpperCase().includes("PIX");

          if (isPix) {
            Swal.fire({
              title: 'Oba!',
              html: 'Sua cota foi reservada com sucesso! 💖<br><br>Faça o envio para a chave PIX abaixo:<br><br><span style="font-size: 1.1rem; font-weight: bold; background: #eee; padding: 10px; border-radius: 8px; display: inline-block;">duda.santosbritto56@gmail.com</span>',
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#28a745',
              cancelButtonColor: '#6c5ce7',
              confirmButtonText: 'Copiar Chave PIX',
              cancelButtonText: 'Fechar'
            }).then((result) => {
              if (result.isConfirmed) {
                navigator.clipboard.writeText('duda.santosbritto56@gmail.com').then(() => {
                  Swal.fire({
                    title: 'Copiada!',
                    text: 'A chave PIX foi copiada para sua área de transferência.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                  });
                }).catch(err => {
                  console.error('Falha ao copiar: ', err);
                });
              }
            });
          } else {
            Swal.fire({
              title: 'Parabéns!',
              text: 'Você reservou este presente com sucesso! 💖',
              icon: 'success',
              confirmButtonColor: '#6c5ce7',
              confirmButtonText: 'Que incrível!'
            });
          }
        } else {
          Swal.fire({
            title: 'Poxa...',
            text: 'Reserva cancelada!',
            icon: 'info',
            confirmButtonColor: '#d63031',
            confirmButtonText: 'Tudo bem'
          });
        }
      });
    });
  });

  document.getElementById("filtro-todos").addEventListener("click", () => {
    document.querySelectorAll(".item").forEach(item => item.style.display = "flex");
  });

  document.getElementById("filtro-disponiveis").addEventListener("click", () => {
    document.querySelectorAll(".item").forEach(item => {
      const status = item.querySelector(".status span").textContent;
      item.style.display = (status === "Disponível") ? "flex" : "none";
    });
  });

  const evento = new Date("2026-05-16T15:30:00");
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

  const btnTopo = document.getElementById("btn-topo");
  if (btnTopo) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        btnTopo.classList.add("show");
      } else {
        btnTopo.classList.remove("show");
      }
    });
    btnTopo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});