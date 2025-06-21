
const checkbox = document.getElementById('exibir-os');



checkbox.addEventListener('click', () => {

    const relatorio = document.getElementById('relatorio-os');

    //relatorio.style.display = checkbox.checked? 'block' : 'none';
    //relatorio.style.display = 'block';

    if ( !checkbox.checked ) {
        relatorio.style.display = 'none';

    } else {
        relatorio.style.display = 'block';
    }

});