import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js'; // ajuste se necessário

const ConfiguracoesContext = createContext();

export const ConfiguracoesProvider = ({ children }) => {
  const [valorHoraAula, setValorHoraAula] = useState(null);
  const [modoEscuro, setModoEscuro] = useState(false);
  const [idioma, setIdioma] = useState('pt');

  // ID do cliente (pode vir do contexto do usuário logado, se necessário)
  const clienteId = 'clienteId'; // substitua se dinâmico

  // Carregar configurações do Firestore e localStorage
  useEffect(() => {
    const fetchConfiguracoes = async () => {
      try {
        const docRef = doc(db, 'configuracoes', clienteId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setValorHoraAula(data.valorHoraPadrao || '');
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      }

      const storedModoEscuro = localStorage.getItem('modoEscuro');
      const storedIdioma = localStorage.getItem('idioma');
      if (storedModoEscuro !== null) setModoEscuro(storedModoEscuro === 'true');
      if (storedIdioma) setIdioma(storedIdioma);
    };

    fetchConfiguracoes();
  }, []);

  // Salvar localmente quando alterar
  useEffect(() => {
    localStorage.setItem('modoEscuro', modoEscuro);
  }, [modoEscuro]);

  useEffect(() => {
    localStorage.setItem('idioma', idioma);
  }, [idioma]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', modoEscuro);
  }, [modoEscuro]);

  // Salvar valor padrão da hora-aula no Firestore
  const atualizarValorHoraAula = async (novoValor) => {
    try {
      setValorHoraAula(novoValor);
      const docRef = doc(db, 'configuracoes', clienteId);
      await setDoc(docRef, { valorHoraPadrao: novoValor }, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar valorHoraPadrao:', error);
    }
  };

  return (
    <ConfiguracoesContext.Provider
      value={{
        valorHoraAula,
        atualizarValorHoraAula,
        modoEscuro,
        setModoEscuro,
        idioma,
        setIdioma,
      }}
    >
      {children}
    </ConfiguracoesContext.Provider>
  );
};

export const useConfiguracoes = () => useContext(ConfiguracoesContext);
