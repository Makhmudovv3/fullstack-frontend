import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDxOs6WW72TZsshgVw5x14DZRARpZq3R44",
    authDomain: "exam-61d7c.firebaseapp.com",
    projectId: "exam-61d7c",
    storageBucket: "exam-61d7c.firebasestorage.app",
    messagingSenderId: "445775113807",
    appId: "1:445775113807:web:6f3989ff90b3775e34843a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();