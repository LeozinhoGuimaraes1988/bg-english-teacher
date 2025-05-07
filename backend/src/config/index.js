import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('🔍 PORT:', process.env.PORT);
export const config = {
  server: {
    port: process.env.PORT || 4000,
    env: process.env.NODE_ENV || 'development',
  },

  frontendUrl: process.env.FRONTEND_URL, // URL do frontend

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },

  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  },

  session: {
    secret: process.env.SESSION_SECRET,
  },
};
