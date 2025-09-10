import { api } from './apiBase';

export const fetchAgendamentos = async () => {
  const res = await api('/agendamentos');
  if (!res.ok) throw new Error('Erro ao buscar agendamentos');
  return res.json();
};

export const salvarAgendamento = async (novo) => {
  const res = await api('/agendamentos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novo),
  });
  if (!res.ok) throw new Error('Erro ao salvar agendamento');
  return res.json();
};

export const removerAgendamento = async (id) => {
  const res = await api(`/agendamentos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao remover agendamento');
};
