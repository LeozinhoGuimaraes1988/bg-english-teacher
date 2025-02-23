import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import styles from './AtividadesRecentes.module.css';

const AtividadesRecentes = () => {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const token = localStorage.getItem('token'); // Pega token de autenticação
        const dataFim = new Date().toISOString().split('T')[0]; // Data atual em formato YYYY-MM-DD
        const dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - 7); // Data de 7 dias atrás - split('T')[0] pega só a parte da data (remove hora)

        const response = await fetch(
          `http://localhost:3000/api/aulas?dataInicio=${
            dataInicio.toISOString().split('T')[0]
          }&dataFim=${dataFim}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar atividades.');
        }

        const data = await response.json(); // Converte resposta para JSON
        setAtividades(data.sort((a, b) => new Date(b.data) - new Date(a.data)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAtividades();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluida':
        return <CheckCircle className={styles.iconSuccess} />;
      case 'cancelada':
        return <XCircle className={styles.iconError} />;
      default:
        return <Calendar className={styles.iconPending} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'concluida':
        return styles.statusSuccess;
      case 'cancelada':
        return styles.statusError;
      default:
        return styles.statusPending;
    }
  };

  if (loading) {
    return <div className={styles.loading}></div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (atividades.length === 0) {
    return (
      <div className={styles.empty}>
        Nenhuma atividade registrada nos últimos dias.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {atividades.map((atividade) => (
        <div key={atividade.id} className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.statusIcon}>
              {getStatusIcon(atividade.status)}
            </div>
            <div className={styles.details}>
              <div className={styles.header}>
                <h4 className={styles.studentName}>{atividade.nomeAluno}</h4>
                <span className={getStatusClass(atividade.status)}>
                  {atividade.status.charAt(0).toUpperCase() +
                    atividade.status.slice(1)}
                </span>
              </div>
              <div className={styles.timeInfo}>
                <span className={styles.dateTime}>
                  <Calendar className={styles.icon} />
                  {new Date(atividade.data).toLocaleDateString()}
                </span>
                <span className={styles.dateTime}>
                  <Clock className={styles.icon} />
                  {atividade.horario}
                </span>
              </div>
              {atividade.observacoes && (
                <p className={styles.observacoes}>{atividade.observacoes}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AtividadesRecentes;
