import React, { useState, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import styles from './AgendamentoAula.module.css';
import { useAlunos } from '../context/AlunosContext';
import { useAgendamentos } from '../context/AgendamentosContext';

const AgendamentoAula = () => {
  const { alunos } = useAlunos();
  const { agendamentos, adicionarAgendamento, excluirAgendamento } =
    useAgendamentos();

  const [selectedAlunoId, setSelectedAlunoId] = useState('');
  const [alunosAdicionados, setAlunosAdicionados] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);

  const dragCounter = useRef(0);

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const start = i + 8;
    return `${start.toString().padStart(2, '0')}:00-${start + 1}:00`;
  });

  const days = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const gerarCorAleatoria = () => {
    const cores = [
      '#FFE0B2',
      '#C8E6C9',
      '#BBDEFB',
      '#F8BBD0',
      '#D1C4E9',
      '#FFCCBC',
    ];
    return cores[Math.floor(Math.random() * cores.length)];
  };

  // ---------------- DRAG & DROP ----------------
  const handleDragStart = (e, item, from) => {
    setDraggedItem({ ...item, from });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    setTimeout(() => e.target.classList.add(styles.dragging), 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove(styles.dragging);
    setDraggedItem(null);
    setDragOverCell(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, day, time) => {
    e.preventDefault();
    dragCounter.current++;
    setDragOverCell(`${day}-${time}`);
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) setDragOverCell(null);
  };

  const handleDrop = async (e, day, time) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverCell(null);

    if (!draggedItem) return;

    // 🔹 Impede duplicar se já existe o mesmo aluno no mesmo horário
    const conflito = agendamentos.find(
      (c) =>
        c.day === day &&
        c.time === time &&
        c.alunoId === (draggedItem.alunoId || draggedItem.id)
    );
    if (conflito) return;

    // ✅ Caso 1: mover agendamento existente → remove anterior
    if (draggedItem.from === 'agenda') {
      const agendamentoExistente = agendamentos.find(
        (c) =>
          c.alunoId === (draggedItem.alunoId || draggedItem.id) &&
          c.id === draggedItem.id // garante que é o mesmo agendamento
      );
      if (agendamentoExistente) {
        await excluirAgendamento(agendamentoExistente.id);
      }
    }

    // ✅ Caso 2: arraste vindo da lista → adiciona novo horário
    const novoItem = {
      alunoId: draggedItem.alunoId || draggedItem.id,
      nome: draggedItem.nome,
      day,
      time,
      cor: draggedItem.cor || gerarCorAleatoria(),
    };

    await adicionarAgendamento(novoItem);
  };

  // ---------------- ALUNOS DISPONÍVEIS ----------------
  const handleSelectAluno = (e) => {
    setSelectedAlunoId(e.target.value);
  };

  const handleAdicionarAluno = () => {
    const aluno = alunos.find((a) => a.id === selectedAlunoId);
    if (aluno && !alunosAdicionados.find((a) => a.id === aluno.id)) {
      setAlunosAdicionados((prev) => [...prev, aluno]);
    }
  };

  const removerAluno = (id) => {
    setAlunosAdicionados((prev) => prev.filter((a) => a.id !== id));
  };

  // ---------------- REMOVER AGENDAMENTO ----------------
  const handleRemoveClass = async (id) => {
    await excluirAgendamento(id);
  };

  const getClassForSlot = (day, time) => {
    return agendamentos.find((cls) => cls.day === day && cls.time === time);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Cronograma Semanal Interativo</h3>
      </div>

      <div className={styles.scheduleGrid}>
        <div className={styles.timeSlot}></div>
        {days.map((day) => (
          <div key={day.key} className={styles.dayHeader}>
            {day.label}
          </div>
        ))}

        {timeSlots.map((time) => (
          <React.Fragment key={time}>
            <div className={styles.timeSlot}>{time}</div>
            {days.map((day) => {
              const classItem = getClassForSlot(day.key, time);
              const cellKey = `${day.key}-${time}`;
              const isDragOver = dragOverCell === cellKey;

              return (
                <div
                  key={cellKey}
                  className={`${styles.scheduleCell} ${
                    isDragOver ? styles.dragOver : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, day.key, time)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day.key, time)}
                >
                  {classItem && (
                    <div
                      className={styles.classItem}
                      style={{ backgroundColor: classItem.cor || '#eee' }}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, classItem, 'agenda')
                      }
                      onDragEnd={handleDragEnd}
                    >
                      <div className={styles.classActions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleRemoveClass(classItem.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <strong>{classItem.nome}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className={styles.availableClasses}>
        <h4 className={styles.availableTitle}>Alunos Disponíveis</h4>
        <div className={styles.selectWrapper}>
          <select
            value={selectedAlunoId}
            onChange={handleSelectAluno}
            className={styles.select}
          >
            <option value="">Selecione um aluno</option>
            {alunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </option>
            ))}
          </select>
          <button onClick={handleAdicionarAluno} className={styles.addButton}>
            Adicionar
          </button>
        </div>

        <div className={styles.availableGrid}>
          {alunosAdicionados.map((aluno) => (
            <div
              key={aluno.id}
              className={styles.alunoItem}
              draggable
              onDragStart={(e) =>
                handleDragStart(
                  e,
                  {
                    ...aluno,
                    tipo: 'aluno',
                    cor: gerarCorAleatoria(),
                  },
                  'lista'
                )
              }
              onDragEnd={handleDragEnd}
            >
              <div className={styles.alunoAvatar}>{aluno.nome.charAt(0)}</div>
              <p className={styles.alunoNome}>{aluno.nome}</p>
              <button
                className={styles.iconBtn}
                onClick={() => removerAluno(aluno.id)}
                title="Remover aluno"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgendamentoAula;
