'use strict';

/* ═══════════════════════════════════════════════
   ORCHESTRATOR — Malla Curricular v2.1
   Estado: aprobadas, intensivo, modoIntensivo,
           tema, especializaciones activas
   Depende de: data.js → storage.js → render.js
   ═══════════════════════════════════════════════ */

// ── Estado global ────────────────────────────────
let approvedCourses  = Storage.loadProgress();
let intensivoCourses = Storage.loadIntensivo();
let habilitadas      = Storage.loadHabilitadas();
let cursandoCourses  = Storage.loadCursando();
let intentos         = Storage.loadIntentos();
let currentTheme     = Storage.loadTheme();
let modoIntensivo    = false;          // se resetea al recargar
let modoHabilitacion = false;          // se resetea al recargar
let activeSpecs      = new Set();      // se resetea al recargar

// ── Helpers ──────────────────────────────────────

/** Unión de aprobadas normales + intensivo: base real para prerrequisitos */
function _getEffectiveApproved() {
    return [...new Set([...approvedCourses, ...intensivoCourses])];
}

function _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Lógica de cascada ─────────────────────────────

/**
 * Calcula qué IDs del array `effectiveApproved` se perderían si se quita `courseId`.
 */
function getCascadeImpact(courseId, effectiveApproved) {
    let hypo    = effectiveApproved.filter(id => id !== courseId);
    let changed = true;
    while (changed) {
        const before = hypo.length;
        hypo = hypo.filter(cid => {
            const c = COURSES.find(item => item.id === cid);
            return c ? c.reqs.every(r => hypo.includes(r)) : true;
        });
        changed = hypo.length !== before;
    }
    return effectiveApproved.filter(id => id !== courseId && !hypo.includes(id));
}

/**
 * Tras modificar approved / intensivo, recalcula la cascada sobre la unión
 * y redistribuye los IDs a sus arrays de origen.
 */
function _applyFullCascade() {
    let effective = [...new Set([...approvedCourses, ...intensivoCourses])];
    let changed   = true;
    while (changed) {
        const before = effective.length;
        effective = effective.filter(cid => {
            const c = COURSES.find(item => item.id === cid);
            return c ? c.reqs.every(r => effective.includes(r)) : true;
        });
        changed = effective.length !== before;
    }
    // Redistribuir: cada ID vuelve a su array original si aún es válido
    approvedCourses  = approvedCourses.filter(id => effective.includes(id));
    intensivoCourses = intensivoCourses.filter(id => effective.includes(id));
}

// ── Toggle principal ──────────────────────────────

async function toggleCourse(id) {
    const isIntensivo  = intensivoCourses.includes(id);
    const isApproved   = approvedCourses.includes(id);
    const isHabilitada = habilitadas.includes(id);
    const isCursando   = cursandoCourses.includes(id);
    const effective    = _getEffectiveApproved();

    if (isIntensivo || isApproved) {
        /* ── Quitar materia (normal o intensivo) ── */
        const impact = getCascadeImpact(id, effective);

        if (impact.length > 0) {
            const confirmed = await Render.showCascadeModal(id, impact);
            if (!confirmed) return;
            Render.animatePurge(impact);
            await _delay(330);
        }

        if (isIntensivo) {
            intensivoCourses = intensivoCourses.filter(c => c !== id);
        } else {
            approvedCourses = approvedCourses.filter(c => c !== id);
        }
        _applyFullCascade();

    } else if (isCursando) {
        /* ── Materia en curso: Finalizar Cursado ── */
        const result = await Render.showResultModal(id);
        if (result === 'cancel') return;
        
        // Remove from cursando
        cursandoCourses = cursandoCourses.filter(c => c !== id);

        if (result === 'approve') {
            Render.animateApproval(id);
            await _delay(460);
            
            if (modoIntensivo) {
                intensivoCourses = [...intensivoCourses, id];
            } else {
                approvedCourses = [...approvedCourses, id];
            }
            
            // Consumir habilitación si la tenía
            if (isHabilitada) {
                habilitadas = habilitadas.filter(c => c !== id);
            }
        } else if (result === 'fail') {
            intentos[id] = (intentos[id] || 0) + 1;
        } else if (result === 'withdraw') {
            // Se retiró, no cuenta como intento
        }

    } else if (modoHabilitacion) {
        /* ── MODO HABILITACIÓN ACTIVO: Poner / Quitar habilitación ── */
        if (isHabilitada) {
            habilitadas = habilitadas.filter(c => c !== id);
        } else {
            habilitadas = [...habilitadas, id];
        }

    } else {
        /* ── Iniciar Cursado ── */
        // Ya sea en modo normal, intensivo, o habilitada, al hacer clic iniciamos cursado
        cursandoCourses = [...cursandoCourses, id];
    }

    _commit();
}

function _commit() {
    Storage.saveProgress(approvedCourses);
    Storage.saveIntensivo(intensivoCourses);
    Storage.saveHabilitadas(habilitadas);
    Storage.saveCursando(cursandoCourses);
    Storage.saveIntentos(intentos);
    _refresh();
}

function _refresh() {
    Render.malla(approvedCourses, intensivoCourses, habilitadas, cursandoCourses, intentos, modoIntensivo, modoHabilitacion);
    Render.stats(_getEffectiveApproved());
    // Re-aplicar filtros activos
    if (activeSpecs.size > 0) Render.applySpecFilter(activeSpecs);
    const q = document.getElementById('searchInput')?.value || '';
    if (q.trim()) Render.applySearch(q);
}

// ── Hooks expuestos para render.js ────────────────

// eslint-disable-next-line no-unused-vars
const App = {
    onCardClick(id)        { toggleCourse(id); },
    onCardHover(id, state) { Render.highlightConnections(id, state); },
    onCardLeave()          { Render.clearHighlights(); },
};

// ── Inicialización de eventos UI ──────────────────

function _initEvents() {

    /* Toggle de tema (Modal) */
    const themeModal = document.getElementById('themeModal');
    
    document.getElementById('btnThemeToggle').addEventListener('click', () => {
        themeModal.classList.add('active');
        themeModal.setAttribute('aria-hidden', 'false');
        
        // Highlight active theme button
        document.querySelectorAll('.theme-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.setTheme === currentTheme);
        });
    });

    document.getElementById('btnCloseThemeModal').addEventListener('click', () => {
        themeModal.classList.remove('active');
        themeModal.setAttribute('aria-hidden', 'true');
    });

    themeModal.addEventListener('click', (e) => {
        // Click outside box to close
        if (e.target === themeModal) {
            document.getElementById('btnCloseThemeModal').click();
        }

        // Click on a theme button
        const btn = e.target.closest('.theme-btn');
        if (btn) {
            currentTheme = btn.dataset.setTheme;
            Storage.saveTheme(currentTheme);
            Render.applyTheme(currentTheme);
            
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
    });

    /* Toggle MODO INTENSIVO */
    document.getElementById('btnIntensivo').addEventListener('click', () => {
        modoIntensivo = !modoIntensivo;
        if (modoIntensivo) modoHabilitacion = false;
        Render.updateModoIntensivo(modoIntensivo);
        Render.updateModoHabilitacion(modoHabilitacion);
        _refresh();
    });

    /* Toggle MODO HABILITACIÓN */
    document.getElementById('btnHabilitacion')?.addEventListener('click', () => {
        modoHabilitacion = !modoHabilitacion;
        if (modoHabilitacion) modoIntensivo = false;
        Render.updateModoIntensivo(modoIntensivo);
        Render.updateModoHabilitacion(modoHabilitacion);
        _refresh();
    });

    /* Búsqueda */
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');

    searchInput.addEventListener('input', () => {
        const q = searchInput.value;
        searchClear.style.display = q ? 'inline-flex' : 'none';
        Render.applySearch(q);
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        Render.applySearch('');
        searchInput.focus();
    });

    /* ESC: cierra modal o limpia búsqueda */
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const modal = document.getElementById('cascadeModal');
        const themeM = document.getElementById('themeModal');
        if (modal.classList.contains('active')) {
            document.getElementById('btnCancelCascade').click();
        } else if (themeM.classList.contains('active')) {
            document.getElementById('btnCloseThemeModal').click();
        } else if (searchInput.value) {
            searchClear.click();
        }
    });

    /* Clic en fondo del modal = cancelar */
    document.getElementById('cascadeModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById('btnCancelCascade').click();
        }
    });

    /* Filtros de especialización (delegación de eventos en la barra) */
    document.getElementById('specBar').addEventListener('click', (e) => {
        const pill = e.target.closest('.spec-pill');
        if (!pill) return;
        const spec = pill.dataset.spec;
        if (spec === 'all') {
            activeSpecs.clear();
        } else {
            activeSpecs.has(spec) ? activeSpecs.delete(spec) : activeSpecs.add(spec);
        }
        Render.applySpecFilter(activeSpecs);
    });

    /* Backup */
    document.getElementById('btnBackup').addEventListener('click', () => {
        Storage.exportBackup();
    });

    /* Restore */
    const restoreInput = document.getElementById('restoreInput');
    restoreInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            approvedCourses  = await Storage.importBackup(file);
            intensivoCourses = Storage.loadIntensivo();
            habilitadas      = Storage.loadHabilitadas();
            cursandoCourses  = Storage.loadCursando();
            intentos         = Storage.loadIntentos();
            _commit();
        } catch (err) {
            alert('Error al importar backup:\n' + err.message);
        }
        e.target.value = '';
    });

    /* Accesibilidad: label restore con teclado */
    document.querySelector('label[for="restoreInput"]')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            restoreInput.click();
        }
    });

    /* Reset — limpia todo (normal + intensivo) */
    document.getElementById('btnReset').addEventListener('click', async () => {
        const effective = _getEffectiveApproved();
        if (effective.length === 0) return;

        // Construir lista con indicador de intensivo/habilitada
        let allNames = effective.map(id => {
            const c    = COURSES.find(c => c.id === id);
            const tipo = intensivoCourses.includes(id) ? ' ☀' : '';
            return c ? `${c.name}${tipo}` : id;
        });
        
        habilitadas.forEach(id => {
            const c = COURSES.find(c => c.id === id);
            allNames.push(c ? `${c.name} ⚡` : `${id} ⚡`);
        });

        const confirmed = await Render.showConfirmModal({
            title: 'CLEAR DATABASE',
            desc:  'Esta acción borrará <strong>todo el progreso</strong> y permisos. Sin retorno:',
            items: allNames,
        });

        if (confirmed) {
            approvedCourses  = [];
            intensivoCourses = [];
            habilitadas      = [];
            cursandoCourses  = [];
            intentos = {};
            Storage.clearAll();
            _commit();
        }
    });
}

// ── Arranque ──────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    Render.applyTheme(currentTheme);
    Render.renderSpecBar();
    Render.updateModoIntensivo(modoIntensivo);
    Render.updateModoHabilitacion(modoHabilitacion);
    _refresh();
    _initEvents();
});
