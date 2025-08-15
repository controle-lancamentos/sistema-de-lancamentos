const { getFileIdByPath, readExcelRange } = require('./graphApi'); // ajuste o caminho se necessário


(async () => {
  try {
    const filePath = 'Publicos/data-storage/estrutura-de-dados/controle-irrigacao/controle-de-usuarios/dados-de-usuarios.xlsx'; // caminho no OneDrive (sem barra inicial)
    const sheetName = 'banco-de-dados-usuarios'; // nome da aba no Excel
    const range = 'A2:G2'; // intervalo a ser lido

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