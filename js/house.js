// El contenido a la manera del estudio (JAMstack) → el de antes
//
// El contenido vive así: data/site.json (título, descripción y "lists": los
// proyectos de la home, en orden; uno oculto, { "project": "x", "visible": false }),
// data/about.json (las secciones de la home: descripció, serveis, equipaments,
// contacte, membres) y cada proyecto en projects/<slug>/project.json con sus
// imágenes en img/. Campos en inglés; los idiomas, { ca, es, en }.
//
// El resto del JS sigue trabajando con la forma de antes (data/home.json y
// data/<slug>/<slug>.json); estas funciones pasan de una a otra. Las usan el
// navegador (carga.js) y el build: sin DOM ni disco.

export const entriesOf = (site) => Object.values(site.lists || {}).flatMap((l) => l.projects || [])
  .map((e) => (e && typeof e === 'object' ? { slug: e.project, visible: e.visible !== false } : { slug: e, visible: true }));

const titleCa = (t) => (typeof t === 'string' ? t : t?.ca);

export function homeOld(site, about, projects) {
  return {
    meta: { title: site.title, description: site.description, keywords: site.keywords },
    descripcio: about.description,
    serveis: about.services,
    equipaments: about.facilities,
    projectes_visibles: entriesOf(site).filter((e) => e.visible).map(({ slug }) => {
      const p = projects[slug];
      return {
        slug,
        name: p.card?.title ?? titleCa(p.title),
        thumbnail: `projects/${slug}/img/${p.thumbnail}`,
        visible: true,
        resumen: p.card?.summary ?? p.summary,
      };
    }),
    contacte: about.contact,
    membres: about.members,
    estatuts_link: about.statutesLink,
  };
}

export function projectOld(slug, p) {
  const img = (f) => `./img/${f}`;
  return {
    slug,
    titulo: p.title,
    ...(p.summary ? { resumen: p.summary } : {}),
    descripcion: {
      ...(p.link ? { link: p.link } : {}),
      ...(p.linkText ? { link_text: p.linkText } : {}),
      ...(p.text ? { texto: p.text } : {}),
      ...(p.subtitle ? { subtitle: p.subtitle } : {}),
    },
    ...(p.image ? { primera_imatge: { src: img(p.image.src), ...(p.image.alt ? { alt: p.image.alt } : {}) } } : {}),
    ...(p.photos ? { imatges: p.photos.map(img) } : {}),
    ...(p.video ? { video: p.video } : {}),
    ...(p.impact2026 ? { impacte_2026_pendent: p.impact2026 } : {}),
  };
}
