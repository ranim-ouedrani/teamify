import { STATUS_LABELS } from '../utils/labels';

/** Gère les 3 états d'une donnée distante : chargement, erreur, vide. */
export default function Status({ loading, error, empty, emptyText = 'Aucune donnée.', onRetry, children }) {
  if (loading) return <div className="state-box">Chargement…</div>;
  if (error) {
    return (
      <div className="state-box state-error">
        <span>{error}</span>
        {onRetry && (
          <button type="button" className="btn-outline" onClick={onRetry}>
            Réessayer
          </button>
        )}
      </div>
    );
  }
  if (empty) return <div className="state-box">{emptyText}</div>;
  return children;
}

/** Pastille de statut de validation d'un profil. */
export function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || { text: status, tone: 'neutral' };
  return <span className={`badge badge-${s.tone}`}>{s.text}</span>;
}
