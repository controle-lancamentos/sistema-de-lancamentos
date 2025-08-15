const express = require('express');

const router = express.Router();

const authUser = require('../middLeware/auth');

const { salvarDadosPlanejamento, filtrarPlanejamento, editarPlanejamento } = require('../controllers/ordemServicoController');

router.post('/', authUser, salvarDadosPlanejamento);

router.post('/filtrar', authUser, filtrarPlanejamento);

router.put('/editar', authUser, editarPlanejamento);

module.exports = router;