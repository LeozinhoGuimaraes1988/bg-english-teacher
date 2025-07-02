import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAulas, createAula, updateAula, deleteAula } from '../services/api';

export const AulasContext = createContext();

export const AulasProvider = ({ children }) => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAulas() {
      try {
        const data = await getAulas();
        setAulas(data);
      } catch (error) {
        console.error('Erro ao buscar aulas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAulas();
  }, []);

  const adicionarAula = async (novaAula) => {
    try {
      const aulaCriada = await createAula(novaAula);
      setAulas((prev) => [...prev, aulaCriada]);
    } catch (error) {
      console.error('Erro ao adicionar aula:', error);
    }
  };

  const atualizarAula = async (aulaId, dadosAtualizados) => {
    try {
      const aulaAtualizada = await updateAula(aulaId, dadosAtualizados);
      setAulas((prev) =>
        prev.map((aula) => (aula.id === aulaId ? aulaAtualizada : aula))
      );
    } catch (error) {
      console.error('Erro ao atualizar aula:', error);
    }
  };

  const concluirAula = async (aulaId) => {
    try {
      await updateAula(aulaId, { status: 'Concluída' });
      setAulas((prev) => prev.filter((aula) => aula.id !== aulaId));
    } catch (error) {
      console.error('Erro ao concluir aula:', error);
    }
  };

  const excluirAula = async (aulaId) => {
    try {
      await deleteAula(aulaId);
      setAulas((prev) => prev.filter((aula) => aula.id !== aulaId));
    } catch (error) {
      console.error('Erro ao excluir aula:', error);
    }
  };

  const adicionarAnotacao = (id, novaAnotacao) => {
    setAulas((prev) =>
      prev.map((aula) =>
        aula.id === id
          ? {
              ...aula,
              anotacoes: [...(aula.anotacoes || []), novaAnotacao],
            }
          : aula
      )
    );
  };

  return (
    <AulasContext.Provider
      value={{
        aulas,
        adicionarAula,
        atualizarAula,
        concluirAula,
        excluirAula,
        loading,
        adicionarAnotacao,
      }}
    >
      {children}
    </AulasContext.Provider>
  );
};

export const useAulas = () => useContext(AulasContext);
