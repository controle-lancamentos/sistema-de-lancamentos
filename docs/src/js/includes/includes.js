document.body.setAttribute('data-loading', 'true');

async function includeHtml() {
    const includes = document.querySelectorAll('[data-include]');

    const promises = Array.from(includes).map(async el => {
        const file = el.getAttribute('data-include');

        try {
            const res = await fetch(file);
            if (!res.ok) throw new Error(`Erro ${res.status}`);
            const html = await res.text();
            el.innerHTML = html;
        } catch (err) {
            el.innerHTML = `Erro ao carregar ${file}: ${err.message}`;
        }
    });

    await Promise.all(promises);

    // Exibe o conteúdo após todos os includes estarem prontos
    document.body.removeAttribute('data-loading');
}

window.addEventListener('DOMContentLoaded', includeHtml);


function relogio() {
    const agora = new Date();
    const data = agora.toLocaleDateString('pt-BR');
    const hora = agora.toLocaleTimeString('pt-BR');
    document.getElementById('relogio').textContent = `${data} - ${hora}`;
}
setInterval(relogio, 1000);

relogio();

