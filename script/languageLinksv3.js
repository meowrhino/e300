document.addEventListener('DOMContentLoaded', () => {
  // URL sin fragmentos ni nombre de fichero
  const url  = window.location.href.split('#')[0];
  const base = url.replace(/[^/]+\.html$/, '');  // deja sólo la ruta, acabada en '/'

  // Define tus idiomas y sufijos de fichero
  const langs = [
    { code: 'CA', label: 'cat', file: 'index.html' },
    { code: 'ES', label: 'es',  file: 'ES.html'    },
    { code: 'EN', label: 'en',  file: 'EN.html'    },
    // añade más { code, label, file } si necesitas otros idiomas
  ];

  const container = document.querySelector('.language-links');
  if (!container) return;

  // ¿Cuál es el fichero actual?
  const currentFile = url.split('/').pop(); // p.ej. "index.html" o "ES.html"
  const html = langs.map(lang => {
    if (lang.file === currentFile) {
      // idioma activo: sin enlace
      return `<a class="active">${lang.label}</a>`;
    } else {
      return `<a href="${base}${lang.file}">${lang.label}</a>`;
    }
  }).join('\n');

  container.innerHTML = html;
});