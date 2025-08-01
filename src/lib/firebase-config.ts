// Firebase configuration - enabled for Google Authentication and Firestore
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

// Initialize Analytics conditionally (only in production)
let analytics = null;
isSupported().then(yes => yes ? getAnalytics(app) : null).then(analyticsInstance => {
  analytics = analyticsInstance;
});

const db = getFirestore(app);
const auth = getAuth(app);

// Configure auth settings for development
if (process.env.NODE_ENV === 'development') {
  auth.useDeviceLanguage();
  auth.settings.appVerificationDisabledForTesting = true;
}

export { app, analytics, db, auth }; 