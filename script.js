const SHEET_URL = "https://script.google.com/macros/s/AKfycbwr7sgMiVnxczcuOFZeoxuSgg91HvtzEAhF7fcvWDeDmuNXEDpx7uGV-Cqmgw_ZYzPu/exec";

async function carregarPresentes() {
    try {
        const res = await fetch(SHEET_URL);
        const dados = await res.json();

        // Verifica se houve erro no retorno
        if (dados.erro) {
            console.error("Erro do servidor:", dados.erro);
            return;
        }

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
        const texto = await res.text();
        console.log("Resposta do servidor:", texto);

        if (res.ok && texto === "OK") {
            const confirmacao = document.getElementById("confirmacao");
            confirmacao.style.display = "block";
            setTimeout(() => {
                confirmacao.style.display = "none";
            }, 3000);
            carregarPresentes();
        } else {
            console.error("Erro ao reservar presente:", texto);
        }
    } catch (error) {
        console.error("Erro na requisição de reserva:", error);
    }
}

carregarPresentes();
