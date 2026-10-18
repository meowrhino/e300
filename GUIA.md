# Guia de la web

> **Regla d'or: només toques `data/` i `projects/`.** La resta és el codi.

## Què hi ha

```
data/site.json             el nom, la descripció per a Google i els projectes de la home, en ordre
data/about.json            les seccions de la home: descripció, serveis, equipaments, contacte i membres
data/estatuts.json         els estatuts
projects/<nom>/            un projecte, una carpeta:
  project.json               els seus textos
  img/                       les seves imatges: 01.webp, 02.webp… i la de la home
```

El **nom de la carpeta** és també el de l'adreça: `projects/judici/` →
`estructuras3000.com/judici/`. Minúscules, números i guions, sense accents ni espais. **No el
canviïs** un cop publicat: trencaria els enllaços que ja circulen.

## La primera vegada: preparar VS Code

Només es fa un cop.

1. A VS Code: **Fitxer → Nova finestra** i, a la benvinguda, **Clona el repositori Git…** →
   **Clona des de GitHub**. Entra amb el teu compte, tria el teu repositori i una carpeta.
2. En obrir-la, VS Code et proposa instal·lar **Live Server** (a baix a la dreta): **Instal·la**.
3. A baix a la dreta surt **Go Live**: és la vista prèvia.

**VS Code t'ajuda amb els camps**: si passes el ratolí per sobre d'un (`"title"`, `"gallery"`…)
et diu què és, i si n'escrius un malament ho subratlla en vermell. Per veure quins camps pots
posar, dins de les claus prem **Ctrl+Espai**. Ho sap per la primera línia de cada JSON
(`"$schema": …`): **no l'esborris**.

## Afegir un projecte, pas a pas

1. **Copia una carpeta** de `projects/` que s'hi assembli i posa-li el nom nou:
   `projects/judici/` → `projects/nou/`.
2. **Les imatges**: passa-les per [imgToWeb](https://meowrhino.github.io/imgToWeb/), **en Chrome
   o Firefox** (Safari no sap fer `.webp`), i posa-les a `img/`: `01.webp`, `02.webp`…, i la de la home.
3. **Els textos**: obre `project.json` i canvia el que calgui (els camps, a sota).
4. **A la home**: a `data/site.json`, afegeix el nom de la carpeta a la llista, al lloc on vulguis
   que surti. Per amagar-lo (té la seva pàgina, però no surt a la home ni a Google):
   `{ "project": "nou", "visible": false }`.
5. **Go Live** per veure-ho, i després **Pujar els canvis**.

## Els camps d'un projecte (`project.json`)

| camp | què fa |
|---|---|
| `title` | el títol: un text, o en els tres idiomes `{ "ca": "…", "es": "…", "en": "…" }` |
| `subtitle` | *opcional*: el subtítol, en cursiva |
| `summary` | el resum, en els tres idiomes. Surt a Google |
| `text` | el text, una llista de paràgrafs per idioma: `{ "ca": ["…"], "es": ["…"], "en": ["…"] }`. Pot portar `<a href='https://…'>enllaços</a>` |
| `link`, `linkText` | *opcional*: un enllaç al costat del títol, i el seu text |
| `image` | la primera imatge: `{ "src": "01.webp", "alt": "…" }` |
| `photos` | les imatges de `img/`, en ordre: `["02.webp", "03.webp"]` |
| `video` | *opcional*: un vídeo (`src` de l'iframe, `width`, `height`) |
| `thumbnail` | la imatge de la home, de `img/` |
| `card` | *opcional*: el títol o el resum de la home, si han de ser diferents dels de la fitxa |

## Veure-ho abans de pujar-ho

**Go Live** a baix a la dreta de VS Code. S'obre la web al navegador i es refresca sola cada
cop que deses. Si hi ha alguna cosa que no es publicaria (una coma, un camp mal escrit), surt
a la pantalla, i diu on.

## Pujar els canvis

1. Pestanya **Control de codi font** (les tres boletes unides, a l'esquerra).
2. Escriu què has fet (`projecte nou: nou`) i **Confirma** (*Commit*). Si pregunta si vols
   afegir tots els canvis: **Sí**.
3. **Sincronitza els canvis** (*Sync*).
4. En un parell de minuts és a la web. A GitHub, al costat de l'últim canvi surt una boleta:
   groc és que està publicant, verd que ja està, vermell que alguna cosa no quadra.

**Abans de començar a tocar**, dona també a **Sincronitza**, per baixar el que hagi canviat.

## Què surt a Google i en compartir

| on | d'on surt |
|---|---|
| el títol | `title` del projecte |
| el text de sota, a Google | el `summary` |
| la imatge en compartir l'enllaç | la primera imatge (`image`); si no n'hi ha, la de la home |

Hi ha una adreça per idioma: el català, sense res; `?lang=es` i `?lang=en`.

## Si surt en vermell

La web no es trenca: es queda com estava fins que s'arregla. Clica la boleta vermella, després
**Details**, i llegeix l'últim missatge, que diu el fitxer i què passa:

- **"no és un JSON vàlid"** → gairebé sempre **una coma** de més o de menys, o unes cometes
  sense tancar, a prop d'aquella línia.
- **"\"titol\" no és un camp d'aquí (mal escrit?). Els que hi ha: title, subtitle, summary…"** →
  un camp mal escrit: copia'l de la llista que surt al missatge.
- **"no trobo projects/nou/img/02.webp"** → una imatge que el JSON nomena i no és a `img/`
  (compte amb les majúscules i els espais).
- **"\"lists\" diu \"nou\", i no hi ha cap projects/nou/project.json"** → el nom de la llista
  i el de la carpeta no són iguals.
