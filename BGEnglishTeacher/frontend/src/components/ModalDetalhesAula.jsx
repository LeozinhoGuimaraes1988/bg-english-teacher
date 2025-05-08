import React, { useState, useEffect } from 'react';
import styles from './ModalDetalhesAula.module.css';

const ModalDetalhesAula = ({ aula, onClose, onSave, readOnly = false }) => {
  const [novaAnotacao, setNovaAnotacao] = useState('');

  useEffect(() => {
    setNovaAnotacao('');
  }, [aula]);

  const handleSave = () => {
    if (novaAnotacao.trim() !== '' && onSave) {
      const nova = {
        data: new Date().toISOString().split('T')[0],
        texto: novaAnotacao,
      };
      onSave(aula.id, nova);
      setNovaAnotacao('');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalLarge}>
        <h2>Detalhes da Aula</h2>
        <table className={styles.modalTable}>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{aula.aluno}</td>
              <td>{formatDate(aula.data)}</td>
              <td>{aula.hora}</td>
              <td>{aula.status}</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.anotacoesSection}>
          <h4>Últimas Anotações</h4>
          <ul>
            {aula.anotacoes && aula.anotacoes.length > 0 ? (
              aula.anotacoes.map((note, index) => (
                <li key={index}>
                  <strong>{formatDate(note.data)}:</strong> {note.texto}
                </li>
              ))
            ) : (
              <li>Sem anotações registradas.</li>
            )}
          </ul>
          {!readOnly && (
            <textarea
              rows="4"
              value={novaAnotacao}
              onChange={(e) => setNovaAnotacao(e.target.value)}
              placeholder="Adicionar nova anotação"
            />
          )}
        </div>

        <div className={styles.modalActions}>
          {!readOnly && (
            <button className={styles.saveButton} onClick={handleSave}>
              Salvar
            </button>
          )}
          <button className={styles.cancelButton} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesAula;
