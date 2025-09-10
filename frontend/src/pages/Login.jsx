import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { api } from '../services/apiBase';
import { auth } from '../firebase/config';
import { loginWithGoogle } from '../authentication/auth';
import { useAuth } from '../context/AuthContext';
import styles from '../pages/Login.module.css';
import googleIcon from '../images/google-icon.png';

const schemaValidation = Yup.object().shape({
  email: Yup.string()
    .email('Digite um e-mail válido')
    .required('O campo Email é obrigatório'),
  password: Yup.string()
    .min(4, 'A senha precisa ter pelo menos 4 caracteres')
    .required('O campo Senha é obrigatório'),
});

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { usuario } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaValidation),
  });

  useEffect(() => {
    if (usuario) {
      navigate('/home');
    }
  }, [usuario, navigate]);

  const onSubmit = async (data) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await api('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Erro ao fazer login');

      await signInWithEmailAndPassword(auth, data.email, data.password);
      localStorage.setItem('token', result.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      alert('Erro ao logar com Google');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>BG English Teacher</h2>
          <p className={styles.subtitle}>Faça login para acessar o sistema</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                {...register('email')}
              />
              {errors.email && (
                <p className={styles.errorText}>{errors.email.message}</p>
              )}
            </div>

            <div className={styles.inputWrapper}>
              <label htmlFor="password" className={styles.label}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                {...register('password')}
              />
              {errors.password && (
                <p className={styles.errorText}>{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              disabled={isLoading}
              className={`${styles.button} ${
                isLoading ? styles.buttonLoading : ''
              }`}
            >
              {isLoading ? 'Entrando...' : 'Entrar com Email'}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className={styles.googleButton}
            >
              <img
                src={googleIcon}
                alt="Google"
                className={styles.googleIcon}
              />
              Entrar com Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
