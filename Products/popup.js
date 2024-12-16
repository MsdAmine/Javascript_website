// Get elements
const popup = document.getElementById("popup");
const openPopupBtn = document.getElementById("open-popup-btn");
const closeBtn = document.getElementById("close-btn");
const productForm = document.getElementById("productForm");

// Open the popup
openPopupBtn.addEventListener("click", () => {
  popup.classList.add("visible");
});

// Close the popup
closeBtn.addEventListener("click", () => {
  popup.classList.remove("visible");
});

window.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.classList.remove("visible");
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { fetchAndDisplayProducts } from "./products.js";

import { db, auth } from "../firebaseConfig.js";

async function addData(uid, data) {
  try {
    const docRef = await addDoc(collection(db, `users/${uid}/products`), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}

// Handle form submission
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const stock = parseInt(document.getElementById("stock").value, 10);

  const formData = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value),
    stock: stock,
    category: document.getElementById("category").value,
    supplier: document.getElementById("supplier").value,
    isAvailable: stock === 0 ? false : true,
    createdAt: serverTimestamp(),
  };

  console.log("Form data to save:", formData);

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("You need to be signed in to add a product.");
      return;
    }

    const uid = user.uid;
    const docId = await addData(uid, formData);
    console.log("Product added with ID:", docId);

    const tableBody = document.getElementById("products-tbody");
    tableBody.innerHTML = "";
    await fetchAndDisplayProducts(uid);

    productForm.reset();
    popup.classList.remove("visible");
  } catch (e) {
    alert("Failed to add product. Please try again.");
  }
});

// Check user authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user.uid);
  } else {
    console.log("No user signed in.");
  }
});
