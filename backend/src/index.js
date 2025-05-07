import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aulasRoutes from './routes/aulasRoutes.js';
import alunosRoutes from './routes/alunosRoutes.js';
import googleCalendarRoutes from './routes/googleCalendarRoutes.js';
import { config } from './config/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
// Atualiza os middlewares para aceitar payloads maiores (até 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rota inicial
app.get('/', (req, res) => {
  res.send('Servidor do BG English Teacher está funcionando!');
});

// Rotas principais
app.use('/dashboard', dashboardRoutes);
app.use('/alunos', alunosRoutes);
app.use('/aulas', aulasRoutes);
app.use('/google-calendar', googleCalendarRoutes);

// Rota de erro 404
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso não encontrado!', success: false });
});

// Inicializa o servidor
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
});
