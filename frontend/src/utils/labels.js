// Libellés affichés pour les valeurs renvoyées par le backend.

export const STATUS_LABELS = {
  EN_ATTENTE: { text: 'En attente', tone: 'warn' },
  VALIDE: { text: 'Validé', tone: 'ok' },
  CORRECTION_DEMANDEE: { text: 'Correction demandée', tone: 'err' },
};

export const STYLE_LABELS = {
  visuel: 'Visuel',
  auditif: 'Auditif',
  kinesthesique: 'Kinesthésique',
  lecture: 'Lecture / écriture',
};

export const LEVELS = ['1', '2', '3', '4', '5'].map((v) => ({
  value: v,
  label: v === '1' ? '1ère année' : `${v}ème année`,
}));
