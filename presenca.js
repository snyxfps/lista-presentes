import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

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

const form = document.getElementById("form-presenca");
const nomeInput = document.getElementById("nome");
const lista = document.getElementById("lista-presenca");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = nomeInput.value.trim();
  if (!nome) return;

  push(ref(db, "presenca"), {
    nome: nome,
    timestamp: Date.now()
  }).then(() => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#fda7df', '#a1c4fd']
    });
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Presença confirmada!',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  });

  nomeInput.value = "";
});

onValue(ref(db, "presenca"), (snapshot) => {
  const dados = snapshot.val();
  lista.innerHTML = "";

  if (dados) {
    const entradas = Object.entries(dados)
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    entradas.forEach(([key, value], index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span><strong>${index + 1}.</strong> <span id="nome-${key}">${value.nome}</span></span>
        <div class="botoes-presenca">
          <button onclick="editarNome('${key}', '${value.nome}')">✏️ Editar</button>
          <button onclick="removerNome('${key}')">🗑️ Remover</button>
        </div>
      `;
      lista.appendChild(li);
    });
  }
});

window.editarNome = (key, nomeAtual) => {
  Swal.fire({
    title: 'Editar nome',
    input: 'text',
    inputValue: nomeAtual,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#6c5ce7',
    cancelButtonColor: '#d63031'
  }).then((result) => {
    if (result.isConfirmed && result.value.trim() !== "") {
      update(ref(db, `presenca/${key}`), {
        nome: result.value.trim()
      });
    }
  });
};

window.removerNome = (key) => {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Esta ação não pode ser desfeita!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d63031',
    cancelButtonColor: '#b2bec3',
    confirmButtonText: 'Sim, remover!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      remove(ref(db, `presenca/${key}`)).then(() => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Removido com sucesso!',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  });
};