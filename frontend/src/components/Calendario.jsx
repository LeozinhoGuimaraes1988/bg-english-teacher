import React, { useState, useEffect } from 'react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Calendario.module.css';
// import {
//   createCalendarEvent,
//   //updateCalendarEvent,
//   deleteCalendarEvent,
// } from '../../../backend/src/services/googleCalendarService.js';

const Calendario = () => {
  const [aulas, setAulas] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAula, setSelectedAula] = useState(null);

  // Array com os nomes dos meses
  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  // Array com os dias da semana
  const diasSemana = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  useEffect(() => {
    fetchAulas();
  }, [currentDate]);

  const fetchAulas = async () => {
    try {
      const token = localStorage.getItem('token');
      const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const response = await fetch(
        `http://localhost:3000/api/aulas?dataInicio=${
          firstDay.toISOString().split('T')[0]
        }&dataFim=${lastDay.toISOString().split('T')[0]}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Não foi possível carregar as aulas');
      }

      const data = await response.json();
      setAulas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDiasDoMes = () => {
    const primeiroDia = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const ultimoDia = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const dias = [];
    const primeiroDiaSemana = primeiroDia.getDay();

    // Adiciona dias vazios no início
    for (let i = 0; i < primeiroDiaSemana; i++) {
      dias.push(null);
    }

    // Adiciona os dias do mês
    for (let dia = 1; i <= ultimoDia.getDate(); i++) {
      dias.push(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), dia)
      );
    }
    return dias;
  };

  const getAulasNoDia = (dia) => {
    if (!dia) return [];
    return aulas.filter((aula) => {
      const aulaDate = new Date(aula.data);
      return (
        aulaDate.getDate() === dia.getDate() &&
        aulaDate.getMonth() === dia.getMonth() &&
        aulaDate.getFullYear() === dia.getFullYear()
      );
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Agendada':
        return styles.statusAgendada;
      case 'Concluída':
        return styles.statusConcluida;
      case 'Cancelada':
        return styles.statusCancelada;
      default:
        return '';
    }
  };

  const handlePrevMontth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleAgendarAula = async () => {
    try {
      // Primeiro salva no backend
      const response = await api.post('http://localhost:3000/api/aulas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(aulaData),
      });

      if (!response.ok) {
        throw new Error('Erro ao agendar aula');
      }

      const aula = await response.json();

      // Depois cria no Google Calendar
      const googleEvent = await createCalendarEvent(aula);

      // Atualiza a aula com o ID do evento do Google
      await fetch(`http://localhost:3000/api/aulas/${aula.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ googleEventId: googleEvent.id }),
      });

      // Atualiza o estado local
      fetchAulas();
    } catch (error) {
      setError('Erro ao sincronizar com Google Calendar: ' + error.message);
    }
  };

  const handleUpdateAula = async (aulaId, aulaData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/aulas/${aulaId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(aulaData),
        }
      );
      if (!response.ok) {
        throw new Error('Erro ao atualizar aula');
      }
      const aula = await response.json();

      // Atualiza no Google Calendar
      if (aula.googleEventId) {
        await updateCalendarEvent(aula.googleEventId, aula);
      }
      fetchAulas();
    } catch (error) {
      setError('Erro ao atualizar aula: ' + error.message);
    }
  };

  const handleDeleteAula = async (aulaId, googleEventId) => {
    try {
      await fetch(`http://localhost:3000/api/aulas/${aulaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Remove do Google Calendar
      if (googleEventId) {
        await deleteCalendarEvent(googleEventId);
      }
    } catch (error) {
      setError('Erro ao deletar aula: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {error && (
        <Alert variant="destructive" className={styles.error}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className={styles.header}>
        <button onClick={handlePrevMonth} className={styles.navButton}>
          <ChevronLeft className={styles.navIcon} />
        </button>
        <h2 className={styles.monthTitle}>
          {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth} className={styles.navButton}>
          <ChevronRight className={styles.navIcon} />
        </button>
      </div>

      <div className={styles.calendar}>
        {/* Cabeçalho com dias da semana */}
        {diasSemana.map((dia) => (
          <div key={dia} className={styles.weekDay}>
            {dia}
          </div>
        ))}

        {/* Dias do mês */}
        {getDiasDoMes().map((dia, index) => (
          <div
            key={index}
            className={`${styles.day} ${!dia ? styles.emptyDay : ''}`}
          >
            {dia && (
              <>
                <span className={styles.dayNumber}>{dia.getDate()}</span>
                <div className={styles.aulasContainer}>
                  {getAulasNoDia(dia).map((aula) => (
                    <div
                      key={aula.id}
                      className={`${styles.aulaItem} ${getStatusColor(
                        aula.status
                      )}`}
                      onClick={() => setSelectedAula(aula)}
                    >
                      <span className={styles.aulaHorario}>{aula.horario}</span>
                      <span className={styles.aulaAluno}>{aula.nomeAluno}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Modal de detalhes da aula */}
      {selectedAula && (
        <div className={styles.modal} onClick={() => setSelectedAula(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.modalTitle}>Detalhes da Aula</h3>
            <div className={styles.modalInfo}>
              <p>
                <strong>Aluno:</strong> {selectedAula.nomeAluno}
              </p>
              <p>
                <strong>Data:</strong>{' '}
                {new Date(selectedAula.data).toLocaleDateString()}
              </p>
              <p>
                <strong>Horário:</strong> {selectedAula.horario}
              </p>
              <p>
                <strong>Status:</strong> {selectedAula.status}
              </p>
              {selectedAula.observacoes && (
                <p>
                  <strong>Observações:</strong> {selectedAula.observacoes}
                </p>
              )}
            </div>
            <button
              className={styles.modalClose}
              onClick={() => setSelectedAula(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;
