import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { getUser, logout, HOME } from '../services/auth';
import Logo from './Logo';
import { Icon } from './Icons';
import '../pages/Dashboard.css';
import '../pages/Pages.css';

// Menu par rôle : modifiez ici pour ajouter / retirer une entrée
const MENUS = {
  ETUDIANT: [
    { to: '/dashboard', icon: 'dashboard', label: 'Tableau de bord' },
    { to: '/profile', icon: 'user', label: 'Mon profil' },
    { to: '/skill-exchange', icon: 'exchange', label: 'Skill-exchange' },
    { to: '/gamification', icon: 'trophy', label: 'Gamification' },
    { to: '/groups', icon: 'users', label: 'Mes équipes' },
    { to: '/ml', icon: 'cpu', label: 'ML' },
    { to: '/feedback', icon: 'chat', label: 'Feedback' },
  ],
  ENSEIGNANT: [
    { to: '/teacher', icon: 'dashboard', label: 'Tableau de bord' },
    { to: '/teacher/projects', icon: 'target', label: 'Projets & avancement' },
    { to: '/teacher/profiles', icon: 'graduation', label: 'Profils étudiants' },
    { to: '/teacher/teams', icon: 'cpu', label: 'Équipes (ML)' },
    { to: '/teacher/profile', icon: 'user', label: 'Mon profil' },
    { to: '/feedback', icon: 'chat', label: 'Feedback' },
  ],
  ADMINISTRATEUR: [
    { to: '/admin', icon: 'dashboard', label: 'Tableau de bord' },
    { to: '/admin/import', icon: 'download', label: 'Import étudiants' },
    { to: '/admin/quality', icon: 'checkCircle', label: 'Qualité des données' },
    { to: '/admin/ml', icon: 'cpu', label: 'Préparation ML' },
    { to: '/admin/history', icon: 'clock', label: 'Historique' },
    { to: '/admin/gamification', icon: 'trophy', label: 'Gamification' },
  ],
};

const ROLE_LABELS = { ETUDIANT: 'Étudiant', ENSEIGNANT: 'Enseignant', ADMINISTRATEUR: 'Administrateur' };

const AppLayout = ({ role = 'ETUDIANT', title, subtitle, children }) => {
  const navigate = useNavigate();
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;            // non connecté
  if (user.role !== role) return <Navigate to={HOME[user.role]} replace />; // mauvais espace
  const menu = MENUS[role] || MENUS.ETUDIANT;

  // Les routes racine (/dashboard, /teacher, /admin) ne doivent pas rester actives sur leurs sous-pages
  const isRoot = (to) => ['/dashboard', '/teacher', '/admin'].includes(to);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo"><Logo size={42} /></div>

        <nav className="sidebar-menu">
          {menu.map((m) => (
            <NavLink key={m.to} to={m.to} end={isRoot(m.to)} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
              <Icon name={m.icon} size={19} />
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* Remplacez par votre vraie déconnexion (suppression du token) quand l'auth sera branchée */}
          <button type="button" className="btn-logout" onClick={() => { logout(); navigate('/login'); }}><Icon name="logout" size={17} /> Déconnexion</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="header-user">
            <span className="user-role-badge">{ROLE_LABELS[role]}</span>
            <span className="user-name">{user.firstName} {user.lastName}</span>
            <div className="user-avatar">{user.firstName[0]}{user.lastName[0]}</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
