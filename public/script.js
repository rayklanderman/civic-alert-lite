import { app } from "./firebase-config.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore(app);

// Reference to button and alert list
const alertBtn = document.getElementById("alertBtn");
const alertList = document.getElementById("alertList");

// Add alert to Firestore
alertBtn.addEventListener("click", async () => {
  const alertMessage = prompt("Enter the alert message:");
  const cityOrTown = prompt("Enter the city or town name:");

  if (alertMessage && cityOrTown) {
    try {
      await addDoc(collection(db, "alerts"), {
        message: alertMessage.trim(),
        city: cityOrTown.trim(),
        timestamp: serverTimestamp(),
      });
      loadAlerts(); // Reload alerts after adding a new one
      alert("Alert submitted successfully!"); // User feedback
    } catch (error) {
      console.error("Error adding alert: ", error);
      alert("Failed to submit alert. Please try again.");
    }
  } else {
    alert("Please enter both an alert message and a city/town name."); // Validation feedback
  }
});

// Load alerts from Firestore
async function loadAlerts() {
  try {
    const querySnapshot = await getDocs(collection(db, "alerts"));
    alertList.innerHTML = ""; // Clear current list
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      const time = data.timestamp
        ? data.timestamp.toDate().toLocaleString()
        : "N/A"; // Format timestamp
      li.textContent = `${data.message} - ${data.city} (Reported at: ${time})`; // Get message and city from Firestore
      alertList.appendChild(li); // Append to the list
    });
  } catch (error) {
    console.error("Error loading alerts: ", error);
    alert("Failed to load alerts. Please try again later."); // User feedback
  }
}

// Load alerts on page load
loadAlerts();
