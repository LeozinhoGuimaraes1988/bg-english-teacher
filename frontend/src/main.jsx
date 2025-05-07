import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfiguracoesProvider } from './context/ConfiguracoesContext';
import { AuthProvider } from './context/AuthContext';
import './i18n/index.js';

import App from '../App';

import '../src/styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ConfiguracoesProvider>
        <App />
      </ConfiguracoesProvider>
    </AuthProvider>
  </StrictMode>
);
