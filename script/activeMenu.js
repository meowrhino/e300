document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const menuLinks = document.querySelectorAll('.menu-links a');

    const options = {
        root: null,
        rootMargin: '0px 0px -30% 0px', // Ajustar el margen inferior para activar antes de que la sección esté completamente visible
        threshold: 0.1 // Reducir el umbral para detectar la sección con menos visibilidad
    };

    // Callback para el Intersection Observer
    const callback = (entries) => {
        entries.forEach(entry => {
            console.log('Entry:', entry.target.id, entry.intersectionRatio);
            if (entry.isIntersecting) {
                menuLinks.forEach(link => link.classList.remove('active'));

                let activeLink = document.querySelector(`.menu-links a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(callback, options);

    // Observar cada sección y loggear su tamaño
    sections.forEach(section => {
        console.log(`Observando sección: ${section.id}, Altura: ${section.offsetHeight}`);
        observer.observe(section);
    });
});



//removeMobileHoverEffect()

document.addEventListener('DOMContentLoaded', function() {
    // Código previo del activeMenu.js para manejar las secciones activas
  
    // Función para manejar el hover de los enlaces en dispositivos móviles
    const links = document.querySelectorAll('.menu-links a');
  
    links.forEach(link => {
      link.addEventListener('click', function() {
        links.forEach(l => l.classList.remove('hovered')); // Remueve el hover de todos los enlaces
        this.classList.add('hovered'); // Añade la clase de hover solo al enlace actual
      });
    });
  });
  
  
