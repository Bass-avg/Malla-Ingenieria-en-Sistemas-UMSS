'use strict';

/* ═══════════════════════════════════════════════
   DATA MODULE — Malla Curricular v2.0
   Fuente única de verdad: materias, créditos, áreas
   ═══════════════════════════════════════════════ */

const COURSES = [
    // ── SEMESTRE 1 ──────────────────────────────
    { id: 'ALG1',  name: 'Álgebra I',                                  reqs: [],                       cycle: 1, credits: 6, area: 'math' },
    { id: 'CAL1',  name: 'Cálculo I',                                  reqs: [],                       cycle: 1, credits: 6, area: 'math' },
    { id: 'PROG1', name: 'Introducción a la Programación',             reqs: [],                       cycle: 1, credits: 5, area: 'programming' },
    { id: 'MET1',  name: 'Metodología de la Inv. y Técnicas de Com.',  reqs: [],                       cycle: 1, credits: 3, area: 'management' },
    { id: 'FISG',  name: 'Física General',                             reqs: [],                       cycle: 1, credits: 5, area: 'math' },
    { id: 'ING1',  name: 'Inglés I',                                   reqs: [],                       cycle: 1, credits: 3, area: 'languages' },

    // ── SEMESTRE 2 ──────────────────────────────
    { id: 'ALG2',  name: 'Álgebra II',                                 reqs: ['ALG1'],                 cycle: 2, credits: 6, area: 'math' },
    { id: 'CAL2',  name: 'Cálculo II',                                 reqs: ['CAL1'],                 cycle: 2, credits: 6, area: 'math' },
    { id: 'MATD',  name: 'Matemática Discreta',                        reqs: ['CAL1'],                 cycle: 2, credits: 5, area: 'math' },
    { id: 'ELEM',  name: 'Elementos de Prog. y Estructura de Datos',   reqs: ['MET1', 'PROG1'],        cycle: 2, credits: 5, area: 'programming' },
    { id: 'ARQ',   name: 'Arquitectura de Computadoras',               reqs: ['FISG'],                 cycle: 2, credits: 5, area: 'systems' },

    // ── SEMESTRE 3 ──────────────────────────────
    { id: 'EST1',  name: 'Estadística I',                              reqs: ['ALG2'],                 cycle: 3, credits: 5, area: 'math' },
    { id: 'EDIF',  name: 'Ecuaciones Diferenciales',                   reqs: ['CAL2'],                 cycle: 3, credits: 5, area: 'math' },
    { id: 'CNUM',  name: 'Cálculo Numérico',                           reqs: ['MATD'],                 cycle: 3, credits: 5, area: 'math' },
    { id: 'MTP',   name: 'Métodos y Técnicas de Programación',         reqs: ['ELEM'],                 cycle: 3, credits: 5, area: 'programming' },
    { id: 'BD1',   name: 'Base de Datos I',                            reqs: ['ELEM'],                 cycle: 3, credits: 5, area: 'programming' },
    { id: 'CELE',  name: 'Circuitos Electrónicos',                     reqs: ['ARQ'],                  cycle: 3, credits: 4, area: 'systems' },

    // ── SEMESTRE 4 ──────────────────────────────
    { id: 'EST2',  name: 'Estadística II',                             reqs: ['EST1'],                 cycle: 4, credits: 5, area: 'math' },
    { id: 'INV1',  name: 'Investigación Operativa I',                  reqs: ['EDIF'],                 cycle: 4, credits: 5, area: 'math' },
    { id: 'CONT',  name: 'Contabilidad Básica',                        reqs: ['CNUM'],                 cycle: 4, credits: 4, area: 'management' },
    { id: 'SI1',   name: 'Sistemas de Información I',                  reqs: ['MTP'],                  cycle: 4, credits: 5, area: 'software' },
    { id: 'BD2',   name: 'Base de Datos II',                           reqs: ['BD1'],                  cycle: 4, credits: 5, area: 'programming' },
    { id: 'TSO',   name: 'Taller de Sistemas Operativos',              reqs: ['CELE'],                 cycle: 4, credits: 4, area: 'systems' },

    // ── SEMESTRE 5 ──────────────────────────────
    { id: 'MERC',  name: 'Mercadotecnia',                              reqs: ['EST2'],                 cycle: 5, credits: 4, area: 'management' },
    { id: 'INV2',  name: 'Investigación Operativa II',                 reqs: ['INV1'],                 cycle: 5, credits: 5, area: 'math' },
    { id: 'SIS1',  name: 'Sistemas I',                                 reqs: ['CONT'],                 cycle: 5, credits: 5, area: 'software' },
    { id: 'SI2',   name: 'Sistemas de Información II',                 reqs: ['SI1'],                  cycle: 5, credits: 5, area: 'software' },
    { id: 'TBD',   name: 'Taller de Base de Datos',                    reqs: ['BD2'],                  cycle: 5, credits: 4, area: 'programming' },
    { id: 'ASO',   name: 'Aplicación de Sistemas Operativos',          reqs: ['TSO'],                  cycle: 5, credits: 4, area: 'systems' },
    { id: 'ING2',  name: 'Inglés II',                                  reqs: ['ING1'],                 cycle: 5, credits: 3, area: 'languages' },

    // ── SEMESTRE 6 ──────────────────────────────
    { id: 'SECO',  name: 'Sistemas Económicos',                        reqs: ['MERC'],                 cycle: 6, credits: 4, area: 'management' },
    { id: 'SIM',   name: 'Simulación de Sistemas',                     reqs: ['INV2'],                 cycle: 6, credits: 5, area: 'math' },
    { id: 'SIS2',  name: 'Sistemas II',                                reqs: ['SIS1'],                 cycle: 6, credits: 5, area: 'software' },
    { id: 'ISW',   name: 'Ingeniería de Software',                     reqs: ['SI2'],                  cycle: 6, credits: 5, area: 'software' },
    { id: 'IA',    name: 'Inteligencia Artificial',                    reqs: ['TBD'],                  cycle: 6, credits: 5, area: 'programming' },
    { id: 'RED',   name: 'Redes de Computadoras',                      reqs: ['ASO'],                  cycle: 6, credits: 5, area: 'networks' },

    // ── SEMESTRE 7 ──────────────────────────────
    { id: 'PLAN',  name: 'Planificación y Eval. de Proyectos',         reqs: ['SECO'],                 cycle: 7, credits: 5, area: 'management' },
    { id: 'DIN',   name: 'Dinámica de Sistemas',                       reqs: ['SIM'],                  cycle: 7, credits: 5, area: 'math' },
    { id: 'TS1',   name: 'Tópicos Selectos I',                         reqs: ['SIS2'],                 cycle: 7, credits: 5, area: 'elective' },
    { id: 'TISW',  name: 'Taller de Ingeniería de Software',           reqs: ['ISW'],                  cycle: 7, credits: 4, area: 'software' },
    { id: 'GCAL',  name: 'Gestión de Calidad de Software',             reqs: ['IA'],                   cycle: 7, credits: 4, area: 'software' },
    { id: 'RADV',  name: 'Redes Avanzadas de Computadoras',            reqs: ['RED'],                  cycle: 7, credits: 5, area: 'networks' },

    // ── SEMESTRE 8 ──────────────────────────────
    { id: 'GEE',   name: 'Gestión Estratégica de Empresas',            reqs: ['PLAN'],                 cycle: 8, credits: 5, area: 'management' },
    { id: 'TMS',   name: 'Taller de Modelación y Simulación',          reqs: ['DIN'],                  cycle: 8, credits: 4, area: 'math' },
    { id: 'TS2',   name: 'Tópicos Selectos II',                        reqs: ['TS1', 'TISW'],          cycle: 8, credits: 5, area: 'elective' },
    { id: 'METP',  name: 'Metodología y Planif. de Proy. de Grado',    reqs: ['TS1', 'TISW'],          cycle: 8, credits: 5, area: 'management' },
    { id: 'EAUD',  name: 'Evaluación y Auditoría de Sistemas',         reqs: ['GCAL'],                 cycle: 8, credits: 5, area: 'software' },
    { id: 'SEG',   name: 'Seguridad de Sistemas',                      reqs: ['RADV'],                 cycle: 8, credits: 5, area: 'networks' },
    { id: 'ING3',  name: 'Inglés III',                                 reqs: ['ING2'],                 cycle: 8, credits: 3, area: 'languages' },

    // ── SEMESTRE 9 ──────────────────────────────
    { id: 'TS3',   name: 'Tópicos Selectos III',                       reqs: ['GEE'],                  cycle: 9, credits: 5, area: 'elective' },
    { id: 'TS4',   name: 'Tópicos Selectos IV',                        reqs: ['TMS'],                  cycle: 9, credits: 5, area: 'elective' },
    { id: 'PRAC',  name: 'Práctica Empresarial',                       reqs: ['TS2', 'METP'],          cycle: 9, credits: 6, area: 'elective' },
    { id: 'PFN',   name: 'Proyecto Final',                             reqs: ['TS2', 'METP'],          cycle: 9, credits: 6, area: 'elective' },
    { id: 'TS5',   name: 'Tópicos Selectos V',                         reqs: ['EAUD'],                 cycle: 9, credits: 5, area: 'elective' },
    { id: 'TS6',   name: 'Tópicos Selectos VI',                        reqs: ['TS2', 'METP', 'SEG'],   cycle: 9, credits: 5, area: 'elective' },
];

const AREA_LABELS = {
    math:        'MATEMÁTICA',
    programming: 'PROGRAMACIÓN',
    systems:     'SISTEMAS',
    software:    'SOFTWARE',
    networks:    'REDES',
    management:  'GESTIÓN',
    languages:   'IDIOMAS',
    elective:    'ELECTIVO',
};

const TOTAL_CREDITS = COURSES.reduce((sum, c) => sum + c.credits, 0);

/* ─── ESPECIALIZACIONES OFICIALES — UMSS SISTEMAS ───────────── */
const SPECIALIZATIONS = {
    bd:    {
        label:     'Bases de Datos',
        icon:      '🗄',
        color:     '#06b6d4',
        glow:      'rgba(6, 182, 212, 0.35)',
        courseIds: ['ELEM', 'MTP', 'BD1', 'BD2', 'TBD', 'IA'],
    },
    tlp:   {
        label:     'Tec. de Lenguajes',
        icon:      '💻',
        color:     '#a78bfa',
        glow:      'rgba(167, 139, 250, 0.35)',
        courseIds: ['PROG1', 'ELEM', 'MTP', 'MATD', 'BD1', 'IA'],
    },
    isw:   {
        label:     'Ing. de Software',
        icon:      '🖥',
        color:     '#10b981',
        glow:      'rgba(16, 185, 129, 0.35)',
        courseIds: ['SI1', 'SI2', 'ISW', 'TISW', 'GCAL', 'EAUD', 'TS1', 'TS2', 'METP', 'PRAC', 'PFN'],
    },
    ia:    {
        label:     'Inteligencia Artificial',
        icon:      '🤖',
        color:     '#f59e0b',
        glow:      'rgba(245, 158, 11, 0.35)',
        courseIds: ['CNUM', 'MATD', 'EST1', 'EST2', 'BD1', 'BD2', 'TBD', 'IA', 'GCAL'],
    },
    sim:   {
        label:     'Modelación y Simulación',
        icon:      '📐',
        color:     '#3b82f6',
        glow:      'rgba(59, 130, 246, 0.35)',
        courseIds: ['EST1', 'EST2', 'INV1', 'INV2', 'SIM', 'DIN', 'TMS', 'TS4'],
    },
    ge:    {
        label:     'Gestión Empresarial',
        icon:      '💼',
        color:     '#f97316',
        glow:      'rgba(249, 115, 22, 0.35)',
        courseIds: ['CONT', 'MERC', 'SECO', 'SIM', 'PLAN', 'GEE', 'METP', 'TS3'],
    },
    redes: {
        label:     'Redes y Telecom.',
        icon:      '🌐',
        color:     '#22c55e',
        glow:      'rgba(34, 197, 94, 0.35)',
        courseIds: ['ARQ', 'CELE', 'TSO', 'ASO', 'RED', 'RADV', 'TS6'],
    },
    si:    {
        label:     'Sist. de Información',
        icon:      '📊',
        color:     '#ec4899',
        glow:      'rgba(236, 72, 153, 0.35)',
        courseIds: ['SI1', 'SI2', 'SIS1', 'SIS2', 'DIN', 'TS1', 'TS2'],
    },
    bi:    {
        label:     'Inteligencia de Negocios',
        icon:      '📈',
        color:     '#c084fc',
        glow:      'rgba(192, 132, 252, 0.35)',
        courseIds: ['EST1', 'EST2', 'BD1', 'BD2', 'TBD', 'IA', 'SIM', 'MERC', 'SECO', 'GEE'],
    },
    seg:   {
        label:     'Seguridad Informática',
        icon:      '🔐',
        color:     '#fb7185',
        glow:      'rgba(251, 113, 133, 0.35)',
        courseIds: ['ARQ', 'TSO', 'ASO', 'RED', 'RADV', 'SEG', 'TS6'],
    },
};
