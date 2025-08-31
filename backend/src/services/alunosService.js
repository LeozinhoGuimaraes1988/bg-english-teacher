import { db } from './firebase.js';

// Adicionar aluno
export const adicionarAluno = async (alunoData) => {
  try {
    const docRef = await db.collection('alunos').add(alunoData);
    return { id: docRef.id, ...alunoData };
  } catch (error) {
    throw new Error('Erro ao adicionar o aluno: ' + error.message);
  }
};

// Listar alunos
export const listarAlunos = async () => {
  try {
    const snapshot = await db.collection('alunos').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Erro ao listar os alunos: ' + error.message);
  }
};

// Atualizar aluno
export const atualizarAluno = async (alunoId, alunoData) => {
  try {
    await db.collection('alunos').doc(alunoId).update(alunoData);
    return { id: alunoId, ...alunoData };
  } catch (error) {
    throw new Error('Erro ao atualizar o aluno: ' + error.message);
  }
};

// Excluir aluno
export const excluirAluno = async (alunoId) => {
  try {
    await db.collection('alunos').doc(alunoId).delete();
    return { success: true };
  } catch (error) {
    throw new Error('Erro ao excluir o aluno: ' + error.message);
  }
};

export default {
  adicionarAluno,
  listarAlunos,
  atualizarAluno,
  excluirAluno,
};
