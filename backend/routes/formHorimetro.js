// 1. Importa o express pra usar o sistema de rotas dele
const express = require('express');

// 2. Cria um “mini servidor” só pra rotas do formulário
const router = express.Router();

const authUser = require('../middLeware/auth');

const { salvarDadosHorimetro, buscarUltimoHorimetro } = require('../controllers/horimetroController');

router.post('/', authUser, salvarDadosHorimetro);

router.get('/ultimoHorimetro/:nomePivo', buscarUltimoHorimetro);

/*router.get('/ultimaData', buscarUltimaData);*/


module.exports = router;