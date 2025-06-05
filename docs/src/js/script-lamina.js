const percTeste = document.getElementById('percTeste');
const laminaTeste = document.getElementById('laminaTeste');
const laminaInicial = document.getElementById('laminaInicial');

function calcularLamina() {

    const porcentagem = parseFloat(percTeste.value.replace(',', '.')) || 0;
    const resultadoTeste = parseFloat(laminaTeste.value.replace(',', '.')) || 0;

    const resultado = ((resultadoTeste * porcentagem) / 100);

    laminaInicial.value = resultado.toFixed(2).replace('.', ',');
}

laminaTeste.addEventListener('input', calcularLamina);

