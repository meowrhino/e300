// ============================================================================
// MENU.JS - Sistema de menú de navegación con sección activa
// ============================================================================

import { getCurrentLang, getTranslation } from './i18n.js';

// Definición de enlaces del menú con sus traducciones
const MENU_ITEMS = [
  {
    id: 'logo-container',
    label: {
      ca: 'inici',
      es: 'inicio',
      en: 'home'
    }
  },
  {
    id: 'descripcio',
    label: {
      ca: 'descripció',
      es: 'descripción',
      en: 'description'
    }
  },
  {
    id: 'serveis',
    label: {
      ca: 'serveis',
      es: 'servicios',
      en: 'services'
    }
  },
  {
    id: 'equipaments',
    label: {
      ca: '🔨 equipaments',
      es: '🔨 equipamientos',
      en: '🔨 facilities'
    }
  },
  {
    id: 'projectes',
    label: {
      ca: 'projectes',
      es: 'proyectos',
      en: 'projects'
    }
  },
  {
    id: 'contacte',
    label: {
      ca: 'contacte',
      es: 'contacto',
      en: 'contact'
    }
  },
  {
    id: 'membres',
    label: {
      ca: 'membres',
      es: 'miembros',
      en: 'members'
    }
  },
  {
    id: 'estatuts',
    label: {
      ca: 'estatuts',
      es: 'estatutos',
      en: 'statutes'
    }
  }
];

let activeObserver = null;

// ============================================================================
// INICIALIZAR MENÚ DE NAVEGACIÓN
// ============================================================================
export function initMenu() {
  const container = document.querySelector('.menu-links');
  if (!container) {
    console.warn('[menu] No se encontró el contenedor .menu-links');
    return;
  }
  
  // Renderizar enlaces del menú
  renderMenuLinks(container);
  
  // Inicializar observador de secciones activas
  initActiveMenuObserver();
}

// ============================================================================
// RENDERIZAR ENLACES DEL MENÚ
// ============================================================================
function renderMenuLinks(container) {
  const lang = getCurrentLang();
  container.innerHTML = '';
  
  MENU_ITEMS.forEach(item => {
    const link = document.createElement('a');
    link.href = `#${item.id}`;
    link.textContent = getTranslation(item.label, lang);
    link.dataset.section = item.id;
    container.appendChild(link);
  });
}

// ============================================================================
// ACTUALIZAR MENÚ AL CAMBIAR IDIOMA
// ============================================================================
export function updateMenuLanguage() {
  const container = document.querySelector('.menu-links');
  if (!container) return;
  
  const activeSection = container.querySelector('a.active');
  const activeSectionId = activeSection ? activeSection.dataset.section : null;

  renderMenuLinks(container);
  
  // Mantener la sección activa después de actualizar
  if (activeSectionId) {
    const newActiveLink = container.querySelector(`a[data-section="${activeSectionId}"]`);
    if (newActiveLink) {
      newActiveLink.classList.add('active');
    }
  }

  initActiveMenuObserver();
}

// ============================================================================
// INICIALIZAR OBSERVADOR DE SECCIONES ACTIVAS
// ============================================================================
function initActiveMenuObserver() {
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }

  const sections = Array.from(document.querySelectorAll('section'));
  const menuLinks = Array.from(document.querySelectorAll('.menu-links a'));
  
  if (sections.length === 0 || menuLinks.length === 0) {
    console.warn('[menu] No hay secciones o enlaces para observar');
    return;
  }

  const visibilityMap = new Map();
  sections.forEach(section => {
    visibilityMap.set(section.id, 0);
  });

  const setActiveLink = (sectionId) => {
    if (!sectionId) return;
    menuLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === sectionId);
    });
  };

  const getMostVisibleSection = () => {
    let bestSectionId = null;
    let bestVisibility = 0;
    sections.forEach(section => {
      const visibility = visibilityMap.get(section.id) || 0;
      if (visibility > bestVisibility) {
        bestVisibility = visibility;
        bestSectionId = section.id;
      }
    });
    return bestSectionId;
  };
  
  // Opciones del IntersectionObserver
  const options = {
    root: null,
    rootMargin: '0px 0px 0px 0px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
  };
  
  // Callback cuando una sección entra en el viewport
  const callback = (entries) => {
    entries.forEach(entry => {
      visibilityMap.set(entry.target.id, entry.isIntersecting ? entry.intersectionRect.height : 0);
    });

    let activeSectionId = getMostVisibleSection();
    if (!activeSectionId) {
      const scrolledBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (scrolledBottom) {
        activeSectionId = sections[sections.length - 1].id;
      }
    }

    setActiveLink(activeSectionId);
  };
  
  // Crear observador
  activeObserver = new IntersectionObserver(callback, options);
  
  // Observar cada sección
  sections.forEach(section => {
    activeObserver.observe(section);
  });
}
