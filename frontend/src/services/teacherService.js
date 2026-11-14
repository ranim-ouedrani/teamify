/* Données fictives de l'espace enseignant (profil, modules, classes, projets, avancement des équipes). À remplacer par l'API. */
const wait = (v) => new Promise((r) => setTimeout(() => r(structuredClone(v)), 250));

const TEACHER = {
  firstName: 'Mohamed', lastName: 'Ben Ali', email: 'prof@teamify.tn', department: 'Informatique', grade: 'Maître de conférences', office: 'Bloc B · Bureau 12',
  modules: [
    { code: 'GL', name: 'Génie logiciel', classes: ['3A12', '4GL2'], hours: 42 },
    { code: 'BDA', name: 'Bases de données avancées', classes: ['3A12'], hours: 30 },
    { code: 'MS', name: 'Architecture microservices', classes: ['4GL2', '5IA1'], hours: 36 },
    { code: 'IA', name: 'Intelligence artificielle', classes: ['5IA1'], hours: 28 },
  ],
  classes: [
    { id: '3A12', level: '3ème année', year: '2026-2027', students: 28 },
    { id: '4GL2', level: '4ème année', year: '2026-2027', students: 24 },
    { id: '5IA1', level: '5ème année', year: '2026-2027', students: 19 },
  ],
};
const T = (name, progress, task) => ({ name, progress, task });
const PROJECTS = [
  { id: 'p1', title: 'Plateforme de covoiturage étudiant', module: 'Génie logiciel', classId: '3A12', deadline: '2026-12-15', teamSize: 4, assignment: 'EN_VALIDATION',
    teams: [T('Équipe A', 72, 'Maquettes validées'), T('Équipe B', 55, 'API REST en cours'), T('Équipe C', 80, 'Tests d’intégration'), T('Équipe D', 40, 'Conception UML')] },
  { id: 'p2', title: 'Migration vers MongoDB', module: 'Bases de données avancées', classId: '3A12', deadline: '2026-12-02', teamSize: 3, assignment: 'VALIDEE',
    teams: [T('Équipe A', 90, 'Rapport final'), T('Équipe B', 65, 'Migration des données'), T('Équipe C', 30, 'Étude comparative')] },
  { id: 'p3', title: 'Mini-ERP en microservices', module: 'Architecture microservices', classId: '4GL2', deadline: '2027-01-10', teamSize: 4, assignment: 'PUBLIEE',
    teams: [T('Équipe A', 48, 'Service Stock'), T('Équipe B', 62, 'API Gateway'), T('Équipe C', 35, 'Service Facturation')] },
  { id: 'p4', title: 'Détection de fraude bancaire', module: 'Intelligence artificielle', classId: '5IA1', deadline: '2027-01-20', teamSize: 3, assignment: 'NON_AFFECTE', teams: [] },
];
export const ASSIGNMENT = { NON_AFFECTE: ['Équipes non constituées', 'err'], BROUILLON: ['Brouillon', 'neutral'], EN_VALIDATION: ['En validation', 'warn'], VALIDEE: ['Validée', 'ok'], PUBLIEE: ['Publiée', 'ok'] };
export const avg = (p) => (p.teams.length ? Math.round(p.teams.reduce((a, t) => a + t.progress, 0) / p.teams.length) : 0);

export const teacherService = {
  getProfile: () => wait(TEACHER),
  getProjects: () => wait(PROJECTS),
};
