import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import Status from '../components/Status';
import useAsync from '../hooks/useAsync';
import { profilingService as api } from '../services/profilingService';
import { STYLE_LABELS } from '../utils/labels';

function QuestionForm({ questions, previous }) {
  const [answers, setAnswers] = useState({});
  const [style, setStyle] = useState(previous);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const answered = Object.keys(answers).length;
  const done = answered === questions.length;

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await api.submitQuestionnaire(answers);
      setStyle(res.learningStyle);
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="stack">
      {style && (
        <div className="alert alert-ok">
          Votre style d'apprentissage : <strong>{STYLE_LABELS[style] || style}</strong>. Vous pouvez refaire le questionnaire à tout moment.
        </div>
      )}
      <div className="card">
        <div className="card-title-row">
          <h3>Questionnaire</h3>
          <span className="muted">{answered} / {questions.length} réponses</span>
        </div>
        <div className="bar" style={{ marginBottom: 8 }}><span style={{ width: `${(answered / questions.length) * 100}%` }} /></div>

        {questions.map((q, i) => (
          <div className="question" key={q.id}>
            <h4>{i + 1}. {q.text}</h4>
            <div className="options">
              {q.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`option ${answers[q.id] === o.id ? 'on' : ''}`}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {error && <div className="alert alert-err">{error}</div>}
        <div className="actions">
          <button type="button" className="btn-red" onClick={submit} disabled={!done || sending}>
            {sending ? 'Envoi…' : 'Valider mes réponses'}
          </button>
        </div>
      </div>
    </div>
  );
}

const Questionnaire = () => {
  const { data, loading, error, reload } = useAsync(() => api.getQuestionnaire());

  return (
    <AppLayout role="ETUDIANT" title="Style d'apprentissage" subtitle="Répondez à quelques questions pour identifier votre façon d'apprendre.">
      <Status loading={loading} error={error} onRetry={reload} empty={data && data.questions.length === 0} emptyText="Aucune question disponible.">
        {data && <QuestionForm questions={data.questions} previous={data.learningStyle} />}
      </Status>
    </AppLayout>
  );
};

export default Questionnaire;
