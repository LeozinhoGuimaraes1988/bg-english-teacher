// Navbar.jsx
import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { Bell, CalendarPlus, User, UserPlus } from 'lucide-react';
import { useAulas } from '../hooks/useAulas';
import NotificationDropdown from './NotificationDropdown';
import NovaAulaModal from './NovaAulaModal';
// import NovoAlunoModal from './NovoAlunoModal';
import { useAlunos } from '../context/AlunosContext'; // << IMPORTANTE
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { usuario } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNovaAula, setShowNovaAula] = useState(false);
  // const [showNovoAluno, setShowNovoAluno] = useState(false);

  const { t } = useTranslation();

  const { adicionarAula } = useAulas();
  const { adicionarAluno } = useAlunos(); // << IMPORTANTE

  const notifications = [
    'Aula com João às 10h',
    'Pagamento pendente de Maria',
    'Solicitação de agendamento de Carlos',
  ];

  const handleNovaAulaSave = (novaAula) => {
    adicionarAula(novaAula);
    setShowNovaAula(false);
  };

  const handleNovoAlunoSave = async (aluno) => {
    const novoAluno = {
      nome: aluno.nome,
      nascimento: aluno.nascimento,
      email: aluno.email,
      telefone: aluno.telefone,
      endereco: aluno.endereco,
      foto: aluno.foto || '', // base64 por enquanto
    };

    await adicionarAluno(novoAluno); // salva no Firebase
    setShowNovoAluno(false); // fecha o modal
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>BG English Teacher</div>
      </div>

      <div className={styles.right}>
        {/* Botão Criar Aula */}
        {/* <button
          className={styles.novaAulaButton}
          onClick={() => setShowNovaAula(true)}
        >
          <CalendarPlus size={18} /> Nova Aula
        </button> */}

        {/* Botão Cadastrar Aluno */}
        {/* <button
          className={styles.novoAlunoButton}
          onClick={() => setShowNovoAluno(true)}
        >
          <UserPlus size={18} /> Novo Aluno
        </button> */}

        {/* Notificações */}
        <div className={styles.notificationWrapper}>
          {/* <div
            className={styles.notificationIcon}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Bell size={20} />
            <span className={styles.badge}>3</span>
          </div> */}
          {dropdownOpen && (
            <NotificationDropdown notifications={notifications} />
          )}
        </div>

        {/* Usuário Logado */}
        <div className={styles.user}>
          <User size={20} />
          {usuario.displayName}
        </div>
      </div>

      {/* Modais */}
      {showNovaAula && (
        <NovaAulaModal
          onClose={() => setShowNovaAula(false)}
          onSave={handleNovaAulaSave}
        />
      )}

      {/* {showNovoAluno && (
        <NovoAlunoModal
          onClose={() => setShowNovoAluno(false)}
          onSave={handleNovoAlunoSave} // ✅ Agora sim!
        />
      )} */}
    </header>
  );
};

export default Navbar;
