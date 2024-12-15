import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

import { auth } from "../firebaseConfig.js";

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

const button = document.getElementById("sign-in");

button.addEventListener("click", async (e) => {
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
