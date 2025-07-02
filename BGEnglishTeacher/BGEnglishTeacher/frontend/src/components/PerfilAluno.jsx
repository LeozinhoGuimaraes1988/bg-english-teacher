import React, { useState, useEffect } from 'react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Book, Clock, Calendar, Phone, Mail } from 'lucide-react';
import styles from './PerfilAluno.module.css';

const PerfilAluno = ({ alunoId }) => {
  const [aluno, setAluno] = useState(null);
  const [historicoAulas, setHistoricoAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notas, setNotas] = useState('');
  const [editandoNotas, setEditandoNotas] = useState(false);

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:3001/api/alunos/${alunoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Erro ao carregar dados do aluno');
        }

        const data = await response.json();
        setAluno(data);
        setNotas(data.notas || '');
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchHistoricoAulas = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:3000/api/aulas?alunoId=${alunoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao carregar histórico de aulas');
        }

        const data = await response.json();
        setHistoricoAulas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAluno();
    fetchHistoricoAulas();
  }, [alunoId]);

  const handleSalvarNotas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/alunos/${alunoId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notas }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao salvar notas');
      }
      setEditandoNotas(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className={styles.loading}></div>;
  }

  if (!aluno) {
    return <div className={styles.error}>Aluno não encontrado</div>;
  }

  return (
    <div className={styles.container}>
      {error && (
        <Alert variant="destructive" className={styles.error}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className={styles.header}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarContainer}>
            <User className={styles.avatarIcon} />
          </div>
          <div>
            <h1 className={styles.name}>{aluno.nome}</h1>
            <div className={styles.contactInfo}>
              <span className={styles.contactItem}>
                <Mail className={styles.icon} />
                {aluno.email}
              </span>
              <span className={styles.contactItem}>
                <Phone className={styles.icon} />
                {aluno.telefone}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <Book className={styles.statIcon} />
            <div>
              <h3 className={styles.statLabel}>Total de Aulas</h3>
              <p className={styles.statValue}>{historicoAulas.length}</p>
            </div>
          </div>
          <div className={styles.statItem}>
            <Clock className={styles.statIcon} />
            <div>
              <h3 className={styles.statLabel}>Frequência</h3>
              <p className={styles.statValue}>
                {Math.round(
                  (historicoAulas.filter((aula) => aula.status === 'concluida')
                    .length /
                    historicoAulas.length) *
                    100
                )}
                %
              </p>
            </div>
          </div>
          <div className={styles.statItem}>
            <Calendar className={styles.statIcon} />
            <div>
              <h3 className={styles.statLabel}>Desde</h3>
              <p className={styles.statValue}>
                {new Date(aluno.dataCadastro).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Histórico de Aulas</h2>
          <div className={styles.aulasList}>
            {historicoAulas.map((aula) => (
              <div key={aula.id} className={styles.aulaItem}>
                <div className={styles.aulaHeader}>
                  <span className={styles.aulaData}>
                    {new Date(aula.data).toLocaleDateString()}
                  </span>
                  <span
                    className={`${styles.aulaStatus} ${styles[aula.status]}`}
                  >
                    {aula.status}
                  </span>
                </div>
                <div className={styles.aulaContent}>
                  <span className={styles.aulaHorario}>{aula.horario}</span>
                  {aula.observacoes && (
                    <p className={styles.aulaObs}>{aula.observacoes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.notasHeader}>
            <h2 className={styles.sectionTitle}>Notas e Observações</h2>
            {!editandoNotas ? (
              <button
                onClick={() => setEditandoNotas(true)}
                className={styles.editButton}
              >
                Editar
              </button>
            ) : (
              <button onClick={handleSalvarNotas} className={styles.saveButton}>
                Salvar
              </button>
            )}
          </div>
          {editandoNotas ? (
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className={styles.notasTextarea}
              placeholder="Adicione notas sobre o aluno..."
            />
          ) : (
            <div className={styles.notasContent}>
              {notas || 'Nenhuma nota adicionada'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PerfilAluno;
