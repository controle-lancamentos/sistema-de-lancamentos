const { addRowToTable } = require('../services/graphApi'); // ajuste o caminho conforme sua estrutura
const { getAccessToken, getSiteId } = require('../services/graphApi');
const axios = require('axios');

require('dotenv').config({ path: '../.env' });

// Configurações fixas – substitua pelos valores reais
const fileId = process.env.GRAPH_EXCEL_FILE_ID_HORIMETRO;         // ID do arquivo no OneDrive
const tableName = 'bancoDeDadosHorimetro';        // Nome da TABELA (não da planilha/aba!)
const hostname = 'santacolombaagropecuaria.sharepoint.com'; // domínio do SharePoint
const sitePath = '/sites/arquivos';        // caminho do site

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

async function buscarUltimoHorimetro(req, res) {
  const { nomePivo } = req.params;

  try {
    const token = await getAccessToken();
    const siteId = await getSiteId(hostname, sitePath);

    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${fileId}/workbook/tables/${tableName}/rows`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const linhas = response.data.value;

    // Cada linha é um array, então precisamos saber a ordem das colunas
    // Supondo que a ordem seja: user, dataHoraRegistro, id, data, pivo, area, percentual, lamina, horimetro1, horimetro2, horas, observacao
    const COL_PIVO = 4;
    const COL_HORIMETRO2 = 9;

    const filtrados = linhas.filter( linha => String(linha.values[0][COL_PIVO]).trim() === String(nomePivo).trim() );

    if (filtrados.length === 0) {
      return res.json({ ultimoHorimetro: 0 });
    }

    const ultimo = filtrados[filtrados.length - 1];
    const horimetro2 = Number(ultimo.values[0][COL_HORIMETRO2]) || 0;

    return res.json({ ultimoHorimetro: horimetro2 });

  } catch (error) {
    console.error('Erro ao buscar último horímetro:', error.response?.data || error.message);
    res.status(500).json({ mensagem: 'Erro ao buscar último horímetro' });
  }
}

async function salvarDadosHorimetro(req, res) {
  try {
    const dados = req.body;

    const novoDado = {
      user: req.user.name, // vindo do middleware auth
      dataHoraRegistro: momentoRegistro(),
      id: gerarID(),
      ...dados
    };

    // Mapeamento na ordem das colunas da tabela no Excel:
    const linha = [
      novoDado.user,
      novoDado.dataHoraRegistro,
      novoDado.id,
      novoDado.data,
      novoDado.pivo,
      novoDado.area,
      novoDado.percentual,
      novoDado.lamina,
      novoDado.horimetro1,
      novoDado.horimetro2,
      novoDado.horas,
      novoDado.observacao
    ];

    await addRowToTable(fileId, tableName, linha, hostname, sitePath);

    res.status(201).json({ mensagem: 'Dados salvos com sucesso!' });

  } catch (erro) {
    console.error('Erro ao salvar no OneDrive:', erro.response?.data || erro.message);
    res.status(500).json({ mensagem: 'Erro ao salvar dados', erro: erro.message });
  }
}

module.exports = { salvarDadosHorimetro, buscarUltimoHorimetro };