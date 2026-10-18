/* ============================================================
   build.mjs — data/ + projects/ + index.html i proyecto.html (les
   plantilles) → dist/, la web tal com es publica.
       node build/build.mjs

   La home i una pàgina per projecte (/<slug>/), cadascuna amb el seu title,
   description, og:image, canonical i hreflang (?lang=es, ?lang=en), i el
   contingut en català ja escrit (la descripció i els projectes de la home; el
   títol, el text i les imatges de cada projecte), perquè Google i WhatsApp el
   llegeixin sense JS. En carregar, el JS de sempre torna a pintar el mateix.
   proyecto.html?slug= segueix funcionant.

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
const LANG = 'ca';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const t = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v[LANG] ?? v.ca ?? '' : v ?? '');
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
const metaTags = ({ title, desc, url, image, robots }) => `
    <meta name="robots" content="${robots || (INDEX ? 'index,follow' : 'noindex')}">
    <link rel="canonical" href="${esc(url)}">
    <link rel="alternate" hreflang="ca" href="${esc(url)}">
    <link rel="alternate" hreflang="es" href="${esc(url)}?lang=es">
    <link rel="alternate" hreflang="en" href="${esc(url)}?lang=en">
    <link rel="alternate" hreflang="x-default" href="${esc(url)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${esc(site.title)}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:url" content="${esc(url)}">
    <meta property="og:image" content="${esc(image)}">
    <meta property="og:locale" content="ca_ES">
    <meta name="twitter:card" content="summary_large_image">`;

const home = homeOld(site, about, projects);

function homePage() {
  const file = 'index.html';
  let html = readFileSync(at(file), 'utf8');
  html = swap(html, /<html lang="[^"]*">/, (m) => m.replace('>', ' data-built>'), file);
  // las meta de antes (description, canonical, hreflang, og, twitter) las reescribe el build
  html = html.replace(/\s*<link rel="canonical"[^>]*>|\s*<link rel="alternate" hreflang[^>]*>|\s*<meta (?:property="og:|name="twitter:|name="robots")[^>]*>/g, '');
  html = swap(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(t(site.description))}">`, file);
  html = swap(html, /(<title>[^<]*<\/title>)/, `$1${metaTags({ title: site.title, desc: t(site.description), url: `${SITE}/`, image: `${SITE}/img/logo.webp` })}`, file);
  // el contingut, per a qui no executa JS (home.js buida cada secció i la torna a pintar)
  html = swap(html, /<section id="descripcio"([^>]*)><\/section>/, `<section id="descripcio"$1><div>${(t(home.descripcio) || []).map((p) => `<p>${p}</p>`).join('')}</div></section>`, file);
  return swap(html, /<section id="projectes"([^>]*)><\/section>/, `<section id="projectes"$1>${home.projectes_visibles.map((e) =>
    `<div class="project-item"><h2><a href="${encodeURIComponent(e.slug)}/">${esc(e.name)}</a></h2><img src="${enc(e.thumbnail)}" alt="${esc(e.name)}" loading="lazy"><p>${t(e.resumen)}</p></div>`).join('')}</section>`, file);
}

function projectPage(slug, visible) {
  const file = 'proyecto.html';
  const p = projectOld(slug, projects[slug]);
  const title = t(p.titulo);
  const url = `${SITE}/${encodeURIComponent(slug)}/`;
  let html = readFileSync(at(file), 'utf8');
  html = swap(html, /<html lang="[^"]*">/, (m) => m.replace('>', ' data-built>'), file);
  html = swap(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(cut(plain(t(p.resumen)) || title))}">`, file);
  html = swap(html, /<title>[^<]*<\/title>/, `<title>${esc(title)} - ${esc(site.title)}</title>${metaTags({
    title, desc: cut(plain(t(p.resumen)) || title), url, image: ogUrl(slug), robots: visible ? null : 'noindex',
  })}\n    <base href="../">\n    <script>window.__SLUG__ = ${JSON.stringify(slug).replace(/</g, '\\u003c')};</script>`, file);
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
writeFileSync(join(OUT, 'proyecto.html'), readFileSync(at('proyecto.html'), 'utf8').replace(/<html lang="([^"]*)">/, '<html lang="$1" data-built>'));
writeFileSync(join(OUT, 'index.html'), homePage());
mkdirSync(join(OUT, 'og'), { recursive: true });
for (const [slug, cached] of ogs) cpSync(cached, join(OUT, 'og', `${slug}.jpg`));
for (const { slug, visible } of entries) {
  mkdirSync(join(OUT, slug), { recursive: true });
  writeFileSync(join(OUT, slug, 'index.html'), projectPage(slug, visible));
}
if (existsSync(at('CNAME'))) cpSync(at('CNAME'), join(OUT, 'CNAME'));
const urls = [`${SITE}/`, ...entries.filter((e) => e.visible).map((e) => `${SITE}/${encodeURIComponent(e.slug)}/`)];
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(OUT, 'robots.txt'), INDEX ? `User-agent: *\nAllow: /\nDisallow: /equipaments.html\n\nSitemap: ${SITE}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
writeFileSync(join(OUT, '.nojekyll'), '');

console.log(`✓ dist/: home i ${entries.length} projectes (${entries.filter((e) => !e.visible).length} amagats) · ${INDEX ? `s'indexa (${SITE})` : 'sense indexar'}`);
