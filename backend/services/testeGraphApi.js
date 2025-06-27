const { getFileIdByPath, readExcelRange } = require('./graphApi'); // ajuste o caminho se necessário


(async () => {
  try {
    const filePath = 'Publicos/data-storage/estrutura-de-dados/controle-irrigacao/estrutura-dados-horimetro/banco-de-dados-horimetro.xlsx'; // caminho no OneDrive (sem barra inicial)
    const sheetName = 'banco-de-dados-horimetro'; // nome da aba no Excel
    const range = 'A1:L1'; // intervalo a ser lido

    // Buscar ID da planilha
    const fileId = await getFileIdByPath(filePath);
    console.log('ID do arquivo:', fileId);

    // Ler intervalo da planilha
    const dados = await readExcelRange(fileId, sheetName, range);
    console.log('Dados lidos da planilha:', dados);
  } catch (err) {
    console.error('Erro no teste:', err.message);
  }
})();