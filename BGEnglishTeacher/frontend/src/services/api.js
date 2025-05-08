const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ALUNOS
export async function getAlunos() {
  const res = await fetch(`${API_URL}/alunos`);
  if (!res.ok) throw new Error('Erro ao buscar alunos');
  return res.json();
}

export async function createAluno(alunoData) {
  const res = await fetch(`${API_URL}/alunos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alunoData),
  });
  if (!res.ok) throw new Error('Erro ao criar aluno');
  return res.json();
}

// AULAS
export async function getAulas() {
  const res = await fetch(`${API_URL}/aulas`);
  if (!res.ok) throw new Error('Erro ao buscar aulas');
  return res.json();
}

export async function createAula(aulaData) {
  const res = await fetch(`${API_URL}/aulas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aulaData),
  });
  if (!res.ok) throw new Error('Erro ao criar aula');
  return res.json();
}

export async function deleteAula(aulaId) {
  const res = await fetch(`${API_URL}/aulas/${aulaId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar aula');
}

// services/api.js
// ✅ Correção:
export const salvarAula = async (aula) => {
  const response = await fetch(`${API_URL}/aulas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(aula),
  });

  if (!response.ok) {
    throw new Error('Erro ao salvar a aula');
  }

  return await response.json();
};

// 🔥 NOVA FUNÇÃO:
export async function updateAula(aulaId, aulaData) {
  const res = await fetch(`${API_URL}/aulas/${aulaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aulaData),
  });
  if (!res.ok) throw new Error('Erro ao atualizar aula');
  return res.json();
}

// Aluno Detalhes
export async function updateAluno(alunoId, dadosAtualizados) {
  const res = await fetch(`${API_URL}/alunos/${alunoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosAtualizados),
  });

  if (!res.ok) throw new Error('Erro ao atualizar aluno');
  return res.json();
}

// Deletar aluno
export async function deleteAluno(alunoId) {
  const res = await fetch(`${API_URL}/alunos/${alunoId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar aluno');
}
