import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const dataAulas = [
  { month: 'Jan', aulas: 12 },
  { month: 'Feb', aulas: 18 },
  { month: 'Mar', aulas: 10 },
  { month: 'Apr', aulas: 22 },
  { month: 'May', aulas: 16 },
];

const dataFaturamento = [
  { month: 'Jan', valor: 1500 },
  { month: 'Feb', valor: 2200 },
  { month: 'Mar', valor: 1800 },
  { month: 'Apr', valor: 3000 },
  { month: 'May', valor: 2500 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Graficos = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Gráficos de Desempenho</h2>

      {/* Gráfico de Linhas - Aulas */}
      <h3>Total de Aulas por Mês</h3>
      <LineChart width={600} height={300} data={dataAulas}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="aulas" stroke="#8884d8" />
      </LineChart>

      {/* Gráfico de Barras - Faturamento */}
      <h3>Faturamento Mensal</h3>
      <BarChart width={600} height={300} data={dataFaturamento}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="valor" fill="#82ca9d" />
      </BarChart>

      {/* Gráfico de Pizza - Distribuição (Exemplo) */}
      <h3>Distribuição de Alunos por Nível</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={[
            { name: 'Básico', value: 50 },
            { name: 'Intermediário', value: 30 },
            { name: 'Avançado', value: 20 },
          ]}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
          dataKey="value"
        >
          {COLORS.map((color, index) => (
            <Cell key={`cell-${index}`} fill={color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default Graficos;
