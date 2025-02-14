// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Optional: Uncomment the next line if you need analytics
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNMpXOTqmBrNxpULjIzi509wJ8WWZGEBU",
  authDomain: "task-manager-a7fe8.firebaseapp.com",
  projectId: "task-manager-a7fe8",
  storageBucket: "task-manager-a7fe8.firebasestorage.app",
  messagingSenderId: "565216164993",
  appId: "1:565216164993:web:f78531cf6c0fb116b3e180",
  measurementId: "G-QRYXTFZ57T",
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


export { db };
