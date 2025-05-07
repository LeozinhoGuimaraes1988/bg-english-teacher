// hooks/useAulasRealizadas.jsx
import { useContext } from 'react';
import { AulasRealizadasContext } from '../context/AulasRealizadasContext';

export const useAulasRealizadas = () => {
  const context = useContext(AulasRealizadasContext);
  if (!context) {
    throw new Error(
      'useAulasRealizadas deve ser usado dentro de um AulasRealizadasProvider'
    );
  }
  return context;
};
