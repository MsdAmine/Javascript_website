import { db, auth } from "../firebaseConfig.js";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

async function fetchAndDisplayRanking(userId) {
    const salesRef = collection(db, `users/${userId}/sales`);
    const salesSnapshot = await getDocs(salesRef);

    const sales = [];

    for (const saleDoc of salesSnapshot.docs) {
      const saleData = saleDoc.data();
      const productDoc = await getDoc(doc(db, `users/${userId}/products/${saleData.productId}`));

  
      if (productDoc.exists()) {
        const productId = productDoc.id;
        const productData = productDoc.data();
        const saleAmount = saleData.quantity * saleData.price;
  
        // Check if the product already exists in the sales array
        const existingSale = sales.find(sale => sale.productId === productId);
  
        if (existingSale) {
          // Update the existing product's total price & quantity
          existingSale.totalPrice += saleAmount;
          existingSale.totalQuantity += saleData.quantity;
        } else {
          // Add a new entry for this product
          sales.push({
            productId,
            productData,
            totalPrice: saleAmount,
            totalQuantity: saleData.quantity,
          });
        }
      } else {
        console.warn(`Product not found for sale ID: ${saleDoc.id}`);
      }
    }

    const rankingTbody = document.getElementById("ranking-tbody");
    rankingTbody.innerHTML = "";


  sales.forEach((sale) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${sale.productData.name || "Unknown"}</td>
      <td>${sale.quantity}</td>
      <td>${totalPrice}</td>
    `;
    rankingTbody.appendChild(row);
  });
  
    
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        setInterval(()=> {
            fetchAndDisplayRanking(user.uid);
        },2000)
    } else {
        alert("Please sign in to view your ranking.");
    }
});