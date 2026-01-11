// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// below credentials are removed and replaced with '*'
const firebaseConfig = {
  apiKey: "*************************************",
  authDomain: "**********.firebaseapp.com",
  databaseURL:
    "*******************************************************************",
  projectId: "no-title-*****",
  storageBucket: "no-title-**************",
  messagingSenderId: "***************",
  appId: "*************************************************",
  measurementId: "G-**********",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);
const authent: Auth = getAuth(app);
const db = getFirestore(app);

export { authent, analytics, db, app };
