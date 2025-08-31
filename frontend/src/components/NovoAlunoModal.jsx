import React, { useState } from 'react';
import { X, User, Mail, Phone, BookOpen } from 'lucide-react';
import styles from './NovoAlunoModal.module.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// import { uploadImagem } from '../utils/uploadImagem';

const schema = Yup.object().shape({
  nome: Yup.string().required('O nome é obrigatório'),
  email: Yup.string()
    .email('E-mail inválido')
    .required('O e-mail é obrigatório'),
  telefone: Yup.string()
    .matches(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, 'Telefone inválido')
    .required('O telefone é obrigatório'),
  // nascimento: Yup.string().required('A data de nascimento é obrigatória'),
  endereco: Yup.string().required('O endereço é obrigatório'),
});

const NovoAlunoModal = ({ student = null, onClose, onSave }) => {
  // const [foto, setFoto] = useState(null);
  const {
    register,
    handleSubmit,
    // setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: student?.nome || '',
      email: student?.email || '',
      telefone: student?.telefone || '',
      // nascimento: student?.nascimento || '',
      endereco: student?.endereco || '',
      nivel: student?.nivel || '',
      pacoteAulas: student?.pacoteAulas || '',
    },
  });

  const onSubmit = async (data) => {
    const novoAluno = {
      ...data,
    };

    onSave(novoAluno);
    reset();
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {student ? 'Editar Aluno' : 'Novo Aluno'}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.sectionIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Informações Pessoais */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeader}>
              <User className={styles.sectionIcon} />
              Informações Pessoais
            </h3>
            <div className={styles.gridContainer}>
              <div className={styles.inputGroup}>
                <label className={`${styles.label} ${styles.required}`}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  {...register('nome')}
                  className={styles.input}
                  placeholder="Digite o nome completo"
                />
                {errors.nome && (
                  <p className={styles.error}>{errors.nome.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeader}>
              <Mail className={styles.sectionIcon} />
              Informações de Contato
            </h3>
            <div className={styles.gridContainer}>
              <div className={styles.inputGroup}>
                <label className={`${styles.label} ${styles.required}`}>
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={styles.input}
                  placeholder="email@exemplo.com"
                />
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
              </div>
              <div className={styles.inputGroup}>
                <label className={`${styles.label} ${styles.required}`}>
                  Telefone
                </label>
                <input
                  type="text"
                  {...register('telefone')}
                  className={styles.input}
                  placeholder="(11) 99999-9999"
                />
                {errors.telefone && (
                  <p className={styles.error}>{errors.telefone.message}</p>
                )}
              </div>
            </div>
            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label className={`${styles.label} ${styles.required}`}>
                Endereço
              </label>
              <input
                type="text"
                {...register('endereco')}
                className={styles.input}
                placeholder="Endereço completo"
              />
              {errors.endereco && (
                <p className={styles.error}>{errors.endereco.message}</p>
              )}
            </div>
          </div>

          {/* Nível e Pacote de Aulas */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeader}>
              <BookOpen className={styles.sectionIcon} />
              Nível e Pacote de Aulas
            </h3>
            <div className={styles.gridContainer}>
              <div className={styles.inputGroup}>
                <label className={`${styles.label} ${styles.required}`}>
                  Nível
                </label>
                <input
                  type="text"
                  {...register('nivel')}
                  className={styles.input}
                  placeholder="Nível"
                />
                {errors.nivel && (
                  <p className={styles.error}>{errors.nivel.message}</p>
                )}
              </div>
              <div className={styles.inputGroup}>
                <label className={`${styles.label} ${styles.required}`}>
                  Pacote de Aulas
                </label>
                <input
                  type="number"
                  {...register('pacoteAulas')}
                  className={styles.input}
                  placeholder="Pacote de Aulas"
                />
                {errors.pacote && (
                  <p className={styles.error}>{errors.pacote.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              {student ? 'Atualizar' : 'Cadastrar'} Aluno
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoAlunoModal;
