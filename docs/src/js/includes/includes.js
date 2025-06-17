/*function includeHtml() {
    document.querySelectorAll('[data-include]').forEach(async (el) => {
        const file = el.getAttribute('data-include');
        const res = await fetch(file);

        if (res.ok) {
            el.innerHTML = await res.text();

        } else {
            el.innerHTML = `Erro ao carregar ${file}</p>`;

        }
    });
}*/

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

window.addEventListener('DOMContentLoaded', includeHtml);


document.querySelectorAll('.menu .link').forEach(link => {
    link.addEventListener('clik', function (e) {
        e.preventDefault();

        document.querySelectorAll('.menu . link').forEach( el => el.classList.remove('ativo'));

        this.classList.add('ativo');
    });
});