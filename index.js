import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  query,
  doc,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;
      fetchAndDisplayProducts(userId);
    } else {
      console.error("No user signed in.");
      alert("Please sign in to view your products.");
    }
  });
});

// Fetch and display products
export async function fetchAndDisplayProducts(userId) {
  try {
    // Fetch products collection for the authenticated user
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/products`)
    );

    // Clear existing table content
    let Totalstock = 0;
    let Totalproducts = 0;
    let TotalValue = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      Totalstock += data.stock;
      Totalproducts++;
      TotalValue += data.price * data.stock;
    });

    const Stck = document.getElementById("totalStock");
    const prods = document.getElementById("totalProduct");
    const Value = document.getElementById("totalValue");

    Stck.innerHTML = Totalstock;
    prods.innerHTML = Totalproducts;
    Value.innerHTML = "$" + Math.trunc(TotalValue);
  } catch (error) {
    console.error("Error fetching products:", error);
    alert("Failed to load products.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;

    if (!user && currentPath !== "/login.html") {
      // Redirect to login if not authenticated
      window.location.href = "/login.html";
    } else if (user && currentPath === "/login.html") {
      // Redirect to the home page if already logged in
      window.location.href = "/index.html";
    }
  });
});

async function fetchCategoryValues(userId) {
  const categoryValues = {};

  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/products`)
    );

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const category = product.category;
      const value = product.price * product.stock;

      if (!categoryValues[category]) {
        categoryValues[category] = 0;
      }
      categoryValues[category] += value;
    });

    return categoryValues;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return {};
  }
}
