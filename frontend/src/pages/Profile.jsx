import { Fragment, useRef, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Status, { StatusBadge } from '../components/Status';
import { Icon } from '../components/Icons';
import useAsync from '../hooks/useAsync';
import { profilingService as api } from '../services/profilingService';
import { STYLE_LABELS } from '../utils/labels';
import './Groups.css';
import './Profile.css';

const DAYS = [['lun', 'Lun'], ['mar', 'Mar'], ['mer', 'Mer'], ['jeu', 'Jeu'], ['ven', 'Ven'], ['sam', 'Sam']];
const SLOTS = [['matin', 'Matin'], ['apres-midi', 'Après-midi'], ['soir', 'Soir']];
const base = (p) => ({ filiere: p.filiere, niveau: p.niveau, moyenne: p.moyenne });

/* ---------- Niveau 1 à 5 (points) ---------- */
function LevelPicker({ value, onChange }) {
  return (
    <div className="pf-dots" role="group" aria-label="Niveau de 1 à 5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" className={n <= value ? 'on' : ''} onClick={() => onChange?.(n)} aria-label={`Niveau ${n}`} />
      ))}
    </div>
  );
}

/* ---------- Quiz de validation d'une compétence ---------- */
function SkillQuiz({ skill, onClose, onDone }) {
  const { data: quiz, loading, error, reload } = useAsync(() => api.getSkillQuiz(skill.skillId), [skill.skillId]);
  const [answers, setAnswers] = useState({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);

  const submit = async () => {
    setSending(true);
    setErr(null);
    try {
      setResult(await api.submitSkillQuiz(skill.skillId, answers)); // { score, total, passed, correction: {qId: optionId} }
      onDone();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pf-modal" role="dialog" aria-modal="true" aria-label={`Quiz ${skill.name}`}>
      <div className="pf-modal-box">
        <div className="pf-modal-head">
          <div>
            <h3>Quiz : {skill.name}</h3>
            <p className="muted">Il faut au moins {quiz?.minScore ?? 2} bonnes réponses sur {quiz?.questions.length ?? 3}.</p>
          </div>
          <button type="button" className="pf-x" onClick={onClose} aria-label="Fermer">×</button>
        </div>

        <Status loading={loading} error={error} onRetry={reload} empty={quiz && quiz.questions.length === 0} emptyText="Aucun quiz disponible pour cette compétence.">
          {quiz && (
            <>
              {result && (
                <div className={`alert ${result.passed ? 'alert-ok' : 'alert-err'}`}>
                  Score : <strong>{result.score}/{result.total}</strong> — {result.passed ? 'compétence validée.' : 'quiz échoué, vous pouvez réessayer.'}
                </div>
              )}
              {quiz.questions.map((q, i) => (
                <div className="question" key={q.id}>
                  <h4>{i + 1}. {q.text}</h4>
                  <div className="options">
                    {q.options.map((o) => {
                      const good = result && result.correction?.[q.id] === o.id;
                      const bad = result && answers[q.id] === o.id && !good;
                      return (
                        <button
                          key={o.id}
                          type="button"
                          disabled={!!result}
                          className={`option ${answers[q.id] === o.id ? 'on' : ''} ${good ? 'pf-good' : ''} ${bad ? 'pf-bad' : ''}`}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {err && <div className="alert alert-err">{err}</div>}
              <div className="actions">
                {result ? (
                  <button type="button" className="btn-red" onClick={onClose}>Fermer</button>
                ) : (
                  <button type="button" className="btn-red" onClick={submit}
                    disabled={sending || Object.keys(answers).length < quiz.questions.length}>
                    {sending ? 'Envoi…' : 'Valider mes réponses'}
                  </button>
                )}
              </div>
            </>
          )}
        </Status>
      </div>
    </div>
  );
}

/* ---------- Questionnaire du style d'apprentissage (fenêtre) ---------- */
function StyleQuiz({ onClose, onDone }) {
  const { data, loading, error, reload } = useAsync(() => api.getQuestionnaire());
  const [answers, setAnswers] = useState({});
  const [sending, setSending] = useState(false);
  const total = data?.questions.length ?? 0;
  const submit = async () => { setSending(true); try { await api.submitQuestionnaire(answers); onDone(); onClose(); } finally { setSending(false); } };
  return (
    <div className="pf-modal" role="dialog" aria-modal="true" aria-label="Style d’apprentissage">
      <div className="pf-modal-box">
        <div className="pf-modal-head"><div><h3>Votre style d’apprentissage</h3><p className="muted">Choisissez la réponse qui vous ressemble le plus.</p></div>
          <button type="button" className="pf-x" onClick={onClose} aria-label="Fermer">×</button></div>
        <Status loading={loading} error={error} onRetry={reload}>
          {data?.questions.map((q, i) => (
            <div className="question" key={q.id}><h4>{i + 1}. {q.text}</h4>
              <div className="options">{q.options.map((o) => <button key={o.id} type="button" className={`option ${answers[q.id] === o.id ? 'on' : ''}`} onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}>{o.label}</button>)}</div></div>
          ))}
          <div className="actions"><button type="button" className="btn-red" disabled={sending || Object.keys(answers).length < total} onClick={submit}>{sending ? 'Envoi…' : 'Découvrir mon style'}</button></div>
        </Status>
      </div>
    </div>
  );
}

/* ---------- A. Informations personnelles (lecture seule) ---------- */
function PersonalCard({ p }) {
  const rows = [['Nom', p.lastName], ['Prénom', p.firstName], ['Identifiant étudiant', p.studentId || '—'], ['Adresse e-mail', p.email], ['Rôle', 'Étudiant'], ['Moyenne générale (GPA)', p.moyenne != null ? `${p.moyenne} / 20` : '—']];
  return (
    <div className="card">
      <div className="gp-bar"><h3>Informations personnelles</h3><span className="badge badge-neutral"><Icon name="lock" size={11} strokeWidth={3} /> Fournies par l’administration</span></div>
      <div className="pf-ro">{rows.map(([l, v]) => <div key={l}><small>{l}</small><b>{v}</b></div>)}</div>
    </div>
  );
}

/* ---------- B. Informations complémentaires ---------- */
function ExtraCard({ p, onSaved }) {
  const { data, loading, error, reload } = useAsync(async () => {
    const [catalog, mine] = await Promise.all([api.getInterestsCatalog(), api.getMyInterests()]);
    return { catalog, mine };
  });
  const [bio, setBio] = useState(p.bio || '');
  const [av, setAv] = useState(p.availabilities || {});
  const [ints, setInts] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [quiz, setQuiz] = useState(false);
  const chosen = ints ?? data?.mine ?? [];

  const toggleInt = (id) => setInts(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]);
  const toggleSlot = (d, s) => setAv((a) => { const cur = a[d] || []; const next = cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]; return { ...a, [d]: next }; });

  const save = async () => {
    setSaving(true); setMsg(null);
    try {
      await api.updateProfile({ ...base(p), bio, availabilities: av });
      await api.saveMyInterests(chosen);
      setMsg({ ok: true, text: 'Modifications enregistrées.' }); onSaved();
    } catch (e) { setMsg({ ok: false, text: e.message }); } finally { setSaving(false); }
  };

  return (
    <div className="card">
      <h3>Informations complémentaires</h3>
      <div className="field"><label htmlFor="bio">Biographie</label>
        <textarea id="bio" rows="3" maxLength="280" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Présentez-vous en quelques lignes…" />
        <small className="muted">{bio.length}/280</small></div>

      <h4 className="pf-sub">Centres d’intérêt</h4>
      <Status loading={loading} error={error} onRetry={reload}>
        <div className="chips">{data?.catalog.map((c) => <button key={c.id} type="button" className={`chip ${chosen.includes(c.id) ? 'on' : ''}`} onClick={() => toggleInt(c.id)}>{c.label}</button>)}</div>
      </Status>

      <h4 className="pf-sub">Disponibilités</h4>
      <div className="pf-av" role="group" aria-label="Disponibilités">
        <span />{SLOTS.map(([, l]) => <small key={l}>{l}</small>)}
        {DAYS.map(([d, dl]) => (<Fragment key={d}><b>{dl}</b>{SLOTS.map(([s, sl]) => { const on = (av[d] || []).includes(s); return <button key={d + s} type="button" className={on ? 'on' : ''} aria-pressed={on} aria-label={`${dl} ${sl}`} onClick={() => toggleSlot(d, s)}>{on && <Icon name="check" size={14} strokeWidth={3} />}</button>; })}</Fragment>))}
      </div>

      <h4 className="pf-sub">Style d’apprentissage</h4>
      <div className="pf-style">
        <span className="pf-style-ic"><Icon name="target" size={20} /></span>
        <div><b>{p.learningStyle ? STYLE_LABELS[p.learningStyle] || p.learningStyle : 'Non déterminé'}</b><small>Visuel, auditif, pratique ou lecture.</small></div>
        <button type="button" className="btn-outline" onClick={() => setQuiz(true)}>{p.learningStyle ? 'Refaire le questionnaire' : 'Passer le questionnaire'}</button>
      </div>

      {msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-err'}`} style={{ marginTop: 16 }}>{msg.text}</div>}
      <div className="actions"><button type="button" className="btn-red" disabled={saving} onClick={save}>{saving ? 'Enregistrement…' : 'Enregistrer les modifications'}</button></div>
      {quiz && <StyleQuiz onClose={() => setQuiz(false)} onDone={onSaved} />}
    </div>
  );
}

/* ---------- C. Compétences ---------- */
function SkillsCard({ onChanged }) {
  const { data, loading, error, reload } = useAsync(async () => {
    const [catalog, mine] = await Promise.all([api.getSkillsCatalog(), api.getMySkills()]);
    return { catalog, mine };
  });
  const [items, setItems] = useState(null);
  const [pick, setPick] = useState('');
  const [level, setLevel] = useState(3);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [quizFor, setQuizFor] = useState(null);

  const list = items ?? data?.mine ?? [];
  const catalog = data?.catalog ?? [];
  const byId = Object.fromEntries(catalog.map((c) => [c.id, c]));
  const available = catalog.filter((c) => !list.some((i) => i.skillId === c.id));
  const categories = [...new Set(available.map((c) => c.category))];
  const savedIds = new Set((data?.mine ?? []).map((m) => m.skillId));
  const statusOf = (i) => (i.validated ? ['Certifiée', 'ok'] : i.status === 'EN_ATTENTE' ? ['En attente', 'warn'] : ['Déclarée', 'neutral']);

  const add = () => { if (pick) { setItems([...list, { skillId: pick, level, validated: false }]); setPick(''); } };
  const setLvl = (id, l) => setItems(list.map((i) => (i.skillId === id ? { ...i, level: l } : i)));
  const remove = (id) => setItems(list.filter((i) => i.skillId !== id));
  const save = async () => {
    setSaving(true); setMsg(null);
    try { await api.saveMySkills(list.map(({ skillId, level: l }) => ({ skillId, level: l }))); setMsg({ ok: true, text: 'Compétences enregistrées. Vous pouvez passer les quiz.' }); setItems(null); reload(); onChanged(); }
    catch (e) { setMsg({ ok: false, text: e.message }); } finally { setSaving(false); }
  };

  return (
    <div className="card">
      <div className="gp-bar"><h3>Compétences</h3><span className="muted">Seules les compétences certifiées sont transmises au matching.</span></div>
      <Status loading={loading} error={error} onRetry={reload} empty={data && catalog.length === 0} emptyText="Le catalogue de compétences est vide.">
        <div className="pf-add">
          <div className="field"><label htmlFor="skill">Ajouter une compétence</label>
            <select id="skill" value={pick} onChange={(e) => setPick(e.target.value)}><option value="">Choisir dans la liste…</option>
              {categories.map((cat) => <optgroup key={cat} label={cat}>{available.filter((c) => c.category === cat).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>)}</select></div>
          <div className="field"><label>Niveau estimé</label><LevelPicker value={level} onChange={setLevel} /></div>
          <button type="button" className="btn-outline" onClick={add} disabled={!pick}>Ajouter</button>
        </div>

        {list.length === 0 ? <p className="muted" style={{ marginTop: 18 }}>Aucune compétence pour l’instant.</p> : (
          <div className="tw"><table className="pf-table"><thead><tr><th>Compétence</th><th>Niveau</th><th>Statut</th><th /></tr></thead><tbody>
            {list.map((i) => { const [sl, st] = statusOf(i); return (
              <tr key={i.skillId}>
                <td><b>{byId[i.skillId]?.name || i.skillId}</b><small>{byId[i.skillId]?.category}</small></td>
                <td><LevelPicker value={i.level} onChange={(l) => setLvl(i.skillId, l)} /> <span className="pf-lv">{i.level}/5</span></td>
                <td><span className={`badge badge-${st}`}>{sl}</span></td>
                <td><div className="gp-actions" style={{ justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-red" disabled={i.validated || !savedIds.has(i.skillId)} title={savedIds.has(i.skillId) ? '' : 'Enregistrez d’abord vos compétences'} onClick={() => setQuizFor({ ...i, name: byId[i.skillId]?.name })}>{i.validated ? 'Certifiée' : 'Passer le quiz'}</button>
                  <button type="button" className="btn-outline" onClick={() => remove(i.skillId)}>Retirer</button></div></td>
              </tr>); })}
          </tbody></table></div>
        )}
        {msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-err'}`} style={{ marginTop: 16 }}>{msg.text}</div>}
        <div className="actions"><button type="button" className="btn-red" onClick={save} disabled={saving || items === null}>{saving ? 'Enregistrement…' : 'Enregistrer les compétences'}</button></div>
      </Status>
      {quizFor && <SkillQuiz skill={quizFor} onClose={() => setQuizFor(null)} onDone={() => { reload(); onChanged(); }} />}
    </div>
  );
}

/* ---------- Page ---------- */
const Profile = () => {
  const { data: p, loading, error, reload } = useAsync(() => api.getProfile());
  const file = useRef(null);
  const [photoErr, setPhotoErr] = useState('');

  const onPhoto = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (!f.type.startsWith('image/') || f.size > 2 * 1024 * 1024) { setPhotoErr('Choisissez une image de moins de 2 Mo.'); return; }
    setPhotoErr('');
    const r = new FileReader();
    r.onload = async () => { try { await api.updateProfile({ ...base(p), photo: r.result }); reload(); } catch (err) { setPhotoErr(err.message); } };
    r.readAsDataURL(f);
  };

  return (
    <AppLayout role="ETUDIANT" title="Mon profil" subtitle="Vos informations, vos préférences et vos compétences.">
      <Status loading={loading} error={error} onRetry={reload}>
        {p && (
          <div className="pf">
            <aside className="pf-side">
              <div className="pf-photo">
                {p.photo ? <img src={p.photo} alt="Ma photo de profil" /> : <div className="pf-avatar">{p.firstName[0]}{p.lastName[0]}</div>}
                <button type="button" className="pf-cam" onClick={() => file.current.click()} aria-label="Modifier la photo">✎</button>
                <input ref={file} type="file" accept="image/*" hidden onChange={onPhoto} />
              </div>
              {photoErr && <small className="pf-err">{photoErr}</small>}
              <h2>{p.firstName} {p.lastName}</h2>
              <p className="muted">{p.studentId} · {p.filiere || 'Filière non renseignée'}</p>
              <span className="badge badge-ok">Étudiant</span>
              <StatusBadge status={p.validationStatus} />
              <div className="pf-ring" style={{ background: `conic-gradient(var(--red) ${p.completion * 3.6}deg, #f3e3e4 0)` }}><span>{p.completion}%</span></div>
              <p className="muted">du profil renseigné</p>
              {p.validationStatus === 'CORRECTION_DEMANDEE' && p.teacherComment && <div className="alert alert-err">Correction demandée : {p.teacherComment}</div>}
            </aside>
            <section className="pf-main stack">
              <PersonalCard p={p} />
              <ExtraCard key={p.completion + (p.learningStyle || '')} p={p} onSaved={reload} />
              <SkillsCard onChanged={reload} />
            </section>
          </div>
        )}
      </Status>
    </AppLayout>
  );
};

export default Profile;
