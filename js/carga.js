// carga.js — llegeix data/site.json, data/about.json i projects/<slug>/project.json
// i els passa a la forma d'abans amb house.js.
//
// Les pàgines que escriu el build porten data-built a <html>. Sense això és la
// vista prèvia (Live Server, sense build): cada JSON es revisa amb el seu
// esquema (schema/) com fa el build, i el que estigui malament surt a la pantalla.

import { entriesOf, homeOld, projectOld } from './house.js';
import { validar } from './validar.js';

export const BUILT = document.documentElement.hasAttribute('data-built');
const cache = new Map();

function get(path) {
  if (!cache.has(path)) {
    cache.set(path, fetch(path, { cache: BUILT ? 'default' : 'no-store' }).then(async (res) => {
      if (!res.ok) throw new Error(`no trobo ${path}`);
      const text = await res.text();
      try { return JSON.parse(text); } catch (e) {
        showErrors([`${path} no és un JSON vàlid: gairebé sempre és una coma de més o de menys, o unes cometes sense tancar. (${e.message})`]);
        throw e;
      }
    }));
  }
  return cache.get(path);
}

async function checked(path, type) {
  const data = await get(path);
  if (!BUILT) {
    const errors = validar(data, await get(`schema/${type}.json`), path);
    if (errors.length) { showErrors(errors); throw new Error(errors.join('\n')); }
  }
  return data;
}

function showErrors(errors) {
  let box = document.getElementById('errors-vista-previa');
  if (!box) {
    box = document.createElement('pre');
    box.id = 'errors-vista-previa';
    box.style.cssText = 'position:fixed;inset:0;z-index:99999;margin:0;padding:2rem;overflow:auto;white-space:pre-wrap;'
      + 'background:#fff;color:#000;font:15px/1.5 monospace;';
    box.textContent = 'Això no es publicaria:\n\n';
    document.body.append(box);
  }
  box.textContent += errors.map((e) => `✗ ${e}`).join('\n') + '\n\nArregla-ho, desa, i la pàgina es recarrega sola.\n';
}

const project = (slug) => checked(`projects/${slug}/project.json`, 'project');

// la forma de data/home.json d'abans
export async function getHome() {
  const [site, about] = await Promise.all([checked('data/site.json', 'site'), checked('data/about.json', 'about')]);
  const visible = entriesOf(site).filter((e) => e.visible).map((e) => e.slug);
  const projects = Object.fromEntries(await Promise.all(visible.map(async (s) => [s, await project(s)])));
  return homeOld(site, about, projects);
}

// la forma de data/<slug>/<slug>.json d'abans
export async function getProject(slug) { return projectOld(slug, await project(slug)); }

// L'adreça d'un projecte: /<slug>/ a la web construïda; a la vista prèvia,
// proyecto.html?slug=<slug>, perquè les pàgines /<slug>/ només existeixen a dist/.
export function projectUrl(slug, lang) {
  if (!BUILT) return `proyecto.html?slug=${encodeURIComponent(slug)}&lang=${lang}`;
  return `${encodeURIComponent(slug)}/${lang && lang !== 'ca' ? `?lang=${lang}` : ''}`;
}
