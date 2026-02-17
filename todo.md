17-02-2026
que el hipervinculo de estructuras 3000 se abra en una pestaña nueva



pasar todas las imágenes a webp

pasar al formato basado en .json

limpiar y simplificar codigo

ver como integrar los idiomas en el data.json




cosas que faltan:

carpeta con todo: https://drive.google.com/drive/folders/1tpYcdLs6eCrtPMql4LfNotzuxwePNtB2?usp=sharing

seccion servicios: guardar la seccion actual en algun lugar y que haya el contenido de aqui https://docs.google.com/document/d/16hcYfpz9ihXXUWIyrLOMrK2P48XuB5CrszeTznC6GQ8/edit?tab=t.0 en un desplegable (traducirlo con chagpt)

y proyectos: https://docs.google.com/document/d/1nBgmLLdLHoFItjRGVZDzgxrlHJ2KzfDf_EZ84LTTnE4/edit?tab=t.0. hacelro en catalan y traducirlo con chatgpt al castellano luego

si no hay imagenes usar la imagen que te prepara joan boix de estructuras3000

revisar SEO

pensar en EASTER EGGS

2026-01-18

añade todo y este texto "1 cualquier click navegue al proyecto
2 si, los enlaces funcionan asi
3 si

SEO: 1 ... no se, la gracia es que el contenido de la pagina se genere asi, sabes?
2 adelante
3 adelante, se podrian generar a partir de la estructura de datos ya presente"

Findings

Alta: En la home, makeImagesClickable intercepta el click de las imágenes (preventDefault), así que ese click no navega al proyecto y contradice “todo el click debe llevar al proyecto”. ui.js (line 90), home.js (line 143)
Alta: En páginas de proyecto, las imágenes tienen dos handlers (popup de ui.js + popup de project.js), y un solo click puede abrir dos overlays. ui.js (line 90), project.js (line 116), main.js (line 79)
Media: applyLinkStyles marca como externos todos los links que no sean menú/idioma ni #, así que enlaces internos (proyectos) abren en nueva pestaña e introducen un comportamiento inconsistente. ui.js (line 10)
Media: Varios links con target="_blank" no añaden rel="noopener noreferrer", dejando un vector de reverse‑tabnabbing. ui.js (line 23), home.js (line 205), home.js (line 241), project.js (line 51)
Baja: En proyecto, el link de “casa/home” no preserva lang y el texto no se actualiza al cambiar idioma. main.js (line 83), proyecto.html (line 24)
Baja: background-color: none no es válido y se ignora. style.css (line 329), style.css (line 359)
Preguntas / Supuestos

¿Quieres mantener el popup de imágenes en la home o prefieres que cualquier click (incluyendo la imagen) navegue al proyecto?
¿Los enlaces internos deberían abrir en la misma pestaña y solo los externos en otra?
¿El enlace “casa/home” en proyecto debe conservar ?lang= al volver?
SEO — prioridades (urgencia de mayor a menor)

Renderizar contenido sin depender de JS (pre‑render / static build de cada proyecto) para asegurar indexación completa.
Añadir canonical + hreflang para ca/es/en (y x-default) para evitar duplicados por ?lang=.
Metadatos únicos por idioma y por proyecto: <title> + <meta name="description"> dinámicos y actualizados en cada cambio de idioma.
Open Graph / Twitter cards (og:title, og:description, og:image, twitter:card) con imagen por proyecto cuando sea posible.
sitemap.xml con todas las URLs (incluyendo variantes de idioma) + robots.txt.
Structured data JSON‑LD: Organization + WebSite y, por proyecto, CreativeWork/ExhibitionEvent.
Jerarquía semántica: añadir <h1> en home y landmarks (<main>, <nav>) para claridad.
Performance/CWV: loading="lazy", decoding="async", width/height en imágenes y thumbnails más ligeras.
Si quieres, puedo empezar por el punto 1 o 2 y lo implemento paso a paso.
