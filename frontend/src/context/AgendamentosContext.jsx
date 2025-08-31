import { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchAgendamentos,
  salvarAgendamento,
  removerAgendamento,
} from '../services/agendamentoApi.js';

const AgendamentosContext = createContext();

export const AgendamentosProvider = ({ children }) => {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    const data = await fetchAgendamentos();
    setAgendamentos(data);
  };

  const adicionarAgendamento = async (novo) => {
    await salvarAgendamento(novo);
    carregarAgendamentos();
  };

  const excluirAgendamento = async (id) => {
    await removerAgendamento(id);
    carregarAgendamentos();
  };

  return (
    <AgendamentosContext.Provider
      value={{ agendamentos, adicionarAgendamento, excluirAgendamento }}
    >
      {children}
    </AgendamentosContext.Provider>
  );
};

export const useAgendamentos = () => useContext(AgendamentosContext);
