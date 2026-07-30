/* ===================================================================
   Auth UI — Minha Vida Organizada
   Login/Register modal with Email/Password + Google
   =================================================================== */

;(function() {
  'use strict';

  const auth = window.__firebaseAuth;
  if (!auth) {
    console.warn('Firebase Auth não disponível');
    return;
  }

  // ==================================================================
  // STATE
  // ==================================================================

  let currentUser = null;

  // ==================================================================
  // DOM REFS (populados depois)
  // ==================================================================

  let overlay, loginBox, registerBox, userInfo;
  let authBtn, userAvatar;

  // ==================================================================
  // INIT
  // ==================================================================

  function init() {
    createAuthOverlay();
    setupAuthListeners();
  }

  // ==================================================================
  // CREATE AUTH OVERLAY
  // ==================================================================

  function createAuthOverlay() {
    // Create overlay container
    overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.className = 'auth-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML = `
      <div class="auth-modal">
        <button class="auth-close-btn" id="auth-close-btn">&times;</button>

        <!-- LOGIN FORM -->
        <div class="auth-form" id="auth-login-form">
          <div class="auth-header">
            <span class="auth-logo">🔐</span>
            <h2>Entrar</h2>
            <p class="auth-subtitle">Faça login para sincronizar seus dados</p>
          </div>
          <div class="auth-tabs">
            <button class="auth-tab active" data-form="login">Entrar</button>
            <button class="auth-tab" data-form="register">Criar Conta</button>
          </div>
          <div class="auth-fields">
            <div class="auth-field">
              <label>Email</label>
              <input type="email" id="auth-email" placeholder="seu@email.com" autocomplete="email">
            </div>
            <div class="auth-field">
              <label>Senha</label>
              <input type="password" id="auth-password" placeholder="••••••••" autocomplete="current-password">
            </div>
            <div class="auth-error" id="auth-error" style="display:none;"></div>
            <button class="auth-btn-primary" id="auth-btn-login">Entrar</button>
            <div class="auth-divider"><span>ou</span></div>
            <button class="auth-btn-google" id="auth-btn-google">
              <svg viewBox="0 0 48 48" width="18" height="18"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.54l7.98-5.95z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.95C6.51 42.62 14.62 48 24 48z"/></svg>
              Entrar com Google
            </button>
          </div>
        </div>

        <!-- REGISTER FORM -->
        <div class="auth-form" id="auth-register-form" style="display:none;">
          <div class="auth-header">
            <span class="auth-logo">✨</span>
            <h2>Criar Conta</h2>
            <p class="auth-subtitle">Crie uma conta para sincronizar seus dados</p>
          </div>
          <div class="auth-tabs">
            <button class="auth-tab" data-form="login">Entrar</button>
            <button class="auth-tab active" data-form="register">Criar Conta</button>
          </div>
          <div class="auth-fields">
            <div class="auth-field">
              <label>Nome (opcional)</label>
              <input type="text" id="auth-name" placeholder="Seu nome" autocomplete="name">
            </div>
            <div class="auth-field">
              <label>Email</label>
              <input type="email" id="auth-reg-email" placeholder="seu@email.com" autocomplete="email">
            </div>
            <div class="auth-field">
              <label>Senha (mín. 6 caracteres)</label>
              <input type="password" id="auth-reg-password" placeholder="••••••••" autocomplete="new-password">
            </div>
            <div class="auth-field">
              <label>Confirmar senha</label>
              <input type="password" id="auth-reg-confirm" placeholder="••••••••" autocomplete="new-password">
            </div>
            <div class="auth-error" id="auth-reg-error" style="display:none;"></div>
            <button class="auth-btn-primary" id="auth-btn-register">Criar Conta</button>
            <div class="auth-divider"><span>ou</span></div>
            <button class="auth-btn-google" id="auth-btn-google-reg">
              <svg viewBox="0 0 48 48" width="18" height="18"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.54l7.98-5.95z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.95C6.51 42.62 14.62 48 48 24z"/></svg>
              Criar com Google
            </button>
          </div>
        </div>

        <!-- USER INFO (shown when logged in) -->
        <div class="auth-user-info" id="auth-user-info" style="display:none;">
          <div class="auth-user-avatar" id="auth-user-avatar">👤</div>
          <div class="auth-user-details">
            <span class="auth-user-name" id="auth-user-name">Usuário</span>
            <span class="auth-user-email" id="auth-user-email">email@email.com</span>
          </div>
          <div class="auth-user-badge">🟢 Conectado</div>
          <button class="auth-btn-logout" id="auth-btn-logout">Sair</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Cache DOM refs
    loginBox = document.getElementById('auth-login-form');
    registerBox = document.getElementById('auth-register-form');
    userInfo = document.getElementById('auth-user-info');

    setupEventListeners();
  }

  // ==================================================================
  // EVENT LISTENERS
  // ==================================================================

  function setupEventListeners() {
    // Close overlay
    document.getElementById('auth-close-btn').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeOverlay();
    });

    // Tab switching
    document.querySelectorAll('.auth-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        const form = this.dataset.form;
        switchAuthTab(form);
      });
    });

    // Login button
    document.getElementById('auth-btn-login').addEventListener('click', function() {
      handleEmailLogin();
    });

    // Register button
    document.getElementById('auth-btn-register').addEventListener('click', function() {
      handleEmailRegister();
    });

    // Google buttons
    document.getElementById('auth-btn-google').addEventListener('click', function() {
      handleGoogleLogin();
    });
    document.getElementById('auth-btn-google-reg').addEventListener('click', function() {
      handleGoogleLogin();
    });

    // Logout button
    document.getElementById('auth-btn-logout').addEventListener('click', function() {
      handleLogout();
    });

    // Enter key support
    document.getElementById('auth-password').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleEmailLogin();
    });
    document.getElementById('auth-reg-confirm').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleEmailRegister();
    });
  }

  // ==================================================================
  // AUTH METHODS
  // ==================================================================

  function handleEmailLogin() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');

    if (!email || !password) {
      showError(errorEl, 'Preencha email e senha');
      return;
    }

    hideError(errorEl);
    setButtonLoading('auth-btn-login', 'Entrando...');

    auth.signInWithEmailAndPassword(email, password)
      .then(function() {
        closeOverlay();
      })
      .catch(function(err) {
        let msg = getErrorMessage(err);
        showError(errorEl, msg);
      })
      .finally(function() {
        resetButton('auth-btn-login', 'Entrar');
      });
  }

  function handleEmailRegister() {
    const name = document.getElementById('auth-name').value.trim();
    const email = document.getElementById('auth-reg-email').value.trim();
    const password = document.getElementById('auth-reg-password').value;
    const confirm = document.getElementById('auth-reg-confirm').value;
    const errorEl = document.getElementById('auth-reg-error');

    if (!email || !password) {
      showError(errorEl, 'Preencha email e senha');
      return;
    }
    if (password.length < 6) {
      showError(errorEl, 'Senha deve ter no mínimo 6 caracteres');
      return;
    }
    if (password !== confirm) {
      showError(errorEl, 'Senhas não conferem');
      return;
    }

    hideError(errorEl);
    setButtonLoading('auth-btn-register', 'Criando...');

    auth.createUserWithEmailAndPassword(email, password)
      .then(function(result) {
        if (name && result.user) {
          return result.user.updateProfile({ displayName: name });
        }
      })
      .then(function() {
        closeOverlay();
      })
      .catch(function(err) {
        let msg = getErrorMessage(err);
        showError(errorEl, msg);
      })
      .finally(function() {
        resetButton('auth-btn-register', 'Criar Conta');
      });
  }

  function handleGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    setButtonLoading('auth-btn-google', 'Entrando...');
    setButtonLoading('auth-btn-google-reg', 'Entrando...');

    auth.signInWithPopup(provider)
      .then(function() {
        closeOverlay();
      })
      .catch(function(err) {
        if (err.code !== 'auth/popup-closed-by-user') {
          const errorEl = document.getElementById('auth-error');
          showError(errorEl, getErrorMessage(err));
        }
      })
      .finally(function() {
        resetButton('auth-btn-google', 'Entrar com Google');
        resetButton('auth-btn-google-reg', 'Criar com Google');
      });
  }

  function handleLogout() {
    auth.signOut().then(function() {
      closeOverlay();
    }).catch(function(err) {
      console.error('Erro ao sair:', err);
    });
  }

  // ==================================================================
  // AUTH STATE LISTENER
  // ==================================================================

  function setupAuthListeners() {
    auth.onAuthStateChanged(function(user) {
      currentUser = user;

      if (user) {
        // User is signed in
        showUserInfo(user);
        updateHeaderButton(user);
        updateSettingsAuth(user);

        // Dispatch event for sync module
        window.dispatchEvent(new CustomEvent('auth-state-changed', {
          detail: { user: user, loggedIn: true }
        }));
      } else {
        // User is signed out
        hideUserInfo();
        updateHeaderButton(null);
        updateSettingsAuth(null);

        window.dispatchEvent(new CustomEvent('auth-state-changed', {
          detail: { user: null, loggedIn: false }
        }));
      }
    });
  }

  // ==================================================================
  // UI UPDATES
  // ==================================================================

  function showUserInfo(user) {
    if (userInfo) {
      userInfo.style.display = 'flex';
      document.getElementById('auth-user-name').textContent = user.displayName || 'Usuário';
      document.getElementById('auth-user-email').textContent = user.email || '';
      var avatarEl = document.getElementById('auth-user-avatar');
      if (user.photoURL) {
        avatarEl.innerHTML = '<img src="' + user.photoURL + '" alt="avatar" class="auth-avatar-img">';
      } else {
        avatarEl.textContent = '👤';
      }
    }
    if (loginBox) loginBox.style.display = 'none';
    if (registerBox) registerBox.style.display = 'none';
  }

  function hideUserInfo() {
    if (userInfo) userInfo.style.display = 'none';
    if (loginBox) loginBox.style.display = '';
    if (registerBox) registerBox.style.display = 'none';
  }

  function updateHeaderButton(user) {
    const container = document.getElementById('auth-header-btn');
    if (!container) return;

    // Replace entire content to avoid event listener leaks
    var newBtn = document.createElement('button');
    newBtn.className = 'auth-header-btn';
    if (user) {
      newBtn.className += ' logged-in';
      newBtn.title = user.email || '';
      if (user.photoURL) {
        newBtn.innerHTML = '<img src="' + user.photoURL + '" class="auth-header-avatar-img">';
      } else {
        newBtn.textContent = '👤';
      }
    } else {
      newBtn.textContent = '🔐';
    }
    newBtn.addEventListener('click', function() {
      openOverlay();
    });

    container.innerHTML = '';
    container.appendChild(newBtn);
  }

  function updateSettingsAuth(user) {
    const container = document.getElementById('auth-settings-section');
    if (!container) return;

    if (user) {
      const avatar = user.photoURL
        ? '<img src="' + user.photoURL + '" class="auth-settings-avatar-img">'
        : '👤';
      container.innerHTML = `
        <h3>🔐 Conta</h3>
        <div class="auth-settings-info">
          ${avatar}
          <div>
            <strong>${user.displayName || 'Usuário'}</strong><br>
            <span style="font-size:12px;color:var(--text-muted);">${user.email}</span>
          </div>
          <span class="auth-status-badge">🟢 Conectado</span>
        </div>
        <button class="btn-danger btn-block" id="btn-settings-logout" style="margin-top:8px;">Sair da conta</button>
      `;
      document.getElementById('btn-settings-logout').addEventListener('click', handleLogout);
    } else {
      container.innerHTML = `
        <h3>🔐 Conta</h3>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">
          Faça login para sincronizar seus dados entre dispositivos
        </p>
        <button class="btn-primary btn-block" id="btn-settings-login">🔐 Entrar / Criar Conta</button>
      `;
      document.getElementById('btn-settings-login').addEventListener('click', openOverlay);
    }
  }

  // ==================================================================
  // OVERLAY CONTROLS
  // ==================================================================

  function openOverlay() {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Show correct form based on auth state
    if (currentUser) {
      showUserInfo(currentUser);
    } else {
      // Default to login
      switchAuthTab('login');
    }
  }

  function closeOverlay() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  function switchAuthTab(form) {
    document.querySelectorAll('.auth-tab').forEach(function(t) {
      t.classList.toggle('active', t.dataset.form === form);
    });

    if (form === 'login') {
      loginBox.style.display = '';
      registerBox.style.display = 'none';
      hideError(document.getElementById('auth-error'));
    } else {
      loginBox.style.display = 'none';
      registerBox.style.display = '';
      hideError(document.getElementById('auth-reg-error'));
    }
  }

  // ==================================================================
  // HELPERS
  // ==================================================================

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
  }

  function hideError(el) {
    if (!el) return;
    el.style.display = 'none';
  }

  function setButtonLoading(id, text) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '⏳ ' + text;
    }
  }

  function resetButton(id, text) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.disabled = false;
      btn.textContent = text;
    }
  }

  function getErrorMessage(err) {
    const map = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/invalid-email': 'Email inválido',
      'auth/email-already-in-use': 'Este email já está cadastrado',
      'auth/weak-password': 'Senha muito fraca (mín. 6 caracteres)',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/popup-closed-by-user': 'Login cancelado',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet'
    };
    return map[err.code] || err.message || 'Erro desconhecido';
  }

  // ==================================================================
  // PUBLIC API
  // ==================================================================

  window.__auth = {
    init: init,
    open: openOverlay,
    close: closeOverlay,
    getUser: function() { return currentUser; }
  };

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
