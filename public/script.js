import { app } from "./firebase-config.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore(app);

// Reference to form and alert list
const alertForm = document.getElementById("alertForm");
const alertList = document.getElementById("alertList");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let alertsDisplayed = 3; // Number of alerts displayed initially

// Add alert to Firestore on form submission
alertForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent form from reloading the page

  const alertMessage = document.getElementById("alertMessage").value.trim();
  const cityOrTown = document.getElementById("cityOrTown").value.trim();
  const actionDept = document.getElementById("actionDept").value.trim();
  const intensity = document.getElementById("intensity").value.trim();
  const resources = document.getElementById("resources").value.trim();

  if (alertMessage && cityOrTown) {
    try {
      await addDoc(collection(db, "alerts"), {
        message: alertMessage,
        city: cityOrTown,
        actionDept: actionDept,
        intensity: intensity,
        resources: resources,
        timestamp: serverTimestamp(),
      });
      loadAlerts(); // Reload alerts after adding a new one
      alert("Alert submitted successfully!"); // User feedback
      alertForm.reset(); // Clear the form
    } catch (error) {
      console.error("Error adding alert: ", error);
      alert("Failed to submit alert. Please try again.");
    }
  } else {
    alert("Please fill in all compulsory fields."); // Validation feedback
  }
});

// Load alerts from Firestore (initially the latest 3)
async function loadAlerts(limitNum = 3) {
  try {
    const q = query(
      collection(db, "alerts"),
      orderBy("timestamp", "desc"),
      limit(limitNum)
    );
    const querySnapshot = await getDocs(q);
    alertList.innerHTML = ""; // Clear current list before displaying new alerts
    querySnapshot.forEach((doc) => {
      const alertData = doc.data();
      const alertItem = document.createElement("li");
      alertItem.classList.add("alert-item");
      alertItem.innerHTML = `
        <strong>${alertData.city}</strong>: ${alertData.message}<br>
        ${
          alertData.actionDept
            ? `<em>Action Department: ${alertData.actionDept}</em><br>`
            : ""
        }
        ${
          alertData.intensity
            ? `<strong>Intensity: ${alertData.intensity}</strong><br>`
            : ""
        }
        ${
          alertData.resources
            ? `<em>Resources: ${alertData.resources}</em>`
            : ""
        }
      `;
      alertList.appendChild(alertItem);
    });
  } catch (error) {
    console.error("Error loading alerts: ", error);
  }
}

// Load more alerts when the button is clicked
loadMoreBtn.addEventListener("click", () => {
  alertsDisplayed += 3; // Increase the number of alerts displayed
  loadAlerts(alertsDisplayed); // Load the updated number of alerts
});

// Load initial alerts
loadAlerts(alertsDisplayed);
