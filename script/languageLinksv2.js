document.addEventListener('DOMContentLoaded', () => {
    // Get current page URL without the fragment
    let currentURL = window.location.href.split('#')[0];

    console.log(currentURL);

    // Base URL without language suffix or 'index.html'
    let baseURL = currentURL.replace(/(EN|ES)?\.html$/, '').replace(/index$/, '');

    console.log(baseURL);
    
    let languageLinksContainer = document.querySelector('.language-links');
    
    console.log(languageLinksContainer);

    // Determine the current language
    let isEnglish = currentURL.includes('EN.html');
    let isSpanish = currentURL.includes('ES.html');
    let isCatalan = !isEnglish && !isSpanish;

    // Generate language links
    let linksHTML = '';

    if (isCatalan) {
        // If in Catalan, create links for English and Spanish
        console.log("the actual page is CATALAN");
        linksHTML += `<a>cat</a>`;
        linksHTML += `<a href="${baseURL}indexEN.html">en</a>`;
        linksHTML += `<a href="${baseURL}indexES.html">es</a>`;
    } else if (isEnglish) {
        // If in English, create links for Catalan and Spanish
        console.log("the actual page is ENGLISH");
        linksHTML += `<a href="${baseURL}index.html">cat</a>`;
        linksHTML += `<a>en</a>`;
        linksHTML += `<a href="${baseURL}indexES.html">es</a>`;
    } else if (isSpanish) {
        // If in Spanish, create links for Catalan and English
        console.log("the actual page is SPANISH");
        linksHTML += `<a href="${baseURL}index.html">cat</a>`;
        linksHTML += `<a href="${baseURL}indexEN.html">en</a>`;
        linksHTML += `<a>es</a>`;
    }

    // Add links to the language-links container
    if (languageLinksContainer) {
        languageLinksContainer.innerHTML = linksHTML;
    }
});


/*

Cambios Realizados
Eliminación de #fragmentos: He eliminado cualquier fragmento (#) de la URL antes de procesarla (window.location.href.split('#')[0]).

Normalización de baseURL:

Primero eliminamos los sufijos de idioma (EN.html o ES.html) con .replace(/(EN|ES)?\.html$/, '').
Luego eliminamos la palabra "index" si es parte de la URL (.replace(/index$/, '')). Esto hará que, si estás en index.html, solo quede la URL base, por ejemplo, https://meowrhino.github.io/e300/.
Generación de Enlaces: He ajustado los enlaces para que el idioma se agregue de forma correcta como indexEN.html o indexES.html cuando sea necesario.

Notas
Cuando el sitio esté alojado online, y dependiendo de cómo esté configurado el servidor, puede que la URL sin index.html funcione de forma predeterminada (https://meowrhino.github.io/e300/). Es algo común, ya que los servidores suelen servir index.html automáticamente si no se especifica.
Los ajustes en baseURL asegurarán que la parte final de la URL se maneje de forma consistente, evitando URLs como index.htmlEN.html.
Prueba este código y verifica si se comporta como esperas tanto en local como en la versión alojada. Si sigue habiendo algún problema, no dudes en decírmelo y revisamos más detalles juntos.

*/ 