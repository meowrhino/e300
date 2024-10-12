document.addEventListener('DOMContentLoaded', () => {
    // Get current page URL
    let currentURL = window.location.href;

    console.log(currentURL);

    let baseURL = currentURL.replace(/(EN|ES)\.html$/, ''); // Base URL without language suffix

    console.log(baseURL);
    
    let languageLinksContainer = document.querySelector('.language-links');
    
    console.log(languageLinksContainer);

    let whereAmI = baseURL.split('/').pop().replace(/\.html$/, '');

    console.log(whereAmI);

    // Determine the current language
    let isEnglish = currentURL.includes('EN.html');
    let isSpanish = currentURL.includes('ES.html');
    let isCatalan = !isEnglish && !isSpanish;

    // Generate language links
    let linksHTML = '';

    if (isCatalan) {
        // If in Catalan, create links for English and Spanish
        console.log("the actual page is CATALAN")
        linksHTML += `<a>cat</a>`
        linksHTML += `<a href="${baseURL}EN.html">en</a>`;
        linksHTML += `<a href="${baseURL}ES.html">es</a>`;
    } else if (isEnglish) {
        // If in English, create links for Catalan and Spanish
        console.log("the actual page is ENGLISH")
        linksHTML += `<a href="${baseURL}.html">cat</a>`;
        linksHTML += `<a>en</a>`
        linksHTML += `<a href="${baseURL}ES.html">es</a>`;
    } else if (isSpanish) {
        // If in Spanish, create links for Catalan and English
        console.log("the actual page is SPANISH")
        linksHTML += `<a href="${baseURL}.html">cat</a>`;
        linksHTML += `<a href="${baseURL}EN.html">en</a>`;
        linksHTML += `<a>es</a>`
    }

    // Add links to the language-links container
    if (languageLinksContainer) {
        languageLinksContainer.innerHTML = linksHTML;
    }
});