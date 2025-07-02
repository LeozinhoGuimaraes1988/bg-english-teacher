import express from 'express';
import {
  createAula,
  updateAula,
  deleteAula,
  getAulas,
} from '../services/aulasService.js';

const router = express.Router();

// Criar uma aula
router.post('/', async (req, res) => {
  try {
    const aula = await createAula(req.body);
    res.status(201).json(aula);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar aula' });
  }
});

// Listar todas as aulas
router.get('/', async (req, res) => {
  try {
    const aulas = await getAulas();
    res.status(200).json(aulas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar aulas' });
  }
});

// Atualizar aula
router.put('/:id', async (req, res) => {
  try {
    const aula = await updateAula(req.params.id, req.body);
    res.status(200).json(aula);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar aula' });
  }
});

// Excluir aula
router.delete('/:id', async (req, res) => {
  try {
    await deleteAula(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar aula' });
  }
});

export default router;
