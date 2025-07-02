import { google } from 'googleapis';
import { config } from '../config/index.js';

const oauth2Client = new google.auth.OAuth2(
  config.google.clientId,
  config.google.clientSecret,
  config.google.redirectUri
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
};

let savedTokens = null; // Variável para armazenar o tokens salvos

export const setCredentials = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  savedTokens = tokens; // Armazena o token para chamadas futuras
  return tokens;
};

// Salvar tokens para chamadas futuras
export const setAccessToken = (tokens) => {
  oauth2Client.setCredentials(tokens);
  savedTokens = tokens;
};

export const createCalendarEvent = async (eventData) => {
  try {
    if (!savedTokens || !savedTokens.access_token) {
      throw new Error(
        'Tokens de acesso não encontrados. Autentique-se novamente.'
      );
    }

    oauth2Client.setCredentials(savedTokens); // Garante que o token está ativo

    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.startDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 horas antes
          { method: 'popup', minutes: 30 }, // 30 minutos antes
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      auth: oauth2Client,
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao criar evento no Google Calendar:', error);
    throw error;
  }
};

export const deleteCalendarEvent = async (eventId) => {
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });
    console.log(`Evento ${eventId} deletado com sucesso!`);
  } catch (error) {
    console.error('Erro ao deletar evento no Google Calendar:', error);
    throw error;
  }
};

export const updateCalendarEvent = async (eventId, eventData) => {
  try {
    const event = {
      summary: eventData.title,
      description: eventData.description || '',
      start: {
        dateTime: eventData.startDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: eventData.endDateTime,
        timeZone: 'America/Sao_Paulo',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 horas antes
          { method: 'popup', minutes: 30 }, // 30 minutos antes
        ],
      },
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar evento no Google Calendar:', error);
    throw error;
  }
};
