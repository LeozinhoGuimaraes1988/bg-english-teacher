import { db } from './firebase.js';

// Criar aula
export const createAula = async (aulaData) => {
  try {
    const docRef = await db.collection('aulas').add(aulaData);
    return { id: docRef.id, ...aulaData };
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    throw new Error('Erro ao criar aula');
  }
};

// Listar todas as aulas
export const getAulas = async () => {
  try {
    const snapshot = await db.collection('aulas').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao buscar aulas:', error);
    throw new Error('Erro ao buscar aulas');
  }
};

// Atualizar aula
export const updateAula = async (aulaId, aulaData) => {
  try {
    await db.collection('aulas').doc(aulaId).update(aulaData);
    return { id: aulaId, ...aulaData };
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    throw new Error('Erro ao atualizar aula');
  }
};

// Excluir aula
export const deleteAula = async (aulaId) => {
  try {
    await db.collection('aulas').doc(aulaId).delete();
  } catch (error) {
    console.error('Erro ao excluir aula:', error);
    throw new Error('Erro ao excluir aula');
  }
};

export default { createAula, getAulas, updateAula, deleteAula };
