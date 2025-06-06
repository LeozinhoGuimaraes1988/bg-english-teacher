import React, { useState } from 'react';
import styles from './FinanceiroPage.module.css';
import ReciboModal from '../components/ReciboModal';
import { Link } from 'react-router-dom';
import { useAlunos } from '../context/AlunosContext';
import { useTranslation } from 'react-i18next';
import { useConfiguracoes } from '../context/ConfiguracoesContext';
import {
  parseData,
  adicionarDias,
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

const FinanceiroPage = () => {
  const { t } = useTranslation();
  const { valorHoraAula } = useConfiguracoes();
  const { alunos, setAlunos, atualizarCampoAluno } = useAlunos();
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [reciboAluno, setReciboAluno] = useState(null);

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);
  const mesQueVem = (mesAtual + 1) % 12;
  const anoProxMes = mesAtual === 11 ? anoAtual + 1 : anoAtual;

  const alunosFiltrados = alunos.filter((aluno) =>
    filtroStatus === 'Todos' ? true : aluno.status === filtroStatus
  );

  const abrirModalRecibo = (aluno) => {
    setReciboAluno(aluno);
  };

  const fecharModalRecibo = () => {
    setReciboAluno(null);
  };

  const alterarStatus = (id, novoStatus) => {
    atualizarCampoAluno(id, { status: novoStatus });
  };

  const alterarUltimoPagamento = (id, novaData) => {
    const proximo = adicionarDias(novaData, 28);
    atualizarCampoAluno(id, {
      ultimoPagamento: novaData,
      proximoPagamento: proximo,
    });
  };

  const calcularValorPacote = (aluno) => {
    const aulas = Number(aluno.pacoteAulas);
    const valor = Number(valorHoraAula);
    if (!isNaN(aulas) && !isNaN(valor)) {
      return (aulas * valor).toFixed(2);
    }
    return '0.00';
  };

  const totalRecebido = alunos
    .filter((a) => {
      const data = parseData(a.ultimoPagamento);
      return (
        a.status === 'Em dia' &&
        data &&
        data.getMonth() === mesAtual &&
        data.getFullYear() === anoAtual
      );
    })
    .reduce((total, a) => total + parseFloat(calcularValorPacote(a)), 0);

  const previsaoRecebimento = alunos
    .filter((a) => {
      const data = parseData(a.proximoPagamento);
      return (
        a.status === 'Aguardando' &&
        data &&
        data.getMonth() === mesQueVem &&
        data.getFullYear() === anoProxMes
      );
    })
    .reduce((total, a) => total + parseFloat(calcularValorPacote(a)), 0);

  const vencidos = alunos.filter((a) => {
    const d = parseData(a.proximoPagamento);
    return a.status !== 'Em dia' && d && d < hoje;
  });

  const pagamentosMesAtual = alunos.filter((a) => {
    const data = parseData(a.ultimoPagamento);
    return (
      a.status === 'Em dia' &&
      data &&
      data.getMonth() === mesSelecionado &&
      data.getFullYear() === anoSelecionado
    );
  });

  return (
    <div className={styles.financeiroContainer}>
      <h1>{t('financeiro.titulo')}</h1>

      <div className={styles.resumoSuperior}>
        <div className={styles.resumoCard}>
          {t('financeiro.totalRecebido')}: R$ {totalRecebido.toFixed(2)}
        </div>
        <div className={styles.resumoCard}>
          {t('financeiro.alunosEmDia')}:{' '}
          {alunos.filter((a) => a.status === 'Em dia').length}
        </div>
        <div className={styles.resumoCard}>
          {t('financeiro.pendentes')}:{' '}
          {alunos.filter((a) => a.status !== 'Em dia').length}
        </div>
        <div className={styles.resumoCard}>
          Previsão de Recebimento: R$ {previsaoRecebimento.toFixed(2)}
        </div>
      </div>

      <div className={styles.filtros}>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="Todos">{t('financeiro.todos')}</option>
          <option value="Em dia">{t('financeiro.emDia')}</option>
          <option value="Aguardando">{t('financeiro.aguardando')}</option>
        </select>
        {/* <button className={styles.exportarBtn}>Exportar PDF/Excel</button> */}
      </div>

      <table className={styles.financeiroTabela}>
        <thead>
          <tr>
            <th>{t('financeiro.aluno')}</th>
            <th>{t('financeiro.numeroAulas')}</th>
            <th>{t('financeiro.valorPacote')}</th>
            <th>{t('financeiro.ultimoPagamento')}</th>
            <th>{t('financeiro.proximoPagamento')}</th>
            <th>{t('financeiro.status')}</th>
            <th>{t('financeiro.acoes')}</th>
          </tr>
        </thead>
        <tbody>
          {alunosFiltrados.map((aluno) => (
            <tr key={aluno.id}>
              <td>{aluno.nome}</td>
              <td>{aluno.pacoteAulas}</td>
              <td>R$ {calcularValorPacote(aluno)}</td>
              <td>
                <input
                  type="date"
                  value={formatarDataParaInput(
                    parseData(aluno.ultimoPagamento)
                  )}
                  onChange={(e) =>
                    alterarUltimoPagamento(aluno.id, e.target.value)
                  }
                />
              </td>
              <td>
                {aluno.proximoPagamento
                  ? formatarDataParaExibicao(parseData(aluno.proximoPagamento))
                  : '-'}
              </td>
              <td>
                <select
                  value={aluno.status || ''}
                  onChange={(e) => alterarStatus(aluno.id, e.target.value)}
                >
                  <option value="Em dia">{t('financeiro.emDia')}</option>
                  <option value="Aguardando">
                    {t('financeiro.aguardando')}
                  </option>
                </select>
              </td>
              <td>
                {aluno.status === 'Em dia' &&
                  aluno.aulas?.split('/')[0] === aluno.aulas?.split('/')[1] && (
                    <button
                      className={styles.reciboBtn}
                      onClick={() => abrirModalRecibo(aluno)}
                    >
                      {t('financeiro.gerarRecibo')}
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.seletorMes}>
        <label>
          Mês:
          <select
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
            className={styles.selectPadrao}
          >
            {meses.map((mes, index) => (
              <option key={index} value={index}>
                {mes}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.year}>
          Ano:
          <input
            type="number"
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
            className={styles.inputAno}
          />
        </label>
      </div>

      <div className={styles.resumoMensal}>
        <h3>Pagamentos Recebidos</h3>
        <table className={styles.tabelaResumoMensal}>
          <thead>
            <tr>
              <th>Mês</th>
              <th>Total Recebido</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {meses[mesSelecionado]}/{anoSelecionado}
              </td>
              <td>
                R${' '}
                {pagamentosMesAtual
                  .reduce(
                    (total, aluno) =>
                      total + parseFloat(calcularValorPacote(aluno)),
                    0
                  )
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Link to="/dashboard">
        <button className={styles.voltarBtn}>{t('financeiro.voltar')}</button>
      </Link>

      {reciboAluno && (
        <ReciboModal aluno={reciboAluno} onClose={fecharModalRecibo} />
      )}
    </div>
  );
};

export default FinanceiroPage;
