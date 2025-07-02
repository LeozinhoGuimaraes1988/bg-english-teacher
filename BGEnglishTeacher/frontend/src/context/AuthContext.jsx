// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email, senha) =>
    signInWithEmailAndPassword(auth, email, senha);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {!carregando && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
