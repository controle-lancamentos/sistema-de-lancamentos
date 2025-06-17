/*import { codigoPivo, tabelaPivoLamina } from "./script-horimetro.js";*/

// validação pivô
window.validacaoPivo('pivo', 'Esse pivô não existe.');


// validação falha
window.listaSugestaoSuspensa('falha', 'sugestoes-falha', window.inforMotivo);

// Validação motivo da falha
/*listaSugestaoSuspensa('motivo', 'sugestoes', 'falha', inforProblemaMotivo)*/
//listaSugestaoSuspensa('motivo', 'sugestoes', inforProblemaMotivo);

// Validação motivo falha
window.listaSugestaoSuspensaObjetos('motivo', 'sugestoes-motivo', 'falha', window.inforProblemaMotivo)

// desabilitanfo input de motivo da falha

//window.desabilitarInput('motivo', 'falha', inforMotivo);

// incluido observação

window.incluirObservacao('check', 'anotacao');

// Envidando dados do formulário

const form = document.getElementById('formExecucaoIndicador');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const erro = document.querySelectorAll('.erro');
    let erroExistente = false;

    const dados = {
        data: document.getElementById('data').value,
        pivo: document.getElementById('pivo').value,
        falha: document.getElementById('falha').value,
        motivo: document.getElementById('motivo').value
    };

    erro.forEach( span => {
        if ( span.style.display !== 'none') {
            erroExistente = true;
        }
    });

    if ( erroExistente ) {
        alert('Por favor, corrija os dados inválidos!');
        return;
    }

    try {
        const resposta = await fetch('http://localhost:3000/api/form/exIndicador', {
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
    document.getElementById('anotacao').style.display = 'none';
     
});