/*
  MODE MOCK — uniquement pour voir l'interface sans backend (VITE_USE_MOCK=true).
  Même interface que le vrai service. Les données vivent en mémoire :
  rechargez la page (F5) pour recommencer le parcours depuis zéro.
  Supprimez ce fichier (et son import dans skillExchangeService.js) quand le backend est prêt.
*/
const wait = (v) => new Promise((r) => setTimeout(() => r(structuredClone(v)), 300));

// Compétences (viennent normalement du microservice Profilage)
const catalog = [
  { id: 'java', name: 'Java', category: 'Programmation' },
  { id: 'python', name: 'Python', category: 'Programmation' },
  { id: 'sql', name: 'SQL', category: 'Bases de données' },
  { id: 'react', name: 'React', category: 'Web' },
];
const mine = [{ skillId: 'sql', level: 4 }, { skillId: 'react', level: 3 }];
const nameOf = (id) => catalog.find((c) => c.id === id)?.name || id;

// Questions fictives (le vrai backend génère un quiz par compétence)
const QUESTIONS = [
  { id: 'q1', text: 'Quel mot-clé déclare une constante ?', options: [{ id: 'a', label: 'final / const' }, { id: 'b', label: 'static' }, { id: 'c', label: 'void' }], good: 'a' },
  { id: 'q2', text: 'Que renvoie une fonction sans return ?', options: [{ id: 'a', label: 'Toujours 0' }, { id: 'b', label: 'Rien (void / undefined)' }, { id: 'c', label: 'Une erreur' }], good: 'b' },
  { id: 'q3', text: 'Quelle structure garantit l’ordre d’insertion ?', options: [{ id: 'a', label: 'Une liste' }, { id: 'b', label: 'Un ensemble (set)' }, { id: 'c', label: 'Aucune' }], good: 'a' },
];

const s = { demande: null, appariement: null, session: null, quiz: null, polls: 0 };

const mock = {
  getSkillsCatalog: () => wait(catalog),
  getMySkills: () => wait(mine),

  getMyJourney: () => {
    // Simule la recherche d'un étudiant compatible : trouvé au 2e appel après l'envoi de la demande
    if (s.demande && !s.appariement && ++s.polls >= 2) s.appariement = { id: 'ap1', score: 0.87, statut: 'PROPOSE' };
    const { polls, ...journey } = s;
    return wait(journey);
  },

  createDemande: (p) => {
    s.demande = { id: 'd1', competenceRecherchee: nameOf(p.competenceRecherchee), competenceProposee: nameOf(p.competenceProposee), niveau: p.niveau, statut: 'OUVERTE' };
    s.polls = 0;
    return wait({ ok: true });
  },
  confirmAppariement: () => { s.appariement.statut = 'CONFIRME'; s.demande.statut = 'APPARIEE'; return wait({ ok: true }); },

  createSession: (p) => { s.session = { id: 'se1', mode: p.mode, dateHeure: p.dateHeure, lienReunion: p.lienReunion, statut: 'PROGRAMMEE' }; return wait({ ok: true }); },
  endSession: () => {
    s.session.statut = 'TERMINEE';
    s.quiz = {
      id: 'qz1', competence: s.demande.competenceRecherchee, scoreMinimum: 2, statut: 'A_PASSER',
      questions: QUESTIONS.map(({ good, ...q }) => q),
    };
    return wait({ ok: true });
  },

  submitQuiz: (_, answers) => {
    const correction = Object.fromEntries(QUESTIONS.map((q) => [q.id, q.good]));
    const score = QUESTIONS.filter((q) => answers[q.id] === q.good).length;
    const statut = score >= s.quiz.scoreMinimum ? 'VALIDE' : 'ECHOUE';
    Object.assign(s.quiz, { score, statut, correction });
    return wait({ score, total: QUESTIONS.length, statut, correction });
  },
};

export default mock;
