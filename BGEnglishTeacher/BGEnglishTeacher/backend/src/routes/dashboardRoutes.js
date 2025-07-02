import express from 'express';
import { getDashboard } from '../services/dashboardService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const dados = await getDashboard();
    res.status(200).json(dados);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter dashboard' });
  }
});

export default router;
