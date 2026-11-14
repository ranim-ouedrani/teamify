import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import { Icon, iconFor } from '../components/Icons';
import useAsync from '../hooks/useAsync';
import { gamificationService as api, isMock } from '../services/gamificationService';
import './Gamification.css';

// Exécute une action admin puis recharge la liste
function useDo(reload) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const run = async (fn, ok) => {
    setBusy(true); setMsg(null);
    try { await fn(); setMsg({ ok: true, text: ok }); await reload(); } catch (e) { setMsg({ ok: false, text: e.message }); } finally { setBusy(false); }
  };
  return { busy, msg, run };
}
const Msg = ({ msg }) => msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-err'}`} style={{ marginTop: 14 }}>{msg.text}</div>;

/* ---------- Règles ---------- */
function RuleRow({ r, onSave, busy }) {
  const [pts, setPts] = useState(r.points);
  return (
    <tr>
      <td><strong>{r.event}</strong><div className="muted">{r.description}</div></td>
      <td><input type="number" min="0" className="gm-num" value={pts} onChange={(e) => setPts(e.target.value)} aria-label={`Points ${r.event}`} /></td>
      <td><span className={`badge ${r.active ? 'badge-ok' : 'badge-neutral'}`}>{r.active ? 'Active' : 'Désactivée'}</span></td>
      <td className="gm-actions">
        <button type="button" className="btn-outline" disabled={busy || Number(pts) === r.points} onClick={() => onSave(r.id, { points: Number(pts) }, 'Règle modifiée.')}>Enregistrer</button>
        <button type="button" className="btn-outline" disabled={busy} onClick={() => onSave(r.id, { active: !r.active }, r.active ? 'Règle désactivée.' : 'Règle activée.')}>{r.active ? 'Désactiver' : 'Activer'}</button>
      </td>
    </tr>
  );
}

function RulesTab() {
  const { data, loading, error, reload } = useAsync(() => api.getRules());
  const { busy, msg, run } = useDo(reload);
  const [form, setForm] = useState({ event: '', description: '', points: 10 });

  return (
    <div className="stack">
      <form className="card" onSubmit={(e) => { e.preventDefault(); run(() => api.createRule({ ...form, points: Number(form.points) }), 'Règle ajoutée.').then(() => setForm({ event: '', description: '', points: 10 })); }}>
        <h3>Nouvelle règle</h3>
        <div className="add-row">
          <div className="field"><label htmlFor="re">Événement reçu</label><input id="re" placeholder="Ex : QuizValide" value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} required /></div>
          <div className="field"><label htmlFor="rd">Description</label><input id="rd" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="field" style={{ maxWidth: 120, minWidth: 100 }}><label htmlFor="rp">Points</label><input id="rp" type="number" min="0" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} required /></div>
          <button type="submit" className="btn-red" disabled={busy}>Ajouter</button>
        </div>
        <Msg msg={msg} />
      </form>
      <div className="card">
        <Status loading={loading} error={error} onRetry={reload} empty={data && data.length === 0} emptyText="Aucune règle définie.">
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Événement</th><th>Points</th><th>Statut</th><th /></tr></thead>
            <tbody>{(data || []).map((r) => <RuleRow key={`${r.id}-${r.points}-${r.active}`} r={r} busy={busy} onSave={(id, b, ok) => run(() => api.updateRule(id, b), ok)} />)}</tbody>
          </table></div>
        </Status>
      </div>
    </div>
  );
}

/* ---------- Badges ---------- */
function BadgesAdminTab() {
  const { data, loading, error, reload } = useAsync(() => api.getBadges());
  const { busy, msg, run } = useDo(reload);
  const [form, setForm] = useState({ name: '', description: '', condition: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="stack">
      <form className="card" onSubmit={(e) => { e.preventDefault(); run(() => api.createBadge(form), 'Badge ajouté.').then(() => setForm({ name: '', description: '', condition: '' })); }}>
        <h3>Nouveau badge</h3>
        <div className="form-grid">
          <div className="field"><label htmlFor="bn">Nom</label><input id="bn" value={form.name} onChange={set('name')} required /></div>
          <div className="field"><label htmlFor="bd">Description</label><input id="bd" value={form.description} onChange={set('description')} required /></div>
          <div className="field"><label htmlFor="bc">Condition de déblocage</label><input id="bc" value={form.condition} onChange={set('condition')} required /></div>
        </div>
        <Msg msg={msg} />
        <div className="actions"><button type="submit" className="btn-red" disabled={busy}>Ajouter le badge</button></div>
      </form>
      <Status loading={loading} error={error} onRetry={reload} empty={data && data.length === 0} emptyText="Aucun badge défini.">
        <div className="gm-grid">
          {(data || []).map((b) => (
            <article key={b.id} className="gm-badge got">
              <div className="gm-badge-top">
                <span className="gm-badge-icon"><Icon name={iconFor(b.icon)} size={26} /></span>
              </div>
              <strong>{b.name}</strong>
              <p>{b.description}</p>
              <div className="gm-meta"><span className="gm-pill"><Icon name="target" size={14} />{b.condition}</span></div>
              <button type="button" className="btn-outline" disabled={busy} onClick={() => window.confirm(`Supprimer « ${b.name} » ?`) && run(() => api.deleteBadge(b.id), 'Badge supprimé.')}>Supprimer</button>
            </article>
          ))}
        </div>
      </Status>
    </div>
  );
}

/* ---------- Niveaux ---------- */
function LevelsEditor({ initial, reload }) {
  const [levels, setLevels] = useState(initial);
  const { busy, msg, run } = useDo(reload);
  const edit = (i, k, v) => setLevels(levels.map((l, j) => (j === i ? { ...l, [k]: v } : l)));
  const add = () => setLevels([...levels, { level: levels.length + 1, name: '', minPoints: (levels.at(-1)?.minPoints ?? 0) + 100 }]);

  return (
    <div className="card">
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Niveau</th><th>Nom</th><th>Points minimum</th></tr></thead>
        <tbody>{levels.map((l, i) => (
          <tr key={i}><td>{l.level}</td>
            <td><input value={l.name} onChange={(e) => edit(i, 'name', e.target.value)} aria-label={`Nom du niveau ${l.level}`} /></td>
            <td><input type="number" min="0" className="gm-num" value={l.minPoints} onChange={(e) => edit(i, 'minPoints', e.target.value)} aria-label={`Points du niveau ${l.level}`} /></td></tr>
        ))}</tbody>
      </table></div>
      <Msg msg={msg} />
      <div className="actions">
        <button type="button" className="btn-outline" onClick={add}>Ajouter un niveau</button>
        <button type="button" className="btn-red" disabled={busy || levels.some((l) => !l.name.trim())}
          onClick={() => run(() => api.saveLevels(levels.map((l) => ({ ...l, minPoints: Number(l.minPoints) }))), 'Niveaux enregistrés.')}>{busy ? 'Enregistrement…' : 'Enregistrer les niveaux'}</button>
      </div>
    </div>
  );
}
function LevelsTab() {
  const { data, loading, error, reload } = useAsync(() => api.getLevels());
  return <Status loading={loading} error={error} onRetry={reload}>{data && <LevelsEditor initial={data} reload={reload} />}</Status>;
}

/* ---------- Événements reçus ---------- */
const EV = { TRAITE: ['Traité', 'badge-ok'], EN_ATTENTE: ['En attente', 'badge-warn'], ERREUR: ['Erreur', 'badge-err'] };
function EventsTab() {
  const { data, loading, error, reload } = useAsync(() => api.getEvents());
  const [status, setStatus] = useState('');
  const rows = (data || []).filter((e) => !status || e.status === status);
  return (
    <div className="card">
      <div className="toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Statut">
          <option value="">Tous les statuts</option>{Object.entries(EV).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}
        </select>
        <button type="button" className="btn-outline" onClick={reload}>Actualiser</button>
      </div>
      <Status loading={loading} error={error} onRetry={reload} empty={data && rows.length === 0} emptyText="Aucun événement reçu.">
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Reçu le</th><th>Événement</th><th>Source</th><th>Statut</th></tr></thead>
          <tbody>{rows.map((e) => (
            <tr key={e.id}><td style={{ whiteSpace: 'nowrap' }}>{new Date(e.receivedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</td>
              <td><strong>{e.type}</strong></td><td className="muted">{e.source}</td><td><span className={`badge ${EV[e.status]?.[1]}`}>{EV[e.status]?.[0] || e.status}</span></td></tr>
          ))}</tbody>
        </table></div>
      </Status>
    </div>
  );
}

/* ---------- Page ---------- */
const TABS = [['rules', 'Règles', RulesTab, 'checkCircle'], ['badges', 'Badges', BadgesAdminTab, 'medal'], ['levels', 'Niveaux', LevelsTab, 'bars'], ['events', 'Événements', EventsTab, 'bolt']];

const GamificationAdmin = () => {
  const [tab, setTab] = useState('rules');
  const Current = TABS.find((t) => t[0] === tab)[2];
  return (
    <AppLayout role="ADMINISTRATEUR" title="Administration Gamification" subtitle="Règles, badges, niveaux et événements reçus.">
      {isMock && <div className="alert alert-err" style={{ marginBottom: 16 }}>Mode démo : données fictives (VITE_USE_MOCK=true).</div>}
      <div className="gm-tabs" role="tablist">
        {TABS.map(([k, label, , ic]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><Icon name={ic} size={16} />{label}</button>)}
      </div>
      <Current />
    </AppLayout>
  );
};

export default GamificationAdmin;
