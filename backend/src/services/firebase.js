import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

function coalesce(...vals) {
  return vals.find((v) => v !== undefined && v !== null && v !== '');
}

if (!admin.apps.length) {
  const isLocal =
    process.env.FUNCTIONS_EMULATOR || process.env.NODE_ENV === 'development';

  if (isLocal) {
    // Carrega config local (ex.: vindo do seu config/index.js)
    const { config } = await import('../config/index.js');
    const raw = config?.firebaseAdmin || {};

    // Normaliza: aceita camelCase OU snake_case
    const projectId = coalesce(
      raw.projectId,
      raw.project_id,
      process.env.FIREBASE_PROJECT_ID
    );
    const clientEmail = coalesce(
      raw.clientEmail,
      raw.client_email,
      process.env.FIREBASE_CLIENT_EMAIL
    );
    // Pode vir com \n escapado no .env
    const privateKey = coalesce(
      raw.privateKey,
      raw.private_key,
      process.env.FIREBASE_PRIVATE_KEY
    );
    const storageBucket = coalesce(
      raw.storageBucket,
      raw.storage_bucket,
      process.env.FIREBASE_STORAGE_BUCKET,
      projectId ? `${projectId}.appspot.com` : undefined
    );

    const missing = [];
    if (!projectId) missing.push('projectId');
    if (!clientEmail) missing.push('clientEmail');
    if (!privateKey) missing.push('privateKey');

    if (missing.length) {
      console.error(
        '❌ adminConfig incompleto no ambiente local. Faltando:',
        missing.join(', ')
      );
      console.error(
        '➡️  Verifique backend/src/config/index.js ou variáveis .env'
      );
      throw new Error('Firebase Admin credenciais ausentes.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.includes('\\n')
          ? privateKey.replace(/\\n/g, '\n')
          : privateKey,
      }),
      storageBucket,
    });
  } else {
    // Produção (Functions Gen2 / Render com ADC)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.GCLOUD_PROJECT
        ? `${process.env.GCLOUD_PROJECT}.appspot.com`
        : undefined,
    });
  }
}

const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

export { db, auth, bucket };
