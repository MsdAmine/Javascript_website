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
    try {
        const salesRef = collection(db, `users/${userId}/sales`);
        const salesSnapshot = await getDocs(salesRef);
        const sales = [];
        const processedErrors = new Set(); // Track already reported errors
        
        for (const saleDoc of salesSnapshot.docs) {
            const saleData = saleDoc.data();
            const saleId = saleDoc.id;
            
            // Extract product ID from various possible formats
            let productId;
            try {
                if (typeof saleData.productId === 'string') {
                    productId = saleData.productId;
                } else if (saleData.productId && saleData.productId.id) {
                    productId = saleData.productId.id;
                } else if (saleData.productId && saleData.productId.path) {
                    const pathParts = saleData.productId.path.split('/');
                    productId = pathParts[pathParts.length - 1];
                } else {
                    // Skip invalid product IDs without logging repeatedly
                    const errorKey = `invalid-${saleId}`;
                    if (!processedErrors.has(errorKey)) {
                        console.warn(`Sale ${saleId} has invalid productId format`, saleData.productId);
                        processedErrors.add(errorKey);
                    }
                    continue;
                }
                
                const productDocRef = doc(db, `users/${userId}/products/${productId}`);
                const productDoc = await getDoc(productDocRef);
                
                if (productDoc.exists()) {
                    const productData = productDoc.data();
                    
                    // Use the appropriate price (from product or sale)
                    const unitPrice = saleData.totalPrice / saleData.quantity;
                    const saleAmount = saleData.quantity * unitPrice;
                    
                    // Check if the product already exists in our sales array
                    const existingSale = sales.find(sale => sale.productId === productId);
                    
                    if (existingSale) {
                        // Update existing entry
                        existingSale.totalPrice += saleAmount;
                        existingSale.totalQuantity += saleData.quantity;
                    } else {
                        // Add new entry
                        sales.push({
                            productId,
                            productName: productData.name,
                            category: productData.category,
                            totalPrice: saleAmount,
                            totalQuantity: saleData.quantity,
                        });
                    }
                } else {
                    // Product not found - only log each missing product once
                    const errorKey = `missing-${productId}`;
                    if (!processedErrors.has(errorKey)) {
                        console.warn(`Product not found for sale ID: ${saleId}. The product may have been deleted.`);
                        processedErrors.add(errorKey);
                    }
                    continue;
                }
            } catch (error) {
                console.error(`Error processing sale ${saleId}:`, error);
            }
        }
        
        // Sort by quantity sold (descending)
        sales.sort((a, b) => b.totalQuantity - a.totalQuantity);
        
        // Update the UI
        const rankingTbody = document.getElementById("ranking-tbody");
        if (!rankingTbody) {
            console.error("Element with ID 'ranking-tbody' not found");
            return;
        }
        
        rankingTbody.innerHTML = "";
        
        if (sales.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = '<td colspan="4">No sales data found</td>';
            rankingTbody.appendChild(row);
            return;
        }
        
        sales.forEach((sale, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${sale.productName || "Unknown"}</td>
                <td>${sale.totalQuantity}</td>
                <td>${sale.totalPrice.toFixed(2)} MAD</td>
            `;
            rankingTbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching and displaying ranking:", error);
    }
}

// Keep track of the interval ID globally
let rankingIntervalId = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Clear any existing interval
        if (rankingIntervalId) {
            clearInterval(rankingIntervalId);
        }
        
        // Initial fetch
        fetchAndDisplayRanking(user.uid);
        
        // Set up interval with reduced frequency to minimize console spam
        rankingIntervalId = setInterval(() => {
            fetchAndDisplayRanking(user.uid);
        }, 10000); // Update every 10 seconds instead of 2 seconds
    } else {
        // Clear interval if exists
        if (rankingIntervalId) {
            clearInterval(rankingIntervalId);
            rankingIntervalId = null;
        }
        
        const rankingTbody = document.getElementById("ranking-tbody");
        if (rankingTbody) {
            rankingTbody.innerHTML = '<tr><td colspan="4">Please sign in to view sales ranking</td></tr>';
        }
    }
});