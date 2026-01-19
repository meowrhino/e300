// Renderizado anterior de la sección de servicios (no usado en producción).
import { getTranslation } from '../js/i18n.js';

export function renderServeis(serveis, lang) {
  const section = document.getElementById('serveis');
  if (!section) return;

  const serveisList = getTranslation(serveis, lang);
  const grid = section.querySelector('.serveis-grid');
  grid.innerHTML = '';

  if (Array.isArray(serveisList)) {
    serveisList.forEach(servei => {
      const card = document.createElement('div');
      card.className = 'servei-card';

      // Si el servicio tiene lista (separado por |)
      if (servei.includes('|')) {
        const parts = servei.split('|');
        const title = parts[0];
        const items = parts.slice(1);

        const h3 = document.createElement('h3');
        h3.textContent = title;
        card.appendChild(h3);

        const ul = document.createElement('ul');
        items.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        });
        card.appendChild(ul);
      } else {
        const h3 = document.createElement('h3');
        h3.textContent = servei;
        card.appendChild(h3);
      }

      grid.appendChild(card);
    });
  }
}
