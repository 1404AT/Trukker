// 🔥 TRUKKER MVP - FIREBASE CONFIGURATION
// Configuración ÚNICA para todo el proyecto (COMPAT MODE)

const firebaseConfig = {
  apiKey: "AIzaSyAsJbsK9uoZc4EAnntXZ2SQlZC6aV2g0ik",
  authDomain: "trukker-mvp-687e4.firebaseapp.com",
  projectId: "trukker-mvp-687e4",
  storageBucket: "trukker-mvp-687e4.firebasestorage.app",
  messagingSenderId: "342881835995",
  appId: "1:342881835995:web:7ab531b91d31659276a5fe",
  measurementId: "G-HTL0BYHY19"
};

// Inicializar Firebase (UNA SOLA VEZ - COMPAT MODE)
firebase.initializeApp(firebaseConfig);

// Referencias globales
const db = firebase.firestore();
const auth = firebase.auth();

console.log("✅ Firebase inicializado correctamente");
console.log("📦 Proyecto: trukker-mvp-687e4");
