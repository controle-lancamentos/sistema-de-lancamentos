const axios = require('axios');
const qs = require('qs');

require('dotenv').config({ path: '../.env' });

// Dados do seu app no Azure
const tenantId = process.env.GRAPH_TENANT_ID;
const clientId = process.env.GRAPH_CLIENT_ID;
const clientSecret = process.env.GRAPH_SECRET;

const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const scope = 'https://graph.microsoft.com/.default';

// Dados do sherepoint

const hostname = 'santacolombaagropecuaria.sharepoint.com';
const sitePath = '/sites/arquivos';

// Função para pegar o token
async function getAccessToken() {
  const data = {
    client_id: clientId,
    scope: scope,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  };

  try {
    const response = await axios.post(tokenUrl, qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token:', error.response?.data || error.message);
    throw error;
  }
}

// Obter ID do site pelo hostname e sitePath
async function getSiteId(hostname, sitePath) {
  const token = await getAccessToken();
  const url = `https://graph.microsoft.com/v1.0/sites/${hostname}:${sitePath}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.id;
  } catch (error) {
    console.error('Erro ao obter siteId:', error.response?.data || error.message);
    throw error;
  }
}

// Buscar ID de um arquivo pelo caminho
async function getFileIdByPath(filePath) {
  const token = await getAccessToken();

  const siteID = await getSiteId(hostname, sitePath);
  try {
    const url = `https://graph.microsoft.com/v1.0/sites/${siteID}/drive/root:/${filePath}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.id;
  } catch (error) {
    console.error('Erro ao buscar arquivo:', error.response?.data || error.message);
    throw error;
  }
}

// Ler um intervalo de uma planilha
async function readExcelRange(fileId, sheetName, range) {
  const token = await getAccessToken();

  const siteID = await getSiteId(hostname, sitePath);

  console.log('Id do site: ', siteID);
  
  try {
    const url = `https://graph.microsoft.com/v1.0/sites/${siteID}/drive/items/${fileId}/workbook/worksheets('${sheetName}')/range(address='${range}')`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.values;
  } catch (error) {
    console.error('Erro ao ler Excel:', error.response?.data || error.message);
    throw error;
  }
}

// Adicionar nova linha a uma tabela nomeada
async function addRowToTable(fileId, tableName, rowValues) {
  const token = await getAccessToken();

  const siteID = await getSiteId(hostname, sitePath);

  try {
    const url = `https://graph.microsoft.com/v1.0/sites/${siteID}/drive/items/${fileId}/workbook/tables/${tableName}/rows/add`;
    const response = await axios.post(url, { values: [rowValues] }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar linha:', error.response?.data || error.message);
    throw error;
  }
}

// Atualizar um intervalo de células
async function updateExcelRange(fileId, sheetName, range, values) {
  const token = await getAccessToken();

  const siteID = await getSiteId(hostname, sitePath);
  
  try {
    const url = `https://graph.microsoft.com/v1.0/sites/${siteID}/drive/items/${fileId}/workbook/worksheets('${sheetName}')/range(address='${range}')`;
    await axios.patch(url, { values }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return true;
  } catch (error) {
    console.error('Erro ao atualizar Excel:', error.response?.data || error.message);
    throw error;
  }
}

// Exportar tudo
module.exports = {
  getAccessToken,
  getSiteId,
  getFileIdByPath,
  readExcelRange,
  addRowToTable,
  updateExcelRange,
};