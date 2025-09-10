import admin from 'firebase-admin';
import { config } from '../config/index.js';

// Evita inicializar mais de uma vez (quando o Nodemon reinicia, por ex.)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebaseAdmin.projectId,
      clientEmail: config.firebaseAdmin.clientEmail,
      privateKey: config.firebaseAdmin.privateKey,
    }),
    storageBucket: config.firebaseAdmin.storageBucket,
  });
}

// Exports que você pode usar nos services
const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

export { db, auth, bucket };
