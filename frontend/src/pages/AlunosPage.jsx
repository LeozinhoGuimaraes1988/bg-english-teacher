import React, { useState } from 'react';
// import AlunosCard from '../components/AlunosCard';
import NovoAlunoModal from '../components/NovoAlunoModal';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';
import styles from './AlunosPage.module.css';
// import { useAlunos } from '../context/AlunosContext';
import { useAlunos } from '../hooks/useAlunos';

const AlunosPage = () => {
  const { alunos, loading, excluirAluno, adicionarAluno, atualizarAluno } =
    useAlunos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (aluno) => {
    setSelectedAluno(aluno);
    setIsModalOpen(true);
  };

  const handleDelete = (aluno) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir o aluno "${aluno.nome}"?`
    );
    if (confirmacao) {
      excluirAluno(aluno.id, aluno.foto);
    }
  };

  const filteredAlunos = alunos
    .filter((aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  const getStatusClass = (status) => {
    switch (status) {
      case 'Ativo':
        return `${styles.statusBadge} ${styles.statusActive}`;
      case 'Pendente':
        return `${styles.statusBadge} ${styles.statusPending}`;
      case 'Inativo':
      default:
        return `${styles.statusBadge} ${styles.statusInactive}`;
    }
  };

  return (
    <div className={styles.container}>
      {/* Cabeçalho */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Gestão de Alunos</h1>
          <p>Gerencie matrículas e informações dos alunos</p>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersContainer}>
          <div className={styles.filtersLeft}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            {/* <button className={styles.filterButton}>
              <Filter className={styles.actionIcon} />
              <span>Filtros</span>
            </button> */}
          </div>

          <button
            onClick={() => {
              setSelectedAluno(null);
              setIsModalOpen(true);
            }}
            className={styles.addButton}
          >
            <Plus className={styles.actionIcon} />
            <span>Novo Aluno</span>
          </button>
          {/* <button className={styles.exportButton}>
            <Download className={styles.actionIcon} />
            <span>Exportar</span>
          </button> */}
        </div>
      </div>

      {/* Tabela */}
      <div className={styles.tableCard}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Aluno</th>
                <th className={styles.tableHeaderCell}>Contato</th>
                {/* <th className={styles.tableHeaderCell}>Pacote de Aulas</th> */}
                <th className={styles.tableHeaderCell}>Status</th>
                <th className={styles.tableHeaderCell}>Próximo Pagamento</th>
                <th className={styles.tableHeaderCell}>Ações</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {loading ? (
                <tr>
                  <td colSpan="6" className={styles.tableCell}>
                    Carregando alunos...
                  </td>
                </tr>
              ) : filteredAlunos.length === 0 ? (
                <tr>
                  <td colSpan="6" className={styles.tableCell}>
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              ) : (
                filteredAlunos.map((aluno) => (
                  <tr key={aluno.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.studentInfo}>
                        <div className={styles.studentName}>{aluno.nome}</div>
                        {/* <div className={styles.studentId}>ID: {aluno.id}</div> */}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.contactInfo}>
                        <div className={styles.contactEmail}>{aluno.email}</div>
                        <div className={styles.contactPhone}>
                          {aluno.telefone}
                        </div>
                      </div>
                    </td>
                    {/* <td>
                      {editandoId === aluno.id ? (
                        <>
                          <input
                            type="number"
                            value={dadosEditados.valorPacote}
                            onChange={(e) =>
                              setDadosEditados({
                                ...dadosEditados,
                                valorPacote: e.target.value,
                              })
                            }
                          />

                          <button
                            className={styles.btnIcon}
                            onClick={() => {
                              const novoValor = Number(
                                dadosEditados.valorPacote
                              );
                              atualizarCampoAluno(aluno.id, {
                                valorPersonalizadoTotal: novoValor,
                              });
                              setEditandoId(null);
                            }}
                            title="Salvar"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            className={styles.btnIcon}
                            onClick={() => setEditandoId(null)}
                            title="Cancelar"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          {pacoteAulas(aluno)}
                          <button
                            className={styles.btnIcon}
                            onClick={() => iniciarEdicao(aluno)}
                            title="Editar valor"
                          >
                            <Edit size={18} />
                          </button>
                        </>
                      )}
                    </td> */}

                    <td className={styles.tableCell}>
                      <span className={getStatusClass(aluno.status || 'Ativo')}>
                        {aluno.status || 'Ativo'}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {aluno.proximoPagamento
                        ? new Date(aluno.proximoPagamento).toLocaleDateString(
                            'pt-BR'
                          )
                        : '-'}
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actions}>
                        <Link to={`/alunos/${aluno.id}`}>
                          <button
                            className={`${styles.actionButton} ${styles.viewButton}`}
                          >
                            <Eye className={styles.actionIcon} />
                          </button>
                        </Link>

                        <button
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEdit(aluno)}
                        >
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDelete(aluno)}
                        >
                          <Trash2 className={styles.actionIcon} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <NovoAlunoModal
          student={selectedAluno}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAluno(null);
          }}
          onSave={(aluno) => {
            if (selectedAluno) {
              // Edição
              atualizarAluno(selectedAluno.id, aluno);
              alert('Aluno atualizado com sucesso!');
            } else {
              // Novo cadastro
              adicionarAluno(aluno);
              alert('Aluno cadastrado com sucesso!');
            }
          }}
        />
      )}
    </div>
  );
};

export default AlunosPage;
