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


function relogio() {
    const agora = new Date();

    const data = agora.toLocaleDateString('pt-BR');
    const hora = agora.toLocaleTimeString('pt-BR');

    document.getElementById('relogio').textContent = `${data} - ${hora}`;

    setInterval(relogio, 1000);
}

relogio();

document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.menu .link');
    const currentPath = window.location.pathname;

    links.forEach(link => {
      // Remove a classe ativo de todos
      link.classList.remove('ativo');

      // Adiciona apenas se o href bater com o pathname atual
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('ativo');
      }
    });
  });

