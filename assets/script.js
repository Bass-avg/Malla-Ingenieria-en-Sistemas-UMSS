const courses = [
    // SEMESTRE 1
    { id: 'ALG1', name: 'Álgebra I', reqs: [], cycle: 1 },
    { id: 'CAL1', name: 'Cálculo I', reqs: [], cycle: 1 },
    { id: 'PROG1', name: 'Introducción a la Programación', reqs: [], cycle: 1 },
    { id: 'MET1', name: 'Metodología de la Inv. y Técnicas de Com.', reqs: [], cycle: 1 },
    { id: 'FISG', name: 'Física General', reqs: [], cycle: 1 },
    { id: 'ING1', name: 'Inglés I', reqs: [], cycle: 1 },

    // SEMESTRE 2
    { id: 'ALG2', name: 'Álgebra II', reqs: ['ALG1'], cycle: 2 },
    { id: 'CAL2', name: 'Cálculo II', reqs: ['CAL1'], cycle: 2 },
    { id: 'MATD', name: 'Matemática Discreta', reqs: ['CAL1'], cycle: 2 },
    { id: 'ELEM', name: 'Elementos de Prog. y Estructura de Datos', reqs: ['MET1', 'PROG1'], cycle: 2 },
    { id: 'ARQ', name: 'Arquitectura de Computadoras', reqs: ['FISG'], cycle: 2 },

    // SEMESTRE 3
    { id: 'EST1', name: 'Estadística I', reqs: ['ALG2'], cycle: 3 },
    { id: 'EDIF', name: 'Ecuaciones Diferenciales', reqs: ['CAL2'], cycle: 3 },
    { id: 'CNUM', name: 'Cálculo Numérico', reqs: ['MATD'], cycle: 3 },
    { id: 'MTP', name: 'Métodos y Técnicas de Programación', reqs: ['ELEM'], cycle: 3 },
    { id: 'BD1', name: 'Base de Datos I', reqs: ['ELEM'], cycle: 3 },
    { id: 'CELE', name: 'Circuitos Electrónicos', reqs: ['ARQ'], cycle: 3 },

    // SEMESTRE 4
    { id: 'EST2', name: 'Estadística II', reqs: ['EST1'], cycle: 4 },
    { id: 'INV1', name: 'Investigación Operativa I', reqs: ['EDIF'], cycle: 4 },
    { id: 'CONT', name: 'Contabilidad Básica', reqs: ['CNUM'], cycle: 4 },
    { id: 'SI1', name: 'Sistemas de Información I', reqs: ['MTP'], cycle: 4 },
    { id: 'BD2', name: 'Base de Datos II', reqs: ['BD1'], cycle: 4 },
    { id: 'TSO', name: 'Taller de Sistemas Operativos', reqs: ['CELE'], cycle: 4 },

    // SEMESTRE 5
    { id: 'MERC', name: 'Mercadotecnia', reqs: ['EST2'], cycle: 5 },
    { id: 'INV2', name: 'Investigación Operativa II', reqs: ['INV1'], cycle: 5 },
    { id: 'SIS1', name: 'Sistemas I', reqs: ['CONT'], cycle: 5 },
    { id: 'SI2', name: 'Sistemas de Información II', reqs: ['SI1'], cycle: 5 },
    { id: 'TBD', name: 'Taller de Base de Datos', reqs: ['BD2'], cycle: 5 },
    { id: 'ASO', name: 'Aplicación de Sistemas Operativos', reqs: ['TSO'], cycle: 5 },
    { id: 'ING2', name: 'Inglés II', reqs: ['ING1'], cycle: 5 },

    // SEMESTRE 6
    { id: 'SECO', name: 'Sistemas Económicos', reqs: ['MERC'], cycle: 6 },
    { id: 'SIM', name: 'Simulación de Sistemas', reqs: ['INV2'], cycle: 6 },
    { id: 'SIS2', name: 'Sistemas II', reqs: ['SIS1'], cycle: 6 },
    { id: 'ISW', name: 'Ingeniería de Software', reqs: ['SI2'], cycle: 6 },
    { id: 'IA', name: 'Inteligencia Artificial', reqs: ['TBD'], cycle: 6 },
    { id: 'RED', name: 'Redes de Computadoras', reqs: ['ASO'], cycle: 6 },

    // SEMESTRE 7
    { id: 'PLAN', name: 'Planificación y Eval. de Proyectos', reqs: ['SECO'], cycle: 7 },
    { id: 'DIN', name: 'Dinámica de Sistemas', reqs: ['SIM'], cycle: 7 },
    { id: 'TS1', name: 'Tópicos Selectos I', reqs: ['SIS2'], cycle: 7 },
    { id: 'TISW', name: 'Taller de Ingeniería de Software', reqs: ['ISW'], cycle: 7 },
    { id: 'GCAL', name: 'Gestión de Calidad de Software', reqs: ['IA'], cycle: 7 },
    { id: 'RADV', name: 'Redes Avanzadas de Computadoras', reqs: ['RED'], cycle: 7 },

    // SEMESTRE 8
    { id: 'GEE', name: 'Gestión Estratégica de Empresas', reqs: ['PLAN'], cycle: 8 },
    { id: 'TMS', name: 'Taller de Modelación y Simulación', reqs: ['DIN'], cycle: 8 },
    { id: 'TS2', name: 'Tópicos Selectos II', reqs: ['TS1', 'TISW'], cycle: 8 },
    { id: 'METP', name: 'Metodología y Planif. de Proy. de Grado', reqs: ['TS1', 'TISW'], cycle: 8 },
    { id: 'EAUD', name: 'Evaluación y Auditoría de Sistemas', reqs: ['GCAL'], cycle: 8 },
    { id: 'SEG', name: 'Seguridad de Sistemas', reqs: ['RADV'], cycle: 8 },
    { id: 'ING3', name: 'Inglés III', reqs: ['ING2'], cycle: 8 },

    // SEMESTRE 9
    { id: 'TS3', name: 'Tópicos Selectos III', reqs: ['GEE'], cycle: 9 },
    { id: 'TS4', name: 'Tópicos Selectos IV', reqs: ['TMS'], cycle: 9 },
    { id: 'PRAC', name: 'Práctica Empresarial', reqs: ['TS2', 'METP'], cycle: 9 },
    { id: 'PFN', name: 'Proyecto Final', reqs: ['TS2', 'METP'], cycle: 9 },
    { id: 'TS5', name: 'Tópicos Selectos V', reqs: ['EAUD'], cycle: 9 },
    { id: 'TS6', name: 'Tópicos Selectos VI', reqs: ['TS2', 'METP', 'SEG'], cycle: 9 }
];

let approvedCourses = JSON.parse(localStorage.getItem('vengeance_progress')) || [];

function renderMalla() {
    const grid = document.getElementById('mallaGrid');
    grid.innerHTML = '';

    for (let i = 1; i <= 9; i++) {
        const column = document.createElement('div');
        column.className = 'cycle-column';

        const header = document.createElement('div');
        header.className = 'cycle-header';
        header.innerText = `SEMESTRE ${i}`;
        column.appendChild(header);

        const cycleCourses = courses.filter(c => c.cycle === i);
        cycleCourses.forEach(course => {
            const isApproved = approvedCourses.includes(course.id);
            const missingReqs = course.reqs.filter(reqId => !approvedCourses.includes(reqId));
            const isLocked = missingReqs.length > 0;

            const card = document.createElement('div');
            card.className = `course-card ${isApproved ? 'approved' : ''} ${isLocked ? 'locked' : ''}`;

            const missingNames = missingReqs.map(id => {
                const match = courses.find(c => c.id === id);
                return match ? match.name : id;
            });

            card.innerHTML = `
                <span class="course-code">ACCESS_ID: ${course.id}</span>
                <span class="course-name">${course.name}</span>
                ${isLocked ? `<div class="tooltip">MISSING CLEARANCE: <br>${missingNames.join(', ')}</div>` : ''}
            `;

            if (!isLocked) {
                card.onclick = () => toggleCourse(course.id);
            }

            column.appendChild(card);
        });

        grid.appendChild(column);
    }
}

function toggleCourse(id) {
    if (approvedCourses.includes(id)) {
        approvedCourses = approvedCourses.filter(c => c !== id);
    } else {
        approvedCourses.push(id);
    }
    saveAndRefresh();
}

function saveAndRefresh() {
    // Lógica de cascada: si desapruebas una base, se pierden las avanzadas
    let changed = true;
    while (changed) {
        const before = approvedCourses.length;
        approvedCourses = approvedCourses.filter(cid => {
            const c = courses.find(item => item.id === cid);
            return c.reqs.every(r => approvedCourses.includes(r));
        });
        changed = approvedCourses.length !== before;
    }

    localStorage.setItem('vengeance_progress', JSON.stringify(approvedCourses));
    renderMalla();
    updateStats();
}

function updateStats() {
    document.getElementById('progressText').innerText = `${approvedCourses.length}/${courses.length}`;
}

function resetProgress() {
    if (confirm('SYSTEM ADVISORY: This will erase all curriculum data. Proceed?')) {
        approvedCourses = [];
        saveAndRefresh();
    }
}

window.onload = () => {
    renderMalla();
    updateStats();
};
