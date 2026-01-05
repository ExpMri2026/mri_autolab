// ============================
// VARIÁVEL GLOBAL (obrigatória)
// ============================
let dadosOriginais = [];

// ============================
// CARREGA CSV AO ABRIR A PÁGINA
// ============================
window.addEventListener("DOMContentLoaded", async function () {
    try {
        const url = "https://raw.githubusercontent.com/ExpMri2026/mri_autolab/refs/heads/main/csv/transp.csv";

        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Erro ao baixar CSV");

        const csvTexto = await resposta.text();
        const dados = CSVToArray(csvTexto);

        if (!dados || !Array.isArray(dados) || dados.length === 0) {
            alert("Erro: CSV vazio.");
            return;
        }

        dadosOriginais = dados;
        exibirTabela(dadosOriginais);

        document.getElementById("contadorTotal").textContent =
            `Total Cadastrado: ${dados.length - 1}`;

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Falha ao carregar o CSV.");
    }
});

// ============================
// CSV → ARRAY
// ============================
function CSVToArray(texto) {
    return texto
        .trim()
        .split(/\r?\n/)
        .map(linha => linha.split(";"));
}

// ============================
// EXIBE TABELA
// ============================
function exibirTabela(dados) {
    const table = document.getElementById("tabela");
    table.innerHTML = "";

    if (!dados || dados.length <= 1) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = "Nenhum dado encontrado.";
        td.colSpan = 5;
        tr.appendChild(td);
        table.appendChild(tr);
        return;
    }

    // Cabeçalho (5 primeiras colunas)
    const headerRow = document.createElement("tr");
    dados[0].slice(0, 5).forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Linhas
    const linhas = dados.slice(1);
    linhas.forEach(linha => {
        const tr = document.createElement("tr");

        linha.slice(0, 5).forEach((celula, i) => {
            const td = document.createElement("td");

            if (i === 2 && celula && celula.toUpperCase() === "SITE" && linha[5]) {
                const link = document.createElement("a");
                link.href = linha[5];
                link.textContent = celula;
                link.target = "_blank";
                link.className = "site-link";
                td.appendChild(link);
            } else {
                td.textContent = celula || "";
            }

            tr.appendChild(td);
        });

        table.appendChild(tr);
    });

    table.style.display = "table";
    document.getElementById("contador").textContent =
        `Total de linhas: ${linhas.length}`;
}

// ============================
// FILTRO — TRANSPORTADORA (2ª coluna)
// ============================
function filtrarTransportadora(valor) {
    const termo = valor.toLowerCase().trim();

    if (!termo) {
        exibirTabela(dadosOriginais);
        document.getElementById("contador").textContent =
            `Total de linhas: ${dadosOriginais.length - 1}`;
        return;
    }

    const filtrados = dadosOriginais.filter((linha, index) => {
        if (index === 0) return true; // mantém cabeçalho
        return linha[1] && linha[1].toLowerCase().includes(termo);
    });

    exibirTabela(filtrados);
}

