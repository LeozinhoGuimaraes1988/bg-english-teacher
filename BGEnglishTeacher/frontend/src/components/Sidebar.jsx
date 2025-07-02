import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isVisible, setIsVisible] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsVisible(!mobile); // sempre visível em telas maiores
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobile && (
        <button
          className={styles.mobileToggle}
          onClick={() => setIsVisible((prev) => !prev)}
        >
          <Menu size={20} />
        </button>
      )}

      {isVisible && (
        <div
          className={`${styles.sidebar} ${
            isExpanded
              ? styles.expanded
              : isHovered
              ? styles.hovered
              : styles.collapsed
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            className={styles.toggleButton}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>

          <nav className={styles.nav}>
            <Link to="/home" className={styles.navItem}>
              <Home size={20} />
              {(isExpanded || isHovered) && <span>Home</span>}
            </Link>

            <Link to="/dashboard" className={styles.navItem}>
              <LayoutDashboard size={20} />
              {(isExpanded || isHovered) && <span>Dashboard</span>}
            </Link>

            <Link to="/alunos/page" className={styles.navItem}>
              <Users size={20} />
              {(isExpanded || isHovered) && <span>Alunos</span>}
            </Link>

            <Link to="/calendario" className={styles.navItem}>
              <Calendar size={20} />
              {(isExpanded || isHovered) && <span>Calendário</span>}
            </Link>

            <Link to="/configuracoes" className={styles.navItem}>
              <Settings size={20} />
              {(isExpanded || isHovered) && <span>Configurações</span>}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;
