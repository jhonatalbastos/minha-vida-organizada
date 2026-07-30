/* ===================================================================
   Firebase Init — Minha Vida Organizada
   ⚠️ MUST be failsafe — app works even if Firebase fails
   =================================================================== */

;(function() {
  'use strict';

  try {
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase SDK não carregou');
    }

    // Firebase configuration
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

    // Export auth & db globally
    window.__firebaseAuth = firebase.auth();
    window.__firebaseDb = firebase.firestore();

    // Enable offline persistence (works offline!)
    window.__firebaseDb.enablePersistence()
      .catch(function(err) {
        if (err.code === 'failed-precondition') {
          console.warn('Firestore: múltiplas abas abertas, persistência offline limitada');
        } else if (err.code === 'unimplemented') {
          console.warn('Firestore: navegador não suporta persistência offline');
        }
      });

    console.log('✅ Firebase inicializado');
  } catch (e) {
    console.warn('⚠️ Firebase não disponível:', e.message);
    // App funciona sem Firebase — apenas recursos de sync ficam desativados
    window.__firebaseAuth = null;
    window.__firebaseDb = null;
  }

})();
