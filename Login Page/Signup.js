import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

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

document.getElementById("sign-up").addEventListener("click", async (e) => {
  e.preventDefault();

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

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created", user);
      alert("Sign-up successful!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      // More detailed error handling for network issues
      if (errorCode === "auth/network-request-failed") {
        alert(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        alert("Error: " + errorMessage);
      }

      console.error("Error code:", errorCode);
      console.error("Error message:", errorMessage);
    });
});
