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

window.ativacaoInstrucoes = function(idRadio, idInstrucao) {

    const radio = document.getElementById(idRadio);
    const instrucao = document.getElementById(idInstrucao);

    if (!radio || !instrucao) return; // segurança

    // Quando mudar o estado do input
    radio.addEventListener('change', function() {
        if (this.checked) {
            instrucao.style.display = 'block'; // mostra
        } else {
            instrucao.style.display = 'none'; // esconde
        }
    });

    // Define o estado inicial ao carregar
    instrucao.style.display = radio.checked ? 'block' : 'none';
    
}

window.ativacaoInstrucoesRadios = function(nameRadios, instrucoesMap) {
    const radios = document.querySelectorAll(`input[type="radio"][name="${nameRadios}"]`);

    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Esconde todas as instruções
            Object.values(instrucoesMap).forEach(idInstrucao => {
                document.getElementById(idInstrucao).style.display = 'none';
            });

            // Mostra apenas a instrução do radio selecionado
            if (this.checked) {
                const idInstrucao = instrucoesMap[this.id];
                if (idInstrucao) {
                    document.getElementById(idInstrucao).style.display = 'block';
                }
            }
        });
    });

    // Estado inicial
    radios.forEach(radio => {
        const idInstrucao = instrucoesMap[radio.id];
        document.getElementById(idInstrucao).style.display = radio.checked ? 'block' : 'none';
    });
};

// Função de Filtrar dados
window.filtarInformacoes = function(idData, idPivo, idCultura, idBotaoFiltrar, urlFecth) {

    const btn = document.getElementById(idBotaoFiltrar);

    btn.addEventListener("click", function() {
        // Pega os valores dos filtros
        const valorData = document.getElementById(idData).value;
        const valorPivo = document.getElementById(idPivo).value;
        const valorCultura = document.getElementById(idCultura).value;

        // Monta objeto de filtros apenas com os campos preenchidos
        const filtros = {};
        if (valorData) filtros.data = valorData;
        if (valorPivo) filtros.pivo = valorPivo;
        if (valorCultura) filtros.cultura = valorCultura;

        // Mostra carregando
        Swal.fire({
            title: 'Filtrando...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        fetch(urlFetch, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filtros)
        })
        .then(res => res.json())
        .then(resp => {
            Swal.close();
            if (resp.sucesso) {
                // Chame aqui sua função para atualizar a tabela, por exemplo:
                mostrarTabela(resp.dados); 
            } else {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao filtrar: ' + resp.mensagem,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(err => {
            console.error(err);
            Swal.close();
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao conectar com o servidor.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
    });
}
