import React, { useState } from 'react';
import styles from './NovaAulaModal.module.css';
import { useAlunos } from '../context/AlunosContext'; // ✅ import do contexto

const NovaAulaModal = ({ onClose, onSave }) => {
  const { alunos } = useAlunos(); // ✅ busca os alunos já cadastrados

  const [aluno, setAluno] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [tipo, setTipo] = useState('');

  const handleSave = () => {
    const novaAula = {
      aluno, // pode ser nome ou id, dependendo da estrutura
      data,
      hora,
      tipo,
      status: 'Pendente',
    };
    onSave(novaAula);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Nova Aula</h2>

        {/* Aluno */}
        <div className={styles.formGroup}>
          <label>Aluno:</label>
          <select value={aluno} onChange={(e) => setAluno(e.target.value)}>
            <option value="">Selecione o aluno</option>
            {[...alunos]
              .sort((a, b) => a.nome.localeCompare(b.nome))
              .map((a) => (
                <option key={a.id} value={a.nome}>
                  {a.nome}
                </option>
              ))}
          </select>
        </div>

        {/* Data e Hora */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Data:</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Horário:</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>
        </div>

        {/* Tipo de Aula */}
        {/* <div className={styles.formGroup}>
          <label>Tipo de Aula:</label>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Ex: Conversação, Gramática"
          />
        </div> */}

        {/* Botões */}
        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSave}>
            Salvar
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NovaAulaModal;
