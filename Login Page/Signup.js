import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";

import { auth } from "../firebaseConfig.js"; // Correct import path for firebaseconfig.js


document.getElementById("sign-up-text").addEventListener("click", async () => {
    document.getElementById("sign-up").addEventListener("click", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const name = document.getElementById("name").value;
        const Confpwd = document.getElementById("ConfirmPassword").value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            window.location.replace("../Home/Home.html");
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert("The email address is already in use by another account.");
            } else {
                alert(`Error: ${error.message}`);
            }
        }
    });
})





