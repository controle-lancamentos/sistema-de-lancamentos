const express = require('express');

const router = express.Router();

const authUser = require('../middLeware/auth');

const { salvarDadosIndicador } = require('../controllers/execucaoIndicadorController');

router.post('/', authUser, salvarDadosIndicador);

router.post('/', (req, res) => {

    const dadosFomulario = req.body;

    console.log('Recebido de formExecucaoIndicador:', dadosFomulario);

    res.status(200).json({ mensagem: 'Dados recebidos com sucesso!' });

});

/*router.get('/ultimaData', buscarUltimaData);*/

module.exports = router;