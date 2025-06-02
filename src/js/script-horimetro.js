const area = document.getElementById('area');

area.addEventListener('input', () => {

    area.value = area.value.replace(/\s+/g, "").toUpperCase();

});

const pivo = document.getElementById('pivo');
const percentual = document.getElementById('percentual');
const lamina = document.getElementById('lamina');

const tabelaPivoLamina = [
    {
        pivo: '10',
        laminaAplicada: { '100': 7.50, '80': 8.10, '60': 9.25, '55': 14.15, '30': 17.10 }
    },

    {
        pivo: '25',
        laminaAplicada: { '100': 8.50, '80': 9.15, '60': 10.40, '55': 16.15, '30': 19.10 }
    },

    {
        pivo: '35',
        laminaAplicada: { '100': 8.50, '80': 9.15, '60': 11.40, '55': 17.15, '30': 19.25 }
    },

    {
        pivo: '55',
        laminaAplicada: { '100': 7.50, '80': 10.15, '60': 13.40, '55': 16.15, '30': 18.10 }
    },

    {
        pivo: '70',
        laminaAplicada: { '100': 5.50, '80': 7.15, '60': 8.40, '55': 15.15, '30': 20.10 }
    }
];

function pegarLamina () {

    /*const maquina = pivo.value;
    const taxaAplicacao = percentual.value;

    const item = tabelaPivoLamina.find(obj => obj.pivo === maquina);
    
    if (item && item.laminaAplicada[taxaAplicacao] !== undefined) {
        lamina.value = item.laminaAplicada[taxaAplicacao];
    } else {
        lamina.value = 'Valor não encontrado';
    }*/

        const resultado = tabelaPivoLamina.find(obj => obj.pivo === '25')?.laminaAplicada['100'];

        lamina.value = resultado;

        console.log(resultado);
}

percentual.addEventListener('input', pegarLamina);

const horimetro1 = document.getElementById('horimetro-1');
const horimetro2 = document.getElementById('horimetro-2');
const horas = document.getElementById('horas');

function horasCalculadas() {

    const valor1 = parseFloat(horimetro1.value) || 0;
    
    const valor2 = parseFloat(horimetro2.value) || 0;

    horas.value = valor2 - valor1;

}

horimetro2.addEventListener('input', horasCalculadas);