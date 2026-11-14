import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import AnimatedAvatar from '../components/AnimatedAvatar';
import Status from '../components/Status';
import { Icon } from '../components/Icons';
import useAsync from '../hooks/useAsync';
import { skillExchangeService as api, isMock } from '../services/skillExchangeService';
import './SkillExchange.css';

const NIVEAUX = [['DEBUTANT', 'Débutant'], ['INTERMEDIAIRE', 'Intermédiaire'], ['AVANCE', 'Avancé']];
const FR = { OUVERTE: 'Ouverte', APPARIEE: 'Appariée', PROPOSE: 'Proposé', CONFIRME: 'Confirmé', PROGRAMMEE: 'Programmée', TERMINEE: 'Terminée', A_PASSER: 'À passer', VALIDE: 'Validé', ECHOUE: 'Échoué', AUCUNE: 'À faire', A_PROGRAMMER: 'À programmer', VERROUILLEE: 'Verrouillé' };

function useAction(reload) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const run = async (fn) => { setBusy(true); setErr(null); try { await fn(); await reload(); } catch (e) { setErr(e.message); } finally { setBusy(false); } };
  return { busy, err, run };
}
const Err = ({ err }) => (err ? <div className="alert alert-err" role="alert">{err}</div> : null);

/* ================= Étape 1 : Demande ================= */
function DemandeStep({ j, reload, goTo }) {
  const { data, loading, error, reload: reloadLists } = useAsync(async () => {
    const [catalog, mine] = await Promise.all([api.getSkillsCatalog(), api.getMySkills()]);
    return { catalog, mine };
  });
  const [form, setForm] = useState({ competenceRecherchee: '', competenceProposee: '', niveau: 'INTERMEDIAIRE' });
  const { busy, err, run } = useAction(reload);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const { demande, appariement } = j;

  return (
    <div className="stack">
      {!demande ? (
        <Status loading={loading} error={error} onRetry={reloadLists}>
          {data && (
            <form className="se-card" onSubmit={(e) => { e.preventDefault(); run(() => api.createDemande(form)); }}>
              <h3>Nouvelle demande d’échange</h3>
              <p className="muted">Apprenez une compétence en échange d’une compétence que vous maîtrisez.</p>
              <div className="se-swap">
                <label className="se-side learn"><span className="se-tag">Je veux apprendre</span>
                  <select value={form.competenceRecherchee} onChange={(e) => set('competenceRecherchee', e.target.value)} required aria-label="Compétence recherchée">
                    <option value="">Choisir une compétence…</option>{data.catalog.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
                <span className="se-arrows"><Icon name="exchange" size={22} /></span>
                <label className="se-side teach"><span className="se-tag">Je propose en échange</span>
                  <select value={form.competenceProposee} onChange={(e) => set('competenceProposee', e.target.value)} required aria-label="Compétence proposée">
                    <option value="">Choisir une compétence…</option>{data.mine.map((m) => <option key={m.skillId} value={m.skillId}>{data.catalog.find((c) => c.id === m.skillId)?.name || m.skillId}</option>)}</select></label>
              </div>
              <div className="se-level" role="radiogroup" aria-label="Niveau">
                <span>Mon niveau</span>
                {NIVEAUX.map(([v, l]) => <button key={v} type="button" role="radio" aria-checked={form.niveau === v} className={form.niveau === v ? 'on' : ''} onClick={() => set('niveau', v)}>{l}</button>)}
              </div>
              {data.mine.length === 0 && <div className="alert alert-err">Ajoutez d’abord une compétence dans « Mon profil » pour pouvoir en proposer une.</div>}
              <Err err={err} />
              <button type="submit" className="btn-red se-cta" disabled={busy || data.mine.length === 0}>{busy ? 'Envoi…' : 'Envoyer la demande'}</button>
            </form>
          )}
        </Status>
      ) : (
        <div className="se-card">
          <div className="se-head"><h3>Ma demande</h3><span className="badge badge-neutral">{FR[demande.statut] || demande.statut}</span></div>
          <div className="se-swap view">
            <div className="se-side learn"><span className="se-tag">J’apprends</span><b>{demande.competenceRecherchee}</b></div>
            <span className="se-arrows"><Icon name="exchange" size={22} /></span>
            <div className="se-side teach"><span className="se-tag">Je propose ({demande.niveau?.toLowerCase()})</span><b>{demande.competenceProposee}</b></div>
          </div>
        </div>
      )}

      {demande && !appariement && (
        <div className="se-card se-search">
          <span className="se-radar"><i /><i /><i /></span>
          <div><b>Recherche d’un étudiant compatible…</b><p className="muted">Le système analyse les compétences et niveaux de la promotion.</p></div>
          <button type="button" className="btn-outline" onClick={reload}>Actualiser</button>
        </div>
      )}

      {appariement && (
        <div className="se-card se-match">
          <div className="se-head"><h3>Appariement</h3><span className={`badge ${appariement.statut === 'CONFIRME' ? 'badge-ok' : 'badge-warn'}`}>{FR[appariement.statut] || appariement.statut}</span></div>
          <div className="se-duo">
            <div><AnimatedAvatar id="a5" size={84} label="Vous" /><b>Vous</b></div>
            <div className="se-score" style={{ '--p': Math.round(appariement.score * 100) }}><span>{Math.round(appariement.score * 100)}<small>%</small></span><em>compatibilité</em></div>
            <div><AnimatedAvatar id="a3" size={84} label="Partenaire" /><b>Étudiant compatible</b></div>
          </div>
          <Err err={err} />
          <div className="actions" style={{ justifyContent: 'center' }}>
            {appariement.statut === 'PROPOSE'
              ? <button type="button" className="btn-red se-cta" disabled={busy} onClick={() => run(() => api.confirmAppariement(appariement.id))}>{busy ? 'Confirmation…' : 'Confirmer l’appariement'}</button>
              : <button type="button" className="btn-red se-cta" onClick={() => goTo('session')}>Programmer la session</button>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Étape 2 : Session ================= */
function SessionStep({ j, reload, goTo }) {
  const { session, appariement } = j;
  const [form, setForm] = useState({ mode: 'EN_LIGNE', dateHeure: '', lienReunion: '' });
  const { busy, err, run } = useAction(reload);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const online = form.mode === 'EN_LIGNE';

  if (appariement?.statut !== 'CONFIRME') {
    return <div className="se-card se-empty"><Icon name="lock" size={30} /><b>Session verrouillée</b><p className="muted">Elle s’ouvre quand l’appariement est confirmé.</p><button type="button" className="btn-outline" onClick={() => goTo('demande')}>Aller à Demande</button></div>;
  }

  if (session) {
    const d = new Date(session.dateHeure);
    return (
      <div className="se-card">
        <div className="se-head"><h3>Ma session</h3><span className={`badge ${session.statut === 'TERMINEE' ? 'badge-ok' : 'badge-warn'}`}>{FR[session.statut] || session.statut}</span></div>
        <div className="se-when">
          <div className="se-cal"><small>{d.toLocaleDateString('fr-FR', { month: 'short' })}</small><b>{d.getDate()}</b></div>
          <div><b>{d.toLocaleString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</b>
            <p className="muted">{session.mode === 'EN_LIGNE' ? 'En ligne' : 'En présentiel'}</p>
            {session.lienReunion && <a href={session.lienReunion} target="_blank" rel="noreferrer">Rejoindre la réunion</a>}</div>
        </div>
        <Err err={err} />
        <div className="actions">
          {session.statut === 'PROGRAMMEE'
            ? <button type="button" className="btn-red se-cta" disabled={busy} onClick={() => run(() => api.endSession(session.id))}>{busy ? 'Envoi…' : 'Déclarer la session terminée'}</button>
            : <button type="button" className="btn-red se-cta" onClick={() => goTo('quiz')}>Passer au quiz</button>}
        </div>
      </div>
    );
  }

  return (
    <form className="se-card" onSubmit={(e) => { e.preventDefault(); run(() => api.createSession({ appariementId: appariement.id, ...form, lienReunion: online ? form.lienReunion : undefined })); }}>
      <h3>Programmer la session</h3>
      <div className="se-level" role="radiogroup" aria-label="Mode">
        <span>Mode</span>
        {[['EN_LIGNE', 'En ligne'], ['PRESENTIEL', 'Présentiel']].map(([v, l]) => <button key={v} type="button" role="radio" aria-checked={form.mode === v} className={form.mode === v ? 'on' : ''} onClick={() => set('mode', v)}>{l}</button>)}
      </div>
      <div className="field"><label htmlFor="dt">Date et heure</label><input id="dt" type="datetime-local" value={form.dateHeure} onChange={(e) => set('dateHeure', e.target.value)} required /></div>
      {online && <div className="field"><label htmlFor="lien">Lien de la réunion</label><input id="lien" type="url" placeholder="https://…" value={form.lienReunion} onChange={(e) => set('lienReunion', e.target.value)} required /></div>}
      <Err err={err} />
      <button type="submit" className="btn-red se-cta" disabled={busy}>{busy ? 'Envoi…' : 'Programmer la session'}</button>
    </form>
  );
}

/* ================= Étape 3 : Quiz ================= */
function QuizStep({ j, reload, goTo }) {
  const { quiz, session } = j;
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const { busy, err, run } = useAction(reload);

  if (session?.statut !== 'TERMINEE' || !quiz) {
    return <div className="se-card se-empty"><Icon name="lock" size={30} /><b>Quiz verrouillé</b><p className="muted">Il s’ouvre quand la session est déclarée terminée.</p><button type="button" className="btn-outline" onClick={() => goTo('session')}>Aller à Session</button></div>;
  }
  const total = quiz.questions.length;
  const res = result || (quiz.statut !== 'A_PASSER' ? { score: quiz.score, total, statut: quiz.statut, correction: quiz.correction } : null);
  const answered = Object.keys(answers).length;

  return (
    <div className="stack">
      {res ? (
        <div className={`se-card se-result ${res.statut === 'VALIDE' ? 'ok' : 'ko'}`}>
          <span className="se-big">{res.score}<small>/{res.total}</small></span>
          <div><b>{res.statut === 'VALIDE' ? 'Quiz validé, bravo !' : 'Quiz non validé'}</b>
            <p>{res.statut === 'VALIDE' ? 'La progression de la compétence est transmise au profil.' : `Il fallait au moins ${quiz.scoreMinimum} bonnes réponses. Aucune progression ajoutée.`}</p></div>
        </div>
      ) : (
        <div className="se-card"><div className="se-head"><h3>Quiz : {quiz.competence}</h3><span className="muted">{answered}/{total} réponses</span></div>
          <div className="bar"><span style={{ width: `${(answered / total) * 100}%` }} /></div>
          <p className="muted" style={{ marginTop: 8 }}>Au moins {quiz.scoreMinimum} bonnes réponses sur {total} pour valider.</p></div>
      )}
      {quiz.questions.map((q, i) => (
        <div className="se-card" key={q.id}>
          <h4 className="se-q"><i>{i + 1}</i>{q.text}</h4>
          <div className="se-opts">
            {q.options.map((o) => {
              const good = res && res.correction?.[q.id] === o.id;
              const bad = res && answers[q.id] === o.id && !good;
              return <button key={o.id} type="button" disabled={!!res} className={`se-opt ${answers[q.id] === o.id ? 'on' : ''} ${good ? 'good' : ''} ${bad ? 'bad' : ''}`} onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}>{o.label}</button>;
            })}
          </div>
        </div>
      ))}
      <Err err={err} />
      {!res && <div className="actions"><button type="button" className="btn-red se-cta" disabled={busy || answered < total} onClick={() => run(async () => setResult(await api.submitQuiz(quiz.id, answers)))}>{busy ? 'Envoi…' : 'Valider mes réponses'}</button></div>}
    </div>
  );
}

/* ================= Page ================= */
const SkillExchange = () => {
  const { data: j, loading, error, reload } = useAsync(() => api.getMyJourney());
  const [step, setStep] = useState('demande');

  const st = j && {
    demande: j.appariement?.statut ?? j.demande?.statut ?? 'AUCUNE',
    session: j.session?.statut ?? (j.appariement?.statut === 'CONFIRME' ? 'A_PROGRAMMER' : 'VERROUILLEE'),
    quiz: j.quiz?.statut ?? 'VERROUILLEE',
  };
  const locked = j && { demande: false, session: j.appariement?.statut !== 'CONFIRME', quiz: j.session?.statut !== 'TERMINEE' };
  const done = j && { demande: j.appariement?.statut === 'CONFIRME', session: j.session?.statut === 'TERMINEE', quiz: j.quiz?.statut === 'VALIDE' };
  const STEPS = [['demande', 'Demande', 'exchange'], ['session', 'Session', 'calendar'], ['quiz', 'Quiz', 'target']];
  const Current = { demande: DemandeStep, session: SessionStep, quiz: QuizStep }[step];

  return (
    <AppLayout role="ETUDIANT" title="Skill-exchange" subtitle="Demander, apprendre, être évalué.">
      {isMock && <div className="alert alert-err" style={{ marginBottom: 16 }}>Mode démo : données fictives. Rechargez la page pour recommencer.</div>}
      <Status loading={loading} error={error} onRetry={reload}>
        {j && (
          <div className="se">
            <ol className="se-track" aria-label="Étapes">
              {STEPS.map(([key, label, icon], i) => (
                <li key={key} className={`${step === key ? 'on' : ''} ${done[key] ? 'done' : ''} ${locked[key] ? 'locked' : ''}`}>
                  <button type="button" onClick={() => setStep(key)} aria-current={step === key ? 'step' : undefined}>
                    <span className="se-dot">{done[key] ? <Icon name="check" size={18} strokeWidth={3} /> : locked[key] ? <Icon name="lock" size={16} /> : <Icon name={icon} size={18} />}</span>
                    <span><small>Étape {i + 1}</small><b>{label}</b><em>{FR[st[key]] || st[key]}</em></span>
                  </button>
                </li>
              ))}
            </ol>
            <section className="se-main"><Current j={j} reload={reload} goTo={setStep} /></section>
          </div>
        )}
      </Status>
    </AppLayout>
  );
};
export default SkillExchange;
