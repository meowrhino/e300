document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los <a> de la página
    let links = document.querySelectorAll('a');

    links.forEach(link => {
        if (link.hasAttribute('href') && link.getAttribute('href') !== '') {
            // Si tiene un href, asignar la clase 'link-con-href'
            link.classList.add('link-con-href');
        } else {
            // Si no tiene href o está vacío, asignar la clase 'link-sin-href'
            //link.classList.add('link-sin-href');
        }
    });
});
