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



/*const form = document.getElementById('formLamina');

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const dados = {
        pivo: document.getElementById('pivo').value,
        lamina: document.getElementById('laminaInicial').value
    };

    try {
        const resposta = await fetch('https://sistema-de-lancamentos.onrender.com/api/form/atualizarLamina', {
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

});*/

// Envidando dados do formulário


const form = document.getElementById('formLamina');
const btnEnviar = document.querySelector('#btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const erro = document.querySelectorAll('.erro');
    let erroExistente = false;

    const dados = {
        pivo: document.getElementById('pivo').value,
        lamina: document.getElementById('laminaInicial').value

    };

    erro.forEach( span => {
        if ( span.style.display !== 'none') {
            erroExistente = true;
        }
    });

    if ( erroExistente ) {
        //alert('Por favor, corrija os dados inválidos!');
        Swal.fire({
                    title: 'Atenção!',
                    text: 'Corrija o valor inválido!',
                    icon: 'warning',
                    confirmButtonText: 'OK'
        });
        return;
    }

    // Feedback de envio (evita múltiplos cliques e mostra ação)
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    try {
        const resposta = await fetch('https://sistema-de-lancamentos.onrender.com/api/form/atualizarLamina', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados),
            cache: 'no-store' // evita qualquer cache indesejado
        });

        if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);

        //const resultado = await resposta.json();
        //alert(resultado.mensagem);
        Swal.fire({
                    title: 'Enviado!',
                    text: 'Dados enviados com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK'
        });

        // ⚡ Reset mínimo e direto
        form.reset();

    } catch (erro) {
        console.error('Erro ao enviar:', erro);
        //alert('Erro ao enviar dados!');
        Swal.fire({
                    title: 'Erro!',
                    text: 'Não foi possível salvar os dados!',
                    icon: 'error',
                    confirmButtonText: 'OK'
        });

    } finally {
        // ⚡ Reativa botão rapidamente
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar';
    }
});
