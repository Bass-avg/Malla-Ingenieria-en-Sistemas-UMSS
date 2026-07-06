'use strict';

/* ═══════════════════════════════════════════════
   STORAGE MODULE — Malla Curricular v2.0
   Abstracción de localStorage con manejo de errores
   Soporta: progreso, tema, backup JSON, restore JSON
   ═══════════════════════════════════════════════ */

const Storage = (() => {
    const KEYS = {
        PROGRESS:    'vengeance_progress',
        INTENSIVO:   'vengeance_intensivo',
        HABILITADAS: 'vengeance_habilitadas',
        CURSANDO:    'vengeance_cursando',
        INTENTOS:    'vengeance_intentos',
        THEME:       'vengeance_theme',
    };

    function tryGet(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw !== null ? JSON.parse(raw) : fallback;
        } catch (e) {
            console.warn('[Storage] Error reading key:', key, e.message);
            return fallback;
        }
    }

    function trySet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('[Storage] localStorage no disponible (¿modo incógnito?):', e.message);
            return false;
        }
    }

    return {
        /* Progreso académico */
        loadProgress()    { return tryGet(KEYS.PROGRESS, []); },
        saveProgress(arr) { return trySet(KEYS.PROGRESS, arr); },
        clearProgress()   { return trySet(KEYS.PROGRESS, []); },

        /* Progreso intensivo (invierno/verano) */
        loadIntensivo()    { return tryGet(KEYS.INTENSIVO, []); },
        saveIntensivo(arr) { return trySet(KEYS.INTENSIVO, arr); },
        clearIntensivo()   { return trySet(KEYS.INTENSIVO, []); },

        /* Materias Habilitadas sin prerequisitos */
        loadHabilitadas()    { return tryGet(KEYS.HABILITADAS, []); },
        saveHabilitadas(arr) { return trySet(KEYS.HABILITADAS, arr); },
        clearHabilitadas()   { return trySet(KEYS.HABILITADAS, []); },

        /* Materias Cursando */
        loadCursando()    { return tryGet(KEYS.CURSANDO, []); },
        saveCursando(arr) { return trySet(KEYS.CURSANDO, arr); },
        clearCursando()   { return trySet(KEYS.CURSANDO, []); },

        /* Intentos (Reprobaciones) */
        loadIntentos()    { return tryGet(KEYS.INTENTOS, {}); },
        saveIntentos(obj) { return trySet(KEYS.INTENTOS, obj); },
        clearIntentos()   { return trySet(KEYS.INTENTOS, {}); },

        /* Limpia TODO el avance */
        clearAll() {
            trySet(KEYS.PROGRESS, []);
            trySet(KEYS.INTENSIVO, []);
            trySet(KEYS.HABILITADAS, []);
            trySet(KEYS.CURSANDO, []);
            trySet(KEYS.INTENTOS, {});
        },

        /* Tema visual */
        loadTheme()        { return tryGet(KEYS.THEME, 'batman'); },
        saveTheme(theme)   { return trySet(KEYS.THEME, theme); },

        /* Backup: descarga JSON con el progreso actual */
        exportBackup() {
            const payload = {
                version:      '2.3',
                app:          'Malla-UMSS',
                timestamp:    new Date().toISOString(),
                approved:     tryGet(KEYS.PROGRESS, []),
                intensivo:    tryGet(KEYS.INTENSIVO, []),
                habilitadas:  tryGet(KEYS.HABILITADAS, []),
                cursando:     tryGet(KEYS.CURSANDO, []),
                intentos:     tryGet(KEYS.INTENTOS, {}),
            };
            const blob = new Blob(
                [JSON.stringify(payload, null, 2)],
                { type: 'application/json' }
            );
            const url = URL.createObjectURL(blob);
            const a   = document.createElement('a');
            a.href     = url;
            a.download = `vengeance_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        /* Restore: carga JSON y devuelve array de aprobadas */
        importBackup(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data     = JSON.parse(e.target.result);
                        // Soporta formato nuevo y formato antiguo [...]
                        const approved = Array.isArray(data) ? data : data.approved;
                        if (!Array.isArray(approved)) {
                            throw new Error('El archivo no contiene un formato válido.');
                        }
                        trySet(KEYS.PROGRESS, approved);
                        
                        if (data.version && data.version >= '2.1') {
                            trySet(KEYS.INTENSIVO, data.intensivo || []);
                        }
                        if (data.version && data.version >= '2.2') {
                            trySet(KEYS.HABILITADAS, data.habilitadas || []);
                        }
                        if (data.version && data.version >= '2.3') {
                            trySet(KEYS.CURSANDO, data.cursando || []);
                            trySet(KEYS.INTENTOS, data.intentos || {});
                        }
                        
                        resolve(approved);
                    } catch (err) {
                        reject(err);
                    }
                };
                reader.onerror = () => reject(new Error('Error al leer el archivo.'));
                reader.readAsText(file);
            });
        },
    };
})();
