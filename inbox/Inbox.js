import { db, auth } from "../firebaseConfig.js";
import {
    collection,
    getDocs,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";


setTimeout(() => {
    const userId = auth.currentUser.uid;

    fetchMsgs(userId);
}, 1000);

async function fetchMsgs(userId) {
    const msg = document.getElementById("msg");
    const messagesContainer = document.getElementById("messages-container");

    const notifications = [
        { type: "", text: "" },
    ];

    const querySnapshot = await getDocs(
        collection(db, `users/${userId}/products`)
    );

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.stock < 18) {
            notifications.push({ type: "stock", text: `📦 Stock Alert: Item #A123 is running low (${data.stock} units left).` })
        }
        console.log(data.stock);
    });

    function addMessage(text) {
        const message = document.createElement("p");
        message.textContent = text;
        message.classList.add("message");
        messagesContainer.appendChild(message);
    }

    // Simulate incoming messages (e.g., real-time updates)
    notifications.forEach((msg, index) => {
        setTimeout(() => addMessage(msg.text), index * 1000); // Add messages with delay
    });
}

