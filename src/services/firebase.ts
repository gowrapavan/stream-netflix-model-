import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4fM9yww8wCUSW4I5mA6Ijc4P0aDmQrZY",
  authDomain: "netflix-db313.firebaseapp.com",
  projectId: "netflix-db313",
  storageBucket: "netflix-db313.firebasestorage.app",
  messagingSenderId: "135508907284",
  appId: "1:135508907284:web:eb82d53578bb662140de01",
  measurementId: "G-BJ82BBL3RL"
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);