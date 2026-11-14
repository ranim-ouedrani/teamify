import { useCallback, useEffect, useState } from 'react';

/**
 * Exécute une fonction asynchrone et expose { data, loading, error, reload }.
 * `deps` : relance l'appel quand une dépendance change.
 */
export default function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fn();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({ data: null, loading: false, error: e.message || 'Une erreur est survenue.' });
    }
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run };
}
