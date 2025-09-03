import type { RequirementPreset, ShiftRequirements } from '../types';

// Helper to safely create a deep copy
const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// --- TEMPLATE INFERMIERI E CAPOSALA ---
const standardNurseRequirements: ShiftRequirements = {};
// [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
standardNurseRequirements['M'] =   [0, 3, 3, 3, 3, 3, 3];
standardNurseRequirements['Mac'] = [0, {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}, 0];
standardNurseRequirements['Mat'] = [0, 0, 0, 0, 0, 0, 0];
standardNurseRequirements['Mat/e'] = [0, 0, 0, 0, 0, 0, 0];
standardNurseRequirements['Mb'] =  [0, 0, 0, 0, 0, 0, 0];
standardNurseRequirements['Mc'] =  [0, {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}, 0];
standardNurseRequirements['Mco'] = [0, {min: 2, max: 3}, 0, {min: 2, max: 3}, {min: 2, max: 3}, 0, 0];
standardNurseRequirements['Md'] =  [0, 2, 2, 2, 2, 2, 0];
standardNurseRequirements['Me'] =  [0, 1, 1, 1, 1, 1, 1];
standardNurseRequirements['Mn'] =  [2, 2, 2, 2, 2, 2, 2];
standardNurseRequirements['Msc'] = [0, {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}, 0];
standardNurseRequirements['Mu'] =  [0, {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}, 0];
standardNurseRequirements['N'] =   [{min: 3, max: 4}, {min: 3, max: 4}, {min: 3, max: 4}, {min: 3, max: 4}, {min: 3, max: 4}, {min: 3, max: 4}, {min: 3, max: 4}];
standardNurseRequirements['Pb'] =  [0, 0, 0, 0, 0, 0, 0];
standardNurseRequirements['Pc'] =  [0, {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}];
standardNurseRequirements['Pe'] =  [0, 1, 1, 1, 1, 1, 1];
standardNurseRequirements['Pn'] =  [2, 2, 2, 2, 2, 2, 2];
standardNurseRequirements['Ps'] =  [0, 2, 0, 2, 0, 2, 0];
standardNurseRequirements['Psc'] = [0, {min: 2, max: 3}, 0, {min: 2, max: 3}, 0, {min: 2, max: 3}, 0];
standardNurseRequirements['Pu'] =  [0, {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}];

const summerNurseRequirements: ShiftRequirements = {};
summerNurseRequirements['M'] =   [1, 1, 1, 1, 1, 1, 1];
summerNurseRequirements['Md'] =  [0, 1, 1, 1, 1, 1, 0];
summerNurseRequirements['Ps'] =  [0, 1, 1, 1, 1, 1, 0];
summerNurseRequirements['Msc'] = [0, 1, 1, 1, 1, 1, 0];
summerNurseRequirements['Psc'] = [0, 1, 1, 1, 1, 1, 0];
summerNurseRequirements['Mc'] =  [0, 1, 1, 1, 1, 1, 0];
summerNurseRequirements['Pc'] =  [0, 1, 1, 1, 1, 1, 0];
summerNurseRequirements['Mn'] =  [1, 1, 1, 1, 1, 1, 1];
summerNurseRequirements['Pn'] =  [1, 1, 1, 1, 1, 1, 1];
summerNurseRequirements['N'] =   [1, 1, 1, 1, 1, 1, 1];
summerNurseRequirements['Mu'] =  [1, 1, 1, 1, 1, 1, 1];
summerNurseRequirements['Pu'] =  [1, 1, 1, 1, 1, 1, 1];
summerNurseRequirements['Mat'] = [0, 1, 0, 1, 0, 1, 0];

// --- TEMPLATE OSS ---
const standardOSSRequirements: ShiftRequirements = {};
standardOSSRequirements['M0'] = [1, 1, 1, 1, 1, 1, 1];
standardOSSRequirements['P0'] = [1, 1, 1, 1, 1, 1, 1];
standardOSSRequirements['MT'] = [0, 1, 1, 1, 1, 1, 0];
standardOSSRequirements['PT'] = [0, 1, 1, 1, 1, 1, 0];

// --- TEMPLATE MEDICI ---
const standardDoctorRequirements: ShiftRequirements = {};
standardDoctorRequirements['G_doc'] = [1, 1, 1, 1, 1, 1, 1]; // Guardia sempre presente
standardDoctorRequirements['R_doc'] = [1, 1, 1, 1, 1, 1, 1]; // Reperibilità sempre presente
standardDoctorRequirements['A_doc'] = [0, 2, 2, 2, 2, 2, 0]; // Ambulatorio durante la settimana
standardDoctorRequirements['N_doc'] = [1, 1, 1, 1, 1, 1, 1]; // Notte sempre presente


export const REQUIREMENT_PRESETS: RequirementPreset[] = [
    { id: 'preset-empty', name: 'Template Vuoto', requirements: {}, role: 'all' },
    
    { id: 'preset-nurse-standard', name: 'Standard (Infermieri)', requirements: standardNurseRequirements, role: 'nurses' },
    { id: 'preset-nurse-summer', name: 'Estivo (Infermieri)', requirements: summerNurseRequirements, role: 'nurses' },
    
    { id: 'preset-oss-standard', name: 'Standard (OSS)', requirements: standardOSSRequirements, role: 'oss' },

    { id: 'preset-doctor-standard', name: 'Standard (Medici)', requirements: standardDoctorRequirements, role: 'doctors' },
];