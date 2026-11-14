/*
  Service Course / Group (données fictives pour l'instant).
  Remplacez chaque fonction par un appel à l'API Gateway, par ex. :
    generateTeams: (req) => http.post('/api/groups/requests', req)   // renvoie les équipes calculées par le microservice ML
  Les indicateurs (balance, diversity) sont fournis par le ML : le frontend ne les calcule jamais.
*/
const wait = (v, ms = 300) => new Promise((r) => setTimeout(() => r(structuredClone(v)), ms));

const PRE = ['Amine', 'Sarra', 'Yassine', 'Mariem', 'Oussema', 'Ines', 'Karim', 'Nour', 'Hedi', 'Rania', 'Walid', 'Salma', 'Fares', 'Lina', 'Bilel', 'Asma'];
const NOM = ['Trabelsi', 'Ben Salah', 'Gharbi', 'Jlassi', 'Fattoumi', 'Mejri', 'Chebbi', 'Haddad', 'Sassi', 'Mansour', 'Ayari', 'Zouari', 'Khelifi', 'Bouzid', 'Hamdi', 'Cherif'];
const students = (n) => PRE.slice(0, n).map((p, i) => ({ id: `ET26${101 + i}`, name: `${p} ${NOM[(i * 5 + 3) % 16]}` }));

const DATA = {
  courses: [
    { id: 'c1', name: 'Génie logiciel' }, { id: 'c2', name: 'Bases de données avancées' },
    { id: 'c3', name: 'Architecture microservices' }, { id: 'c4', name: 'Intelligence artificielle' },
  ],
  classes: [{ id: '3A12', level: '3ème année', size: 28 }, { id: '4GL2', level: '4ème année', size: 24 }, { id: '5IA1', level: '5ème année', size: 19 }],
  projects: [
    { id: 'p1', title: 'Plateforme de covoiturage étudiant', courseId: 'c1', classId: '3A12', deadline: '2026-12-15', teamSize: 4 },
    { id: 'p2', title: 'Migration vers MongoDB', courseId: 'c2', classId: '3A12', deadline: '2026-12-02', teamSize: 3 },
    { id: 'p3', title: 'Mini-ERP en microservices', courseId: 'c3', classId: '4GL2', deadline: '2027-01-10', teamSize: 4 },
    { id: 'p4', title: 'Détection de fraude bancaire', courseId: 'c4', classId: '5IA1', deadline: '2027-01-20', teamSize: 3 },
  ],
  history: [
    { id: 'h1', project: 'Plateforme de covoiturage étudiant', classId: '3A12', version: 2, date: '10/11/2026 09:42', status: 'EN_VALIDATION' },
    { id: 'h2', project: 'Mini-ERP en microservices', classId: '4GL2', version: 3, date: '06/11/2026 15:10', status: 'PUBLIEE' },
    { id: 'h3', project: 'Migration vers MongoDB', classId: '3A12', version: 1, date: '03/11/2026 11:25', status: 'VALIDEE' },
  ],
};
const ML = [[88, 92], [81, 76], [93, 85], [74, 90], [85, 80]];

export const groupService = {
  getTeacherData: () => wait({ courses: DATA.courses, classes: DATA.classes, projects: DATA.projects }),
  getHistory: () => wait(DATA.history),

  // Envoie la demande au ML et renvoie les équipes proposées (simulé : 2,5 s)
  generateTeams: async (req) => {
    await wait(null, 2500);
    if (req.simulateError) throw new Error('Le service ML ne répond pas. Réessayez dans un instant.');
    const list = students(Math.max(req.teamSize * 3, 8));
    const n = Math.ceil(list.length / req.teamSize);
    const teams = Array.from({ length: n }, (_, i) => ({ id: `t${i + 1}`, name: `Équipe ${String.fromCharCode(65 + i)}`, balance: ML[i % 5][0], diversity: ML[i % 5][1], members: [] }));
    list.forEach((s, i) => teams[i % n].members.push(s));
    return structuredClone(teams);
  },
  saveVersion: (teams) => wait({ version: Date.now() % 10 + 2 }, 400),
  validateTeams: () => wait({ ok: true }, 400),

  // Vue étudiant : ses équipes
  getMyTeams: () => wait([
    { id: 'm1', project: 'Mini-ERP en microservices', course: 'Architecture microservices', deadline: '2027-01-10', status: 'PUBLIEE', name: 'Équipe B', balance: 81, diversity: 76, members: students(4).map((s, i) => ({ ...s, me: i === 2 })) },
    { id: 'm2', project: 'Plateforme de covoiturage étudiant', course: 'Génie logiciel', deadline: '2026-12-15', status: 'EN_VALIDATION', name: null, balance: null, diversity: null, members: [] },
  ]),
};

export const GROUP_STATUS = {
  BROUILLON: ['Brouillon', 'neutral'], EN_VALIDATION: ['En validation', 'warn'], VALIDEE: ['Validée', 'ok'], PUBLIEE: ['Publiée', 'ok'],
};
