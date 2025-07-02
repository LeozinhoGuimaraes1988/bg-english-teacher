import { db } from './firebase.js';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';

// Adicionar aluno
export const adicionarAluno = async (alunoData) => {
  try {
    const docRef = await addDoc(collection(db, 'alunos'), alunoData);
    return { id: docRef.id, ...alunoData };
  } catch (error) {
    throw new Error('Erro ao adicionar o aluno' + error.message);
  }
};

// Listar alunos
export const listarAlunos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'alunos'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error('Erro ao listar os alunos' + error.message);
  }
};

// Atualizar aluno
export const atualizarAluno = async (alunoId, alunoData) => {
  try {
    const alunoRef = doc(db, 'alunos', alunoId);
    await updateDoc(alunoRef, alunoData);
    return { id: alunoId, ...alunoData };
  } catch (error) {
    throw new Error('Erro ao atualizar o aluno' + error.message);
  }
};

// Excluir aluno
export const excluirAluno = async (alunoId) => {
  try {
    await deleteDoc(doc(db, 'alunos', alunoId));
    return { success: true };
  } catch (error) {
    throw new Error('Erro ao excluir o aluno' + error.message);
  }
};

export default {
  adicionarAluno,
  listarAlunos,
  atualizarAluno,
  excluirAluno,
};
