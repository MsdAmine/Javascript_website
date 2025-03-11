import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("sign-up").addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.getElementById("name").value;
  const email = document.getElementById("email2").value;
  const password = document.getElementById("password2").value;
  const confirmPassword = document.getElementById("ConfirmPassword").value;

  if (!email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created", user);
    alert("Sign-up successful!");

    const data = { username: username };

    const userRef = collection(db, `users/${user.uid}/user`);
    const docRef = await addDoc(userRef, data);

    console.log("Document written with ID:", docRef.id);
  } catch (error) {
    console.error("Error during sign-up:", error);
    alert(`Error: ${error.message}`);
  }
});
