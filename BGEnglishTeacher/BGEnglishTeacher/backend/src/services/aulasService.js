import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase.js';

// Criar aula

export const createAula = async (aulaData) => {
  try {
    const docRef = await addDoc(collection(db, 'aulas'), aulaData);
    return { id: docRef.id, ...aulaData };
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    throw new Error('Erro ao criar aula');
  }
};

// Listar todas as aulas
export const getAulas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'aulas'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao buscar aulas:', error);
    throw new Error('Erro ao buscar aulas');
  }
};

// Atualizar aula
export const updateAula = async (aulaId, aulaData) => {
  try {
    const aulaRef = doc(db, 'aulas', aulaId);
    await updateDoc(aulaRef, aulaData);
    return { id: aulaId, ...aulaData };
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    throw new Error('Erro ao atualizar aula');
  }
};

// Excluir aula
export const deleteAula = async (aulaId) => {
  try {
    await deleteDoc(doc(db, 'aulas', aulaId));
  } catch (error) {
    console.error('Erro ao excluir aula:', error);
    throw new Error('Erro ao excluir aula');
  }
};

export default { createAula, getAulas, updateAula, deleteAula };
