import React, { useState, useEffect } from 'react';
import { useAlunos } from '../context/AlunosContext';
import { useAulas } from '../context/AulasContext';
import { Users, BookOpen, Calendar, BarChart3 } from 'lucide-react';
import AlunosList from '../components/AlunosList';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const { alunos } = useAlunos();
  const { aulas } = useAulas();
  const [showAlunos, setShowAlunos] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalAlunos: 0,
    aulasAgendadas: 0,
    aulasRealizadas: 0,
  });

  const hoje = new Date();
  const em5dias = new Date();
  em5dias.setDate(hoje.getDate() + 5);

  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 7);

  useEffect(() => {
    const agendadas = aulas.filter(
      (a) => a.status?.toLowerCase() === 'pendente'
    ).length;

    const realizadasSemana = aulas.filter((a) => {
      const data = new Date(a.data);
      return (
        a.status?.toLowerCase() === 'concluída' &&
        data >= seteDiasAtras &&
        data <= hoje
      );
    }).length;

    setDashboardData({
      totalAlunos: alunos.length,
      aulasAgendadas: agendadas,
      aulasRealizadas: realizadasSemana,
    });
  }, [alunos, aulas]);

  const alertas = [];

  // Aulas agendadas nos próximos 5 dias
  aulas
    .filter((a) => {
      const data = new Date(a.data);
      return (
        a.status?.toLowerCase() === 'pendente' &&
        data >= hoje &&
        data <= em5dias
      );
    })
    .forEach((aula, aluno) => {
      alertas.push({
        tipo: 'aula',
        mensagem: `📘 Aula agendada para o aluno ${aula.aluno} em ${new Date(
          aula.data
        ).toLocaleDateString()} às ${aula.hora}`,
      });
    });

  alunos.forEach((aluno) => {
    if (!aluno.proximoPagamento) return;

    const dataPagamento = new Date(aluno.proximoPagamento);
    const diasRestantes = Math.ceil(
      (dataPagamento - hoje) / (1000 * 60 * 60 * 24)
    );

    if (diasRestantes < 0) {
      alertas.push({
        tipo: 'vencido',
        mensagem: `⚠️ Pagamento vencido do aluno ${
          aluno.nome
        } (vencia em ${dataPagamento.toLocaleDateString()})`,
      });
    } else if (diasRestantes <= 5) {
      alertas.push({
        tipo: 'aviso',
        mensagem: `💸 Pagamento próximo do aluno ${
          aluno.nome
        } (vence em ${dataPagamento.toLocaleDateString()})`,
      });
    }
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('dashboard.titulo')}</h1>
      </header>

      {showAlunos && (
        <AlunosList alunos={alunos} onClose={() => setShowAlunos(false)} />
      )}

      <div className={styles.grid}>
        <DashboardCard
          title={t('dashboard.totalAlunos')}
          value={dashboardData.totalAlunos}
          icon={Users}
        >
          <button className={styles.button} onClick={() => setShowAlunos(true)}>
            {t('dashboard.verAlunos')}
          </button>
        </DashboardCard>
        <DashboardCard
          title={t('dashboard.aulasAgendadas')}
          value={dashboardData.aulasAgendadas}
          icon={BookOpen}
        >
          <Link to="/aulas-agendadas">
            <button className={styles.button}>{t('dashboard.verAulas')}</button>
          </Link>
        </DashboardCard>
        <DashboardCard
          title={t('dashboard.aulasRealizadasSemana')}
          value={dashboardData.aulasRealizadas}
          icon={Calendar}
        >
          <Link to="/aulas-realizadas">
            <button className={styles.button}>{t('dashboard.verAulas')}</button>
          </Link>
        </DashboardCard>
        <DashboardCard
          title={t('dashboard.financeiro')}
          value=""
          icon={BarChart3}
        >
          <Link to="/financeiro">
            <button className={styles.button}>
              {t('dashboard.verFinanceiro')}
            </button>
          </Link>
        </DashboardCard>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Fica ligada!</h2>
        {alertas.length === 0 ? (
          <div className={styles.alertBox}>
            <p className={styles.semAulas}>Nenhum alerta no momento</p>
          </div>
        ) : (
          <ul className={styles.aulasLista}>
            {alertas.map((alerta, index) => (
              <li key={index} className={styles.aulaItem}>
                {alerta.mensagem}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon: Icon, children }) => (
  <div className={styles.card}>
    <div className={styles.cardInfo}>
      <h3>{title}</h3>
      <p>{value}</p>
      {children && <div className={styles.children}>{children}</div>}
    </div>
    <Icon className={styles.icon} />
  </div>
);

export default Dashboard;
