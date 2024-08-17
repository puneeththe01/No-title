// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiqoCwdiWaQkUddiPAFN5jOtgf1hCCtqo",
  authDomain: "no-title-6669e.firebaseapp.com",
  databaseURL:
    "https://no-title-6669e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "no-title-6669e",
  storageBucket: "no-title-6669e.appspot.com",
  messagingSenderId: "770850130178",
  appId: "1:770850130178:web:95c8e9d8300099ee6f1a1b",
  measurementId: "G-CC276L8673",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);
const authent: Auth = getAuth(app);
const db = getFirestore(app);

export { authent, analytics, db, app };
