// ============================================================================
// PROJECT.JS - Renderizado de páginas de proyectos
// ============================================================================

import { getCurrentLang, getTranslation } from './i18n.js';

// ============================================================================
// RENDERIZAR PROYECTO
// ============================================================================
export function renderProject(projectData) {
  const lang = getCurrentLang();
  
  // Actualizar meta tags
  updateMetaTags(projectData, lang);
  
  // Renderizar contenido del proyecto
  renderProjectContent(projectData, lang);
}

// ============================================================================
// ACTUALIZAR META TAGS
// ============================================================================
function updateMetaTags(projectData, lang) {
  const title = getTranslation(projectData.titulo, lang);
  document.title = `${title} - e3000`;
  
  // Actualizar lang del HTML
  document.documentElement.lang = lang;
}

// ============================================================================
// RENDERIZAR CONTENIDO DEL PROYECTO
// ============================================================================
function renderProjectContent(projectData, lang) {
  const container = document.getElementById('container-projecte');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Título con enlace opcional
  const h1 = document.createElement('h1');
  const titulo = getTranslation(projectData.titulo, lang);
  
  if (projectData.descripcion.link) {
    h1.innerHTML = `${titulo} `;
    const link = document.createElement('a');
    link.href = projectData.descripcion.link;
    link.target = '_blank';
    link.textContent = getTranslation(projectData.descripcion.link_text, lang) || projectData.descripcion.link;
    h1.appendChild(link);
  } else {
    h1.textContent = titulo;
  }
  container.appendChild(h1);
  
  // Subtítulo opcional (para thereis)
  if (projectData.descripcion.subtitle) {
    const subtitle = document.createElement('p');
    subtitle.style.fontStyle = 'italic';
    subtitle.textContent = getTranslation(projectData.descripcion.subtitle, lang);
    container.appendChild(subtitle);
  }
  
  // Video opcional (para escola3000)
  if (projectData.video) {
    const iframe = document.createElement('iframe');
    iframe.src = projectData.video.src;
    iframe.width = projectData.video.width || '640';
    iframe.height = projectData.video.height || '480';
    iframe.allow = 'autoplay';
    container.appendChild(iframe);
  }
  
  // Imagen principal
  if (projectData.primera_imatge) {
    const img = document.createElement('img');
    img.src = `data/${projectData.slug}/${projectData.primera_imatge.src}`;
    img.alt = projectData.primera_imatge.alt || titulo;
    img.classList.add('clickable-image');
    container.appendChild(img);
  }
  
  // Descripción
  const textos = getTranslation(projectData.descripcion.texto, lang);
  if (Array.isArray(textos)) {
    textos.forEach(texto => {
      const p = document.createElement('p');
      p.innerHTML = texto;
      container.appendChild(p);
    });
  }
  
  // Galería de imágenes
  if (projectData.imatges && projectData.imatges.length > 0) {
    const galeria = document.createElement('div');
    galeria.className = 'galeria';
    
    projectData.imatges.forEach(imgPath => {
      const img = document.createElement('img');
      img.src = `data/${projectData.slug}/${imgPath}`;
      img.alt = `Imatge del projecte ${titulo}`;
      img.classList.add('clickable-image');
      galeria.appendChild(img);
    });
    
    container.appendChild(galeria);
  }
}
