import { codigoPivo, tabelaPivoLamina } from "./script-horimetro.js";

const inforMotivo = ['Elétrico', 'Energia/Coelba', 'Chuva', 'Mecânico', 'Operacional', 'Programação/Manejo'];

const prblemaMotivo = {
    'Elétrico': [
        'Anel Coletor', 'Cabo Acionamento', 'Cabo de Segurança',
        'Caixa do Micro', 'Chave Aberta', 'Contactora', 'Disjuntor',
        'Falta de Fase', 'Gerador', 'Inversor de Frequência', 'P. no Injeferd',
        'Painel da Bomba', 'Painel do Pivô', 'Rede Interna', 'Transformador'
    ],

    'Mecânico': [
        'Adutora/Tubulação', 'Bomba de Poços', 'Bomba/Sucção',
        'Canal/Reservatório', 'Castanha/Cardã', 'Estrutura',
        'Gerador', 'Man. Preventiva', 'Mangote',
        'Motorredutor', 'Pneu', 'Redutor', 'Rolamento', 'Vedação'
    ],

    'Operacional': [
        'Adubação', 'Aguard. Anterior', 'Bomba com Ent.. de AR',
        'Capina', 'Colheita Tabaco', 'Demanda de Energia',
        'Desponte/Anti-Brotante', 'Entrega do Produto', 'Entupimento',
        'Equipamentos Ferti', 'Erosão/Rastro', 'Falha de Alinhamento',
        'Falta de Água', 'Falta de Produto', 'Fun. Indisponível',
        'Gerador', 'Injeferd', 'Kit Fertirrigação',
        'Limpeza e Aferições', 'Manejo/R7', 'Maq. Atolada no Pivô',
        'Maq. Quebreda no Pivô', 'Mecânico/Trator', 'Operação E. Irrigação',
        'Operacional Ferti', 'Pivô Atolado', 'Pivô em Manual',
        'Plantio', 'Preparo de Solo', 'Pulverização',
        'Suporte Cantina', 'Suporte/Telemetria', 'Syngenta',
        'Transplantio', 'Transporte/Logística', 'Equipe Irrigação', 'Teste Algodoeira'
    ],

    'Programação/Manejo': [
        'Alinhamento de Operações', 'Cancelamento', 'Inicio Tardio', 'Mudança de Manejo'
    ]
}

const pivo = document.getElementById('pivo');
const falha =  document.getElementById('falha');
const motivo = document.getElementById('motivo');

falha.addEventListener('input', () => {
    const falhaValor = falha.value;

    if (!(falhaValor in inforMotivo)) {
        alert('Falha!');
    
    } else {
        alert('Deu certo');
    }
});
