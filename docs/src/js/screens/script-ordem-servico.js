const padraoColunas = ['data', 'pivo', 'percentual', 'cultura', 'area', 'observacao']; // <-- seu padrão aqui
let dadosPlanilha = [];

document.getElementById("arquivo").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
        document.getElementById("mensagem").textContent = "Erro: envie apenas arquivos Excel.";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Pega primeira aba
        const primeiraAba = workbook.SheetNames[0];
        const sheet = workbook.Sheets[primeiraAba];

        // Converte para JSON
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (json.length === 0) {
            document.getElementById("mensagem").textContent = "Planilha vazia.";
            return;
        }

        // Validação das colunas
        const colunasArquivo = Object.keys(json[0]);
        const valido = padraoColunas.every(c => colunasArquivo.includes(c));

        if (!valido) {
            document.getElementById("mensagem").textContent = "Formato inválido. Colunas esperadas: " + padraoColunas.join(", ");
            return;
        }

        // Salva os dados e exibe a tabela
        dadosPlanilha = json;
        mostrarTabela(json);
        document.getElementById("btnEnviar").disabled = false;
        document.getElementById("mensagem").textContent = "Arquivo validado!";
    };
    reader.readAsArrayBuffer(file);
});

function mostrarTabela(dados) {
    let html = "<table><thead><tr>";
    Object.keys(dados[0]).forEach(col => {
        html += `<th>${col}</th>`;
    });
    html += "</tr></thead><tbody>";
    dados.forEach(linha => {
        html += "<tr>";
        Object.values(linha).forEach(valor => {
            html += `<td>${valor}</td>`;
        });
        html += "</tr>";
    });
    html += "</tbody></table>";
    document.getElementById("tabelaContainer").innerHTML = html;
}

// Evento do botão de envio
document.getElementById("btnEnviar").addEventListener("click", function() {
    fetch("/api/salvar-dados", { // <-- troque pela sua rota
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosPlanilha)
    })
    .then(res => res.json())
    .then(resp => {
        alert("Dados enviados com sucesso!");
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao enviar os dados.");
    });
});