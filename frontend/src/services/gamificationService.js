import axios from 'axios';
import mock from './gamificationMock';

/*
  .env :
    VITE_GAMIFICATION_URL=http://localhost:8084/api/gamification
    VITE_USE_MOCK=false        # true = données fictives (gamificationMock.js), false = vrai backend
*/
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const http = axios.create({ baseURL: import.meta.env.VITE_GAMIFICATION_URL || '/api/gamification' });
http.interceptors.response.use(
  (r) => r,
  (e) => Promise.reject(new Error(e.response?.data?.message || e.message || 'Erreur réseau'))
);
const d = (p) => p.then((r) => r.data);

// studentId / teamId viennent des autres microservices (authentification) :
// ici on les lit simplement là où votre login les stocke.
export const getIds = () => ({
  studentId: localStorage.getItem('studentId') || import.meta.env.VITE_STUDENT_ID || 'me',
  teamId: localStorage.getItem('teamId') || import.meta.env.VITE_TEAM_ID || 'my-team',
});

// Endpoints proposés (à adapter au backend réel)
const real = {
  // Étudiant
  getPoints: (id) => d(http.get(`/students/${id}/points`)),   // { total, rank, totalStudents, avatarId, participation: { activities, quizzes, sessions } }
  getLevel: (id) => d(http.get(`/students/${id}/level`)),     // { level, name, currentMin, nextMin|null }
  getMyBadges: (id) => d(http.get(`/students/${id}/badges`)), // [{ badgeId, earnedAt }]
  getRewards: (id) => d(http.get(`/students/${id}/rewards`)), // [{ id, points, reason, type, scope: INDIVIDUEL|COLLECTIF, receivedAt }]
  setAvatar: (id, avatarId) => d(http.post(`/students/${id}/avatar`, { avatarId })),

  // Catalogues
  getBadges: () => d(http.get('/badges')),                    // [{ id, name, description, condition, icon }]
  getAvatars: () => d(http.get('/avatars')),                  // [{ id, name, category, emoji?, imageUrl? }]

  // Classements & équipes
  getStudentsRanking: () => d(http.get('/leaderboard/students')), // [{ rank, studentId, name, avatarId, points }]
  getTeamsRanking: () => d(http.get('/leaderboard/teams')),       // [{ rank, teamId, name, emblem, color, points }]
  getTeam: (id) => d(http.get(`/teams/${id}/points`)),            // { teamId, name, emblem, color, points, rank, canEdit }
  updateTeamIdentity: (id, body) => d(http.put(`/teams/${id}/identity`, body)), // { name, emblem, color }

  // Administration
  getRules: () => d(http.get('/rules')),                          // [{ id, event, description, points, active }]
  createRule: (body) => d(http.post('/rules', body)),
  updateRule: (id, body) => d(http.put(`/rules/${id}`, body)),    // { points?, description?, active? }
  createBadge: (body) => d(http.post('/badges', body)),
  deleteBadge: (id) => d(http.delete(`/badges/${id}`)),
  getLevels: () => d(http.get('/levels')),                        // [{ level, name, minPoints }]
  saveLevels: (levels) => d(http.put('/levels', levels)),
  getEvents: () => d(http.get('/events')),                        // [{ id, type, source, receivedAt, status: TRAITE|EN_ATTENTE|ERREUR }]
};

export const gamificationService = USE_MOCK ? mock : real;
export const isMock = USE_MOCK;
