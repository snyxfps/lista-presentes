const SHEET_URL = "https://script.google.com/macros/s/AKfycbwB-0jclkODzYouKmcWvMqHxOT9uzBDtieGUAHtB7LVZDjRJILeagkfEbVI6rUXpAQc/exec";

async function carregarPresentes() {
    try {
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
    } catch (error) {
        console.error("Erro ao carregar presentes:", error);
    }
}

async function reservarPresente(index) {
    try {
        const res = await fetch(SHEET_URL + "?reservar=" + index, { method: "POST" });
        if (res.ok) {
            const confirmacao = document.getElementById("confirmacao");
            confirmacao.style.display = "block";
            setTimeout(() => {
                confirmacao.style.display = "none";
            }, 3000);
            carregarPresentes();
        } else {
            console.error("Erro ao reservar presente:", res.statusText);
        }
    } catch (error) {
        console.error("Erro na requisição de reserva:", error);
    }
}

carregarPresentes();
