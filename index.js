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
async function fetchAndDisplayProducts(userId) {
  try {
    const querySnapshot = await getDocs(
      collection(db, `users/${userId}/products`)
    );

    // Clear existing table content
    let Totalstock = 0;
    let Totalproducts = 0;
    let TotalValue = 0;
    let TotalSales = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      Totalstock += data.stock;
      Totalproducts++;
      TotalValue += data.price * data.stock;
    });

    const Stck = document.getElementById("totalStock");
    const prods = document.getElementById("totalProduct");
    const Value = document.getElementById("totalValue");
    const Sales = document.getElementById("totalSales");

    const querySnapshot2 = await getDocs(
      collection(db, `users/${userId}/sales`)
    );

    querySnapshot2.forEach((doc) => {
      const data = doc.data();
      TotalSales += data.totalPrice;
    });

    Stck.innerHTML = Totalstock;
    prods.innerHTML = Totalproducts;
    Value.innerHTML = "$" + Math.trunc(TotalValue);
    Sales.innerHTML = "$" + Math.trunc(TotalSales);
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
