import { useContext } from 'react';
import { AlunosContext } from '../context/AlunosContext';

export const useAlunos = () => {
  const context = useContext(AlunosContext);

  if (!context) {
    throw new Error('useAlunos deve ser usado dentro de um AlunosProvider');
  }

  return context;
};
