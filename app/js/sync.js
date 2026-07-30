/* ===================================================================
   Firebase Sync — Minha Vida Organizada
   Sincroniza o STATE com Firestore quando usuário está logado
   =================================================================== */

;(function() {
  'use strict';

  const auth = window.__firebaseAuth;
  const db = window.__firebaseDb;

  if (!auth || !db) {
    console.warn('Firebase Sync: Firebase não inicializado');
    return;
  }

  // ==================================================================
  // CONFIG
  // ==================================================================

  const SYNC_DEBOUNCE_MS = 2000; // 2 segundos após última alteração
  let syncTimeout = null;
  let isSyncing = false;
  let lastSyncTime = 0;
  let unsubscribeSnapshot = null;
  let isRestoring = false;

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
    const user = auth.currentUser;
    if (!user || !state) return Promise.resolve();

    const ref = getUserStateRef(user);
    if (!ref) return Promise.resolve();

    // Add sync metadata
    const dataToSync = {
      state: JSON.parse(JSON.stringify(state)), // deep clone
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

    const ref = getUserStateRef(user);
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
    // Remove listener anterior
    if (unsubscribeSnapshot) {
      unsubscribeSnapshot();
      unsubscribeSnapshot = null;
    }

    if (!user) return;

    const ref = getUserStateRef(user);
    if (!ref) return;

    unsubscribeSnapshot = ref.onSnapshot(function(doc) {
      // Não processar se estamos no meio de um sync
      if (isSyncing || isRestoring) return;

      // Não processar se o sync foi feito por este dispositivo há menos de 5s
      if (Date.now() - lastSyncTime < 5000) return;

      if (doc.exists && doc.data() && doc.data().state) {
        const remoteData = doc.data().state;
        const localState = window.__STATE;

        if (localState) {
          // Merge: preservar dados locais não salvos no servidor
          const merged = mergeStates(localState, remoteData);
          // Atualizar estado local
          Object.assign(localState, merged);

          // Salvar no localStorage
          if (window.__saveState) {
            window.__saveState();
          }

          // Re-renderizar views
          if (window.__refreshUI) {
            window.__refreshUI();
          }

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
    // Regras de merge:
    // - Dados diários (dailyLog, waterLog, scheduleDone, etc.): merge por data
    // - Dados de configuração (macroGoals, refeicoes, etc.): remote wins (mais recente)
    // - Medições, treinos, notas: concatena e deduplica

    const merged = JSON.parse(JSON.stringify(remote));

    // Para dados diários, fazer merge chave a chave (preserva registros locais que não existem no remote)
    const dailyKeys = ['dailyLog', 'waterLog', 'scheduleDone', 'tasksDone', 'shoppingDone', 'mealConsumed'];
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

    // Medições: concatena e deduplica por timestamp
    if (local.measurements && local.measurements.length > 0) {
      const existingIds = new Set((merged.measurements || []).map(function(m) {
        return m.date || m.timestamp || JSON.stringify(m);
      }));
      local.measurements.forEach(function(m) {
        const id = m.date || m.timestamp || JSON.stringify(m);
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
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(function() {
      syncToFirebase(state);
      syncTimeout = null;
    }, SYNC_DEBOUNCE_MS);
  }

  // ==================================================================
  // STATUS UI
  // ==================================================================

  function updateSyncStatus(msg) {
    const el = document.getElementById('firebase-sync-status');
    if (el) {
      el.textContent = msg;
      el.style.opacity = '1';
      setTimeout(function() {
        el.style.opacity = '0.6';
      }, 3000);
    }
  }

  // ==================================================================
  // ON LOGIN / LOGOUT
  // ==================================================================

  function onAuthChanged(event) {
    const user = event.detail.user;
    const loggedIn = event.detail.loggedIn;

    if (loggedIn && user) {
      // Logged in: load data from Firestore
      isRestoring = true;
      loadFromFirebase(user)
        .then(function(remoteState) {
          if (remoteState && window.__STATE) {
            const merged = mergeStates(window.__STATE, remoteState);
            Object.assign(window.__STATE, merged);

            // Salvar local
            if (window.__saveState) {
              window.__saveState();
            }

            // Recarregar UI
            if (window.__refreshUI) {
              window.__refreshUI();
            }

            updateSyncStatus('📥 Dados restaurados da nuvem');
          } else {
            // Primeiro login: fazer upload dos dados locais
            updateSyncStatus('☁️ Enviando dados locais...');
            syncToFirebase(window.__STATE);
          }

          // Configurar listener em tempo real
          setupRealtimeListener(user);
        })
        .finally(function() {
          isRestoring = false;
        });

      // Mostrar status
      const statusEl = document.getElementById('firebase-sync-status');
      if (statusEl) {
        statusEl.style.display = '';
      }
    } else {
      // Logged out
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      const statusEl = document.getElementById('firebase-sync-status');
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
    // Listen for auth changes
    window.addEventListener('auth-state-changed', onAuthChanged);

    // Hook into saveState
    const originalSaveState = window.__saveState;
    if (originalSaveState) {
      window.__saveState = function() {
        originalSaveState();
        // Debounced sync to Firebase
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

    // Create sync status element if not exists
    if (!document.getElementById('firebase-sync-status')) {
      const el = document.createElement('div');
      el.id = 'firebase-sync-status';
      el.className = 'firebase-sync-status';
      el.textContent = auth.currentUser ? '🟡 Verificando...' : '🔴 Não conectado';
      document.body.appendChild(el);
    }

    // Inicializar estado
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
