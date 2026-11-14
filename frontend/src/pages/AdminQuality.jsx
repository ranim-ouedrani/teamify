import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import useAsync from '../hooks/useAsync';
import { profilingService as api } from '../services/profilingService';

const AdminQuality = () => {
  const { data, loading, error, reload } = useAsync(() => api.getQualityReport());

  return (
    <AppLayout role="ADMINISTRATEUR" title="Qualité des données" subtitle="Informations manquantes et doublons détectés.">
      <Status loading={loading} error={error} onRetry={reload}>
        {data && (
          <div className="stack">
            <div className="stats-row">
              <div className="stat-tile"><span>Informations manquantes</span><strong>{data.summary.missingCount}</strong></div>
              <div className="stat-tile"><span>Doublons</span><strong>{data.summary.duplicateCount}</strong></div>
            </div>

            <div className="page-grid">
              <div className="card">
                <h3>Informations manquantes</h3>
                {data.missing.length === 0 ? <p className="muted">Aucune information manquante.</p> : (
                  <div className="table-wrap"><table className="table">
                    <thead><tr><th>Étudiant</th><th>Champ manquant</th></tr></thead>
                    <tbody>{data.missing.map((m, i) => <tr key={i}><td>{m.name}</td><td><span className="badge badge-warn">{m.field}</span></td></tr>)}</tbody>
                  </table></div>
                )}
              </div>

              <div className="card">
                <h3>Doublons</h3>
                {data.duplicates.length === 0 ? <p className="muted">Aucun doublon détecté.</p> : (
                  <div className="table-wrap"><table className="table">
                    <thead><tr><th>E-mail</th><th>Profils</th></tr></thead>
                    <tbody>{data.duplicates.map((d) => (
                      <tr key={d.email}><td>{d.email}</td><td>{d.names.join(', ')} <span className="badge badge-err">×{d.count}</span></td></tr>
                    ))}</tbody>
                  </table></div>
                )}
              </div>
            </div>
          </div>
        )}
      </Status>
    </AppLayout>
  );
};

export default AdminQuality;
