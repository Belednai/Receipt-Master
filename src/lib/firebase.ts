// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwvJJZrQvn4Pt1A85npDVMAteY1pNvO4U",
  authDomain: "receipt-master-61b65.firebaseapp.com",
  projectId: "receipt-master-61b65",
  storageBucket: "receipt-master-61b65.firebasestorage.app",
  messagingSenderId: "175209742806",
  appId: "1:175209742806:web:11713f36cb881b41bba477",
  measurementId: "G-TH45Q4VBBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth }; 