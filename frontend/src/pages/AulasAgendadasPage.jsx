// AulasAgendadasPage.jsx
import React, { useState } from 'react';
import styles from './AulasAgendadasPage.module.css';
import ModalDetalhesAula from '../components/ModalDetalhesAula';
import NovaAulaModal from '../components/NovaAulaModal';
import { useAulas } from '../hooks/useAulas.jsx';
import { useAulasRealizadas } from '../hooks/useAulasRealizadas';
import { useTranslation } from 'react-i18next';
import {
  parseData,
  adicionarDias,
  formatarDataParaInput,
  formatarDataParaExibicao,
} from '../utils/dataUtils';

const AulasAgendadasPage = () => {
  const { t } = useTranslation();
  const { aulas, adicionarAula, atualizarAula, excluirAula } = useAulas();
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showDetalhesModal, setShowDetalhesModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [showNovaAulaModal, setShowNovaAulaModal] = useState(false);
  const { adicionarAulaRealizada } = useAulasRealizadas();

  const handleEditClick = (aula) => {
    setEditId(aula.id);
    setEditFormData({ ...aula });
  };

  const handleCancelClick = () => {
    setEditId(null);
  };

  const handleSaveClick = async () => {
    if (editFormData.status === 'Concluída') {
      const confirm = window.confirm('Deseja marcar esta aula como concluída?');
      if (confirm) {
        const aulaComAnotacoes = aulas.find((a) => a.id === editId);
        if (aulaComAnotacoes) {
          await adicionarAulaRealizada({
            ...aulaComAnotacoes,
            status: 'Concluída',
          });
          await excluirAula(editId);
          setEditId(null);
          return;
        }
      }
    } else {
      await atualizarAula(editId, editFormData);
      setEditId(null);
    }
  };

  const handleDeleteClick = async (id) => {
    const confirm = window.confirm('Deseja excluir esta aula?');
    if (confirm) await excluirAula(id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleDetailsClick = (aula) => {
    setModalData({ ...aula });
    setShowDetalhesModal(true);
  };

  const handleNovaAulaSave = (novaAula) => {
    adicionarAula(novaAula);
  };

  const handleSaveAnotacao = async (id, novaAnotacao) => {
    const aula = aulas.find((a) => a.id === id);
    if (!aula) return;

    const novasAnotacoes = [...(aula.anotacoes || []), novaAnotacao];
    const aulaAtualizada = { ...aula, anotacoes: novasAnotacoes };
    await atualizarAula(id, aulaAtualizada);
    setModalData(aulaAtualizada);
  };

  const aulasFiltradas = aulas.filter((aula) => aula.status !== 'Concluída');

  return (
    <div className={styles.container}>
      <h1>{t('aulas.tituloAgendadas')}</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t('aulas.aluno')}</th>
            <th>{t('aulas.data')}</th>
            <th>{t('aulas.horario')}</th>
            <th>{t('aulas.status')}</th>
            <th>{t('aulas.acoes')}</th>
          </tr>
        </thead>
        <tbody>
          {aulasFiltradas.map((aula) => (
            <tr key={aula.id}>
              <td>
                {editId === aula.id ? (
                  <input
                    type="text"
                    name="aluno"
                    value={editFormData.aluno}
                    onChange={handleInputChange}
                  />
                ) : (
                  aula.aluno
                )}
              </td>
              <td>
                {editId === aula.id ? (
                  <input
                    type="date"
                    name="data"
                    value={formatarDataParaInput(parseData(editFormData.data))}
                    onChange={handleInputChange}
                  />
                ) : (
                  formatarDataParaExibicao(parseData(aula.data))
                )}
              </td>
              <td>
                {editId === aula.id ? (
                  <input
                    type="time"
                    name="hora"
                    value={editFormData.hora}
                    onChange={handleInputChange}
                  />
                ) : (
                  aula.hora
                )}
              </td>
              <td>
                {editId === aula.id ? (
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Confirmada">{t('aulas.confirmada')}</option>
                    <option value="Pendente">{t('aulas.pendente')}</option>
                    <option value="Cancelada">{t('aulas.cancelada')}</option>
                    <option value="Concluída">{t('aulas.concluida')}</option>
                  </select>
                ) : (
                  <span
                    className={`${styles.status} ${
                      styles[aula.status.toLowerCase()]
                    }`}
                  >
                    {aula.status}
                  </span>
                )}
              </td>
              <td>
                {editId === aula.id ? (
                  <>
                    <button onClick={handleSaveClick}>
                      {t('aulas.salvar')}
                    </button>
                    <button onClick={handleCancelClick}>
                      {t('aulas.cancelar')}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(aula)}>
                      {t('aulas.editar')}
                    </button>
                    <button onClick={() => handleDetailsClick(aula)}>
                      {t('aulas.detalhes')}
                    </button>
                    <button onClick={() => handleDeleteClick(aula.id)}>
                      {t('aulas.excluir')}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.botoesAbaixoTabela}>
        <button
          className={styles.voltarDashboard}
          onClick={() => (window.location.href = '/dashboard')}
        >
          {t('aulas.voltarDashboard')}
        </button>
        <button onClick={() => (window.location.href = '/aulas-realizadas')}>
          {t('aulas.verRealizadas')}
        </button>
      </div>

      {showDetalhesModal && (
        <ModalDetalhesAula
          aula={modalData}
          onClose={() => setShowDetalhesModal(false)}
          onSave={handleSaveAnotacao}
        />
      )}

      {showNovaAulaModal && (
        <NovaAulaModal
          onClose={() => setShowNovaAulaModal(false)}
          onSave={handleNovaAulaSave}
        />
      )}
    </div>
  );
};

export default AulasAgendadasPage;
