// firebase-config.js
// Import the necessary Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4FFFB6wLAtcXoS4EUzCvtUqd6w0Iy5uk",
  authDomain: "civic-alert-lite.firebaseapp.com",
  projectId: "civic-alert-lite",
  storageBucket: "civic-alert-lite.appspot.com",
  messagingSenderId: "784199842229",
  appId: "1:784199842229:web:bda0925ea54bfdb8cfc1fc",
  measurementId: "G-6G17WLSE2V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app }; // Export the app instance if needed
