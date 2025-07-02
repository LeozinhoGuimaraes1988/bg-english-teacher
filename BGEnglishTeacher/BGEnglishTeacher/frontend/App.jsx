// import './App.css';
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';

import Dashboard from '../frontend/src/pages/Dashboard';
import Header from '../frontend/src/components/Header';
import PerfilAluno from '../frontend/src/components/PerfilAluno';
import ProximasAulas from '../frontend/src/components/ProximasAulas';
import Calendario from '../frontend/src/components/Calendario';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
