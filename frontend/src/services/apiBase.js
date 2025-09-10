/* ================== apiBase.js ================== */
// Decide a base da API checando candidatos até achar um /health ativo.
export const detectApiBase = async () => {
  const isLocal = ['localhost', '127.0.0.1', '::1'].includes(
    window.location.hostname
  );

  // Opcional: variáveis de ambiente para overrides
  const envBase = import.meta?.env?.VITE_API_BASE?.trim();

  const candidates = [
    ...(envBase ? [envBase] : []),

    // Locais
    ...(isLocal
      ? [
          'http://localhost:3000/api',
          'http://localhost:3001/api',
          'http://localhost:3004/api',
          'http://localhost:4001/api',
        ]
      : []),

    // Produção (Firebase Hosting redireciona para Render)
    '/api',

    // Render direto
    'https://bg-english-teacher.onrender.com/api',
  ];

  const tryBase = async (base, ms = 2000) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(`${base}/health`, {
        method: 'GET',
        signal: ctrl.signal,
        cache: 'no-store',
        credentials: 'omit',
      });
      clearTimeout(t);
      return res.ok;
    } catch {
      clearTimeout(t);
      return false;
    }
  };

  for (const base of candidates) {
    if (await tryBase(base)) return base;
  }

  // Fallback final
  return 'https://bg-english-teacher.onrender.com/api';
};

let _basePromise;
export const getApiBase = () => {
  if (!_basePromise) _basePromise = detectApiBase();
  return _basePromise;
};

export async function api(path, options = {}) {
  const base = await getApiBase();
  const url = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
  return fetch(url, options);
}
/* ================================================= */
