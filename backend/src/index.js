// import express from 'express';
// import cors from 'cors';
// import dashboardRoutes from './routes/dashboardRoutes.js';
// import aulasRoutes from './routes/aulasRoutes.js';
// import alunosRoutes from './routes/alunosRoutes.js';
// import agendamentoRoutes from './routes/agendamentoRoutes.js';
// import { config } from './config/index.js';

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Rota inicial
// app.get('/', (req, res) => {
//   res.send('Servidor do BG English Teacher está funcionando!');
// });

// // Rotas principais
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/alunos', alunosRoutes);
// app.use('/api/aulas', aulasRoutes);
// app.use('/api/agendamentos', agendamentoRoutes);

// // Rota de erro 404
// app.use((req, res) => {
//   res.status(404).json({ message: 'Recurso não encontrado!', success: false });
// });

// // Inicializa o servidor
// // Detecta se estamos rodando dentro do ambiente de Functions do Firebase
// const isFirebaseEmulator = process.env.FUNCTIONS_EMULATOR === 'true';
// const isFirebaseDeploy =
//   !isFirebaseEmulator && (process.env.GCLOUD_PROJECT || process.env.K_SERVICE);

// // if (!isFirebaseDeploy) {
// //   const PORT = config.server.port || 4001;
// //   app.listen(PORT, () => {
// //     console.log(`Servidor rodando na porta ${PORT}!`);
// //   });
// // }

// export default app;

import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aulasRoutes from './routes/aulasRoutes.js';
import alunosRoutes from './routes/alunosRoutes.js';
import agendamentoRoutes from './routes/agendamentoRoutes.js';
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
app.use('/api/agendamentos', agendamentoRoutes);

// Rota de erro 404
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso não encontrado!', success: false });
});

// ✅ Somente executa listen() fora do ambiente Functions
if (!process.env.GCLOUD_PROJECT && !process.env.K_SERVICE) {
  const PORT = config.server.port || 4001;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor local rodando na porta ${PORT}`);
  });
}

export default app;
