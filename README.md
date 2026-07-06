# 🦇 Malla Curricular — Universidad Mayor de San Simón
> **//DETECCIÓN DE AVANCE//** · Ingeniería en Sistemas

[![Version](https://img.shields.io/badge/Version-2.0.0-red.svg?style=for-the-badge&logo=batman)](https://github.com/Bass-avg/Malla-Ingenieria-en-Sistemas-UMSS)
[![Tech](https://img.shields.io/badge/Built%20With-Vanilla%20JS%20%7C%20CSS%20Dual%20Theme-8b0000?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![UMSS](https://img.shields.io/badge/UMSS-Sistemas-black?style=for-the-badge&logo=google-scholar)](https://www.umss.edu.bo/)

Herramienta de seguimiento académico para la carrera de **Ingeniería en Sistemas (UMSS)**. Panel de control con estética cinematográfica dual — *The Batman* y *Deep Navy* — diseñado para sesiones de alta concentración.

---

## 🛠️ Características v2.0

### Core
*   **5 Estados de Materia** — `DISPONIBLE` (ámbar pulsante), `APROBADA` (glow rojo/azul), `BLOQUEADA` (opacidad reducida)
*   **Lógica de Prerrequisitos** — materias se desbloquean automáticamente. Soporta materias **arrastrando** de semestres anteriores sin asumir orden lineal.
*   **Modal de Cascada** — antes de desaprobar una materia, el sistema muestra exactamente qué otras materias se perderían. Requiere confirmación explícita.
*   **Persistencia Local** — progreso y tema guardados en `localStorage`. Funciona sin servidor.

### UX & Navegación
*   **HUD de Estadísticas** — `APROBADAS / DISPONIBLES / BLOQUEADAS` + barra de progreso animada con porcentaje global.
*   **Progress por Semestre** — mini barra `████░░` bajo cada columna indicando avance local.
*   **Búsqueda en Tiempo Real** — filtra por nombre, código o área temática. Las no coincidentes se atenúan.
*   **Resaltado de Dependencias** — al hacer hover, los prerrequisitos se iluminan en ámbar y los dependientes en rojo/azul.
*   **Backup / Restore** — exporta e importa el progreso como `.json` para sincronizar entre navegadores o dispositivos.

### Diseño
*   **Modo Dual** — toggle `🦇 Batman` (negro absoluto / rojo neón) ↔ `🌊 Navy` (azul marino profundo / cyan). Persiste entre sesiones.
*   **Leyenda de Áreas** — 8 áreas temáticas con color propio: Matemática, Programación, Sistemas, Software, Redes, Gestión, Idiomas, Electivo.
*   **Fuentes** — `Special Elite` (títulos), `Oswald` (body), `Rajdhani` (códigos y badges técnicos).
*   **Glassmorphism** — barra de estado inferior con `backdrop-filter: blur`.
*   **Animaciones** — flash de aprobación (500ms), purge de cascada (320ms), pulse ámbar infinito en disponibles.

---

## 📂 Estructura del Proyecto

```bash
Malla-Ingenieria-en-Sistemas-UMSS/
├── index.html              # Entry point · modal · HUD · buscador
├── README.md               # Documentación
└── assets/
    ├── data.js             # Array de materias con créditos y área
    ├── storage.js          # Abstracción de localStorage + backup/restore
    ├── render.js           # Renderizado DOM puro · tooltip · modal · animaciones
    ├── script.js           # Orchestrator: lógica de negocio · eventos UI
    ├── style.css           # Design System dual-theme · animaciones · glassmorphism
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
