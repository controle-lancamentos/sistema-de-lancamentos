const express = require('express');

const router = express.Router();

const authUser = require('../middLeware/auth');

const { salvarDadosPlanejamento, filtrarPlanejamento } = require('../controllers/ordemServicoController');

router.post('/', authUser, salvarDadosPlanejamento);

router.post('/filtrar', authUser, filtrarPlanejamento);


module.exports = router;