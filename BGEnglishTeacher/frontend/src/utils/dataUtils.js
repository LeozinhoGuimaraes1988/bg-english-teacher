// Converte objeto Date para string no formato 'yyyy-mm-dd' (para inputs do tipo date)
export function formatarDataParaInput(date) {
  if (!(date instanceof Date)) return '';
  return date.toISOString().split('T')[0];
}

// Converte objeto Date para string no formato 'dd/mm/yyyy' (para exibição)
export function formatarDataParaExibicao(date) {
  if (!(date instanceof Date)) return '';
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Converte string 'yyyy-mm-dd' ou 'dd/mm/yyyy' para objeto Date
export function parseData(dataStr) {
  if (!dataStr) return null;

  if (dataStr.includes('/')) {
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(Number(ano), Number(mes) - 1, Number(dia)); // <- garante local
  }

  if (dataStr.includes('-')) {
    const [ano, mes, dia] = dataStr.split('-');
    return new Date(Number(ano), Number(mes) - 1, Number(dia)); // <- garante local
  }

  return null;
}

// Adiciona dias a uma data (string ou Date) e retorna string no formato 'yyyy-mm-dd'
export function adicionarDias(dataStr, dias) {
  const data = typeof dataStr === 'string' ? parseData(dataStr) : dataStr;
  if (!data) return '';
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + dias);
  return formatarDataParaInput(novaData);
}
