import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPUBLxpOHtnBvUYiFEttXPFzRdInTz4Jw",
  authDomain: "payper-ed7d7.firebaseapp.com",
  projectId: "payper-ed7d7",
  storageBucket: "payper-ed7d7.appspot.com",
  messagingSenderId: "808586165421",
  appId: "1:808586165421:web:8c7eb258c3876cd3271a24"
};         

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const provider = new GoogleAuthProvider();
const database = getDatabase(app);
