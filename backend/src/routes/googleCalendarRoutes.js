// import express from 'express';
// import {
//   getAuthUrl,
//   setCredentials,
//   createCalendarEvent,
//   updateCalendarEvent,
//   deleteCalendarEvent,
// } from '../services/googleCalendarService.js';

// import { config } from '../config/index.js';

// const router = express.Router();

// // Rota para iniciar o processo de autorização
// router.get('/auth', (req, res) => {
//   const authUrl = getAuthUrl();
//   res.redirect(authUrl);
// });

// // Rota para callback do Google
// router.get('/callback', async (req, res) => {
//   const { code } = req.query;
//   try {
//     const { tokens } = await setCredentials(code);

//     // Enviar tokens para o frontend
//     res.redirect(
//       `${
//         config.server.env === 'production'
//           ? config.frontendUrl
//           : 'http://localhost:3000'
//       }/dashboard?access_token=${tokens.access_token}`
//     );
//   } catch (error) {
//     console.error('Erro na autenticação:', error);
//     res.redirect('http://localhost:3000/dashboard?error=authentication_failed');
//   }
// });

// // Rota para criar um evento no Google Calendar
// router.post('/events', async (req, res) => {
//   try {
//     const eventData = req.body; // Dados do evento enviados pelo frontend
//     const event = await createCalendarEvent(eventData);
//     res.status(201).json(event);
//   } catch (error) {
//     console.error('Erro ao criar evento:', error);
//     res.status(500).json({ error: 'Erro ao criar evento' });
//   }
// });

// // Rota para atualizar um evento no Google Calendar
// router.put('/events/:eventId', async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const updatedData = req.body; // Dados atualizados enviados pelo frontend
//     const updatedEvent = await updateCalendarEvent(eventId, updatedData);
//     res.status(200).json(updatedEvent);
//   } catch (error) {
//     console.error('Erro ao atualizar evento:', error);
//     res.status(500).json({ error: 'Erro ao atualizar evento' });
//   }
// });

// // Rota para excluir um evento no Google Calendar
// router.delete('/events/:eventId', async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     await deleteCalendarEvent(eventId);
//     res.status(204).send();
//   } catch (error) {
//     console.error('Erro ao excluir evento:', error);
//     res.status(500).json({ error: 'Erro ao excluir evento' });
//   }
// });

// export default router;
