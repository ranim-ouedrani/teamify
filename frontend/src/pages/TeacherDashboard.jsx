import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import useAsync from '../hooks/useAsync';
import { profilingService as profiling } from '../services/profilingService';
import { teacherService as api, ASSIGNMENT, avg } from '../services/teacherService';
import './Groups.css';

// Tableau de bord enseignant : modules, classes, avancement des projets, affectation des groupes, profils à valider
const TeacherDashboard = () => {
  const { data, loading, error, reload } = useAsync(async () => {
    const [t, projects, stats] = await Promise.all([api.getProfile(), api.getProjects(), profiling.getTeacherStats()]);
    return { t, projects, stats };
  });

  return (
    <AppLayout role="ENSEIGNANT" title="Tableau de bord" subtitle="Vos classes, vos projets et l’avancement des équipes.">
      <Status loading={loading} error={error} onRetry={reload}>
        {data && (() => {
          const { t, projects, stats } = data;
          const toAssign = projects.filter((p) => p.assignment === 'NON_AFFECTE');
          const students = t.classes.reduce((a, c) => a + c.students, 0);
          return (
            <div className="stack">
              <section className="gp-hero">
                <div style={{ flex: 1 }}>
                  <h2>Bonjour, Pr. {t.lastName}</h2>
                  <p>{toAssign.length ? `${toAssign.length} projet(s) attendent la constitution de leurs équipes.` : 'Toutes vos équipes sont constituées.'}</p>
                </div>
                <Link to="/teacher/teams" className="btn-outline" style={{ textDecoration: 'none' }}>Créer une demande de groupes</Link>
              </section>

              <div className="stats-row">
                <div className="stat-tile"><span>Modules</span><strong>{t.modules.length}</strong></div>
                <div className="stat-tile"><span>Classes</span><strong>{t.classes.length}</strong></div>
                <div className="stat-tile"><span>Étudiants</span><strong>{students}</strong></div>
                <div className="stat-tile"><span>Projets</span><strong>{projects.length}</strong></div>
              </div>

              <div className="page-grid">
                <div className="card">
                  <div className="gp-bar"><h3>Avancement des projets</h3><Link to="/teacher/projects" className="muted">Tout voir</Link></div>
                  {projects.map((p) => (
                    <div className="gp-prow" key={p.id}>
                      <div><b>{p.title}</b><small>{p.classId} · {p.teams.length} équipe(s)</small></div>
                      <div className="bar"><span style={{ width: `${avg(p)}%` }} /></div><em>{avg(p)} %</em>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <h3>Affectation des groupes</h3>
                  {projects.map((p) => { const [l, tone] = ASSIGNMENT[p.assignment]; return (
                    <div className="gp-prow gp-prow-sm" key={p.id}><div><b>{p.classId}</b><small>{p.title}</small></div><span className={`badge badge-${tone}`}>{l}</span></div>
                  ); })}
                </div>

                <div className="card">
                  <h3>Profils étudiants à valider</h3>
                  <p className="muted" style={{ marginBottom: 12 }}>{stats.pending} en attente · {stats.correction} correction(s) demandée(s) · complétion moyenne {stats.averageCompletion} %</p>
                  <div className="bar" style={{ marginBottom: 14 }}><span style={{ width: `${stats.averageCompletion}%` }} /></div>
                  <Link to="/teacher/profiles" className="btn-red" style={{ textDecoration: 'none', display: 'inline-block' }}>Voir les profils</Link>
                </div>
              </div>
            </div>
          );
        })()}
      </Status>
    </AppLayout>
  );
};
export default TeacherDashboard;
