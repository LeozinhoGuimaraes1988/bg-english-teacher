import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import styles from './ProximasAulas.module.css';

const ProximasAulas = () => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const token = localStorage.getItem('token');
        const hoje = new Date().toISOString().split('T')[0];
        const dataFim = new Date();
        dataFim.setDate(dataFim.getDate() + 7);

        const response = await fetch(
          `http://localhost:3000/api/aulas?status=agendada&dataInicio=${hoje}&dataFim=${
            dataFim.toISOString().split('T')[0]
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar aulas');
        }

        const data = await response.json();
        setAulas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAulas();
  }, []);

  if (loading) {
    return <div className={styles.loading}></div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (aulas.length === 0) {
    return (
      <div className={styles.empty}>
        Nenhuma aula agendada para os próximos dias.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {aulas.map((aula) => (
        <div key={aula.id} className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.cardInfo}>
              <div className={styles.avatarContainer}>
                <User className={styles.avatar} />
              </div>
              <div className={styles.details}>
                <h4 className={styles.studentName}>{aula.nomeAluno}</h4>
                <div className={styles.timeInfo}>
                  <span className={styles.dateTime}>
                    <Calendar className={styles.icon} />
                    {new Date(aula.data).toLocaleDateString()}
                  </span>
                  <span className={styles.dateTime}>
                    <Clock className={styles.icon} />
                    {aula.horario}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <select
                className={styles.select}
                value={aula.status}
                onChange={async (e) => {
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(
                      `http://localhost:3000/api/aulas/${aula.id}/status`,
                      {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: e.target.value }),
                      }
                    );

                    if (!response.ok) {
                      throw new Error('Erro ao atualizar status');
                    }

                    setAulas(
                      aulas.map((a) =>
                        a.id === aula.id ? { ...a, status: e.target.value } : a
                      )
                    );
                  } catch (error) {
                    setError('Erro ao atualizar status da aula');
                  }
                }}
              >
                <option value="agendada">Agendada</option>
                <option value="concluida">Concluída</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProximasAulas;
