// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABIpLb2WFqBAUaJ0fqeA1hu-kpr9cImRA",
  authDomain: "web-design-62abd.firebaseapp.com",
  projectId: "web-design-62abd",
  storageBucket: "web-design-62abd.appspot.com",
  messagingSenderId: "362507314184",
  appId: "1:362507314184:web:fdc0f566573a21c8bfddbd",
  measurementId: "G-X2QH7P326X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, db, auth, analytics };


