/*import { codigoPivo, tabelaPivoLamina } from "./script-horimetro.js";*/

// validação pivô
validacaoPivo('pivo');


// validação falha
listaSugestaoSuspensa('falha', 'sugestoes-falha', inforMotivo);

// Validação motivo da falha
/*listaSugestaoSuspensa('motivo', 'sugestoes', 'falha', inforProblemaMotivo)*/
//listaSugestaoSuspensa('motivo', 'sugestoes', inforProblemaMotivo);

// Validação motivo falha
window.listaSugestaoSuspensaObjetos('motivo', 'sugestoes-motivo', 'falha', inforProblemaMotivo)

// Envidando dados do formulário

const form = document.getElementById('formExecucaoIndicador');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        data: document.getElementById('data').value,
        pivo: document.getElementById('pivo').value,
        falha: document.getElementById('falha').value,
        motivo: document.getElementById('motivo').value
    };

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