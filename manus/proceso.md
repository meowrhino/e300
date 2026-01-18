# Proceso de Modernización del Repositorio e300

**Fecha:** 18 de enero de 2026
**Hora:** 08:00 GMT+1

## Sinopsis

Este documento detalla el proceso completo de modernización del repositorio `e300`. El objetivo principal ha sido transformar un sitio web estático basado en múltiples archivos HTML en una aplicación web dinámica, modular y fácil de mantener. La nueva versión utiliza un sistema de internacionalización (i18n) basado en JSON, optimiza las imágenes a formato WebP y refactoriza el código CSS y JavaScript para mejorar su legibilidad y eficiencia.

## Fases de la Modernización

### 1. Análisis y Planificación

- **Análisis Comparativo:** Se realizó un análisis comparativo entre el repositorio `e300` y `andreacarilla` para identificar las mejores prácticas y definir la arquitectura objetivo.
- **Auditoría de Contenido:** Se auditó el contenido existente, incluyendo textos, imágenes y estructura de archivos, para planificar la migración.
- **Hoja de Ruta:** Se elaboró una hoja de ruta detallada con los pasos a seguir para la modernización.

### 2. Creación de la Nueva Estructura de Archivos

Se creó una nueva estructura de carpetas más organizada y modular:

- `/data`: Contiene todos los archivos JSON con el contenido de la web.
  - `/data/home.json`: Contenido de la página principal.
  - `/data/{proyecto}/{proyecto}.json`: Contenido específico de cada proyecto.
- `/css`: Contiene la hoja de estilos refactorizada.
- `/js`: Contiene los módulos de JavaScript.
- `/img`: Contiene las imágenes globales (logo, etc.).
- `/manus`: Contiene la documentación del proceso.

### 3. Optimización de Imágenes

- **Conversión a WebP:** Todas las imágenes en formato JPG y PNG fueron convertidas a WebP para reducir su tamaño y mejorar el rendimiento de la web. Se utilizó la herramienta `cwebp` para la conversión.
- **Reorganización:** Las imágenes se reorganizaron dentro de la nueva estructura de carpetas, asociando cada imagen a su proyecto correspondiente en la carpeta `data`.

### 4. Implementación del Sistema de Internacionalización (i18n)

- **Extracción de Contenido:** Se extrajo todo el contenido textual de los archivos HTML originales.
- **Creación de Archivos JSON:** Se crearon archivos JSON para la página principal (`home.json`) y para cada proyecto. Estos archivos contienen los textos en tres idiomas: catalán (ca), español (es) e inglés (en).
- **Módulo `i18n.js`:** Se desarrolló un módulo de JavaScript (`i18n.js`) para gestionar la carga de traducciones de forma dinámica. Este módulo se encarga de:
  - Detectar el idioma actual a partir de un parámetro en la URL (`?lang=es`).
  - Cargar la traducción correspondiente del archivo JSON.
  - Cambiar de idioma sin necesidad de recargar la página.

### 5. Desarrollo del Sistema JavaScript Modular

Se ha refactorizado todo el código JavaScript en un sistema modular para mejorar su mantenibilidad:

- **`main.js`:** Es el punto de entrada de la aplicación. Se encarga de detectar el tipo de página (home o proyecto) y de inicializar los módulos correspondientes.
- **`home.js`:** Contiene la lógica para renderizar la página principal a partir de los datos de `home.json`.
- **`project.js`:** Contiene la lógica para renderizar las páginas de proyecto a partir de los datos de los JSON de cada proyecto.
- **`i18n.js`:** Gestiona todo lo relacionado con la internacionalización.

### 6. Refactorización del CSS

- **Reorganización:** Se ha reorganizado la hoja de estilos `style.css` con comentarios para delimitar claramente cada sección (tipografía, layout, secciones, etc.).
- **Limpieza:** Se ha eliminado código CSS innecesario y se han mejorado algunas reglas para que sean más eficientes y legibles.
- **Consistencia:** Se ha asegurado la consistencia en el estilo y el formato del código.

## Conclusión

El resultado de esta modernización es un sitio web más rápido, eficiente y fácil de actualizar. La nueva estructura basada en datos permite añadir o modificar contenido sin necesidad de tocar el código HTML, y el sistema de i18n simplifica enormemente la gestión de los diferentes idiomas. El código, tanto JavaScript como CSS, es ahora más limpio, modular y documentado, lo que facilitará su mantenimiento y futuras ampliaciones.
