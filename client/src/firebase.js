// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realestate-6e4dc.firebaseapp.com",
  projectId: "mern-realestate-6e4dc",
  storageBucket: "mern-realestate-6e4dc.appspot.com",
  messagingSenderId: "662011064279",
  appId: "1:662011064279:web:5a1d8e394ea1e66ad6a592"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);