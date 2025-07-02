import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase.js';

export const getDashboard = async () => {
  try {
    // Buscando todos os alunos
    const alunosSnapshot = await getDocs(collection(db, 'alunos'));
    const totalAlunos = alunosSnapshot.size;

    // Buscando aulas do dia
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fimDoDia = new Date(hoje);
    fimDoDia.setHours(23, 59, 59, 999);

    const aulasHojeQuery = query(
      collection(db, 'aulas'),
      where('data', '>=', hoje),
      where('data', '<=', fimDoDia)
    );

    const aulasHojeSnapshot = await getDocs(aulasHojeQuery);
    const aulasHoje = aulasHojeSnapshot.size;

    // Buscando aulas da semana
    const fimDaSemana = new Date(hoje);
    fimDaSemana.setDate(fimDaSemana.getDate() + 7);

    const aulasSemanaQuery = query(
      collection(db, 'aulas'),
      where('data', '>=', hoje),
      where('data', '<=', fimDaSemana)
    );

    const aulasSemanaSnapshot = await getDocs(aulasSemanaQuery);
    const aulasSemana = aulasSemanaSnapshot.size;

    // Calculando crescimento mensal
    const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const alunosNovosMesQuery = query(
      collection(db, 'alunos'),
      where('dataDeCadastro', '>=', inicioDoMes)
    );

    const alunosNovosMesSnapshot = await getDocs(alunosNovosMesQuery);
    const crescimentoMensal =
      totalAlunos > 0
        ? ((alunosNovosMesSnapshot.size / totalAlunos) * 100).toFixed(1)
        : 0;

    // Retornando os dados para o dashboard
    return {
      totalAlunos,
      aulasHoje,
      aulasSemana,
      crescimentoMensal,
    };
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    throw new Error('Erro ao buscar dados do dashboard');
  }
};
