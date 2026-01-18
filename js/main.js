// ============================================================================
// MAIN.JS - Sistema principal de e3000 modernizado
// ============================================================================

import { renderHome } from './home.js';
import { renderProject } from './project.js';
import { initLanguageSelector, getCurrentLang, getTranslation } from './i18n.js';
import { initMenu, updateMenuLanguage } from './menu.js';
import { initUI, applyLinkStyles } from './ui.js';

// Detectar tipo de página
const pageType = document.body.dataset.pageType;

// Inicializar según el tipo de página
if (pageType === 'home') {
  initHome();
} else if (pageType === 'proyecto') {
  initProject();
}

// ============================================================================
// INICIALIZACIÓN DE LA PÁGINA HOME
// ============================================================================
async function initHome() {
  try {
    // Cargar datos del home
    const response = await fetch('data/home.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const homeData = await response.json();
    
    // Renderizar el home
    renderHome(homeData);
    
    // Inicializar menú de navegación
    initMenu();
    
    // Inicializar funcionalidades de UI
    initUI();
    
    // Inicializar selector de idiomas
    initLanguageSelector(() => {
      renderHome(homeData);
      updateMenuLanguage();
      applyLinkStyles();
    });
    
  } catch (error) {
    console.error('[main] Error cargando home:', error);
    document.body.innerHTML = '<p style="padding: 2rem;">Error cargando la página</p>';
  }
}

// ============================================================================
// INICIALIZACIÓN DE LA PÁGINA DE PROYECTO
// ============================================================================
async function initProject() {
  try {
    // Obtener slug del proyecto desde la URL
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    
    if (!slug) {
      document.body.innerHTML = '<p style="padding: 2rem;">No se especificó ningún proyecto</p>';
      return;
    }
    
    // Cargar datos del proyecto
    const response = await fetch(`data/${slug}/${slug}.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const projectData = await response.json();
    
    // Renderizar el proyecto
    renderProject(projectData);
    
    // Inicializar funcionalidades de UI
    initUI();
    
    // Inicializar selector de idiomas
    initLanguageSelector(() => {
      renderProject(projectData);
      applyLinkStyles();
    });
    
    // Actualizar el enlace de "casa" según el idioma
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
      const lang = getCurrentLang();
      homeLink.textContent = getTranslation({
        ca: 'casa',
        es: 'casa',
        en: 'home'
      }, lang);
    }
    
  } catch (error) {
    console.error('[main] Error cargando proyecto:', error);
    document.body.innerHTML = '<p style="padding: 2rem;">Error cargando el proyecto</p>';
  }
}
