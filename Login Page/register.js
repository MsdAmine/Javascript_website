import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";

function ResetPwd() {
  const email = document.getElementById("email").value;
  const er = document.getElementById("Erreur");

  if (email == "") {
    er.style.display = "block";
  } else {
    er.style.display = "none";
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("email sent!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }
}

window.ResetPwd = ResetPwd;

const firebaseConfig = {
  apiKey: "AIzaSyD_P7F4nXxo_jJPxekO4icvheFUD0sVv68",
  authDomain: "javascript-7aaf4.firebaseapp.com",
  projectId: "javascript-7aaf4",
  storageBucket: "javascript-7aaf4.firebasestorage.app",
  messagingSenderId: "179968535199",
  appId: "1:179968535199:web:5f035d395b12c4c044d0aa",
  measurementId: "G-ZCZE4ZZM9Q",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("sign-in").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    window.location.replace("../Home/Home.html");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(`Error: ${errorMessage}`);
  }
});

if (document.querySelector("input[type=checkbox]").checked) {
  localStorage.setItem("user", JSON.stringify(userCredential.user));
}
