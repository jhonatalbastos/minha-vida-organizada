/* ===================================================================
   Firebase Init — Minha Vida Organizada
   =================================================================== */

// Firebase configuration from user's project
const firebaseConfig = {
  apiKey: "AIzaSyAGkH7c34TSzvCjJs1IkLoqdJr92Th6wds",
  authDomain: "minha-vida-organizada-c377b.firebaseapp.com",
  projectId: "minha-vida-organizada-c377b",
  storageBucket: "minha-vida-organizada-c377b.firebasestorage.app",
  messagingSenderId: "698586920988",
  appId: "1:698586920988:web:fa4aeaceeac35de4bc47d9",
  measurementId: "G-PRMTF8ZQ0F"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export auth & db globally for other scripts
window.__firebaseAuth = firebase.auth();
window.__firebaseDb = firebase.firestore();

// Enable offline persistence for Firestore (works offline!)
window.__firebaseDb.enablePersistence()
  .catch(function(err) {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore: múltiplas abas abertas, persistência offline limitada');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore: navegador não suporta persistência offline');
    }
  });
