/*
  MODE MOCK — uniquement pour développer sans backend (VITE_USE_MOCK=true).
  Même interface que le vrai service. Supprimez ce fichier quand le backend est prêt
  (et retirez l'import dans gamificationService.js).
*/
const wait = (v) => new Promise((r) => setTimeout(() => r(structuredClone(v)), 250));
const day = (n) => new Date(Date.now() - n * 864e5).toISOString();

const state = {
  avatarId: 'a1',
  badges: [
    { id: 'b1', name: 'Premier pas', description: 'Compléter son profil.', condition: 'Profil complété à 100 %', icon: '🌱' },
    { id: 'b2', name: 'Maître du quiz', description: 'Réussir un quiz de compétence.', condition: '1 quiz validé', icon: '🎯' },
    { id: 'b3', name: 'Esprit d’équipe', description: 'Participer à une session d’échange.', condition: '3 sessions terminées', icon: '🤝' },
    { id: 'b4', name: 'Mentor', description: 'Aider d’autres étudiants.', condition: '10 sessions en tant que mentor', icon: '🎓' },
  ],
  mine: [{ badgeId: 'b1', earnedAt: day(12) }, { badgeId: 'b2', earnedAt: day(3) }],
  avatars: [
    { id: 'a1', name: 'Fusée', category: 'Espace', emoji: '🚀' }, { id: 'a2', name: 'Astronaute', category: 'Espace', emoji: '🧑‍🚀' },
    { id: 'a3', name: 'Renard', category: 'Animaux', emoji: '🦊' }, { id: 'a4', name: 'Hibou', category: 'Animaux', emoji: '🦉' },
    { id: 'a5', name: 'Robot', category: 'Tech', emoji: '🤖' }, { id: 'a6', name: 'Cerveau', category: 'Tech', emoji: '🧠' },
  ],
  team: { teamId: 'my-team', name: 'Les Pionniers', emblem: '🔥', color: '#e63946', points: 640, rank: 2, canEdit: true },
  rules: [
    { id: 'r1', event: 'QuizValide', description: 'Quiz de compétence validé', points: 50, active: true },
    { id: 'r2', event: 'SessionTerminee', description: 'Session d’échange terminée', points: 30, active: true },
    { id: 'r3', event: 'ProfilComplet', description: 'Profil complété', points: 20, active: false },
  ],
  levels: [{ level: 1, name: 'Débutant', minPoints: 0 }, { level: 2, name: 'Explorateur', minPoints: 100 }, { level: 3, name: 'Confirmé', minPoints: 300 }, { level: 4, name: 'Expert', minPoints: 600 }],
};

const mock = {
  getPoints: () => wait({ total: 340, rank: 4, totalStudents: 120, avatarId: state.avatarId, participation: { activities: 14, quizzes: 5, sessions: 3 } }),
  getLevel: () => wait({ level: 3, name: 'Confirmé', currentMin: 300, nextMin: 600 }),
  getMyBadges: () => wait(state.mine),
  getRewards: () => wait([
    { id: 1, points: 50, reason: 'Quiz Java validé', type: 'POINTS', scope: 'INDIVIDUEL', receivedAt: day(3) },
    { id: 2, points: 30, reason: 'Session terminée', type: 'POINTS', scope: 'INDIVIDUEL', receivedAt: day(6) },
    { id: 3, points: 100, reason: 'Projet d’équipe rendu', type: 'POINTS', scope: 'COLLECTIF', receivedAt: day(9) },
    { id: 4, points: 0, reason: 'Badge « Maître du quiz »', type: 'BADGE', scope: 'INDIVIDUEL', receivedAt: day(3) },
  ]),
  setAvatar: (_, avatarId) => { state.avatarId = avatarId; return wait({ ok: true }); },
  getBadges: () => wait(state.badges),
  getAvatars: () => wait(state.avatars),
  getStudentsRanking: () => wait([
    { rank: 1, studentId: 's1', name: 'Amine B.', avatarId: 'a2', points: 720 }, { rank: 2, studentId: 's2', name: 'Sarra K.', avatarId: 'a3', points: 610 },
    { rank: 3, studentId: 's3', name: 'Yassine M.', avatarId: 'a5', points: 455 }, { rank: 4, studentId: 'me', name: 'Moi', avatarId: state.avatarId, points: 340 },
  ]),
  getTeamsRanking: () => wait([
    { rank: 1, teamId: 't1', name: 'Quantum', emblem: '⚡', color: '#7c3aed', points: 810 },
    { rank: 2, teamId: 'my-team', name: state.team.name, emblem: state.team.emblem, color: state.team.color, points: 640 },
  ]),
  getTeam: () => wait(state.team),
  updateTeamIdentity: (_, body) => { Object.assign(state.team, body); return wait(state.team); },
  getRules: () => wait(state.rules),
  createRule: (b) => { state.rules.push({ id: `r${Date.now()}`, active: true, ...b }); return wait({ ok: true }); },
  updateRule: (id, b) => { Object.assign(state.rules.find((r) => r.id === id), b); return wait({ ok: true }); },
  createBadge: (b) => { state.badges.push({ id: `b${Date.now()}`, icon: '🏅', ...b }); return wait({ ok: true }); },
  deleteBadge: (id) => { state.badges = state.badges.filter((b) => b.id !== id); return wait({ ok: true }); },
  getLevels: () => wait(state.levels),
  saveLevels: (l) => { state.levels = l; return wait({ ok: true }); },
  getEvents: () => wait([
    { id: 1, type: 'QuizValide', source: 'skill-exchange', receivedAt: day(0), status: 'TRAITE' },
    { id: 2, type: 'SessionTerminee', source: 'skill-exchange', receivedAt: day(1), status: 'EN_ATTENTE' },
    { id: 3, type: 'GroupeCree', source: 'course-group', receivedAt: day(2), status: 'ERREUR' },
  ]),
};

export default mock;
