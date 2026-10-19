# e3000

Sitio web modernizado de Estructuras 3000 con sistema de internacionalización basado en JSON.

## Características

- **Sistema multiidioma:** Catalán (idioma principal), español e inglés
- **Arquitectura basada en datos:** Todo el contenido está en archivos JSON
- **Imágenes optimizadas:** Todas las imágenes convertidas a formato WebP
- **Código modular:** JavaScript y CSS organizados y documentados
- **Diseño responsive:** Adaptado a dispositivos móviles y desktop

## Estructura del Proyecto

Sigue la receta de [meowrhino/JAMstack](https://github.com/meowrhino/JAMstack) desde el
2026-10-18 (rama `receta`). Para la asociación: [GUIA.md](GUIA.md). Si el build falla:
[CLAUDE.md](CLAUDE.md). **Este repo es la web de verdad** (estructuras3000.com): no hay copia
del cliente.

```
data/site.json         el nombre, la descripción y "lists": los proyectos de la home (ocultos: visible: false)
data/about.json        las secciones de la home: descripció, serveis, equipaments, contacte, membres
data/estatuts.json     los estatutos
projects/<slug>/       un proyecto: project.json (title, summary, text, image, photos, thumbnail…) + img/
schema/                qué campos lleva cada JSON (VS Code, el build y la vista previa)
index.html, proyecto.html   las plantillas, y la vista previa con Live Server
build/build.mjs        → dist/: la home y /<slug>/ en cada idioma (/, /es/, /en/) con su contenido y sus meta
js/house.js            la forma de la casa → la de antes (home.json y data/<slug>/<slug>.json)
js/carga.js            lee los JSON (en la vista previa, los revisa con schema/); projectUrl()
js/validar.js          el JSON Schema sin dependencias (de JAMstack)
```

- **El build** (`npm ci && node build/build.mjs`) escribe en `dist/` la home y una página por
  proyecto, en los tres idiomas (`/judici/`, `/es/judici/`, `/en/judici/`), cada una con title,
  description, og:image (sharp), canonical, hreflang y el contenido en su idioma dentro. El idioma
  sale de la ruta; `?lang=` solo vale en la vista previa, y los enlaces viejos (`/judici/?lang=es`,
  `proyecto.html?slug=`) redirigen a la página de verdad.
- **Publicar**: la Action (`.github/workflows/deploy.yml`) a GitHub Pages, en el dominio. Antes de la
  primera vez, Settings → Pages → Source: **GitHub Actions** (hoy es *legacy*: sirve `main` tal cual).

## Cómo Usar

1. **Abrir el sitio:** Simplemente abre `index.html` en un navegador web.
2. **Cambiar de idioma:** Haz clic en los enlaces de idioma (ca, es, en) en la esquina superior derecha.
3. **Navegar por proyectos:** Haz clic en cualquier proyecto para ver sus detalles.

## Cómo Añadir Contenido

### Añadir un nuevo proyecto

1. Crea una carpeta en `data/` con el nombre del proyecto (slug).
2. Crea un archivo JSON con el mismo nombre dentro de esa carpeta.
3. Añade las imágenes del proyecto en `data/{proyecto}/img/`.
4. Añade el proyecto a la lista `projectes_visibles` en `data/home.json`.

### Editar contenido existente

Simplemente edita los archivos JSON correspondientes en la carpeta `data/`.

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript ES6+ (Módulos)
- WebP para imágenes

## Notas de Desarrollo

- El sistema de i18n permite cambiar de idioma sin recargar la página.
- Todas las imágenes están en formato WebP para mejor rendimiento.
- El código JavaScript está modularizado para facilitar el mantenimiento.
- El CSS está organizado por secciones con comentarios claros.

## Créditos

Modernización realizada por Manus AI - Enero 2026
