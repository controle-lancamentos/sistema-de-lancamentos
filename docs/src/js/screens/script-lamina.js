const percTeste = document.getElementById('percTeste');
const laminaTeste = document.getElementById('laminaTeste');
const laminaInicial = document.getElementById('laminaInicial');

window.validacaoPivo('pivo');

window.validacaoPercentual('percTeste');

function calcularLamina() {

    const porcentagem = parseFloat(percTeste.value.replace(',', '.')) || 0;
    const resultadoTeste = parseFloat(laminaTeste.value.replace(',', '.')) || 0;

    const resultado = ((resultadoTeste * porcentagem) / 100);

    laminaInicial.value = resultado.toFixed(2).replace('.', ',');
}

percTeste.addEventListener('input', calcularLamina);
laminaTeste.addEventListener('input', calcularLamina);



const form = document.getElementById('formLamina');

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const dados = {
        pivo: document.getElementById('pivo').value,
        lamina: document.getElementById('laminaInicial').value
    };

    try {
        const resposta = await fetch('http://localhost:3000/api/form/atualizarLamina', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(dados)
            
        });

        const resultado = await resposta.json();
        alert(resultado.mensagem);

    } catch (erro) {
        console.error('Erro ao enviar:', erro);

        alert('Erro ao enviar dados!');

    }

    form.reset();

});
