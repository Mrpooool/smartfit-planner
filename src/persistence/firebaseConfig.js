import { initializeApp } from "firebase/app";

// TODO: Replace with your own Firebase project config.
// Get this from Firebase Console → Project Settings → Your apps → SDK setup
const config = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const firebaseApp = initializeApp(config);
