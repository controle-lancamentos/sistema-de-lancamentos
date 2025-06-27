const { getFileIdByPath, readExcelRange } = require('./graphApi'); // ajuste o caminho se necessário


(async () => {
  try {
    const filePath = 'Publicos/data-storage/estrutura-de-dados/controle-irrigacao/estrutura-de-dados-lamina/banco-de-dados-lamina.xlsx'; // caminho no OneDrive (sem barra inicial)
    const sheetName = 'banco-de-dados-lamina'; // nome da aba no Excel
    const range = 'A1:D1'; // intervalo a ser lido

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