'use strict';

/* ═══════════════════════════════════════════════
   RENDER MODULE — Malla Curricular v2.1
   DOM puro: grid, cards, stats, tooltip, modal,
   highlights, search, spec filter, intensivo UI
   ═══════════════════════════════════════════════ */

const Render = (() => {

    /* ─────────────────────────────────────────────
       TOOLTIP GLOBAL
    ───────────────────────────────────────────── */
    const tooltipEl = document.getElementById('globalTooltip');
    let _tooltipTimer;

    function _showTooltip(html, anchorEl) {
        clearTimeout(_tooltipTimer);
        tooltipEl.innerHTML = html;
        tooltipEl.removeAttribute('aria-hidden');
        const rect = anchorEl.getBoundingClientRect();
        const tipW = 240;
        let left = rect.left + rect.width / 2 - tipW / 2;
        left = Math.max(8, Math.min(left, window.innerWidth - tipW - 8));
        tooltipEl.style.left      = `${left}px`;
        tooltipEl.style.top       = `${rect.top + window.scrollY - 8}px`;
        tooltipEl.style.transform = 'translateY(-100%)';
        tooltipEl.classList.add('visible');
    }

    function _hideTooltip() {
        _tooltipTimer = setTimeout(() => {
            tooltipEl.classList.remove('visible');
            tooltipEl.setAttribute('aria-hidden', 'true');
        }, 80);
    }

    /* ─────────────────────────────────────────────
       ESTADO DE CARD
    ───────────────────────────────────────────── */

    /**
     * Determina el estado visual de una materia.
     * @param {object}   course
     * @param {string[]} approved          - aprobadas en modo normal
     * @param {string[]} intensivo         - aprobadas en modo intensivo
     * @param {string[]} habilitadas       - habilitadas sin prerrequisitos
     * @param {string[]} cursando          - actualmente cursando
     * @param {boolean}  modoIntensivo     - si el toggle intensivo está activo
     * @param {boolean}  modoHabilitacion  - si el toggle habilitación está activo
     */
    function _getState(course, approved, intensivo, habilitadas, cursando, modoIntensivo, modoHabilitacion) {
        const effective = new Set([...approved, ...intensivo]);
        if (intensivo.includes(course.id))                    return 'intensivo';
        if (approved.includes(course.id))                     return 'approved';
        if (cursando.includes(course.id))                     return 'cursando';
        if (habilitadas.includes(course.id))                  return 'habilitada';
        if (course.reqs.every(r => effective.has(r)))         return 'available';
        if (modoIntensivo)                                    return 'intensivo-available';
        if (modoHabilitacion)                                 return 'habilitacion-posible';
        return 'locked';
    }

    function _getMissingNames(course, effectiveSet) {
        return course.reqs
            .filter(r => !effectiveSet.has(r))
            .map(r => COURSES.find(c => c.id === r)?.name || r);
    }

    /* ─────────────────────────────────────────────
       CARD
    ───────────────────────────────────────────── */
    function _buildCard(course, approved, intensivo, habilitadas, cursando, intentos, modoIntensivo, modoHabilitacion) {
        const effective = new Set([...approved, ...intensivo]);
        const state     = _getState(course, approved, intensivo, habilitadas, cursando, modoIntensivo, modoHabilitacion);
        const missing   = _getMissingNames(course, effective);

        const card        = document.createElement('div');
        card.className    = `course-card ${state}`;
        card.dataset.id   = course.id;
        card.dataset.area = course.area;

        const BADGE = {
            approved:               { cls: 'badge-approved',               txt: '✓ APROBADA'   },
            available:              { cls: 'badge-available',              txt: '● DISPONIBLE' },
            locked:                 { cls: 'badge-locked',                 txt: '⊘ BLOQUEADA'  },
            intensivo:              { cls: 'badge-intensivo',              txt: '☀ INTENSIVO'  },
            'intensivo-available':  { cls: 'badge-intensivo-available',    txt: '+ ADELANTAR'  },
            habilitada:             { cls: 'badge-habilitada',             txt: '⚡ HABILITADA' },
            'habilitacion-posible': { cls: 'badge-habilitacion-posible',   txt: '+ HABILITAR'  },
            cursando:               { cls: 'badge-cursando',               txt: '▶ CURSANDO'   },
        };
        const b = BADGE[state];
        
        const count = intentos[course.id];
        const intentosHtml = (count > 0 && state !== 'approved' && state !== 'intensivo') 
            ? `<div class="course-intentos">${count}° INTENTO</div>` 
            : '';

        card.innerHTML = `
            <div>
                <span class="course-code">ID: ${course.id}</span>
                <span class="course-name">${course.name}</span>
            </div>
            ${intentosHtml}
            <div class="course-bottom">
                <span class="course-credits">${course.credits} CR.</span>
                <span class="course-status-badge ${b.cls}">${b.txt}</span>
            </div>`;

        /* Interacción */
        if (state !== 'locked') {
            card.addEventListener('click', () => App.onCardClick(course.id));
        } else {
            card.addEventListener('click', (e) => {
                if (missing.length > 0) {
                    _showTooltip(
                        `<div style="margin-bottom:6px;opacity:.8;font-size:.65rem;color:var(--accent-b);">🔒 PRERREQUISITOS FALTANTES:</div>` +
                        missing.map(n => `<span style="opacity:0.9;">• ${n}</span>`).join('<br>'),
                        card
                    );
                    // Ocultar al tocar en otro lado en móviles
                    const clearFn = (ev) => {
                        if (!ev.target.closest('.course-card[data-id="' + course.id + '"]')) {
                            _hideTooltip();
                            document.removeEventListener('click', clearFn);
                        }
                    };
                    setTimeout(() => document.addEventListener('click', clearFn), 50);
                }
            });
        }

        /* Tooltip en hover */
        card.addEventListener('mouseenter', () => {
            if (state === 'locked' && missing.length > 0) {
                _showTooltip(
                    `<div style="margin-bottom:6px;opacity:.8;font-size:.65rem;color:var(--accent-b);">🔒 PRERREQUISITOS FALTANTES:</div>` +
                    missing.map(n => `<span style="opacity:0.9;">• ${n}</span>`).join('<br>'),
                    card
                );
            } else if (state === 'intensivo-available') {
                _showTooltip(
                    `<div style="margin-bottom:4px;opacity:.6;font-size:.6rem;">MODO INTENSIVO:</div>` +
                    `Adelantable sin prerrequisitos`,
                    card
                );
            } else if (state === 'habilitacion-posible') {
                _showTooltip(
                    `<div style="margin-bottom:4px;opacity:.6;font-size:.6rem;">HABILITACIÓN DOCENTE:</div>` +
                    `Tomar materia sin prerrequisitos`,
                    card
                );
            } else if (state === 'cursando') {
                _showTooltip(
                    `<div style="margin-bottom:4px;opacity:.6;font-size:.6rem;">ACCIÓN REQUERIDA:</div>` +
                    `Presiona para marcar como Aprobado o Reprobado`,
                    card
                );
            }
            App.onCardHover(course.id, state);
        });

        card.addEventListener('mouseleave', () => {
            _hideTooltip();
            App.onCardLeave();
        });

        return card;
    }

    /* ─────────────────────────────────────────────
       PROGRAMMATIC TOOLTIPS
    ───────────────────────────────────────────── */
    function triggerCursandoTooltip(courseId) {
        const card = document.querySelector(`.course-card[data-id="${courseId}"]`);
        if (!card) return;
        _showTooltip(
            `<div style="margin-bottom:4px;opacity:.6;font-size:.6rem;">ACCIÓN REQUERIDA:</div>` +
            `Presiona para marcar como Aprobado o Reprobado`,
            card
        );
        // Desaparece solo en 3 segundos o al dar clic en otro lado
        const clearFn = () => {
            _hideTooltip();
            document.removeEventListener('click', clearFn);
        };
        setTimeout(() => document.addEventListener('click', clearFn), 100);
        setTimeout(clearFn, 3000);
    }

    /* ─────────────────────────────────────────────
       HIGHLIGHTS (hover prereq / dependent)
    ───────────────────────────────────────────── */
    function highlightConnections(courseId) {
        const course = COURSES.find(c => c.id === courseId);
        if (!course) return;
        course.reqs.forEach(rId => {
            document.querySelector(`.course-card[data-id="${rId}"]`)?.classList.add('hl-prereq');
        });
        COURSES.forEach(c => {
            if (c.reqs.includes(courseId)) {
                document.querySelector(`.course-card[data-id="${c.id}"]`)?.classList.add('hl-dependent');
            }
        });
    }

    function clearHighlights() {
        document.querySelectorAll('.hl-prereq, .hl-dependent')
            .forEach(el => el.classList.remove('hl-prereq', 'hl-dependent'));
    }

    /* ─────────────────────────────────────────────
       BÚSQUEDA
    ───────────────────────────────────────────── */
    function applySearch(query) {
        const q = query.trim().toLowerCase();
        document.querySelectorAll('.course-card').forEach(card => {
            const id     = card.dataset.id;
            const course = COURSES.find(c => c.id === id);
            if (!course) return;
            card.classList.remove('search-muted', 'search-match');
            if (!q) return;
            const haystack = [
                course.name.toLowerCase(),
                course.id.toLowerCase(),
                (AREA_LABELS[course.area] || '').toLowerCase(),
            ].join(' ');
            if (haystack.includes(q)) {
                card.classList.add('search-match');
            } else {
                card.classList.add('search-muted');
            }
        });
    }

    /* ─────────────────────────────────────────────
       FILTRO POR ESPECIALIZACIÓN
    ───────────────────────────────────────────── */

    /**
     * Calcula todos los IDs ancestros (prerrequisitos transitivos) de un
     * conjunto de cursos. Los ancestros son los "troncales" de la ruta.
     * @param {string[]} courseIds
     * @returns {Set<string>}
     */
    function _getAllAncestors(courseIds) {
        const ancestors = new Set();
        const visited   = new Set(courseIds); // evitar ciclos y re-visitas
        const queue     = [];

        courseIds.forEach(id => {
            const c = COURSES.find(item => item.id === id);
            if (c) c.reqs.forEach(r => { if (!visited.has(r)) queue.push(r); });
        });

        while (queue.length > 0) {
            const reqId = queue.shift();
            if (visited.has(reqId)) continue;
            visited.add(reqId);
            ancestors.add(reqId);
            const reqCourse = COURSES.find(item => item.id === reqId);
            if (reqCourse) reqCourse.reqs.forEach(r => {
                if (!visited.has(r)) queue.push(r);
            });
        }
        return ancestors;
    }

    /** Actualiza pills: color dinámico cuando está activa */
    function _updateSpecPills(activeSpecs) {
        const allPill = document.querySelector('.spec-pill[data-spec="all"]');
        if (allPill) {
            allPill.classList.toggle('active', activeSpecs.size === 0);
            allPill.style.removeProperty('--spec-color');
            allPill.style.removeProperty('--spec-glow');
        }
        document.querySelectorAll('.spec-pill[data-spec]:not([data-spec="all"])').forEach(pill => {
            const key    = pill.dataset.spec;
            const spec   = SPECIALIZATIONS[key];
            const isActive = activeSpecs.has(key);
            pill.classList.toggle('active', isActive);
            if (isActive && spec?.color) {
                pill.style.setProperty('--spec-color', spec.color);
                pill.style.setProperty('--spec-glow',  spec.glow || 'transparent');
            } else {
                pill.style.removeProperty('--spec-color');
                pill.style.removeProperty('--spec-glow');
            }
        });
    }

    /**
     * Sistema de iluminación por especialización:
     *   spec-highlight → materia directa de la ruta (glow colorido)
     *   spec-troncal   → prereq transitivo de la ruta (gris neutro, visible)
     *   spec-muted     → fuera de la ruta (casi invisible)
     * @param {Set<string>} activeSpecs
     */
    function applySpecFilter(activeSpecs) {
        const allCards = document.querySelectorAll('.course-card');

        // Sin filtro activo: limpiar todo
        if (activeSpecs.size === 0) {
            allCards.forEach(card => {
                card.classList.remove('spec-muted', 'spec-highlight', 'spec-troncal');
                card.style.removeProperty('--spec-color');
                card.style.removeProperty('--spec-glow');
            });
            _updateSpecPills(activeSpecs);
            return;
        }

        // Construir unión de IDs directos + mapa curso→primera spec activa
        const specIds   = new Set();
        const specByCard = {};   // courseId → primer specKey activo que lo contiene

        activeSpecs.forEach(key => {
            const spec = SPECIALIZATIONS[key];
            if (!spec) return;
            spec.courseIds.forEach(id => {
                specIds.add(id);
                if (!specByCard[id]) specByCard[id] = key; // primera spec wins
            });
        });

        // Calcular troncales: ancestros prereq de los cursos directos
        const troncalIds = _getAllAncestors([...specIds]);

        // Aplicar clases a cada card
        allCards.forEach(card => {
            const id = card.dataset.id;
            card.classList.remove('spec-muted', 'spec-highlight', 'spec-troncal');
            card.style.removeProperty('--spec-color');
            card.style.removeProperty('--spec-glow');

            if (specIds.has(id)) {
                // DIRECTA — iluminar con color de su spec
                card.classList.add('spec-highlight');
                const spec = SPECIALIZATIONS[specByCard[id]];
                if (spec?.color) card.style.setProperty('--spec-color', spec.color);
                if (spec?.glow)  card.style.setProperty('--spec-glow',  spec.glow);

            } else if (troncalIds.has(id)) {
                // TRONCAL / PREREQ — visible pero secundaria
                card.classList.add('spec-troncal');

            } else {
                // FUERA DE RUTA — casi invisible
                card.classList.add('spec-muted');
            }
        });

        _updateSpecPills(activeSpecs);
    }

    /* ─────────────────────────────────────────────
       BARRA DE ESPECIALIZACIÓN (generada dinámicamente)
    ───────────────────────────────────────────── */
    function renderSpecBar() {
        const bar = document.getElementById('specBar');
        if (!bar) return;
        bar.innerHTML = '';

        // Pill "TODAS"
        const allPill       = document.createElement('button');
        allPill.className   = 'spec-pill active';
        allPill.dataset.spec = 'all';
        allPill.type        = 'button';
        allPill.innerHTML   = '<span class="spec-all-icon">◈</span>TODAS';
        bar.appendChild(allPill);

        // Separador
        const sep       = document.createElement('span');
        sep.className   = 'spec-separator';
        sep.setAttribute('aria-hidden', 'true');
        bar.appendChild(sep);

        // Pills por especialización
        Object.entries(SPECIALIZATIONS).forEach(([key, spec]) => {
            const pill        = document.createElement('button');
            pill.className    = 'spec-pill';
            pill.dataset.spec = key;
            pill.type         = 'button';
            pill.title        = `${spec.courseIds.length} materias relacionadas`;
            pill.innerHTML    = `<span class="spec-icon">${spec.icon}</span><span class="spec-label">${spec.label}</span>`;
            bar.appendChild(pill);
        });
    }

    function showResultModal(courseId) {
        return new Promise(resolve => {
            const modal = document.getElementById('resultModal');
            const desc = document.getElementById('resultModalDesc');
            const course = COURSES.find(c => c.id === courseId);
            if (desc && course) {
                desc.textContent = `¿Cuál fue el resultado de ${course.name}?`;
            }
            
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');

            const btnApprove = document.getElementById('btnResultApprove');
            const btnFail    = document.getElementById('btnResultFail');
            const btnCancel  = document.getElementById('btnResultWithdraw');

            // Cleanup previous listeners
            const cloneApprove = btnApprove.cloneNode(true);
            const cloneFail    = btnFail.cloneNode(true);
            const cloneCancel  = btnCancel.cloneNode(true);
            const cloneModal   = modal.cloneNode(true);
            
            btnApprove.replaceWith(cloneApprove);
            btnFail.replaceWith(cloneFail);
            btnCancel.replaceWith(cloneCancel);
            modal.replaceWith(cloneModal);

            const newModal = document.getElementById('resultModal');
            
            function close(action) {
                newModal.classList.remove('active');
                newModal.setAttribute('aria-hidden', 'true');
                resolve(action);
            }

            document.getElementById('btnResultApprove').addEventListener('click', () => close('approve'));
            document.getElementById('btnResultFail').addEventListener('click', () => close('fail'));
            document.getElementById('btnResultWithdraw').addEventListener('click', () => close('withdraw'));
            
            newModal.addEventListener('click', function onClickOutside(e) {
                if (e.target === newModal) {
                    close('cancel');
                }
            });
        });
    }

    /* ─────────────────────────────────────────────
       MODOS Y TOGGLES
    ───────────────────────────────────────────── */
    function updateModoIntensivo(active) {
        const btn   = document.getElementById('btnIntensivo');
        const label = btn?.querySelector('.intensivo-label');
        if (!btn) return;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
        if (label) label.textContent = active ? 'INTENSIVO ON' : 'INTENSIVO';
    }

    function updateModoHabilitacion(active) {
        const btn   = document.getElementById('btnHabilitacion');
        const label = btn?.querySelector('.habilitacion-label');
        if (!btn) return;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
        if (label) label.textContent = active ? 'HABILITACIÓN ON' : 'HABILITAR';
    }

    /* ─────────────────────────────────────────────
       ANIMACIONES
    ───────────────────────────────────────────── */
    function animateApproval(courseId) {
        const el = document.querySelector(`.course-card[data-id="${courseId}"]`);
        if (!el) return;
        el.classList.add('anim-approve');
        setTimeout(() => el.classList.remove('anim-approve'), 550);
    }

    function animatePurge(courseIds) {
        courseIds.forEach(id => {
            document.querySelector(`.course-card[data-id="${id}"]`)?.classList.add('anim-purge');
        });
    }

    /* ─────────────────────────────────────────────
       GRID PRINCIPAL
    ───────────────────────────────────────────── */
    function malla(approved, intensivo, habilitadas, cursando, intentos, modoIntensivo, modoHabilitacion) {
        const grid = document.getElementById('mallaGrid');
        grid.innerHTML = '';

        for (let i = 1; i <= 9; i++) {
            const cycleArr  = COURSES.filter(c => c.cycle === i);
            const effective = new Set([...approved, ...intensivo]);
            const doneCount = cycleArr.filter(c => effective.has(c.id)).length;
            const pct       = cycleArr.length > 0 ? (doneCount / cycleArr.length) * 100 : 0;

            const col     = document.createElement('div');
            col.className = 'cycle-column';

            // Header del semestre con mini progress bar
            const header     = document.createElement('div');
            header.className = 'cycle-header';
            header.innerHTML = `
                <span class="cycle-title">SEMESTRE ${i}</span>
                <div class="cycle-sub">
                    <div class="cycle-progress" title="${Math.round(pct)}% completado">
                        <div class="cycle-progress-fill" style="width:${pct}%"></div>
                    </div>
                    <span class="cycle-count">${doneCount}/${cycleArr.length}</span>
                </div>`;
            col.appendChild(header);

            // Cards
            cycleArr.forEach(course =>
                col.appendChild(_buildCard(course, approved, intensivo, habilitadas, cursando, intentos, modoIntensivo, modoHabilitacion))
            );
            grid.appendChild(col);
        }
    }

    /* ─────────────────────────────────────────────
       STATS / HUD
       Recibe el array efectivo (normal + intensivo)
    ───────────────────────────────────────────── */
    function stats(effective) {
        const total     = COURSES.length;
        const approvedN = effective.length;
        const effectiveSet = new Set(effective);
        const availN    = COURSES.filter(c =>
            !effectiveSet.has(c.id) && c.reqs.every(r => effectiveSet.has(r))
        ).length;
        const lockedN   = total - approvedN - availN;
        const pct       = total > 0 ? Math.round((approvedN / total) * 100) : 0;

        document.getElementById('hudApproved').textContent  = approvedN;
        document.getElementById('hudAvailable').textContent = availN;
        document.getElementById('hudLocked').textContent    = lockedN;
        document.getElementById('hudProgressFill').style.width = `${pct}%`;
        document.getElementById('hudPercent').textContent   = `${pct}%`;
        document.getElementById('hudProgressBar').setAttribute('aria-valuenow', pct);
        document.getElementById('progressText').textContent = `${approvedN} / ${total}`;
    }

    /* ─────────────────────────────────────────────
       THEME MANAGER
    ───────────────────────────────────────────── */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        const themesConfig = {
            'batman': { icon: '🦇', color: '#060606' },
            'navy': { icon: '🌊', color: '#020a14' },
            'classic-dark': { icon: '🌙', color: '#121212' },
            'classic-light': { icon: '☀️', color: '#f5f5f5' },
            'be-dsam': { icon: '🔥', color: '#140505' },
            'be-fallasleep': { icon: '🕷️', color: '#070707' },
            'be-happier': { icon: '🕊️', color: '#d6cfc4' },
            'be-hmhas': { icon: '🌊', color: '#031024' },
            'ldr-born': { icon: '🌹', color: '#0f0b0a' },
            'ldr-ultra': { icon: '🚬', color: '#141414' },
            'ldr-nfr': { icon: '🌅', color: '#0e171c' },
            'ldr-ocean': { icon: '🚇', color: '#1a1715' }
        };
        
        const config = themesConfig[theme] || themesConfig['batman'];
        
        const themeIcon = document.getElementById('themeIcon');
        if(themeIcon) themeIcon.textContent = config.icon;
        
        const meta = document.getElementById('metaThemeColor');
        if (meta) meta.content = config.color;
    }

    /* ─────────────────────────────────────────────
       MODAL GENÉRICO
    ───────────────────────────────────────────── */
    function showConfirmModal({ title, desc, items }) {
        return new Promise((resolve) => {
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalDesc').innerHTML    = desc;
            document.getElementById('cascadeList').innerHTML  =
                items.map(n => `<li>${n}</li>`).join('');

            const modal     = document.getElementById('cascadeModal');
            const btnOk     = document.getElementById('btnConfirmCascade');
            const btnCancel = document.getElementById('btnCancelCascade');

            modal.setAttribute('aria-hidden', 'false');
            modal.classList.add('active');

            function cleanup(result) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                btnOk.removeEventListener('click',     onOk);
                btnCancel.removeEventListener('click', onCancel);
                resolve(result);
            }
            const onOk     = () => cleanup(true);
            const onCancel = () => cleanup(false);
            btnOk.addEventListener('click',     onOk);
            btnCancel.addEventListener('click', onCancel);
        });
    }

    function showCascadeModal(courseId, impactIds) {
        const course      = COURSES.find(c => c.id === courseId);
        const impactNames = impactIds.map(id => COURSES.find(c => c.id === id)?.name || id);
        return showConfirmModal({
            title: 'SYSTEM WARNING',
            desc:  `Quitar <strong>${course?.name || courseId}</strong> eliminará el avance en:`,
            items: impactNames,
        });
    }

    /* ─────────────────────────────────────────────
       API PÚBLICA
    ───────────────────────────────────────────── */
    return {
        malla,
        stats,
        applyTheme,
        showCascadeModal,
        showConfirmModal,
        showResultModal,
        animateApproval,
        animatePurge,
        updateModoIntensivo,
        updateModoHabilitacion,
        renderSpecBar,
        applySpecFilter,
        applySearch,
        clearHighlights,
        highlightConnections,
        triggerCursandoTooltip
    };
})();
