// script.js
import { app } from "./firebase-config.js"; // Ensure to import the app instance if used
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore(app);

// Reference to button and alert list
const alertBtn = document.getElementById("alertBtn");
const alertList = document.getElementById("alertList");

// Add alert to Firestore
alertBtn.addEventListener("click", async () => {
  const alertMessage = prompt("Enter the alert message:");
  if (alertMessage) {
    try {
      await addDoc(collection(db, "alerts"), {
        message: alertMessage,
        timestamp: new Date(),
      });
      loadAlerts(); // Reload alerts after adding a new one
    } catch (error) {
      console.error("Error adding alert: ", error);
    }
  }
});

// Load alerts from Firestore
async function loadAlerts() {
  try {
    const querySnapshot = await getDocs(collection(db, "alerts"));
    alertList.innerHTML = ""; // Clear current list
    querySnapshot.forEach((doc) => {
      const li = document.createElement("li");
      li.textContent = doc.data().message; // Get message from Firestore
      alertList.appendChild(li); // Append to the list
    });
  } catch (error) {
    console.error("Error loading alerts: ", error);
  }
}

// Load alerts on page load
loadAlerts();
