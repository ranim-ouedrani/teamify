import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import { Icon } from '../components/Icons';
import useAsync from '../hooks/useAsync';
import { groupService as api, GROUP_STATUS } from '../services/groupService';
import './Groups.css';

const initials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2);
const date = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

const StudentGroups = () => {
  const { data, loading, error, reload } = useAsync(() => api.getMyTeams());
  return (
    <AppLayout role="ETUDIANT" title="Mes équipes" subtitle="Vos groupes de projet, constitués par le moteur intelligent.">
      <Status loading={loading} error={error} onRetry={reload} empty={data && data.length === 0} emptyText="Aucune équipe pour le moment. Votre enseignant n’a pas encore lancé de constitution.">
        <div className="page-grid">
          {data?.map((t) => {
            const [label, tone] = GROUP_STATUS[t.status] || [t.status, 'neutral'];
            const ready = t.members.length > 0;
            return (
              <article className="card gp-mine" key={t.id}>
                <header className="gp-bar">
                  <div><h3>{t.project}</h3><span className="muted">{t.course} · à rendre le {date(t.deadline)}</span></div>
                  <span className={`badge badge-${tone}`}>{label}</span>
                </header>
                {ready ? (
                  <>
                    <div className="gp-mine-name"><Icon name="users" size={18} /> {t.name}</div>
                    <div className="gp-ind"><span>Équilibre</span><div className="bar"><span style={{ width: `${t.balance}%` }} /></div><b>{t.balance} %</b>
                      <span>Diversité</span><div className="bar"><span style={{ width: `${t.diversity}%` }} /></div><b>{t.diversity} %</b></div>
                    {t.members.map((m) => (
                      <div key={m.id} className={`gp-member ${m.me ? 'me' : ''}`}>
                        <span className="gp-av">{initials(m.name)}</span><div><b>{m.name}{m.me && ' (vous)'}</b><small>{m.id}</small></div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="gp-wait"><span className="gp-spin" /><p>Votre enseignant valide la composition des équipes. Vous serez notifié dès la publication.</p></div>
                )}
              </article>
            );
          })}
        </div>
      </Status>
    </AppLayout>
  );
};
export default StudentGroups;
