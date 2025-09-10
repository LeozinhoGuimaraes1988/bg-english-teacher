import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import styles from './AtividadesRecentes.module.css';
import { api } from '../services/apiBase'; // << usa o helper

const AtividadesRecentes = () => {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAtividades = async () => {
      setLoading(true);
      setError(null);

      try {
        // datas: hoje e 7 dias atrás (YYYY-MM-DD)
        const hoje = new Date();
        const dataFim = hoje.toISOString().slice(0, 10);
        const dIni = new Date(hoje);
        dIni.setDate(dIni.getDate() - 7);
        const dataInicio = dIni.toISOString().slice(0, 10);

        // se você usa token próprio salvo no localStorage
        const token = localStorage.getItem('token');

        // chamada via helper (ele resolve localhost/Render/Hosting automaticamente)
        const res = await api(
          `/aulas?dataInicio=${dataInicio}&dataFim=${dataFim}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        if (!res.ok) throw new Error('Erro ao buscar atividades.');

        const dados = await res.json();

        // ordena desc por data
        dados.sort((a, b) => new Date(b.data) - new Date(a.data));
        setAtividades(dados);
      } catch (err) {
        setError(err.message || 'Erro inesperado.');
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

  if (loading) return <div className={styles.loading}></div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (atividades.length === 0)
    return (
      <div className={styles.empty}>
        Nenhuma atividade registrada nos últimos dias.
      </div>
    );

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
