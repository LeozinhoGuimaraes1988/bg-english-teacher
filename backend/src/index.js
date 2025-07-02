import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aulasRoutes from './routes/aulasRoutes.js';
import alunosRoutes from './routes/alunosRoutes.js';
import googleCalendarRoutes from './routes/googleCalendarRoutes.js';
import { config } from './config/index.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.send('Servidor do BG English Teacher está funcionando!');
});

// Rotas principais
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/aulas', aulasRoutes);
app.use('/google-calendar', googleCalendarRoutes);

// Rota de erro 404
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso não encontrado!', success: false });
});

// Inicializa o servidor
const PORT = config.server.port || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});
