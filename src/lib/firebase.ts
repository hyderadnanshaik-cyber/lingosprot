// Firebase Client Configuration
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCh7qTnIdct1PTfECoc512wFlfzbJTjqdI",
  authDomain: "lingosprout-977ae.firebaseapp.com",
  projectId: "lingosprout-977ae",
  storageBucket: "lingosprout-977ae.firebasestorage.app",
  messagingSenderId: "989198970251",
  appId: "1:989198970251:web:981d0a01c460703796938e",
  measurementId: "G-QNMW4PNTPH",
};

// Initialize app only once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
