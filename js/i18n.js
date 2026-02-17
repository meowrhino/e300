// ============================================================================
// I18N.JS - Sistema de internacionalización
// ============================================================================

// Idiomas disponibles
const AVAILABLE_LANGS = ['ca', 'es', 'en'];
const DEFAULT_LANG = 'ca';

// ============================================================================
// OBTENER IDIOMA ACTUAL
// ============================================================================
export function getCurrentLang() {
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get('lang');
  
  // Si hay parámetro lang en la URL y es válido, usarlo
  if (langParam && AVAILABLE_LANGS.includes(langParam)) {
    return langParam;
  }
  
  // Si no, usar el idioma por defecto
  return DEFAULT_LANG;
}

// ============================================================================
// OBTENER TRADUCCIÓN
// ============================================================================
export function getTranslation(translations, lang = null) {
  const currentLang = lang || getCurrentLang();
  
  // Si translations es un string, devolverlo directamente
  if (typeof translations === 'string') {
    return translations;
  }
  
  // Si translations es un objeto con idiomas
  if (translations && typeof translations === 'object') {
    return translations[currentLang] || translations[DEFAULT_LANG] || '';
  }
  
  return '';
}

// ============================================================================
// CAMBIAR IDIOMA
// ============================================================================
export function changeLang(newLang) {
  if (!AVAILABLE_LANGS.includes(newLang)) {
    console.warn(`[i18n] Idioma no válido: ${newLang}`);
    return;
  }
  
  const url = new URL(window.location);
  url.searchParams.set('lang', newLang);
  window.location.href = url.toString();
}

// ============================================================================
// INICIALIZAR SELECTOR DE IDIOMAS
// ============================================================================
export function initLanguageSelector(onLanguageChange = null) {
  const container = document.querySelector('.language-links');
  if (!container) return;
  
  const currentLang = getCurrentLang();
  container.innerHTML = '';
  
  // Crear enlaces para cada idioma
  AVAILABLE_LANGS.forEach(lang => {
    const link = document.createElement('a');
    link.textContent = lang;
    link.href = '#';
    
    // Aria-label para accesibilidad
    const langNames = { ca: 'catal\u00e0', es: 'castellano', en: 'english' };
    link.setAttribute('aria-label', `Canviar idioma a ${langNames[lang]}`);
    
    // Marcar el idioma actual como activo
    if (lang === currentLang) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'true');
    }
    
    // Evento de clic
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (lang !== currentLang) {
        // Si hay callback, ejecutarlo
        if (onLanguageChange) {
          // Cambiar parámetro lang en la URL sin recargar
          const url = new URL(window.location);
          url.searchParams.set('lang', lang);
          window.history.pushState({}, '', url);
          
          // Ejecutar callback
          onLanguageChange();
          
          // Actualizar selector
          initLanguageSelector(onLanguageChange);
        } else {
          // Si no hay callback, recargar la página
          changeLang(lang);
        }
      }
    });
    
    container.appendChild(link);
  });
}

// ============================================================================
// OBTENER NOMBRE DE IDIOMA
// ============================================================================
export function getLangName(lang) {
  const names = {
    ca: 'Català',
    es: 'Español',
    en: 'English'
  };
  return names[lang] || lang;
}
