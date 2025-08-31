import React from 'react';
import { useState, useEffect } from 'react';
import { useAlunos } from '../context/AlunosContext';
import { useAulas } from '../context/AulasContext';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import AlunosList from '../components/AlunosList';

const Home = () => {
  const { usuario, logout } = useAuth();
  const { alunos } = useAlunos();
  const { aulas } = useAulas();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showAlunos, setShowAlunos] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalAlunos: 0,
  });

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

  const hoje = new Date();
  const em5dias = new Date();
  em5dias.setDate(hoje.getDate() + 5);

  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 7);

  const alertas = [];

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

  // Função para lidar com o logout
  const handleLogout = () => {
    const confirm = window.confirm(t('Tem certeza que deseja sair?'));
    if (!confirm) return;

    logout()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Erro ao fazer logout:', error);
        alert(t('home.sairErro'));
      });
  };

  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <h1>{t('home.titulo')}</h1>
        <div className={styles.userInfo}>
          {t('home.logadoComo')}{' '}
          <strong>{usuario.displayName || usuario.email}</strong>
          <button className={styles.logoutButton} onClick={handleLogout}>
            {t('home.sair')}
          </button>
        </div>
      </header>

      {/* Corpo da Home */}
      <main className={styles.main}>
        <h2 className={styles.welcome}>
          {t('home.bemVinda', { nome: usuario.displayName })}
        </h2>
        <p className={styles.subtitle}>{t('home.subtitulo')}</p>

        {/* Grid de Cards */}
        <div className={styles.grid}>
          {showAlunos && (
            <AlunosList alunos={alunos} onClose={() => setShowAlunos(false)} />
          )}
          {/* <Card
            title={t('home.dashboard.titulo')}
            description={t('home.dashboard.descricao')}
            buttonText={t('home.dashboard.botao')}
            onClick={() => navigate('/dashboard')}
          /> */}
          <Card
            title={t('home.alunos.titulo')}
            description={t('home.alunos.descricao')}
            buttonText={t('home.alunos.botao')}
            onClick={() => navigate('/alunos/page')}
          />
          <Card
            title={t('home.calendario.titulo')}
            description={t('home.calendario.descricao')}
            buttonText={t('home.calendario.botao')}
            onClick={() => navigate('/agendamento')}
          />
          <Card
            title={t('home.financeiro.titulo')}
            description={t('home.financeiro.descricao')}
            buttonText={t('home.financeiro.botao')}
            onClick={() => navigate('/financeiro')}
          />
          <Card
            title={t('dashboard.totalAlunos')}
            value={dashboardData.totalAlunos}
            buttonText={t('dashboard.verAlunos')}
            onClick={() => setShowAlunos(true)}
          />
        </div>

        {/* <div className={styles.section}>
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
        </div> */}
      </main>
    </div>
  );
};

// Componente de Card reutilizável
const Card = ({ title, description, buttonText, onClick, value, children }) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>{value}</p>
      {children}
      <button className={styles.cardButton} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default Home;
