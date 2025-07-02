import React, { useState } from 'react';
import AlunosCard from '../components/AlunosCard';
import styles from './AlunosPage.module.css';
// import { useAlunos } from '../context/AlunosContext';
import { useAlunos } from '../hooks/useAlunos';

const AlunosPage = () => {
  const { alunos, loading } = useAlunos();
  const { excluirAluno } = useAlunos();
  const [expandedCard, setExpandedCard] = useState(null); // guarda o ID do card aberto

  const handleToggle = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id)); // fecha se clicar novamente
  };

  return (
    <div className={styles.container}>
      <h1>Lista de Alunos</h1>
      <div className={styles.grid}>
        {loading ? (
          <p>Carregando alunos...</p>
        ) : alunos.length === 0 ? (
          <p>Nenhum aluno cadastrado.</p>
        ) : (
          alunos.map((aluno) => (
            <AlunosCard
              key={aluno.id}
              aluno={aluno}
              expanded={expandedCard === aluno.id}
              onToggle={() => handleToggle(aluno.id)}
              onDelete={() => {
                const confirmacao = window.confirm(
                  `Tem certeza que deseja excluir o aluno "${aluno.nome}"?`
                );
                if (confirmacao) {
                  excluirAluno(aluno.id, aluno.foto);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AlunosPage;
