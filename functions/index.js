import { onRequest } from 'firebase-functions/v2/https';
import app from '../backend/src/index.js'; // importa seu app Express

console.log('🚀 Iniciando exportação da function API');

export const api = onRequest(app);
