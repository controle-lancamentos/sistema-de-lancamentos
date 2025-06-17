const express = require('express');

const router = express.Router();

const authUser = require('../middLeware/auth');

const { salvarDadosLamina } = require('../controllers/laminaController');

router.post('/', authUser, salvarDadosLamina)

router.post('/', (req, res) => {

    const dadosFomulario = req.body;

    console.log('Recebido de formAtualizarLamina:', dadosFomulario);

    res.status(200).json({ mensagem: 'Dados recebidos com sucesso!'});

});

module.exports = router;