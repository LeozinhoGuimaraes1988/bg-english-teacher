import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const TOKEN_PATH = path.resolve('./tokens.json');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// 🔹 Gerar URL para autenticação
export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });
};

// 🔹 Trocar código pelo token e salvar
export const setCredentials = async (code) => {
  console.log('🔍 Código recebido:', code);

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens || !tokens.access_token) {
      throw new Error('Tokens inválidos ou ausentes.');
    }

    console.log('✅ Tokens válidos recebidos:', tokens);

    oauth2Client.setCredentials(tokens);

    return tokens; // 🔹 Certifique-se de que os tokens estão sendo retornados corretamente
  } catch (error) {
    console.error('❌ Erro ao obter tokens:', error);
    return null; // Retornar null para evitar quebrar o fluxo
  }
};

// 🔹 Carregar tokens salvos ao iniciar o servidor
if (fs.existsSync(TOKEN_PATH)) {
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oauth2Client.setCredentials(tokens);

  if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
    console.log('🔄 Token expirado. Renovando...');
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
      console.log('✅ Token renovado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao renovar token:', err);
    }
  }
}

// 🔹 Salvar tokens manualmente
export const setAccessToken = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

// 🔹 Criar evento no Google Calendar
export const createCalendarEvent = async (eventData) => {
  try {
    const accessToken = oauth2Client.credentials?.access_token;
    if (!accessToken) {
      throw new Error(
        'Tokens de acesso não encontrados. Autentique-se novamente.'
      );
    }

    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.startDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      end: { dateTime: eventData.endDateTime, timeZone: 'America/Sao_Paulo' },
      reminders: { useDefault: true },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar evento no Google Calendar:', error);
    throw error;
  }
};

// 🔹 Deletar evento
export const deleteCalendarEvent = async (eventId) => {
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
    console.log(`✅ Evento ${eventId} deletado com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao deletar evento:', error);
    throw error;
  }
};

// 🔹 Atualizar evento
export const updateCalendarEvent = async (eventId, eventData) => {
  try {
    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.startDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      end: { dateTime: eventData.endDateTime, timeZone: 'America/Sao_Paulo' },
      reminders: { useDefault: true },
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar evento:', error);
    throw error;
  }
};
