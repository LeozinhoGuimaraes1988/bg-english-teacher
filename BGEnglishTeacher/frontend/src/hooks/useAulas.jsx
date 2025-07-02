import { useContext } from 'react';
import { AulasContext } from '../context/AulasContext';

export const useAulas = () => {
  const context = useContext(AulasContext);
  if (!context) {
    throw new Error('useAulas deve ser usado dentro de um AulasProvider');
  }
  return context;
};
