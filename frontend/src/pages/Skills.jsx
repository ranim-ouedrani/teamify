import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import useAsync from '../hooks/useAsync';
import { profilingService as api } from '../services/profilingService';

function LevelPicker({ value, onChange }) {
  return (
    <div className="level" role="group" aria-label="Niveau de 1 à 5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" className={n <= value ? 'on' : ''} onClick={() => onChange(n)}>{n}</button>
      ))}
    </div>
  );
}

function SkillsEditor({ catalog, initial }) {
  const [items, setItems] = useState(initial);
  const [pick, setPick] = useState('');
  const [level, setLevel] = useState(3);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const byId = Object.fromEntries(catalog.map((c) => [c.id, c]));
  const available = catalog.filter((c) => !items.some((i) => i.skillId === c.id));
  const categories = [...new Set(available.map((c) => c.category))];

  const add = () => {
    if (!pick) return;
    setItems((l) => [...l, { skillId: pick, level }]);
    setPick('');
  };
  const setItemLevel = (id, lvl) => setItems((l) => l.map((i) => (i.skillId === id ? { ...i, level: lvl } : i)));
  const remove = (id) => setItems((l) => l.filter((i) => i.skillId !== id));

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api.saveMySkills(items);
      setMsg({ ok: true, text: 'Compétences enregistrées.' });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-grid">
      <div className="card">
        <h3>Ajouter une compétence</h3>
        <div className="add-row">
          <div className="field">
            <label htmlFor="skill">Compétence</label>
            <select id="skill" value={pick} onChange={(e) => setPick(e.target.value)}>
              <option value="">Choisir…</option>
              {categories.map((cat) => (
                <optgroup key={cat} label={cat}>
                  {available.filter((c) => c.category === cat).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="field"><label>Niveau</label><LevelPicker value={level} onChange={setLevel} /></div>
          <button type="button" className="btn-outline" onClick={add} disabled={!pick}>Ajouter</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title-row"><h3>Mes compétences</h3><span className="muted">{items.length} ajoutée(s)</span></div>
        {items.length === 0 ? (
          <p className="muted">Aucune compétence pour l'instant.</p>
        ) : (
          <div className="stack" style={{ gap: 10 }}>
            {items.map((i) => (
              <div className="skill-row" key={i.skillId}>
                <div><strong>{byId[i.skillId]?.name || i.skillId}</strong><small>{byId[i.skillId]?.category}</small></div>
                <LevelPicker value={i.level} onChange={(l) => setItemLevel(i.skillId, l)} />
                <button type="button" className="btn-outline" onClick={() => remove(i.skillId)}>Retirer</button>
              </div>
            ))}
          </div>
        )}
        {msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-err'}`} style={{ marginTop: 16 }}>{msg.text}</div>}
        <div className="actions">
          <button type="button" className="btn-red" onClick={save} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </div>
    </div>
  );
}

const Skills = () => {
  const { data, loading, error, reload } = useAsync(async () => {
    const [catalog, mine] = await Promise.all([api.getSkillsCatalog(), api.getMySkills()]);
    return { catalog, mine };
  });

  return (
    <AppLayout role="ETUDIANT" title="Mes compétences" subtitle="Ajoutez vos compétences et évaluez votre niveau de 1 à 5.">
      <Status loading={loading} error={error} onRetry={reload} empty={data && data.catalog.length === 0} emptyText="Le catalogue de compétences est vide.">
        {data && <SkillsEditor catalog={data.catalog} initial={data.mine} />}
      </Status>
    </AppLayout>
  );
};

export default Skills;
