import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_P7F4nXxo_jJPxekO4icvheFUD0sVv68",
  authDomain: "javascript-7aaf4.firebaseapp.com",
  projectId: "javascript-7aaf4",
  storageBucket: "javascript-7aaf4.firebasestorage.app",
  messagingSenderId: "179968535199",
  appId: "1:179968535199:web:5f035d395b12c4c044d0aa",
  measurementId: "G-ZCZE4ZZM9Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase services
export { app, db, auth };
