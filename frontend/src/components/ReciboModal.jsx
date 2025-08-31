import React, { useState } from 'react';
import styles from './ReciboModal.module.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReciboModal = ({ aluno, onClose }) => {
  const [valor, setValor] = useState(aluno.valor);
  const [data, setData] = useState(new Date().toLocaleDateString('pt-BR'));

  const hoje = new Date();
  const mesAtual = hoje.getMonth();
  const anoAtual = hoje.getFullYear();
  const [mesSelecionado] = useState(mesAtual);
  const [anoSelecionado] = useState(anoAtual);

  const gerarPDF = () => {
    const input = document.getElementById('recibo-content');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // largura ajustada
      pdf.save(`Recibo-${aluno.nome}.pdf`);
    });
  };

  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modalLarge}>
        <h2>Recibo</h2>

        <div id="recibo-content" className={styles.reciboLayout}>
          <div className={styles.verticalBar}>
            <span>RECIBO</span>
          </div>

          <div className={styles.topBar}>
            <img src="/logo-bg.png" alt="Logo" className={styles.logo} />
            <div>
              <h2>BG English Teacher</h2>
              <p>CURSO DE INGLÊS ONLINE</p>
            </div>
            <div className={styles.numeracao}>
              {/* <p>Nº {aluno.id}</p> */}
              <p>VALOR: {valor}</p>
            </div>
          </div>

          <div className={styles.section}>
            <span>Recebi de:</span> {aluno.nome}
          </div>
          <div className={styles.section}>
            <span>Endereço:</span> Endereço do Aluno
          </div>
          <div className={styles.section}>
            <span>A importância de:</span> {valor}
          </div>
          <div className={styles.section}>
            <span>Referente a:</span> Mensalidade aula de inglês referente ao
            mês {meses[mesSelecionado]}/{anoSelecionado}
          </div>
          <div className={styles.section}>
            <span>Recebimento por:</span> Pix
          </div>

          <div className={styles.bottomRow}>
            <div>
              <div className={styles.section}>
                <span>Emitente:</span> Bárbara N. O. Guimarães
              </div>
              <div className={styles.section}>
                <span>CNPJ emitente:</span> 22.4443.050/001-86
              </div>
            </div>
            <div className={styles.dataAssinatura}>
              <div className={styles.section}>
                <span>Data:</span> {data}
              </div>
              <div className={styles.section}>
                <span>Assinatura:</span> ________________________
              </div>
            </div>
          </div>

          <div className={styles.rodape}>
            Qd 56, lote 12, apto 216, Residencial Atenas - Gama, Distrito
            Federal, Brasil · @inglesbabiguimaraes · (61) 99997-2524
          </div>
        </div>

        <div className={styles.editSection}>
          <label>
            Valor:
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </label>
          <label>
            Data:
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
          </label>
        </div>

        <div className={styles.actions}>
          <button onClick={gerarPDF} className={styles.gerarBtn}>
            Gerar PDF
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReciboModal;
