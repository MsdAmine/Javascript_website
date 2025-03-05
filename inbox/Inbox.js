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
    const messagesContainer = document.getElementById("messages-container");

    const notifications = [];

    const querySnapshot = await getDocs(
        collection(db, `users/${userId}/products`)
    );

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.stock < 18) {
            notifications.push({ type: "Stock Alert", text: `📦 Item ${data.name} is running low (${data.stock} units left).` });
        }
    });

    function addMessage(type, text) {
        const messageBox = document.createElement("div");
        messageBox.classList.add("message-box");

        const title = document.createElement("span");
        title.classList.add("message-title");
        title.textContent = type;

        const messageText = document.createElement("p");
        messageText.textContent = text;

        messageBox.appendChild(title);
        messageBox.appendChild(messageText);
        messagesContainer.appendChild(messageBox);
    }

    notifications.forEach((msg, index) => {
        setTimeout(() => addMessage(msg.type, msg.text), index * 200);
    });
}


