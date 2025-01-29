// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6yfJs_ICEC_M0lJvl3Q5_nTIbF-1nLOc",
  authDomain: "fir-authforbackend.firebaseapp.com",
  projectId: "fir-authforbackend",
  storageBucket: "fir-authforbackend.firebasestorage.app",
  messagingSenderId: "952057050344",
  appId: "1:952057050344:web:ea524c209b6a29b1a0c55d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };