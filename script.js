
const SHEET_URL = "https://script.google.com/macros/s/SEU_DEPLOY_AQUI/exec";

async function carregarPresentes() {
    const res = await fetch(SHEET_URL);
    const dados = await res.json();
    const container = document.getElementById("lista");
    container.innerHTML = "";
    dados.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${item.nome}</h3>
            <p>${item.descricao}</p>
            <button ${item.reservado ? "disabled" : ""} onclick="reservarPresente(${index})">
                ${item.reservado ? "Reservado" : "Reservar"}
            </button>
        `;
        container.appendChild(card);
    });
}

async function reservarPresente(index) {
    const res = await fetch(SHEET_URL + "?reservar=" + index, { method: "POST" });
    if (res.ok) {
        document.getElementById("confirmacao").style.display = "block";
        setTimeout(() => {
            document.getElementById("confirmacao").style.display = "none";
        }, 3000);
        carregarPresentes();
    }
}

carregarPresentes();
