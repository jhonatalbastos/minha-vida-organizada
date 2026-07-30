/* ===================================================================
   Auth UI — Minha Vida Organizada
   ⚠️ MUST be failsafe — app works even if Firebase is unavailable
   Login/Register modal with Email/Password + Google
   =================================================================== */

;(function() {
  'use strict';

  // ==================================================================
  // CHECK FIREBASE AVAILABILITY
  // ==================================================================

  const auth = window.__firebaseAuth;
  var firebaseAvailable = !!auth;

  // ==================================================================
  // STATE
  // ==================================================================

  var currentUser = null;

  // ==================================================================
  // DOM REFS
  // ==================================================================

  var overlay, loginBox, registerBox, userInfo;

  // ==================================================================
  // INIT
  // ==================================================================

  function init() {
    createAuthOverlay();
    if (firebaseAvailable) {
      setupAuthListeners();
    }
  }

  // ==================================================================
  // CREATE AUTH OVERLAY
  // ==================================================================

  function createAuthOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.className = 'auth-overlay';
    overlay.style.display = 'none';

    var firebaseWarning = firebaseAvailable ? '' :
      '<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:12px;">SDK Firebase não carregou. Verifique sua conexão de internet.</p>';

    overlay.innerHTML = '\
      <div class="auth-modal">\
        <button class="auth-close-btn" id="auth-close-btn">&times;</button>\
        \
        <div class="auth-form" id="auth-login-form">\
          <div class="auth-header">\
            <span class="auth-logo">🔐</span>\
            <h2>Entrar</h2>\
            <p class="auth-subtitle">Faça login para sincronizar seus dados</p>\
          </div>\
          <div class="auth-tabs">\
            <button class="auth-tab active" data-form="login">Entrar</button>\
            <button class="auth-tab" data-form="register">Criar Conta</button>\
          </div>\
          <div class="auth-fields">\
            <div class="auth-field">\
              <label>Email</label>\
              <input type="email" id="auth-email" placeholder="seu@email.com" autocomplete="email">\
            </div>\
            <div class="auth-field">\
              <label>Senha</label>\
              <input type="password" id="auth-password" placeholder="••••••••" autocomplete="current-password">\
            </div>\
            <div class="auth-error" id="auth-error" style="display:none;"></div>\
            <button class="auth-btn-primary" id="auth-btn-login">Entrar</button>\
            <div class="auth-divider"><span>ou</span></div>\
            <button class="auth-btn-google" id="auth-btn-google">\
              <svg viewBox="0 0 48 48" width="18" height="18"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.54l7.98-5.95z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.95C6.51 42.62 14.62 48 48 24z"/></svg>\
              Entrar com Google\
            </button>\
            ' + firebaseWarning + '\
          </div>\
        </div>\
        \
        <div class="auth-form" id="auth-register-form" style="display:none;">\
          <div class="auth-header">\
            <span class="auth-logo">✨</span>\
            <h2>Criar Conta</h2>\
            <p class="auth-subtitle">Crie uma conta para sincronizar seus dados</p>\
          </div>\
          <div class="auth-tabs">\
            <button class="auth-tab" data-form="login">Entrar</button>\
            <button class="auth-tab active" data-form="register">Criar Conta</button>\
          </div>\
          <div class="auth-fields">\
            <div class="auth-field">\
              <label>Nome (opcional)</label>\
              <input type="text" id="auth-name" placeholder="Seu nome" autocomplete="name">\
            </div>\
            <div class="auth-field">\
              <label>Email</label>\
              <input type="email" id="auth-reg-email" placeholder="seu@email.com" autocomplete="email">\
            </div>\
            <div class="auth-field">\
              <label>Senha (mín. 6 caracteres)</label>\
              <input type="password" id="auth-reg-password" placeholder="••••••••" autocomplete="new-password">\
            </div>\
            <div class="auth-field">\
              <label>Confirmar senha</label>\
              <input type="password" id="auth-reg-confirm" placeholder="••••••••" autocomplete="new-password">\
            </div>\
            <div class="auth-error" id="auth-reg-error" style="display:none;"></div>\
            <button class="auth-btn-primary" id="auth-btn-register">Criar Conta</button>\
            <div class="auth-divider"><span>ou</span></div>\
            <button class="auth-btn-google" id="auth-btn-google-reg">\
              <svg viewBox="0 0 48 48" width="18" height="18"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.54l7.98-5.95z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.95C6.51 42.62 14.62 48 48 24z"/></svg>\
              Criar com Google\
            </button>\
          </div>\
        </div>\
        \
        <div class="auth-user-info" id="auth-user-info" style="display:none;">\
          <div class="auth-user-avatar" id="auth-user-avatar">👤</div>\
          <div class="auth-user-details">\
            <span class="auth-user-name" id="auth-user-name">Usuário</span>\
            <span class="auth-user-email" id="auth-user-email">email@email.com</span>\
          </div>\
          <div class="auth-user-badge">🟢 Conectado</div>\
          <button class="auth-btn-logout" id="auth-btn-logout">Sair</button>\
        </div>\
      </div>';

    document.body.appendChild(overlay);

    loginBox = document.getElementById('auth-login-form');
    registerBox = document.getElementById('auth-register-form');
    userInfo = document.getElementById('auth-user-info');

    setupEventListeners();
  }

  // ==================================================================
  // EVENT LISTENERS
  // ==================================================================

  function setupEventListeners() {
    document.getElementById('auth-close-btn').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeOverlay();
    });

    document.querySelectorAll('.auth-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        switchAuthTab(this.dataset.form);
      });
    });

    var loginBtn = document.getElementById('auth-btn-login');
    if (loginBtn) loginBtn.addEventListener('click', function() { handleEmailLogin(); });

    var regBtn = document.getElementById('auth-btn-register');
    if (regBtn) regBtn.addEventListener('click', function() { handleEmailRegister(); });

    var googleBtn = document.getElementById('auth-btn-google');
    if (googleBtn) googleBtn.addEventListener('click', function() { handleGoogleLogin(); });

    var googleReg = document.getElementById('auth-btn-google-reg');
    if (googleReg) googleReg.addEventListener('click', function() { handleGoogleLogin(); });

    var logoutBtn = document.getElementById('auth-btn-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', function() { handleLogout(); });

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
    if (!firebaseAvailable) {
      showError(document.getElementById('auth-error'), 'Firebase não disponível. Verifique sua internet.');
      return;
    }
    var email = document.getElementById('auth-email').value.trim();
    var password = document.getElementById('auth-password').value;
    var errorEl = document.getElementById('auth-error');

    if (!email || !password) {
      showError(errorEl, 'Preencha email e senha');
      return;
    }

    hideError(errorEl);
    setButtonLoading('auth-btn-login', 'Entrando...');

    auth.signInWithEmailAndPassword(email, password)
      .then(function() { closeOverlay(); })
      .catch(function(err) {
        showError(errorEl, getErrorMessage(err));
      })
      .finally(function() {
        resetButton('auth-btn-login', 'Entrar');
      });
  }

  function handleEmailRegister() {
    if (!firebaseAvailable) {
      showError(document.getElementById('auth-reg-error'), 'Firebase não disponível. Verifique sua internet.');
      return;
    }
    var name = document.getElementById('auth-name').value.trim();
    var email = document.getElementById('auth-reg-email').value.trim();
    var password = document.getElementById('auth-reg-password').value;
    var confirm = document.getElementById('auth-reg-confirm').value;
    var errorEl = document.getElementById('auth-reg-error');

    if (!email || !password) { showError(errorEl, 'Preencha email e senha'); return; }
    if (password.length < 6) { showError(errorEl, 'Senha deve ter no mínimo 6 caracteres'); return; }
    if (password !== confirm) { showError(errorEl, 'Senhas não conferem'); return; }

    hideError(errorEl);
    setButtonLoading('auth-btn-register', 'Criando...');

    auth.createUserWithEmailAndPassword(email, password)
      .then(function(result) {
        if (name && result.user) {
          return result.user.updateProfile({ displayName: name });
        }
      })
      .then(function() { closeOverlay(); })
      .catch(function(err) {
        showError(errorEl, getErrorMessage(err));
      })
      .finally(function() {
        resetButton('auth-btn-register', 'Criar Conta');
      });
  }

  function handleGoogleLogin() {
    if (!firebaseAvailable) {
      showError(document.getElementById('auth-error'), 'Firebase não disponível. Verifique sua internet.');
      return;
    }

    setButtonLoading('auth-btn-google', 'Entrando...');
    setButtonLoading('auth-btn-google-reg', 'Entrando...');

    try {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      auth.signInWithPopup(provider)
        .then(function(result) {
          closeOverlay();
        })
        .catch(function(err) {
          if (err.code === 'auth/popup-closed-by-user') {
            // User closed popup — do nothing
          } else if (err.code === 'auth/unauthorized-domain') {
            showError(document.getElementById('auth-error'),
              'Domínio não autorizado. Adicione este domínio no Firebase Console > Autenticação > Domínios autorizados.');
          } else if (err.message && err.message.indexOf('missing initial state') >= 0) {
            // signInWithPopup failed due to storage partition — try redirect instead
            showError(document.getElementById('auth-error'),
              'Redirecionando para login...');
            auth.signInWithRedirect(provider);
          } else {
            showError(document.getElementById('auth-error'), getErrorMessage(err));
          }
        })
        .finally(function() {
          resetButton('auth-btn-google', 'Entrar com Google');
          resetButton('auth-btn-google-reg', 'Criar com Google');
        });
    } catch (err) {
      showError(document.getElementById('auth-error'), 'Erro ao iniciar login: ' + err.message);
      resetButton('auth-btn-google', 'Entrar com Google');
      resetButton('auth-btn-google-reg', 'Criar com Google');
    }
  }

  function handleLogout() {
    if (!auth) return;
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
    // Handle redirect result (when signInWithRedirect is used)
    auth.getRedirectResult().then(function(result) {
      if (result.user) {
        console.log('Login via redirect concluído');
      }
    }).catch(function(err) {
      console.warn('Redirect result error:', err.code);
    });

    auth.onAuthStateChanged(function(user) {
      currentUser = user;

      // Dispatch event for sync module (regardless of login status)
      window.dispatchEvent(new CustomEvent('auth-state-changed', {
        detail: { user: user, loggedIn: !!user }
      }));

      // Update UI
      if (user) {
        showUserInfo(user);
        updateHeaderButton(user);
        updateSettingsAuth(user);
      } else {
        hideUserInfo();
        updateHeaderButton(null);
        updateSettingsAuth(null);
      }
    });
  }

  // ==================================================================
  // UI UPDATES
  // ==================================================================

  function showUserInfo(user) {
    if (!userInfo) return;
    userInfo.style.display = 'flex';
    document.getElementById('auth-user-name').textContent = user.displayName || 'Usuário';
    document.getElementById('auth-user-email').textContent = user.email || '';
    var avatarEl = document.getElementById('auth-user-avatar');
    if (user.photoURL) {
      avatarEl.innerHTML = '<img src="' + user.photoURL + '" alt="avatar" class="auth-avatar-img">';
    } else {
      avatarEl.textContent = '👤';
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
    var container = document.getElementById('auth-header-btn');
    if (!container) return;

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
      newBtn.textContent = firebaseAvailable ? '🔐' : '⛓️‍💥';
    }
    newBtn.addEventListener('click', function() { openOverlay(); });

    container.innerHTML = '';
    container.appendChild(newBtn);
  }

  function updateSettingsAuth(user) {
    var container = document.getElementById('auth-settings-section');
    if (!container) return;

    if (user) {
      var avatar = user.photoURL
        ? '<img src="' + user.photoURL + '" class="auth-settings-avatar-img">'
        : '👤';
      container.innerHTML = '\
        <h3>🔐 Conta</h3>\
        <div class="auth-settings-info">\
          ' + avatar + '\
          <div>\
            <strong>' + (user.displayName || 'Usuário') + '</strong><br>\
            <span style="font-size:12px;color:var(--text-muted);">' + user.email + '</span>\
          </div>\
          <span class="auth-status-badge">🟢 Conectado</span>\
        </div>\
        <button class="btn-danger btn-block" id="btn-settings-logout" style="margin-top:8px;">Sair da conta</button>';
      var logoutBtn = document.getElementById('btn-settings-logout');
      if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    } else {
      var subtitle = firebaseAvailable
        ? 'Faça login para sincronizar seus dados entre dispositivos'
        : 'Firebase SDK não disponível. Verifique sua internet.';
      container.innerHTML = '\
        <h3>🔐 Conta</h3>\
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">' + subtitle + '</p>\
        <button class="btn-primary btn-block" id="btn-settings-login">🔐 Entrar / Criar Conta</button>';
      var loginBtn = document.getElementById('btn-settings-login');
      if (loginBtn) loginBtn.addEventListener('click', openOverlay);
    }
  }

  // ==================================================================
  // OVERLAY CONTROLS
  // ==================================================================

  function openOverlay() {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (currentUser) {
      showUserInfo(currentUser);
    } else {
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
    var btn = document.getElementById(id);
    if (btn) { btn.disabled = true; btn.innerHTML = '⏳ ' + text; }
  }
  function resetButton(id, text) {
    var btn = document.getElementById(id);
    if (btn) { btn.disabled = false; btn.textContent = text; }
  }
  function getErrorMessage(err) {
    var map = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/invalid-email': 'Email inválido',
      'auth/email-already-in-use': 'Este email já está cadastrado',
      'auth/weak-password': 'Senha muito fraca (mín. 6 caracteres)',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/popup-closed-by-user': 'Login cancelado',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
      'auth/unauthorized-domain': 'Domínio não autorizado no Firebase'
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
