// 1. Importa o express pra usar o sistema de rotas dele
const express = require('express');

// 2. Cria um “mini servidor” só pra rotas do formulário
const router = express.Router();

const authUser = require('../middLeware/auth');

const { salvarDadosHorimetro, buscarUltimoHorimetro, buscarUltimaData } = require('../controllers/horimetroController');

router.post('/', authUser, salvarDadosHorimetro);

router.get('/ultimoHorimetro/:nomePivo', buscarUltimoHorimetro);

router.get('/ultimaData', buscarUltimaData);


// para teste:
// 3. Cria a rota que recebe os dados do formulário
/*--router.post('/', (req, res) => {

    const dadosFomulario = req.body; // Aqui a gente pega os dados que vieram no corpo da requisição

    console.log('Recebido do formulário:', dadosFomulario); // Só pra testar: vamos imprimir esses dados no terminal

    res.status(200).json({ mensagem: 'Dados recebidos com sucesso!'}); // Devolve uma resposta pro navegador dizendo que deu certo

});--*/

module.exports = router; // Exporta esse mini servidor pra ser usado no arquivo principal (index.js)