import { db, auth } from "../firebaseConfig.js";
import {
  collection,
  getDocs,
  doc,
  query,
  orderBy,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

async function fetchSalesWithProducts(userId) {
  const salesRef = collection(db, `users/${userId}/sales`);
  const salesQuery = query(salesRef, orderBy("date", "desc"));
  const salesSnapshot = await getDocs(salesQuery);

  const sales = [];

  for (const saleDoc of salesSnapshot.docs) {
    const saleData = saleDoc.data();
    const productDoc = await getDoc(saleData.productId);

    if (productDoc.exists()) {
      sales.push({
        ...saleData,
        productId: productDoc.id,
        productData: productDoc.data(),
      });
    } else {
      console.warn(`Product not found for sale ID: ${saleDoc.id}`);
    }
  }

  return sales;
}

async function populateSalesTable(userId) {
  const salesTbody = document.getElementById("sales-tbody");
  salesTbody.innerHTML = "";

  const sales = await fetchSalesWithProducts(userId);

  sales.forEach((sale) => {
    const row = document.createElement("tr");
    const totalPrice = sale.totalPrice ? sale.totalPrice.toFixed(2) : "N/A";

    row.innerHTML = `
      <td>${sale.productData.name || "Unknown"}</td>
      <td>${sale.quantity}</td>
      <td>${totalPrice}</td>
      <td>${new Date(sale.date.seconds * 1000).toLocaleString()}</td>
      <td>${sale.customer || "N/A"}</td>
    `;
    salesTbody.appendChild(row);
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    populateSalesTable(user.uid);
  } else {
    console.error("User not authenticated.");
  }
});
