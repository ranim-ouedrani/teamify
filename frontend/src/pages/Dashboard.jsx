import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import AnimatedAvatar from '../components/AnimatedAvatar';
import Status from '../components/Status';
import { Icon, iconFor } from '../components/Icons';
import useAsync from '../hooks/useAsync';
import { profilingService as profiling } from '../services/profilingService';
import { skillExchangeService as exchange } from '../services/skillExchangeService';
import { gamificationService as gami, getIds } from '../services/gamificationService';
import { STYLE_LABELS } from '../utils/labels';
import './Home.css';

/* ---------- Héros : avatar animé + niveau + points ---------- */
function Hero({ p }) {
  const ids = getIds();
  const { data } = useAsync(async () => {
    const [pts, lvl] = await Promise.all([gami.getPoints(ids.studentId), gami.getLevel(ids.studentId)]);
    return { pts, lvl };
  });
  const pts = data?.pts;
  const lvl = data?.lvl;
  const pct = !lvl ? 0 : lvl.nextMin == null ? 100 : Math.min(100, ((pts.total - lvl.currentMin) / (lvl.nextMin - lvl.currentMin)) * 100);

  return (
    <section className="hm-hero">
      <div className="hm-hero-text">
        <span className="hm-kicker">Tableau de bord</span>
        <h2>Bonjour, {p.firstName} <span className="hm-wave">👋</span></h2>
        <p>{p.completion === 100 ? 'Votre profil est complet : vous êtes prêt pour le matching.' : 'Complétez votre profil pour être intégré aux groupes d’apprentissage.'}</p>
        {lvl && (
          <div className="hm-xp">
            <div className="hm-xp-top"><b>Niveau {lvl.level} · {lvl.name}</b><span>{pts.total} pts</span></div>
            <div className="hm-xp-bar"><span style={{ width: `${pct}%` }} /></div>
            <small>{lvl.nextMin == null ? 'Niveau maximum atteint 🎉' : `${lvl.nextMin - pts.total} pts avant le niveau suivant`}</small>
          </div>
        )}
      </div>
      <Link to="/gamification" className="hm-hero-avatar" title="Changer d’avatar">
        <span className="hm-halo" />
        <AnimatedAvatar id={pts?.avatarId || 'a5'} size={150} label="Votre avatar" />
        {pts && <span className="hm-rank">#{pts.rank}<small>/ {pts.totalStudents}</small></span>}
      </Link>
    </section>
  );
}

/* ---------- Profil : 3 blocs (infos, complémentaires, compétences) ---------- */
function ProfileCard({ p }) {
  const blocks = [
    { label: 'Informations personnelles', hint: 'Fournies par l’administration', done: true },
    { label: 'Informations complémentaires', hint: p.interestsCount > 0 && p.learningStyle ? `${p.interestsCount} intérêts · ${STYLE_LABELS[p.learningStyle] || p.learningStyle}` : 'Bio, intérêts, disponibilités, style', done: p.interestsCount > 0 && !!p.learningStyle },
    { label: 'Compétences', hint: `${p.skillsCount} déclarée(s)`, done: p.skillsCount > 0 },
  ];
  return (
    <article className="hm-card hm-profile">
      <header><h3>Mon profil</h3><Link to="/profile">Modifier</Link></header>
      <div className="hm-ring" style={{ '--p': p.completion }}><span>{p.completion}<small>%</small></span></div>
      <ul className="hm-blocks">
        {blocks.map((b) => (
          <li key={b.label} className={b.done ? 'done' : ''}>
            <span className="hm-dot"><Icon name={b.done ? 'check' : 'clock'} size={13} strokeWidth={3} /></span>
            <div><b>{b.label}</b><small>{b.hint}</small></div>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ---------- Compétences : niveau + statut ---------- */
function SkillsCard() {
  const { data, loading, error, reload } = useAsync(async () => {
    const [catalog, mine] = await Promise.all([profiling.getSkillsCatalog(), profiling.getMySkills()]);
    return mine.map((m) => ({ ...m, name: catalog.find((c) => c.id === m.skillId)?.name || m.skillId }));
  });
  return (
    <article className="hm-card">
      <header><h3>Mes compétences</h3><Link to="/profile">Gérer</Link></header>
      <Status loading={loading} error={error} onRetry={reload} empty={data && data.length === 0} emptyText="Aucune compétence déclarée.">
        <ul className="hm-skills">
          {data?.slice(0, 5).map((s) => (
            <li key={s.skillId}>
              <b>{s.name}</b>
              <span className="hm-lvl">{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= s.level ? 'on' : ''} />)}</span>
              <em className={s.validated ? 'ok' : ''}>{s.validated ? 'Certifiée' : 'Déclarée'}</em>
            </li>
          ))}
        </ul>
      </Status>
    </article>
  );
}

/* ---------- Skill-exchange : Demande → Session → Quiz ---------- */
function ExchangeCard() {
  const { data: j, loading, error, reload } = useAsync(() => exchange.getMyJourney());
  const steps = (() => {
    if (!j) return [];
    const matched = j.appariement?.statut === 'CONFIRME';
    const ended = j.session?.statut === 'TERMINEE';
    return [
      { name: 'Demande', icon: 'exchange', state: matched ? 'done' : j.demande ? 'doing' : 'todo', text: matched ? 'Appariement confirmé' : j.appariement ? 'À confirmer' : j.demande ? 'Recherche en cours…' : 'À envoyer' },
      { name: 'Session', icon: 'calendar', state: ended ? 'done' : j.session ? 'doing' : matched ? 'todo' : 'lock', text: ended ? 'Terminée' : j.session ? 'Programmée' : matched ? 'À programmer' : 'Verrouillée' },
      { name: 'Quiz', icon: 'target', state: j.quiz?.statut === 'VALIDE' ? 'done' : ended ? 'todo' : 'lock', text: j.quiz?.statut === 'VALIDE' ? `Réussi (${j.quiz.score}/3)` : j.quiz?.statut === 'ECHOUE' ? 'Échoué, à refaire' : ended ? 'À passer' : 'Verrouillé' },
    ];
  })();
  return (
    <article className="hm-card hm-wide">
      <header><h3>Skill-exchange</h3><Link to="/skill-exchange">Continuer</Link></header>
      <Status loading={loading} error={error} onRetry={reload}>
        <ol className="hm-steps">
          {steps.map((s, i) => (
            <li key={s.name} className={s.state}>
              <span className="hm-step-ic"><Icon name={s.state === 'lock' ? 'lock' : s.state === 'done' ? 'check' : s.icon} size={18} strokeWidth={s.state === 'done' ? 3 : 2} /></span>
              <div><small>Étape {i + 1}</small><b>{s.name}</b><em>{s.text}</em></div>
            </li>
          ))}
        </ol>
      </Status>
    </article>
  );
}

/* ---------- Gamification : badges ---------- */
function BadgesCard() {
  const ids = getIds();
  const { data, loading, error, reload } = useAsync(async () => {
    const [catalog, mine] = await Promise.all([gami.getBadges(), gami.getMyBadges(ids.studentId)]);
    return { catalog, mine };
  });
  return (
    <article className="hm-card">
      <header><h3>Badges</h3><Link to="/gamification">Tout voir</Link></header>
      <Status loading={loading} error={error} onRetry={reload}>
        {data && (
          <>
            <p className="hm-count"><b>{data.mine.length}</b> / {data.catalog.length} obtenus</p>
            <div className="hm-badges">
              {data.catalog.slice(0, 6).map((b) => {
                const got = data.mine.some((m) => m.badgeId === b.id);
                return <span key={b.id} className={got ? 'got' : ''} title={`${b.name}${got ? '' : ' (verrouillé)'}`}><Icon name={got ? iconFor(b.icon) : 'lock'} size={20} /></span>;
              })}
            </div>
          </>
        )}
      </Status>
    </article>
  );
}

const Dashboard = () => {
  const { data: p, loading, error, reload } = useAsync(() => profiling.getProfile());
  return (
    <AppLayout role="ETUDIANT" title="Accueil" subtitle="Votre parcours d’apprentissage en un coup d’œil.">
      <Status loading={loading} error={error} onRetry={reload}>
        {p && (
          <div className="hm">
            <Hero p={p} />
            <div className="hm-grid">
              <ProfileCard p={p} />
              <SkillsCard />
              <BadgesCard />
              <ExchangeCard />
            </div>
          </div>
        )}
      </Status>
    </AppLayout>
  );
};

export default Dashboard;
