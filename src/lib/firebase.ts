import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAh22GQ9-e4qgOY9CSG4gSApEBmL3e8kaE",
  authDomain: "my-personal-web-bc6c9.firebaseapp.com",
  projectId: "my-personal-web-bc6c9",
  storageBucket: "my-personal-web-bc6c9.firebasestorage.app",
  messagingSenderId: "933348236508",
  appId: "1:933348236508:web:267ec4dec0cd1b0b4f2819"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
