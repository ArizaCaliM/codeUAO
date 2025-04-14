'use client'

// Import the functions you need from the SDKs you need
import {initializeApp, getApps} from 'firebase/app';
import {getAuth, Auth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let _auth: Auth | null = null;
let _app: any;

// Initialize Firebase
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (getApps().length === 0) {
      if (!firebaseConfig.apiKey ||
          !firebaseConfig.authDomain ||
          !firebaseConfig.projectId ||
          !firebaseConfig.storageBucket ||
          !firebaseConfig.messagingSenderId ||
          !firebaseConfig.appId) {
        console.error("Firebase configuration is incomplete. Check your environment variables.");
        return null;
      }
      _app = initializeApp(firebaseConfig);
      _auth = getAuth(_app);
      console.log("Firebase initialized successfully.");
    } else {
      _app = getApps()[0]; // Use existing app
      if (!_auth) {
        _auth = getAuth(_app);
      }
      console.log("Using existing Firebase app.");
    }
    return _auth;
  } catch (error: any) {
    console.error("Firebase initialization error:", error.message);
    return null;
  }
};

export const auth = () => {
  if (!_auth) {
    _auth = initializeFirebase();
    if (!_auth) {
      console.error("Failed to initialize Firebase Auth.");
      return null;
    }
  }
  return _auth;
};
