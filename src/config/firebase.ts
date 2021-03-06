// Firebase configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBp-zhE2ghQCs8cHtPgJhwWlYTWCWkvav4",
  authDomain: "bike-rentals-vip.firebaseapp.com",
  projectId: "bike-rentals-vip",
  storageBucket: "bike-rentals-vip.appspot.com",
  messagingSenderId: "294986468323",
  appId: "1:294986468323:web:d1c719f378d8ee2e706ed6",
  measurementId: "G-FG1EGMJQ7G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, db };
