# 📏 Valores de Espaciado - Dónde Ajustar

## Archivo: `css/style.css`

### **Líneas 17-39: Variables de espaciado**

```css
:root {
    --scroll-offset: 10vh;
    --section-gap: 33vh;  /* ← DESKTOP: Espacio entre secciones */
}

@supports (height: 1dvh) {
    :root {
        --scroll-offset: 10dvh;
        --section-gap: 33dvh;  /* ← DESKTOP: Espacio entre secciones (con dvh) */
    }
}

@media (max-width: 768px) {
    :root {
        --section-gap: 50vh;  /* ← MÓVIL: Espacio entre secciones */
    }

    @supports (height: 1dvh) {
        :root {
            --section-gap: 50dvh;  /* ← MÓVIL: Espacio entre secciones (con dvh) */
        }
    }
}
```

---

## 🎯 Valores Actuales

| Dispositivo | Variable | Valor Actual | Sugerido | Dónde Cambiar |
|-------------|----------|--------------|----------|---------------|
| **Desktop** | `--section-gap` | `33vh` | `15vh` | Línea 19 |
| **Desktop (dvh)** | `--section-gap` | `33dvh` | `15dvh` | Línea 25 |
| **Móvil** | `--section-gap` | `50vh` | `25vh` | Línea 31 |
| **Móvil (dvh)** | `--section-gap` | `50dvh` | `25dvh` | Línea 35 |

---

## 🔧 Cómo Ajustar

### **Opción 1: Valores Conservadores (menos cambio)**
```css
--section-gap: 25vh;  /* Desktop */
--section-gap: 40vh;  /* Móvil */
```

### **Opción 2: Valores Equilibrados (recomendado)**
```css
--section-gap: 15vh;  /* Desktop */
--section-gap: 25vh;  /* Móvil */
```

### **Opción 3: Valores Compactos (más contenido visible)**
```css
--section-gap: 10vh;  /* Desktop */
--section-gap: 20vh;  /* Móvil */
```

---

## 📝 Notas

- **`vh`** = viewport height (altura del viewport)
- **`dvh`** = dynamic viewport height (se ajusta con la barra de direcciones en móvil)
- **33vh** = 33% de la altura de la pantalla
- El espaciado se inserta entre secciones mediante la función `ensureSectionSpacers()` en `ui.js`
- Cambia los 4 valores (líneas 19, 25, 31, 35) para mantener consistencia

---

## ✅ Cambios Implementados

- ✅ Centrado vertical en desktop (sin scroll-margin-top)
- ✅ Scroll-margin-top solo en móvil (10vh)
- ✅ Recentrado de accordions en desktop
- ⏳ Espaciado entre secciones (pendiente de ajustar por ti)
