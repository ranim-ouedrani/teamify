import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import { Icon, iconFor } from '../components/Icons';
import AnimatedAvatar, { hasAnimatedAvatar } from '../components/AnimatedAvatar';
import useAsync from '../hooks/useAsync';
import { gamificationService as api, getIds, isMock } from '../services/gamificationService';
import './Gamification.css';

const fmt = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

// Valeurs enregistrées côté backend (inchangées) : l'interface les affiche sous forme d'icônes.
const EMBLEMS = ['🔥', '⚡', '🚀', '🦅', '🐺', '🌟', '🛡️', '🎯'];

/* ---------- Avatar : image du backend, sinon initiales sur fond coloré ---------- */
const TONES = [['#ff6b76', '#c1121f'], ['#ff8a5b', '#d9480f'], ['#e0568f', '#a61e4d'], ['#f5b82e', '#c77700'], ['#8b93ff', '#4c51bf'], ['#3cc9a6', '#0b7a60']];
const toneOf = (key) => { let h = 0; for (const c of String(key ?? '?')) h = (h * 31 + c.charCodeAt(0)) >>> 0; return TONES[h % TONES.length]; };
const initialsOf = (n) => String(n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';

export function Avatar({ a, size = 44, name }) {
  const label = name || a?.name;
  // Avatars animés (SVG) : ils bougent ; en petite taille (classements) on les fige pour rester léger
  if (!a?.imageUrl && hasAnimatedAvatar(a?.id)) {
    return (
      <span className="gm-avatar gm-avatar-anim" style={{ width: size, height: size }}>
        <AnimatedAvatar id={a.id} size={size * 0.9} still={size < 50} label={label} />
      </span>
    );
  }
  if (a?.imageUrl) return <img className="gm-avatar" style={{ width: size, height: size }} src={a.imageUrl} alt={label} />;
  const [c1, c2] = toneOf(a?.id ?? label);
  return (
    <span className="gm-avatar" style={{ width: size, height: size, fontSize: size * 0.38, background: `linear-gradient(135deg, ${c1}, ${c2})` }} aria-label={label}>
      {initialsOf(label)}
    </span>
  );
}

/* ---------- Pastille d'équipe (emblème = icône, couleur = couleur de l'équipe) ---------- */
function TeamMark({ emblem, color, size = 40 }) {
  return (
    <span className="gm-teammark" style={{ width: size, height: size, background: color || '#e63946' }}>
      <Icon name={iconFor(emblem, 'shield')} size={size * 0.5} />
    </span>
  );
}

/* ================= Dashboard ================= */
function DashboardTab({ ids }) {
  const { data, loading, error, reload } = useAsync(async () => {
    const [points, level, mine, catalog, rewards, avatars] = await Promise.all([
      api.getPoints(ids.studentId), api.getLevel(ids.studentId), api.getMyBadges(ids.studentId),
      api.getBadges(), api.getRewards(ids.studentId), api.getAvatars(),
    ]);
    return { points, level, mine, catalog, rewards, avatars };
  });

  return (
    <Status loading={loading} error={error} onRetry={reload}>
      {data && (() => {
        const { points: p, level: l, mine, catalog, rewards, avatars } = data;
        const pct = l.nextMin == null ? 100 : Math.min(100, ((p.total - l.currentMin) / (l.nextMin - l.currentMin)) * 100);
        const recent = [...mine].sort((a, b) => b.earnedAt.localeCompare(a.earnedAt)).slice(0, 3);
        const chips = recent.map((m) => catalog.find((c) => c.id === m.badgeId)).filter(Boolean);
        return (
          <div className="stack">
            <section className="gm-hero">
              <div className="gm-hero-main">
                <div className="gm-hero-id">
                  <Avatar a={avatars.find((a) => a.id === p.avatarId)} size={64} />
                  <div>
                    <span className="gm-level">Niveau {l.level} · {l.name}</span>
                    <strong className="gm-points">{p.total}<small>pts</small></strong>
                  </div>
                </div>
                <p className="gm-hero-msg">
                  {l.nextMin == null ? 'Niveau maximum atteint, bravo !' : `Plus que ${l.nextMin - p.total} pts pour atteindre le niveau suivant.`}
                </p>
                <div className="gm-progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${pct}%` }} /></div>
              </div>

              {chips.length > 0 && (
                <div className="gm-float" aria-hidden="true">
                  {chips.map((b) => <span key={b.id} className="gm-float-chip"><Icon name={iconFor(b.icon)} size={14} />{b.name}</span>)}
                </div>
              )}

              <div className="gm-rank"><small>Classement</small><strong>#{p.rank}</strong><small>sur {p.totalStudents}</small></div>
            </section>

            <div className="gm-stats">
              {[['Activités', p.participation.activities, 'bars'], ['Quiz réussis', p.participation.quizzes, 'target'], ['Sessions', p.participation.sessions, 'users']].map(([label, v, ic]) => (
                <div className="gm-stat" key={label}>
                  <span className="gm-stat-ic"><Icon name={ic} size={20} /></span>
                  <div><small>{label}</small><strong>{v}</strong></div>
                </div>
              ))}
            </div>

            <div className="page-grid">
              <div className="card">
                <div className="card-title-row"><h3>Derniers badges</h3></div>
                {recent.length === 0 ? <p className="muted">Aucun badge pour l'instant.</p> : (
                  <div className="gm-list">
                    {recent.map((m) => { const b = catalog.find((c) => c.id === m.badgeId); return b && (
                      <div className="gm-row gm-item" key={m.badgeId}>
                        <span className="gm-icon"><Icon name={iconFor(b.icon)} size={20} /></span>
                        <div><strong>{b.name}</strong><small>{fmt(m.earnedAt)}</small></div>
                      </div>
                    ); })}
                  </div>
                )}
              </div>
              <div className="card">
                <div className="card-title-row"><h3>Dernières récompenses</h3></div>
                {rewards.length === 0 ? <p className="muted">Aucune récompense pour l'instant.</p> : (
                  <div className="gm-list">
                    {rewards.slice(0, 4).map((r) => (
                      <div className="gm-row gm-item" key={r.id}>
                        <span className="gm-icon gm-icon-soft"><Icon name={r.points > 0 ? 'plus' : 'medal'} size={18} /></span>
                        <div className="gm-grow"><strong>{r.reason}</strong><small>{fmt(r.receivedAt)}</small></div>
                        {r.points > 0 && <span className="gm-pts">+{r.points}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </Status>
  );
}

/* ================= Badges ================= */
function BadgesTab({ ids }) {
  const { data, loading, error, reload } = useAsync(async () => {
    const [catalog, mine] = await Promise.all([api.getBadges(), api.getMyBadges(ids.studentId)]);
    return { catalog, mine };
  });
  const [filter, setFilter] = useState('all');

  const all = (data?.catalog || []).map((b) => ({ ...b, earnedAt: data.mine.find((m) => m.badgeId === b.id)?.earnedAt }));
  const rows = all.filter((b) => filter === 'all' || (filter === 'got' ? b.earnedAt : !b.earnedAt));
  const got = all.filter((b) => b.earnedAt).length;
  const FILTERS = [['all', 'Tous', all.length], ['got', 'Obtenus', got], ['locked', 'Verrouillés', all.length - got]];

  return (
    <div className="stack">
      <div className="gm-filters">
        {FILTERS.map(([k, l, n]) => (
          <button key={k} type="button" className={`gm-fchip ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)}>{l}<em>{n}</em></button>
        ))}
      </div>
      <Status loading={loading} error={error} onRetry={reload} empty={data && rows.length === 0} emptyText="Aucun badge dans cette catégorie.">
        <div className="gm-grid">
          {data && filter === 'all' && (
            <article className="gm-promo">
              <span className="gm-promo-ic"><Icon name="trophy" size={24} /></span>
              <h3>Votre collection</h3>
              <strong className="gm-promo-num">{got}<small>/ {all.length}</small></strong>
              <p>badges obtenus</p>
              <div className="gm-progress"><span style={{ width: `${all.length ? (got / all.length) * 100 : 0}%` }} /></div>
            </article>
          )}
          {rows.map((b) => (
            <article key={b.id} className={`gm-badge ${b.earnedAt ? 'got' : 'locked'}`}>
              <div className="gm-badge-top">
                <span className="gm-badge-icon"><Icon name={iconFor(b.icon)} size={26} /></span>
                <span className={`gm-tag ${b.earnedAt ? 'ok' : ''}`}>
                  {b.earnedAt ? <><Icon name="check" size={12} strokeWidth={3} /> Obtenu</> : <><Icon name="lock" size={12} strokeWidth={2.5} /> Verrouillé</>}
                </span>
              </div>
              <strong>{b.name}</strong>
              <p>{b.description}</p>
              <div className="gm-meta">
                <span className="gm-pill"><Icon name={b.earnedAt ? 'calendar' : 'target'} size={14} />{b.earnedAt ? `Le ${fmt(b.earnedAt)}` : b.condition}</span>
              </div>
            </article>
          ))}
        </div>
      </Status>
    </div>
  );
}

/* ================= Avatars ================= */
function AvatarsTab({ ids }) {
  const { data, loading, error, reload } = useAsync(async () => {
    const [avatars, points] = await Promise.all([api.getAvatars(), api.getPoints(ids.studentId)]);
    return { avatars, current: points.avatarId };
  });
  const [cat, setCat] = useState('all');
  const [pick, setPick] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const categories = [...new Set((data?.avatars || []).map((a) => a.category))];
  const chosen = pick ?? data?.current;

  const save = async () => {
    setSaving(true); setMsg(null);
    try { await api.setAvatar(ids.studentId, pick); setMsg({ ok: true, text: 'Avatar mis à jour.' }); setPick(null); reload(); }
    catch (e) { setMsg({ ok: false, text: e.message }); } finally { setSaving(false); }
  };

  return (
    <Status loading={loading} error={error} onRetry={reload} empty={data && data.avatars.length === 0} emptyText="Aucun avatar disponible.">
      {data && (
        <div className="stack">
          <div className="gm-filters">
            <button type="button" className={`gm-fchip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>Tous</button>
            {categories.map((c) => <button key={c} type="button" className={`gm-fchip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="gm-grid gm-avatars">
            {data.avatars.filter((a) => cat === 'all' || a.category === cat).map((a) => (
              <button key={a.id} type="button" className={`gm-avatar-card ${chosen === a.id ? 'sel' : ''}`} onClick={() => setPick(a.id)} aria-pressed={chosen === a.id}>
                {chosen === a.id && <span className="gm-check"><Icon name="check" size={13} strokeWidth={3} /></span>}
                <Avatar a={a} size={68} />
                <strong>{a.name}</strong>
                <small>{a.id === data.current ? 'Avatar actuel' : a.category}</small>
              </button>
            ))}
          </div>
          {msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-err'}`}>{msg.text}</div>}
          <div className="actions"><button type="button" className="btn-red" disabled={!pick || pick === data.current || saving} onClick={save}>{saving ? 'Enregistrement…' : 'Choisir cet avatar'}</button></div>
        </div>
      )}
    </Status>
  );
}

/* ================= Classements ================= */
function RankingTab({ ids }) {
  const [mode, setMode] = useState('students');
  const { data, loading, error, reload } = useAsync(async () => {
    const [students, teams, avatars] = await Promise.all([api.getStudentsRanking(), api.getTeamsRanking(), api.getAvatars()]);
    return { students, teams, avatars };
  });
  const rows = data?.[mode] || [];

  const isMine = (r) => (mode === 'students' ? r.studentId === ids.studentId : r.teamId === ids.teamId);
  const who = (r, size) => (mode === 'students'
    ? <Avatar a={data.avatars.find((a) => a.id === r.avatarId)} name={r.name} size={size} />
    : <TeamMark emblem={r.emblem} color={r.color} size={size} />);

  const top = rows.slice(0, 3);
  const rest = rows.slice(3);
  const myIdx = rows.findIndex(isMine);
  const ahead = myIdx > 0 ? rows[myIdx - 1] : null;
  const gap = ahead ? ahead.points - rows[myIdx].points : 0;

  return (
    <div className="stack">
      <div className="gm-filters">
        <button type="button" className={`gm-fchip ${mode === 'students' ? 'on' : ''}`} onClick={() => setMode('students')}>Étudiants</button>
        <button type="button" className={`gm-fchip ${mode === 'teams' ? 'on' : ''}`} onClick={() => setMode('teams')}>Équipes</button>
      </div>

      <Status loading={loading} error={error} onRetry={reload} empty={data && rows.length === 0} emptyText="Le classement est vide pour l'instant.">
        {myIdx >= 0 && (
          <section className="gm-banner">
            <div>
              <h3>{myIdx === 0 ? 'Vous êtes en tête du classement' : 'Vous êtes plus proche que vous ne le pensez'}</h3>
              <p>
                {myIdx === 0
                  ? 'Continuez ainsi pour garder la première place.'
                  : gap > 0
                    ? `Plus que ${gap} pt${gap > 1 ? 's' : ''} pour dépasser ${ahead.name}${/[.!?]$/.test(ahead.name) ? '' : '.'}`
                    : `Vous êtes à égalité avec ${ahead.name}${/[.!?]$/.test(ahead.name) ? '' : '.'}`}
              </p>
            </div>
            <span className="gm-banner-rank">#{rows[myIdx].rank}</span>
          </section>
        )}

        <div className="gm-podium">
          {top.map((r) => (
            <article key={r.studentId || r.teamId} className={`gm-podium-card r${r.rank} ${isMine(r) ? 'me' : ''}`}>
              <span className={`gm-medal r${r.rank}`}>{r.rank}</span>
              {who(r, 62)}
              <strong>{r.name}</strong>
              {isMine(r) && <span className="gm-you">Vous</span>}
              <span className="gm-pts"><Icon name="star" size={13} />{r.points} pts</span>
            </article>
          ))}
        </div>

        {rest.length > 0 && (
          <div className="card gm-tablecard">
            <div className="table-wrap"><table className="table gm-table">
              <thead><tr><th>Rang</th><th>{mode === 'students' ? 'Étudiant' : 'Équipe'}</th><th style={{ textAlign: 'right' }}>Points</th></tr></thead>
              <tbody>
                {rest.map((r) => (
                  <tr key={r.studentId || r.teamId} className={isMine(r) ? 'selected' : ''}>
                    <td><span className="gm-rank-num">{r.rank}</span></td>
                    <td><div className="gm-row">{who(r, 36)}<strong>{r.name}</strong>{isMine(r) && <span className="gm-you">Vous</span>}</div></td>
                    <td style={{ textAlign: 'right' }}><span className="gm-pts"><Icon name="star" size={13} />{r.points}</span></td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}
      </Status>
    </div>
  );
}

/* ================= Identité de l'équipe ================= */
function TeamTab({ ids }) {
  const { data: t, loading, error, reload } = useAsync(() => api.getTeam(ids.teamId));
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const f = form ?? (t && { name: t.name, emblem: t.emblem, color: t.color });

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setMsg(null);
    try { await api.updateTeamIdentity(ids.teamId, f); setMsg({ ok: true, text: 'Identité enregistrée.' }); setForm(null); reload(); }
    catch (er) { setMsg({ ok: false, text: er.message }); } finally { setSaving(false); }
  };

  return (
    <Status loading={loading} error={error} onRetry={reload}>
      {t && (
        <div className="page-grid">
          <div className="card gm-team" style={{ '--team': f.color }}>
            <TeamMark emblem={f.emblem} color={f.color} size={92} />
            <h3>{f.name}</h3>
            <div className="gm-team-stats">
              <div><small>Points collectifs</small><strong>{t.points}</strong></div>
              <div><small>Classement</small><strong>#{t.rank}</strong></div>
            </div>
          </div>

          <form className="card" onSubmit={save}>
            <h3>Modifier l'identité</h3>
            {!t.canEdit ? <p className="muted">Seuls les membres autorisés de l'équipe peuvent modifier son identité.</p> : (
              <>
                <div className="field"><label htmlFor="tn">Nom de l'équipe</label><input id="tn" value={f.name} onChange={(e) => setForm({ ...f, name: e.target.value })} required /></div>
                <div className="field" style={{ marginTop: 16 }}>
                  <label>Emblème</label>
                  <div className="gm-emblems">
                    {EMBLEMS.map((em) => (
                      <button key={em} type="button" className={`gm-emb ${f.emblem === em ? 'on' : ''}`} aria-pressed={f.emblem === em} aria-label={iconFor(em, 'shield')} onClick={() => setForm({ ...f, emblem: em })}>
                        <Icon name={iconFor(em, 'shield')} size={22} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field" style={{ marginTop: 16 }}><label htmlFor="tc">Couleur</label><input id="tc" type="color" value={f.color} onChange={(e) => setForm({ ...f, color: e.target.value })} style={{ height: 44, padding: 4 }} /></div>
                {msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-err'}`} style={{ marginTop: 14 }}>{msg.text}</div>}
                <div className="actions"><button type="submit" className="btn-red" disabled={saving || !form}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button></div>
              </>
            )}
          </form>
        </div>
      )}
    </Status>
  );
}

/* ================= Historique ================= */
function HistoryTab({ ids }) {
  const { data, loading, error, reload } = useAsync(() => api.getRewards(ids.studentId));
  const [scope, setScope] = useState('');
  const rows = (data || []).filter((r) => !scope || r.scope === scope);
  const TYPES = { POINTS: 'Points', BADGE: 'Badge', NIVEAU: 'Niveau' };
  const TYPE_ICON = { POINTS: 'bolt', BADGE: 'medal', NIVEAU: 'crown' };
  const total = rows.reduce((s, r) => s + (r.points > 0 ? r.points : 0), 0);

  return (
    <div className="card">
      <div className="toolbar gm-toolbar">
        <select value={scope} onChange={(e) => setScope(e.target.value)} aria-label="Portée">
          <option value="">Individuelles et collectives</option><option value="INDIVIDUEL">Individuelles</option><option value="COLLECTIF">Collectives</option>
        </select>
        <span className="gm-total"><Icon name="star" size={15} />{total} pts cumulés</span>
      </div>
      <Status loading={loading} error={error} onRetry={reload} empty={data && rows.length === 0} emptyText="Aucune récompense reçue pour l'instant.">
        <div className="table-wrap"><table className="table gm-table">
          <thead><tr><th>Date</th><th>Motif</th><th>Type</th><th>Portée</th><th style={{ textAlign: 'right' }}>Points</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id}>
              <td style={{ whiteSpace: 'nowrap' }} className="muted">{fmt(r.receivedAt)}</td>
              <td><div className="gm-row"><span className="gm-icon gm-icon-soft gm-icon-sm"><Icon name={TYPE_ICON[r.type] || 'medal'} size={15} /></span><strong>{r.reason}</strong></div></td>
              <td><span className="badge badge-neutral">{TYPES[r.type] || r.type}</span></td>
              <td><span className={`badge ${r.scope === 'COLLECTIF' ? 'badge-warn' : 'badge-ok'}`}>{r.scope === 'COLLECTIF' ? 'Équipe' : 'Individuelle'}</span></td>
              <td style={{ textAlign: 'right' }}>{r.points > 0 ? <span className="gm-pts">+{r.points}</span> : '—'}</td>
            </tr>
          ))}</tbody>
        </table></div>
      </Status>
    </div>
  );
}

/* ================= Page ================= */
const TABS = [
  ['dashboard', 'Tableau de bord', DashboardTab, 'dashboard'], ['badges', 'Badges', BadgesTab, 'medal'], ['avatars', 'Avatars', AvatarsTab, 'user'],
  ['ranking', 'Classements', RankingTab, 'trophy'], ['team', 'Mon équipe', TeamTab, 'users'], ['history', 'Historique', HistoryTab, 'clock'],
];

const Gamification = () => {
  const [tab, setTab] = useState('dashboard');
  const ids = getIds();
  const Current = TABS.find((t) => t[0] === tab)[2];

  return (
    <AppLayout role="ETUDIANT" title="Gamification" subtitle="Points, badges, niveaux et classements.">
      {isMock && <div className="alert alert-err" style={{ marginBottom: 16 }}>Mode démo : données fictives (VITE_USE_MOCK=true).</div>}
      <div className="gm-tabs" role="tablist">
        {TABS.map(([k, label, , ic]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><Icon name={ic} size={16} />{label}</button>
        ))}
      </div>
      <Current ids={ids} />
    </AppLayout>
  );
};

export default Gamification;
