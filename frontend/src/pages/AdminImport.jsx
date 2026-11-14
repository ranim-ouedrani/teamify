import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { profilingService as api } from '../services/profilingService';

const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo

// Aperçu rapide côté navigateur (la vraie validation est faite par le backend)
async function readPreview(file) {
  const text = await file.text();
  return text.split(/\r?\n/).filter(Boolean).slice(0, 6).map((l) => l.split(/[;,]/));
}

const AdminImport = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const pick = async (e) => {
    const f = e.target.files?.[0];
    setResult(null);
    setError(null);
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.csv')) return setError('Le fichier doit être au format .csv');
    if (f.size > MAX_SIZE) return setError('Le fichier dépasse 5 Mo.');
    setFile(f);
    setPreview(await readPreview(f));
  };

  const send = async () => {
    setSending(true);
    setError(null);
    try {
      setResult(await api.importStudentsCsv(file));
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout role="ADMINISTRATEUR" title="Import des étudiants" subtitle="Importez la liste des étudiants depuis un fichier CSV.">
      <div className="page-grid">
        <div className="card">
          <h3>Fichier CSV</h3>
          <div className="dropzone">
            <p>Colonnes attendues : <strong>nom, prenom, email, filiere, niveau</strong></p>
            <input type="file" accept=".csv" onChange={pick} />
          </div>

          {preview.length > 0 && (
            <>
              <h4 style={{ margin: '18px 0 8px', fontSize: '0.9rem' }}>Aperçu ({file.name})</h4>
              <div className="table-wrap">
                <table className="table">
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i}>{row.map((c, j) => (i === 0 ? <th key={j}>{c}</th> : <td key={j}>{c}</td>))}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {error && <div className="alert alert-err" style={{ marginTop: 16 }}>{error}</div>}
          <div className="actions">
            <button type="button" className="btn-red" disabled={!file || sending} onClick={send}>
              {sending ? 'Import en cours…' : "Lancer l'import"}
            </button>
          </div>
        </div>

        {result && (
          <div className="card">
            <h3>Résultat de l'import</h3>
            <div className="stats-row" style={{ marginBottom: 16 }}>
              <div className="stat-tile"><span>Importées</span><strong>{result.imported}</strong></div>
              <div className="stat-tile"><span>Rejetées</span><strong>{result.rejected}</strong></div>
            </div>
            {result.errors?.length > 0 && (
              <ul className="checklist">
                {result.errors.map((e) => <li key={e.line}><span>Ligne {e.line}</span><span className="muted">{e.message}</span></li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminImport;
