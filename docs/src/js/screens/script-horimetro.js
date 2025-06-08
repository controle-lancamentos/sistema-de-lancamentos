
// validação de pivô e lâminas
listaSugestaoSuspensa('area', 'sugestoes', inforArea);

const pivo = document.getElementById('pivo');
const percentual = document.getElementById('percentual');
const lamina = document.getElementById('lamina');

function pegarLamina() {

    const codigoPivo = pivo.value;
    const taxaExecucao = parseFloat(percentual.value);
    const valorBase = tabelaPivoLamina[codigoPivo];

    if (!(codigoPivo in tabelaPivoLamina)) {
        exibirErro('pivo');
    
    } else {
        removerErro('pivo');
    } 

    if (taxaExecucao <= 0 || taxaExecucao > 100) {
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

    if (valor2 <= 0 || valor2 <= valor1) {
        exibirErro('horimetro-2');
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

    // pegando os valores dos campos
    const dados = {
        data: document.getElementById('data').value,
        pivo: document.getElementById('pivo').value,
        area: document.getElementById('area').value,
        percentual: document.getElementById('percentual').value,
        lamina: document.getElementById('lamina').value,
        horimetro1: document.getElementById('horimetro-1').value,
        horimetro2: document.getElementById('horimetro-2').value,
        horas: document.getElementById('horas').value,
        observacao: document.getElementById('txtAnotacao').value
    };

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

    form.reset();
    document.getElementById('anotacao').style.display = 'none';
     
});