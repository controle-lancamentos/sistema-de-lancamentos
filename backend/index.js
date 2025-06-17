// Importações básicas
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Importa o cors

// Carrega variáveis do .env
dotenv.config();

//Inicializa o app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pra aceitar JSON no body das requisições
app.use(express.json());
app.use(cors()); // Libera CORS para todas as origens

// Rota de teste
app.get('/', (req, res) => {
    res.send('API está online');

});

//Importa rotas dos formulários
const formHorimetroRoutes = require('./routes/formHorimetro');
app.use('/api/form/horimetro', formHorimetroRoutes);

const formExIndicadorRoutes = require('./routes/formExecucaoIndicador');
app.use('/api/form/exIndicador', formExIndicadorRoutes);

const formAtualizarLaminaRoutes = require('./routes/formAtualizarLamina');
app.use('/api/form/atualizarLamina', formAtualizarLaminaRoutes);

/*const formPlanejamentoFertRoutes = require('./routes/formPlanejamentoFerti');
app.use('/api/form/planejamentoFert', formPlanejamentoFertRoutes);

const formPlanejamentoOsRoutes = require('./routes/formPlanejamentoOs');
app.use('/api/form/planejamentoOs', formPlanejamentoOsRoutes);*/

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);

});


