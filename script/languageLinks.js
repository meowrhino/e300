document.addEventListener("DOMContentLoaded", () => {
  const { pathname } = window.location;
  const file = pathname.split("/").pop(); // "index.html" | "ES.html" | "judici.html" | "judiciES.html" | ...
  const dir = pathname.replace(/[^/]+$/, ""); // "/projectes/judici/" o "/" en home

  // Distinguir si estamos en home o en proyecto
  const isHome = /^(index|ES|EN)\.html$/i.test(file);

  // Definición de idiomas dependiendo del caso
  const langs = isHome
    ? [
        { label: "cat", file: "index.html" },
        { label: "es", file: "ES.html" },
        { label: "en", file: "EN.html" },
      ]
    : (() => {
        // Para proyectos extraemos el nombre base y cambiamos sufijos
        const base = file.replace(/(ES|EN)?\.html$/i, "");
        return [
          { label: "cat", file: `${base}.html` },
          { label: "es", file: `${base}ES.html` },
          { label: "en", file: `${base}EN.html` },
        ];
      })();

  const container = document.querySelector(".language-links");
  if (!container) return;

  container.innerHTML = langs
    .map((lang) => {
      if (lang.file === file) {
        return `<a class="active">${lang.label}</a>`;
      }
      return `<a href="${dir + lang.file}">${lang.label}</a>`;
    })
    .join(" ");
});
