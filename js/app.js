/* ─── FITSAÚDE MAIN APP INITIALIZER ───────────────────────────── */

const DEFAULT_MASCULINO = [
  {
    day: 'Segunda', short: 'SEG', icon: '<i class="fa-solid fa-person-running"></i>', name: 'Peito & Tríceps', color: '#dc143c', dur: '60 min', lvl: 'Alta', rest: false, image: 'images/chest.png',
    exercises: [
      { id: 'm_s1', name: 'Supino Reto com Barra', muscle: 'Peitoral', sets: 4, reps: '8-10', weight: '60 kg' },
      { id: 'm_s2', name: 'Supino Inclinado com Halteres', muscle: 'Peitoral', sets: 3, reps: '10-12', weight: '22 kg' },
      { id: 'm_s3', name: 'Crucifixo na Polia', muscle: 'Peitoral', sets: 3, reps: '12-15', weight: '15 kg' },
      { id: 'm_s4', name: 'Tríceps Corda', muscle: 'Tríceps', sets: 4, reps: '12', weight: '30 kg' },
      { id: 'm_s5', name: 'Tríceps Testa', muscle: 'Tríceps', sets: 3, reps: '10-12', weight: '24 kg' }
    ]
  },
  {
    day: 'Terça', short: 'TER', icon: '<i class="fa-solid fa-shoe-prints"></i>', name: 'Pernas & Quadríceps', color: '#4cc9f0', dur: '75 min', lvl: 'Muito Alta', rest: false, image: 'images/legs.png',
    exercises: [
      { id: 'm_t1', name: 'Agachamento Livre', muscle: 'Quadríceps', sets: 5, reps: '6-8', weight: '80 kg' },
      { id: 'm_t2', name: 'Leg Press 45°', muscle: 'Quadríceps', sets: 4, reps: '10-12', weight: '180 kg' },
      { id: 'm_t3', name: 'Stiff com Barra', muscle: 'Posterior', sets: 4, reps: '10', weight: '50 kg' },
      { id: 'm_t4', name: 'Cadeira Extensora', muscle: 'Quadríceps', sets: 3, reps: '15', weight: '50 kg' },
      { id: 'm_t5', name: 'Cadeira Flexora', muscle: 'Posterior', sets: 3, reps: '12', weight: '40 kg' },
      { id: 'm_t6', name: 'Panturrilha em Pé', muscle: 'Pernas', sets: 4, reps: '20', weight: '80 kg' }
    ]
  },
  {
    day: 'Quarta', short: 'QUA', icon: '<i class="fa-solid fa-hand-fist"></i>', name: 'Costas & Bíceps', color: '#a78bfa', dur: '65 min', lvl: 'Alta', rest: false, image: 'images/back.png',
    exercises: [
      { id: 'm_q1', name: 'Puxada Aberta no Pulley', muscle: 'Costas', sets: 4, reps: '8-10', weight: '55 kg' },
      { id: 'm_q2', name: 'Remada Curvada com Barra', muscle: 'Costas', sets: 4, reps: '10', weight: '50 kg' },
      { id: 'm_q3', name: 'Remada Unilateral (Serrote)', muscle: 'Costas', sets: 3, reps: '10 cada', weight: '24 kg' },
      { id: 'm_q4', name: 'Rosca Direta com Barra W', muscle: 'Bíceps', sets: 4, reps: '10-12', weight: '22 kg' },
      { id: 'm_q5', name: 'Rosca Martelo com Halteres', muscle: 'Bíceps', sets: 3, reps: '12', weight: '14 kg' }
    ]
  },
  { day: 'Quinta', short: 'QUI', icon: '<i class="fa-solid fa-bed"></i>', name: 'Descanso & Recuperação', color: '#22d3a0', dur: '—', lvl: '—', rest: true, image: 'images/rest.png', exercises: [] },
  {
    day: 'Sexta', short: 'SEX', icon: '<i class="fa-solid fa-fire"></i>', name: 'Ombros & Core', color: '#ffd166', dur: '55 min', lvl: 'Média-Alta', rest: false, image: 'images/shoulders.png',
    exercises: [
      { id: 'm_x1', name: 'Desenvolvimento com Halteres', muscle: 'Ombros', sets: 4, reps: '10-12', weight: '20 kg' },
      { id: 'm_x2', name: 'Elevação Lateral na Polia', muscle: 'Ombros', sets: 4, reps: '12-15', weight: '8 kg' },
      { id: 'm_x3', name: 'Elevação Frontal', muscle: 'Ombros', sets: 3, reps: '12', weight: '10 kg' },
      { id: 'm_x4', name: 'Abdominal infra Paralelas', muscle: 'Core', sets: 3, reps: '15-20', weight: 'Corpo' },
      { id: 'm_x5', name: 'Prancha Isométrica', muscle: 'Core', sets: 3, reps: '60 seg', weight: 'Corpo' }
    ]
  },
  {
    day: 'Sábado', short: 'SÁB', icon: '<i class="fa-solid fa-bolt"></i>', name: 'Full Body & Força', color: '#ef476f', dur: '80 min', lvl: 'Alta', rest: false, image: 'images/fullbody.png',
    exercises: [
      { id: 'm_a1', name: 'Levantamento Terra', muscle: 'Costas', sets: 4, reps: '5', weight: '100 kg' },
      { id: 'm_a2', name: 'Barra Fixa', muscle: 'Costas', sets: 3, reps: 'Máx', weight: 'Corpo' },
      { id: 'm_a3', name: 'Flexão de Braço', muscle: 'Peitoral', sets: 3, reps: '15-20', weight: 'Corpo' },
      { id: 'm_a4', name: 'Agachamento Búlgaro', muscle: 'Pernas', sets: 3, reps: '10 cada', weight: '16 kg' },
      { id: 'm_a5', name: 'Burpees', muscle: 'Full Body', sets: 3, reps: '12', weight: 'Corpo' }
    ]
  },
  { day: 'Domingo', short: 'DOM', icon: '<i class="fa-solid fa-spa"></i>', name: 'Descanso/Cardio Leve', color: '#22d3a0', dur: '30 min', lvl: 'Baixa', rest: true, image: 'images/rest.png', exercises: [] }
];

const DEFAULT_FEMININO = [
  {
    day: 'Segunda', short: 'SEG', icon: '<i class="fa-solid fa-person-walking"></i>', name: 'Glúteos & Posterior', color: '#e11d48', dur: '65 min', lvl: 'Alta', rest: false, image: 'images/fem_glutes.jpg',
    exercises: [
      { id: 'f_s1', name: 'Elevação Pélvica com Barra', muscle: 'Pernas', sets: 4, reps: '10-12', weight: '50 kg' },
      { id: 'f_s2', name: 'Stiff com Halteres', muscle: 'Pernas', sets: 4, reps: '12', weight: '14 kg' },
      { id: 'f_s3', name: 'Cadeira Flexora', muscle: 'Pernas', sets: 3, reps: '12-15', weight: '35 kg' },
      { id: 'f_s4', name: 'Glúteo na Polia (Coice)', muscle: 'Pernas', sets: 4, reps: '12 cada', weight: '15 kg' },
      { id: 'f_s5', name: 'Cadeira Abdutora', muscle: 'Pernas', sets: 3, reps: '15-20', weight: '45 kg' }
    ]
  },
  {
    day: 'Terça', short: 'TER', icon: '<i class="fa-solid fa-dumbbell"></i>', name: 'Membros Superiores & Postura', color: '#a78bfa', dur: '55 min', lvl: 'Média', rest: false, image: 'images/fem_upper.jpg',
    exercises: [
      { id: 'f_t1', name: 'Puxada Aberta no Pulley', muscle: 'Costas', sets: 3, reps: '12', weight: '30 kg' },
      { id: 'f_t2', name: 'Desenvolvimento com Halteres', muscle: 'Ombros', sets: 3, reps: '12', weight: '8 kg' },
      { id: 'f_t3', name: 'Elevação Lateral', muscle: 'Ombros', sets: 3, reps: '15', weight: '5 kg' },
      { id: 'f_t4', name: 'Tríceps Corda', muscle: 'Tríceps', sets: 3, reps: '12', weight: '20 kg' },
      { id: 'f_t5', name: 'Rosca Direta com Halteres', muscle: 'Bíceps', sets: 3, reps: '12', weight: '6 kg' }
    ]
  },
  {
    day: 'Quarta', short: 'QUA', icon: '<i class="fa-solid fa-shoe-prints"></i>', name: 'Quadríceps & Glúteo Enfático', color: '#4cc9f0', dur: '70 min', lvl: 'Alta', rest: false, image: 'images/fem_legs.jpg',
    exercises: [
      { id: 'f_q1', name: 'Agachamento Sumô com Halter', muscle: 'Pernas', sets: 4, reps: '10-12', weight: '20 kg' },
      { id: 'f_q2', name: 'Leg Press Horizontal', muscle: 'Pernas', sets: 4, reps: '12', weight: '100 kg' },
      { id: 'f_q3', name: 'Passada/Afundo com Halteres', muscle: 'Pernas', sets: 3, reps: '10 cada', weight: '8 kg' },
      { id: 'f_q4', name: 'Cadeira Extensora', muscle: 'Pernas', sets: 3, reps: '15', weight: '40 kg' },
      { id: 'f_q5', name: 'Panturrilha no Leg Press', muscle: 'Pernas', sets: 4, reps: '15-20', weight: '60 kg' }
    ]
  },
  { day: 'Quinta', short: 'QUI', icon: '<i class="fa-solid fa-bed"></i>', name: 'Descanso & Mobilidade', color: '#22d3a0', dur: '—', lvl: '—', rest: true, image: 'images/fem_rest.jpg', exercises: [] },
  {
    day: 'Sexta', short: 'SEX', icon: '<i class="fa-solid fa-fire"></i>', name: 'Core, Definição & Cardio', color: '#ffd166', dur: '50 min', lvl: 'Média-Alta', rest: false, image: 'images/fem_core.jpg',
    exercises: [
      { id: 'f_x1', name: 'Prancha Dinâmica', muscle: 'Core', sets: 3, reps: '45 seg', weight: 'Corpo' },
      { id: 'f_x2', name: 'Abdominal Infra na Prancha', muscle: 'Core', sets: 3, reps: '15-20', weight: 'Corpo' },
      { id: 'f_x3', name: 'Mountain Climbers', muscle: 'Core', sets: 3, reps: '40 seg', weight: 'Corpo' },
      { id: 'f_x4', name: 'Abdominal Oblíquio Russo', muscle: 'Core', sets: 3, reps: '20 total', weight: '5 kg' },
      { id: 'f_x5', name: 'Cardio Esteira Inclinada', muscle: 'Cardio', sets: 1, reps: '25 min', weight: 'Caminhada' }
    ]
  },
  {
    day: 'Sábado', short: 'SÁB', icon: '<i class="fa-solid fa-bolt"></i>', name: 'Booty Sculpt & Full Body', color: '#ef476f', dur: '65 min', lvl: 'Alta', rest: false, image: 'images/fem_fullbody.jpg',
    exercises: [
      { id: 'f_a1', name: 'Agachamento Búlgaro', muscle: 'Pernas', sets: 3, reps: '10 cada', weight: '10 kg' },
      { id: 'f_a2', name: 'Elevação Pélvica Unilateral', muscle: 'Pernas', sets: 3, reps: '12 cada', weight: 'Corpo' },
      { id: 'f_a3', name: 'Remada Baixa Triângulo', muscle: 'Costas', sets: 3, reps: '12', weight: '25 kg' },
      { id: 'f_a4', name: 'Flexão de Braço no Banco', muscle: 'Peitoral', sets: 3, reps: '12', weight: 'Corpo' },
      { id: 'f_a5', name: 'Polichinelos / Corda', muscle: 'Cardio', sets: 3, reps: '1 min', weight: 'Corpo' }
    ]
  },
  { day: 'Domingo', short: 'DOM', icon: '<i class="fa-solid fa-spa"></i>', name: 'Descanso & Caminhada Leve', color: '#22d3a0', dur: '35 min', lvl: 'Baixa', rest: true, image: 'images/rest.png', exercises: [] }
];

let currentGender = loadGender();
let schedule = loadSched();
let done = loadDone();
let activeDay = getTodayIdx();
let currentScreen = 'treinos';

function loadGender() {
  return getStorageItem(STORAGE_KEYS.GK, userProfile?.gender || 'masculino');
}

function saveGender(g) {
  setStorageItem(STORAGE_KEYS.GK, g);
}

function loadSched() {
  const key = currentGender === 'feminino' ? STORAGE_KEYS.SK_FEM : STORAGE_KEYS.SK_MASC;
  const def = currentGender === 'feminino' ? DEFAULT_FEMININO : DEFAULT_MASCULINO;
  return getStorageItem(key, JSON.parse(JSON.stringify(def)));
}

function saveSched() {
  const key = currentGender === 'feminino' ? STORAGE_KEYS.SK_FEM : STORAGE_KEYS.SK_MASC;
  setStorageItem(key, schedule);
}

function loadDone() {
  const r = getStorageItem(STORAGE_KEYS.DK, []);
  return new Set(r);
}

function saveDone() {
  setStorageItem(STORAGE_KEYS.DK, [...done]);
}

function setGender(g) {
  if (currentGender === g) return;
  currentGender = g;
  saveGender(g);
  schedule = loadSched();
  render();
}

function getTodayIdx() {
  const map = [6, 0, 1, 2, 3, 4, 5];
  return map[new Date().getDay()];
}

function getGreeting() {
  const h = new Date().getHours();
  const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : '';
  const namePart = firstName ? `, ${firstName}` : '';
  if (h < 12) return `Bom dia${namePart}! <i class="fa-solid fa-sun"></i>`;
  if (h < 18) return `Boa tarde${namePart}! <i class="fa-solid fa-cloud-sun"></i>`;
  return `Boa noite${namePart}! <i class="fa-solid fa-moon"></i>`;
}

function render() {
  updateModalityButtons();
  renderDayScroll();
  renderWorkout();
  renderSummary();
  updateStats();
}

function updateModalityButtons() {
  const bMasc = document.getElementById('btn-mod-masc');
  const bFem = document.getElementById('btn-mod-fem');
  if (bMasc && bFem) {
    bMasc.classList.toggle('active', currentGender === 'masculino');
    bFem.classList.toggle('active', currentGender === 'feminino');
  }
}

function renderDayScroll() {
  const c = document.getElementById('day-scroll');
  if (!c) return;
  c.innerHTML = schedule.map((d, i) => `
    <div class="day-pill ${d.rest ? 'rest-pill' : ''} ${i === activeDay ? 'active' : ''}"
         onclick="selectDay(${i})" role="tab" tabindex="0">
      ${i === getTodayIdx() ? '<div class="day-today-dot"></div>' : ''}
      <span class="day-short-lbl">${d.short}</span>
      <span class="day-emoji">${d.icon}</span>
      <span class="day-full-lbl">${d.day}</span>
    </div>
  `).join('');
}

function renderWorkout() {
  const c = document.getElementById('workout-detail');
  if (!c) return;
  const d = schedule[activeDay];

  if (d.rest) {
    c.innerHTML = `
      <div class="rest-screen-panel animate-fade-in">
        <img src="${d.image || 'images/rest.png'}" alt="${d.name}" class="rest-banner-img" />
        <h2>${d.name}</h2>
        <p>Hoje é dia de descanso! Aproveite para recuperar os músculos, se hidratar e dormir bem. O crescimento acontece durante o repouso. <i class="fa-solid fa-heart" style="color:#22d3a0"></i></p>
      </div>`;
    return;
  }

  // Filter exercises by Search and Muscle Group Filter
  let filteredExercises = d.exercises;
  if (currentSearchQuery) {
    filteredExercises = filteredExercises.filter(e => e.name.toLowerCase().includes(currentSearchQuery) || e.muscle.toLowerCase().includes(currentSearchQuery));
  }
  if (currentMuscleFilter && currentMuscleFilter !== 'Todos') {
    filteredExercises = filteredExercises.filter(e => e.muscle.toLowerCase().includes(currentMuscleFilter.toLowerCase()));
  }

  const total = d.exercises.length;
  const doneEx = d.exercises.filter(e => done.has(e.id)).length;
  const pct = total ? Math.round((doneEx / total) * 100) : 0;

  c.innerHTML = `
    <!-- Workout Header Banner -->
    <div class="workout-card-header animate-scale-up">
      <div class="workout-card-banner-wrap">
        <img src="${d.image || 'images/chest.png'}" alt="${d.name}" class="workout-card-img" />
        <div class="workout-card-overlay"></div>
      </div>
      <div class="workout-card-top">
        <div class="workout-emoji-wrap" style="background:${d.color}18;">
          <span>${d.icon}</span>
        </div>
        <div>
          <div class="workout-title">${d.name}</div>
          <div class="workout-day-txt">${d.day} • ${d.exercises.length} exercícios</div>
        </div>
      </div>
      <div class="workout-chips">
        <div class="chip"><i class="fa-solid fa-clock"></i> ${d.dur}</div>
        <div class="chip"><i class="fa-solid fa-fire"></i> ${d.lvl}</div>
        <div class="chip"><i class="fa-solid fa-circle-check"></i> ${doneEx}/${total}</div>
        <button class="chip" style="background:rgba(255,255,255,0.1);color:#fff;border:none;cursor:pointer;" onclick="duplicateCurrentWorkoutDay()"><i class="fa-solid fa-clone"></i> Duplicar</button>
      </div>
    </div>

    <!-- Active Timer Banner -->
    <div class="active-timer-bar">
      <div class="timer-info">
        <div class="timer-icon-pulse"><i class="fa-solid fa-stopwatch"></i></div>
        <div>
          <div class="timer-clock" id="workout-clock">${isWorkoutActive ? formatTimeHMS(workoutSecondsElapsed) : '00:00'}</div>
          <div class="timer-label">${isWorkoutActive ? 'Treino Em Andamento' : 'Cronômetro Parado'}</div>
        </div>
      </div>
      <button class="btn-timer-act ${isWorkoutActive ? 'btn-timer-stop' : 'btn-timer-start'}" id="btn-toggle-workout-timer" onclick="toggleWorkoutTimer()">
        <i class="fa-solid ${isWorkoutActive ? 'fa-square' : 'fa-play'}"></i> ${isWorkoutActive ? 'Finalizar' : 'Iniciar'} Treino
      </button>
    </div>

    <!-- Rest Timer Widget -->
    <div class="rest-timer-box">
      <div class="rest-timer-title">
        <span><i class="fa-solid fa-hourglass-half"></i> Descanso Entre Séries</span>
        <span style="font-size:0.65rem;color:var(--txt2);">Vibra e Toca Som</span>
      </div>
      <div class="rest-buttons-row">
        <button class="btn-rest-preset" onclick="startRestTimer(30)">30s</button>
        <button class="btn-rest-preset" onclick="startRestTimer(45)">45s</button>
        <button class="btn-rest-preset" onclick="startRestTimer(60)">60s</button>
        <button class="btn-rest-preset" onclick="startRestTimer(90)">90s</button>
        <button class="btn-rest-preset" onclick="startRestTimer(120)">120s</button>
      </div>
      <div class="rest-countdown-display" id="rest-countdown-display">00:00</div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="search-filter-wrap">
      <div class="search-input-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" class="search-input" placeholder="Buscar exercício ou músculo..." value="${currentSearchQuery}" oninput="handleSearchInput(this.value)" />
      </div>
      <div class="muscle-filter-chips">
        ${['Todos', 'Peitoral', 'Costas', 'Bíceps', 'Tríceps', 'Ombros', 'Quadríceps', 'Posterior', 'Pernas', 'Core', 'Cardio'].map(m => `
          <button class="filter-chip ${currentMuscleFilter === m ? 'active' : ''}" data-muscle="${m}" onclick="setMuscleFilter('${m}')">${m}</button>
        `).join('')}
      </div>
    </div>

    <!-- Progress Track -->
    <div class="prog-wrap">
      <div class="prog-label">Progresso <span>${pct}%</span></div>
      <div class="prog-track"><div class="prog-fill" style="width:${pct}%"></div></div>
    </div>

    <!-- Exercises List -->
    <div class="section-label"><i class="fa-solid fa-list-check"></i> Exercícios (${filteredExercises.length})</div>
    <div class="ex-list-wrap">
      ${filteredExercises.length ? filteredExercises.map((ex, i) => renderExItem(ex, i)).join('') : `
        <div class="empty-state">
          <i class="fa-solid fa-dumbbell"></i>
          <h3>Nenhum exercício encontrado</h3>
          <p>Tente ajustar os filtros ou a busca acima.</p>
        </div>
      `}
    </div>
  `;
}

function renderExItem(ex, i) {
  const isDone = done.has(ex.id);
  const isFav = favoriteExIds.has(ex.id);
  return `
    <div class="ex-item ${isDone ? 'done' : ''}" id="ex-${ex.id}" onclick="toggleEx('${ex.id}')" role="checkbox" aria-checked="${isDone}" tabindex="0">
      <div class="ex-num-box">${isDone ? '<i class="fa-solid fa-check"></i>' : i + 1}</div>
      <div class="ex-body">
        <div class="ex-name">
          ${ex.name} 
          <span style="cursor:pointer;margin-left:4px;color:${isFav ? '#ffd166' : 'var(--txt3)'}" onclick="toggleFavoriteEx('${ex.id}', event)"><i class="fa-solid fa-star"></i></span>
        </div>
        <div class="ex-muscle">${ex.muscle} • ${ex.weight}</div>
      </div>
      <div class="ex-meta">
        <div class="ex-meta-pill">
          <span class="ex-meta-v">${ex.sets}</span>
          <span class="ex-meta-l">Séries</span>
        </div>
        <div class="ex-meta-pill">
          <span class="ex-meta-v" style="font-size:0.72rem;">${ex.reps}</span>
          <span class="ex-meta-l">Reps</span>
        </div>
      </div>
      <div style="display:flex;gap:4px;align-items:center;" onclick="event.stopPropagation()">
        <button style="background:none;border:none;color:var(--txt2);cursor:pointer;padding:6px;" onclick="openEditExModal('${ex.id}', event)"><i class="fa-solid fa-pen-to-square"></i></button>
        <button style="background:none;border:none;color:var(--red-pale);cursor:pointer;padding:6px;" onclick="deleteExercise('${ex.id}', event)"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
  `;
}

function selectDay(i) {
  activeDay = i;
  render();
  document.getElementById('day-scroll')?.children[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function toggleEx(id) {
  if (done.has(id)) {
    done.delete(id);
    toast('<i class="fa-solid fa-xmark"></i>', 'Desmarcado');
  } else {
    done.add(id);
    toast('<i class="fa-solid fa-circle-check"></i>', 'Exercício concluído!');
    confetti();
  }
  saveDone();
  renderWorkout();
  updateStats();
  renderSummary();
  if (typeof checkAchievements === 'function') checkAchievements();
}

function updateStats() {
  const todayEx = schedule[activeDay]?.exercises || [];
  const doneToday = todayEx.filter(e => done.has(e.id)).length;
  const totalEx = schedule.reduce((a, d) => a + d.exercises.length, 0);
  const pct = totalEx ? Math.round(([...done].length / totalEx) * 100) : 0;
  if (document.getElementById('s-sessions')) document.getElementById('s-sessions').textContent = schedule.filter(d => !d.rest).length;
  if (document.getElementById('s-total')) document.getElementById('s-total').textContent = totalEx;
  if (document.getElementById('s-today')) document.getElementById('s-today').textContent = doneToday;
  if (document.getElementById('s-pct')) document.getElementById('s-pct').textContent = pct + '%';
}

function switchScreen(name) {
  currentScreen = name;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  
  const screenEl = document.getElementById('screen-' + name);
  const navEl = document.getElementById('nav-' + name);
  if (screenEl) screenEl.classList.add('active');
  if (navEl) navEl.classList.add('active');

  const titles = {
    treinos: 'Fit<span>Saúde</span>',
    planilhas: 'Planilhas <span>Treinos</span>',
    resumo: 'Resumo <span>Semanal</span>',
    chat: 'FitBot <span>IA</span>',
    perfil: 'Perfil <span>Usuário</span>'
  };
  const icons = {
    treinos: '<img src="images/logo.png" alt="FitSaúde" class="app-header-logo-img" />',
    planilhas: '<i class="fa-solid fa-table-list"></i>',
    resumo: '<i class="fa-solid fa-chart-pie"></i>',
    chat: '<i class="fa-solid fa-robot"></i>',
    perfil: '<i class="fa-solid fa-user"></i>'
  };

  if (document.getElementById('header-title')) document.getElementById('header-title').innerHTML = titles[name] || 'Fit<span>Saúde</span>';
  if (document.getElementById('header-icon')) document.getElementById('header-icon').innerHTML = icons[name] || '<img src="images/logo.png" alt="FitSaúde" class="app-header-logo-img" />';
  if (document.getElementById('header-action-btn')) document.getElementById('header-action-btn').style.display = name === 'treinos' ? '' : 'none';

  if (name === 'planilhas' && typeof renderPlanilhas === 'function') {
    renderPlanilhas();
  } else if (name === 'resumo' && typeof renderSummary === 'function') {
    renderSummary();
  } else if (name === 'chat') {
    document.getElementById('chat-badge')?.classList.remove('show');
    setTimeout(() => scrollChat(), 100);
  } else if (name === 'perfil' && typeof renderProfileForm === 'function') {
    renderProfileForm();
  }
}

/* Modals Management */
function syncEditDayFields(dayIdx) {
  const d = schedule[dayIdx];
  if (!d) return;
  const fDayName = document.getElementById('f-day-name');
  const fDayDur = document.getElementById('f-day-dur');
  const fDayLvl = document.getElementById('f-day-lvl');
  if (fDayName) fDayName.value = d.name || '';
  if (fDayDur) fDayDur.value = d.dur || '60 min';
  if (fDayLvl) fDayLvl.value = d.lvl || 'Média';
}

function toggleEditDaySection() {
  const panel = document.getElementById('edit-day-panel');
  const btnText = document.getElementById('btn-edit-day-text');
  if (!panel) return;
  const isHidden = panel.style.display === 'none' || !panel.style.display;
  panel.style.display = isHidden ? 'block' : 'none';
  if (btnText) btnText.textContent = isHidden ? 'Ocultar Edição' : 'Editar Dia';
  if (isHidden) {
    const dayIdx = parseInt(document.getElementById('f-day').value) || activeDay;
    syncEditDayFields(dayIdx);
    setTimeout(() => document.getElementById('f-day-name')?.focus(), 200);
  }
}

function handleDaySelectChange() {
  const dayIdx = parseInt(document.getElementById('f-day').value);
  syncEditDayFields(dayIdx);
}

function saveWorkoutDayDetails(notify = true) {
  const dayIdx = parseInt(document.getElementById('f-day').value);
  if (isNaN(dayIdx) || !schedule[dayIdx]) return false;
  const newName = document.getElementById('f-day-name')?.value.trim();
  const newDur = document.getElementById('f-day-dur')?.value.trim();
  const newLvl = document.getElementById('f-day-lvl')?.value;

  if (!newName) {
    if (document.getElementById('f-day-name')) document.getElementById('f-day-name').style.borderColor = '#dc143c';
    return false;
  }
  if (document.getElementById('f-day-name')) document.getElementById('f-day-name').style.borderColor = '';

  schedule[dayIdx].name = newName;
  if (newDur) schedule[dayIdx].dur = newDur;
  if (newLvl) schedule[dayIdx].lvl = newLvl;

  saveSched();
  render();

  const sel = document.getElementById('f-day');
  if (sel) {
    const currentVal = sel.value;
    sel.innerHTML = schedule.filter(d => !d.rest).map(d => {
      const i = schedule.indexOf(d);
      return `<option value="${i}" ${i == currentVal ? 'selected' : ''}>${d.day} – ${d.name}</option>`;
    }).join('');
  }

  if (notify) {
    toast('<i class="fa-solid fa-check"></i>', `Dia "${schedule[dayIdx].day}" atualizado!`);
  }
  return true;
}

/* ── Sugestões de Exercícios por Objetivo do Aluno ── */
const GOAL_EXERCISES_DATABASE = {
  'Hipertrofia': [
    { name: 'Supino Reto com Barra', muscle: 'Peitoral', sets: 4, reps: '8-10', weight: '60 kg' },
    { name: 'Supino Inclinado com Halteres', muscle: 'Peitoral', sets: 3, reps: '10-12', weight: '22 kg' },
    { name: 'Crucifixo na Polia', muscle: 'Peitoral', sets: 3, reps: '12-15', weight: '15 kg' },
    { name: 'Agachamento Livre', muscle: 'Quadríceps', sets: 4, reps: '8-10', weight: '70 kg' },
    { name: 'Leg Press 45°', muscle: 'Pernas', sets: 4, reps: '10-12', weight: '160 kg' },
    { name: 'Cadeira Extensora', muscle: 'Quadríceps', sets: 3, reps: '12-15', weight: '45 kg' },
    { name: 'Puxada Aberta no Pulley', muscle: 'Costas', sets: 4, reps: '10-12', weight: '55 kg' },
    { name: 'Remada Curvada com Barra', muscle: 'Costas', sets: 4, reps: '8-10', weight: '50 kg' },
    { name: 'Desenvolvimento com Halteres', muscle: 'Ombros', sets: 4, reps: '10-12', weight: '18 kg' },
    { name: 'Elevação Lateral na Polia', muscle: 'Ombros', sets: 4, reps: '12-15', weight: '10 kg' },
    { name: 'Rosca Direta Barra W', muscle: 'Bíceps', sets: 3, reps: '10-12', weight: '20 kg' },
    { name: 'Tríceps Corda', muscle: 'Tríceps', sets: 4, reps: '12', weight: '25 kg' }
  ],
  'Perda de Gordura': [
    { name: 'Burpee com Salto', muscle: 'Cardio / Full Body', sets: 4, reps: '15-20', weight: 'Peso do corpo' },
    { name: 'Kettlebell Swing', muscle: 'Posterior / Glúteos', sets: 4, reps: '20', weight: '16 kg' },
    { name: 'Jump Squats (Salto)', muscle: 'Pernas / Cardio', sets: 4, reps: '15-20', weight: 'Peso do corpo' },
    { name: 'Mountain Climbers', muscle: 'Core / Cardio', sets: 4, reps: '40 seg', weight: 'Peso do corpo' },
    { name: 'Corda Naval (Battle Rope)', muscle: 'Membros Superiores', sets: 4, reps: '30 seg', weight: 'Moderada' },
    { name: 'Agachamento Goblet Dinâmico', muscle: 'Pernas', sets: 4, reps: '15-20', weight: '14 kg' },
    { name: 'Remada Baixa no Cabo', muscle: 'Costas', sets: 4, reps: '15', weight: '35 kg' },
    { name: 'Thruster com Halteres', muscle: 'Full Body', sets: 4, reps: '12-15', weight: '10 kg' },
    { name: 'Prancha Dinâmica com Toque', muscle: 'Abdômen', sets: 4, reps: '20', weight: 'Peso do corpo' },
    { name: 'Passada com Halteres', muscle: 'Glúteos / Pernas', sets: 4, reps: '15 cada', weight: '8 kg' }
  ],
  'Definição': [
    { name: 'Crossover Alto na Polia', muscle: 'Peitoral', sets: 4, reps: '12-15', weight: '15 kg' },
    { name: 'Cadeira Extensora Drop-Set', muscle: 'Quadríceps', sets: 4, reps: '12+10', weight: '40 kg' },
    { name: 'Cadeira Flexora Drop-Set', muscle: 'Posterior', sets: 4, reps: '12+10', weight: '35 kg' },
    { name: 'Puxada com Triângulo', muscle: 'Costas', sets: 4, reps: '12-15', weight: '50 kg' },
    { name: 'Remada Cavalinho', muscle: 'Costas', sets: 3, reps: '12-15', weight: '35 kg' },
    { name: 'Elevação Lateral Drop-Set', muscle: 'Ombros', sets: 4, reps: '12+10', weight: '8 kg' },
    { name: 'Tríceps Testa com Halteres', muscle: 'Tríceps', sets: 4, reps: '12-15', weight: '10 kg' },
    { name: 'Rosca Martelo na Polia', muscle: 'Bíceps / Antebraço', sets: 4, reps: '12-15', weight: '18 kg' },
    { name: 'Elevação de Pernas na Barra', muscle: 'Abdômen Infra', sets: 4, reps: '15-20', weight: 'Peso do corpo' },
    { name: 'Afundo Búlgaro com Halteres', muscle: 'Glúteos / Quadríceps', sets: 3, reps: '12 cada', weight: '12 kg' }
  ],
  'Força': [
    { name: 'Levantamento Terra Convencional', muscle: 'Costas / Posteriores', sets: 5, reps: '4-6', weight: '100 kg' },
    { name: 'Agachamento Livre com Barra', muscle: 'Quadríceps / Glúteos', sets: 5, reps: '5', weight: '90 kg' },
    { name: 'Supino Reto Pesado com Barra', muscle: 'Peitoral', sets: 5, reps: '5', weight: '80 kg' },
    { name: 'Desenvolvimento Militar em Pé', muscle: 'Ombros', sets: 5, reps: '5-6', weight: '40 kg' },
    { name: 'Remada Curvada com Barra', muscle: 'Costas', sets: 5, reps: '5', weight: '65 kg' },
    { name: 'Paralelas com Sobrecarga', muscle: 'Peitoral / Tríceps', sets: 4, reps: '6', weight: '+10 kg' },
    { name: 'Barra Fixa com Carga', muscle: 'Costas / Bíceps', sets: 4, reps: '5-6', weight: '+5 kg' },
    { name: 'Supino Fechado com Barra', muscle: 'Tríceps / Peitoral', sets: 4, reps: '6', weight: '55 kg' }
  ],
  'Saúde & Condicionamento': [
    { name: 'Caminhada Inclinada na Esteira', muscle: 'Cardiovascular', sets: 1, reps: '20 min', weight: 'Inclinação 6' },
    { name: 'Agachamento Goblet', muscle: 'Pernas / Core', sets: 3, reps: '12-15', weight: '12 kg' },
    { name: 'Flexão de Braço no Solo', muscle: 'Peitoral / Core', sets: 3, reps: '10-12', weight: 'Peso do corpo' },
    { name: 'Remada Sentada no Cabo', muscle: 'Costas', sets: 3, reps: '12-15', weight: '30 kg' },
    { name: 'Elevação Lateral Leve', muscle: 'Ombros', sets: 3, reps: '15', weight: '5 kg' },
    { name: 'Prancha Isométrica', muscle: 'Core / Lombar', sets: 3, reps: '45 seg', weight: 'Isometria' },
    { name: 'Ponte para Glúteos', muscle: 'Glúteos / Lombar', sets: 3, reps: '15', weight: 'Peso do corpo' },
    { name: 'Bicicleta Ergométrica', muscle: 'Cardio', sets: 1, reps: '15 min', weight: 'Nível 5' }
  ]
};

/* ── FitBot IA: Insights e Sugestões por Objetivo ── */
const FITBOT_GOAL_INSIGHTS = {
  'Hipertrofia': {
    badge: '🏋️‍♂️ Hipertrofia & Volume',
    tip: 'Foco em 8 a 12 repetições com cadência controlada (2s excêntrica) e sobrecarga progressiva para ganho de massa magra.',
    highlight: '#3b82f6'
  },
  'Perda de Gordura': {
    badge: '🔥 Queima de Gordura & HIIT',
    tip: 'Foco em alta densidade, 15 a 20 repetições com descansos curtos (30–45s) e estímulo aeróbico integrado para queima calórica acelerada.',
    highlight: '#f97316'
  },
  'Definição': {
    badge: '⚡ Definição & Densidade Muscular',
    tip: 'Foco em 12 a 15 repetições, técnicas de Drop-Set e pico de contração para lapidação estética e definição profunda.',
    highlight: '#a855f7'
  },
  'Força': {
    badge: '💪 Força Bruta & Cargas Altas',
    tip: 'Foco em 4 a 6 repetições em movimentos compostos básicos, descanso de 2 a 3 minutos para recrutamento neural máximo.',
    highlight: '#ef4444'
  },
  'Saúde & Condicionamento': {
    badge: '🏃 Saúde, Funcional & Mobilidade',
    tip: 'Foco em fortalecimento articular, estabilidade do core, postura e melhora do VO2 máx cardiovascular.',
    highlight: '#22c55e'
  }
};

function renderGoalExerciseSuggestions() {
  const select = document.getElementById('f-goal-filter');
  const container = document.getElementById('goal-exercises-chips');
  const tipBox = document.getElementById('fitbot-goal-tip');
  if (!container) return;

  const goal = select ? select.value : 'Hipertrofia';
  const list = GOAL_EXERCISES_DATABASE[goal] || GOAL_EXERCISES_DATABASE['Hipertrofia'];
  const insight = FITBOT_GOAL_INSIGHTS[goal] || FITBOT_GOAL_INSIGHTS['Hipertrofia'];

  if (tipBox) {
    tipBox.style.borderLeftColor = insight.highlight;
    tipBox.innerHTML = `<strong style="color:${insight.highlight};"><i class="fa-solid fa-robot"></i> FitBot IA:</strong> ${insight.tip}`;
  }

  container.innerHTML = list.map((item, idx) => `
    <button type="button" onclick="selectSuggestedExercise('${goal}', ${idx})" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #f4f4f5; font-size: 11px; padding: 5px 9px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s ease; text-align: left; white-space: nowrap;">
      <span style="color: #dc143c; font-weight: 700;">+</span>
      <strong>${item.name}</strong>
      <span style="color: #a1a1aa; font-size: 10px;">(${item.sets}x ${item.reps})</span>
    </button>
  `).join('');
}

function pickRandomFitBotExercise() {
  const select = document.getElementById('f-goal-filter');
  const goal = select ? select.value : 'Hipertrofia';
  const list = GOAL_EXERCISES_DATABASE[goal] || GOAL_EXERCISES_DATABASE['Hipertrofia'];
  if (!list.length) return;
  const randIdx = Math.floor(Math.random() * list.length);
  selectSuggestedExercise(goal, randIdx);
  toast('<i class="fa-solid fa-robot" style="color:#22d3a0"></i>', `FitBot IA selecionou: ${list[randIdx].name}!`);
}

function selectSuggestedExercise(goal, idx) {
  const item = (GOAL_EXERCISES_DATABASE[goal] || [])[idx];
  if (!item) return;

  const fName = document.getElementById('f-name');
  const fMuscle = document.getElementById('f-muscle');
  const fSets = document.getElementById('f-sets');
  const fReps = document.getElementById('f-reps');
  const fWeight = document.getElementById('f-weight');

  if (fName) fName.value = item.name;
  if (fMuscle) fMuscle.value = item.muscle;
  if (fSets) fSets.value = item.sets;
  if (fReps) fReps.value = item.reps;
  if (fWeight) fWeight.value = item.weight;

  toast('<i class="fa-solid fa-wand-magic-sparkles" style="color:#ffd166"></i>', `Exercício "${item.name}" inserido!`);
}

function openAddModal() {
  const sel = document.getElementById('f-day');
  if (!sel) return;
  sel.innerHTML = schedule.filter(d => !d.rest).map(d => {
    const i = schedule.indexOf(d);
    return `<option value="${i}" ${i === activeDay ? 'selected' : ''}>${d.day} – ${d.name}</option>`;
  }).join('');

  const targetDay = isNaN(parseInt(sel.value)) ? activeDay : parseInt(sel.value);
  syncEditDayFields(targetDay);

  const p = (typeof loadProfileData === 'function' ? loadProfileData() : null) || JSON.parse(localStorage.getItem('fitsaude_profile_v2') || '{}');
  const currentUser = JSON.parse(localStorage.getItem('fitsaude_current_user_v2') || '{}');
  const detectedGoal = p.goal || currentUser.goal || 'Hipertrofia';

  const goalFilter = document.getElementById('f-goal-filter');
  if (goalFilter) {
    goalFilter.value = detectedGoal;
  }
  renderGoalExerciseSuggestions();

  const panel = document.getElementById('edit-day-panel');
  if (panel) panel.style.display = 'none';
  const btnText = document.getElementById('btn-edit-day-text');
  if (btnText) btnText.textContent = 'Editar Dia';

  document.getElementById('modal-overlay')?.classList.add('show');
  setTimeout(() => document.getElementById('f-name')?.focus(), 400);
}

function closeModal() {
  document.getElementById('modal-overlay')?.classList.remove('show');
  ['f-name', 'f-muscle', 'f-weight'].forEach(id => {
    if (document.getElementById(id)) document.getElementById(id).value = '';
  });
  if (document.getElementById('f-sets')) document.getElementById('f-sets').value = 3;
  if (document.getElementById('f-reps')) document.getElementById('f-reps').value = 12;
  const panel = document.getElementById('edit-day-panel');
  if (panel) panel.style.display = 'none';
  const btnText = document.getElementById('btn-edit-day-text');
  if (btnText) btnText.textContent = 'Editar Dia';
}

function saveExercise() {
  const dayIdx = parseInt(document.getElementById('f-day').value);
  const name = document.getElementById('f-name').value.trim();
  const muscle = document.getElementById('f-muscle').value.trim() || 'Geral';
  const sets = parseInt(document.getElementById('f-sets').value) || 3;
  const reps = document.getElementById('f-reps').value.trim() || '12';
  const weight = document.getElementById('f-weight').value.trim() || '—';

  const panel = document.getElementById('edit-day-panel');
  if (panel && panel.style.display !== 'none') {
    saveWorkoutDayDetails(false);
  }

  if (!name) {
    document.getElementById('f-name').style.borderColor = '#dc143c';
    return;
  }
  document.getElementById('f-name').style.borderColor = '';

  schedule[dayIdx].exercises.push({ id: 'c' + Date.now(), name, muscle, sets, reps, weight });
  saveSched();
  activeDay = dayIdx;
  closeModal();
  render();
  toast('<i class="fa-solid fa-plus"></i>', `"${name}" adicionado!`);
}

/* App Initialization */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('day-greeting')) document.getElementById('day-greeting').innerHTML = getGreeting();
  render();

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('Service Worker registrado:', reg))
        .catch(err => console.warn('Erro ao registrar Service Worker:', err));
    });
  }
});
