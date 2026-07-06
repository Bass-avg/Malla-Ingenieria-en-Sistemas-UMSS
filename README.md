# 🦇 Malla Curricular — Universidad Mayor de San Simón
> **//DETECCIÓN DE AVANCE v2.1//** · Ingeniería en Sistemas

[![Version](https://img.shields.io/badge/Version-2.1.0-red.svg?style=for-the-badge&logo=batman)](https://github.com/Bass-avg/Malla-Ingenieria-en-Sistemas-UMSS)
[![Tech](https://img.shields.io/badge/Built%20With-Vanilla%20JS%20%7C%20CSS%20Multi--Theme-8b0000?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![UMSS](https://img.shields.io/badge/UMSS-Sistemas-black?style=for-the-badge&logo=google-scholar)](https://www.umss.edu.bo/)

Herramienta de seguimiento académico para la carrera de **Ingeniería en Sistemas (UMSS)**. Panel de control con un sistema de temas personalizable, diseñado para sesiones de alta concentración y planificación estratégica.

---

## 🛠️ Características v2.1

### Core
*   **Múltiples Estados de Materia** — `DISPONIBLE` (ámbar pulsante), `CURSANDO` (azul/verde pulsante), `APROBADA` (glow estático), `BLOQUEADA` (opacidad reducida).
*   **Lógica de Prerrequisitos Completa** — El sistema desbloquea materias automáticamente. Soporta materias **arrastrando** de semestres anteriores sin asumir un orden lineal.
*   **Modal de Cascada** — Antes de desaprobar una materia, el sistema muestra un *warning* con el impacto exacto en las materias dependientes, requiriendo confirmación explícita.
*   **Seguimiento de Intentos** — Registra y muestra discretamente las veces que una materia ha sido reprobada.
*   **Persistencia Local Avanzada** — Progreso, tema y estados especiales (`cursando`, `habilitada`, `intentos`) guardados en `localStorage`. Funciona 100% offline.

### UX & Navegación
*   **Filtro por Especialización** — Barra de herramientas para iluminar rutas académicas (menciones) como *Ing. de Software*, *IA* o *Redes*. Resalta materias de la especialización y sus prerrequisitos troncales.
*   **Modos de Flexibilidad Académica**:
    *   **Modo Intensivo** `☀`: Permite marcar materias tomadas en cursos de invierno/verano.
    *   **Modo Habilitación** `⚡`: Permite marcar materias para cursar sin prerrequisitos, simulando un permiso especial.
*   **HUD de Estadísticas** — `APROBADAS / DISPONIBLES / BLOQUEADAS` + barra de progreso animada con porcentaje global.
*   **Progress por Semestre** — mini barra `████░░` bajo cada columna indicando avance local.
*   **Búsqueda en Tiempo Real** — filtra por nombre, código o área temática. Las no coincidentes se atenúan.
*   **Resaltado de Dependencias** — al hacer hover, los prerrequisitos se iluminan en ámbar y los dependientes en rojo/azul.
*   **Backup / Restore** — Exporta e importa todo el progreso como un archivo `.json` para sincronizar entre dispositivos o como respaldo.

### Diseño
*   **Sistema Multi-Tema** — Accede al *Command Center* (`SETTINGS`) para elegir entre múltiples paletas de colores, incluyendo:
    *   **Sistemas Core**: `The Batman`, `Deep Navy`.
    *   **Clásicos**: `Modo Oscuro`, `Modo Claro`.
    *   **Tributos**: Temas inspirados en discografías de *Billie Eilish* y *Lana Del Rey*.
*   **Easter Egg** — Un acertijo oculto que desbloquea un tema secreto con estética cinematográfica.
*   **Leyenda de Áreas** — 8 áreas temáticas con color propio: Matemática, Programación, Sistemas, Software, Redes, Gestión, Idiomas, Electivo.
*   **Fuentes Cinematográficas** — `Special Elite` (títulos), `Oswald` (cuerpo), `Rajdhani` (UI técnica).
*   **Animaciones Fluidas** — Transiciones de estado, pulsos, destellos y efectos de `backdrop-filter` en modales para una experiencia inmersiva.

---

## 📂 Estructura del Proyecto

```bash
Malla-Ingenieria-en-Sistemas-UMSS/
├── index.html              # Entry point · Layout · Modals · HUD
├── README.md               # Documentación
└── assets/
    ├── data.js             # Fuente de verdad: Materias, Áreas, Especializaciones
    ├── storage.js          # Persistencia (localStorage) · Backup/Restore JSON
    ├── render.js           # Renderizado DOM · UI (cards, modals, tooltips) · Animaciones
    ├── script.js           # Orquestador · Lógica de estados · Eventos UI
    ├── style.css           # Design System Multi-Theme · Animaciones · Layout
    └── icons/              # Favicons y web manifest
```

---

## ⚡ Instalación y Uso

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/Bass-avg/Malla-Ingenieria-en-Sistemas-UMSS.git
    ```
2.  Abre `index.html` en cualquier navegador moderno (Chrome, Firefox, Safari, Edge).
3.  Haz clic en las materias **disponibles** (borde ámbar pulsante) para marcarlas como aprobadas.
4.  Haz clic nuevamente en una materia **aprobada** para desaprobarla — si hay impacto en cascada, el sistema te mostrará un aviso antes de proceder.

---

## 🎨 Design Tokens

### Tema Batman (default)
```css
--bg:        #0a0a0a   /* Negro absoluto    */
--accent:    #8b0000   /* Rojo táctico      */
--accent-b:  #e60000   /* Neón alerta       */
--avail:     #b8860b   /* Ámbar disponible  */
--avail-b:   #ffd700   /* Dorado aprobación */
```

### Tema Deep Navy
```css
--bg:        #020a14   /* Azul marino prof. */
--accent:    #0a4080   /* Azul profundo     */
--accent-b:  #1e90ff   /* Azul neón         */
--avail:     #009977   /* Verde-teal        */
--avail-b:   #00d4aa   /* Cyan disponible   */
```

---

## ⌨️ Atajos de Teclado

| Tecla | Acción |
|---|---|
| `Esc` | Cierra modal o limpia la búsqueda |
| Hover card | Resalta prerrequisitos y dependientes |

---

> *"La excelencia no es un destino, es un proceso continuo que nunca termina."*
>
> **Sr. Avila**
