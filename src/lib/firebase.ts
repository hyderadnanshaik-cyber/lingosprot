// Firebase Client Configuration
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCh7qTnIdct1PTfECoc512wFlfzbJTjqdI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lingosprout-977ae.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lingosprout-977ae",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lingosprout-977ae.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "989198970251",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:989198970251:web:981d0a01c460703796938e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QNMW4PNTPH",
};

// Initialize app only once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
