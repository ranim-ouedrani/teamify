import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import useAsync from '../hooks/useAsync';
import { teacherService as api, ASSIGNMENT, avg } from '../services/teacherService';
import './Groups.css';

const fmt = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

// Projets pédagogiques : affectation des groupes et avancement de chaque équipe
const TeacherProjects = () => {
  const { data, loading, error, reload } = useAsync(() => api.getProjects());
  return (
    <AppLayout role="ENSEIGNANT" title="Projets & avancement" subtitle="Affectation des groupes et progression des équipes.">
      <Status loading={loading} error={error} onRetry={reload} empty={data && data.length === 0} emptyText="Aucun projet pour le moment.">
        <div className="stack">
          {data?.map((p) => {
            const [label, tone] = ASSIGNMENT[p.assignment];
            return (
              <article className="card" key={p.id}>
                <header className="gp-bar">
                  <div><h3>{p.title}</h3><span className="muted">{p.module} · classe {p.classId} · {p.teamSize} étudiants/équipe · à rendre le {fmt(p.deadline)}</span></div>
                  <div className="gp-actions"><span className={`badge badge-${tone}`}>{label}</span>
                    {p.assignment === 'NON_AFFECTE' && <Link to="/teacher/teams" className="btn-red" style={{ textDecoration: 'none' }}>Constituer les équipes</Link>}</div>
                </header>
                {p.teams.length === 0 ? <p className="muted">Aucune équipe : lancez la constitution automatique pour affecter les étudiants.</p> : (
                  <>
                    <div className="gp-prow"><b>Avancement global</b><div className="bar"><span style={{ width: `${avg(p)}%` }} /></div><em>{avg(p)} %</em></div>
                    <div className="gp-teams">
                      {p.teams.map((t) => (
                        <div className="gp-team" key={t.name}>
                          <header><h4>{t.name}</h4><span className={`badge ${t.progress >= 60 ? 'badge-ok' : t.progress >= 40 ? 'badge-warn' : 'badge-err'}`}>{t.progress >= 60 ? 'Dans les temps' : t.progress >= 40 ? 'À surveiller' : 'En retard'}</span></header>
                          <div className="bar"><span style={{ width: `${t.progress}%` }} /></div>
                          <p className="muted" style={{ marginTop: 8 }}>{t.progress} % · {t.task}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>
      </Status>
    </AppLayout>
  );
};
export default TeacherProjects;
