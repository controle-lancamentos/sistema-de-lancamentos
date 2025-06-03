//Função exibir erro
function exibirErro(idInput) {

    const input = document.getElementById(idInput);
    const container = input.parentElement;

    if (!container.querySelector('.erro')) {

        const span = document.createElement('span');

        span.className = 'erro';
        span.innerText = 'Valor inválido';

        container.appendChild(span);
    }
}

//função remover erros
function removerErro(idInput) {

    const input = document.getElementById(idInput);
    const container = input.parentElement;

    const span = container.querySelector('.erro');

    if (span) {
        container.removeChild(span);
    }
}

//função de observação
function incluirObservacao (idCheck, idAnotacao) {
    const checked = document.getElementById(idCheck);
    const anotacao = document.getElementById(idAnotacao);

    checked.addEventListener('change', () => {

        if(checked.checked) {
            anotacao.style.display = 'block';
           
        
        } else {
            anotacao.style.display = 'none';
            
        }
    });
}

//Deixando o campo de area sem 'espaços', sem 'letreas'
const area = document.getElementById('area');
const sugestoes = document.getElementById('sugestoes')

const inforArea = ['COMPLETO', '1/2-PIVO', 'A', 'B', 'C', 'D',
                    'AB', 'AC', 'AD', 'BC', 'BD', 'CD',
                    'ABC', 'ABD', 'ACD', 'BCD',
                    'ABCD'
];

area.addEventListener('input', () => {

    area.value = area.value.replace(/\s+/g, "").toUpperCase();

    if (!(inforArea.includes(area.value))) {
        exibirErro('area');

    } else {removerErro('area'); 

    }

    const valor = area.value.trim();

    sugestoes.innerHTML = '';
    
    if (valor === '') {
        sugestoes.style.display = 'none';

        return;
    }

    const filtradas = inforArea.filter(opcao => opcao.startsWith(valor));

    if (filtradas.length > 0) {
        sugestoes.style.display = 'block'

        filtradas.forEach(opcao => {
            const item = document.createElement('div');

            item.innerText = opcao;

            item.onclick = () => {
                area.value = opcao;
                sugestoes.style.display = 'none';
                removerErro('area');
            };
        
            sugestoes.appendChild(item); 
        }); 

    } else {
        sugestoes.style.display = 'none';
    }
});

document.addEventListener('click', e => {

  if (!e.target.closest('.area')) {
    sugestoes.style.display = 'none';
  }

});


const pivo = document.getElementById('pivo');
const percentual = document.getElementById('percentual');
const lamina = document.getElementById('lamina');

export const tabelaPivoLamina = {

    '1': 5.45, '2': 5.30, '3': 6.30, '4': 3.92, '5': 5.52,
    '6': 5.82, '7': 5.52, '8': 6.58, '9': 5.46, '10': 6.30,
    '11': 5.52, '12': 6.30, '13': 4.28, '14': 5.76, '15': 7.38,
    '16': 7.19, '17': 6.30, '18': 6.51, '19': 5.75, '20': 6.84,
    '21': 5.47, '22': 7.21, '23': 5.28, '24': 6.30, '25': 5.80,
    '26': 5.70, '27': 5.34, '28': 6.68, '29': 5.14, '30': 6.00,
    '31': 6.18, '32': 5.70, '33': 6.00, '34': 6.72, '35': 5.82,
    '36': 7.20, '37': 9.04, '38': 8.05, '39': 5.58, '40': 6.96,
    '41': 6.44, '42': 5.76, '43': 6.79, '44': 7.26, '45': 6.12,
    '46': 6.66, '47': 7.42, '48': 6.80, '49': 6.72, '50': 6.78,
    '51': 6.05, '52': 6.96, '53': 4.63, '54': 5.80, '55': 6.48,
    '56': 6.18, '57': 5.88, '58': 6.54, '59': 5.18, '60': 6.78,
    '61': 6.09, '62': 5.58, '63': 3.54, '64': 5.45, '65': 7.27,
    '66': 5.60, '67': 5.00, '68': 4.80, '69': 4.60, '70': 6.42,
    '71': 4.85, '72': 6.12, '73': 6.76, '74': 6.76,
    '101': 5.58,  '102': 5.58,  '103': 5.16,  '104': 4.95,  '105': 5.16,
    '106': 5.34,  '107': 4.68,  '108': 5.34,  '109': 5.83,  '110': 5.50,
    '112': 6.37,  '113': 6.37,  '114': 5.94,  '115': 6.44,  '116': 6.44,
    '117': 5.67,  '118': 6.44,  '119': 6.58,  '120': 6.51,  '121': 6.37,
    '122': 6.30,  '123': 6.79,  '124': 5.88,  '125': 4.50,  '126': 6.65,
    '127': 4.82,  '128': 6.36,  '129': 5.35,  '130': 5.76,  '131': 7.67,
    '132': 7.77,  '133': 5.15
}

export const codigoPivo = Object.keys(tabelaPivoLamina);

function pegarLamina() {

    const codigoPivo = pivo.value;
    const taxaExecucao = parseFloat(percentual.value);
    const valorBase = tabelaPivoLamina[codigoPivo];

    if (!(codigoPivo in tabelaPivoLamina) || parseFloat(codigoPivo) <= 0) {
        exibirErro('pivo');
    
    } else {
        removerErro('pivo');
    } 

    if (taxaExecucao === 0 || taxaExecucao > 100 || taxaExecucao <= 0) {
        exibirErro('percentual');

    } else {
        removerErro('percentual');
    }

    if (!valorBase || isNaN(taxaExecucao) || taxaExecucao <= 0 || taxaExecucao > 100) {
        lamina.value = '';

        return;
    }

    const calculoLamina = valorBase / (taxaExecucao / 100);

    lamina.value = calculoLamina.toFixed(2);
}

percentual.addEventListener('input', pegarLamina);
pivo.addEventListener('input', pegarLamina);


const horimetro1 = document.getElementById('horimetro-1');
const horimetro2 = document.getElementById('horimetro-2');
const horas = document.getElementById('horas');

function horasCalculadas() {

    const valor1 = parseFloat(horimetro1.value) || 0;
    
    const valor2 = parseFloat(horimetro2.value) || 0;

    if (valor2 == 0) {
        return horas.value = '';
    }

    const resultado = (valor2 - valor1).toFixed(1);

    horas.value = resultado;

}

horimetro2.addEventListener('input', horasCalculadas);
horimetro1.addEventListener('input', horasCalculadas);


//Incluindo a observação no formulário
incluirObservacao('check', 'anotacao');