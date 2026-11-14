import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Status, { StatusBadge } from '../components/Status';
import useAsync from '../hooks/useAsync';
import { profilingService as api } from '../services/profilingService';
import { STATUS_LABELS, STYLE_LABELS } from '../utils/labels';

// Détail + validation d'un profil étudiant
function ProfileDetail({ id, onChanged }) {
  const { data: s, loading, error, reload } = useAsync(() => api.getStudentProfile(id), [id]);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const act = async (fn, okText) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      setMsg({ ok: true, text: okText });
      setComment('');
      reload();
      onChanged();
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card">
      <Status loading={loading} error={error} onRetry={reload}>
        {s && (
          <>
            <div className="card-title-row">
              <h3>{s.firstName} {s.lastName}</h3>
              <StatusBadge status={s.validationStatus} />
            </div>
            <p className="muted">{s.filiere} · {s.niveau === '1' ? '1ère' : `${s.niveau}ème`} année · Moyenne {s.moyenne ?? '—'}/20</p>
            <p className="muted" style={{ marginTop: 4 }}>Style d'apprentissage : {STYLE_LABELS[s.learningStyle] || 'non renseigné'}</p>

            <h4 style={{ margin: '18px 0 8px', fontSize: '0.9rem' }}>Compétences</h4>
            {s.skills.length === 0 ? <p className="muted">Aucune compétence.</p> : (
              <div className="chips">
                {s.skills.map((k) => <span key={k.name} className="chip static">{k.name} · {k.level}/5</span>)}
              </div>
            )}

            <h4 style={{ margin: '18px 0 8px', fontSize: '0.9rem' }}>Centres d'intérêt</h4>
            {s.interests.length === 0 ? <p className="muted">Aucun centre d'intérêt.</p> : (
              <div className="chips">{s.interests.map((i) => <span key={i} className="chip static">{i}</span>)}</div>
            )}

            {s.teacherComment && <div className="alert alert-err" style={{ marginTop: 16 }}>Dernier commentaire : {s.teacherComment}</div>}

            <div className="field" style={{ marginTop: 18 }}>
              <label htmlFor="comment">Commentaire (obligatoire pour demander une correction)</label>
              <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
            {msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-err'}`} style={{ marginTop: 12 }}>{msg.text}</div>}
            <div className="actions">
              <button type="button" className="btn-red" disabled={busy || s.validationStatus === 'VALIDE'}
                onClick={() => act(() => api.validateProfile(id), 'Profil validé.')}>Valider le profil</button>
              <button type="button" className="btn-outline" disabled={busy || !comment.trim()}
                onClick={() => act(() => api.requestCorrection(id, comment.trim()), 'Correction demandée.')}>Demander une correction</button>
            </div>
          </>
        )}
      </Status>
    </div>
  );
}

const TeacherProfiles = () => {
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);

  const { data, loading, error, reload } = useAsync(
    () => api.listStudents({ search: applied, status }),
    [applied, status]
  );

  return (
    <AppLayout role="ENSEIGNANT" title="Profils étudiants" subtitle="Consultez, vérifiez et validez les profils.">
      <div className="page-grid" style={{ gridTemplateColumns: selected ? 'minmax(0,1.3fr) minmax(0,1fr)' : '1fr' }}>
        <div className="card">
          <form className="toolbar" onSubmit={(e) => { e.preventDefault(); setApplied(search.trim()); }}>
            <input placeholder="Rechercher un étudiant…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Tous les statuts</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.text}</option>)}
            </select>
            <button type="submit" className="btn-outline">Rechercher</button>
          </form>

          <Status loading={loading} error={error} onRetry={reload} empty={data && data.length === 0} emptyText="Aucun étudiant ne correspond.">
            {data && (
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Étudiant</th><th>Filière</th><th>Complétion</th><th>Statut</th><th /></tr></thead>
                  <tbody>
                    {data.map((s) => (
                      <tr key={s.id} className={selected === s.id ? 'selected' : ''}>
                        <td><strong>{s.firstName} {s.lastName}</strong></td>
                        <td>{s.filiere}</td>
                        <td style={{ minWidth: 120 }}><div className="bar"><span style={{ width: `${s.completion}%` }} /></div></td>
                        <td><StatusBadge status={s.validationStatus} /></td>
                        <td><button type="button" className="btn-outline" onClick={() => setSelected(s.id)}>Voir</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Status>
        </div>

        {selected && <ProfileDetail id={selected} onChanged={reload} />}
      </div>
    </AppLayout>
  );
};

export default TeacherProfiles;
