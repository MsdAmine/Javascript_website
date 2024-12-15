import { db, auth } from "../firebaseConfig.js";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

async function fetchAndDisplayProducts(userId) {
  const tableBody = document.getElementById("products-tbody");
  const querySnapshot = await getDocs(
    collection(db, `users/${userId}/products`)
  );
  tableBody.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const docId = doc.id;

    const row = document.createElement("tr");
    row.innerHTML = `
      <tr>
        <td>${data.name}</td>
        <td>${data.description}</td>
        <td>${data.price}</td>
        <td>${data.stock}</td>
        <td>${data.category}</td>
        <td>${data.supplier}</td>
        <td>${data.isAvailable ? "Yes" : "No"}</td>
        <td class="actions">
          <div data-id="${docId}" class="sold"><i class="fa-solid fa-cart-plus"></i></div>
          <div data-id="${docId}" class="edit-icon"><i class="fa-solid fa-pen"></i></div>
          <div data-id="${docId}" class="delete-icon"><i class="fa-solid fa-trash"></i></div>
        </td>
      </tr>
    `;
    tableBody.appendChild(row);
  });

  addDeleteListeners();
  addEditListeners();
  addSoldListeners();
}

async function deleteProduct(userId, productId) {
  try {
    const productRef = doc(db, `users/${userId}/products`, productId);
    await deleteDoc(productRef);
    console.log(`Product ${productId} deleted successfully.`);
    alert("Product deleted successfully!");
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product.");
  }
}

async function editProduct(productId) {
  try {
    // Fetch the product data
    const userId = auth.currentUser.uid;
    const productRef = doc(db, `users/${userId}/products`, productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const productData = productDoc.data();

      // Populate the edit form with existing data
      document.getElementById("edit-name").value = productData.name;
      document.getElementById("edit-description").value =
        productData.description;
      document.getElementById("edit-price").value = productData.price;
      document.getElementById("edit-stock").value = productData.stock;
      document.getElementById("edit-category").value = productData.category;
      document.getElementById("edit-supplier").value = productData.supplier;
      document.getElementById("edit-product-id").value = productId;

      document.getElementById("edit-modal").classList.add("visible");
    } else {
      alert("Product not found!");
    }
  } catch (error) {
    console.error("Error fetching product for editing:", error);
    alert("Failed to fetch product data.");
  }
}

document
  .getElementById("edit-product-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const productId = document.getElementById("edit-product-id").value;
    const userId = auth.currentUser.uid;

    // Retrieve updated product data from the form
    const stockValue = Number(document.getElementById("edit-stock").value);

    const updatedProduct = {
      name: document.getElementById("edit-name").value,
      description: document.getElementById("edit-description").value,
      price: Number(document.getElementById("edit-price").value),
      stock: stockValue,
      category: document.getElementById("edit-category").value,
      supplier: document.getElementById("edit-supplier").value,
      isAvailable: stockValue > 0,
    };

    try {
      const productRef = doc(db, `users/${userId}/products`, productId);
      await updateDoc(productRef, updatedProduct);

      alert("Product updated successfully!");

      document.getElementById("edit-modal").classList.remove("visible");

      // refresh table
      fetchAndDisplayProducts(userId);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  });

// Add delete button listeners
function addDeleteListeners() {
  const deleteIcons = document.querySelectorAll(".delete-icon");

  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", async () => {
      const productId = icon.getAttribute("data-id");
      const userId = auth.currentUser.uid;

      await deleteProduct(userId, productId);
      icon.closest("tr").remove();
    });
  });
}

// Add edit button listeners
function addEditListeners() {
  const editIcons = document.querySelectorAll(".edit-icon");

  editIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const productId = icon.getAttribute("data-id");
      editProduct(productId);
    });
  });
}

function addSoldListeners() {
  const soldIcons = document.querySelectorAll(".sold");

  soldIcons.forEach((icon) => {
    icon.addEventListener("click", async () => {
      const productId = icon.getAttribute("data-id");
      const userId = auth.currentUser.uid;

      // Fetch product data
      const productRef = doc(db, `users/${userId}/products`, productId);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        const productData = productDoc.data();

        // Populate sales modal
        document.getElementById("sales-product").value = productData.name;
        document
          .getElementById("sales-modal")
          .setAttribute("data-id", productId);
        document.getElementById("sales-modal").classList.add("visible");
      } else {
        alert("Product not found!");
      }
    });
  });
}

// Handle Sales Form Submission
document.getElementById("sales-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const productId = document
    .getElementById("sales-modal")
    .getAttribute("data-id");
  const userId = auth.currentUser.uid;
  const quantitySold = Number(document.getElementById("sales-quantity").value);
  const customer = document.getElementById("sales-customer").value || "Unknown";

  try {
    const productRef = doc(db, `users/${userId}/products`, productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const productData = productDoc.data();
      const newStock = productData.stock - quantitySold;

      if (newStock < 0) {
        alert("Insufficient stock!");
        return;
      }

      // Calculate total price
      const totalPrice = productData.price * quantitySold;

      // Add sale data to Firestore
      const salesRef = collection(db, `users/${userId}/sales`);
      await addDoc(salesRef, {
        productId: productRef,
        quantity: quantitySold,
        totalPrice: totalPrice,
        customer: customer,
        date: serverTimestamp(),
      });

      // Update product stock
      await updateDoc(productRef, {
        stock: newStock,
        isAvailable: newStock > 0,
      });

      alert("Sale recorded successfully!");
      document.getElementById("sales-modal").classList.remove("visible");

      // Refresh products table
      fetchAndDisplayProducts(userId);
    } else {
      alert("Product not found!");
    }
  } catch (error) {
    console.error("Error recording sale:", error);
    alert("Failed to record sale.");
  }
});

// Listen for authentication state change
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchAndDisplayProducts(user.uid);
  } else {
    alert("Please sign in to view your products.");
  }
});
