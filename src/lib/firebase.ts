"use client";

// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, Auth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from 'react';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let _app: any;

function initializeFirebase() {
  if (!firebaseConfig ||
      !firebaseConfig.apiKey ||
      !firebaseConfig.authDomain ||
      !firebaseConfig.projectId ||
      !firebaseConfig.storageBucket ||
      !firebaseConfig.messagingSenderId ||
      !firebaseConfig.appId) {
    console.error("Firebase configuration is incomplete. Check your environment variables.");
    return null;
  }
  try {
    _app = initializeApp(firebaseConfig);
    return _app;
  } catch (error: any) {
    console.error("Firebase initialization error:", error.message);
    return null;
  }
}


export function useFirebaseAuth() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const app = initializeFirebase();
    if (app) {
      const authInstance = getAuth(app);
      setAuth(authInstance);

      const unsubscribe = onAuthStateChanged(authInstance, (authUser) => {
        if (authUser) {
          setUser(authUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  return { auth, user, loading };
}

export default initializeFirebase;
