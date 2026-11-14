import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import { Icon } from '../components/Icons';
import useAsync from '../hooks/useAsync';
import { groupService as api, GROUP_STATUS } from '../services/groupService';
import './Groups.css';

const STEPS = ['Projet', 'Critères', 'Génération', 'Résultats'];
const CRITERIA = [['academic', 'Résultats académiques'], ['skills', 'Compétences'], ['diversity', 'Diversité des profils'], ['interests', 'Centres d’intérêt']];
const initials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2);

function Wizard({ data }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ courseId: data.courses[0].id, classId: data.classes[0].id, projectId: '', teamSize: 4 });
  const [w, setW] = useState({ academic: 70, skills: 80, diversity: 60, interests: 40 });
  const [ls, setLs] = useState(false);
  const [fail, setFail] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | sent | running | error
  const [err, setErr] = useState('');
  const [teams, setTeams] = useState([]);
  const [orig, setOrig] = useState([]);
  const [version, setVersion] = useState(1);
  const [edit, setEdit] = useState(false);
  const [validated, setValidated] = useState(false);
  const [drag, setDrag] = useState(null);
  const [over, setOver] = useState(null);
  const [msg, setMsg] = useState(null);

  const projects = data.projects.filter((p) => p.classId === f.classId);
  const project = projects.find((p) => p.id === f.projectId) || projects[0];
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const ids = (t) => JSON.stringify(t.map((x) => x.members.map((m) => m.id)));
  const changed = ids(teams) !== ids(orig);

  const generate = async () => {
    setErr(''); setPhase('sent');
    setTimeout(() => setPhase((p) => (p === 'sent' ? 'running' : p)), 700);
    try {
      const res = await api.generateTeams({ ...f, projectId: project.id, teamSize: Number(f.teamSize), weights: w, learningStyles: ls, simulateError: fail });
      setTeams(res); setOrig(structuredClone(res)); setVersion(1); setPhase('idle'); setStep(4);
    } catch (e) { setErr(e.message); setPhase('error'); }
  };

  const drop = (teamId) => {
    if (!drag) return;
    setTeams((ts) => {
      const next = structuredClone(ts); let s;
      next.forEach((t) => { const i = t.members.findIndex((m) => m.id === drag); if (i > -1) s = t.members.splice(i, 1)[0]; });
      next.find((t) => t.id === teamId).members.push(s);
      return next;
    });
    setDrag(null); setOver(null);
  };

  const save = async () => { const r = await api.saveVersion(teams); setVersion((v) => v + 1); setOrig(structuredClone(teams)); setMsg(`Version ${version + 1} enregistrée.`); };
  const validate = async () => { await api.validateTeams(); setValidated(true); setEdit(false); setMsg('Équipes validées : elles peuvent maintenant être publiées.'); };

  return (
    <div className="stack">
      <div className="gp-hero">
        <span className="gp-hero-ic"><Icon name="cpu" size={26} /></span>
        <div><h2>Constitution automatique des équipes</h2><p>Paramétrez la demande : le moteur ML analyse les profils et propose des équipes équilibrées.</p></div>
      </div>

      <ol className="gp-steps">
        {STEPS.map((s, i) => (
          <li key={s} className={step === i + 1 ? 'on' : step > i + 1 ? 'done' : ''}><i>{step > i + 1 ? <Icon name="check" size={14} strokeWidth={3} /> : i + 1}</i>{s}</li>
        ))}
      </ol>

      <div className="card">
        {step === 1 && (
          <>
            <h3>Informations du projet</h3>
            <div className="form-grid">
              <div className="field"><label>Cours</label><select value={f.courseId} onChange={(e) => set('courseId', e.target.value)}>{data.courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div className="field"><label>Classe</label><select value={f.classId} onChange={(e) => { set('classId', e.target.value); set('projectId', ''); }}>{data.classes.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.level}</option>)}</select></div>
              <div className="field"><label>Projet</label><select value={project?.id || ''} onChange={(e) => set('projectId', e.target.value)}>{projects.length ? projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>) : <option value="">Aucun projet pour cette classe</option>}</select></div>
              <div className="field"><label>Étudiants par équipe</label><input type="number" min="2" max="8" value={f.teamSize} onChange={(e) => set('teamSize', e.target.value)} /></div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Critères de constitution</h3>
            {CRITERIA.map(([k, l]) => (
              <div className="gp-weight" key={k}>
                <label htmlFor={`w-${k}`}>{l}</label><b>{w[k]} %</b>
                <input id={`w-${k}`} type="range" min="0" max="100" value={w[k]} onChange={(e) => setW({ ...w, [k]: +e.target.value })} />
              </div>
            ))}
            <div className="gp-toggle">
              <button type="button" role="switch" aria-checked={ls} aria-label="Styles d’apprentissage" className={ls ? 'on' : ''} onClick={() => setLs(!ls)} />
              <div><b>Prendre en compte les styles d’apprentissage</b><small>Critère facultatif : visuel, auditif, pratique, lecture.</small></div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3>Récapitulatif</h3>
            <div className="gp-recap">
              <div><small>Cours</small><b>{data.courses.find((c) => c.id === f.courseId)?.name}</b></div>
              <div><small>Classe</small><b>{f.classId}</b></div>
              <div><small>Projet</small><b>{project?.title || '—'}</b></div>
              <div><small>Taille d’équipe</small><b>{f.teamSize} étudiants</b></div>
              {CRITERIA.map(([k, l]) => <div key={k}><small>{l}</small><b>{w[k]} %</b></div>)}
              <div><small>Styles d’apprentissage</small><b>{ls ? 'Activés' : 'Désactivés'}</b></div>
            </div>
            {phase === 'sent' || phase === 'running' ? (
              <div className="gp-loading"><span className="gp-spin" /><b>{phase === 'sent' ? 'Demande envoyée' : 'Génération en cours'}</b><p>Le moteur intelligent analyse les profils des étudiants et constitue les équipes…</p></div>
            ) : (
              <>
                {phase === 'error' && <div className="alert alert-err"><b>Erreur de génération.</b> {err}</div>}
                <label className="muted gp-sim"><input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} /> Simuler une erreur (démo)</label>
                <button type="button" className="btn-red" onClick={generate} disabled={!project}><Icon name="cpu" size={16} /> {phase === 'error' ? 'Relancer la génération' : 'Générer les équipes automatiquement'}</button>
              </>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <div className="gp-bar">
              <div><h3>{project?.title} · {f.classId}</h3><span className="muted">Version {version} · {teams.length} équipes · {validated ? 'Validée' : 'Brouillon'}</span></div>
              <div className="gp-actions">
                <button type="button" className={edit ? 'btn-red' : 'btn-outline'} disabled={validated} onClick={() => setEdit(!edit)}>{edit ? 'Terminer la modification' : 'Modifier la composition'}</button>
                <button type="button" className="btn-outline" disabled={!changed} onClick={() => setTeams(structuredClone(orig))}>Réinitialiser</button>
                <button type="button" className="btn-outline" disabled={!changed} onClick={save}>Enregistrer une version</button>
                <button type="button" className="btn-red" disabled={validated} onClick={validate}>Valider les équipes</button>
              </div>
            </div>
            {msg && <div className="alert alert-ok">{msg}</div>}
            {changed && <div className="alert gp-note">Composition modifiée : les indicateurs affichés sont ceux calculés par le moteur ML pour la version générée.</div>}
            <div className={`gp-teams ${edit ? 'edit' : ''}`}>
              {teams.map((t) => (
                <section key={t.id} className={`gp-team ${over === t.id ? 'over' : ''}`} onDragOver={(e) => { if (drag) { e.preventDefault(); setOver(t.id); } }} onDrop={() => drop(t.id)}>
                  <header><h4>{t.name}</h4><span className="badge badge-neutral">{t.members.length} membres</span></header>
                  <div className="gp-ind"><span>Équilibre</span><div className="bar"><span style={{ width: `${t.balance}%` }} /></div><b>{t.balance} %</b>
                    <span>Diversité</span><div className="bar"><span style={{ width: `${t.diversity}%` }} /></div><b>{t.diversity} %</b></div>
                  {t.members.map((m) => (
                    <div key={m.id} className="gp-member" draggable={edit} onDragStart={() => setDrag(m.id)} onDragEnd={() => { setDrag(null); setOver(null); }}>
                      <span className="gp-av">{initials(m.name)}</span><div><b>{m.name}</b><small>{m.id}</small></div>
                    </div>
                  ))}
                  {!t.members.length && <p className="muted">Déposez un étudiant ici.</p>}
                </section>
              ))}
            </div>
          </>
        )}

        {step < 4 && phase !== 'sent' && phase !== 'running' && (
          <div className="actions" style={{ justifyContent: 'space-between' }}>
            {step > 1 ? <button type="button" className="btn-outline" onClick={() => setStep(step - 1)}>Précédent</button> : <span />}
            {step < 3 && <button type="button" className="btn-red" disabled={step === 1 && !project} onClick={() => setStep(step + 1)}>Continuer</button>}
          </div>
        )}
      </div>
    </div>
  );
}

const TeacherTeams = () => {
  const { data, loading, error, reload } = useAsync(() => api.getTeacherData());
  return (
    <AppLayout role="ENSEIGNANT" title="Équipes (ML)" subtitle="Constitution automatique des groupes d’apprentissage.">
      <Status loading={loading} error={error} onRetry={reload}>{data && <Wizard data={data} />}</Status>
    </AppLayout>
  );
};
export default TeacherTeams;
