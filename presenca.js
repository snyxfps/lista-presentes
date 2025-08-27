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
  const novoNome = prompt("Editar nome:", nomeAtual);
  if (novoNome && novoNome.trim() !== "") {
    update(ref(db, `presenca/${key}`), {
      nome: novoNome.trim()
    });
  }
};

window.removerNome = (key) => {
  if (confirm("Tem certeza que deseja remover este nome da lista?")) {
    remove(ref(db, `presenca/${key}`));
  }
};