import React from 'react';
import styles from './AlunosCard.module.css';
import { Edit, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AlunosCard = ({ aluno, expanded, onToggle, onDelete }) => {
  const handleExcluir = () => {
    if (
      window.confirm(`Tem certeza que deseja excluir o aluno "${aluno.nome}"?`)
    ) {
      if (typeof onDelete === 'function') {
        onDelete();
      } else {
        console.warn('[AlunosCard] onDelete não é uma função');
        console.log('🔍 onDelete:', onDelete);
        console.log('aluno:', aluno);
        console.log('🔍 typeof onDelete:', typeof onDelete);
      }
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <img src={aluno.foto} alt={aluno.nome} className={styles.avatar} />
        <h3>{aluno.nome}</h3>
        <button className={styles.toggleButton} onClick={onToggle}>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      <div className={`${styles.card} ${expanded ? styles.expanded : ''}`}>
        <div
          className={`${styles.detailsWrapper} ${
            expanded ? styles.detailsOpen : ''
          }`}
        >
          <div className={styles.details}>
            <div className={styles.detailRow}>
              <strong>Data de Nascimento:</strong> {aluno.nascimento}
              {/* <Edit className={styles.editIcon} /> */}
            </div>

            <div className={styles.detailRow}>
              <strong>Idade:</strong> {aluno.idade} anos
              {/* <Edit className={styles.editIcon} /> */}
            </div>

            <div className={styles.detailRow}>
              <strong>Email:</strong> {aluno.email}
              {/* <Edit className={styles.editIcon} /> */}
            </div>

            <div className={styles.detailRow}>
              <strong>Telefone:</strong> {aluno.telefone}
              {/* <Edit className={styles.editIcon} /> */}
            </div>

            <div className={styles.detailRow}>
              <strong>Endereço:</strong> {aluno.endereco}
              {/* <Edit className={styles.editIcon} /> */}
            </div>

            <div className={styles.buttonGroup}>
              <Link to={`/alunos/${aluno.id}`}>
                <button className={styles.detailsButton}>Ver Detalhes</button>
              </Link>
              <button onClick={handleExcluir} className={styles.deleteButton}>
                <Trash2 size={16} /> Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlunosCard;
