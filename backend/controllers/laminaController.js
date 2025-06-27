const { addRowToTable } = require('../services/graphApi');
/*const { getAccessToken, getSiteId } = require('../services/graphApi');
const axios = require('axios');*/

require('dotenv').config({ path: '../.env' });


const fileId = process.env.GRAPH_EXCEL_FILE_ID_LAMINA;
const tableName = 'bancoDeDadosLamina';
const hostname = 'santacolombaagropecuaria.sharepoint.com';
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


async function salvarDadosLamina(req, res) {
  try {
    const dados = req.body;

    const novoDado = {
      user: req.user.name,
      dataHoraRegistro: momentoRegistro(),
      id: gerarID(),
      ...dados
    };

    
    const linha = [
      novoDado.user,
      novoDado.dataHoraRegistro,
      novoDado.pivo,
      novoDado.lamina
    ];

    await addRowToTable(fileId, tableName, linha, hostname, sitePath);

    res.status(201).json({ mensagem: 'Dados salvos com sucesso!' });

  } catch (erro) {
    console.error('Erro ao salvar no OneDrive:', erro.response?.data || erro.message);
    res.status(500).json({ mensagem: 'Erro ao salvar dados', erro: erro.message });
  }
}

module.exports = { salvarDadosLamina };