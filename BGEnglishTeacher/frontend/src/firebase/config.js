// frontend/src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDsfJJzoEq3npO3pqVGp1fJvfMxvYhBXAI',
  authDomain: 'bg-english-teacher.firebaseapp.com',
  projectId: 'bg-english-teacher',
  storageBucket: 'bg-english-teacher.appspot.com',
  messagingSenderId: '990029545053',
  appId: '1:990029545053:web:c22400633c5ecffdb1d7b4',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, storage, auth };
