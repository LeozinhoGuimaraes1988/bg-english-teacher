// const API_URL =
//   import.meta.env.VITE_API_URL ||
//   (window.location.hostname.includes('web.app') ||
//   window.location.hostname.includes('firebaseapp.com')
//     ? 'https://us-central1-bg-english-teacher.cloudfunctions.net/api'
//     : 'http://localhost:4001/api');

// // ALUNOS
// export async function getAlunos() {
//   const res = await fetch(`${API_URL}/alunos`);
//   if (!res.ok) throw new Error('Erro ao buscar alunos');
//   return res.json();
// }

// export async function createAluno(alunoData) {
//   const res = await fetch(`${API_URL}/alunos`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(alunoData),
//   });
//   if (!res.ok) throw new Error('Erro ao criar aluno');
//   return res.json();
// }

// // AULAS
// export async function getAulas() {
//   const res = await fetch(`${API_URL}/aulas`);
//   if (!res.ok) throw new Error('Erro ao buscar aulas');
//   return res.json();
// }

// export async function createAula(aulaData) {
//   const res = await fetch(`${API_URL}/aulas`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(aulaData),
//   });
//   if (!res.ok) throw new Error('Erro ao criar aula');
//   return res.json();
// }

// export async function deleteAula(aulaId) {
//   const res = await fetch(`${API_URL}/aulas/${aulaId}`, {
//     method: 'DELETE',
//   });
//   if (!res.ok) throw new Error('Erro ao deletar aula');
// }

// // services/api.js
// // ✅ Correção:
// export const salvarAula = async (aula) => {
//   const response = await fetch(`${API_URL}/aulas`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(aula),
//   });

//   if (!response.ok) {
//     throw new Error('Erro ao salvar a aula');
//   }

//   return await response.json();
// };

// // 🔥 NOVA FUNÇÃO:
// export async function updateAula(aulaId, aulaData) {
//   const res = await fetch(`${API_URL}/aulas/${aulaId}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(aulaData),
//   });
//   if (!res.ok) throw new Error('Erro ao atualizar aula');
//   return res.json();
// }

// // Aluno Detalhes
// export async function updateAluno(alunoId, dadosAtualizados) {
//   const res = await fetch(`${API_URL}/alunos/${alunoId}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(dadosAtualizados),
//   });

//   if (!res.ok) throw new Error('Erro ao atualizar aluno');
//   return res.json();
// }

// // Deletar aluno
// export async function deleteAluno(alunoId) {
//   const res = await fetch(`${API_URL}/alunos/${alunoId}`, {
//     method: 'DELETE',
//   });
//   if (!res.ok) throw new Error('Erro ao deletar aluno');
// }

// /* ================== apiBase.js ================== */
// // Decide a base da API checando candidatos até achar um /health ativo.
// export const detectApiBase = async () => {
//   const isLocal = ['localhost', '127.0.0.1', '::1'].includes(
//     window.location.hostname
//   );

//   // Opcional: variáveis de ambiente para overrides
//   const envBase = import.meta?.env?.VITE_API_BASE?.trim();

//   const candidates = [
//     // 1) Override por .env (Vite): VITE_API_BASE="https://seu-render.onrender.com/api"
//     ...(envBase ? [envBase] : []),

//     // 2) Locais (ajuste as portas que você usa no projeto)
//     ...(isLocal
//       ? [
//           'http://localhost:3000/api',
//           'http://localhost:3001/api',
//           'http://localhost:3004/api',
//           'http://localhost:4001/api',
//         ]
//       : []),

//     // 3) Produção: Firebase Hosting + rewrite para Render
//     //    (quando seu front estiver servido pelo Hosting, path relativo funciona)
//     '/api',

//     // 4) Render direto (coloque seu domínio do Render aqui)
//     'https://bg-english-teacher.onrender.com/api',
//   ];

//   const tryBase = async (base, ms = 2000) => {
//     const ctrl = new AbortController();
//     const t = setTimeout(() => ctrl.abort(), ms);
//     try {
//       const res = await fetch(`${base}/health`, {
//         method: 'GET',
//         signal: ctrl.signal,
//         cache: 'no-store',
//         credentials: 'omit',
//       });
//       clearTimeout(t);
//       return res.ok;
//     } catch {
//       clearTimeout(t);
//       return false;
//     }
//   };

//   for (const base of candidates) {
//     // Para evitar travas em dev, o primeiro que responder OK vence
//     if (await tryBase(base)) return base;
//   }

//   // Fallback final: Render
//   return 'https://bg-english-teacher.onrender.com/api';
// };

// // Instância de fetch com base resolvida (prático de usar)
// let _basePromise;
// export const getApiBase = () => {
//   if (!_basePromise) _basePromise = detectApiBase();
//   return _basePromise;
// };

// export async function api(path, options = {}) {
//   const base = await getApiBase();
//   const url = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
//   return fetch(url, options);
// }
/* ================================================= */

import { api } from './apiBase';

// ALUNOS
export async function getAlunos() {
  const res = await api('/alunos');
  if (!res.ok) throw new Error('Erro ao buscar alunos');
  return res.json();
}

export async function createAluno(alunoData) {
  const res = await api('/alunos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alunoData),
  });
  if (!res.ok) throw new Error('Erro ao criar aluno');
  return res.json();
}

// AULAS
export async function getAulas() {
  const res = await api('/aulas');
  if (!res.ok) throw new Error('Erro ao buscar aulas');
  return res.json();
}

export async function createAula(aulaData) {
  const res = await api('/aulas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aulaData),
  });
  if (!res.ok) throw new Error('Erro ao criar aula');
  return res.json();
}

export async function deleteAula(aulaId) {
  const res = await api(`/aulas/${aulaId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar aula');
}

// ✅ Correção de salvar aula
export const salvarAula = async (aula) => {
  const response = await api('/aulas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aula),
  });
  if (!response.ok) {
    throw new Error('Erro ao salvar a aula');
  }
  return await response.json();
};

// 🔥 Nova função update
export async function updateAula(aulaId, aulaData) {
  const res = await api(`/aulas/${aulaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aulaData),
  });
  if (!res.ok) throw new Error('Erro ao atualizar aula');
  return res.json();
}

// Aluno Detalhes
export async function updateAluno(alunoId, dadosAtualizados) {
  const res = await api(`/alunos/${alunoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosAtualizados),
  });
  if (!res.ok) throw new Error('Erro ao atualizar aluno');
  return res.json();
}

// Deletar aluno
export async function deleteAluno(alunoId) {
  const res = await api(`/alunos/${alunoId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar aluno');
}
