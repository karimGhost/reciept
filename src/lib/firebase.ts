import { initializeApp,getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhV7QaQeBxITxtd2iTT61w4SEh0ejqrmA",
  authDomain: "sultantechcomputers.firebaseapp.com",
  projectId: "sultantechcomputers",
  storageBucket: "sultantechcomputers.firebasestorage.app",
  messagingSenderId: "999539981601",
  appId: "1:999539981601:web:380ba0f667c259e8f6d260",
  measurementId: "G-2SSFQV8Y2G"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
