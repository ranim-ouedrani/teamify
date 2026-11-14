// À AJOUTER dans l'objet `profilingService` existant (src/services/profilingService.js).
// Endpoints proposés : adaptez-les à votre backend.

// GET /skills/{skillId}/quiz  ->  { minScore: 2, questions: [{ id, text, options: [{ id, label }] }] }
getSkillQuiz: (skillId) => http.get(`/profiling/me/skills/${skillId}/quiz`).then((r) => r.data),

// POST /skills/{skillId}/quiz  { answers: { [questionId]: optionId } }
//   ->  { score, total, passed, correction: { [questionId]: bonneOptionId } }
// Le backend calcule le score et marque la compétence "validated" si passed === true.
submitSkillQuiz: (skillId, answers) =>
  http.post(`/profiling/me/skills/${skillId}/quiz`, { answers }).then((r) => r.data),

// getMySkills() doit renvoyer : [{ skillId, level, validated }]
// (remplacez `http` par le nom de votre instance Axios dans ce fichier)
