import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          <Card
            title={t('home.dashboard.titulo')}
            description={t('home.dashboard.descricao')}
            buttonText={t('home.dashboard.botao')}
            onClick={() => navigate('/dashboard')}
          />
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
            onClick={() => navigate('/calendario')}
          />
          <Card
            title={t('home.financeiro.titulo')}
            description={t('home.financeiro.descricao')}
            buttonText={t('home.financeiro.botao')}
            onClick={() => navigate('/financeiro')}
          />
        </div>
      </main>
    </div>
  );
};

// Componente de Card reutilizável
const Card = ({ title, description, buttonText, onClick }) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className={styles.cardButton} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default Home;
