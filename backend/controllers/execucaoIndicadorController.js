const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');


const filePath = path.join(__dirname, '../planilhas/banco-de-dados-indicador.xlsx');

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


/*--function salvarDadosExecucaoIndicador(req, res) {
  const Listdados = req.body;

  const dados = { user: req.user.name,
                     ...Listdados
                    };

  let workbook;
  let worksheet;

  // Se o arquivo já existir, lê e adiciona os dados
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const dadosExistentes = XLSX.utils.sheet_to_json(worksheet);
    dadosExistentes.push(dados);

    const novaPlanilha = XLSX.utils.json_to_sheet(dadosExistentes);
    workbook.Sheets[workbook.SheetNames[0]] = novaPlanilha;
  } else {
    // Se o arquivo não existir, cria novo com os dados
    worksheet = XLSX.utils.json_to_sheet([dados]);
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'banco-de-dados-indicador');
  }

  XLSX.writeFile(workbook, filePath);

  res.status(201).json({ mensagem: 'Dados salvos com sucesso!' });
}--*/

function salvarDadosExecucaoIndicador(req, res) {
  const dados = req.body;

  let workbook;
  let worksheet;
  let dadosExistentes = [];

  
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];

    dadosExistentes = XLSX.utils.sheet_to_json(worksheet);

  } else {
    
    workbook = XLSX.utils.book_new();
    
  }

  function momentoRegistro() {
    const dataAtual = new Date();
    
    return `${dataAtual.toLocaleDateString()}, ${dataAtual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  const dataHoraRegistro = momentoRegistro();

  const id = geradorID(dadosExistentes);
  
  const novoDado = { user: req.user.name,
                     dataHoraRegistro,
                     id,
                     ...dados
                    };

  dadosExistentes.push(novoDado);

  
  const novaPlanilha = XLSX.utils.json_to_sheet(dadosExistentes);

  if (workbook.SheetNames.includes('banco-de-dados-indicador')) {
    workbook.Sheets['banco-de-dados-indicador'] = novaPlanilha;

  } else {
    XLSX.utils.book_append_sheet(workbook, novaPlanilha, 'banco-de-dados-indicador')
  }

  /*--console.log('Novo dado salvo', novoDado)--*/

  
  XLSX.writeFile(workbook, filePath);


  res.status(201).json({ mensagem: 'Dados salvos com sucesso!' });
}

module.exports = { salvarDadosExecucaoIndicador };