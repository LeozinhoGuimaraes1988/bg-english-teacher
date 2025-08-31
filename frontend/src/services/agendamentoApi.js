import axios from 'axios';

const API_URL = 'http://localhost:4001/api/agendamentos'; // ajuste se usar outra porta

export const fetchAgendamentos = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const salvarAgendamento = async (novo) => {
  const response = await axios.post(API_URL, novo);
  return response.data;
};

export const removerAgendamento = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
