// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0Q56prEA5yhwpdvgrYD0h0ITXwYJfyLc",
  authDomain: "t-time-backend.firebaseapp.com",
  projectId: "t-time-backend",
  storageBucket: "t-time-backend.firebasestorage.app",
  messagingSenderId: "300531408032",
  appId: "1:300531408032:web:38bfa52c4f070096647dc5",
  measurementId: "G-GHVJ61M3HF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
