import axios from 'axios';
import mock from './skillExchangeMock';
import { profilingService } from './profilingService';

// VITE_USE_MOCK=true -> données fictives (skillExchangeMock.js) ; false -> vrai backend
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// URL du backend : .env  ->  VITE_SKILL_EXCHANGE_URL=http://localhost:8083/api/skill-exchange
const http = axios.create({ baseURL: import.meta.env.VITE_SKILL_EXCHANGE_URL || '/api/skill-exchange' });

// Même gestion d'erreur que le reste de l'appli : on remonte un message lisible
http.interceptors.response.use(
  (r) => r,
  (e) => Promise.reject(new Error(e.response?.data?.message || e.message || 'Erreur réseau'))
);

// Endpoints proposés : à adapter au backend réel.
const real = {
  // Compétences : fournies par le microservice Profilage
  getSkillsCatalog: () => profilingService.getSkillsCatalog(),
  getMySkills: () => profilingService.getMySkills(),

  // { demande, appariement, session, quiz } — chacun peut être null
  getMyJourney: () => http.get('/me').then((r) => r.data),

  // Étape 1
  createDemande: (payload) => http.post('/demandes', payload).then((r) => r.data), // { competenceRecherchee, competenceProposee, niveau }
  confirmAppariement: (id) => http.post(`/appariements/${id}/confirmer`).then((r) => r.data),

  // Étape 2
  createSession: (payload) => http.post('/sessions', payload).then((r) => r.data), // { appariementId, mode, dateHeure, lienReunion? }
  endSession: (id) => http.post(`/sessions/${id}/terminer`).then((r) => r.data),

  // Étape 3 -> { score, total, statut: 'VALIDE'|'ECHOUE', correction: { [questionId]: optionId } }
  submitQuiz: (id, answers) => http.post(`/quiz/${id}/valider`, { answers }).then((r) => r.data),
};

export const skillExchangeService = USE_MOCK ? mock : real;
export const isMock = USE_MOCK;
