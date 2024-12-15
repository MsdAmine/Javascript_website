import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { auth, db } from "../firebaseConfig.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

async function prepareChartData(userId) {
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
  } catch (error) {
    console.error("Error preparing chart data:", error);
  }

  const labels = Object.keys(categoryValues);
  const data = Object.values(categoryValues);

  return { labels, data };
}

async function renderChart(userId) {
  const { labels, data } = await prepareChartData(userId);

  const ctx = document.getElementById("categoryChart").getContext("2d");
  new Chart(ctx, {
    type: "bar", // Change to 'pie', 'doughnut', etc., if needed
    data: {
      labels: labels,

      datasets: [
        {
          label: "Warehouse Value by Category",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        x: {
          ticks: {
            font: {
              size: 16, // Change the font size of the X-axis labels
            },
          },
        },
        y: {
          ticks: {
            font: {
              size: 16, // Change the font size of the X-axis labels
            },
          },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 16, // Change the font size of the legend labels
            },
          },
        },
        tooltip: {
          bodyFont: {
            size: 16, // Change the font size of the tooltips
          },
        },
      },
    },
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user.uid);

    // Pass the authenticated user's ID to your function
    renderChart(user.uid);
  } else {
    console.log("No user signed in.");
    alert("Please sign in to view the chart.");
  }
});
