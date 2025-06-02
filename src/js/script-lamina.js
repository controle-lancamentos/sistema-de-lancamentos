const percTeste = document.getElementById('percTeste');
const laminaTeste = document.getElementById('laminaTeste');
const laminaInicial = document.getElementById('laminaInicial');

function calcularLamina() {

    const porcentagem = parseFloat(percTeste.value) || 0;
    const resultadoTeste = parseFloat(laminaTeste.value) || 0;

    laminaInicial.value = ((resultadoTeste * porcentagem) / 100);

    laminaInicial.value = laminaInicial.value.replace('.', ',');
}

laminaTeste.addEventListener('input', calcularLamina);

