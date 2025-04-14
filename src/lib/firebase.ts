'use client'

// Import the functions you need from the SDKs you need
import {initializeApp, getApps} from 'firebase/app';
import {getAuth, Auth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZggeYnRkJrGbcaeM6v2K0aQPQZKKNep_8",
  authDomain: "codeuao.firebaseapp.com",
  projectId: "codeuao",
  storageBucket: "codeuao.appspot.com",
  messagingSenderId: "371564347648",
  appId: "1:371564347648:web:748d3982f7a00615bc73e5",
  measurementId: "G-M46DQK6CNV"
};

let _auth: Auth | null = null;
let _app: any;

// Initialize Firebase
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (getApps().length === 0) {
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
