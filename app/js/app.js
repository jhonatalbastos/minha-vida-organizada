/* ===================================================================
   Minha Vida Organizada - PWA App v2.0
   Complete application logic
   =================================================================== */

;(function() {
  'use strict';

  // ==================================================================
  // DATA
  // ==================================================================

  const SCHEDULE = {
    weekday: [
      { time: '05:00', emoji: '🌅', activity: 'Acordar + água', id: 'wake' },
      { time: '05:05–05:35', emoji: '🏋️', activity: 'Exercício (30 min)', id: 'exercise' },
      { time: '05:35–05:45', emoji: '🧘', activity: 'Mindfulness', id: 'mindfulness' },
      { time: '05:45–06:10', emoji: '🚿', activity: 'Banho + protetor + pomada', id: 'shower' },
      { time: '06:10–06:15', emoji: '🥣', activity: 'Overnight Oats', id: 'breakfast' },
      { time: '06:15–07:00', emoji: '🏍️', activity: 'Trajeto moto', id: 'commute_to' },
      { time: '07:00–17:00', emoji: '💼', activity: 'Trabalho', id: 'work' },
      { time: '17:00–17:45', emoji: '🏍️', activity: 'Trajeto volta', id: 'commute_back' },
      { time: '17:45–18:15', emoji: '🏠', activity: 'Check-in casa + louça', id: 'home_checkin' },
      { time: '18:15+', emoji: '🍔', activity: 'Jantar + tempo livre', id: 'free_time' },
      { time: '21:30–21:50', emoji: '📖', activity: 'Leitura', id: 'reading' },
      { time: '22:00', emoji: '😴', activity: 'Dormir', id: 'sleep' }
    ],
    friday: [
      { time: '05:00', emoji: '🌅', activity: 'Acordar + água', id: 'wake' },
      { time: '05:05–05:35', emoji: '🏋️', activity: 'Exercício (30 min)', id: 'exercise' },
      { time: '05:35–05:45', emoji: '🧘', activity: 'Mindfulness', id: 'mindfulness' },
      { time: '05:45–06:10', emoji: '🚿', activity: 'Banho + protetor + pomada', id: 'shower' },
      { time: '06:10–06:15', emoji: '🥣', activity: 'Overnight Oats', id: 'breakfast' },
      { time: '06:15–07:00', emoji: '🏍️', activity: 'Trajeto moto', id: 'commute_to' },
      { time: '07:00–13:00', emoji: '💼', activity: 'Trabalho (saída 13h)', id: 'work_fri' },
      { time: '13:00–14:30', emoji: '🚶', activity: 'Trajeto / intervalo', id: 'break_fri' },
      { time: '14:30–16:00', emoji: '🛒', activity: 'Mercado', id: 'market' },
      { time: '16:00+', emoji: '💆', activity: 'Massagem / tempo livre', id: 'massage' },
      { time: '21:30–21:50', emoji: '📖', activity: 'Leitura', id: 'reading' },
      { time: '22:00', emoji: '😴', activity: 'Dormir', id: 'sleep' }
    ],
    saturday: [
      { time: '08:30–11:30', emoji: '🍳', activity: 'Meal prep semanal', id: 'meal_prep' },
      { time: '11:30–12:30', emoji: '🧹', activity: 'Limpeza da casa (1h)', id: 'cleaning' },
      { time: '12:30+', emoji: '🆓', activity: 'Tarde / noite livre', id: 'free_sat' }
    ],
    sunday: [
      { time: '—', emoji: '📋', activity: 'Dia de descanso e planejamento', id: 'rest_sun' }
    ]
  };

  const WATER_CUPS = 8;
  const WATER_ML_PER_CUP = 250;
  const WATER_TOTAL_L = (WATER_CUPS * WATER_ML_PER_CUP) / 1000;

  const WEEKLY_TASKS = {
    'Segunda': ['Lixo', 'Limpar bancada'],
    'Terça': ['Tirar pó'],
    'Quarta': ['Banheiro rápido'],
    'Quinta': ['Organizar fora do lugar'],
    'Sexta': ['Mercado (14:30–16:00)', 'Massagem desportiva (quinzenal)'],
    'Sábado': ['Meal prep (08:30–11:30)', 'Limpeza 1h'],
    'Domingo': ['Planejar semana', 'Descansar']
  };

  const DAYS_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const DAYS_ABBR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const MEALS = [
    { name: 'Café', time: '06:10', emoji: '🥣', desc: 'Overnight Oats (aveia + whey + chia + leite + banana)', recipe: '50g aveia, 30g whey, 15g chia, 150ml leite, 1 banana' },
    { name: 'Almoço', time: '12:00', emoji: '🍱', desc: 'Marmita (arroz integral + proteína + legumes)', recipe: 'Arroz integral, frango/carne, brócolis, cenoura, vagem' },
    { name: 'Lanche', time: '15:30', emoji: '🥤', desc: 'Whey + fruta + castanha', recipe: '1 dose whey, 1 fruta, 20g castanha' },
    { name: 'Jantar', time: '18:15', emoji: '🍔', desc: 'Hambúrguer fit Airfryer', recipe: '150-180g patinho, pão integral, queijo, alface, tomate' }
  ];

  const CALISTENIA = [
    { phase: 1, label: 'Base', weeks: '1–4', exercises: [
      { name: 'Flexão de parede', reps: '3×15', muscle: 'Peito, tríceps' },
      { name: 'Agachamento livre', reps: '3×15', muscle: 'Quadríceps, glúteos' },
      { name: 'Prancha', reps: '3×30s', muscle: 'Core' },
      { name: 'Elevação pélvica', reps: '3×12', muscle: 'Glúteos, lombar' }
    ]},
    { phase: 2, label: 'Intermediário', weeks: '5–8', exercises: [
      { name: 'Flexão no chão', reps: '3×12', muscle: 'Peito, tríceps' },
      { name: 'Agachamento búlgaro', reps: '3×10', muscle: 'Quadríceps, glúteos' },
      { name: 'Prancha lateral', reps: '3×20s', muscle: 'Oblíquos' },
      { name: 'Abdominal bicicleta', reps: '3×15', muscle: 'Core' },
      { name: 'Remada com elástico', reps: '3×12', muscle: 'Costas, bíceps' },
      { name: 'Pull-apart', reps: '3×15', muscle: 'Costas, ombros' }
    ]},
    { phase: 3, label: 'Intermediário Avançado', weeks: '9–12', exercises: [
      { name: 'Flexão declinada', reps: '3×10', muscle: 'Peito superior' },
      { name: 'Pistol squat assistido', reps: '3×8', muscle: 'Quadríceps, equilíbrio' },
      { name: 'Prancha elevação perna', reps: '3×40s', muscle: 'Core, glúteos' },
      { name: 'Flexão diamante', reps: '3×8', muscle: 'Tríceps, peito interno' },
      { name: 'Remada unilateral elástico', reps: '3×10', muscle: 'Costas, bíceps' },
      { name: 'Rosca direta elástico', reps: '3×12', muscle: 'Bíceps' }
    ]},
    { phase: 4, label: 'Avançado', weeks: '13–16', exercises: [
      { name: 'Flexão com palma', reps: '3×8', muscle: 'Potência, peito' },
      { name: 'Pistol squat livre', reps: '3×8', muscle: 'Força, equilíbrio' },
      { name: 'L-sit no chão', reps: '3×20s', muscle: 'Core, flexores quadril' },
      { name: 'Flexão archer', reps: '3×6', muscle: 'Força unilateral' },
      { name: 'Remada forte elástico', reps: '3×10', muscle: 'Costas' },
      { name: 'Elevação lateral elástico', reps: '3×12', muscle: 'Ombros' }
    ]},
    { phase: 5, label: 'Avançado+', weeks: '17–20', exercises: [
      { name: 'Flexão com peso', reps: '3×10', muscle: 'Peito, tríceps' },
      { name: 'Shrimp squat assistido', reps: '3×6', muscle: 'Quadríceps' },
      { name: 'Dragon flag progressão', reps: '3×8', muscle: 'Core avançado' },
      { name: 'Flexão hindu', reps: '3×10', muscle: 'Peito, ombros' },
      { name: 'Crucifixo com elástico', reps: '3×12', muscle: 'Peito, costas' },
      { name: 'Pull-apart forte', reps: '3×15', muscle: 'Costas' }
    ]},
    { phase: 6, label: 'Pico', weeks: '21–22', exercises: [
      { name: 'Flexão palma explosiva', reps: '3×10', muscle: 'Potência máxima' },
      { name: 'Pistol squat', reps: '3×10', muscle: 'Força máxima' },
      { name: 'Dragon flag', reps: '3×8', muscle: 'Core avançado' },
      { name: 'Flexão archer', reps: '3×8', muscle: 'Força unilateral' },
      { name: 'Remada máximo elástico', reps: '3×12', muscle: 'Costas' }
    ]}
  ];

  const RUNNING = [
    { weeks: '1–2', dist: '2 km', method: 'Caminhada 4 min + Corrida 1 min', detail: 'Intervalado leve — adaptação' },
    { weeks: '3–4', dist: '2,5 km', method: 'Caminhada 3 min + Corrida 2 min', detail: 'Aumentando resistência' },
    { weeks: '5–6', dist: '3 km', method: 'Caminhada 2 min + Corrida 3 min', detail: 'Foco no cardio' },
    { weeks: '7–8', dist: '3,5 km', method: 'Caminhada 1 min + Corrida 4 min', detail: 'Acelerando o ritmo' },
    { weeks: '9–10', dist: '4 km', method: 'Corrida contínua leve', detail: 'Primeiro teste contínuo' },
    { weeks: '11–12', dist: '4,5 km', method: 'Corrida contínua', detail: 'Aumentando resistência' },
    { weeks: '13–14', dist: '5 km 🎯', method: 'Corrida contínua', detail: 'META ATINGIDA! 5 km contínuo!' },
    { weeks: '15–16', dist: '5 km', method: 'Corrida 3x/semana', detail: 'Consolidando a distância' },
    { weeks: '17–18', dist: '5 km', method: 'Corrida mais rápida', detail: 'Melhorando o pace' },
    { weeks: '19–20', dist: '5 km', method: 'Corrida 3x/semana', detail: 'Manutenção' },
    { weeks: '21–22', dist: '5 km 🏆', method: 'Corrida 3x/semana + pico', detail: 'Pico de performance!' }
  ];

  const AGENDA = [
    { day: 'Segunda', icon: '🏋️', activity: 'Calistenia (05:05)' },
    { day: 'Terça', icon: '🏃', activity: 'Corrida (05:05)' },
    { day: 'Quarta', icon: '🏋️', activity: 'Calistenia (05:05)' },
    { day: 'Quinta', icon: '🏃', activity: 'Corrida (05:05)' },
    { day: 'Sexta', icon: '🏋️', activity: 'Calistenia (05:05) + Mercado (14:30)' },
    { day: 'Sábado', icon: '🏃', activity: 'Corrida longa + Meal prep + Limpeza' },
    { day: 'Domingo', icon: '😴', activity: 'Descanso + Planejamento' }
  ];

  // ===== LISTA DE COMPRAS COMPLETA =====
  const SHOPPING_ITEMS = [
    // 🥩 AÇOUGUE / PROTEÍNAS
    { name: 'Peito de frango (1kg)', cat: '🥩 Açougue', priority: 1 },
    { name: 'Patinho moído (500g)', cat: '🥩 Açougue', priority: 1 },
    { name: 'Ovos (12 unid)', cat: '🥩 Açougue', priority: 1 },
    { name: 'Atum enlatado (2 latas)', cat: '🥩 Açougue', priority: 2 },

    // 🥗 FEIRA / HORTIFRUTI
    { name: 'Banana (6-8 unid)', cat: '🥗 Hortifruti', priority: 1 },
    { name: 'Maçã (4 unid)', cat: '🥗 Hortifruti', priority: 1 },
    { name: 'Brócolis (1 maço)', cat: '🥗 Hortifruti', priority: 1 },
    { name: 'Cenoura (3 unid)', cat: '🥗 Hortifruti', priority: 1 },
    { name: 'Vagem (200g)', cat: '🥗 Hortifruti', priority: 2 },
    { name: 'Alface crespa', cat: '🥗 Hortifruti', priority: 1 },
    { name: 'Tomate (3 unid)', cat: '🥗 Hortifruti', priority: 1 },
    { name: 'Alho (cabeça)', cat: '🥗 Hortifruti', priority: 2 },
    { name: 'Cebola (2 unid)', cat: '🥗 Hortifruti', priority: 2 },
    { name: 'Limão (3 unid)', cat: '🥗 Hortifruti', priority: 3 },
    { name: 'Gengibre', cat: '🥗 Hortifruti', priority: 3 },
    { name: 'Batata doce (3 unid)', cat: '🥗 Hortifruti', priority: 2 },

    // 🥛 LATICÍNIOS / FRIOS
    { name: 'Leite semidesnatado (1L)', cat: '🥛 Laticínios', priority: 1 },
    { name: 'Iogurte natural (pote)', cat: '🥛 Laticínios', priority: 2 },
    { name: 'Queijo minas ou muçarela (200g)', cat: '🥛 Laticínios', priority: 1 },
    { name: 'Requeijão light', cat: '🥛 Laticínios', priority: 2 },

    // 🍞 PADARIA / GRÃOS
    { name: 'Pão integral (pacote)', cat: '🍞 Padaria', priority: 1 },
    { name: 'Aveia em flocos (500g)', cat: '🍞 Padaria', priority: 1 },
    { name: 'Arroz integral (1kg)', cat: '🍞 Padaria', priority: 1 },
    { name: 'Quinoa em grãos (200g)', cat: '🍞 Padaria', priority: 3 },

    // 🔴 SUPLEMENTOS / MERCEARIA
    { name: 'Whey protein (1kg)', cat: '🔴 Suplementos', priority: 1 },
    { name: 'Whey Uêvo ou similar', cat: '🔴 Suplementos', priority: 1 },
    { name: 'Chia (200g)', cat: '🔴 Suplementos', priority: 1 },
    { name: 'Linhaça dourada', cat: '🔴 Suplementos', priority: 2 },
    { name: 'Castanha do pará (100g)', cat: '🔴 Suplementos', priority: 1 },
    { name: 'Castanha de caju (100g)', cat: '🔴 Suplementos', priority: 2 },
    { name: 'Pasta de amendoim', cat: '🔴 Suplementos', priority: 2 },

    // 🛒 CASA / HIGIENE
    { name: 'Azeite de oliva', cat: '🛒 Casa', priority: 2 },
    { name: 'Sal marinho', cat: '🛒 Casa', priority: 2 },
    { name: 'Temperos (páprica, orégano, curry)', cat: '🛒 Casa', priority: 3 },
    { name: 'Papel alumínio', cat: '🛒 Casa', priority: 3 },
    { name: 'Papel filme', cat: '🛒 Casa', priority: 3 },
    { name: 'Detergente', cat: '🛒 Casa', priority: 2 },
    { name: 'Esponja de louça (pacote)', cat: '🛒 Casa', priority: 2 },
    { name: 'Saco de lixo (30L)', cat: '🛒 Casa', priority: 2 },
    { name: 'Protetor solar facial FPS 50', cat: '🛒 Casa', priority: 1 },
    { name: 'Sabonete facial neutro', cat: '🛒 Casa', priority: 1 },
    { name: 'Óleo para barba', cat: '🛒 Casa', priority: 1 },
    { name: 'Pomada capilar leve', cat: '🛒 Casa', priority: 2 },
    { name: 'Papel higiênico (pacote 8)', cat: '🛒 Casa', priority: 1 },
    { name: 'Água sanitária', cat: '🛒 Casa', priority: 2 },
    { name: 'Desinfetante', cat: '🛒 Casa', priority: 2 },

    // 📦 COMPRAS FUTURAS / INVESTIMENTO
    { name: 'Lava-louças 8 serviços', cat: '📦 Investimento', priority: 4 },
    { name: 'Kit ganchos parede (capacete + jaqueta)', cat: '📦 Investimento', priority: 4 },
    { name: 'Spot para chaves', cat: '📦 Investimento', priority: 4 },
    { name: 'Aspirador vertical sem fio', cat: '📦 Investimento', priority: 4 },
    { name: 'Lâmpadas smart (kit 2-3)', cat: '📦 Investimento', priority: 4 },
    { name: 'Fechadura digital', cat: '📦 Investimento', priority: 4 },
    { name: 'Kit potes de vidro herméticos', cat: '📦 Investimento', priority: 4 },
    { name: 'Kit elásticos de resistência', cat: '📦 Investimento', priority: 4 },
    { name: 'Massagem desportiva (quinzenal)', cat: '📦 Investimento', priority: 4 }
  ];

  const SHOPPING_CATEGORIES = [
    '🥩 Açougue', '🥗 Hortifruti', '🥛 Laticínios', '🍞 Padaria',
    '🔴 Suplementos', '🛒 Casa', '📦 Investimento'
  ];

  const PLAN_INFO = [
    { key: 'Peso inicial', value: '97 kg' },
    { key: 'Peso meta', value: '83,5 kg' },
    { key: 'Gordura inicial', value: '~27%' },
    { key: 'Gordura meta', value: '15%' },
    { key: 'Corrida meta', value: '5 km 3×/sem' },
    { key: 'Calistenia', value: 'Pistol + Dragon Flag + Archer' },
    { key: 'Calorias início', value: '1.940 kcal' },
    { key: 'Calorias final', value: '1.660 kcal' },
    { key: 'Duração', value: '22 semanas (Ago–Dez 2026)' }
  ];

  // ==================================================================
  // STATE
  // ==================================================================

  let _alarmsScheduled = false; // Guard para evitar double-scheduling

  const STATE = {
    currentView: 'hoje',
    currentSub: 'diarias',
    currentDayTab: null,
    // Calendar navigation
    currentDate: new Date().toISOString().split('T')[0],
    // Schedule and tasks
    scheduleDone: {},
    tasksDone: {},
    shoppingDone: {},
    // Water
    waterCount: 0,
    waterDate: null,
    // Daily log (weight + sleep per dateKey)
    dailyLog: {},
    // Measurements
    measurements: [],
    workoutLog: [],
    notes: [],
    // Shopping filter
    shoppingFilter: 'all',
    // Settings
    startDate: '2026-08-01',
    initialWeight: 97
  };

  // ==================================================================
  // INIT
  // ==================================================================

  function init() {
    loadState();
    setupNavigation();
    setupSubNavigation();
    setupDateAndGreeting();
    setupDateNavigation();
    setupDailyLog();
    setupShoppingCategories();

    // Render all views
    renderToday();
    renderTasks();
    renderShopping();
    renderNotes();
    renderCalistenia();
    renderRunning();
    renderAgenda();
    renderProgress();
    renderSettings();

    // Setup event listeners
    setupWaterTracker();
    setupMeasurementForm();
    setupSettings();

    // Notifications
    setupNotifications();
    setupBadging();

    // Service Worker + alarm scheduling
    registerSW();
    scheduleAlarms();

    // Auto-update every minute
    setInterval(() => {
      updateScheduleHighlight();
      updateProgressRing();
    }, 60000);
  }

  // ==================================================================
  // LOCAL STORAGE
  // ==================================================================

  function loadState() {
    try {
      const saved = localStorage.getItem('minhaVidaState');
      if (saved) {
        const data = JSON.parse(saved);
        Object.assign(STATE, data);
      }
    } catch (e) { /* ignore */ }
  }

  function saveState() {
    try {
      localStorage.setItem('minhaVidaState', JSON.stringify(STATE));
    } catch (e) { /* ignore */ }
  }

  function getDateKey(date) {
    const d = date || new Date();
    return d.toISOString().split('T')[0];
  }

  function getDateFromKey(key) {
    const parts = key.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function getDayName(date) {
    const d = date || new Date();
    return DAYS_OF_WEEK[d.getDay()];
  }

  function getDayNameFromKey(key) {
    return getDayName(getDateFromKey(key));
  }

  function getScheduleForDay(date) {
    const dayName = getDayName(date);
    if (dayName === 'Sábado') return SCHEDULE.saturday;
    if (dayName === 'Domingo') return SCHEDULE.sunday;
    if (dayName === 'Sexta') return SCHEDULE.friday;
    return SCHEDULE.weekday;
  }

  function isItemDone(listKey, id, dateKey) {
    const key = dateKey || STATE.currentDate;
    if (!STATE[listKey]) STATE[listKey] = {};
    if (!STATE[listKey][key]) STATE[listKey][key] = [];
    return STATE[listKey][key].includes(id);
  }

  function toggleItemDone(listKey, id, dateKey) {
    const key = dateKey || STATE.currentDate;
    if (!STATE[listKey]) STATE[listKey] = {};
    if (!STATE[listKey][key]) STATE[listKey][key] = [];
    const arr = STATE[listKey][key];
    const idx = arr.indexOf(id);
    if (idx >= 0) { arr.splice(idx, 1); }
    else { arr.push(id); }
    saveState();
  }

  function getPercentComplete(listKey, ids, dateKey) {
    const key = dateKey || STATE.currentDate;
    if (!ids || ids.length === 0) return 0;
    if (!STATE[listKey]) STATE[listKey] = {};
    if (!STATE[listKey][key]) STATE[listKey][key] = [];
    const done = ids.filter(id => STATE[listKey][key].includes(id));
    return Math.round((done.length / ids.length) * 100);
  }

  // ==================================================================
  // DATE NAVIGATION
  // ==================================================================

  function setupDateNavigation() {
    document.getElementById('btn-prev-day').addEventListener('click', () => {
      const d = getDateFromKey(STATE.currentDate);
      d.setDate(d.getDate() - 1);
      STATE.currentDate = getDateKey(d);
      saveState();
      refreshTodayView();
    });

    document.getElementById('btn-next-day').addEventListener('click', () => {
      const d = getDateFromKey(STATE.currentDate);
      d.setDate(d.getDate() + 1);
      STATE.currentDate = getDateKey(d);
      saveState();
      refreshTodayView();
    });

    document.getElementById('btn-today').addEventListener('click', () => {
      STATE.currentDate = getDateKey();
      saveState();
      refreshTodayView();
    });

    document.getElementById('date-nav-display').addEventListener('click', () => {
      // Quick jump: show date picker
      const input = document.createElement('input');
      input.type = 'date';
      input.value = STATE.currentDate;
      input.style.position = 'fixed';
      input.style.top = '-100px';
      input.style.left = '-100px';
      document.body.appendChild(input);
      input.addEventListener('change', e => {
        STATE.currentDate = e.target.value;
        saveState();
        refreshTodayView();
        document.body.removeChild(input);
      });
      input.addEventListener('blur', () => {
        setTimeout(() => { if (document.body.contains(input)) document.body.removeChild(input); }, 500);
      });
      input.showPicker();
    });
  }

  function refreshTodayView() {
    updateDateDisplay();
    renderSchedule();
    renderDailyLog();
    updateProgressRing();
    // Reset water when viewing a different day
    // (only today's water is tracked)
  }

  function updateDateDisplay() {
    const date = getDateFromKey(STATE.currentDate);
    const today = new Date();
    const isToday = STATE.currentDate === getDateKey();

    const dayName = getDayName(date);
    const dayNum = date.getDate();
    const monthNum = date.getMonth() + 1;

    document.getElementById('nav-day-name').textContent = isToday ? 'Hoje' : dayName;
    document.getElementById('nav-date').textContent =
      `${String(dayNum).padStart(2, '0')}/${String(monthNum).padStart(2, '0')}`;
    document.getElementById('day-label').textContent = getDayNameFromKey(STATE.currentDate);
  }

  // ==================================================================
  // NAVIGATION
  // ==================================================================

  function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        switchView(view);
      });
    });

    // Handle hash-based navigation from shortcuts
    if (window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'peso') {
        setTimeout(() => {
          switchView('hoje');
          setTimeout(() => {
            document.getElementById('input-daily-weight')?.focus();
          }, 300);
        }, 500);
      } else if (hash === 'agua') {
        setTimeout(() => switchView('hoje'), 500);
      } else if (hash === 'compras') {
        setTimeout(() => {
          switchView('tarefas');
          setTimeout(() => {
            document.querySelector('.sub-nav-btn[data-sub="compras"]')?.click();
          }, 300);
        }, 500);
      }
    }
  }

  function switchView(view) {
    STATE.currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById('view-' + view);
    if (targetView) targetView.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const targetBtn = document.querySelector(`.nav-btn[data-view="${view}"]`);
    if (targetBtn) targetBtn.classList.add('active');

    if (view === 'hoje') {
      refreshTodayView();
    } else if (view === 'progresso') {
      renderProgress();
      setTimeout(() => renderChart(), 100);
    } else if (view === 'treinos') {
      renderCalistenia();
      renderRunning();
    } else if (view === 'tarefas') {
      renderTasks();
      renderShopping();
      renderNotes();
    }

    saveState();
  }

  function setupSubNavigation() {
    document.querySelectorAll('.sub-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.dataset.sub;
        const parent = btn.closest('.sub-nav').parentElement;
        parent.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        parent.querySelectorAll('.sub-view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById('sub-' + sub);
        if (target) target.classList.add('active');
        STATE.currentSub = sub;
        saveState();
      });
    });
  }

  // ==================================================================
  // DATE & GREETING
  // ==================================================================

  function setupDateAndGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const dayName = days[now.getDay()];
    const dateStr = now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

    let greeting;
    if (hour < 12) greeting = 'Bom dia';
    else if (hour < 18) greeting = 'Boa tarde';
    else greeting = 'Boa noite';

    document.getElementById('greeting').textContent = greeting + ', Jhona 👋';
    document.getElementById('header-date').textContent = dayName + ', ' + dateStr;

    updateDateDisplay();
  }

  // ==================================================================
  // TODAY VIEW
  // ==================================================================

  function renderToday() {
    updateDateDisplay();
    renderSchedule();
    renderMeals();
    updateProgressRing();
    setupWaterTracker();
    renderDailyLog();
  }

  function renderSchedule() {
    const list = document.getElementById('schedule-list');
    const date = getDateFromKey(STATE.currentDate);
    const schedule = getScheduleForDay(date);
    const dateKey = STATE.currentDate;

    list.innerHTML = schedule.map(item => {
      const done = isItemDone('scheduleDone', item.id, dateKey);
      const isNow = isCurrentTimeSlot(item);
      return `
        <div class="schedule-item ${done ? 'done' : ''} ${isNow ? 'now' : ''}"
             data-id="${item.id}" onclick="toggleScheduleDone('${item.id}')">
          <div class="schedule-check">${done ? '✓' : ''}</div>
          <span class="schedule-time">${item.time}</span>
          <span class="schedule-activity">${item.emoji} ${item.activity}</span>
        </div>
      `;
    }).join('');

    window.toggleScheduleDone = function(id) {
      toggleItemDone('scheduleDone', id, STATE.currentDate);
      renderSchedule();
      updateProgressRing();
    };

    updateScheduleHighlight();
  }

  function updateScheduleHighlight() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const items = document.querySelectorAll('.schedule-item');
    const isToday = STATE.currentDate === getDateKey();

    items.forEach(item => {
      item.classList.remove('now');
      if (!isToday) return;
      const timeStr = item.querySelector('.schedule-time')?.textContent || '';
      if (isCurrentTime(timeStr, currentMinutes)) {
        item.classList.add('now');
      }
    });
  }

  function isCurrentTime(timeStr, currentMinutes) {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return false;
    const startMinutes = parseInt(match[1]) * 60 + parseInt(match[2]);

    if (timeStr.includes('+')) {
      return currentMinutes >= startMinutes && currentMinutes < startMinutes + 60;
    }

    const endMatch = timeStr.match(/–(\d{1,2}):(\d{2})/);
    if (endMatch) {
      const endMinutes = parseInt(endMatch[1]) * 60 + parseInt(endMatch[2]);
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }

    if (timeStr === '22:00') {
      return currentMinutes >= 22 * 60 && currentMinutes < 22 * 60 + 30;
    }

    return Math.abs(currentMinutes - startMinutes) < 15;
  }

  function isCurrentTimeSlot(item) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return STATE.currentDate === getDateKey() && isCurrentTime(item.time, currentMinutes);
  }

  function updateProgressRing() {
    const date = getDateFromKey(STATE.currentDate);
    const schedule = getScheduleForDay(date);
    const dateKey = STATE.currentDate;
    const ids = schedule.map(s => s.id);
    const done = ids.filter(id => isItemDone('scheduleDone', id, dateKey));
    const pct = ids.length > 0 ? Math.round((done.length / ids.length) * 100) : 0;

    const circle = document.getElementById('progress-circle');
    const circumference = 339.292;
    const offset = circumference - (pct / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    document.getElementById('progress-percent').textContent = pct + '%';

    updateStreak();
  }

  function updateStreak() {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getDateKey(d);
      const schedule = getScheduleForDay(d);
      const ids = schedule.map(s => s.id);
      const doneCount = ids.filter(id => {
        if (!STATE.scheduleDone || !STATE.scheduleDone[key]) return false;
        return STATE.scheduleDone[key].includes(id);
      }).length;
      if (doneCount >= ids.length * 0.5) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    document.getElementById('stat-streak').textContent = streak;
  }

  function renderMeals() {
    const container = document.getElementById('meals-today');
    container.innerHTML = MEALS.map(m => `
      <div class="meal-card" onclick="showMealDetail('${m.name}')">
        <span class="meal-emoji">${m.emoji}</span>
        <span class="meal-name">${m.name}</span>
        <span class="meal-time">${m.time}</span>
        <span class="meal-desc">${m.desc}</span>
      </div>
    `).join('');

    window.showMealDetail = function(name) {
      const meal = MEALS.find(m => m.name === name);
      if (!meal) return;
      showModal(
        meal.emoji + ' ' + meal.name,
        `<p style="margin-bottom:6px;"><strong>Receita:</strong></p>
         <p style="font-size:13px;color:var(--text-secondary);">${meal.recipe}</p>
         <p style="margin-top:8px;font-size:12px;color:var(--text-muted);">${meal.desc}</p>`
      );
    };
  }

  // ==================================================================
  // DAILY LOG (WEIGHT + SLEEP + NOTE + COMPLETE DAY)
  // ==================================================================

  function setupDailyLog() {
    // --- Weight ---
    document.getElementById('btn-save-weight').addEventListener('click', () => {
      const val = parseFloat(document.getElementById('input-daily-weight').value);
      if (!val || val < 30 || val > 200) return;
      if (!STATE.dailyLog) STATE.dailyLog = {};
      if (!STATE.dailyLog[STATE.currentDate]) STATE.dailyLog[STATE.currentDate] = {};
      STATE.dailyLog[STATE.currentDate].weight = val;
      saveState();
      document.getElementById('input-daily-weight').value = '';
      renderDailyLog();
      renderGoals();
    });

    document.getElementById('btn-save-sleep').addEventListener('click', () => {
      const val = parseFloat(document.getElementById('input-daily-sleep').value);
      if (!val || val < 0 || val > 24) return;
      if (!STATE.dailyLog) STATE.dailyLog = {};
      if (!STATE.dailyLog[STATE.currentDate]) STATE.dailyLog[STATE.currentDate] = {};
      STATE.dailyLog[STATE.currentDate].sleep = val;
      saveState();
      document.getElementById('input-daily-sleep').value = '';
      renderDailyLog();
    });

    // --- Daily Note ---
    document.getElementById('btn-save-note-day')?.addEventListener('click', () => {
      const val = document.getElementById('daily-note-input').value.trim();
      if (!val) return;
      if (!STATE.dailyLog) STATE.dailyLog = {};
      if (!STATE.dailyLog[STATE.currentDate]) STATE.dailyLog[STATE.currentDate] = {};
      STATE.dailyLog[STATE.currentDate].note = val;
      saveState();
      document.getElementById('daily-note-input').value = '';
      renderDailyLog();
    });

    document.getElementById('daily-note-input')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('btn-save-note-day')?.click();
      }
    });

    // --- Complete Day Button ---
    document.getElementById('btn-complete-day')?.addEventListener('click', () => {
      const date = getDateFromKey(STATE.currentDate);
      const schedule = getScheduleForDay(date);
      const dateKey = STATE.currentDate;
      const allDone = schedule.every(item => isItemDone('scheduleDone', item.id, dateKey));

      if (allDone) {
        showModal('✅', 'Este dia já está completo! 🎉');
        return;
      }

      showModal(
        '✅ Concluir dia?',
        `Marcar todas as ${schedule.length} atividades como concluídas?`,
        () => {
          schedule.forEach(item => {
            if (!isItemDone('scheduleDone', item.id, dateKey)) {
              toggleItemDone('scheduleDone', item.id, dateKey);
            }
          });
          renderSchedule();
          updateProgressRing();
          renderDailyLog();
          showModal('🎉', 'Dia concluído! Continue assim! 💪');
        }
      );
    });
  }

  function renderDailyLog() {
    const display = document.getElementById('daily-log-display');
    const log = STATE.dailyLog && STATE.dailyLog[STATE.currentDate];

    // Show latest weight in stat box
    updateStatsFromLog();

    // --- Render weight/sleep display ---
    if (!log || (!log.weight && !log.sleep)) {
      display.innerHTML = '<span>Nada registrado ainda 📝</span>';
    } else {
      display.innerHTML = '';
      if (log.weight) {
        display.innerHTML += `<span>⚖️ <strong>${log.weight} kg</strong></span>`;
      }
      if (log.sleep) {
        display.innerHTML += `<span>😴 <strong>${log.sleep}h</strong> de sono</span>`;
      }
    }

    // --- Render daily note ---
    const noteDisplay = document.getElementById('daily-note-display');
    const noteInput = document.getElementById('daily-note-input');
    if (log && log.note && log.note.trim()) {
      noteDisplay.innerHTML = `
        📝 ${escapeHtml(log.note)}
        <button class="note-edit-btn" onclick="editDailyNote()">✏️</button>
      `;
      noteDisplay.style.display = 'block';
      noteInput.style.display = 'none';
    } else {
      noteDisplay.style.display = 'none';
      noteInput.style.display = '';
    }

    window.editDailyNote = function() {
      const logData = STATE.dailyLog && STATE.dailyLog[STATE.currentDate];
      if (logData && logData.note) {
        document.getElementById('daily-note-input').value = logData.note;
      }
      document.getElementById('daily-note-display').style.display = 'none';
      document.getElementById('daily-note-input').style.display = '';
      document.getElementById('daily-note-input').focus();
    };

    // --- Render complete day button ---
    const btn = document.getElementById('btn-complete-day');
    if (btn) {
      const date = getDateFromKey(STATE.currentDate);
      const schedule = getScheduleForDay(date);
      const dateKey = STATE.currentDate;
      const allDone = schedule.every(item => isItemDone('scheduleDone', item.id, dateKey));
      if (allDone) {
        btn.textContent = '🎉 Dia completo!';
        btn.classList.add('completed');
      } else {
        btn.textContent = '✅ Marcar dia como concluído';
        btn.classList.remove('completed');
      }
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function updateStatsFromLog() {
    // Show latest weight in the quick stats
    const allLogs = STATE.dailyLog || {};
    const todayLog = allLogs[getDateKey()];
    const weightEl = document.getElementById('stat-weight');
    const bfEl = document.getElementById('stat-bf');

    if (todayLog && todayLog.weight) {
      weightEl.textContent = todayLog.weight;
    } else {
      // Find last logged weight
      let lastWeight = STATE.initialWeight || 97;
      const sortedKeys = Object.keys(allLogs).sort().reverse();
      for (const key of sortedKeys) {
        if (allLogs[key].weight) {
          lastWeight = allLogs[key].weight;
          break;
        }
      }
      weightEl.textContent = lastWeight;
    }

    // BF from measurements
    const measurements = STATE.measurements || [];
    if (measurements.length > 0) {
      const last = measurements[measurements.length - 1];
      bfEl.textContent = last.bf ? last.bf : '--';
    } else {
      bfEl.textContent = '--';
    }
  }

  // ==================================================================
  // WATER TRACKER (with liters)
  // ==================================================================

  function setupWaterTracker() {
    const today = getDateKey();
    if (STATE.waterCount === undefined || STATE.waterCount === null) STATE.waterCount = 0;
    if (STATE.waterDate !== today) {
      STATE.waterCount = 0;
      STATE.waterDate = today;
      saveState();
    }
    renderWaterDisplay();
  }

  function renderWaterDisplay() {
    renderWaterCups();
    const currentLiters = ((STATE.waterCount * WATER_ML_PER_CUP) / 1000).toFixed(1);
    const totalLiters = WATER_TOTAL_L.toFixed(1);
    document.getElementById('water-counter').textContent = `${STATE.waterCount} / ${WATER_CUPS} copos`;

    // Liter bar
    const pct = Math.min(100, (STATE.waterCount / WATER_CUPS) * 100);
    const fill = document.getElementById('water-liter-fill');
    if (fill) fill.style.width = pct + '%';
    const text = document.getElementById('water-liter-text');
    if (text) text.textContent = `${currentLiters} de ${totalLiters} litros`;
  }

  function renderWaterCups() {
    const container = document.getElementById('water-tracker');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < WATER_CUPS; i++) {
      const cup = document.createElement('div');
      cup.className = 'water-cup' + (i < STATE.waterCount ? ' filled' : '');
      cup.textContent = i < STATE.waterCount ? '💧' : '';
      cup.addEventListener('click', () => toggleWater(i));
      container.appendChild(cup);
    }
  }

  function toggleWater(index) {
    if (index < STATE.waterCount) {
      STATE.waterCount = index;
    } else {
      STATE.waterCount = index + 1;
    }
    STATE.waterDate = getDateKey();
    saveState();
    renderWaterDisplay();
  }

  // ==================================================================
  // TASKS VIEW
  // ==================================================================

  function renderTasks() {
    renderDayTabs();
    renderDayTasks();
    setupTaskInput();
  }

  function renderDayTabs() {
    const container = document.getElementById('day-tabs');
    const today = getDayName();
    container.innerHTML = DAYS_OF_WEEK.map(d => `
      <button class="day-tab ${d === today ? 'active' : ''}" data-day="${d}"
              onclick="window.switchDayTab('${d}')">${d}</button>
    `).join('');

    window.switchDayTab = function(day) {
      document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
      document.querySelector(`.day-tab[data-day="${day}"]`)?.classList.add('active');
      STATE.currentDayTab = day;
      renderDayTasks(day);
    };

    STATE.currentDayTab = today;
  }

  function renderDayTasks(day) {
    const d = day || STATE.currentDayTab || getDayName();
    const tasks = WEEKLY_TASKS[d] || [];
    const container = document.getElementById('task-list');

    container.innerHTML = tasks.map(task => {
      const done = isItemDone('tasksDone', task);
      return `
        <div class="task-item ${done ? 'done' : ''}" onclick="toggleTask('${task.replace(/'/g, "\\'")}')">
          <div class="task-check">${done ? '✓' : ''}</div>
          <span class="task-text">${task}</span>
        </div>
      `;
    }).join('');

    window.toggleTask = function(task) {
      toggleItemDone('tasksDone', task, STATE.currentDate);
      const day = STATE.currentDayTab || getDayName();
      renderDayTasks(day);
      updateBadge();
    };
  }

  function setupTaskInput() {
    const input = document.getElementById('task-input');
    const btn = document.getElementById('btn-add-task');

    function addTask() {
      const task = input.value.trim();
      if (!task) return;
      const day = STATE.currentDayTab || getDayName();
      if (!WEEKLY_TASKS[day]) WEEKLY_TASKS[day] = [];
      WEEKLY_TASKS[day].push(task);
      saveState();
      input.value = '';
      renderDayTasks(day);
    }

    if (btn) btn.addEventListener('click', addTask);
    if (input) input.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });
  }

  // ==================================================================
  // SHOPPING (with categories)
  // ==================================================================

  function renderShopping() {
    renderShoppingAlerts();
    renderShoppingCategories();
    renderShoppingList();
    setupShoppingInput();
  }

  function setupShoppingCategories() {
    // Event delegation for category buttons
    document.getElementById('shopping-categories')?.addEventListener('click', e => {
      const btn = e.target.closest('.shop-cat-btn');
      if (!btn) return;
      document.querySelectorAll('.shop-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      STATE.shoppingFilter = btn.dataset.cat;
      saveState();
      renderShoppingList();
    });
  }

  function renderShoppingCategories() {
    const container = document.getElementById('shopping-categories');
    container.innerHTML = `
      <button class="shop-cat-btn ${STATE.shoppingFilter === 'all' ? 'active' : ''}" data-cat="all">📋 Todas</button>
      ${SHOPPING_CATEGORIES.map(cat => `
        <button class="shop-cat-btn ${STATE.shoppingFilter === cat ? 'active' : ''}" data-cat="${cat}">${cat}</button>
      `).join('')}
    `;
  }

  function renderShoppingAlerts() {
    const container = document.getElementById('shopping-alerts');
    const startDate = new Date(STATE.startDate || '2026-08-01');
    const weekNum = getWeekNumber(startDate);

    let alerts = [];
    if (weekNum <= 2) {
      alerts.push({ text: '🛒 Comprar Whey Uêvo 1kg (~R$ 100) — Semana 2 (08/08)', urgent: false });
    }
    if (weekNum <= 4) {
      alerts.push({ text: '🛒 Comprar kit elásticos (~R$ 50-70) — Semana 4 (22/08)', urgent: false });
    }

    container.innerHTML = alerts.length > 0
      ? alerts.map(a => `<div class="alert-banner ${a.urgent ? 'urgent' : ''}">${a.text}</div>`).join('')
      : '<div class="alert-banner" style="border-color:var(--success);background:var(--success-bg);">✅ Todos os alertas de compra resolvidos</div>';
  }

  function getWeekNumber(startDate) {
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    return Math.max(0, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1);
  }

  function renderShoppingList() {
    const savedItems = STATE.shoppingItems || SHOPPING_ITEMS.map(i => ({ ...i, done: false }));
    if (!STATE.shoppingItems) {
      STATE.shoppingItems = SHOPPING_ITEMS.map(i => ({ ...i, done: false }));
      saveState();
    }

    const filter = STATE.shoppingFilter || 'all';
    const filtered = filter === 'all' ? savedItems : savedItems.filter(i => i.cat === filter);

    // Sort by priority (1 = highest, 4 = lowest)
    filtered.sort((a, b) => a.priority - b.priority);

    const container = document.getElementById('shopping-list');

    if (filtered.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">Nada aqui ✨</p>';
      return;
    }

    container.innerHTML = filtered.map(item => {
      const idx = savedItems.indexOf(item);
      return `
        <div class="shop-item ${item.done ? 'done' : ''}" onclick="toggleShopping(${idx})">
          <div class="shop-check">${item.done ? '✓' : ''}</div>
          <span class="shop-text">${item.name}</span>
          <span class="shop-category">${item.cat}</span>
        </div>
      `;
    }).join('');

    window.toggleShopping = function(idx) {
      savedItems[idx].done = !savedItems[idx].done;
      STATE.shoppingItems = savedItems;
      saveState();
      renderShoppingList();
    };
  }

  function setupShoppingInput() {
    const input = document.getElementById('shopping-input');
    const btn = document.getElementById('btn-add-shopping');

    function addItem() {
      const name = input.value.trim();
      if (!name) return;
      STATE.shoppingItems = STATE.shoppingItems || [];
      STATE.shoppingItems.push({ name, cat: '🛒 Casa', priority: 2, done: false });
      saveState();
      input.value = '';
      renderShoppingList();
    }

    if (btn) btn.addEventListener('click', addItem);
    if (input) input.addEventListener('keypress', e => { if (e.key === 'Enter') addItem(); });
  }

  // ==================================================================
  // NOTES
  // ==================================================================

  function renderNotes() {
    const notes = STATE.notes || [];
    const grid = document.getElementById('notes-grid');
    const editor = document.getElementById('note-editor');

    grid.innerHTML = notes.length > 0 ? notes.map((note, i) => `
      <div class="note-card" onclick="window.editNote(${i})">
        <p>${note.text.substring(0, 120)}${note.text.length > 120 ? '...' : ''}</p>
        <small>${new Date(note.date).toLocaleDateString('pt-BR')}</small>
      </div>
    `).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Nenhuma nota ainda</p>';

    window.editNote = function(idx) {
      const note = STATE.notes[idx];
      document.getElementById('note-textarea').value = note.text;
      editor.style.display = 'block';
      editor.dataset.editIdx = idx;
      document.getElementById('btn-new-note').style.display = 'none';
    };

    document.getElementById('btn-new-note').addEventListener('click', () => {
      document.getElementById('note-textarea').value = '';
      editor.style.display = 'block';
      delete editor.dataset.editIdx;
      document.getElementById('btn-new-note').style.display = 'none';
    });

    document.getElementById('btn-save-note').addEventListener('click', () => {
      const text = document.getElementById('note-textarea').value.trim();
      if (!text) return;
      const idx = editor.dataset.editIdx;
      if (idx !== undefined) {
        STATE.notes[idx].text = text;
        STATE.notes[idx].date = new Date().toISOString();
      } else {
        STATE.notes.push({ text, date: new Date().toISOString() });
      }
      saveState();
      editor.style.display = 'none';
      document.getElementById('btn-new-note').style.display = 'block';
      renderNotes();
    });

    document.getElementById('btn-cancel-note').addEventListener('click', () => {
      editor.style.display = 'none';
      document.getElementById('btn-new-note').style.display = 'block';
    });
  }

  // ==================================================================
  // WORKOUTS
  // ==================================================================

  function renderCalistenia() {
    const startDate = new Date(STATE.startDate || '2026-08-01');
    const weekNum = Math.min(getWeekNumber(startDate), 22);

    let currentPhase = CALISTENIA[0];
    for (const phase of CALISTENIA) {
      const [start, end] = phase.weeks.split('–').map(Number);
      if (weekNum >= start && weekNum <= end) {
        currentPhase = phase;
        break;
      }
    }

    document.getElementById('phase-label').textContent = `Fase ${currentPhase.phase} — ${currentPhase.label}`;
    document.getElementById('phase-weeks').textContent = `Semanas ${currentPhase.weeks}`;
    document.getElementById('week-text').textContent = `Semana ${weekNum} / 22`;

    const bar = document.getElementById('week-bar');
    const fill = document.createElement('div');
    fill.className = 'week-bar-fill';
    fill.style.width = (weekNum / 22 * 100) + '%';
    bar.innerHTML = '';
    bar.appendChild(fill);

    const container = document.getElementById('exercises-list');
    container.innerHTML = currentPhase.exercises.map(ex => `
      <div class="exercise-card">
        <div>
          <div class="ex-name">${ex.name}</div>
          <div class="ex-detail">${ex.reps}</div>
        </div>
        <span class="ex-muscle">${ex.muscle}</span>
      </div>
    `).join('');
  }

  function renderRunning() {
    const startDate = new Date(STATE.startDate || '2026-08-01');
    const weekNum = Math.min(getWeekNumber(startDate), 22);
    // Ensure weekNum is at least 1
    const safeWeek = Math.max(1, weekNum);

    let currentRun = RUNNING[0];
    for (const run of RUNNING) {
      const [start, end] = run.weeks.split('–').map(Number);
      if (safeWeek >= start && safeWeek <= end) {
        currentRun = run;
        break;
      }
    }

    document.getElementById('run-week-label').textContent = `Semana ${currentRun.weeks}`;

    const bar = document.getElementById('run-week-bar');
    const fill = document.createElement('div');
    fill.className = 'week-bar-fill';
    fill.style.width = (safeWeek / 22 * 100) + '%';
    fill.style.background = '#16A34A';
    bar.innerHTML = '';
    bar.appendChild(fill);
    document.getElementById('run-week-text').textContent = `Semana ${safeWeek} / 22`;

    const container = document.getElementById('run-detail');
    container.innerHTML = `
      <h4>🏃 Semanas ${currentRun.weeks}</h4>
      <p><strong>Distância:</strong> ${currentRun.dist}</p>
      <p><strong>Método:</strong> ${currentRun.method}</p>
      <p style="margin-top:8px;">${currentRun.detail}</p>
    `;
  }

  function renderAgenda() {
    const container = document.getElementById('weekly-agenda');
    container.innerHTML = AGENDA.map(a => `
      <div class="agenda-day-card">
        <span class="agenda-day">${a.day}</span>
        <span class="agenda-icon">${a.icon}</span>
        <span class="agenda-activity">${a.activity}</span>
      </div>
    `).join('');
  }

  // ==================================================================
  // PROGRESS VIEW
  // ==================================================================

  function renderProgress() {
    renderGoals();
    renderMeasurementsList();
    renderWorkoutCalendar();
    renderSleepChart();
  }

  function renderSleepChart() {
    const container = document.getElementById('sleep-bars');
    if (!container) return;

    const log = STATE.dailyLog || {};
    const today = new Date();
    const bars = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getDateKey(d);
      const dayData = log[key];
      const hours = dayData ? dayData.sleep : null;
      const dayName = DAYS_ABBR[d.getDay()];
      bars.push({ key, hours, dayName, date: d.getDate() });
    }

    const maxSleep = 10;
    container.innerHTML = bars.map(b => {
      const pct = b.hours ? Math.min(100, (b.hours / maxSleep) * 100) : 10;
      const color = b.hours
        ? (b.hours >= 7 ? '#16A34A' : b.hours >= 6 ? '#F59E0B' : '#EF4444')
        : '#E2E8F0';
      return `
        <div class="sleep-bar-wrap">
          <span class="sleep-bar-val">${b.hours ? b.hours + 'h' : '--'}</span>
          <div class="sleep-bar" style="height:${pct}%;background:${color};"></div>
          <span class="sleep-bar-label">${b.dayName}</span>
        </div>
      `;
    }).join('');
  }

  function renderGoals() {
    const log = STATE.dailyLog || {};
    const sortedKeys = Object.keys(log).sort().reverse();
    let currentWeight = STATE.initialWeight || 97;
    let currentBF = 27;

    // Get latest weight from daily log
    for (const key of sortedKeys) {
      if (log[key].weight) {
        currentWeight = log[key].weight;
        break;
      }
    }

    // Get latest BF from measurements
    const measurements = STATE.measurements || [];
    if (measurements.length > 0) {
      const last = measurements[measurements.length - 1];
      if (last.bf) currentBF = last.bf;
    }

    document.getElementById('current-weight').textContent = currentWeight + ' kg';
    document.getElementById('current-bf').textContent = currentBF + '%';

    const weightProgress = Math.min(100, Math.max(0, ((97 - currentWeight) / (97 - 83.5)) * 100));
    document.getElementById('weight-bar-fill').style.width = weightProgress + '%';

    const bfProgress = Math.min(100, Math.max(0, ((27 - currentBF) / (27 - 15)) * 100));
    document.getElementById('bf-bar-fill').style.width = bfProgress + '%';
  }

  function setupMeasurementForm() {
    document.getElementById('btn-add-measurement').addEventListener('click', () => {
      const form = document.getElementById('measurement-form');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('btn-save-measurement').addEventListener('click', () => {
      const weight = parseFloat(document.getElementById('input-weight').value);
      const bf = parseFloat(document.getElementById('input-bf').value);
      if (!weight && !bf) return;

      STATE.measurements = STATE.measurements || [];
      STATE.measurements.push({
        date: new Date().toISOString(),
        weight: weight || null,
        bf: bf || null
      });
      saveState();

      document.getElementById('measurement-form').style.display = 'none';
      document.getElementById('input-weight').value = '';
      document.getElementById('input-bf').value = '';
      renderProgress();
    });
  }

  function renderMeasurementsList() {
    const measurements = STATE.measurements || [];
    const container = document.getElementById('measurements-list');
    const recent = measurements.slice(-10).reverse();

    container.innerHTML = recent.length > 0 ? recent.map(m => `
      <div class="measurement-row">
        <span class="m-date">${new Date(m.date).toLocaleDateString('pt-BR')}</span>
        <span class="m-value">${m.weight ? m.weight + ' kg' : '--'} / ${m.bf ? m.bf + '% BF' : '--'}</span>
      </div>
    `).join('') : '<p style="color:var(--text-muted);text-align:center;padding:16px;">Nenhuma medição ainda</p>';
  }

  function renderChart() {
    const canvas = document.getElementById('progress-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width === 0) {
      setTimeout(() => renderChart(), 200);
      return;
    }
    canvas.width = rect.width * dpr;
    canvas.height = 220 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '220px';
    ctx.scale(dpr, dpr);

    const measurements = STATE.measurements || [];
    const w = rect.width;
    const h = 220;
    const padding = { top: 20, bottom: 30, left: 40, right: 20 };

    ctx.clearRect(0, 0, w, h);

    if (measurements.length < 2) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Adicione medições para ver o gráfico', w / 2, h / 2);
      return;
    }

    const validWeight = measurements.filter(m => m.weight);
    if (validWeight.length < 2) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Adicione mais medições para ver o gráfico', w / 2, h / 2);
      return;
    }

    const minWeight = Math.min(...validWeight.map(m => m.weight)) - 2;
    const maxWeight = Math.max(...validWeight.map(m => m.weight)) + 2;

    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = padding.top + (chartH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }

    if (maxWeight !== minWeight) {
      const goalY = padding.top + chartH - ((83.5 - minWeight) / (maxWeight - minWeight)) * chartH;
      ctx.strokeStyle = '#16A34A';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padding.left, goalY);
      ctx.lineTo(w - padding.right, goalY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#16A34A';
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Meta 83,5kg', padding.left, goalY - 4);
    }

    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2;
    ctx.beginPath();

    validWeight.forEach((m, i) => {
      const x = padding.left + (i / (validWeight.length - 1)) * chartW;
      const y = padding.top + chartH - ((m.weight - minWeight) / (maxWeight - minWeight)) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    validWeight.forEach((m, i) => {
      const x = padding.left + (i / (validWeight.length - 1)) * chartW;
      const y = padding.top + chartH - ((m.weight - minWeight) / (maxWeight - minWeight)) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2563EB';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '9px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(m.weight + 'kg', x, y - 10);
    });

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 3; i++) {
      const val = maxWeight - (i / 3) * (maxWeight - minWeight);
      const y = padding.top + (chartH / 3) * i;
      ctx.fillText(Math.round(val * 10) / 10 + '', padding.left - 6, y + 4);
    }
  }

  function renderWorkoutCalendar() {
    const container = document.getElementById('workout-calendar');
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const workoutTypes = ['😴', '🏋️', '🏃', '🏋️', '🏃', '🏋️', '🏃'];
    const workoutNames = ['Descanso', 'Calistenia', 'Corrida', 'Calistenia', 'Corrida', 'Calistenia', 'Corrida'];

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const key = getDateKey(d);
      const dayIdx = d.getDay();
      days.push({
        date: d,
        key,
        dayName: DAYS_OF_WEEK[dayIdx],
        icon: workoutTypes[dayIdx],
        workout: workoutNames[dayIdx],
        done: STATE.workoutLog && STATE.workoutLog[key]
      });
    }

    container.innerHTML = days.map(d => `
      <div class="workout-day" onclick="toggleWorkoutDone('${d.key}')">
        <span class="wd-date">${d.dayName}, ${d.date.getDate()}/${d.date.getMonth() + 1}</span>
        <span class="wd-type">${d.icon} ${d.workout}</span>
        <span class="wd-status">${d.done ? '✅' : '⬜'}</span>
      </div>
    `).join('');

    window.toggleWorkoutDone = function(key) {
      if (!STATE.workoutLog) STATE.workoutLog = {};
      STATE.workoutLog[key] = !STATE.workoutLog[key];
      saveState();
      renderWorkoutCalendar();
    };
  }

  // ==================================================================
  // SETTINGS
  // ==================================================================

  function renderSettings() {
    const startDate = STATE.startDate || '2026-08-01';
    document.getElementById('start-date').value = startDate;
    document.getElementById('initial-weight').value = STATE.initialWeight || 97;

    const container = document.getElementById('plan-summary');
    container.innerHTML = PLAN_INFO.map(p => `
      <div class="plan-row">
        <span class="plan-key">${p.key}</span>
        <span class="plan-value">${p.value}</span>
      </div>
    `).join('');
  }

  function setupSettings() {
    document.getElementById('start-date').addEventListener('change', e => {
      STATE.startDate = e.target.value;
      saveState();
      renderCalistenia();
      renderRunning();
    });

    document.getElementById('initial-weight').addEventListener('change', e => {
      STATE.initialWeight = parseFloat(e.target.value) || 97;
      saveState();
      renderGoals();
    });

    document.getElementById('btn-export-data').addEventListener('click', exportData);
    document.getElementById('btn-reset-data').addEventListener('click', resetData);
  }

  function exportData() {
    const data = JSON.stringify(STATE, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'minha-vida-backup-' + getDateKey() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function resetData() {
    showModal(
      '🗑️ Resetar dados?',
      'Tem certeza? Todos os seus dados serão perdidos.',
      () => {
        localStorage.removeItem('minhaVidaState');
        Object.assign(STATE, {
          scheduleDone: {}, tasksDone: {}, shoppingDone: {},
          waterCount: 0, waterDate: null,
          dailyLog: {},
          measurements: [], workoutLog: {}, notes: [],
          shoppingItems: null, shoppingFilter: 'all',
          currentDate: getDateKey(),
          startDate: '2026-08-01', initialWeight: 97
        });
        saveState();
        window.location.reload();
      }
    );
  }

  // ==================================================================
  // NOTIFICATIONS & ALARMS
  // ==================================================================

  function setupNotifications() {
    document.getElementById('btn-notification').addEventListener('click', () => {
      requestNotificationPermission();
    });

    document.getElementById('btn-enable-notifications').addEventListener('click', () => {
      requestNotificationPermission();
    });
  }

  function requestNotificationPermission() {
    if (!('Notification' in window)) {
      showModal('🔔', 'Notificações não suportadas neste navegador.');
      return;
    }
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        showModal('🔔 Notificações ativadas!', 'Você receberá alarmes nos horários da sua rotina.');
        scheduleAlarms();
      } else {
        showModal('🔔', 'Permissão negada. Ative nas configurações do navegador.');
      }
    });
  }

  function scheduleAlarms() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (_alarmsScheduled) return;
    _alarmsScheduled = true;

    const now = new Date();
    const schedule = getScheduleForDay(now);
    const todayKey = getDateKey();
    const notifications = [];

    schedule.forEach(item => {
      const match = item.time.match(/(\d{1,2}):(\d{2})/);
      if (!match) return;

      const hour = parseInt(match[1]);
      const min = parseInt(match[2]);
      const alarmTime = new Date(now);
      alarmTime.setHours(hour, min, 0, 0);

      // Only future alarms (within next 24h)
      if (alarmTime <= now) return;
      if (alarmTime.getTime() - now.getTime() > 24 * 60 * 60 * 1000) return;

      // Don't schedule if already done today
      if (isItemDone('scheduleDone', item.id, todayKey)) return;

      notifications.push({
        id: getNumericId(item.id),
        title: item.emoji + ' ' + item.activity,
        body: 'Hora de ' + item.activity.toLowerCase(),
        time: alarmTime.getTime(),
        action: 'schedule_done',
        scheduleId: item.id
      });
    });

    if (notifications.length === 0) return;

    // === TRY 1: Capacitor native plugin (works when app is closed) ===
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications) {
      try {
        Capacitor.Plugins.LocalNotifications.schedule({
          notifications: notifications.map(n => ({
            id: n.id,
            title: n.title,
            body: n.body,
            schedule: { at: new Date(n.time) },
            sound: 'default',
            smallIcon: 'ic_stat_icon',
            actionTypeId: '',
            extra: null
          }))
        });
        console.log('✅ Alarmes agendados via Capacitor nativo');
        return;
      } catch (e) {
        console.warn('Capacitor native notifications failed, falling back to SW:', e);
      }
    }

    // === TRY 2: Service Worker (works when app is running/bg) ===
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATIONS',
        notifications: notifications.map(n => ({
          id: n.scheduleId,
          title: n.title,
          body: n.body,
          time: n.time,
          action: n.action
        }))
      });
    }
  }

  function getNumericId(str) {
    // Convert string IDs like 'exercise' to numeric hash for Capacitor
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Força inteiro 32-bit
    }
    return Math.abs(hash) % 100000;
  }

  // Listen for service worker messages (notification actions)
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data && e.data.type === 'NOTIFICATION_ACTION') {
        if (e.data.action === 'schedule_done' && e.data.id) {
          toggleItemDone('scheduleDone', e.data.id, getDateKey());
          renderSchedule();
          updateProgressRing();
        }
      }
    });
  }

  // ==================================================================
  // BADGING API (show pending task count on icon)
  // ==================================================================

  function setupBadging() {
    updateBadge();
    // Update badge every minute
    setInterval(updateBadge, 60000);
  }

  function updateBadge() {
    if (!navigator.setAppBadge) return;

    const today = new Date();
    const schedule = getScheduleForDay(today);
    const dateKey = getDateKey();
    const pending = schedule.filter(item => !isItemDone('scheduleDone', item.id, dateKey));

    if (pending.length > 0) {
      navigator.setAppBadge(pending.length).catch(() => {});
    } else {
      navigator.clearAppBadge().catch(() => {});
    }
  }

  // ==================================================================
  // SERVICE WORKER
  // ==================================================================

  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});      // Re-schedule alarms when service worker is ready
      navigator.serviceWorker.ready.then(() => {
        if (Notification.permission === 'granted') {
          setTimeout(scheduleAlarms, 2000);
        }
      }).catch(() => {});
    }
  }

  // ==================================================================
  // MODAL
  // ==================================================================

  function showModal(title, body, onConfirm) {
    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <h3>${title}</h3>
        <p>${body}</p>
        <div class="modal-actions">
          <button class="btn-secondary" id="modal-cancel">${onConfirm ? 'Cancelar' : 'Fechar'}</button>
          ${onConfirm ? '<button class="btn-danger" id="modal-confirm">Confirmar</button>' : ''}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('modal-cancel').addEventListener('click', () => overlay.remove());
    if (onConfirm) {
      document.getElementById('modal-confirm').addEventListener('click', () => {
        overlay.remove();
        onConfirm();
      });
    }
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  }

  window.showModal = showModal;

  // ==================================================================
  // START
  // ==================================================================

  document.addEventListener('DOMContentLoaded', init);
})();
