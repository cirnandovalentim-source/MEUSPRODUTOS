import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Using the provided config
const firebaseConfig = {
  projectId: "gen-lang-client-0514537479",
  appId: "1:670035098282:web:f99a3052e809ab70826ed3",
  apiKey: "AIzaSyDAEXQFFpN1Y_5dZ3SvKkU2tnCfzjFNDRg",
  authDomain: "gen-lang-client-0514537479.firebaseapp.com",
  storageBucket: "gen-lang-client-0514537479.firebasestorage.app",
  messagingSenderId: "670035098282"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-4b1f6950-bbfd-4039-820e-33a81478277d");
export const auth = getAuth(app);
export const storage = getStorage(app);
