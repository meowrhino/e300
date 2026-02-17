// ============================================================================
// UI.JS - Funcionalidades de interfaz de usuario
// ============================================================================

import { getCurrentLang } from './i18n.js';

// ============================================================================
// APLICAR ESTILOS A ENLACES
// ============================================================================
// Aplica clase .link-con-href a todos los enlaces con href
// y configura target="_blank" para enlaces externos
export function applyLinkStyles() {
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Ignorar enlaces de menú o idioma
    const isMenuLink = link.closest('.menu-links') !== null;
    const isLanguageLink = link.closest('.language-links') !== null;
    if (isMenuLink || isLanguageLink) return;

    // Añadir clase para estilo visual
    link.classList.add('link-con-href');

    const forceNewTab = link.dataset.forceNewTab === 'true';
    if (forceNewTab) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      return;
    }

    const isHashLink = href.startsWith('#');
    const isMailOrTel = href.startsWith('mailto:') || href.startsWith('tel:');
    let isExternal = false;

    try {
      const url = new URL(href, window.location.href);
      isExternal = url.origin !== window.location.origin;
    } catch {
      isExternal = false;
    }

    if (!isHashLink && !isMailOrTel && isExternal) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    } else {
      link.removeAttribute('target');
      link.removeAttribute('rel');
    }
  });
}

// ============================================================================
// ENLAZAR "ESTRUCTURAS 3000" A HOME
// ============================================================================
const ESTRUCTURAS_TEXT = 'Estructuras 3000';

function getHomeHref() {
  const lang = getCurrentLang();
  return `index.html?lang=${lang}`;
}

function linkifyEstructuras() {
  if (!document.body) return;

  const homeHref = getHomeHref();
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const text = node.nodeValue;
        if (!text || !text.includes(ESTRUCTURAS_TEXT)) {
          return NodeFilter.FILTER_REJECT;
        }

        const parent = node.parentNode;
        if (!parent || parent.nodeType !== Node.ELEMENT_NODE) {
          return NodeFilter.FILTER_REJECT;
        }

        const parentEl = parent;
        if (parentEl.closest && parentEl.closest('a')) {
          return NodeFilter.FILTER_REJECT;
        }

        const tagName = parentEl.tagName;
        if (
          tagName === 'SCRIPT'
          || tagName === 'STYLE'
          || tagName === 'NOSCRIPT'
          || tagName === 'TEXTAREA'
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach(node => {
    const parts = node.nodeValue.split(ESTRUCTURAS_TEXT);
    if (parts.length < 2) return;

    const fragment = document.createDocumentFragment();
    parts.forEach((part, index) => {
      if (part) {
        fragment.appendChild(document.createTextNode(part));
      }

      if (index < parts.length - 1) {
        const link = document.createElement('a');
        link.href = homeHref;
        link.textContent = ESTRUCTURAS_TEXT;
        link.dataset.forceNewTab = 'true';
        fragment.appendChild(link);
      }
    });

    node.parentNode.replaceChild(fragment, node);
  });
}

// ============================================================================
// TRANSICIONES DE PÁGINA
// ============================================================================
let pageTransitionsInitialized = false;
let isNavigating = false;

function resetPageTransitionState() {
  isNavigating = false;
  if (!document.body) return;
  document.body.classList.remove('page-leaving', 'lang-switching');
}

export function navigateWithFade(url) {
  if (!url || isNavigating) return;
  isNavigating = true;
  document.body.classList.add('page-leaving');
  window.setTimeout(() => {
    window.location.href = url;
  }, 240);
}

function handlePageTransitionClick(event) {
  if (event.defaultPrevented) return;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const link = event.target.closest('a');
  if (!link) return;
  if (link.target === '_blank' || link.hasAttribute('download')) return;

  const href = link.getAttribute('href');
  if (!href) return;
  if (href.startsWith('#')) return;
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
    return;
  }

  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return;
  }

  if (url.origin !== window.location.origin) return;
  if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
    return;
  }

  event.preventDefault();
  navigateWithFade(url.toString());
}

export function initPageTransitions() {
  if (pageTransitionsInitialized) return;
  pageTransitionsInitialized = true;
  document.addEventListener('click', handlePageTransitionClick, true);
  window.addEventListener('pageshow', resetPageTransitionState);
}

// ============================================================================
// INICIALIZAR POPUP DE IMÁGENES
// ============================================================================
// Crea un popup para visualizar imágenes en tamaño completo
export function initImagePopup() {
  // Crear estructura del popup si no existe
  if (!document.querySelector('.image-popup')) {
    const popup = document.createElement('div');
    popup.className = 'image-popup';
    popup.innerHTML = `
      <div class="image-popup-overlay"></div>
      <div class="image-popup-content">
        <img src="" alt="">
        <button class="image-popup-close">&times;</button>
      </div>
    `;
    document.body.appendChild(popup);
    
    // Event listeners para cerrar el popup
    const overlay = popup.querySelector('.image-popup-overlay');
    const closeBtn = popup.querySelector('.image-popup-close');
    const content = popup.querySelector('.image-popup-content');
    
    overlay.addEventListener('click', closeImagePopup);
    closeBtn.addEventListener('click', closeImagePopup);
    content.addEventListener('click', (event) => {
      if (event.target === content) {
        closeImagePopup();
      }
    });
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeImagePopup();
      }
    });
  }
}

// ============================================================================
// ABRIR POPUP DE IMAGEN
// ============================================================================
export function openImagePopup(imageSrc, imageAlt = '') {
  const popup = document.querySelector('.image-popup');
  const img = popup.querySelector('img');
  
  img.src = imageSrc;
  img.alt = imageAlt;
  popup.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// ============================================================================
// CERRAR POPUP DE IMAGEN
// ============================================================================
export function closeImagePopup() {
  const popup = document.querySelector('.image-popup');
  popup.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================================================
// HACER IMÁGENES CLICKEABLES
// ============================================================================
// Añade event listeners a imágenes para abrir popup
export function makeImagesClickable(selector = '.clickable-image') {
  const images = document.querySelectorAll(selector);
  
  images.forEach(img => {
    // Evitar duplicar event listeners
    if (img.dataset.clickable === 'true') return;
    
    img.style.cursor = 'pointer';
    img.dataset.clickable = 'true';
    
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openImagePopup(img.src, img.alt);
    });
  });
}

// ============================================================================
// INSERTAR ESPACIADORES ENTRE SECCIONES
// ============================================================================
function ensureSectionSpacers() {
  const container = document.querySelector('.container');
  if (!container) return;

  const children = Array.from(container.children);
  const sections = children.filter(child => child.tagName === 'SECTION');
  if (sections.length <= 1) return;

  container.classList.add('use-spacers');

  const existingSpacers = children.filter(child => child.classList.contains('section-spacer'));
  existingSpacers.forEach(spacer => {
    const prev = spacer.previousElementSibling;
    const next = spacer.nextElementSibling;
    const isValid = prev && next && prev.tagName === 'SECTION' && next.tagName === 'SECTION';
    if (!isValid) {
      spacer.remove();
    }
  });

  sections.forEach((section, index) => {
    if (index === sections.length - 1) return;
    const next = section.nextElementSibling;
    if (next && next.classList.contains('section-spacer')) return;

    const spacer = document.createElement('div');
    spacer.className = 'section-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    section.insertAdjacentElement('afterend', spacer);
  });
}

// ============================================================================
// SCROLL CENTRADO - SOLO DESKTOP
// ============================================================================
export function initCenteredScrolling() {
  // Solo aplicar en desktop
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    
    // Solo para links del menú
    if (!link.closest('.menu-links')) return;
    
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    
    event.preventDefault();
    
    const targetId = href.slice(1);
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;
    
    centerSection(targetSection);
  });
}

function centerSection(section) {
  const rect = section.getBoundingClientRect();
  const absoluteTop = window.pageYOffset + rect.top;
  const sectionHeight = rect.height;
  const viewportHeight = window.innerHeight;
  
  // Si la sección es más alta que el viewport, alinear arriba
  if (sectionHeight >= viewportHeight * 0.9) {
    window.scrollTo({
      top: absoluteTop,
      behavior: 'smooth'
    });
    return;
  }
  
  // Centrar verticalmente
  const scrollTo = absoluteTop - (viewportHeight / 2) + (sectionHeight / 2);
  
  window.scrollTo({
    top: Math.max(0, scrollTo),
    behavior: 'smooth'
  });
}

// ============================================================================
// INICIALIZAR TODAS LAS FUNCIONALIDADES DE UI
// ============================================================================
export function initUI() {
  linkifyEstructuras();
  applyLinkStyles();
  initPageTransitions();
  initImagePopup();
  makeImagesClickable();
  ensureSectionSpacers();
  initCenteredScrolling();
}
