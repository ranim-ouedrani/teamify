import AppLayout from '../components/AppLayout';

// Page d'attente pour un module dont l'interface n'est pas encore développée.
// À remplacer, module par module, par la vraie page.
const ModulePage = ({ role = 'ETUDIANT', title, subtitle, description }) => (
  <AppLayout role={role} title={title} subtitle={subtitle}>
    <div className="state-box" style={{ flexDirection: 'column' }}>
      <strong style={{ fontSize: '1.05rem', color: 'var(--ink)' }}>Module en cours d'intégration</strong>
      <span>{description}</span>
    </div>
  </AppLayout>
);

export default ModulePage;
