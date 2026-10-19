/* ============================================================
   build.mjs — data/ + projects/ + index.html i proyecto.html (les
   plantilles) → dist/, la web tal com es publica.
       node build/build.mjs

   La home i una pàgina per projecte, en cada idioma a la seva adreça (/ i
   /<slug>/ en català, /es/, /es/<slug>/, /en/, /en/<slug>/), cadascuna amb el
   seu title, description, og:image, canonical i hreflang cap a les tres, i el
   contingut en el seu idioma ja escrit (la descripció i els projectes de la
   home; el títol, el text i les imatges de cada projecte), perquè Google i
   WhatsApp el llegeixin sense JS. En carregar, el JS de sempre torna a pintar
   el mateix. Les adreces velles (?lang=es, proyecto.html?slug=) porten a les
   noves amb un script al <head>.

   Aquí la nostra còpia és la web de veritat (estructuras3000.com, sense còpia
   del client): sempre a l'arrel, amb el domini de site.json → "url".

   Si alguna cosa està malament (una coma, un camp mal escrit, una imatge que
   no hi és) s'atura i diu què, i no es publica res.
   ============================================================ */

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { entriesOf, homeOld, projectOld } from '../js/house.js';
import { validar } from '../js/validar.js';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const OUT = join(ROOT, 'dist');
const at = (...p) => join(ROOT, ...p);
const fail = (msg) => { console.error(`\n✗ ${msg}\n\nNo es publica res: la web es queda com estava.\n`); process.exit(1); };

/* ---------- llegir i revisar ---------- */

const read = (rel) => {
  if (!existsSync(at(rel))) fail(`no trobo ${rel}`);
  try { return JSON.parse(readFileSync(at(rel), 'utf8')); } catch (e) {
    fail(`${rel} no és un JSON vàlid: ${e.message}\n  Gairebé sempre és una coma de més o de menys, o unes cometes sense tancar.`);
  }
};
const schema = (t) => JSON.parse(readFileSync(at('schema', `${t}.json`), 'utf8'));
const site = read('data/site.json');
const about = read('data/about.json');
const errors = [...validar(site, schema('site'), 'data/site.json'), ...validar(about, schema('about'), 'data/about.json'),
  ...validar(read('data/estatuts.json'), schema('estatuts'), 'data/estatuts.json')];
const entries = errors.length ? [] : entriesOf(site);
const projects = {};
for (const { slug } of entries) {
  const rel = `projects/${slug}/project.json`;
  if (projects[slug]) { errors.push(`data/site.json: "${slug}" surt dues vegades a "lists"`); continue; }
  if (!existsSync(at(rel))) { errors.push(`data/site.json: "lists" diu "${slug}", i no hi ha cap ${rel}`); continue; }
  const p = projects[slug] = read(rel);
  const before = errors.length;
  errors.push(...validar(p, schema('project'), rel));
  if (errors.length > before) continue;
  for (const f of [p.image?.src, p.thumbnail, ...(p.photos || [])].filter(Boolean)) {
    if (!existsSync(at('projects', slug, 'img', f))) errors.push(`${rel}: no trobo projects/${slug}/img/${f}`);
  }
}
if (errors.length) fail(errors.join('\n✗ '));
for (const d of readdirSync(at('projects'))) {
  if (existsSync(at('projects', d, 'project.json')) && !projects[d]) console.warn(`⚠ projects/${d} no surt a data/site.json → lists: no es publica`);
}

const SITE = String(site.url || '').replace(/\/+$/, '');
const INDEX = !!site.url;
const LANGS = ['ca', 'es', 'en'];
const LOCALE = { ca: 'ca_ES', es: 'es_ES', en: 'en_US' };
const HOME = { ca: 'casa', es: 'casa', en: 'home' };
let cur = 'ca'; // l'idioma de la pàgina que s'està escrivint
// on és cada idioma, des de l'arrel: '' (català), 'es/', 'en/'. A cada pàgina, <base> apunta a
// l'arrel, així que una adreça "relativa a l'arrel" val a qualsevol host (el domini o una prova)
const prefix = (l) => (l === 'ca' ? '' : `${l}/`);

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const t = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v[cur] ?? v.ca ?? '' : v ?? '');
const plain = (s) => String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const cut = (s) => (s.length <= 160 ? s : s.slice(0, 157).trimEnd() + '…');

/* ---------- la imatge per compartir, amb sharp ---------- */

let sharp = null;
try { sharp = (await import('sharp')).default; } catch (e) {
  console.warn(`⚠ sense sharp (${e.code || e.message}): en compartir surt la imatge tal qual. S'arregla amb: npm ci`);
}
const shareSource = (slug, p) => {
  const f = p.image?.src || p.thumbnail || p.photos?.[0];
  return f ? `projects/${slug}/img/${f}` : 'img/logo.webp';
};
const ogs = new Map();
for (const [slug, p] of Object.entries(projects)) {
  if (!sharp) break;
  const src = shareSource(slug, p);
  const cached = at('.cache', 'og', `${slug}.jpg`);
  try {
    if (!(existsSync(cached) && statSync(cached).mtimeMs >= statSync(at(src)).mtimeMs)) {
      mkdirSync(dirname(cached), { recursive: true });
      await sharp(at(src)).resize(1200, 630, { fit: 'cover' }).flatten({ background: '#ffffff' }).jpeg({ quality: 85, mozjpeg: true }).toFile(cached);
    }
    ogs.set(slug, cached);
  } catch (e) {
    console.warn(`⚠ ${src}: sharp no la pot llegir (${e.message}); en compartir surt tal qual`);
  }
}
const ogUrl = (slug) => (ogs.has(slug) ? `${SITE}/og/${slug}.jpg` : `${SITE}/${enc(shareSource(slug, projects[slug]))}`);

/* ---------- les pàgines ---------- */

function swap(html, find, replace, file) {
  if (!find.test(html)) fail(`no trobo ${find} a ${file}: el build ho necessita per escriure les pàgines.`);
  return html.replace(find, replace);
}
// path: la ruta de la pàgina sense idioma ('' la home, 'judici/' un projecte)
const metaTags = ({ title, desc, path, image, robots }) => `
    <meta name="robots" content="${robots || (INDEX ? 'index,follow' : 'noindex')}">
    <link rel="canonical" href="${esc(`${SITE}/${prefix(cur)}${path}`)}">
${LANGS.map((l) => `    <link rel="alternate" hreflang="${l}" href="${esc(`${SITE}/${prefix(l)}${path}`)}">`).join('\n')}
    <link rel="alternate" hreflang="x-default" href="${esc(`${SITE}/${path}`)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${esc(site.title)}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:url" content="${esc(`${SITE}/${prefix(cur)}${path}`)}">
    <meta property="og:image" content="${esc(image)}">
    <meta property="og:locale" content="${LOCALE[cur]}">
    <meta name="twitter:card" content="summary_large_image">`;

// El <head> de cada pàgina, després del <title>: les meta, la <base> cap a l'arrel (segons la
// fondària) i el script que porta un ?lang= vell (enllaços d'abans, /judici/?lang=es) a la pàgina
// d'aquell idioma abans de pintar res. Relatiu a la <base>, perquè valgui a qualsevol host.
const head = (path, meta) => {
  const depth = (prefix(cur) + path).split('/').length - 1;
  const to = Object.fromEntries(LANGS.map((l) => [l, prefix(l) + path || './']));
  return `${meta}${depth ? `\n    <base href="${'../'.repeat(depth)}">` : ''}
    <script>(function(l){if(!/^(ca|es|en)$/.test(l))return;if(l==="${cur}")history.replaceState(null,"",location.pathname+location.hash);else location.replace(${JSON.stringify(to)}[l]+location.hash)})(new URLSearchParams(location.search).get("lang"))</script>`;
};
// El selector d'idioma, ja escrit (a la web construïda i18n.js no el toca): cada idioma, la seva pàgina
const langLinks = (path) => `<div class="language-links">${LANGS.map((l) =>
  `<a href="${prefix(l) + path || './'}" hreflang="${l}" lang="${l}" aria-label="Canviar idioma a ${{ ca: 'català', es: 'castellano', en: 'english' }[l]}"${l === cur ? ' class="active" aria-current="true"' : ''}>${l}</a>`).join('')}</div>`;
const homeHref = () => prefix(cur) || './';

const home = homeOld(site, about, projects);

function homePage() {
  const file = 'index.html';
  let html = readFileSync(at(file), 'utf8');
  html = swap(html, /<html lang="[^"]*">/, `<html lang="${cur}" data-built>`, file);
  // las meta de antes (description, canonical, hreflang, og, twitter) las reescribe el build
  html = html.replace(/\s*<link rel="canonical"[^>]*>|\s*<link rel="alternate" hreflang[^>]*>|\s*<meta (?:property="og:|name="twitter:|name="robots")[^>]*>/g, '');
  html = swap(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(t(site.description))}">`, file);
  html = swap(html, /(<title>[^<]*<\/title>)/, `$1${head('', metaTags({ title: site.title, desc: t(site.description), path: '', image: `${SITE}/img/logo.webp` }))}`, file);
  html = swap(html, /href="index\.html"/, `href="${homeHref()}"`, file);
  html = swap(html, /href="#descripcio" class="skip-to-content"/, `href="${prefix(cur)}#descripcio" class="skip-to-content"`, file); // amb <base>, un #x sol se'n va a l'arrel
  html = swap(html, /<div class="language-links"><\/div>/, langLinks(''), file);
  // el contingut, per a qui no executa JS (home.js buida cada secció i la torna a pintar)
  html = swap(html, /<section id="descripcio"([^>]*)><\/section>/, `<section id="descripcio"$1><div>${(t(home.descripcio) || []).map((p) => `<p>${p}</p>`).join('')}</div></section>`, file);
  return swap(html, /<section id="projectes"([^>]*)><\/section>/, `<section id="projectes"$1>${home.projectes_visibles.map((e) =>
    `<div class="project-item"><h2><a href="${prefix(cur)}${encodeURIComponent(e.slug)}/">${esc(e.name)}</a></h2><img src="${enc(e.thumbnail)}" alt="${esc(e.name)}" loading="lazy"><p>${t(e.resumen)}</p></div>`).join('')}</section>`, file);
}

function projectPage(slug, visible) {
  const file = 'proyecto.html';
  const p = projectOld(slug, projects[slug]);
  const title = t(p.titulo);
  const path = `${encodeURIComponent(slug)}/`;
  let html = readFileSync(at(file), 'utf8');
  html = swap(html, /<html lang="[^"]*">/, `<html lang="${cur}" data-built>`, file);
  html = swap(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(cut(plain(t(p.resumen)) || title))}">`, file);
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${esc(title)} - ${esc(site.title)}</title>${head(path, metaTags({
    title, desc: cut(plain(t(p.resumen)) || title), path, image: ogUrl(slug), robots: visible ? null : 'noindex',
  }))}\n    <script>window.__SLUG__ = ${JSON.stringify(slug).replace(/</g, '\\u003c')};</script>`, file);
  html = swap(html, /<a href="index\.html" id="home-link">[^<]*<\/a>/, `<a href="${homeHref()}" id="home-link">${HOME[cur]}</a>`, file);
  html = swap(html, /<div class="language-links"><\/div>/, langLinks(path), file);
  // el contingut, com el pinta project.js (que buida el contenidor i el torna a pintar)
  const img = (f) => `projects/${enc(slug)}/img/${enc(f.replace(/^\.\/img\//, ''))}`;
  const body = [
    `<h1>${esc(title)}</h1>`,
    p.primera_imatge ? `<img src="${img(p.primera_imatge.src)}" alt="${esc(p.primera_imatge.alt || title)}" loading="lazy">` : '',
    ...(t(p.descripcion?.texto) || []).map((x) => `<p>${x}</p>`),
    ...(p.imatges || []).map((f) => `<img src="${img(f)}" alt="${esc(title)}" loading="lazy">`),
  ].join('');
  return swap(html, /<section id="container-projecte"([^>]*)><\/section>/, `<section id="container-projecte"$1>${body}</section>`, file);
}

/* ---------- escriure dist/ ---------- */

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const f of ['css', 'js', 'fonts', 'img', 'data', 'projects', '404.html', 'equipaments.html', 'equipaments_data.json'])
  if (existsSync(at(f))) cpSync(at(f), join(OUT, f), { recursive: true, filter: (x) => !x.endsWith('.DS_Store') });
// proyecto.html?slug=x&lang=y (les adreces d'abans de la recepta) → la pàgina de veritat. Només això:
// la plantilla no es publica
writeFileSync(join(OUT, 'proyecto.html'), `<!DOCTYPE html><html lang="ca"><head><meta charset="UTF-8"><meta name="robots" content="noindex"><title>${esc(site.title)}</title>
<script>(function(q){var s=q.get("slug"),l=q.get("lang");location.replace(s?(/^(es|en)$/.test(l)?l+"/":"")+encodeURIComponent(s)+"/"+location.hash:"./")})(new URLSearchParams(location.search))</script>
</head><body></body></html>
`);
mkdirSync(join(OUT, 'og'), { recursive: true });
for (const [slug, cached] of ogs) cpSync(cached, join(OUT, 'og', `${slug}.jpg`));
for (cur of LANGS) {
  mkdirSync(join(OUT, prefix(cur)), { recursive: true });
  writeFileSync(join(OUT, prefix(cur), 'index.html'), homePage());
  for (const { slug, visible } of entries) {
    mkdirSync(join(OUT, prefix(cur), slug), { recursive: true });
    writeFileSync(join(OUT, prefix(cur), slug, 'index.html'), projectPage(slug, visible));
  }
}
if (existsSync(at('CNAME'))) cpSync(at('CNAME'), join(OUT, 'CNAME'));
const paths = ['', ...entries.filter((e) => e.visible).map((e) => `${encodeURIComponent(e.slug)}/`)];
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.flatMap((l) => paths.map((p) => `  <url><loc>${SITE}/${prefix(l)}${p}</loc>${
  LANGS.map((o) => `<xhtml:link rel="alternate" hreflang="${o}" href="${SITE}/${prefix(o)}${p}"/>`).join('')}</url>`)).join('\n')}
</urlset>
`);
writeFileSync(join(OUT, 'robots.txt'), INDEX ? `User-agent: *\nAllow: /\nDisallow: /equipaments.html\n\nSitemap: ${SITE}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
writeFileSync(join(OUT, '.nojekyll'), '');

console.log(`✓ dist/: home i ${entries.length} projectes (${entries.filter((e) => !e.visible).length} amagats) en ${LANGS.join(', ')} · ${INDEX ? `s'indexa (${SITE})` : 'sense indexar'}`);
