import { db } from '../services/firebaseAdmin.js'; // usa o serviço que você já tem

export const getDashboard = async () => {
  try {
    // Total de alunos
    const alunosSnapshot = await db.collection('alunos').get();
    const totalAlunos = alunosSnapshot.size;

    // Hoje (00:00 até 23:59)
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const fimDoDia = new Date(hoje);
    fimDoDia.setHours(23, 59, 59, 999);

    const aulasHojeSnapshot = await db
      .collection('aulas')
      .where('data', '>=', hoje)
      .where('data', '<=', fimDoDia)
      .get();
    const aulasHoje = aulasHojeSnapshot.size;

    // Próximos 7 dias
    const fimDaSemana = new Date(hoje);
    fimDaSemana.setDate(fimDaSemana.getDate() + 7);

    const aulasSemanaSnapshot = await db
      .collection('aulas')
      .where('data', '>=', hoje)
      .where('data', '<=', fimDaSemana)
      .get();
    const aulasSemana = aulasSemanaSnapshot.size;

    // Crescimento mensal
    const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const alunosNovosMesSnapshot = await db
      .collection('alunos')
      .where('dataDeCadastro', '>=', inicioDoMes)
      .get();

    const crescimentoMensal =
      totalAlunos > 0
        ? ((alunosNovosMesSnapshot.size / totalAlunos) * 100).toFixed(1)
        : 0;

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
