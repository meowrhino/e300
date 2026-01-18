# e3000 - Modernizado

Sitio web modernizado de Estructuras 3000 con sistema de internacionalización basado en JSON.

## Características

- **Sistema multiidioma:** Catalán (idioma principal), español e inglés
- **Arquitectura basada en datos:** Todo el contenido está en archivos JSON
- **Imágenes optimizadas:** Todas las imágenes convertidas a formato WebP
- **Código modular:** JavaScript y CSS organizados y documentados
- **Diseño responsive:** Adaptado a dispositivos móviles y desktop

## Estructura del Proyecto

```
e300-modernizado/
├── index.html              # Página principal
├── proyecto.html           # Plantilla para páginas de proyecto
├── 404.html               # Página de error 404
├── css/
│   └── style.css          # Estilos refactorizados y organizados
├── js/
│   ├── main.js            # Punto de entrada de la aplicación
│   ├── home.js            # Lógica de la página principal
│   ├── project.js         # Lógica de las páginas de proyecto
│   └── i18n.js            # Sistema de internacionalización
├── data/
│   ├── home.json          # Contenido de la página principal
│   └── {proyecto}/        # Carpeta de cada proyecto
│       ├── {proyecto}.json # Contenido del proyecto
│       └── img/           # Imágenes del proyecto
├── img/                   # Imágenes globales (logo, etc.)
└── manus/
    └── proceso.md         # Documentación del proceso de modernización
```

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
