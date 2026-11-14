/*
  Authentification de démonstration (en attendant Keycloak / le backend).
  Remplacez login() par l'appel réel ; le reste de l'appli lit seulement getUser().
*/
export const DEMO_ACCOUNTS = [
  { email: 'prof@teamify.tn', password: 'Prof@2026', role: 'ENSEIGNANT', firstName: 'Mohamed', lastName: 'Ben Ali', label: 'Enseignant' },
  { email: 'etudiant@teamify.tn', password: 'Etud@2026', role: 'ETUDIANT', firstName: 'Oussema', lastName: 'Fattoumi', label: 'Étudiant' },
  { email: 'admin@teamify.tn', password: 'Admin@2026', role: 'ADMINISTRATEUR', firstName: 'Admin', lastName: 'TeamiFy', label: 'Administrateur' },
];
export const HOME = { ETUDIANT: '/dashboard', ENSEIGNANT: '/teacher', ADMINISTRATEUR: '/admin' };

export function login(email, password) {
  const a = DEMO_ACCOUNTS.find((x) => x.email === email.trim().toLowerCase() && x.password === password);
  if (!a) throw new Error('E-mail ou mot de passe incorrect.');
  const { password: _p, label: _l, ...user } = a;
  localStorage.setItem('user', JSON.stringify(user));
  return user;
}
export const getUser = () => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } };
export const logout = () => { localStorage.removeItem('user'); localStorage.removeItem('access_token'); };
