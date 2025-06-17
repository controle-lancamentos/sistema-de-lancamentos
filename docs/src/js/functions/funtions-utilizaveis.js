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

window.validacaoPivo = function(idPivo, mensagem) {
    const InputPivo = document.getElementById(idPivo);

    InputPivo.addEventListener('input', () =>{

        const chavePivo = InputPivo.value.trim();

        if (!(chavePivo in tabelaPivoLamina)) {
            exibirErro(idPivo, mensagem);

        } else {
            removerErro(idPivo);
        }

    });
}

window.validacaoPercentual = function(idPercentual) {
    const percentual = document.getElementById(idPercentual);

    percentual.addEventListener('input', () => {

        if( percentual.value > 100 || percentual.value <=0 ) {
            window.exibirErro(idPercentual);

        } else {
            window.removerErro(idPercentual);
        }
    });
}

// função de observação
window.incluirObservacao = function(idCheck, idAnotacao) {
    const checked = document.getElementById(idCheck);
    const anotacao = document.getElementById(idAnotacao);

    checked.addEventListener('click', () => {

        const textContent = document.getElementById('txtAnotacao');

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
    // lista click começa aqui!!
    const atualizarSugestoes = (valorAtual = '') => {
        sugestoes.innerHTML = '';

        const filtradas = valorAtual
            ? listArea.filter(opcao => opcao.startsWith(valorAtual))
            : listArea;

        if (filtradas.length > 0) {
            sugestoes.style.display = 'block';

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
    };

    // Filtragem
    inputArea.addEventListener('input', () => {

        if (inputArea.id === 'area') {
            inputArea.value = inputArea.value.toUpperCase().replace(/\s+/g, '');

        } else {

            inputArea.value = inputArea.value.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
        }

        const valor = inputArea.value.trim();

        if (!listArea.includes(inputArea.value)) {
            exibirErro(idInput , 'Informe somente valores conforme a lista.');

        } else {
            removerErro(idInput);
        }

        atualizarSugestoes(valor)
        //-------*

        /*sugestoes.innerHTML = '';
        
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
        }*/
    });

    inputArea.addEventListener('blur', () => {
        if ( !listArea.includes(inputArea.value) && !(inputArea.value === "") ) {
            exibirErro(idInput , 'Informe somente valores conforme a lista.');

        } else {
            removerErro(idInput);
        }
    });

    inputArea.addEventListener('focus', () => {
        atualizarSugestoes();
    });

    document.addEventListener('click', e => {
        setTimeout(() => {
            if (!e.target.closest('#' + idInput)) {
        sugestoes.style.display = 'none';

            }
        }, 10);
    });

}

/*--lista de validação de informações do campo area { para objetos }--*/
window.listaSugestaoSuspensaObjetos = function(idInput, idSugestoes, idSetor, listArea) {

    const inputArea = document.getElementById(idInput);
    const sugestoes = document.getElementById(idSugestoes);
    const inputSetor = document.getElementById(idSetor);

    if (!inputArea || !sugestoes || !inputSetor) return;
    // lista começa aqui
     const atualizarSugestoes = (valorAtual = '') => {
        const setor = inputSetor.value.trim();
        const listaPorSetor = listArea[setor] || [];

        sugestoes.innerHTML = '';

        const filtradas = valorAtual
            ? listaPorSetor.filter(opcao => opcao.startsWith(valorAtual))
            : listaPorSetor; // se valorAtual for vazio, mostra tudo

        if (filtradas.length > 0) {
            sugestoes.style.display = 'block';

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
    };

    // filtragem
    inputArea.addEventListener('input', () => {

        inputArea.value = inputArea.value.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());;

        const valor = inputArea.value.trim();
        const setor = inputSetor.value.trim();

        const listaPorSetor = listArea[setor] || [];

        /*console.log('setor: ', setor);
        console.log('listaPorsetor: ', listaPorSetor);
        console.log('listaArea: ', listArea);*/

        if (!listaPorSetor.includes (valor)) {
            exibirErro(idInput, 'Informe somente valores conforme a lista.');

        } else {
            removerErro(idInput);
        }

        sugestoes.innerHTML = '';
        
        if (valor === '') {
            sugestoes.style.display = 'none';

            return;
        }

        const filtradas = listaPorSetor.filter(opcao => opcao.startsWith(valor));

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

         atualizarSugestoes(valor);
    });

     // Aqui é o evento que mostra tudo ao focar no input
    inputArea.addEventListener('focus', () => {
        atualizarSugestoes();
    });

    inputArea.addEventListener('blur', () => {

        if (!listaPorSetor.includes(valor) && inputArea.value.trim() !== "" ) {
            exibirErro(idInput, 'Informe somente valores conforme a lista.');

        } else {
            removerErro(idInput);
        }
    });

    document.addEventListener('click', e => {
        setTimeout(() => {
            if (!e.target.closest('#' + idInput)) {
            sugestoes.style.display = 'none';

            }
        }), 100;

    });

}

/*desabilitarInput('motivo');*/

window.inforMotivo = ['Elétrico', 'Mecânico', 'Operacional', 'Programação/Manejo', 'Chuva', 'Energia/Coelba'];

window.desabilitarInput = function(idInput, idReferencia) {
    const inputReferencia = document.getElementById(idReferencia);

    inputReferencia.addEventListener('blur', () => {

        /*inputReferencia = 'Chuva';


        //if ( inputReferencia.value === listArrayInfos[listArrayInfos.length -1] || inputReferencia.value === listArrayInfos[listArrayInfos.length -2] ) {
        /*if ( inputReferencia === 'Chuva' || inputReferencia === "Energia/Coelba" ) {*/
            
            const inputDesable = document.getElementById(idInput);
            inputDesable.setAttribute('readonly', true);
            
            inputDesable.classList.add('input-auto');

        console.log(inputReferencia);
    });
}