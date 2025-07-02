import React, { useState, useEffect } from 'react';
import styles from './AulasRealizadasPage.module.css';
import ModalDetalhesAula from '../components/ModalDetalhesAula';
import { useAulasRealizadas } from '../hooks/useAulasRealizadas';
import { useAlunos } from '../context/AlunosContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  parseData,
  formatarDataParaInput,
  formatarDataParaExibicao,
} from '../utils/dataUtils';

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

const AulasRealizadas = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedAula, setSelectedAula] = useState(null);
  const { aulasRealizadas } = useAulasRealizadas();
  const { alunos, loading } = useAlunos();

  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

  const openModal = (aula) => {
    setSelectedAula(aula);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAula(null);
  };

  const totalAlunos = new Set(aulasRealizadas.map((a) => a.aluno)).size;

  const aulasFiltradas = aulasRealizadas.filter((aula) => {
    const data = parseData(aula.data);
    return (
      data.getMonth() === mesSelecionado &&
      data.getFullYear() === anoSelecionado
    );
  });

  return (
    <div className={styles['aulas-container']}>
      <h1>{t('realizadas.titulo')}</h1>

      <div className={styles['resumo-superior']}>
        <div className={styles['resumo-card']}>
          {t('realizadas.totalAulas')}: {aulasFiltradas.length}
        </div>
        <div className={styles['resumo-card']}>
          {t('realizadas.totalAlunos')}:{' '}
          {new Set(aulasFiltradas.map((a) => a.aluno)).size}
        </div>
        <div className={styles['resumo-card']}>
          {t('realizadas.tempoTotal')}: {aulasFiltradas.length}h
        </div>
      </div>

      <div className={styles.filtros}>
        <select
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(Number(e.target.value))}
        >
          {meses.map((mes, index) => (
            <option key={index} value={index}>
              {mes}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(Number(e.target.value))}
        />
      </div>

      {loading ? (
        <p>Carregando aulas...</p>
      ) : aulasFiltradas.length === 0 ? (
        <p>Nenhuma aula realizada.</p>
      ) : (
        <table className={styles['aulas-tabela']}>
          <thead>
            <tr>
              <th>{t('aulas.aluno')}</th>
              <th>{t('aulas.data')}</th>
              <th>{t('realizadas.duracao')}</th>
              <th>{t('realizadas.quantidade')}</th>
              <th>{t('realizadas.observacoes')}</th>
              <th>{t('realizadas.status')}</th>
            </tr>
          </thead>
          <tbody>
            {aulasFiltradas.map((aula) => {
              const totalAluno = aulasRealizadas.filter(
                (a) => a.aluno === aula.aluno
              ).length;
              const dadosAluno = alunos.find((a) => a.nome === aula.aluno);
              const pacote = dadosAluno?.pacoteAulas || '-';

              return (
                <tr key={aula.id}>
                  <td>{aula.aluno}</td>
                  <td>{formatarDataParaExibicao(parseData(aula.data))}</td>

                  <td>1h</td>
                  <td>
                    {totalAluno} / {pacote}
                  </td>
                  <td>
                    <button
                      onClick={() => openModal(aula)}
                      className={styles['detalhes-btn']}
                    >
                      {t('aulas.verDetalhes')}
                    </button>
                  </td>
                  <td className={styles['status-concluida']}>
                    {t('aulas.concluida')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className={styles['botoes-acao']}>
        <Link to="/dashboard">
          <button className={styles['voltar-btn']}>
            {t('realizadas.voltar')}
          </button>
        </Link>
      </div>

      {showModal && (
        <ModalDetalhesAula
          aula={selectedAula}
          onClose={closeModal}
          readOnly={true}
        />
      )}
    </div>
  );
};

export default AulasRealizadas;
