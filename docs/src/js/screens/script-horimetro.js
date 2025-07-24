// Lista cultura
window.listaSugestaoSuspensa('cultura', 'sugestoes-1', window.cultura);
// Lista are
window.listaSugestaoSuspensa('area', 'sugestoes-2', window.inforArea);

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


  fetch(`https://sistema-de-lancamentos.onrender.com/api/form/horimetro/ultimoHorimetro/${nomePivo}`)
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


const form = document.getElementById('formHorimetro');
const dataInput = document.getElementById('data');
const btnEnviar = document.querySelector('#btn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const erro = document.querySelectorAll('.erro');
    let erroExistente = false;

    const dados = {
        data: dataInput.value,
        pivo: document.getElementById('pivo').value,
        cultura: document.getElementById('cultura').value,
        area: document.getElementById('area').value,
        percentual: document.getElementById('percentual').value,
        lamina: document.getElementById('lamina').value,
        horimetro1: document.getElementById('horimetro-1').value,
        horimetro2: document.getElementById('horimetro-2').value,
        horas: document.getElementById('horas').value,
        observacao: document.getElementById('txtAnotacao').value
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

    // Feedback de envio (evita múltiplos cliques e mostra ação)
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    try {
        const resposta = await fetch('https://sistema-de-lancamentos.onrender.com/api/form/horimetro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados),
            cache: 'no-store' // evita qualquer cache indesejado
        });

        if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);

        const resultado = await resposta.json();
        alert(resultado.mensagem);

        // ⚡ Reset mínimo e direto
        form.reset();
        dataInput.value = dados.data; // repõe a data se for fixa
        document.getElementById('anotacao').style.display = 'none';

    } catch (erro) {
        console.error('Erro ao enviar:', erro);
        alert('Erro ao enviar dados!');
    } finally {
        // ⚡ Reativa botão rapidamente
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar';
    }
});