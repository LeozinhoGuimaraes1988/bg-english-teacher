import React from 'react';
import styles from './AlertMessage.module.css';

const AlertMessage = ({ type, message }) => {
  if (!message) return null;
  return (
    <div className={`${styles.container} ${styles[type]}`} role="alert">
      {' '}
      {message}
    </div>
  );
};

export default AlertMessage;
