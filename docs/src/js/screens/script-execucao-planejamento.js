
// validação pivô
window.validacaoPivo('pivo', 'Esse pivô não existe.');


// validação falha
window.listaSugestaoSuspensa('falha', 'sugestoes-falha', window.inforMotivo);


// Validação motivo falha
window.listaSugestaoSuspensaObjetos('motivo', 'sugestoes-motivo', 'falha', window.inforProblemaMotivo)

//desabilitando input de motivo da falha

window.desabilitarInput('motivo', 'falha', inforMotivo);



window.incluirObservacao('check', 'anotacao');


// Envidando dados do formulário


const form = document.getElementById('formExecucaoIndicador');
const dataInput = document.getElementById('data');
const btnEnviar = document.querySelector('#btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const erro = document.querySelectorAll('.erro');
    let erroExistente = false;

    const dados = {

        data: dataInput.value,
        pivo: document.getElementById('pivo').value,
        falha: document.getElementById('falha').value,
        motivo: document.getElementById('motivo').value,
        observacao: document.getElementById('txtAnotacao').value

    };

    erro.forEach( span => {
        if ( span.style.display !== 'none') {
            erroExistente = true;
        }
    });

    if ( erroExistente ) {
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
        const resposta = await fetch('https://sistema-de-lancamentos.onrender.com/api/form/exIndicador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados),
            cache: 'no-store' // evita qualquer cache indesejado
        });

        if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);

        Swal.fire({
                    title: 'Enviado!',
                    text: 'Dados enviados com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK'
        });

        // ⚡ Reset mínimo e direto
        form.reset();
        dataInput.value = dados.data; // repõe a data se for fixa
        document.getElementById('anotacao').style.display = 'none';

    } catch (erro) {
        console.error('Erro ao enviar:', erro);
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