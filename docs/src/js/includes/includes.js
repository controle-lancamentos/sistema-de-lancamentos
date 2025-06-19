document.body.setAttribute('data-loading', 'true');

async function includeHtml() {
    const includes = document.querySelectorAll('[data-include]');
    const promises = [];

    includes.forEach((el) => {
        const file = el.getAttribute('data-include');

        const promise = fetch(file).then(res => {
            if (!res.ok) {
                el.innerHTML = `Erro ao carregar ${file}`;
                return;
            }
            return res.text().then(html => el.innerHTML = html);
        });

        promises.push(promise);
    });

    // Aguarda todos os includes serem carregados
    await Promise.all(promises);

    // Mostra o conteúdo da página
    document.body.removeAttribute('data-loading');
}

//links do menu
window.addEventListener('DOMContentLoaded', includeHtml);


document.querySelectorAll('.menu .link').forEach(link => {
    link.addEventListener('clik', function (e) {
        e.preventDefault();

        document.querySelectorAll('.menu . link').forEach( el => el.classList.remove('ativo'));

        this.classList.add('ativo');
    });
});

//cronometro de data e hora

function relogio() {
    const agora = new Date();

    const data = agora.toLocaleDateString('pt-BR');
    const hora = agora.toLocaleTimeString('pt-BR');

    document.getElementById('relogio').textContent = `${data} - ${hora}`;

    setInterval(relogio, 1000);
}

relogio();

