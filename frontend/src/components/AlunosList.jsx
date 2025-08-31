// src/components/AlunosList.jsx
import React, { useState } from 'react';
import styles from './AlunosList.module.css';
import { useAlunos } from '../hooks/useAlunos';
import AlunosCard from '../components/AlunosCard'; // certifique-se que o caminho está correto

const AlunosList = ({ alunos, onClose }) => {
  const { excluirAluno } = useAlunos();
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <h2>Alunos Cadastrados</h2>

        <div className={styles.cardContainer}>
          {alunos.map((aluno) => (
            <AlunosCard
              key={aluno.id}
              aluno={aluno}
              expanded={expandedId === aluno.id}
              onToggle={() => handleToggle(aluno.id)}
              onDelete={() => {
                if (
                  window.confirm(
                    `Tem certeza que deseja excluir o aluno "${aluno.nome}"?`
                  )
                ) {
                  excluirAluno(aluno.id);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlunosList;
