// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyBDJgbD0wPKmdDwtmxfV0-r_O3tqEmgFp4",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "electcode-615de.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "electcode-615de",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "electcode-615de.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "371973047241",
  appId: env.VITE_FIREBASE_APP_ID || "1:371973047241:web:29a7fb06355c4d26c49e18",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-FDL59WLQDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };