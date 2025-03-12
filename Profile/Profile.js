import { db, auth } from "../firebaseConfig.js";
import {
    signOut,
    onAuthStateChanged,
    updateEmail,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
    collection,
    getDocs,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

let userId = ""

onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid;

        try {
            const usernameSnapshot = await getDocs(collection(db, `users/${userId}/user`));
            let username = "";
            const userEmail = user.email;

            usernameSnapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.username) {
                    username = userData.username;
                }
            });

            document.getElementById("full-name").placeholder = username;
            document.getElementById("email").placeholder = userEmail;
        } catch (error) {
            console.error("Error fetching username:", error);
        }
    } else {
        console.error("No user signed in.");
        alert("You must be logged in.");
        window.location.href = "/Login Page/Login_page.html";
    }
});

async function usernameUpdate(fullName) {

    try {
        const data = { username: fullName.value.trim() };

        const userRef = doc(db, `users/${userId}/user/${userId}`);
        await setDoc(userRef, data);

        console.log("Username updated successfully!");

        document.getElementById("full-name").value = "";
    } catch (error) {
        console.log(error);
    }

}

async function emailUpdate(email) {
    const user = auth.currentUser;

    try {
        await updateEmail(user, email.value);
        console.log("Email updated successfully!");

        document.getElementById("email").value = "";
    } catch (error) {
        console.log(error)
    }

}

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = document.getElementById("full-name");
    const email = document.getElementById("email");
    
    if (fullName.value.trim() !== "") {
        usernameUpdate(fullName);
    }

    if (email.value.trim() !== "") {
        emailUpdate(email)
    }

})

const logoutBtn = document.getElementById('logout');

logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("User logged out successfully!");
        window.location.href = "/Login Page/Login_page.html";
    })
        .catch((error) => {
            console.error("Error logging out:", error);
        });
});