// ============================================================================
// HOME.JS - Renderizado de la página principal
// ============================================================================

import { getCurrentLang, getTranslation } from './i18n.js';

// ============================================================================
// RENDERIZAR HOME
// ============================================================================
export async function renderHome(homeData) {
  const lang = getCurrentLang();
  
  // Actualizar meta tags
  updateMetaTags(homeData, lang);
  
  // Renderizar secciones
  renderDescripcion(homeData.descripcio, lang);
  renderServeis(homeData.serveis, lang);
  renderProjectes(homeData.projectes_visibles, lang);
  renderContacte(homeData.contacte, lang);
  renderMembres(homeData.membres, lang);
  
  // Cargar y renderizar estatutos
  await renderEstatuts(lang);
}

// ============================================================================
// ACTUALIZAR META TAGS
// ============================================================================
function updateMetaTags(homeData, lang) {
  const description = getTranslation(homeData.meta.description, lang);
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', description);
  }
  
  // Actualizar lang del HTML
  document.documentElement.lang = lang;
}

// ============================================================================
// RENDERIZAR DESCRIPCIÓN
// ============================================================================
function renderDescripcion(descripcio, lang) {
  const section = document.getElementById('descripcio');
  if (!section) return;
  
  const paragraphs = getTranslation(descripcio, lang);
  
  section.innerHTML = '<div class=""></div>';
  const container = section.querySelector('div');
  
  if (Array.isArray(paragraphs)) {
    paragraphs.forEach(text => {
      const p = document.createElement('p');
      p.innerHTML = text;
      container.appendChild(p);
    });
  }
}

// ============================================================================
// RENDERIZAR SERVICIOS
// ============================================================================
function renderServeis(serveis, lang) {
  const section = document.getElementById('serveis');
  if (!section) return;
  
  section.innerHTML = '';
  const serveisList = getTranslation(serveis, lang);
  if (!Array.isArray(serveisList)) return;

  const accordions = [];
  serveisList.forEach(servei => {
    if (!servei || !servei.title) return;

    const details = document.createElement('details');
    details.className = 'servei-accordion';
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      accordions.forEach(other => {
        if (other !== details) {
          other.open = false;
        }
      });
    });

    const summary = document.createElement('summary');
    const titleText = String(servei.title).trim();
    const colonIndex = titleText.indexOf(':');
    if (colonIndex !== -1) {
      const prefix = titleText.slice(0, colonIndex).trim();
      const suffix = titleText.slice(colonIndex + 1).trim();

      const prefixSpan = document.createElement('span');
      prefixSpan.className = 'servei-accordion-title';
      prefixSpan.textContent = prefix;

      const suffixSpan = document.createElement('span');
      suffixSpan.className = 'servei-accordion-link';
      suffixSpan.textContent = `: ${suffix}`;

      summary.appendChild(prefixSpan);
      summary.appendChild(suffixSpan);
    } else {
      summary.textContent = titleText;
    }
    details.appendChild(summary);

    const content = document.createElement('div');
    content.className = 'servei-accordion-content';
    content.innerHTML = servei.content_html || '';
    details.appendChild(content);

    accordions.push(details);
    section.appendChild(details);
  });
}

// ============================================================================
// RENDERIZAR PROYECTOS
// ============================================================================
function renderProjectes(projectes, lang) {
  const section = document.getElementById('projectes');
  if (!section) return;
  
  section.innerHTML = '';
  
  if (Array.isArray(projectes)) {
    projectes.forEach(project => {
      if (project.visible === false) return;
      
      const projectItem = document.createElement('div');
      projectItem.className = 'project-item';
      const projectUrl = `proyecto.html?slug=${project.slug}&lang=${lang}`;
      projectItem.setAttribute('role', 'link');
      projectItem.setAttribute('tabindex', '0');
      projectItem.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        window.location.href = projectUrl;
      });
      projectItem.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.location.href = projectUrl;
        }
      });
      
      const contingut = document.createElement('div');
      contingut.className = 'project-item-contingut';
      
      // Título
      const h2 = document.createElement('h2');
      h2.textContent = project.name;
      contingut.appendChild(h2);
      
      // Imagen con enlace
      const imgLink = document.createElement('a');
      imgLink.href = projectUrl;
      const img = document.createElement('img');
      const thumbnail = project.thumbnail || '';
      const isFullPath = /^(https?:)?\/\//.test(thumbnail)
        || thumbnail.startsWith('data/')
        || thumbnail.startsWith('img/')
        || thumbnail.startsWith('./')
        || thumbnail.startsWith('../');
      img.src = isFullPath ? thumbnail : `img/${thumbnail}`;
      img.alt = project.name;
      imgLink.appendChild(img);
      contingut.appendChild(imgLink);
      
      // Resumen
      if (project.resumen) {
        const p = document.createElement('p');
        p.innerHTML = getTranslation(project.resumen, lang);
        contingut.appendChild(p);
      }
      
      projectItem.appendChild(contingut);
      
      // Enlace "veure més"
      const moreLink = document.createElement('a');
      moreLink.href = projectUrl;
      const moreDiv = document.createElement('div');
      moreDiv.className = 'projecte-veure-mes';
      moreDiv.textContent = getTranslation({
        ca: 'veure més',
        es: 'ver más',
        en: 'see more'
      }, lang);
      moreLink.appendChild(moreDiv);
      projectItem.appendChild(moreLink);
      
      section.appendChild(projectItem);
    });
  }
}

// ============================================================================
// RENDERIZAR CONTACTO
// ============================================================================
function renderContacte(contacte, lang) {
  const section = document.getElementById('contacte');
  if (!section) return;
  
  section.innerHTML = '';
  
  // Email
  const pEmail = document.createElement('p');
  const emailLink = document.createElement('a');
  emailLink.href = `mailto:${contacte.email}`;
  emailLink.textContent = contacte.email;
  pEmail.appendChild(emailLink);
  section.appendChild(pEmail);
  
  // Dirección
  const pAddress = document.createElement('p');
  const addressLink = document.createElement('a');
  addressLink.href = contacte.maps_url;
  addressLink.target = '_blank';
  addressLink.textContent = contacte.address;
  pAddress.appendChild(addressLink);
  section.appendChild(pAddress);

  const pWeb = document.createElement('p');
  pWeb.className = 'contacte-web';
  const webLink = document.createElement('a');
  webLink.href = 'https://meowrhino.studio';
  webLink.textContent = 'web: meowrhino.studio';
  pWeb.appendChild(webLink);
  section.appendChild(pWeb);
}

// ============================================================================
// RENDERIZAR MIEMBROS
// ============================================================================
function renderMembres(membres, lang) {
  const section = document.getElementById('membres');
  if (!section) return;
  
  section.innerHTML = '';
  
  if (Array.isArray(membres)) {
    membres.forEach(membre => {
      const membreDiv = document.createElement('div');
      membreDiv.className = 'membre';
      
      // Cargo
      const h2 = document.createElement('h2');
      h2.textContent = getTranslation(membre.carrec, lang);
      membreDiv.appendChild(h2);
      
      // Nombre y pronombres (con enlace si existe)
      const h3 = document.createElement('h3');
      const pronomsSpan = document.createElement('span');
      pronomsSpan.className = 'pronoms';
      pronomsSpan.textContent = membre.pronoms;
      h3.appendChild(pronomsSpan);
      h3.appendChild(document.createTextNode(' '));
      
      if (membre.link) {
        const nameLink = document.createElement('a');
        nameLink.href = membre.link;
        nameLink.target = '_blank';
        nameLink.textContent = membre.nom;
        h3.appendChild(nameLink);
      } else {
        h3.appendChild(document.createTextNode(membre.nom));
      }
      
      membreDiv.appendChild(h3);
      
      // Bio
      const p = document.createElement('p');
      p.innerHTML = getTranslation(membre.bio, lang);
      const strong = document.createElement('strong');
      strong.textContent = membre.lloc_any;
      p.appendChild(document.createTextNode(' '));
      p.appendChild(strong);
      membreDiv.appendChild(p);
      
      section.appendChild(membreDiv);
    });
  }
}

// ============================================================================
// RENDERIZAR ESTATUTOS
// ============================================================================
async function renderEstatuts(lang) {
  const section = document.getElementById('estatuts');
  if (!section) return;
  
  try {
    // Cargar datos de estatutos
    const response = await fetch('data/estatuts/estatuts.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const estatutsData = await response.json();
    
    // Obtener contenido en el idioma actual
    const content = estatutsData[lang];
    if (!content) {
      console.warn(`[home] No hay estatutos para el idioma: ${lang}`);
      return;
    }
    
    // Renderizar contenido
    section.innerHTML = '';
    
    const h2 = document.createElement('h2');
    h2.textContent = content.title;
    section.appendChild(h2);
    
    if (content.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.style.fontStyle = 'italic';
      subtitle.textContent = content.subtitle;
      section.appendChild(subtitle);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = content.content_html;
    section.appendChild(contentDiv);
    
  } catch (error) {
    console.error('[home] Error cargando estatutos:', error);
    section.innerHTML = '<p>Error cargando los estatutos</p>';
  }
}
