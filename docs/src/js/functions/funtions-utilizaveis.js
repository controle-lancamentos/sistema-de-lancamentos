//Função exibir erro
window.exibirErro = function(idInput, mensagem = 'Valor inválido') {

    const input = document.getElementById(idInput);

    if (!input || !input.parentElement) return;

    const container = input.parentElement;

    if (!container.querySelector('.erro')) {

        const span = document.createElement('span');

        span.className = 'erro';
        span.innerText = mensagem;

        container.appendChild(span);
    }
}


// função remover erros
window.removerErro = function(idInput) {

    const input = document.getElementById(idInput);

    if (!input || !input.parentElement) return;

    const container = input.parentElement;

    const span = container.querySelector('.erro');

    if (span) {
        container.removeChild(span);
    }
};

// validação pivo

window.validacaoPivo = function(idPivo) {
    const InputPivo = document.getElementById(idPivo);

    InputPivo.addEventListener('input', () =>{

        const chavePivo = InputPivo.value.trim();

        if (!(chavePivo in tabelaPivoLamina)) {
            exibirErro(idPivo);

        } else {
            removerErro(idPivo);
        }

    });
}

// função de observação
window.incluirObservacao = function(idCheck, idAnotacao) {
    const checked = document.getElementById(idCheck);
    const anotacao = document.getElementById(idAnotacao);

    checked.addEventListener('change', () => {

        const textContent = document.querySelector('textarea');

        textContent.addEventListener('blur', () => {

            textContent.value = textContent.value.replace(/\s+/g, ' ').trim();

        });

        if(checked.checked) {
            anotacao.style.display = 'block';
           
        
        } else {
            anotacao.style.display = 'none';
            
        }
    });
}


/*--lista de validação de informações do campo area--*/
window.listaSugestaoSuspensa = function(idInput, idSugestoes, listArea) {

    const inputArea = document.getElementById(idInput);
    const sugestoes = document.getElementById(idSugestoes);

    if (!inputArea || !sugestoes) return;

    /*if (!(idEspelho = 'naoUsar')) {
        const espelho = document.getElementById(idEspelho);
        
        var verficacaoObjeto = Object.values(espelho).some(lista => lista.includes(idInput));
    }*/
    
    inputArea.addEventListener('input', () => {

        

        inputArea.value = inputArea.value.replace(/\s+/g, "").toUpperCase();

        const valor = inputArea.value.trim();

        

        if (!listArea.includes (inputArea.value)) {
            exibirErro(idInput);

        } else {
            removerErro(idInput);
        }


        sugestoes.innerHTML = '';
        
        if (valor === '') {
            sugestoes.style.display = 'none';

            return;
        }

        const filtradas = listArea.filter(opcao => opcao.startsWith(valor));

        if (filtradas.length > 0) {
            sugestoes.style.display = 'block'

            filtradas.forEach(opcao => {
                const item = document.createElement('div');

                item.innerText = opcao;

                item.onclick = () => {
                    inputArea.value = opcao;
                    sugestoes.style.display = 'none';
                    removerErro(inputArea);
                };
            
                sugestoes.appendChild(item); 
            }); 

        } else {
            sugestoes.style.display = 'none';
        }
    });

    document.addEventListener('click', e => {

    if (!e.target.closest('.area')) {
        sugestoes.style.display = 'none';
    }

    });

}