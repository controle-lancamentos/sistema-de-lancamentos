const { addRowToTable, updateExcelRange, deleteExcelRow } = require('../services/graphApi');
const { getAccessToken, getSiteId } = require('../services/graphApi');
const axios = require('axios');

require('dotenv').config({ path: '../.env' });


const fileId = process.env.GRAPH_EXCEL_FILE_ID_PLANEJAMENTO;
const tableName = 'bancoDeDadosPlanejamento';
const hostname = 'santacolombaagropecuaria.sharepoint.com';
const sheetName = 'banco-de-dados-planejamento';
const sitePath = '/sites/arquivos';      

function gerarID(tamanho = 5) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < tamanho; i++) {
    id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return id;
}

function momentoRegistro() {
  const dataAtual = new Date();
  const data = dataAtual.toLocaleDateString();
  const hora = dataAtual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${data}, ${hora}`;
}

function normalizarChave(chave) {
  return chave
    .normalize('NFD')                  // remove acentos
    .replace(/[\u0300-\u036f]/g, '')   // remove sinais diacríticos
    .trim()                             // remove espaços extras
    .toLowerCase();
}


async function filtrarPlanejamento(req, res) {
  
  try {
    const filtros = req.body; // { data, pivo, cultura }
    
    const accessToken = await getAccessToken();
    const siteId = await getSiteId('santacolombaagropecuaria.sharepoint.com', '/sites/arquivos');

    // Busca os dados da tabela no Excel
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${fileId}/workbook/tables/${tableName}/rows`;
    
    const resposta = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const linhas = resposta.data.value; // array de linhas da tabela

    // Cada linha vem como { index, values: [[col1, col2, ...]] }
    // Transformamos em objetos para facilitar filtragem
    const colunas = ['id', 'user','dataHoraRegistro','data','pivo','percentual','cultura','area','observacao']; // mesma ordem que você salvou
    const dados = linhas.map(linha => {
      const obj = {};
      linha.values[0].forEach((valor, i) => {
        obj[colunas[i]] = valor;
      });
      return obj;
    });
    
    // Filtra apenas os campos preenchidos
    let dadosFiltrados = dados;
    if (filtros.data) {
      dadosFiltrados = dadosFiltrados.filter(d => d.data === filtros.data);
    }
    if (filtros.pivo) {
      dadosFiltrados = dadosFiltrados.filter(d => d.pivo == filtros.pivo);
    }
    if (filtros.cultura) {
      dadosFiltrados = dadosFiltrados.filter(d => d.cultura === filtros.cultura);
    }

    res.json({ sucesso: true, dados: dadosFiltrados });

  } catch (erro) {
    console.error('Erro ao filtrar dados:', erro.response?.data || erro.message || erro);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao filtrar dados' });
  }

}

async function salvarDadosPlanejamento(req, res) {

  try {
    const dados = req.body;

    if (!Array.isArray(dados) || dados.length === 0) {
      return res.status(400).json({ sucesso: false, mensagem: 'Nenhum dado recebido' });
    }

    const usuario = req.user?.name || 'Desconhecido';

    for (const linha of dados) {
      // Normaliza todas as chaves do objeto
      const linhaNormalizada = {};
      for (const key in linha) {
        linhaNormalizada[normalizarChave(key)] = linha[key];
      }

      // Monta a linha na ordem da tabela Excel
      const valores = [
        gerarID(),                        // ID
        usuario,                          // Usuário
        momentoRegistro(),                // Data/hora
        linhaNormalizada.data || '',
        linhaNormalizada.pivo || '',
        linhaNormalizada.percentual || '',
        linhaNormalizada.cultura || '',
        linhaNormalizada.area || '',
        linhaNormalizada.observacao || ''
      ];

      console.log('Linha a salvar:', valores);

      await addRowToTable(fileId, tableName, valores);
    }

    res.status(201).json({ sucesso: true, mensagem: 'Dados salvos com sucesso!' });

  } catch (erro) {
    console.error('Erro ao salvar no OneDrive:', erro.response?.data || erro.message || erro);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao salvar dados' });
  }

}


// Função para editar os dados

async function editarPlanejamento(req, res) {

  const dados = req.body; // array de { id, acao, ... }

  try {
    const accessToken = await getAccessToken();
    const siteId = await getSiteId(hostname, sitePath);

    // 1. Buscar todas as linhas da aba
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${fileId}/workbook/worksheets/${sheetName}/usedRange(values=true)`;
    const resposta = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const linhas = resposta.data.values; // matriz de valores (com cabeçalho na linha 0)

    for (const item of dados) {
      // procurar o ID na primeira coluna (coluna A = índice 0)
      const rowIndex = linhas.findIndex((linha, i) => i > 0 && linha[0] === item.id);

      if (rowIndex === -1) continue; // id não encontrado, pula

      if (item.acao === "edit") {
        // Montar a linha atualizada (mantendo user e id originais)
        const linhaExistente = linhas[rowIndex];

        const valoresAtualizados = [
          linhaExistente[0],             // id (coluna A)
          linhaExistente[1],             // user (coluna B)
          momentoRegistro(),             // nova dataHoraRegistro (coluna C)
          item.data || linhaExistente[3],
          item.pivo || linhaExistente[4],
          item.percentual || linhaExistente[5],
          item.cultura || linhaExistente[6],
          item.area || linhaExistente[7],
          item.observacao || linhaExistente[8]
        ];

        // range Excel (linhaIndex começa em 0, então +1 vira linha real, +1 pula cabeçalho)
        const excelRow = rowIndex + 1; 
        await updateExcelRange(fileId, sheetName, `A${excelRow+1}:I${excelRow+1}`, [valoresAtualizados]);

      } else if (item.acao === "delete") {
        // deletar a linha inteira
        const excelRow = rowIndex + 1; 
        await deleteExcelRow(fileId, sheetName, excelRow+1);
      }
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro no editarPlanejamento:", err.response?.data || err.message || err);
    res.status(500).json({ sucesso: false, mensagem: err.message });
  }

}

module.exports = { salvarDadosPlanejamento, filtrarPlanejamento, editarPlanejamento };