import express from 'express';
import {
  fetchAgendamentos,
  salvarAgendamento,
  removerAgendamento,
} from '../services/agendamentoService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const agendamentos = await fetchAgendamentos();
  res.json(agendamentos);
});

router.post('/', async (req, res) => {
  const novo = req.body;
  const resultado = await salvarAgendamento(novo);
  res.json(resultado);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await removerAgendamento(id);
  res.json({ sucesso: true });
});

export default router;
