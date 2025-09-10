import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '../services/apiBase';

const Register = ({ onRegisterSucess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefone: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem');
      return;
    }
    setIsLoading(true);

    try {
      const response = await api('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          password: formData.password,
          telefone: formData.telefone,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar');
      }

      if (onRegisterSucess) {
        onRegisterSucess(data);
      }
    } catch (error) {
      setError('Erro ao se registrar');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>BG English Teacher</h2>
          <p className={styles.subtitle}>Faça seu cadastro para começar</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className={styles.inputGroup}>
            <div className={styles.inputContainer}>
              <label htmlFor="nome" className={styles.label}>
                Nome Completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                className={styles.input}
                value={formData.nome}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="telefone" className={styles.label}>
                Telefone
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                required
                placeholder="(00) 00000-0000"
                className={styles.input}
                value={formData.telefone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="password" className={styles.label}>
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={styles.input}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={styles.input}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.button} ${
              isLoading ? styles.buttonDisabled : ''
            }`}
          >
            {isLoading ? 'Registrando...' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Register;
