// Navbar.jsx
import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { Bell, CalendarPlus, User, UserPlus } from 'lucide-react';
import { useAulas } from '../hooks/useAulas';
// import NotificationDropdown from './NotificationDropdown';
import NovaAulaModal from './NovaAulaModal';
// import NovoAlunoModal from './NovoAlunoModal';

import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { usuario } = useAuth();
  const [showNovaAula, setShowNovaAula] = useState(false);
  // const [showNovoAluno, setShowNovoAluno] = useState(false);

  const { t } = useTranslation();

  const { adicionarAula } = useAulas();

  const handleNovaAulaSave = (novaAula) => {
    adicionarAula(novaAula);
    setShowNovaAula(false);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.logo}>BG English Teacher</div>
      </div>

      <div className={styles.right}>
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
    </header>
  );
};

export default Navbar;
