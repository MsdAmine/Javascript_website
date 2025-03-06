import { db, auth } from "../firebaseConfig.js";
import {
    collection,
    getDocs,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

setTimeout(() => {
    if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        fetchMsgs(userId);
    }
}, 1000);

async function fetchMsgs(userId) {
    const messagesContainer = document.getElementById("messages-container");

    const notifications = [];
    const now = new Date();
    const moisNoms = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const mois = moisNoms[now.getMonth()];
    const jour = now.getDate();
    const date = `${jour} ${mois}`;

    const querySnapshot = await getDocs(collection(db, `users/${userId}/products`));

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        let color = "green"; // Default color

        if (data.stock < 10) {
            color = "red"; // Critical stock
        } else if (data.stock < 20) {
            color = "orange"; // Low stock
        } else if (data.stock < 30) {
            color = "yellow"; // Moderate stock
        }
        
        if(data.stock < 90){
        notifications.push({ 
            type: "Stock Alert",
            date: date,
            text: `📦 Item ${data.name} is running low (${data.stock} units left).`,
            color: color
        });
        }
    });

    function addMessage({ type, date, text, color }) {
        const messageBox = document.createElement("div");
        messageBox.classList.add("message-box");
        messageBox.style.borderLeft = `5px solid ${color}`;

        const header = document.createElement("div");
        header.classList.add("message-header");

        const titleElement = document.createElement("h3");
        titleElement.textContent = type;
        titleElement.style.color = color; // Set title color

        const dateElement = document.createElement("span");
        dateElement.classList.add("message-date");
        dateElement.textContent = date;

        header.appendChild(titleElement);
        header.appendChild(dateElement);

        const messageText = document.createElement("p");
        messageText.classList.add("message-content");
        messageText.textContent = text;

        messageBox.appendChild(header);
        messageBox.appendChild(messageText);

        messagesContainer.appendChild(messageBox);
    }

    notifications.forEach((msg) => {
        addMessage(msg);
    });
}
