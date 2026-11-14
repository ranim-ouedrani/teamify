/**
 * Couche d'accès au backend Spring Boot (microservice Authentification & Profiling).
 *
 * - URL du backend : VITE_API_URL (voir .env)
 * - Mode mock      : VITE_USE_MOCK=true  → utilise src/mocks/profilingMock.js
 * - Les endpoints ci-dessous sont des PROPOSITIONS à aligner avec le backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

async function http(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const token = localStorage.getItem('access_token'); // JWT Keycloak
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: form || (body ? JSON.stringify(body) : undefined),
  });

  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      /* réponse non JSON */
    }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

const qs = (params = {}) => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return s ? `?${s}` : '';
};

const realApi = {
  // ----- Étudiant -----
  getProfile: () => http('/api/profiles/me'),
  updateProfile: (data) => http('/api/profiles/me', { method: 'PUT', body: data }),
  getSkillsCatalog: () => http('/api/skills/catalog'),
  getMySkills: () => http('/api/profiles/me/skills'),
  saveMySkills: (skills) => http('/api/profiles/me/skills', { method: 'PUT', body: skills }),
  getInterestsCatalog: () => http('/api/interests/catalog'),
  getMyInterests: () => http('/api/profiles/me/interests'),
  saveMyInterests: (ids) => http('/api/profiles/me/interests', { method: 'PUT', body: ids }),
  getQuestionnaire: () => http('/api/questionnaire'),
  submitQuestionnaire: (answers) => http('/api/questionnaire/answers', { method: 'POST', body: answers }),

  // ----- Enseignant -----
  getTeacherStats: () => http('/api/teacher/stats'),
  listStudents: (params) => http(`/api/teacher/profiles${qs(params)}`),
  getStudentProfile: (id) => http(`/api/teacher/profiles/${id}`),
  validateProfile: (id) => http(`/api/teacher/profiles/${id}/validate`, { method: 'POST' }),
  requestCorrection: (id, comment) =>
    http(`/api/teacher/profiles/${id}/request-correction`, { method: 'POST', body: { comment } }),

  // ----- Administrateur -----
  getAdminStats: () => http('/api/admin/stats'),
  importStudentsCsv: (file) => {
    const form = new FormData();
    form.append('file', file);
    return http('/api/admin/import', { method: 'POST', form });
  },
  getQualityReport: () => http('/api/admin/quality'),
  getMlPreparation: () => http('/api/admin/ml/preparation'),
  runMlPreparation: () => http('/api/admin/ml/prepare', { method: 'POST' }),
  getHistory: () => http('/api/admin/history'),
};

// Chaque méthode est redirigée vers le mock (chargé à la demande) si VITE_USE_MOCK=true.
export const profilingService = Object.fromEntries(
  Object.keys(realApi).map((name) => [
    name,
    async (...args) => {
      const impl = USE_MOCK ? (await import('../mocks/profilingMock.js')).mockApi : realApi;
      return impl[name](...args);
    },
  ])
);
