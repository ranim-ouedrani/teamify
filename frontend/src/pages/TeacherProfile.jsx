import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import useAsync from '../hooks/useAsync';
import { teacherService as api } from '../services/teacherService';
import './Groups.css';
import './Profile.css';

// Profil enseignant : identité, modules enseignés, classes attribuées
const TeacherProfile = () => {
  const { data: t, loading, error, reload } = useAsync(() => api.getProfile());
  return (
    <AppLayout role="ENSEIGNANT" title="Mon profil" subtitle="Vos informations, vos modules et vos classes.">
      <Status loading={loading} error={error} onRetry={reload}>
        {t && (
          <div className="pf">
            <aside className="pf-side">
              <div className="pf-avatar">{t.firstName[0]}{t.lastName[0]}</div>
              <h2>{t.firstName} {t.lastName}</h2>
              <p className="muted">{t.grade}</p>
              <span className="badge badge-ok">Enseignant</span>
              <div className="gp-id">
                <div><small>E-mail</small><b>{t.email}</b></div>
                <div><small>Département</small><b>{t.department}</b></div>
                <div><small>Bureau</small><b>{t.office}</b></div>
              </div>
              <p className="muted">Informations fournies par l’administration (lecture seule).</p>
            </aside>
            <section className="pf-main stack">
              <div className="card">
                <h3>Modules enseignés ({t.modules.length})</h3>
                <div className="gp-list">
                  {t.modules.map((m) => (
                    <div className="gp-item" key={m.code}>
                      <span className="gp-code">{m.code}</span>
                      <div><b>{m.name}</b><small>{m.hours} h · classes : {m.classes.join(', ')}</small></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3>Classes attribuées ({t.classes.length})</h3>
                <div className="gp-list">
                  {t.classes.map((c) => (
                    <div className="gp-item" key={c.id}>
                      <span className="gp-code">{c.id}</span>
                      <div><b>{c.level}</b><small>Année {c.year} · {c.students} étudiants · modules : {t.modules.filter((m) => m.classes.includes(c.id)).map((m) => m.code).join(', ')}</small></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}
      </Status>
    </AppLayout>
  );
};
export default TeacherProfile;
