import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import useAsync from '../hooks/useAsync';
import { profilingService as api } from '../services/profilingService';

const AdminHistory = () => {
  const { data, loading, error, reload } = useAsync(() => api.getHistory());
  const [q, setQ] = useState('');

  const rows = (data || []).filter((r) =>
    `${r.user} ${r.action} ${r.target} ${r.detail}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AppLayout role="ADMINISTRATEUR" title="Historique des modifications" subtitle="Traçabilité des actions sur les profils.">
      <div className="card">
        <div className="toolbar">
          <input placeholder="Filtrer (utilisateur, action, cible…)" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Status loading={loading} error={error} onRetry={reload} empty={data && rows.length === 0} emptyText="Aucune entrée.">
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Date</th><th>Utilisateur</th><th>Action</th><th>Cible</th><th>Détail</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{r.date}</td>
                    <td>{r.user}</td>
                    <td><span className="badge badge-neutral">{r.action}</span></td>
                    <td>{r.target}</td>
                    <td className="muted">{r.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Status>
      </div>
    </AppLayout>
  );
};

export default AdminHistory;
