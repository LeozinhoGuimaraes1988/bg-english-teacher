import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './AlunoDetalhes.module.css';
import { useAlunos } from '../context/AlunosContext';
import { useConfiguracoes } from '../context/ConfiguracoesContext';
import { parseData, formatarDataParaExibicao } from '../utils/dataUtils';
import { uploadImagem } from '../utils/uploadImagem';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const calcularIdade = (nascimento) => {
  if (!nascimento) return '';
  const [ano, mes, dia] = nascimento.split('-');
  const data = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  let idade = hoje.getFullYear() - data.getFullYear();
  const m = hoje.getMonth() - data.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < data.getDate())) idade--;
  return idade;
};

const AlunoDetalhes = () => {
  const { id } = useParams();
  const { alunos, atualizarAluno } = useAlunos();
  const { valorHoraAula } = useConfiguracoes();
  const { t } = useTranslation();

  const [aluno, setAluno] = useState(null);

  // Campos editáveis
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');

  const [nivel, setNivel] = useState('');
  const [pacoteAulas, setPacoteAulas] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [valorPacote, setValorPacote] = useState('');
  const [diasSemana, setDiasSemana] = useState([]);
  const [horarioAula, setHorarioAula] = useState('');
  const [preview, setPreview] = useState(null);
  const [foto, setFoto] = useState(null);

  const diasDaSemana = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const schema = Yup.object().shape({
    nome: Yup.string().required('O nome é obrigatório'),
    email: Yup.string()
      .email('E-mail inválido')
      .required('O e-mail é obrigatório'),
    telefone: Yup.string()
      .matches(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/, 'Telefone inválido')
      .required('O telefone é obrigatório'),
    nascimento: Yup.string().required('A data de nascimento é obrigatória'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // 👈 importante
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const encontrado = alunos.find((a) => a.id === id);
    if (encontrado) {
      setAluno(encontrado);
      reset({
        nome: encontrado.nome || '',
        email: encontrado.email || '',
        telefone: encontrado.telefone || '',
        nascimento: encontrado.nascimento || '',
      });

      // demais setStates
      setNivel(encontrado.nivel || '');
      setPacoteAulas(encontrado.pacoteAulas || '');
      setObservacoes(encontrado.notas || '');
      setDiasSemana(encontrado.diasSemana || []);
      setHorarioAula(encontrado.horarioAula || '');
    }
  }, [alunos, id, reset]);

  useEffect(() => {
    if (valorHoraAula && pacoteAulas) {
      setValorPacote(Number(pacoteAulas) * Number(valorHoraAula));
    }
  }, [pacoteAulas, valorHoraAula]);

  if (!aluno) return <p className={styles.loading}>Carregando aluno...</p>;

  const idade = calcularIdade(nascimento);

  const campoAlterado = (campoOriginal, valorAtual) =>
    aluno[campoOriginal] !== valorAtual;

  const handleSalvar = handleSubmit(async (dadosValidados) => {
    let fotoUrl = aluno.foto || null;
    if (foto && typeof foto !== 'string') {
      fotoUrl = await uploadImagem(foto, aluno.id);
    }

    const dadosAtualizados = {
      ...aluno,
      ...dadosValidados, // aqui vem nome, email, telefone, nascimento
      nivel,
      pacoteAulas,
      valorPacote,
      diasSemana,
      horarioAula,
      notas: observacoes,
      foto: fotoUrl,
    };

    await atualizarAluno(aluno.id, dadosAtualizados);
    alert('Alterações salvas com sucesso!');
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePacoteChange = (e) => {
    const pacote = e.target.value;
    setPacoteAulas(pacote);
    if (valorHoraAula && pacote) {
      setValorPacote(Number(pacote) * Number(valorHoraAula));
    } else {
      setValorPacote('');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Detalhes do Aluno</h1>

      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.fotoPreview}>
            {preview || aluno.foto ? (
              <img src={preview || aluno.foto} alt="Foto do aluno" />
            ) : (
              <span>Sem foto</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className={styles.info}>
          <div className={styles.inputGroup}>
            <label>
              <strong>Nome:</strong>
            </label>
            <input
              {...register('nome')}
              className={`${
                campoAlterado('nome', aluno?.nome) ? styles.highlight : ''
              }`}
            />
            {errors.nome && (
              <p className={styles.error}>{errors.nome.message}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>
              <strong>E-mail:</strong>
            </label>
            <input
              type="email"
              {...register('email')}
              className={`${
                campoAlterado('email', aluno?.email) ? styles.highlight : ''
              }`}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>
              <strong>Telefone:</strong>
            </label>
            <input
              type="text"
              {...register('telefone')}
              className={`${
                campoAlterado('telefone', aluno?.telefone)
                  ? styles.highlight
                  : ''
              }`}
            />
            {errors.telefone && (
              <p className={styles.error}>{errors.telefone.message}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>
              <strong>Data de nascimento:</strong>
            </label>
            <input
              type="date"
              {...register('nascimento')}
              className={`${
                campoAlterado('nascimento', aluno?.nascimento)
                  ? styles.highlight
                  : ''
              }`}
            />
            {errors.nascimento && (
              <p className={styles.error}>{errors.nascimento.message}</p>
            )}
          </div>

          <p>
            <strong>Idade:</strong> {idade} anos
          </p>

          <div className={styles.inputGroup}>
            <label>
              <strong>Nível:</strong>
            </label>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
              <option value="">Selecione</option>
              <option value="Básico">Básico</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>
              <strong>Pacote de aulas:</strong>
            </label>
            <select value={pacoteAulas} onChange={handlePacoteChange}>
              <option value="">Selecione</option>
              <option value="4">4 aulas</option>
              <option value="8">8 aulas</option>
              <option value="12">12 aulas</option>
              <option value="20">20 aulas</option>
              <option value="24">24 aulas</option>
            </select>
          </div>

          <p>
            <strong>Valor do Pacote:</strong> R$ {valorPacote}
          </p>

          <div className={styles.inputGroup}>
            <label>
              <strong>Dias das Aulas:</strong>
            </label>
            <div className={styles.diasCheckboxes}>
              {diasDaSemana.map((dia) => (
                <label key={dia} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={dia}
                    checked={diasSemana.includes(dia)}
                    onChange={(e) => {
                      const atualizado = e.target.checked
                        ? [...diasSemana, dia]
                        : diasSemana.filter((d) => d !== dia);
                      setDiasSemana(atualizado);
                    }}
                  />
                  {dia}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>
              <strong>Horário da Aula:</strong>
            </label>
            <input
              type="time"
              value={horarioAula}
              onChange={(e) => setHorarioAula(e.target.value)}
            />
          </div>

          <div className={styles.inputGroupFull}>
            <label>
              <strong>Observações:</strong>
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={handleSalvar} className={styles.saveButton}>
          Salvar alterações
        </button>
      </div>

      <Link to="/dashboard">
        <button className={styles['voltar-btn']}>
          {t('realizadas.voltar')}
        </button>
      </Link>
    </div>
  );
};

export default AlunoDetalhes;
