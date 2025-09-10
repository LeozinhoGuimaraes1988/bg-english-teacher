import React, { useState } from 'react';
import {
  X,
  Plus,
  Calendar,
  Clock,
  User,
  Users,
  MapPin,
  Search,
  BookOpen,
} from 'lucide-react';
import styles from './NovaAulaModal.module.css';
import { useAlunos } from '../context/AlunosContext';

const NovaAulaModal = ({ onClose, onSave }) => {
  const { alunos } = useAlunos();

  const [aluno, setAluno] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [tipo, setTipo] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    level: '',
    room: '',
    maxStudents: '',
    selectedDays: [],
    startTime: '',
    endTime: '',
  });

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const levels = [
    { value: 'basic', label: 'Básico (A1-A2)' },
    { value: 'intermediate', label: 'Intermediário (B1-B2)' },
    { value: 'advanced', label: 'Avançado (C1-C2)' },
    { value: 'ielts', label: 'IELTS/TOEFL' },
  ];

  const days = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];
  console.log('📦 alunos no contexto:', alunos);
  // Filtrar alunos ativos baseado na busca
  const filteredStudents = alunos.filter(
    (student) =>
      student.nome &&
      student.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDayToggle = (dayKey) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayKey)
        ? prev.selectedDays.filter((d) => d !== dayKey)
        : [...prev.selectedDays, dayKey],
    }));
  };

  const handleStudentToggle = (student) => {
    setSelectedStudents((prev) => {
      const isSelected = prev.find((s) => s.id === student.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== student.id);
      } else {
        // Verificar limite máximo se definido
        if (
          formData.maxStudents &&
          prev.length >= parseInt(formData.maxStudents)
        ) {
          alert(`Limite máximo de ${formData.maxStudents} alunos atingido.`);
          return prev;
        }
        return [...prev, student];
      }
    });
  };

  const handleRemoveStudent = (studentId) => {
    setSelectedStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.selectedDays.length === 0) {
      alert('Selecione pelo menos um dia da semana.');
      return;
    }

    if (selectedStudents.length === 0) {
      alert('Selecione pelo menos um aluno para a aula.');
      return;
    }

    const classData = {
      ...formData,
      students: selectedStudents.length,
      enrolledStudents: selectedStudents,
      schedule: `${formData.selectedDays
        .map((day) => days.find((d) => d.key === day)?.label)
        .join(', ')} - ${formData.startTime}-${formData.endTime}`,
    };

    onSave(classData);
    onClose();
  };

  const getStudentInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.teacher &&
      formData.level &&
      formData.selectedDays.length > 0 &&
      formData.startTime &&
      formData.endTime &&
      selectedStudents.length > 0
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <Plus className={styles.sectionIcon} />
            Nova Aula
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X className={styles.sectionIcon} />
          </button>
        </div>

        <div className={styles.modalContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Basic Information */}
            <div className={styles.section}>
              <h3 className={styles.sectionHeader}>
                <BookOpen className={styles.sectionIcon} />
                Informações Básicas
              </h3>
              <div
                className={`${styles.gridContainer} ${styles.gridTwoColumns}`}
              >
                <div className={styles.inputGroup}>
                  <label className={`${styles.label} ${styles.required}`}>
                    Nome da Aula
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ex: Aula de Conversação"
                  />
                </div>
                <div className={styles.inputGroup}>
                  {/* <label className={`${styles.label} ${styles.required}`}>
                    Professor
                  </label> */}
                  {/* <select
                    name="teacher"
                    required
                    value={formData.teacher}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">Selecione um professor</option>
                    {teachers.map((teacher, index) => (
                      <option key={index} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select> */}
                </div>
              </div>

              <div
                className={`${styles.gridContainer} ${styles.gridThreeColumns}`}
              >
                {/* <div className={styles.inputGroup}>
                  <label className={`${styles.label} ${styles.required}`}>
                    Nível
                  </label>
                  <select
                    name="level"
                    required
                    value={formData.level}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">Selecione o nível</option>
                    {levels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div> */}
                {/* <div className={styles.inputGroup}>
                  <label className={styles.label}>Sala</label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ex: Sala 101"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Máximo de Alunos</label>
                  <input
                    type="number"
                    name="maxStudents"
                    min="1"
                    max="20"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Ex: 8"
                  />
                </div> */}
              </div>
            </div>

            {/* Schedule */}
            <div className={styles.section}>
              <h3 className={styles.sectionHeader}>
                <Calendar className={styles.sectionIcon} />
                Horários
              </h3>
              <div className={styles.scheduleSection}>
                <div className={styles.daySelector}>
                  {days.map((day) => (
                    <label
                      key={day.key}
                      // className={`${styles.dayOption} ${
                      //   formData.selectedDays.includes(day.key)
                      //     ? styles.selected
                      //     : ''
                      // }`}
                    >
                      <input
                        type="checkbox"
                        className={styles.dayCheckbox}
                        // checked={formData.selectedDays.includes(day.key)}
                        onChange={() => handleDayToggle(day.key)}
                      />
                      {day.label}
                    </label>
                  ))}
                </div>

                <div className={styles.timeInputs}>
                  <div className={styles.inputGroup}>
                    <label className={`${styles.label} ${styles.required}`}>
                      Horário de Início
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      required
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                  <span className={styles.timeLabel}>às</span>
                  <div className={styles.inputGroup}>
                    <label className={`${styles.label} ${styles.required}`}>
                      Horário de Término
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      required
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Students Selection */}
            <div className={styles.section}>
              <h3 className={styles.sectionHeader}>
                <Users className={styles.sectionIcon} />
                Seleção de Alunos
              </h3>

              <div className={styles.studentsSection}>
                <div className={styles.studentsHeader}>
                  <h4 className={styles.studentsTitle}>
                    <User className={styles.sectionIcon} />
                    Alunos Disponíveis
                    <span className={styles.selectedCount}>
                      {selectedStudents.length}
                    </span>
                  </h4>
                </div>

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

                <div className={styles.studentsList}>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => {
                      const isSelected = selectedStudents.find(
                        (s) => s.id === student.id
                      );
                      return (
                        <div
                          key={student.id}
                          className={`${styles.studentItem} ${
                            isSelected ? styles.selected : ''
                          }`}
                          onClick={() => handleStudentToggle(student)}
                        >
                          <input
                            type="checkbox"
                            className={styles.studentCheckbox}
                            checked={!!isSelected}
                            onChange={() => handleStudentToggle(student)}
                          />
                          <div className={styles.studentAvatar}>
                            {getStudentInitials(student.nome)}
                          </div>
                          <div className={styles.studentInfo}>
                            <p className={styles.studentName}>{student.nome}</p>
                            <p className={styles.studentDetails}>
                              {student.email} • {student.course}
                            </p>
                          </div>
                          <span className={styles.studentLevel}>
                            {student.level}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.emptyState}>
                      {searchTerm
                        ? 'Nenhum aluno encontrado'
                        : 'Nenhum aluno disponível'}
                    </div>
                  )}
                </div>

                {/* Selected Students Preview */}
                {selectedStudents.length > 0 && (
                  <div className={styles.selectedStudentsPreview}>
                    <p className={styles.previewTitle}>
                      Alunos Selecionados ({selectedStudents.length})
                    </p>
                    <div className={styles.previewList}>
                      {selectedStudents.map((student) => (
                        <div key={student.id} className={styles.previewTag}>
                          {student.nome}
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(student.id)}
                            className={styles.removeTag}
                          >
                            <X
                              style={{ width: '0.75rem', height: '0.75rem' }}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button
                type="submit"
                // disabled={!isFormValid()}
                className={styles.createButton}
              >
                Criar Aula
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NovaAulaModal;
