// import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AulasProvider } from './src/context/AulasContext';
import { AlunosProvider } from './src/context/AlunosContext';
import { AulasRealizadasProvider } from './src/context/AulasRealizadasContext';
import { AuthProvider } from './src/context/AuthContext'; // caso ainda não tenha incluído
import { AgendamentosProvider } from './src/context/AgendamentosContext';

import Home from '../frontend/src/pages/Home';
import Sidebar from '../frontend/src/components/Sidebar';
import AgendamentoAula from '../frontend/src/components/AgendamentoAula';
import Navbar from './src/components/Navbar';
import AlunosPage from './src/pages/AlunosPage';
import AulasAgendadasPage from './src/pages/AulasAgendadasPage';
import AulasRealizadas from './src/pages/AulasRealizadasPage';
import FinanceiroPage from './src/pages/FinanceiroPage';
import PerfilAluno from '../frontend/src/components/PerfilAluno';
import AlunoDetalhes from './src/pages/AlunoDetalhes';
import ConfiguracoesPage from './src/pages/ConfiguracoesPage';
import Login from './src/pages/Login';
import ProtectedRoute from './src/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <AlunosProvider>
        <AulasProvider>
          <AulasRealizadasProvider>
            <AgendamentosProvider>
              <BrowserRouter>
                <div style={{ display: 'flex' }}>
                  <Sidebar />
                  <div
                    style={{ marginLeft: '10px', flexGrow: 1, padding: '20px' }}
                  >
                    <Routes>
                      <Route path="/login" element={<Login />} />

                      <Route
                        path="/home"
                        element={
                          <ProtectedRoute>
                            <>
                              <Navbar />
                              <Home />
                            </>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/alunos"
                        element={
                          <ProtectedRoute>
                            <>
                              <Navbar />
                              <PerfilAluno />
                            </>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/alunos/page"
                        element={
                          <ProtectedRoute>
                            <>
                              <Navbar />
                              <AlunosPage />
                            </>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/aulas-realizadas"
                        element={
                          <ProtectedRoute>
                            <>
                              <Navbar />
                              <AulasRealizadas />
                            </>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/aulas-agendadas"
                        element={
                          <ProtectedRoute>
                            <>
                              <Navbar />
                              <AulasAgendadasPage />
                            </>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/agendamento"
                        element={
                          <ProtectedRoute>
                            <>
                              <Navbar />
                              <AgendamentoAula />
                            </>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/financeiro"
                        element={
                          <ProtectedRoute>
                            <>
                              <Navbar />
                              <FinanceiroPage />
                            </>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/alunos/:id"
                        element={
                          <ProtectedRoute>
                            <>
                              <Navbar />
                              <AlunoDetalhes />
                            </>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/configuracoes"
                        element={
                          <ProtectedRoute>
                            <>
                              <Navbar />
                              <ConfiguracoesPage />
                            </>
                          </ProtectedRoute>
                        }
                      />

                      {/* Rota padrão: redireciona para /home se logado */}
                      <Route path="*" element={<Navigate to="/home" />} />
                    </Routes>
                  </div>
                </div>
              </BrowserRouter>
            </AgendamentosProvider>
          </AulasRealizadasProvider>
        </AulasProvider>
      </AlunosProvider>
    </AuthProvider>
  );
}

export default App;
