// ============================================================================
// MAIN.JS - Sistema principal de e3000 modernizado
// ============================================================================

import { getHome, getProject, homeUrl } from './carga.js';
import { renderHome } from './home.js';
import { renderProject } from './project.js';
import { initLanguageSelector, getCurrentLang, getTranslation } from './i18n.js';
import { initMenu, updateMenuLanguage } from './menu.js';
import { initUI } from './ui.js';

// Detectar tipo de página
const pageType = document.body.dataset.pageType;
let popstateInitialized = false;

function withLangTransition(updateFn) {
  const body = document.body;
  if (!body) {
    Promise.resolve()
      .then(updateFn)
      .catch((error) => {
        console.error('[main] Error actualizando idioma:', error);
      });
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    body.removeEventListener('transitionend', onTransitionEnd);
    let updatePromise;
    try {
      updatePromise = Promise.resolve(updateFn());
    } catch (error) {
      console.error('[main] Error actualizando idioma:', error);
      updatePromise = Promise.resolve();
    }
    updatePromise
      .catch((error) => {
        console.error('[main] Error actualizando idioma:', error);
      })
      .finally(() => {
        requestAnimationFrame(() => {
          body.classList.remove('lang-switching');
        });
      });
  };

  const onTransitionEnd = (event) => {
    if (event.target !== body || event.propertyName !== 'opacity') return;
    finish();
  };

  body.classList.add('lang-switching');
  body.addEventListener('transitionend', onTransitionEnd);
  window.setTimeout(finish, 260);
}

function initLangPopstate(handler) {
  if (popstateInitialized) return;
  popstateInitialized = true;
  window.addEventListener('popstate', () => {
    Promise.resolve()
      .then(handler)
      .catch((error) => {
        console.error('[main] Error actualizando idioma:', error);
      });
  });
}

async function refreshHomeContent(homeData, { updateMenu = false } = {}) {
  await renderHome(homeData);
  if (updateMenu) {
    updateMenuLanguage();
  } else {
    initMenu();
  }
  initUI();
}

async function refreshProjectContent(projectData) {
  renderProject(projectData);
  initUI();
  updateHomeLink();
}

function updateHomeLink() {
  const homeLink = document.getElementById('home-link');
  if (!homeLink) return;
  const lang = getCurrentLang();
  homeLink.textContent = getTranslation({
    ca: 'casa',
    es: 'casa',
    en: 'home'
  }, lang);
  homeLink.href = homeUrl(lang);
}

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
    const homeData = await getHome();
    
    // Renderizar el home
    await refreshHomeContent(homeData);
    
    const handleLanguageChange = () => {
      withLangTransition(() => refreshHomeContent(homeData, { updateMenu: true }));
    };
    
    // Inicializar selector de idiomas
    initLanguageSelector(handleLanguageChange);
    
    initLangPopstate(() => {
      return refreshHomeContent(homeData, { updateMenu: true }).then(() => {
        initLanguageSelector(handleLanguageChange);
      });
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
    // de ?slug= (la vista prèvia, i els enllaços vells) o de la pàgina /<slug>/ que escriu el build
    const slug = params.get('slug') || window.__SLUG__;
    
    if (!slug) {
      document.body.innerHTML = '<p style="padding: 2rem;">No se especificó ningún proyecto</p>';
      return;
    }
    
    // Cargar datos del proyecto
    const projectData = await getProject(slug);
    
    await refreshProjectContent(projectData);
    
    const handleLanguageChange = () => {
      withLangTransition(() => refreshProjectContent(projectData));
    };
    
    // Inicializar selector de idiomas
    initLanguageSelector(handleLanguageChange);
    
    initLangPopstate(() => {
      return refreshProjectContent(projectData).then(() => {
        initLanguageSelector(handleLanguageChange);
      });
    });
    
  } catch (error) {
    console.error('[main] Error cargando proyecto:', error);
    document.body.innerHTML = '<p style="padding: 2rem;">Error cargando el proyecto</p>';
  }
}
