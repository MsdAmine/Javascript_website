import { auth } from "../firebaseConfig.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const logoutBtn = document.getElementById('logout'); 

logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out successfully!");
            window.location.href = "/Login Page/Login_page.html";
        })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
});