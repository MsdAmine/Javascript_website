import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";

import { auth, db } from "../firebaseconfig.js"; // Correct import path for firebaseconfig.js

const button = document.getElementById("sign-up");

button.addEventListener("click", async (e) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const Confpwd = document.getElementById("ConfirmPassword").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    window.location.replace("../Home/Home.html");
  } catch (error) {
    const errorMessage = error.message;
    alert(`Error: ${errorMessage}`);
  }
});
