import express from 'express';
import {
  adicionarAluno,
  listarAlunos,
  atualizarAluno,
  excluirAluno,
} from '../services/alunosService.js';

const router = express.Router();

// Criar um aluno
router.post('/', async (req, res) => {
  try {
    const aluno = await adicionarAluno(req.body);
    res.status(201).json(aluno);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar aluno' });
  }
});

// Listar todos os alunos
router.get('/', async (req, res) => {
  try {
    const alunos = await listarAlunos();
    res.status(200).json(alunos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar alunos' });
  }
});

// Atualizar aluno
router.put('/:id', async (req, res) => {
  try {
    const aluno = await atualizarAluno(req.params.id, req.body);
    res.status(200).json(aluno);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar aluno' });
  }
});

// Excluir aluno
router.delete('/:id', async (req, res) => {
  try {
    await excluirAluno(req.params.id);
    res.status(200).json({ message: 'Aluno deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar aluno' });
  }
});

export default router;
