import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import useAsync from '../hooks/useAsync';
import { profilingService as api } from '../services/profilingService';

// Le traitement lui-même est exécuté par le backend ; cette page le déclenche et affiche le résultat.
// Le clustering reste la responsabilité du microservice ML (MS4).
const AdminMlPrep = () => {
  const { data, loading, error, reload } = useAsync(() => api.getMlPreparation());
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState(null);

  const run = async () => {
    setRunning(true);
    setMsg(null);
    try {
      await api.runMlPreparation();
      setMsg({ ok: true, text: 'Préparation lancée et données transmises au microservice ML.' });
      reload();
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setRunning(false);
    }
  };

  return (
    <AppLayout role="ADMINISTRATEUR" title="Préparation pour le ML" subtitle="Nettoyage et transmission des profils validés au microservice ML.">
      <Status loading={loading} error={error} onRetry={reload}>
        {data && (
          <div className="stack">
            <div className="stats-row">
              <div className="stat-tile"><span>Profils éligibles</span><strong>{data.eligibleProfiles}</strong></div>
              <div className="stat-tile"><span>Profils exclus</span><strong>{data.excludedProfiles}</strong></div>
            </div>

            <div className="page-grid">
              <div className="card">
                <h3>Étapes de préparation</h3>
                <ul className="checklist">
                  {data.steps.map((s, i) => <li key={s}><span>{i + 1}. {s}</span></li>)}
                </ul>
                {msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-err'}`} style={{ marginTop: 16 }}>{msg.text}</div>}
                <div className="actions">
                  <button type="button" className="btn-red" onClick={run} disabled={running || data.eligibleProfiles === 0}>
                    {running ? 'Préparation…' : 'Lancer la préparation'}
                  </button>
                </div>
              </div>

              <div className="card">
                <h3>Dernière exécution</h3>
                {data.lastRun ? (
                  <ul className="checklist">
                    <li><span>Date</span><strong>{data.lastRun.date}</strong></li>
                    <li><span>Statut</span><span className={`badge ${data.lastRun.status === 'SUCCES' ? 'badge-ok' : 'badge-err'}`}>{data.lastRun.status === 'SUCCES' ? 'Succès' : 'Échec'}</span></li>
                    <li><span>Profils transmis</span><strong>{data.lastRun.records}</strong></li>
                  </ul>
                ) : <p className="muted">Aucune exécution pour l'instant.</p>}
              </div>
            </div>
          </div>
        )}
      </Status>
    </AppLayout>
  );
};

export default AdminMlPrep;
