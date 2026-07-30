/* ===================================================================
   Firebase Sync — Minha Vida Organizada
   ⚠️ MUST be failsafe — app works even if Firebase is unavailable
   Sincroniza o STATE com Firestore quando usuário está logado
   =================================================================== */

;(function() {
  'use strict';

  var auth = window.__firebaseAuth;
  var db = window.__firebaseDb;
  var firebaseAvailable = !!(auth && db && typeof firebase !== 'undefined');

  if (!firebaseAvailable) {
    console.warn('Firebase Sync: Firebase não disponível — sync desativado');
    // Still expose __syncNow as a no-op so the button doesn't crash
    window.__syncNow = function() {
      var el = document.getElementById('firebase-sync-status');
      if (el) el.textContent = '⛔ Firebase indisponível';
    };
    window.__sync = { init: function(){}, syncNow: function(){}, getUserStateRef: function(){return null;} };
    return;
  }

  // ==================================================================
  // CONFIG
  // ==================================================================

  var SYNC_DEBOUNCE_MS = 2000;
  var syncTimeout = null;
  var isSyncing = false;
  var lastSyncTime = 0;
  var unsubscribeSnapshot = null;
  var isRestoring = false;

  // ==================================================================
  // GET FIRESTORE REF
  // ==================================================================

  function getUserStateRef(user) {
    if (!user) return null;
    return db.collection('users').doc(user.uid).collection('data').doc('state');
  }

  // ==================================================================
  // SYNC TO FIRESTORE (upload)
  // ==================================================================

  function syncToFirebase(state) {
    var user = auth.currentUser;
    if (!user || !state) return Promise.resolve();

    var ref = getUserStateRef(user);
    if (!ref) return Promise.resolve();

    var dataToSync = {
      state: JSON.parse(JSON.stringify(state)),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: user.uid
    };

    isSyncing = true;
    return ref.set(dataToSync)
      .then(function() {
        lastSyncTime = Date.now();
        updateSyncStatus('✅ Sincronizado');
      })
      .catch(function(err) {
        console.warn('Firestore sync error:', err.message);
        updateSyncStatus('⚠️ Falha ao sincronizar');
      })
      .finally(function() {
        isSyncing = false;
      });
  }

  // ==================================================================
  // LOAD FROM FIRESTORE (download)
  // ==================================================================

  function loadFromFirebase(user) {
    if (!user) return Promise.resolve(null);

    var ref = getUserStateRef(user);
    if (!ref) return Promise.resolve(null);

    updateSyncStatus('📥 Baixando dados...');

    return ref.get()
      .then(function(doc) {
        if (doc.exists && doc.data() && doc.data().state) {
          return doc.data().state;
        }
        return null;
      })
      .catch(function(err) {
        console.warn('Firestore load error:', err.message);
        return null;
      });
  }

  // ==================================================================
  // REAL-TIME LISTENER
  // ==================================================================

  function setupRealtimeListener(user) {
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }

    if (!user) return;

    var ref = getUserStateRef(user);
    if (!ref) return;

    unsubscribeSnapshot = ref.onSnapshot(function(doc) {
      if (isSyncing || isRestoring) return;
      if (Date.now() - lastSyncTime < 5000) return;

      if (doc.exists && doc.data() && doc.data().state) {
        var remoteData = doc.data().state;
        var localState = window.__STATE;

        if (localState) {
          var merged = mergeStates(localState, remoteData);
          Object.assign(localState, merged);

          if (window.__saveState) window.__saveState();
          if (window.__refreshUI) window.__refreshUI();

          updateSyncStatus('🔄 Atualizado de outro dispositivo');
        }
      }
    }, function(err) {
      console.warn('Firestore snapshot error:', err.message);
    });
  }

  // ==================================================================
  // MERGE STATES
  // ==================================================================

  function mergeStates(local, remote) {
    var merged = JSON.parse(JSON.stringify(remote));

    var dailyKeys = ['dailyLog', 'waterLog', 'scheduleDone', 'tasksDone', 'shoppingDone', 'mealConsumed'];
    dailyKeys.forEach(function(key) {
      if (!merged[key]) merged[key] = {};
      if (local[key]) {
        Object.keys(local[key]).forEach(function(dateKey) {
          if (!merged[key][dateKey]) {
            merged[key][dateKey] = JSON.parse(JSON.stringify(local[key][dateKey]));
          }
        });
      }
    });

    if (local.measurements && local.measurements.length > 0) {
      var existingIds = new Set((merged.measurements || []).map(function(m) {
        return m.date || m.timestamp || JSON.stringify(m);
      }));
      local.measurements.forEach(function(m) {
        var id = m.date || m.timestamp || JSON.stringify(m);
        if (!existingIds.has(id)) {
          if (!merged.measurements) merged.measurements = [];
          merged.measurements.push(m);
          existingIds.add(id);
        }
      });
    }

    return merged;
  }

  // ==================================================================
  // DEBOUNCED SYNC
  // ==================================================================

  function debouncedSync(state) {
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(function() {
      syncToFirebase(state);
      syncTimeout = null;
    }, SYNC_DEBOUNCE_MS);
  }

  // ==================================================================
  // STATUS UI
  // ==================================================================

  function updateSyncStatus(msg) {
    var el = document.getElementById('firebase-sync-status');
    if (el) {
      el.textContent = msg;
      el.style.opacity = '1';
      setTimeout(function() { el.style.opacity = '0.6'; }, 3000);
    }
  }

  // ==================================================================
  // ON LOGIN / LOGOUT
  // ==================================================================

  function onAuthChanged(event) {
    var user = event.detail.user;
    var loggedIn = event.detail.loggedIn;

    if (loggedIn && user) {
      isRestoring = true;
      loadFromFirebase(user)
        .then(function(remoteState) {
          if (remoteState && window.__STATE) {
            var merged = mergeStates(window.__STATE, remoteState);
            Object.assign(window.__STATE, merged);
            if (window.__saveState) window.__saveState();
            if (window.__refreshUI) window.__refreshUI();
            updateSyncStatus('📥 Dados restaurados da nuvem');
          } else {
            updateSyncStatus('☁️ Enviando dados locais...');
            syncToFirebase(window.__STATE);
          }
          setupRealtimeListener(user);
        })
        .finally(function() { isRestoring = false; });

      var statusEl = document.getElementById('firebase-sync-status');
      if (statusEl) statusEl.style.display = '';
    } else {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }
      var statusEl = document.getElementById('firebase-sync-status');
      if (statusEl) {
        statusEl.textContent = '🔴 Não conectado';
        statusEl.style.opacity = '0.6';
      }
    }
  }

  // ==================================================================
  // INIT
  // ==================================================================

  function init() {
    window.addEventListener('auth-state-changed', onAuthChanged);

    // Hook into saveState
    var originalSaveState = window.__saveState;
    if (typeof originalSaveState === 'function') {
      window.__saveState = function() {
        originalSaveState();
        if (auth.currentUser && window.__STATE) {
          debouncedSync(window.__STATE);
        }
      };
    }

    // Expose manual sync
    window.__syncNow = function() {
      if (auth.currentUser && window.__STATE) {
        updateSyncStatus('☁️ Sincronizando...');
        syncToFirebase(window.__STATE);
      }
    };

    // Create sync status element if needed
    if (!document.getElementById('firebase-sync-status')) {
      var el = document.createElement('div');
      el.id = 'firebase-sync-status';
      el.className = 'firebase-sync-status';
      el.textContent = auth.currentUser ? '🟡 Verificando...' : '🔴 Não conectado';
      document.body.appendChild(el);
    }

    if (auth.currentUser) {
      updateSyncStatus('🟡 Verificando...');
    }
  }

  // ==================================================================
  // PUBLIC API
  // ==================================================================

  window.__sync = {
    init: init,
    syncNow: function() { return syncToFirebase(window.__STATE); },
    getUserStateRef: getUserStateRef
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
