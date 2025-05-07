import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

// Corrige '__dirname' em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define os caminhos dos arquivos
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'src/config/credentials.json');

/**
 * Lê credenciais salvas, se existirem.
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Salva as credenciais no arquivo token.json.
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Autentica o usuário e obtém as credenciais.
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) return client;

  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (client.credentials) await saveCredentials(client);

  return client;
}

/**
 * Lista os próximos 10 eventos no Google Calendar.
 */
async function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('Nenhum evento futuro encontrado.');
    return;
  }

  console.log('Próximos 10 eventos:');
  events.forEach((event) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
}

// Executa a autenticação e lista os eventos
authorize().then(listEvents).catch(console.error);
