/**
 * MODE MOCK : données fictives pour développer sans backend.
 * Activé uniquement si VITE_USE_MOCK=true. Pour le désactiver : mettre false dans .env
 * (ce fichier n'est alors jamais chargé).
 */

const wait = (v) => new Promise((r) => setTimeout(() => r(structuredClone(v)), 200));

const SKILLS = [
  { id: 'java', name: 'Java', category: 'Programmation' },
  { id: 'spring', name: 'Spring Boot', category: 'Programmation' },
  { id: 'react', name: 'React', category: 'Programmation' },
  { id: 'sql', name: 'SQL', category: 'Bases de données' },
  { id: 'python', name: 'Python', category: 'Data / IA' },
  { id: 'ml', name: 'Machine Learning', category: 'Data / IA' },
  { id: 'reseaux', name: 'Réseaux', category: 'Infrastructure' },
  { id: 'communication', name: 'Communication', category: 'Soft skills' },
  { id: 'equipe', name: "Travail d'équipe", category: 'Soft skills' },
];

const INTERESTS = [
  { id: 'ia', label: 'Intelligence artificielle' },
  { id: 'web', label: 'Développement web' },
  { id: 'cyber', label: 'Cybersécurité' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'data', label: 'Data science' },
  { id: 'cloud', label: 'Cloud & DevOps' },
];

const QUESTIONS = [
  { id: 'q1', text: 'Pour mémoriser une notion, je préfère…', options: [
    { id: 'visuel', label: 'Faire un schéma ou une carte mentale' },
    { id: 'auditif', label: 'En parler à voix haute' },
    { id: 'kinesthesique', label: 'La pratiquer tout de suite' },
    { id: 'lecture', label: 'Relire et rédiger des notes' } ] },
  { id: 'q2', text: 'En cours, je retiens surtout…', options: [
    { id: 'visuel', label: 'Ce qui est projeté au tableau' },
    { id: 'auditif', label: "Ce que dit l'enseignant" },
    { id: 'kinesthesique', label: 'Les exercices et TP' },
    { id: 'lecture', label: 'Mes notes écrites' } ] },
  { id: 'q3', text: 'Pour apprendre un nouvel outil, je…', options: [
    { id: 'visuel', label: 'Regarde un tutoriel vidéo' },
    { id: 'auditif', label: "Demande à quelqu'un de me l'expliquer" },
    { id: 'kinesthesique', label: 'Essaie directement' },
    { id: 'lecture', label: 'Lis la documentation' } ] },
  { id: 'q4', text: 'En travail de groupe, je préfère…', options: [
    { id: 'visuel', label: 'Présenter des schémas' },
    { id: 'auditif', label: 'Animer la discussion' },
    { id: 'kinesthesique', label: 'Construire le prototype' },
    { id: 'lecture', label: 'Rédiger le rapport' } ] },
];

const me = {
  firstName: 'Oussema', lastName: 'Fattoumi', email: 'etudiant@teamify.tn', studentId: 'ET26103', bio: '', photo: null,
  availabilities: { lun: ['soir'], mer: ['apres-midi'], sam: ['matin'] },
  filiere: 'Informatique', niveau: '3', moyenne: 14.5,
  validationStatus: 'EN_ATTENTE', teacherComment: '', learningStyle: null,
  skills: [{ skillId: 'java', level: 4 }], interests: ['ia'],
};

function profileView() {
  const checks = [!!me.filiere, !!me.niveau, me.moyenne != null && me.moyenne !== '',
    me.skills.length > 0, me.interests.length > 0, !!me.learningStyle];
  return {
    ...me,
    skillsCount: me.skills.length,
    interestsCount: me.interests.length,
    completion: Math.round((checks.filter(Boolean).length / checks.length) * 100),
  };
}

const STUDENTS = [
  { id: 's1', firstName: 'Amine', lastName: 'Trabelsi', filiere: 'Informatique', niveau: '3', moyenne: 15.2, completion: 100, validationStatus: 'VALIDE', learningStyle: 'visuel', skills: [{ name: 'Java', level: 5 }, { name: 'SQL', level: 3 }], interests: ['Intelligence artificielle'], teacherComment: '' },
  { id: 's2', firstName: 'Sarra', lastName: 'Ben Salah', filiere: 'Informatique', niveau: '2', moyenne: 13.1, completion: 83, validationStatus: 'EN_ATTENTE', learningStyle: 'auditif', skills: [{ name: 'React', level: 4 }], interests: ['Développement web'], teacherComment: '' },
  { id: 's3', firstName: 'Yassine', lastName: 'Gharbi', filiere: 'Télécoms', niveau: '3', moyenne: 11.8, completion: 50, validationStatus: 'CORRECTION_DEMANDEE', learningStyle: null, skills: [], interests: [], teacherComment: 'Ajoute tes compétences.' },
  { id: 's4', firstName: 'Mariem', lastName: 'Jlassi', filiere: 'Informatique', niveau: '1', moyenne: 16.0, completion: 67, validationStatus: 'EN_ATTENTE', learningStyle: 'lecture', skills: [{ name: 'Python', level: 3 }], interests: ['Data science'], teacherComment: '' },
];

export const mockApi = {
  getProfile: () => wait(profileView()),
  updateProfile: (d) => { Object.assign(me, d, { validationStatus: 'EN_ATTENTE' }); return wait(profileView()); },
  getSkillsCatalog: () => wait(SKILLS),
  getMySkills: () => wait(me.skills),
  saveMySkills: (s) => { me.skills = s; return wait(s); },
  getInterestsCatalog: () => wait(INTERESTS),
  getMyInterests: () => wait(me.interests),
  saveMyInterests: (ids) => { me.interests = ids; return wait(ids); },
  getQuestionnaire: () => wait({ questions: QUESTIONS, learningStyle: me.learningStyle }),
  submitQuestionnaire: (answers) => {
    const count = {};
    Object.values(answers).forEach((a) => { count[a] = (count[a] || 0) + 1; });
    me.learningStyle = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
    return wait({ learningStyle: me.learningStyle });
  },

  getTeacherStats: () => wait({
    totalStudents: STUDENTS.length,
    validated: STUDENTS.filter((s) => s.validationStatus === 'VALIDE').length,
    pending: STUDENTS.filter((s) => s.validationStatus === 'EN_ATTENTE').length,
    correction: STUDENTS.filter((s) => s.validationStatus === 'CORRECTION_DEMANDEE').length,
    averageCompletion: Math.round(STUDENTS.reduce((a, s) => a + s.completion, 0) / STUDENTS.length),
    incomplete: STUDENTS.filter((s) => s.completion < 100).length,
  }),
  listStudents: ({ search = '', status = '' } = {}) => wait(
    STUDENTS.filter((s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) &&
      (!status || s.validationStatus === status))
  ),
  getStudentProfile: (id) => wait(STUDENTS.find((s) => s.id === id)),
  validateProfile: (id) => { STUDENTS.find((s) => s.id === id).validationStatus = 'VALIDE'; return wait(null); },
  requestCorrection: (id, comment) => {
    const s = STUDENTS.find((x) => x.id === id);
    s.validationStatus = 'CORRECTION_DEMANDEE'; s.teacherComment = comment;
    return wait(null);
  },

  getAdminStats: () => wait({ students: 128, teachers: 9, admins: 2, completeProfiles: 87, validatedProfiles: 64, duplicates: 3, lastImport: '2026-11-08' }),
  importStudentsCsv: () => wait({ imported: 42, rejected: 2, errors: [
    { line: 7, message: 'Adresse e-mail invalide' },
    { line: 19, message: 'Filière manquante' } ] }),
  getQualityReport: () => wait({
    summary: { missingCount: 2, duplicateCount: 1 },
    missing: [{ id: 's3', name: 'Yassine Gharbi', field: 'Compétences' }, { id: 's4', name: 'Mariem Jlassi', field: 'Style d\'apprentissage' }],
    duplicates: [{ email: 'amine.trabelsi@esprit.tn', count: 2, names: ['Amine Trabelsi', 'Amin Trabelsi'] }],
  }),
  getMlPreparation: () => wait({
    eligibleProfiles: 64, excludedProfiles: 64,
    steps: ['Vérification et nettoyage', 'Traitement des valeurs manquantes', 'Normalisation des données numériques', 'Encodage des données catégorielles', 'Transmission au microservice ML'],
    lastRun: { date: '2026-11-08 14:32', status: 'SUCCES', records: 60 },
  }),
  runMlPreparation: () => wait({ ok: true }),
  getHistory: () => wait([
    { id: 1, date: '2026-11-10 09:12', user: 'Sarra Ben Salah', action: 'Modification', target: 'Compétences', detail: 'React : niveau 3 → 4' },
    { id: 2, date: '2026-11-09 16:40', user: 'M. Ben Ali', action: 'Validation', target: 'Profil Amine Trabelsi', detail: 'Profil validé' },
    { id: 3, date: '2026-11-08 14:30', user: 'Admin', action: 'Import CSV', target: '44 lignes', detail: '42 importées, 2 rejetées' },
  ]),
};
