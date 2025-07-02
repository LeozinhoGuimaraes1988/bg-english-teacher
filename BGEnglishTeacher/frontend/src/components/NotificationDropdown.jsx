import React from 'react';
import styles from './NotificationDropdown.module.css';

const NotificationDropdown = ({ notifications }) => {
  return (
    <div className={styles.dropdown}>
      <h4>Notificações</h4>
      {notifications.length === 0 ? (
        <p>Sem novas notificações</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationDropdown;
