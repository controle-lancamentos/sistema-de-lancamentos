const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Caminho da planilha específica
const filePath = path.join(__dirname, '../planilhas/banco-de-dados-horimetro.xlsx');

// Buscar ultimoHorimetro
function buscarUltimoHorimetro(req, res) {
  const {nomePivo} = req.params;

  /*--console.log('Requisição recebida para o pivô: ', nomePivo);--*/

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ mensagem : 'Planilha não encontrada.' });
  
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['banco-de-dados-horimetro'];
  const dados = XLSX.utils.sheet_to_json(worksheet);

  // Filtra pelo nome do pivô e pega o último valor baseado na data ou ordem
  const dadosFiltrados = dados.filter(d => d.pivo === nomePivo);

  /*--console.log('Todos os dados:', dados.map(d => d.pivo));
  console.log('Nome do pivô recebido:', nomePivo);
  console.log('Filtrados:', dadosFiltrados);--*/

  if (dadosFiltrados.length === 0) {
    return res.json({ ultimoHorimetro: '' });
    /*--return res.status(404).json({ mensagem: 'Nenhum registro encontrado para esse pivô.' });--*/

  }
  // Último registro (pode ajustar conforme critério de ordenação)
  const ultimo = dadosFiltrados[dadosFiltrados.length - 1];

  res.json({ ultimoHorimetro: ultimo.horimetro2 });

  /*--console.log(dados);--*/

}


// Gerar id único
function geradorID(dadosExistentes, tamanho = 5) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id;
  let existe;

  do {
    id = '';
    for (let i = 0; i < tamanho; i++) {
      id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    existe = dadosExistentes.some(item => item.id === id);
  } while (existe);

  return id;

}

// Função principal
function salvarDadosHorimetro(req, res) {
  const dados = req.body;

  let workbook;
  let worksheet;
  let dadosExistentes = []; //pararei aqui!!!

  // Se o arquivo já existir, lê e adiciona os dados
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];

    dadosExistentes = XLSX.utils.sheet_to_json(worksheet);
    /*--dadosExistentes.push(dados);--*/

    /*--const novaPlanilha = XLSX.utils.json_to_sheet(dadosExistentes);
    workbook.Sheets[workbook.SheetNames[0]] = novaPlanilha;--*/

  } else {
    // Se o arquivo não existir, cria novo com os dados
    /*--worksheet = XLSX.utils.json_to_sheet([dados]);--*/
    workbook = XLSX.utils.book_new();
    /*--XLSX.utils.book_append_sheet(workbook, worksheet, 'Horímetro');--*/
  }

  // Gera ID único e adiciona ao dado recebido

  const id = geradorID(dadosExistentes);

  function momentoRegistro() {
    const dataAtual = new Date();
    const data = dataAtual.toLocaleDateString();
    const hora = dataAtual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const dataHora = `${data}, ${hora}`;

    return dataHora;
  }

  const dataHoraRegistro = momentoRegistro();

  const novoDado = { user: req.user.name,
                     dataHoraRegistro,
                     id,
                     ...dados
                    };


  // Adiciona aos dados existentes
  dadosExistentes.push(novoDado);

  // Atualiza a planilha
  const novaPlanilha = XLSX.utils.json_to_sheet(dadosExistentes);
  /*--XLSX.utils.book_append_sheet(workbook, novaPlanilha, 'Horímetro');--*/

  if (workbook.SheetNames.includes('banco-de-dados-horimetro')) {
    workbook.Sheets['banco-de-dados-horimetro'] = novaPlanilha;

  } else {
    XLSX.utils.book_append_sheet(workbook, novaPlanilha, 'banco-de-dados-horimetro')
  }

  /*--console.log('Novo dado salvo', novoDado)--*/

  // Salva a planilha no disco
  XLSX.writeFile(workbook, filePath);

  // Retorna sucesso com ID gerado
  res.status(201).json({ mensagem: 'Dados salvos com sucesso!' });
}

module.exports = { salvarDadosHorimetro, buscarUltimoHorimetro };