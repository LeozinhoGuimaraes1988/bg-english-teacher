import React from 'react';
import { LogOut, User } from 'lucide-react';
import styles from './Header.module.css';

const Header = ({ onLogout, userEmail }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.logoWrapper}>
            <h1 className={styles.logo}>BG English Teacher</h1>
          </div>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <User className={styles.userIcon} />
              <span className={styles.userEmail}>{userEmail}</span>
            </div>

            <button onClick={onLogout} className={styles.logoutButton}>
              <LogOut className={styles.logoutIcon} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
