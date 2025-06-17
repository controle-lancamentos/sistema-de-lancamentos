const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const filePath = path.join(__dirname, '../planilhas/banco-de-dados-lamina.xlsx');

function salvarDadosLamina(req, res) {
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
  
  const novoDado = { user: req.user.name,
                     dataHoraRegistro,
                     ...dados
                    };

  dadosExistentes.push(novoDado);

  
  const novaPlanilha = XLSX.utils.json_to_sheet(dadosExistentes);

  if (workbook.SheetNames.includes('banco-de-dados-lamina')) {
    workbook.Sheets['banco-de-dados-lamina'] = novaPlanilha;

  } else {
    XLSX.utils.book_append_sheet(workbook, novaPlanilha, 'banco-de-dados-lamina')
  }

  /*--console.log('Novo dado salvo', novoDado)--*/

  
  XLSX.writeFile(workbook, filePath);


  res.status(201).json({ mensagem: 'Dados salvos com sucesso!' });
}

module.exports = { salvarDadosLamina };