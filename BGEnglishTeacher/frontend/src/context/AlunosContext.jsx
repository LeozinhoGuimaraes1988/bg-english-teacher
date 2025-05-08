import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAlunos,
  createAluno,
  updateAluno,
  deleteAluno, // ✅ desbloqueado para uso
} from '../services/api';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

export const AlunosContext = createContext();

export const AlunosProvider = ({ children }) => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarAlunos = async () => {
    try {
      const data = await getAlunos();
      setAlunos(data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const adicionarAluno = async (aluno) => {
    const novo = await createAluno(aluno);
    setAlunos((prev) => [...prev, novo]);
  };

  const atualizarAluno = async (id, dados) => {
    const atualizado = await updateAluno(id, dados);
    setAlunos((prev) =>
      prev.map((aluno) => (aluno.id === id ? atualizado : aluno))
    );
  };

  const atualizarCampoAluno = async (id, camposAtualizados) => {
    try {
      await updateAluno(id, camposAtualizados);
      setAlunos((prev) =>
        prev.map((aluno) =>
          aluno.id === id ? { ...aluno, ...camposAtualizados } : aluno
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar campos do aluno:', error);
    }
  };

  const excluirAluno = async (id) => {
    try {
      const aluno = alunos.find((a) => a.id === id);
      if (!aluno) return;

      // 1. Remove do Firestore
      await deleteAluno(id);
      console.log(`[excluirAluno] Aluno ${id} removido do Firestore`);

      // 2. Remove a imagem do Storage (se houver)
      if (aluno.foto) {
        const match = aluno.foto.match(/fotos-alunos\/([^/]+)\/([^?]+)/);
        if (match) {
          const alunoId = match[1];
          const fileName = match[2];
          const imageRef = ref(storage, `fotos-alunos/${alunoId}/${fileName}`);
          await deleteObject(imageRef);
          console.log(`[excluirAluno] Foto ${fileName} removida do Storage`);
        } else {
          console.warn(
            '[excluirAluno] Não foi possível identificar a imagem:',
            aluno.foto
          );
        }
      }

      // 3. Atualiza estado local
      setAlunos((prev) => prev.filter((aluno) => aluno.id !== id));
    } catch (error) {
      console.error('[excluirAluno] Erro ao excluir aluno:', error);
      alert('Erro ao excluir o aluno. Veja o console para detalhes.');
    }
  };

  return (
    <AlunosContext.Provider
      value={{
        alunos,
        loading,
        adicionarAluno,
        atualizarAluno,
        atualizarCampoAluno, // ✅ nova função exportada
        excluirAluno,
        carregarAlunos,
        setAlunos, // se ainda quiser usar manualmente
      }}
    >
      {children}
    </AlunosContext.Provider>
  );
};

export const useAlunos = () => useContext(AlunosContext);
