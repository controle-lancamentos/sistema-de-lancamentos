
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
            erros.push(`Esperado a coluna "${padraoColunas[i]}" na posição ${i + 1}, encontrado "${colunasArquivo[i] || 'vazio'}"`);
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


// Evento do botão de envio, enviar dados
document.getElementById("btnEnviar").addEventListener("click", function() {
    const btn = document.getElementById("btnEnviar");

    // Desabilita botão e muda texto
    btn.disabled = true;
    btn.textContent = "Enviando...";

    Swal.fire({
        title: 'Atenção!',
        text: 'Não saia dessa página até completar o envio, os dados estão sendo enviados.',
        icon: 'warning',
        confirmButtonText: 'OK'
    });

    fetch("https://sistema-de-lancamentos.onrender.com/api/form/planejamentoOs", {
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


window.listaSugestaoSuspensa('cultura', 'sugestoes', window.cultura);


function excelSerialParaData(serial) {
    const excelBaseDate = new Date(1899, 11, 30); // Base do Excel
    return new Date(excelBaseDate.getTime() + serial * 86400000);
}


function formatarDataExcel(serial) {
    if (!serial || isNaN(serial)) return serial;
    const data = excelSerialParaData(serial);
    return data.toLocaleDateString('pt-BR');
}


function mostrarTabelaFiltrada(dados) {
    const corpoTabela = document.getElementById("CorpoTabela");
    const tabelaFiltrada = document.getElementById("tabela-filtrada");
    const mensagemFiltro = document.getElementById("mensagemFiltro");

    if (!dados || dados.length === 0) {
        tabelaFiltrada.style.display = "none";
        mensagemFiltro.style.display = "block";
        mensagemFiltro.textContent = "Nenhuma informação foi encontrada.";
        return;
    }

    tabelaFiltrada.style.display = "table";
    mensagemFiltro.style.display = "none";

    corpoTabela.innerHTML = "";
    dados.forEach(item => {
        const tr = document.createElement("tr");
        tr.dataset.id = item.id; // <-- adiciona o ID único do registro
        tr.innerHTML = `
            <td>${formatarDataExcel(item.data)}</td>
            <td>${item.pivo}</td>
            <td>${item.percentual}</td>
            <td>${item.cultura}</td>
            <td>${item.area}</td>
            <td>${item.observacao}</td>
            <td><button class="editar">Editar</button></td>
            <td><button class="excluir">Excluir</button></td>
        `;
        corpoTabela.appendChild(tr);
    });
}

// Filtro das informações
document.getElementById("btnFiltar").addEventListener("click", function() {
    const valorData = document.getElementById("data").value;
    const valorPivo = document.getElementById("pivo").value;
    const valorCultura = document.getElementById("cultura").value;
    const tabelaFiltro = document.getElementById('tabela-filtro');

    // Monta objeto apenas com campos preenchidos
    const filtros = {};
    if (valorData) filtros.data = valorData;
    if (valorPivo) filtros.pivo = valorPivo;
    if (valorCultura) filtros.cultura = valorCultura;

    // Mostra carregando
    Swal.fire({
        title: 'Filtrando...',
        allowOutsideClick: false,
        target: document.body, // garante que fica no body
        didOpen: () => {
            Swal.showLoading();
            const swalContainer = document.querySelector('.swal2-container');
            swalContainer.style.position = 'absolute';
            swalContainer.style.top = '0';
            swalContainer.style.left = '0';
            swalContainer.style.zIndex = '9999'; // acima de tudo
        }
    });

    fetch("https://sistema-de-lancamentos.onrender.com/api/form/planejamentoOs/filtrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtros)
    })
    .then(res => res.json())
    .then(resp => {
        Swal.close();
        if (resp.sucesso) {
            // Atualiza a tabela com os dados filtrados
            mostrarTabelaFiltrada(resp.dados); // <<< trocou aqui

            tabelaFiltro.style.display = "flex";
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

// Editar e Excluir

document.getElementById("CorpoTabela").addEventListener("click", function (e) {
    const tr = e.target.closest("tr");
    if (!tr) return;

    // ===== EDITAR =====
    if (e.target.classList.contains("editar")) {
        const tds = tr.querySelectorAll("td");

        // **Declara dadosLinha aqui**
        const dadosLinha = {
            data: tds[0].textContent,
            pivo: tds[1].textContent,
            percentual: tds[2].textContent,
            cultura: tds[3].textContent,
            area: tds[4].textContent,
            observacao: tds[5].textContent
        };

    Swal.fire({
        title: 'Editar registro',
        html: `
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 8px 10px; align-items: center; padding: 0px 20px 0px 0px">
            <label>Data</label>
            <input id="swalData" class="swal2-input" value="${dadosLinha.data}">

            <label>Pivô</label>
            <input id="swalPivo" class="swal2-input" value="${dadosLinha.pivo}">

            <label>Percentual</label>
            <input id="swalPercentual" class="swal2-input" value="${dadosLinha.percentual}">

            <label>Cultura</label>
            <input id="swalCultura" class="swal2-input" value="${dadosLinha.cultura}">

            <label>Área</label>
            <input id="swalArea" class="swal2-input" value="${dadosLinha.area}">

            <label>Observação</label>
            <input id="swalObs" class="swal2-input" value="${dadosLinha.observacao}">
        </div>
        `,
        confirmButtonText: 'Salvar',
        showCancelButton: true,
        preConfirm: () => ({
            data: document.getElementById('swalData').value,
            pivo: document.getElementById('swalPivo').value,
            percentual: document.getElementById('swalPercentual').value,
            cultura: document.getElementById('swalCultura').value,
            area: document.getElementById('swalArea').value,
            observacao: document.getElementById('swalObs').value
        })
        }).then((result) => {
            if (result.isConfirmed) {
                tds[0].textContent = result.value.data;
                tds[1].textContent = result.value.pivo;
                tds[2].textContent = result.value.percentual;
                tds[3].textContent = result.value.cultura;
                tds[4].textContent = result.value.area;
                tds[5].textContent = result.value.observacao;

                tr.dataset.acao = "edit"; // Marca para enviar ao backend
                Swal.fire('Sucesso!', 'Registro atualizado localmente.', 'success');
            }
        });
    }

    // ===== EXCLUIR =====
    if (e.target.classList.contains("excluir")) {
        Swal.fire({
            title: 'Tem certeza?',
            text: "O registro será removido!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                tr.dataset.acao = "delete";
                tr.style.display = "none";
                Swal.fire('Marcado para exclusão!', 'Será removido ao enviar correções.', 'success');
            }
        });
    }
});

// Enviando dados corrigidos

document.getElementById("btnCorrecao").addEventListener("click", function () {
    const linhas = document.querySelectorAll("#CorpoTabela tr");
    const payload = [];

    linhas.forEach(tr => {
        const id = tr.dataset.id;
        if (!id) return;

        const tds = tr.querySelectorAll("td");

        if (tr.dataset.acao === "delete") {
            payload.push({ id, acao: "delete" });
        } 
        else if (tr.dataset.acao === "edit") {
            payload.push({
                id,
                acao: "edit",
                data: tds[0].textContent,
                pivo: tds[1].textContent,
                percentual: tds[2].textContent,
                cultura: tds[3].textContent,
                area: tds[4].textContent,
                observacao: tds[5].textContent
            });
        }
    });

    if (payload.length === 0) {
        Swal.fire('Atenção', 'Nenhuma alteração para enviar.', 'info');
        return;
    }

    Swal.fire({
        title: 'Enviando alterações...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    fetch("https://sistema-de-lancamentos.onrender.com/api/form/planejamentoOs/editar", {
        method: "PUT", // Troque para PUT se o backend esperar PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(r => r.json())
        .then(res => {
            Swal.close();
            Swal.fire("Sucesso!", "Alterações enviadas com sucesso.", "success");
        })
        .catch(err => {
            Swal.close();
            Swal.fire("Erro!", "Falha ao enviar alterações.", "error");
        });
});

/*// auqi

document.getElementById("btnCorrecao").addEventListener("click", function() {
    const corpoTabela = document.getElementById("CorpoTabela");
    const linhas = corpoTabela.querySelectorAll("tr");

    if (linhas.length === 0) {
        Swal.fire('Atenção', 'Não há dados para enviar.', 'info');
        return;
    }

    // Monta array com todos os dados da tabela
    const dadosParaEnvio = Array.from(linhas).map(tr => ({
        id: tr.dataset.id,             // pega o ID único do registro
        data: tr.children[0].textContent,
        pivo: tr.children[1].textContent,
        percentual: tr.children[2].textContent,
        cultura: tr.children[3].textContent,
        area: tr.children[4].textContent,
        observacao: tr.children[5].textContent
    }));

    // Mostra carregando
    Swal.fire({
        title: 'Enviando correções...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    fetch("http://localhost:3000/api/form/planejamentoOs/editar", {
        method: "PUT", // ou POST dependendo do seu endpoint
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnvio)
    })
    .then(res => res.json())
    .then(resp => {
        Swal.close();
        if(resp.sucesso) {
            Swal.fire('Sucesso!', 'Dados corrigidos enviados para o banco.', 'success');
        } else {
            Swal.fire('Erro!', resp.mensagem, 'error');
        }
    })
    .catch(err => {
        console.error(err);
        Swal.close();
        Swal.fire('Erro!', 'Não foi possível conectar ao servidor.', 'error');
    });
});*/


// Formulário de instruções

window.ativacaoInstrucoes('ver-tabela-exemplo', 'tabela-exemplo');

window.ativacaoInstrucoesRadios('radio', { 'col-data': 'instrucao-col-data', 'col-pivo': 'instrucao-col-pivo', 'col-percentual': 'instrucao-col-percentual', 'col-cultura': 'instrucao-col-cultura', 'col-area': 'instrucao-col-area', 'col-observacao': 'instrucao-col-observacao'  });