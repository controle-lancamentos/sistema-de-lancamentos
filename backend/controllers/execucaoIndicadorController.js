const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');


const filePath = path.join(__dirname, '../planilhas/banco-de-dados-indicador.xlsx');


function buscarUltimaData(req, res) {
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ mensagem : 'Planilha não encontrada.' });
  
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['banco-de-dados-indicador'];
  const dados = XLSX.utils.sheet_to_json(worksheet);

  if (dados.length === 0) {
    return res.status(404).json({ mensagem: 'Nenhum registro encontrado.' });
  }

  const ultimaLinha = dados[dados.length - 1];

  res.json({ ultimaData: ultimaLinha.data });

}


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

module.exports = { salvarDadosExecucaoIndicador, buscarUltimaData };