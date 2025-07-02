import React, { useState, useEffect } from 'react';
import AlertMessage from '../components/AlertMessage.jsx';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';

const DashboardCard = ({ title, value, icon: Icon, description }) => (
  <div className={styles.card}>
    <div className={styles.cardContent}>
      <div className={styles.cardInfo}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardValue}>{value}</p>
        {description && <p className={styles.cardDescription}>{description}</p>}
      </div>
      <div className={styles.iconWrapper}>
        <Icon className={styles.icon} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalAlunos: 0,
    aulasHoje: 0,
    aulasSemana: 0,
    crescimentoMensal: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error(
            'Token não encontrado. Por favor, faça login novamente.'
          );
        }

        const response = await fetch('http://localhost:3001/api/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }

        if (!response.ok) {
          throw new Error('Erro ao carregar dados do dashboard');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        console.error('Erro completo:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {error && (
        <AlertMessage variant="destructive" className={styles.error}>
          {error}{' '}
        </AlertMessage>
      )}

      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Bem-vindo ao BG English Teacher</p>
      </div>

      <div className={styles.grid}>
        <DashboardCard
          title="Total de Alunos"
          value={dashboardData.totalAlunos}
          icon={Users}
          description="Alunos ativos"
        />

        <DashboardCard
          title="Aulas Hoje"
          value={dashboardData.aulasHoje}
          icon={BookOpen}
          description="Aulas agendadas para hoje"
        />

        <DashboardCard
          title="Aulas na Semana"
          value={dashboardData.aulasSemana}
          icon={Calendar}
          description="Próximos 7 dias"
        />

        <DashboardCard
          title="Crescimento Mensal"
          value={`${dashboardData.crescimentoMensal}%`}
          icon={TrendingUp}
          description="Novos alunos este mês"
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Próximas Aulas</h2>
        <div className={styles.sectionContent}>
          <div className={styles.sectionDivider}>
            <div className={styles.developmentMessage}>
              Em desenvolvimento...
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Atividades Recentes</h2>
        <div className={styles.sectionContent}>
          <div className={styles.sectionDivider}>
            <div className={styles.developmentMessage}>
              Em desenvolvimento...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
