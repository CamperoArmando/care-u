import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2CcMC_5dpHZkSExDNIZqZHwNqjl0ad28",
  authDomain: "care-u-380a1.firebaseapp.com",
  projectId: "care-u-380a1",
  storageBucket: "care-u-380a1.firebasestorage.app",
  messagingSenderId: "223502986073",
  appId: "1:223502986073:web:799d48dbb3279d16af3a48",
  measurementId: "G-Q8FN9CPL8M"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
