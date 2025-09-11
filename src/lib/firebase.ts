import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZ992LyrF6sHuGyhfvouYKewV4mqoE_ms",
  authDomain: "ainterview-382f7.firebaseapp.com",
  projectId: "ainterview-382f7",
  storageBucket: "ainterview-382f7.firebasestorage.app",
  messagingSenderId: "843199831153",
  appId: "1:843199831153:web:e473eebd88678d76f6cfd0",
  measurementId: "G-CYP2KRCMZC"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;