// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, inMemoryPersistence } from 'firebase/auth';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!apiKey || apiKey === 'YOUR_FIREBASE_WEB_API_KEY') {
    throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is not set in .env. Please follow the instructions in README.md.");
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// It's recommended to initialize auth specifically to control its state.
const auth = getAuth(app);

// This ensures that auth state is managed correctly, especially in a server-rendering context.
// `indexedDBLocalPersistence` is the default and is fine for most web apps.
// If you were having issues with SSR/sessions, this would be a place to look.
// For this app, the default persistence is appropriate.

export { app, db, auth };
