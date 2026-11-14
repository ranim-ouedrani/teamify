import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import useAsync from '../hooks/useAsync';
import { profilingService as api } from '../services/profilingService';

function InterestsEditor({ catalog, initial }) {
  const [selected, setSelected] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api.saveMyInterests(selected);
      setMsg({ ok: true, text: "Centres d'intérêt enregistrés." });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title-row"><h3>Sélectionnez vos centres d'intérêt</h3><span className="muted">{selected.length} choisi(s)</span></div>
      <div className="chips">
        {catalog.map((c) => (
          <button key={c.id} type="button" className={`chip ${selected.includes(c.id) ? 'on' : ''}`} onClick={() => toggle(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      {msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-err'}`} style={{ marginTop: 16 }}>{msg.text}</div>}
      <div className="actions">
        <button type="button" className="btn-red" onClick={save} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
    </div>
  );
}

const Interests = () => {
  const { data, loading, error, reload } = useAsync(async () => {
    const [catalog, mine] = await Promise.all([api.getInterestsCatalog(), api.getMyInterests()]);
    return { catalog, mine };
  });

  return (
    <AppLayout role="ETUDIANT" title="Centres d'intérêt" subtitle="Ils aident à former des groupes adaptés à vos affinités.">
      <Status loading={loading} error={error} onRetry={reload} empty={data && data.catalog.length === 0} emptyText="Aucun centre d'intérêt disponible.">
        {data && <InterestsEditor catalog={data.catalog} initial={data.mine} />}
      </Status>
    </AppLayout>
  );
};

export default Interests;
