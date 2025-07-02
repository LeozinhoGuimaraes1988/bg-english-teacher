import React, { useState } from 'react';
import styles from './NovoAlunoModal.module.css';
import { uploadImagem } from '../utils/uploadImagem';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const NovoAlunoModal = ({ onClose, onSave }) => {
  const [foto, setFoto] = useState(null);

  const schema = Yup.object().shape({
    nome: Yup.string().required('O nome é obrigatório'),
    email: Yup.string()
      .email('E-mail inválido')
      .required('O e-mail é obrigatório'),
    telefone: Yup.string()
      .matches(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, 'Telefone inválido')
      .required('O telefone é obrigatório'),
    nascimento: Yup.string().required('A data de nascimento é obrigatória'),
    endereco: Yup.string().required('O endereço é obrigatório'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    let fotoUrl = null;
    if (foto && typeof foto !== 'string') {
      const idTemporario = Date.now().toString();
      fotoUrl = await uploadImagem(foto, idTemporario);
    }

    const novoAluno = {
      ...data,
      foto: fotoUrl,
    };

    onSave(novoAluno);
    onClose();
    reset();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Novo Aluno</h2>
        <form className={styles.right} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label>Nome Completo:</label>
            <input {...register('nome')} />
            {errors.nome && (
              <p className={styles.error}>{errors.nome.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Data de Nascimento:</label>
            <input type="date" {...register('nascimento')} />
            {errors.nascimento && (
              <p className={styles.error}>{errors.nascimento.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>E-mail:</label>
            <input type="email" {...register('email')} />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Telefone:</label>
            <input type="text" {...register('telefone')} />
            {errors.telefone && (
              <p className={styles.error}>{errors.telefone.message}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Endereço:</label>
            <input type="text" {...register('endereco')} />
            {errors.endereco && (
              <p className={styles.error}>{errors.endereco.message}</p>
            )}
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveButton}>
              Salvar
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoAlunoModal;
