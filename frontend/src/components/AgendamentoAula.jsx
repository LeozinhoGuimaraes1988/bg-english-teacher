import React, { useState, useEffect } from 'react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock } from 'lucide-react';
import styles from './AgendamentoAula.module.css';
// import apiClient from '../../../src/services/apiClient.js';

const AgendamentoAula = () => {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    alunoId: '',
    data: '',
    horario: '',
    recorrente: false,
    observacoes: '',
  });

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await apiClient.get('/alunos');
        setAlunos(response.data);
      } catch (err) {
        const errorMessage =
          err.response?.data.message || 'Erro ao carregar lista de alunos';
        setError(errorMessage);
      }
    };
    fetchAlunos();
  }, []);

  // Função para validar os dados do formulário
  const validadeForm = () => {
    // Verificar se os campos estão preenchidos
    if (!formData.alunoId) {
      setError('Selecione um aluno');
      return false;
    }

    if (!formData.data) {
      setError('Selecione uma data');
      return false;
    }

    if (!formData.horario) {
      setError('Selecione um horário');
      return false;
    }
    return true;
  };

  //Função para envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validadeForm()) return; // Chama a validação antes de enviar

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiClient.post('/aulas', formData);

      setSuccess('Aula agendada com sucesso!');
      setFormData({
        alunoId: '',
        data: '',
        horario: '',
        recorrente: false,
        observacoes: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao agendar aula.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error || success) {
      const timeout = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [error, success]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Agendar Nova Aula</h2>
      {/* 
      {error && (
        <Alert variant="destructive" className={styles.alertError}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className={styles.alertSuccess}>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )} */}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={styles.label}>Aluno</label>
          <select
            name="alunoId"
            value={formData.alunoId}
            onChange={handleChange}
            required
            className={styles.select}
          >
            <option value="">Selecione um aluno</option>
            {alunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.grid}>
          <div>
            <label className={styles.label}>Data</label>
            <div className={styles.inputWrapper}>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className={styles.input}
              />
              <Calendar className={styles.inputIcon} />
            </div>
          </div>

          <div>
            <label className={styles.label}>Horário</label>
            <div className={styles.inputWrapper}>
              <input
                type="time"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <Clock className={styles.inputIcon} />
            </div>
          </div>
        </div>

        <div>
          <label className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              name="recorrente"
              checked={formData.recorrente}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <span className={styles.checkboxLabel}>
              Aula recorrente (semanalmente)
            </span>
          </label>
        </div>

        <div>
          <label className={styles.label}>Observações</label>
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows={3}
            placeholder="Adicione detalhes adicionais sobre a aula (opcional)"
            className={styles.textarea}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`${styles.button} ${
              loading ? styles.buttonDisabled : ''
            }`}
          >
            {loading ? 'Agendando...' : 'Agendar Aula'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AgendamentoAula;
