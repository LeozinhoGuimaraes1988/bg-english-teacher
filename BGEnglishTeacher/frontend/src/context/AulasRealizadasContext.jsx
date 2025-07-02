// context/AulasRealizadasContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getAulas, salvarAula } from '../services/api';

export const AulasRealizadasContext = createContext();

export const AulasRealizadasProvider = ({ children }) => {
  const [aulasRealizadas, setAulasRealizadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAulas() {
      try {
        const data = await getAulas();
        const concluidas = data.filter((aula) => aula.status === 'Concluída');
        setAulasRealizadas(concluidas);
      } catch (error) {
        console.error('Erro ao buscar aulas realizadas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAulas();
  }, []);

  const adicionarAulaRealizada = async (aula) => {
    try {
      await salvarAula(aula); // Salva no back-end (com status: Concluída)
      setAulasRealizadas((prev) => [...prev, aula]); // Atualiza o front
    } catch (error) {
      console.error('Erro ao salvar aula realizada:', error);
    }
  };

  return (
    <AulasRealizadasContext.Provider
      value={{ aulasRealizadas, adicionarAulaRealizada, loading }}
    >
      {children}
    </AulasRealizadasContext.Provider>
  );
};
