// validação de pivô e lâminas
window.listaSugestaoSuspensa('area', 'sugestoes', window.inforArea);

const pivo = document.getElementById('pivo');
const percentual = document.getElementById('percentual');
const lamina = document.getElementById('lamina');

function pegarLamina() {

    const codigoPivo = pivo.value;
    const taxaExecucao = parseFloat(percentual.value);
    const valorBase = tabelaPivoLamina[codigoPivo];

    if (!(codigoPivo in tabelaPivoLamina)) {
        exibirErro('pivo', 'Esse pivô não existe.');
    
    } else {
        removerErro('pivo');
    } 

    if (taxaExecucao <= 0 || taxaExecucao > 100) {
        exibirErro('percentual', 'Somente valores de 1 á 100.');

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

// Ultimo horimetro
document.getElementById('pivo').addEventListener('change', () => {
  const nomePivo = document.getElementById('pivo').value;

  /*--console.log(`nome do pivô enviado: "${nomePivo}"`);--*/

  fetch(`http://localhost:3000/api/form/horimetro/ultimoHorimetro/${nomePivo}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('horimetro-1').value = data.ultimoHorimetro;
    })
    .catch(err => console.error('Erro ao buscar horímetro:', err));
});


// Validacção horas
const horimetro1 = document.getElementById('horimetro-1');
const horimetro2 = document.getElementById('horimetro-2');
const horas = document.getElementById('horas');

function horasCalculadas() {

    const valor1 = parseFloat(horimetro1.value) || 0;
    
    const valor2 = parseFloat(horimetro2.value) || 0;

    if ( valor1 < 0 ) {
        exibirErro('horimetro-1', 'Somente valores acima ou iguais a 0.');
    
    } else {
        removerErro('horimetro-1');
    }

    if (valor2 <= 0 || valor2 <= valor1) {
        exibirErro('horimetro-2', 'Valor deve ser maior que hora inicial.');
        return horas.value = null;

    } else {
        removerErro('horimetro-2');
    }

    const resultado = (valor2 - valor1).toFixed(1);

    horas.value = resultado;

}

horimetro2.addEventListener('input', horasCalculadas);
horimetro1.addEventListener('input', horasCalculadas);


//Incluindo a observação no formulário
incluirObservacao('check', 'anotacao');


// Envio de dados do formulário

const form = document.getElementById('formHorimetro');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que o formulário recarregue a página

    const dataLancamento = document.getElementById('data');
    const dataHistorico = dataLancamento.value;

    const erro = document.querySelectorAll('.erro');
    let erroExistente = false;

    // pegando os valores dos campos
    const dados = {
        data: dataHistorico,
        pivo: document.getElementById('pivo').value,
        area: document.getElementById('area').value,
        percentual: document.getElementById('percentual').value,
        lamina: document.getElementById('lamina').value,
        horimetro1: document.getElementById('horimetro-1').value,
        horimetro2: document.getElementById('horimetro-2').value,
        horas: document.getElementById('horas').value,
        observacao: document.getElementById('txtAnotacao').value
    };

    erro.forEach( span => {
        if ( span.style.display !== 'none' ) {
            erroExistente = true;
        
        } 
    });

    if ( erroExistente ) {
        alert('Por favor, corrija os dados inválidos!');
        return;
    }

    try {

        // envia para o backend com o metodo POST
        const resposta = await fetch('http://localhost:3000/api/form/horimetro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(dados) // Transforma os dados em texto JSON
            
        });

        const resultado = await resposta.json();
        alert(resultado.mensagem) // Mostra mensagem de sucesso

    } catch (erro) {
        console.error('Erro ao enviar:', erro);

        alert('Erro ao enviar dados!');

    }
    
    document.getElementById('anotacao').style.display = 'none';

    /*setTimeout( () => {
        document.getElementById('data').value = dataHistorico
    }, 1000);*/

});

window.addEventListener('DOMContentLoaded', () => {

    const navEntries = performance.getEntriesByType('navigation');
  if (navEntries.length > 0 && navEntries[0].type === 'reload') {

        fetch( 'http://localhost:3000/api/form/horimetro/ultimaData' )
            .then(res => res.json())
            .then(data => {
                if (data.ultimaData) {
                    document.getElementById('data').value = data.ultimaData;
                }
            })

            .catch(err => {
                console.error( 'erro ao buscar a última data:', err );

        });
  }
});