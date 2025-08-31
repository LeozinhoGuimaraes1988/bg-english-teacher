import { db } from './firebase.js';

export const fetchAgendamentos = async () => {
  const snapshot = await db.collection('agendamentos').get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const salvarAgendamento = async (agendamento) => {
  const docRef = await db.collection('agendamentos').add(agendamento);
  return { id: docRef.id, ...agendamento };
};

export const removerAgendamento = async (id) => {
  await db.collection('agendamentos').doc(id).delete();
};
