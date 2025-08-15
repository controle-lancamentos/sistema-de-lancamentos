const secoes = [
    'ordem-servico',
    'ordem-servico-instrucao',
    'ordem-servico-editar'
];

const botoes = [
    { id: 'lancamento', secao: 'ordem-servico' },
    { id: 'instrucao', secao: 'ordem-servico-instrucao' },
    { id: 'editar', secao: 'ordem-servico-editar' }
];

function mostrarSecao(secaoAtiva) {
    // Esconde todas
    secoes.forEach(id => {
        document.getElementById(id).style.display = (id === secaoAtiva) ? 'block' : 'none';
    });

    // Reseta estilos dos botões e aplica no ativo
    botoes.forEach(botao => {
        const btn = document.getElementById(botao.id);
        if (botao.secao === secaoAtiva) {
            btn.style.color = 'white';
            btn.style.backgroundColor = 'red';
        } else {
            btn.style.color = '';
            btn.style.backgroundColor = '';
        }
    });
}

// Adiciona eventos
botoes.forEach(botao => {
    document.getElementById(botao.id).addEventListener('click', () => {
        mostrarSecao(botao.secao);
    });
});

mostrarSecao('ordem-servico');


// Formulário de lançamento

/*const padraoColunas = ['data', 'pivo', 'percentual', 'cultura', 'area', 'observacao']; // <-- seu padrão aqui
let dadosPlanilha = [];

function normalizarTexto(texto) {
    return texto
        .normalize("NFD")              // separa acentos
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .trim()                         // remove espaços extras
        .toLowerCase();                 // tudo minúsculo
}

document.getElementById("arquivo").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!/\.(xlsx|xls)$/i.test(file.name)) {

        document.getElementById('mensagem').style.display = 'block';

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

            document.getElementById('mensagem').style.display = 'block';

            document.getElementById("mensagem").textContent = "Planilha vazia.";
            return;
        }

        // Validação das colunas
        const colunasArquivo = Object.keys(json[0]).map(c => normalizarTexto(c));
        const padraoNormalizado = padraoColunas.map(c => normalizarTexto(c));

        //const valido = padraoNormalizado.every(c => colunasArquivo.includes(c));

        let valido = true;
        for (let i = 0; i < padraoNormalizado.length; i++) {
            if (colunasArquivo[i] !== padraoNormalizado[i]) {
                valido = false;
                break;
            }
        }

        if (!valido) {

            document.getElementById('mensagem').style.display = 'block';

            document.getElementById("mensagem").textContent = "Formato inválido. Colunas esperadas e na ordem: \n" + padraoColunas.join(", ");
            return;
        }

        // Salva os dados e exibe a tabela
        dadosPlanilha = json;
        mostrarTabela(json);
        document.getElementById("btnEnviar").disabled = false;

        document.getElementById('mensagem').style.display = 'block';
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
}*/

const padraoColunas = ['data', 'pivo', 'percentual', 'cultura', 'area', 'observacao'];
let dadosPlanilha = [];

function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

// Valida se colunas batem e estão na ordem
function validarColunas(json) {
    const colunasArquivo = Object.keys(json[0]).map(c => normalizarTexto(c));
    const padraoNormalizado = padraoColunas.map(c => normalizarTexto(c));

    let erros = [];
    padraoNormalizado.forEach((col, i) => {
        if (colunasArquivo[i] !== col) {
            erros.push(`Esperado "${padraoColunas[i]}" na posição ${i + 1}, encontrado "${colunasArquivo[i] || 'vazio'}"`);
        }
    });
    return erros;
}

// Validação linha a linha
function validarDados(json) {
    let erros = [];
    json.forEach((linha, index) => {
        padraoColunas.forEach(col => {
            const valor = linha[col] ?? linha[Object.keys(linha).find(k => normalizarTexto(k) === normalizarTexto(col))];

            // Coluna observacao pode estar vazia sem erro
            if (col !== 'observacao' && (valor === "" || valor === null || valor === undefined)) {
                erros.push({ linha: index + 2, coluna: col, msg: `Vazio.` });
            }
            // Data
            else if (col === 'data' && valor !== "" && valor !== null && valor !== undefined) {
                let dataValida = false;
                let valorFormatado = valor;

                if (typeof valor === "number") {
                    // Converte serial do Excel para data
                    const excelDate = new Date((valor - 25569) * 86400 * 1000);
                    valorFormatado = `${String(excelDate.getDate()).padStart(2, '0')}/${String(excelDate.getMonth() + 1).padStart(2, '0')}/${excelDate.getFullYear()}`;
                }

                if (typeof valorFormatado === "string") {
                    const partes = valorFormatado.split("/");
                    if (partes.length === 3) {
                        const dia = parseInt(partes[0], 10);
                        const mes = parseInt(partes[1], 10) - 1;
                        const ano = parseInt(partes[2], 10);
                        const d = new Date(ano, mes, dia);
                        dataValida = d.getFullYear() === ano && d.getMonth() === mes && d.getDate() === dia;
                    }
                } else if (valorFormatado instanceof Date && !isNaN(valorFormatado)) {
                    dataValida = true;
                }

                if (!dataValida) {
                    erros.push({ linha: index + 2, coluna: col, msg: `Data inválida: "${valor}"` });
                }
            }

            // Percentual
            else if (col === 'percentual' && valor !== "" && valor !== null && valor !== undefined) {
                const num = Number(valor);
                if (!Number.isInteger(num) || num < 1 || num > 100) {
                    erros.push({ linha: index + 2, coluna: col, msg: `Percentual deve ser inteiro entre 1 e 100, encontrado. "${valor}"` });
                }
            }

            // Pivô
            else if (col === 'pivo' && valor !== "" && valor !== null && valor !== undefined) {
                if (!window.tabelaPivoLamina.hasOwnProperty(valor)) {
                    erros.push({ linha: index + 2, coluna: col, msg: `Pivô inválido: "${valor}" esse pivô não existe.` });
                }
            }

            // Cultura
            else if (col === 'cultura' && valor !== "" && valor !== null && valor !== undefined) {
                if (!window.cultura.includes(valor)) {
                    erros.push({ linha: index + 2, coluna: col, msg: `Cultura inválida: "${valor}" não encontrada na lista de culturas.` });
                }
            }

            // Área
            else if (col === 'area' && valor !== "" && valor !== null && valor !== undefined) {
                if (!window.inforArea.includes(valor)) {
                    erros.push({ linha: index + 2, coluna: col, msg: `Área inválida: "${valor}" não encontrada na lista de áreas.` });
                }
            }

        });
    });
    return erros;
}

document.getElementById("arquivo").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!/\.(xlsx|xls)$/i.test(file.name)) {
        mostrarMensagem("Erro: envie apenas arquivos Excel.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const primeiraAba = workbook.SheetNames[0];
        const sheet = workbook.Sheets[primeiraAba];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (json.length === 0) {
            mostrarMensagem("Planilha vazia.");
            return;
        }

        const errosColunas = validarColunas(json);
        if (errosColunas.length > 0) {
            mostrarMensagem("Formato inválido:\n" + errosColunas.join("\n"));
            return;
        }

        const errosDados = validarDados(json);
        if (errosDados.length > 0) {
            mostrarTabela(json, errosDados);
            const mensagens = errosDados.map(e => `Linha ${e.linha}, coluna "${e.coluna}": ${e.msg}`);
            mostrarMensagem("Erros encontrados:\n" + mensagens.join("\n"));
            return;
        }

        // Se passou
        dadosPlanilha = json;
        mostrarTabela(json, []);
        document.getElementById("btnEnviar").disabled = false;
        mostrarMensagem("Arquivo validado com sucesso!");
    };
    reader.readAsArrayBuffer(file);
});

function mostrarMensagem(texto) {
    const msg = document.getElementById("mensagem");
    msg.style.display = 'block';
    msg.textContent = texto;
}

function excelSerialParaData(serial) {
    const excelDate = new Date((serial - 25569) * 86400 * 1000);
    return `${String(excelDate.getDate()).padStart(2, '0')}/${String(excelDate.getMonth() + 1).padStart(2, '0')}/${excelDate.getFullYear()}`;
}

function mostrarTabela(dados, erros) {
    let html = "<table border='1'><thead><tr>";
    Object.keys(dados[0]).forEach(col => html += `<th>${col}</th>`);
    html += "</tr></thead><tbody>";

    dados.forEach((linha, i) => {
        html += "<tr>";
        Object.entries(linha).forEach(([col, valor]) => {
            let displayValor = valor;

            // Converte número serial de data para formato legível
            if (col.toLowerCase() === "data" && typeof valor === "number") {
                displayValor = excelSerialParaData(valor);
            }

            const erro = erros.find(e => e.linha === i + 2 && e.coluna === col);
            html += `<td style="${erro ? 'background-color: #ffb3b3;' : ''}">${displayValor}</td>`;
        });
        html += "</tr>";
    });

    html += "</tbody></table>";
    document.getElementById("tabelaContainer").innerHTML = html;
}


// Evento do botão de envio
document.getElementById("btnEnviar").addEventListener("click", function() {
    const btn = document.getElementById("btnEnviar");

    // Desabilita botão e muda texto
    btn.disabled = true;
    btn.textContent = "Enviando...";

    Swal.fire({
        title: 'Enviando...',
        text: 'Aguarde enquanto os dados são enviados, Não saia dessa página.',
        allowOutsideClick: true,
        /*didOpen: () => {
            Swal.showLoading();
        }*/
    });

    fetch("http://localhost:3000/api/form/planejamentoOs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosPlanilha)
    })
    .then(res => res.json())
    .then(resp => {
        Swal.close();
        if (resp.sucesso) {
            Swal.fire({
                title: 'Enviado!',
                text: 'Dados enviados com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // Limpa tabela
                document.getElementById("tabelaContainer").innerHTML = "";

                // Mensagem
                const msg = document.getElementById("mensagem");
                msg.style.display = 'block';                
                msg.textContent = "Informações enviadas com sucesso!";

                // Habilita input
                const inputArquivo = document.getElementById("arquivo");
                inputArquivo.value = "";
                inputArquivo.disabled = false;

                // Reseta botão
                btn.disabled = true;
                btn.textContent = "Enviar";

                // Limpa dadosPlanilha
                dadosPlanilha = [];
            });
        } else {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao salvar: ' + resp.mensagem,
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(() => {
                btn.disabled = false;
                btn.textContent = "Enviar";
            });
        }
    })
    .catch(err => {
        console.error(err);
        Swal.close();
        Swal.fire({
            title: 'Erro!',
            text: 'Erro ao enviar os dados.',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(() => {
            btn.disabled = false;
            btn.textContent = "Enviar";
        });
    });
});


// Formulário de editar 

window.validacaoPivo('pivo', 'Esse pivô não existe');

window.listaSugestaoSuspensa('cultura', 'sugestoes', window.cultura);

document.getElementById("btnFiltar").addEventListener("click", function() {
    const valorData = document.getElementById("data").value;
    const valorPivo = document.getElementById("pivo").value;
    const valorCultura = document.getElementById("cultura").value;

    // Monta objeto apenas com campos preenchidos
    const filtros = {};
    if (valorData) filtros.data = valorData;
    if (valorPivo) filtros.pivo = valorPivo;
    if (valorCultura) filtros.cultura = valorCultura;

    // Mostra carregando
    Swal.fire({
        title: 'Filtrando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    fetch("http://localhost:3000/api/form/planejamentoOs/filtrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtros)
    })
    .then(res => res.json())
    .then(resp => {
        Swal.close();
        if (resp.sucesso) {
            // Atualiza a tabela com os dados filtrados
            mostrarTabela(resp.dados);

            // Mensagem de sucesso
            const msg = document.getElementById("mensagem");
            msg.style.display = "block";
            msg.textContent = "Filtragem concluída!";
            msg.style.color = "green";
        } else {
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao filtrar: ' + resp.mensagem,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(err => {
        console.error(err);
        Swal.close();
        Swal.fire({
            title: 'Erro!',
            text: 'Erro ao conectar com o servidor.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
});

// Formulário de instruções

window.ativacaoInstrucoes('ver-tabela-exemplo', 'tabela-exemplo');

window.ativacaoInstrucoesRadios('radio', { 'col-data': 'instrucao-col-data', 'col-pivo': 'instrucao-col-pivo', 'col-percentual': 'instrucao-col-percentual', 'col-cultura': 'instrucao-col-cultura', 'col-area': 'instrucao-col-area', 'col-observacao': 'instrucao-col-observacao'  });