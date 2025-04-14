// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let _auth: Auth;

// Initialize Firebase
try {
  const app = initializeApp(firebaseConfig);
  _auth = getAuth(app);
} catch (error: any) {
  console.error("Firebase initialization error:", error.message);
  // Only throw if not already initialized
  if (!/already exists/.test(error.message)) {
    throw new Error("Firebase initialization failed. Check your environment variables.");
  }
}

export const auth = () => {
  if (!_auth) {
    try {
      const app = initializeApp(firebaseConfig);
      _auth = getAuth(app);
    } catch (error: any) {
      console.error("Firebase initialization error:", error.message);
      throw new Error("Firebase initialization failed. Check your environment variables.");
    }
  }
  return _auth;
}
