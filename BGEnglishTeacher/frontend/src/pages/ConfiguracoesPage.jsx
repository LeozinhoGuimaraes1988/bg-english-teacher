import React, { useEffect, useState } from 'react';
import styles from './ConfiguracoesPage.module.css';
import { useConfiguracoes } from '../context/ConfiguracoesContext';
import { useTranslation } from 'react-i18next';

const ConfiguracoesPage = () => {
  const {
    valorHoraAula,
    atualizarValorHoraAula,
    modoEscuro,
    setModoEscuro,
    idioma,
    setIdioma,
  } = useConfiguracoes();

  const [valor, setValor] = useState(valorHoraAula || '');
  const [diaPagamento, setDiaPagamento] = useState('10');
  const [mensagem, setMensagem] = useState('');
  const [frequencia, setFrequencia] = useState('2x');

  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(idioma);
  }, [idioma, i18n]);

  const handleSalvarHoraAula = (e) => {
    e.preventDefault();
    atualizarValorHoraAula(parseFloat(valor));
    alert('Valor da hora-aula salvo com sucesso!');
  };

  useEffect(() => {
    if (valorHoraAula !== null) {
      setValor(valorHoraAula);
    }
  }, [valorHoraAula]);

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>{t('configuracoes.titulo')}</h1>

      {/* SEÇÃO FINANCEIRO */}
      <section className={styles.secao}>
        <h2>🧾 {t('configuracoes.financeiro')}</h2>
        <form onSubmit={handleSalvarHoraAula} className={styles.formulario}>
          <label>{t('configuracoes.valorHora')}:</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
          <button type="submit">{t('configuracoes.salvar')}</button>
        </form>
      </section>

      {/* SEÇÃO APARÊNCIA */}
      <section className={styles.secao}>
        <h2>🎨 {t('configuracoes.aparencia')}</h2>

        <div className={styles.formulario}>
          <label>
            <input
              type="checkbox"
              checked={modoEscuro}
              onChange={() => setModoEscuro(!modoEscuro)}
            />
            {t('configuracoes.modoEscuro')}
          </label>
        </div>

        <div className={styles.formulario}>
          <label>{t('configuracoes.mensagemBoasVindas')}:</label>
          <input
            type="text"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Ex: Vamos fazer deste mês o melhor!"
          />
        </div>

        <div className={styles.formulario}>
          <label>{t('configuracoes.logo')}:</label>
          <input type="file" disabled />
        </div>
      </section>

      {/* SEÇÃO IDIOMA E REGIONALIZAÇÃO */}
      <section className={styles.secao}>
        <h2>🌍 {t('configuracoes.idioma')}</h2>

        <div className={styles.formulario}>
          <label>{t('configuracoes.idioma')}:</label>
          <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
        </div>
      </section>
    </div>
  );
};

export default ConfiguracoesPage;
