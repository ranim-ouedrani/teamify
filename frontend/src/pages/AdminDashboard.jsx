import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import useAsync from '../hooks/useAsync';
import { profilingService as api } from '../services/profilingService';

const SHORTCUTS = [
  { to: '/admin/import', label: 'Importer des étudiants (CSV)' },
  { to: '/admin/quality', label: 'Contrôler la qualité des données' },
  { to: '/admin/ml', label: 'Préparer les données pour le ML' },
  { to: '/admin/history', label: "Consulter l'historique" },
];

const AdminDashboard = () => {
  const { data: s, loading, error, reload } = useAsync(() => api.getAdminStats());

  return (
    <AppLayout role="ADMINISTRATEUR" title="Tableau de bord administrateur" subtitle="Vue d'ensemble des données de profiling.">
      <Status loading={loading} error={error} onRetry={reload}>
        {s && (
          <div className="stack">
            <div className="stats-row">
              <div className="stat-tile"><span>Étudiants</span><strong>{s.students}</strong></div>
              <div className="stat-tile"><span>Enseignants</span><strong>{s.teachers}</strong></div>
              <div className="stat-tile"><span>Profils complets</span><strong>{s.completeProfiles}</strong></div>
              <div className="stat-tile"><span>Profils validés</span><strong>{s.validatedProfiles}</strong></div>
              <div className="stat-tile"><span>Doublons détectés</span><strong>{s.duplicates}</strong></div>
            </div>
            <div className="card">
              <h3>Accès rapide</h3>
              <ul className="checklist">
                {SHORTCUTS.map((l) => (
                  <li key={l.to}><span>{l.label}</span><Link to={l.to}>Ouvrir →</Link></li>
                ))}
              </ul>
              {s.lastImport && <p className="muted" style={{ marginTop: 14 }}>Dernier import : {s.lastImport}</p>}
            </div>
          </div>
        )}
      </Status>
    </AppLayout>
  );
};

export default AdminDashboard;
