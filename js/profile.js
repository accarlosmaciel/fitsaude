/* ─── FITSAÚDE PROFILE & HEALTH MODULE ────────────────────────── */

const PROFILE_STORAGE_KEY = 'fitsaude_profile_v1';
const DEFAULT_PROFILE_FALLBACK = {
  name: 'Aluno FitSaúde',
  age: 25,
  gender: 'masculino',
  height: 175,
  weight: 75,
  goal: 'Hipertrofia',
  level: 'Intermediário'
};

let userProfile = DEFAULT_PROFILE_FALLBACK;

function loadProfileData() {
  try {
    if (typeof getStorageItem === 'function' && typeof STORAGE_KEYS !== 'undefined') {
      userProfile = getStorageItem(STORAGE_KEYS.PK, DEFAULT_PROFILE_FALLBACK);
      return userProfile;
    }
    const r = localStorage.getItem(PROFILE_STORAGE_KEY);
    userProfile = r ? { ...DEFAULT_PROFILE_FALLBACK, ...JSON.parse(r) } : { ...DEFAULT_PROFILE_FALLBACK };
    return userProfile;
  } catch {
    return { ...DEFAULT_PROFILE_FALLBACK };
  }
}

function saveProfileData(p) {
  userProfile = p;
  if (typeof setStorageItem === 'function' && typeof STORAGE_KEYS !== 'undefined') {
    setStorageItem(STORAGE_KEYS.PK, userProfile);
  } else {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
  }
}

/* ── Calculations ── */
function calcIMC(weight, heightCm) {
  if (!weight || !heightCm) return { imc: '—', label: 'Indefinido', badgeClass: 'badge-imc-normal' };
  const hM = heightCm / 100;
  const imcNum = weight / (hM * hM);
  const imc = imcNum.toFixed(1);
  let label = 'Peso Saudável';
  let badgeClass = 'badge-imc-normal';

  if (imcNum < 18.5) {
    label = 'Abaixo do Peso';
    badgeClass = 'badge-imc-warn';
  } else if (imcNum < 26.0) {
    label = 'Peso Saudável';
    badgeClass = 'badge-imc-normal';
  } else if (imcNum < 30.0) {
    label = 'Sobrepeso';
    badgeClass = 'badge-imc-warn';
  } else {
    label = 'Obesidade';
    badgeClass = 'badge-imc-alert';
  }
  return { imc, label, badgeClass };
}

/* TMB Formula (Mifflin-St Jeor) */
function calcTMB(weight, heightCm, age, gender) {
  if (!weight || !heightCm || !age) return 0;
  if (gender === 'feminino') {
    return Math.round(10 * weight + 6.25 * heightCm - 5 * age - 161);
  }
  // Masculino / Outro default
  return Math.round(10 * weight + 6.25 * heightCm - 5 * age + 5);
}

/* Daily Water Requirement (35ml / kg) */
function calcWater(weight) {
  if (!weight) return '—';
  const totalMl = Math.round(weight * 35);
  const liters = (totalMl / 1000).toFixed(1);
  return `${liters} L (${totalMl} ml)`;
}

/* Daily Protein Target (1.8g to 2.2g / kg) */
function calcProteinTarget(weight, goal) {
  if (!weight) return { min: 0, max: 0, label: '—' };
  let minMult = 1.8;
  let maxMult = 2.2;
  if (goal === 'Hipertrofia' || goal === 'Força') { minMult = 2.0; maxMult = 2.2; }
  else if (goal === 'Perda de Gordura') { minMult = 2.2; maxMult = 2.4; }
  else if (goal === 'Saúde & Condicionamento') { minMult = 1.6; maxMult = 1.8; }
  
  const minG = Math.round(weight * minMult);
  const maxG = Math.round(weight * maxMult);
  return { min: minG, max: maxG, label: `${minG}g - ${maxG}g` };
}

/* Calorie Target Estimation (TDEE based on Goal) */
function calcCalorieTarget(tmb, goal) {
  if (!tmb) return '—';
  const tdeeBase = tmb * 1.4; // Moderately active multiplier
  let target = tdeeBase;
  if (goal === 'Hipertrofia' || goal === 'Força') target += 350;
  else if (goal === 'Perda de Gordura') target -= 400;
  else if (goal === 'Definição') target -= 200;
  return `${Math.round(target)} kcal/dia`;
}

/* Render & Form UI */
function renderProfileForm() {
  const p = loadProfileData();
  const fName = document.getElementById('pf-name');
  if (!fName) return;

  fName.value = p.name || '';
  document.getElementById('pf-age').value = p.age || '';
  document.getElementById('pf-gender').value = p.gender || 'masculino';
  document.getElementById('pf-height').value = p.height || '';
  document.getElementById('pf-weight').value = p.weight || '';
  document.getElementById('pf-goal').value = p.goal || 'Hipertrofia';
  document.getElementById('pf-level').value = p.level || 'Intermediário';
  updateProfilePreview();
}

function updateProfilePreview() {
  const name = document.getElementById('pf-name')?.value.trim() || 'Aluno FitSaúde';
  const age = parseInt(document.getElementById('pf-age')?.value) || 25;
  const gender = document.getElementById('pf-gender')?.value || 'masculino';
  const height = parseFloat(document.getElementById('pf-height')?.value) || 0;
  const weight = parseFloat(document.getElementById('pf-weight')?.value) || 0;
  const goal = document.getElementById('pf-goal')?.value || 'Hipertrofia';
  const level = document.getElementById('pf-level')?.value || 'Intermediário';

  if (document.getElementById('p-display-name')) document.getElementById('p-display-name').textContent = name;
  if (document.getElementById('p-display-goal')) document.getElementById('p-display-goal').innerHTML = `<i class="fa-solid fa-bullseye"></i> ${goal}`;
  if (document.getElementById('p-display-level')) document.getElementById('p-display-level').textContent = level;

  // IMC
  const imcData = calcIMC(weight, height);
  if (document.getElementById('p-imc-val')) document.getElementById('p-imc-val').textContent = imcData.imc;
  const imcBadge = document.getElementById('p-imc-badge');
  if (imcBadge) {
    imcBadge.textContent = imcData.label;
    imcBadge.className = `profile-stat-badge ${imcData.badgeClass}`;
  }

  // Protein Target
  const prot = calcProteinTarget(weight, goal);
  if (document.getElementById('p-protein-val')) document.getElementById('p-protein-val').textContent = prot.label;

  // TMB & Calories
  const tmb = calcTMB(weight, height, age, gender);
  if (document.getElementById('p-tmb-val')) document.getElementById('p-tmb-val').textContent = tmb ? `${tmb} kcal` : '—';
  
  const cals = calcCalorieTarget(tmb, goal);
  if (document.getElementById('p-cal-val')) document.getElementById('p-cal-val').textContent = cals;

  // Water Target
  const water = calcWater(weight);
  if (document.getElementById('p-water-val')) document.getElementById('p-water-val').textContent = water;
}

function saveProfile() {
  const name = document.getElementById('pf-name')?.value.trim() || 'Aluno';
  const age = parseInt(document.getElementById('pf-age')?.value) || 25;
  const gender = document.getElementById('pf-gender')?.value || 'masculino';
  const height = parseFloat(document.getElementById('pf-height')?.value) || 175;
  const weight = parseFloat(document.getElementById('pf-weight')?.value) || 75;
  const goal = document.getElementById('pf-goal')?.value || 'Hipertrofia';
  const level = document.getElementById('pf-level')?.value || 'Intermediário';

  saveProfileData({ name, age, gender, height, weight, goal, level });

  if (typeof syncProfileToSupabase === 'function') {
    syncProfileToSupabase({ name, age, gender, height, weight, goal, level });
  }

  if (typeof setGender === 'function' && (gender === 'masculino' || gender === 'feminino')) {
    setGender(gender);
  }

  const dayGreeting = document.getElementById('day-greeting');
  if (dayGreeting && typeof getGreeting === 'function') dayGreeting.innerHTML = getGreeting();

  toast('<i class="fa-solid fa-user-check"></i>', 'Perfil atualizado!', 1000);
  confetti();
}

/* ── Theme, Color & Customization ── */
function applySettings() {
  const theme = localStorage.getItem('fitsaude_theme') || 'dark';
  const color = localStorage.getItem('fitsaude_color') || 'red';
  const fontSize = localStorage.getItem('fitsaude_fontsize') || 'normal';
  const highContrast = localStorage.getItem('fitsaude_contrast') === 'true';

  document.body.classList.remove('theme-light');
  if (theme === 'light') {
    document.body.classList.add('theme-light');
  } else if (theme === 'auto') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.body.classList.add('theme-light');
    }
  }

  if (color === 'red') {
    document.body.removeAttribute('data-color');
  } else {
    document.body.setAttribute('data-color', color);
  }

  if (fontSize === 'small') document.documentElement.style.fontSize = '14px';
  else if (fontSize === 'large') document.documentElement.style.fontSize = '18px';
  else document.documentElement.style.fontSize = '16px';

  document.body.classList.toggle('high-contrast', highContrast);
}

function setTheme(t) {
  localStorage.setItem('fitsaude_theme', t);
  applySettings();
  toast('<i class="fa-solid fa-palette"></i>', `Tema alterado (${t})!`);
}

function setColor(c) {
  localStorage.setItem('fitsaude_color', c);
  applySettings();
  toast('<i class="fa-solid fa-droplet"></i>', 'Cor do app alterada!');
}

function setFontSize(sz) {
  localStorage.setItem('fitsaude_fontsize', sz);
  applySettings();
  toast('<i class="fa-solid fa-text-height"></i>', 'Tamanho da fonte alterado!');
}

function toggleHighContrast() {
  const cur = localStorage.getItem('fitsaude_contrast') === 'true';
  localStorage.setItem('fitsaude_contrast', !cur);
  applySettings();
  toast('<i class="fa-solid fa-eye"></i>', !cur ? 'Alto contraste ativado!' : 'Alto contraste desativado!');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applySettings);
} else {
  applySettings();
}

/* ── Meta de Hidratação 💧 ── */
const HK_GOAL = 'fitsaude_water_goal_v1';
const HK_INTAKE = 'fitsaude_water_intake_v1';
const HK_DATE = 'fitsaude_water_date_v1';
const HK_REMINDER = 'fitsaude_water_reminder_v1';
const HK_FREQ = 'fitsaude_water_freq_v1';

let waterGoalMl = 3000;
let waterIntakeMl = 0;
let waterReminderActive = false;
let waterReminderFreqHours = 2;
let waterReminderTimer = null;
let waterGoalCelebratedToday = false;

function initHydration() {
  const savedGoal = localStorage.getItem(HK_GOAL);
  if (savedGoal) waterGoalMl = parseInt(savedGoal);

  const savedDate = localStorage.getItem(HK_DATE);
  const todayStr = new Date().toDateString();

  if (savedDate === todayStr) {
    const savedIntake = localStorage.getItem(HK_INTAKE);
    if (savedIntake) waterIntakeMl = parseInt(savedIntake);
  } else {
    waterIntakeMl = 0;
    localStorage.setItem(HK_DATE, todayStr);
    localStorage.setItem(HK_INTAKE, '0');
  }

  waterReminderActive = localStorage.getItem(HK_REMINDER) === 'true';
  waterReminderFreqHours = parseInt(localStorage.getItem(HK_FREQ)) || 2;

  updateHydrationUI();
  if (waterReminderActive) startWaterReminderTimer();
}

function setWaterGoal(ml) {
  waterGoalMl = ml;
  localStorage.setItem(HK_GOAL, String(ml));
  updateHydrationUI();
  toast('<i class="fa-solid fa-droplet" style="color:#38bdf8;"></i>', `Meta de água alterada para ${(ml/1000).toFixed(1)} L!`);
}

function addWaterIntake(ml) {
  waterIntakeMl += ml;
  const todayStr = new Date().toDateString();
  localStorage.setItem(HK_DATE, todayStr);
  localStorage.setItem(HK_INTAKE, String(waterIntakeMl));

  updateHydrationUI();

  if (waterIntakeMl >= waterGoalMl && !waterGoalCelebratedToday) {
    waterGoalCelebratedToday = true;
    toast('<i class="fa-solid fa-trophy"></i>', 'Parabéns! Você atingiu sua meta de água hoje! 💧🎉', 2500);
    if (typeof confetti === 'function') confetti();
  } else {
    toast('<i class="fa-solid fa-glass-water" style="color:#38bdf8;"></i>', `+${ml >= 1000 ? (ml/1000)+'L' : ml+'ml'} de água registrado!`);
  }
}

function resetWaterIntake() {
  if (waterIntakeMl > 0 && !confirm('Deseja resetar o consumo de água de hoje?')) return;
  waterIntakeMl = 0;
  waterGoalCelebratedToday = false;
  const todayStr = new Date().toDateString();
  localStorage.setItem(HK_DATE, todayStr);
  localStorage.setItem(HK_INTAKE, '0');
  updateHydrationUI();
  toast('<i class="fa-solid fa-rotate-right"></i>', 'Consumo de água resetado.');
}

function updateWaterReminderFreq(val) {
  waterReminderFreqHours = parseInt(val) || 2;
  localStorage.setItem(HK_FREQ, String(waterReminderFreqHours));
  if (waterReminderActive) {
    startWaterReminderTimer();
    toast('<i class="fa-solid fa-bell"></i>', `Lembretes ajustados para cada ${waterReminderFreqHours}h`);
  }
}

function toggleWaterReminders() {
  waterReminderActive = !waterReminderActive;
  localStorage.setItem(HK_REMINDER, String(waterReminderActive));

  if (waterReminderActive) {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    startWaterReminderTimer();
    toast('<i class="fa-solid fa-bell"></i>', `Lembretes de água ativados (a cada ${waterReminderFreqHours}h)!`);
  } else {
    stopWaterReminderTimer();
    toast('<i class="fa-solid fa-bell-slash"></i>', 'Lembretes de água desativados.');
  }
  updateHydrationUI();
}

function startWaterReminderTimer() {
  stopWaterReminderTimer();
  const ms = waterReminderFreqHours * 3600 * 1000;
  waterReminderTimer = setInterval(() => {
    if (waterIntakeMl < waterGoalMl) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('FitSaúde 💧 Hora de Beber Água!', {
          body: `Você consumiu ${(waterIntakeMl/1000).toFixed(1)}L de ${(waterGoalMl/1000).toFixed(1)}L hoje. Beba um copo de água!`,
          icon: 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png'
        });
      }
      toast('<i class="fa-solid fa-droplet" style="color:#38bdf8;"></i>', '💧 Lembrete: Hora de beber água para bater sua meta!');
    }
  }, ms);
}

function stopWaterReminderTimer() {
  if (waterReminderTimer) clearInterval(waterReminderTimer);
  waterReminderTimer = null;
}

function updateHydrationUI() {
  const intakeValEl = document.getElementById('water-intake-val');
  const targetSubEl = document.getElementById('water-target-sub');
  const pctValEl = document.getElementById('water-pct-val');
  const fillEl = document.getElementById('water-progress-fill');
  const badgeEl = document.getElementById('hydration-badge');
  const btnReminderEl = document.getElementById('btn-toggle-reminder');
  const freqSelectEl = document.getElementById('water-reminder-freq');
  const tipEl = document.getElementById('water-status-tip');

  if (!intakeValEl) return;

  const intakeL = (waterIntakeMl / 1000).toFixed(1);
  const goalL = (waterGoalMl / 1000).toFixed(1);
  const pct = Math.min(100, Math.round((waterIntakeMl / waterGoalMl) * 100));

  intakeValEl.textContent = `${intakeL} L`;
  targetSubEl.textContent = `/ ${goalL} L hoje`;
  pctValEl.textContent = `${pct}%`;
  if (fillEl) fillEl.style.width = `${pct}%`;

  if (tipEl) {
    if (waterIntakeMl >= waterGoalMl) {
      tipEl.innerHTML = '<i class="fa-solid fa-trophy" style="color:#22d3a0;"></i> <strong>Parabéns!</strong> Você bateu sua meta diária de hidratação hoje! 🎉';
      tipEl.style.color = '#22d3a0';
    } else {
      const remainingL = Math.max(0, (waterGoalMl - waterIntakeMl) / 1000).toFixed(1);
      tipEl.innerHTML = `<i class="fa-solid fa-droplet" style="color:var(--red-light);"></i> Faltam <strong>${remainingL} L</strong> para bater sua meta diária!`;
      tipEl.style.color = 'var(--txt2)';
    }
  }

  document.querySelectorAll('.water-chip').forEach(chip => {
    const goalLiters = parseInt(chip.getAttribute('data-l'));
    chip.classList.toggle('active', goalLiters === Math.round(waterGoalMl / 1000));
  });

  if (badgeEl) {
    if (waterIntakeMl >= waterGoalMl) {
      badgeEl.textContent = 'Meta Concluída! 💧🎉';
      badgeEl.className = 'hydration-badge goal-reached';
    } else {
      badgeEl.textContent = `Meta: ${goalL} L`;
      badgeEl.className = 'hydration-badge';
    }
  }

  if (btnReminderEl) {
    if (waterReminderActive) {
      btnReminderEl.innerHTML = '<i class="fa-solid fa-bell"></i> Ativo';
      btnReminderEl.className = 'btn-toggle-reminder active';
    } else {
      btnReminderEl.innerHTML = '<i class="fa-solid fa-bell-slash"></i> Ativar';
      btnReminderEl.className = 'btn-toggle-reminder';
    }
  }

  if (freqSelectEl) freqSelectEl.value = String(waterReminderFreqHours);
}

/* ══════════════════════════════════════════════════════════════
 * FITBOT IA: PLANO ALIMENTAR & DIETA INTELIGENTE
 * ══════════════════════════════════════════════════════════════ */
const DIET_PLANS_DATABASE = {
  'Hipertrofia': {
    badge: '🏋️‍♂️ Hipertrofia & Ganho de Massa',
    color: '#3b82f6',
    fitbotTip: 'Superávit calórico controlado (+350 a +500 kcal). Alta ingestão proteica fracionada a cada 3–4 horas para maximizar a síntese proteica miofibrilar.',
    proteinGKg: 2.2,
    carbGKg: 4.2,
    fatGKg: 0.9,
    calOffset: 400,
    meals: [
      {
        time: '07:30',
        name: 'Café da Manhã Anabólico',
        icon: 'fa-mug-hot',
        kcal: 550,
        items: [
          '4 Ovos inteiros mexidos com orégano e azeite',
          '60g de Aveia em flocos finos',
          '1 Banana média fatiada + 1 colher de mel',
          '1 Xícara de café puro ou chá verde'
        ]
      },
      {
        time: '10:30',
        name: 'Lanche Matinal / Pré-Treino',
        icon: 'fa-apple-whole',
        kcal: 380,
        items: [
          '30g de Whey Protein concentrado com 200ml de água',
          '1 Maçã ou Pera média',
          '30g de Pasta de amendoim integral',
          '5g de Creatina Monohidratada'
        ]
      },
      {
        time: '13:00',
        name: 'Almoço Hipertrófico',
        icon: 'fa-bowl-rice',
        kcal: 720,
        items: [
          '180g de Peito de frango ou Patinho grelhado',
          '200g de Arroz branco ou integral cozido',
          '100g de Feijão carioca ou preto',
          'Prato cheio de salada verde (alface, rúcula, tomate)',
          '1 Colher de sopa de Azeite de Oliva Extra Virgem'
        ]
      },
      {
        time: '16:30',
        name: 'Lanche da Tarde / Pós-Treino',
        icon: 'fa-blender',
        kcal: 450,
        items: [
          'Shake: 35g de Whey Protein + 40g de Aveia + 1 Banana',
          '2 Fatias de Pão 100% Integral com queijo cottage/ricota'
        ]
      },
      {
        time: '19:30',
        name: 'Jantar Construtor',
        icon: 'fa-utensils',
        kcal: 680,
        items: [
          '180g de Filé de Tilápia, Salmão ou Frango',
          '200g de Purê de Mandioca ou Batata Doce assada',
          'Brócolis e cenoura cozidos no vapor à vontade',
          'Fio de azeite de oliva'
        ]
      },
      {
        time: '22:00',
        name: 'Ceia / Recuperação Noturna',
        icon: 'fa-moon',
        kcal: 220,
        items: [
          '1 Pote de Iogurte Grego ou 3 Ovos cozidos',
          '15g de Castanhas-do-Pará ou Nozes',
          'Chá de camomila sem açúcar'
        ]
      }
    ],
    supplements: [
      { name: 'Creatina Monohidratada', dose: '5g diários contínuos', time: 'Qualquer horário (consistência)', benefit: 'Força celular, explosão muscular e hidratação das fibras' },
      { name: 'Whey Protein Concentrado/Isolado', dose: '30g a 40g ao dia', time: 'Pós-treino ou lanches', benefit: 'Praticidade para bater a meta diária de aminoácidos essenciais' },
      { name: 'Multivitamínico + Vitamina D3', dose: '1 dose com refeição', time: 'Café da Manhã', benefit: 'Suporte imunológico e síntese hormonal otimizada' },
      { name: 'Ômega-3 (EPA/DHA)', dose: '2 a 3 cápsulas ao dia', time: 'Junto ao almoço', benefit: 'Ação anti-inflamatória e recuperação articular' }
    ]
  },
  'Perda de Gordura': {
    badge: '🔥 Queima de Gordura & Definição',
    color: '#f97316',
    fitbotTip: 'Déficit calórico estratégico (-350 a -500 kcal). Alta ingestão de proteínas (2.2 a 2.4g/kg) e fibras para garantir saciedade e blindar a massa magra contra o catabolismo.',
    proteinGKg: 2.3,
    carbGKg: 2.2,
    fatGKg: 0.7,
    calOffset: -400,
    meals: [
      {
        time: '07:30',
        name: 'Café da Manhã Termogênico',
        icon: 'fa-mug-hot',
        kcal: 360,
        items: [
          'Omelete com 3 Claras + 1 Ovo inteiro + espinafre',
          '1 Fatia fina de pão 100% integral',
          '1/2 Mamão papaia com sementes de chia',
          'Café preto sem açúcar ou chá verde com canela'
        ]
      },
      {
        time: '10:30',
        name: 'Lanche Matinal Sacietógeno',
        icon: 'fa-apple-whole',
        kcal: 180,
        items: [
          '1 Maçã verde com canela em pó',
          '15g de Mix de amêndoas e nozes cruas',
          '500ml de água gelada com limão'
        ]
      },
      {
        time: '13:00',
        name: 'Almoço Low-Density',
        icon: 'fa-bowl-rice',
        kcal: 500,
        items: [
          '160g de Peito de frango grelhado ou Tilápia ao forno',
          '100g de Batata-doce ou 80g de Arroz Integral',
          'Prato gigante de salada crua (folhas, pepino, tomate)',
          '100g de Brócolis, abobrinha ou couve-flor no vapor',
          '1 Colher de sobremesa de azeite extra virgem'
        ]
      },
      {
        time: '16:30',
        name: 'Lanche da Tarde Proteico',
        icon: 'fa-blender',
        kcal: 240,
        items: [
          '1 Scoop de Whey Protein Isolado batido com água e gelo',
          '1 Pote de Iogurte natural desnatado + morangos'
        ]
      },
      {
        time: '19:30',
        name: 'Jantar Leve & Nutritivo',
        icon: 'fa-utensils',
        kcal: 420,
        items: [
          '160g de Filé de peixe branco assado ou carne moída magra',
          'Mix abundante de legumes refogados com azeite',
          'Salada de folhas verdes com vinagre de maçã'
        ]
      },
      {
        time: '22:00',
        name: 'Ceia Noturna Calmante',
        icon: 'fa-moon',
        kcal: 110,
        items: [
          'Xícara de Chá de Camomila / Melissa quente',
          '2 Castanhas-do-Pará (fonte de selênio e melatonina natural)'
        ]
      }
    ],
    supplements: [
      { name: 'Creatina Monohidratada', dose: '3g a 5g ao dia', time: 'Qualquer horário', benefit: 'Preserva força e massa muscular mesmo em restrição calórica' },
      { name: 'Cafeína / Chá Verde', dose: '150mg a 200mg', time: '30 min antes do treino', benefit: 'Acelera a oxidação lipídica e aumenta o foco/disposição' },
      { name: 'Whey Protein Isolado', dose: '30g ao dia', time: 'Lanches / Pós-treino', benefit: 'Saciedade máxima com baixíssimo teor de carboidratos e gorduras' },
      { name: 'Picolinato de Cromo', dose: '200mcg', time: 'Junto ao almoço', benefit: 'Auxilia no controle da glicemia e reduz a vontade por doces' }
    ]
  },
  'Definição': {
    badge: '⚡ Definição & Densidade Muscular',
    color: '#a855f7',
    fitbotTip: 'Leve déficit calórico (-200 kcal) com ciclo de carboidratos moderado. Alta densidade de micronutrientes e água para eliminar retenção hídrica.',
    proteinGKg: 2.2,
    carbGKg: 3.0,
    fatGKg: 0.8,
    calOffset: -200,
    meals: [
      {
        time: '07:30',
        name: 'Café da Manhã Lapidador',
        icon: 'fa-mug-hot',
        kcal: 420,
        items: [
          'Omelete de 3 ovos com queijo cottage light',
          '40g de Aveia em flocos com morangos picados',
          'Xícara de café preto sem açúcar + canela'
        ]
      },
      {
        time: '10:30',
        name: 'Lanche Intermediário',
        icon: 'fa-apple-whole',
        kcal: 250,
        items: [
          '1 Iogurte proteico zero gordura',
          '1 Fruta fresca (maçã, kiwi ou tangerina)',
          '5g de Creatina'
        ]
      },
      {
        time: '13:00',
        name: 'Almoço Densidade Máxima',
        icon: 'fa-bowl-rice',
        kcal: 580,
        items: [
          '170g de Peito de frango grelhado em tiras',
          '140g de Arroz com feijão ou batata cozida',
          'Prato farto de brócolis, espinafre e rúcula',
          'Azeite de oliva extra virgem (10ml)'
        ]
      },
      {
        time: '16:30',
        name: 'Lanche Pré/Pós Treino',
        icon: 'fa-blender',
        kcal: 320,
        items: [
          'Shake: 30g de Whey Protein + 1 Banana média + água gelada',
          '1 Torrada integral com pasta de amendoim leve'
        ]
      },
      {
        time: '19:30',
        name: 'Jantar Estético',
        icon: 'fa-utensils',
        kcal: 500,
        items: [
          '160g de Salmão ou Filé Mignon magro',
          '120g de Batata-doce assada com alecrim',
          'Mix de vegetais grelhados'
        ]
      },
      {
        time: '22:00',
        name: 'Ceia Anti-Catabólica',
        icon: 'fa-moon',
        kcal: 160,
        items: [
          '3 Claras de ovos cozidas ou 100g de Queijo Cottage',
          'Chá de hortelã ou capim-santo'
        ]
      }
    ],
    supplements: [
      { name: 'Creatina Monohidratada', dose: '5g diários', time: 'Diariamente', benefit: 'Manutenção do volume celular intracelular e densidade' },
      { name: 'Whey Protein', dose: '30g', time: 'Pós-treino', benefit: 'Síntese proteica sem adicionar gorduras indesejadas' },
      { name: 'Ômega-3 Concentrado', dose: '2 cápsulas', time: 'Almoço', benefit: 'Controle de inflamação e sensibilidade à insulina' },
      { name: 'Magnésio Quelato + Zinco (ZMA)', dose: '1 dose', time: 'Antes de dormir', benefit: 'Qualidade profunda de sono e recuperação neuromuscular' }
    ]
  },
  'Força': {
    badge: '💪 Força Bruta & Potência Neural',
    color: '#ef4444',
    fitbotTip: 'Superávit energético e foco em glicogênio muscular. Alto teor de carboidratos complexos e creatina para recarregar o sistema fosfagênio (ATP-CP).',
    proteinGKg: 2.1,
    carbGKg: 4.8,
    fatGKg: 1.0,
    calOffset: 450,
    meals: [
      {
        time: '07:30',
        name: 'Café da Manhã Power',
        icon: 'fa-mug-hot',
        kcal: 650,
        items: [
          '4 Ovos mexidos com 2 fatias de queijo',
          '3 Fatias de pão integral com geleia ou mel',
          '1 Copo de leite desnatado com café e canela'
        ]
      },
      {
        time: '10:30',
        name: 'Recarga de Glicogênio',
        icon: 'fa-apple-whole',
        kcal: 400,
        items: [
          '1 Banana com 40g de Aveia e 1 colher de pasta de amendoim',
          '5g de Creatina'
        ]
      },
      {
        time: '13:00',
        name: 'Almoço de Força',
        icon: 'fa-bowl-rice',
        kcal: 800,
        items: [
          '200g de Carne vermelha magra (patinho/alcatra) ou frango',
          '250g de Arroz branco + 100g de Feijão preto',
          'Salada com azeite de oliva e sal marinho'
        ]
      },
      {
        time: '16:30',
        name: 'Pré-Treino Pesado',
        icon: 'fa-blender',
        kcal: 450,
        items: [
          'Shake: 35g de Whey Protein + 50g de Aveia + mel',
          '1 Maçã ou Pera'
        ]
      },
      {
        time: '19:30',
        name: 'Jantar Restaurador',
        icon: 'fa-utensils',
        kcal: 750,
        items: [
          '180g de Filé de frango ou carne bovina',
          '250g de Mandioca cozida ou Macarrão integral com molho de tomate',
          'Legumes variados'
        ]
      },
      {
        time: '22:00',
        name: 'Ceia Reparadora',
        icon: 'fa-moon',
        kcal: 250,
        items: [
          '2 Ovos cozidos com queijo cottage',
          'Mix de castanhas e nozes'
        ]
      }
    ],
    supplements: [
      { name: 'Creatina Monohidratada', dose: '5g a 7g ao dia', time: 'Pré ou Pós-treino', benefit: 'Recarga indispensável de ATP-CP para levantamento de peso pesado' },
      { name: 'Beta-Alanina', dose: '3g a 5g fracionados', time: 'Pré-treino', benefit: 'Tamponamento do ácido lático e aumento da resistência muscular à fadiga' },
      { name: 'Whey Protein', dose: '35g', time: 'Pós-treino', benefit: 'Recuperação miofibrilar acelerada' },
      { name: 'Vitamina D3 + K2', dose: '5000 UI', time: 'Café da manhã', benefit: 'Saúde óssea, articular e regulação hormonal de força' }
    ]
  },
  'Saúde & Condicionamento': {
    badge: '🏃 Saúde, Funcional & Vitalidade',
    color: '#22c55e',
    fitbotTip: 'Dieta equilibrada e anti-inflamatória, rica em antioxidantes, gorduras boas e alimentos naturais da terra para longevidade e energia constante.',
    proteinGKg: 1.8,
    carbGKg: 3.2,
    fatGKg: 0.9,
    calOffset: 0,
    meals: [
      {
        time: '07:30',
        name: 'Café da Manhã Vitalidade',
        icon: 'fa-mug-hot',
        kcal: 400,
        items: [
          '2 Ovos mexidos com azeite e cúrcuma',
          '1 Pão 100% integral ou tapioca leve',
          '1 Xícara de frutas vermelhas ou mamão',
          'Suco verde ou chá de gengibre'
        ]
      },
      {
        time: '10:30',
        name: 'Lanche Saudável',
        icon: 'fa-apple-whole',
        kcal: 200,
        items: [
          '1 Iogurte natural desnatado com sementes de chia',
          '1 Punhado de nozes'
        ]
      },
      {
        time: '13:00',
        name: 'Almoço Colorido & Funcional',
        icon: 'fa-bowl-rice',
        kcal: 600,
        items: [
          '150g de Peito de frango, Salmão ou Ovos cozidos',
          '150g de Quinoa cozida ou Arroz integral com feijão',
          'Salada arco-íris (folhas escuras, cenoura ralada, beterraba, tomate)',
          'Azeite de oliva extra virgem e sementes de abóbora'
        ]
      },
      {
        time: '16:30',
        name: 'Lanche da Tarde Equilibrado',
        icon: 'fa-blender',
        kcal: 280,
        items: [
          '1 Scoop de Whey ou Proteína vegetal com leite vegetal',
          '1 Banana média'
        ]
      },
      {
        time: '19:30',
        name: 'Jantar Confortável & Leve',
        icon: 'fa-utensils',
        kcal: 480,
        items: [
          '140g de Peixe grelhado ou frango desfiado',
          'Sopa nutritiva de abóbora com gengibre ou legumes assados',
          'Salada verde'
        ]
      },
      {
        time: '22:00',
        name: 'Chá Relaxante & Recuperação',
        icon: 'fa-moon',
        kcal: 90,
        items: [
          'Chá de Camomila com própolis',
          '1 Castanha-do-Pará'
        ]
      }
    ],
    supplements: [
      { name: 'Ômega-3 Premium', dose: '2 cápsulas', time: 'Junto ao almoço', benefit: 'Saúde cardiovascular, cognitiva e redução de marcadores inflamatórios' },
      { name: 'Creatina', dose: '3g ao dia', time: 'Qualquer hora', benefit: 'Saúde celular e função cognitiva e neuromuscular' },
      { name: 'Multivitamínico Mineral', dose: '1 dose', time: 'Café da manhã', benefit: 'Garante o aporte diário ideal de todos os micronutrientes' },
      { name: 'Vitamina C + Zinco', dose: '500mg', time: 'Manhã', benefit: 'Fortalecimento do sistema imunológico e síntese de colágeno' }
    ]
  }
};

let currentDietGoal = 'Hipertrofia';

function openDietModal() {
  const p = (typeof loadProfileData === 'function' ? loadProfileData() : null) || JSON.parse(localStorage.getItem('fitsaude_profile_v2') || '{}');
  const currentUser = JSON.parse(localStorage.getItem('fitsaude_current_user_v2') || '{}');

  const detectedGoal = p.goal || currentUser.goal || 'Hipertrofia';
  currentDietGoal = detectedGoal;

  const studentName = p.name || currentUser.name || 'Aluno FitSaúde';
  const weight = parseFloat(p.weight || currentUser.weight) || 75;
  const height = parseFloat(p.height || currentUser.height) || 175;

  const subtitleEl = document.getElementById('diet-student-subtitle');
  if (subtitleEl) subtitleEl.textContent = `Aluno: ${studentName} • Prescrição Nutricional FitBot IA`;

  const weightTagEl = document.getElementById('diet-student-weight-tag');
  if (weightTagEl) weightTagEl.textContent = `${weight} kg • ${height} cm`;

  const selectEl = document.getElementById('diet-goal-select');
  if (selectEl) selectEl.value = detectedGoal;

  renderDietPlan(detectedGoal);

  const modal = document.getElementById('diet-modal-overlay');
  if (modal) modal.classList.add('show');
}

function closeDietModal() {
  const modal = document.getElementById('diet-modal-overlay');
  if (modal) modal.classList.remove('show');
}

function switchDietTab(tab) {
  const tabMeals = document.getElementById('diet-tab-meals');
  const tabSupps = document.getElementById('diet-tab-supplements');
  const btnMeals = document.getElementById('tab-btn-meals');
  const btnSupps = document.getElementById('tab-btn-supplements');

  if (tab === 'meals') {
    if (tabMeals) tabMeals.style.display = 'block';
    if (tabSupps) tabSupps.style.display = 'none';
    if (btnMeals) { btnMeals.style.background = '#22d3a0'; btnMeals.style.color = '#000'; }
    if (btnSupps) { btnSupps.style.background = 'transparent'; btnSupps.style.color = '#a1a1aa'; }
  } else {
    if (tabMeals) tabMeals.style.display = 'none';
    if (tabSupps) tabSupps.style.display = 'block';
    if (btnSupps) { btnSupps.style.background = '#22d3a0'; btnSupps.style.color = '#000'; }
    if (btnMeals) { btnMeals.style.background = 'transparent'; btnMeals.style.color = '#a1a1aa'; }
  }
}

function renderDietPlan(goal) {
  currentDietGoal = goal || 'Hipertrofia';
  const plan = DIET_PLANS_DATABASE[currentDietGoal] || DIET_PLANS_DATABASE['Hipertrofia'];

  const p = (typeof loadProfileData === 'function' ? loadProfileData() : null) || JSON.parse(localStorage.getItem('fitsaude_profile_v2') || '{}');
  const currentUser = JSON.parse(localStorage.getItem('fitsaude_current_user_v2') || '{}');
  const weight = parseFloat(p.weight || currentUser.weight) || 75;
  const height = parseFloat(p.height || currentUser.height) || 175;
  const age = parseInt(p.age || currentUser.age) || 25;
  const gender = p.gender || 'masculino';

  // Badge & Quote
  const badgeEl = document.getElementById('diet-detected-badge');
  if (badgeEl) {
    badgeEl.style.borderColor = plan.color;
    badgeEl.style.color = plan.color;
    badgeEl.style.background = `${plan.color}22`;
    badgeEl.innerHTML = `<i class="fa-solid fa-bullseye"></i> ${plan.badge}`;
  }

  const quoteEl = document.getElementById('diet-fitbot-quote');
  if (quoteEl) {
    quoteEl.style.borderLeftColor = plan.color;
    quoteEl.innerHTML = `<strong style="color:${plan.color};"><i class="fa-solid fa-robot"></i> FitBot IA:</strong> ${plan.fitbotTip}`;
  }

  // Cálculos Nutricionais Personalizados
  const tmb = calcTMB(weight, height, age, gender) || 1700;
  const tdee = Math.round(tmb * 1.4);
  const totalCalories = Math.round(tdee + plan.calOffset);

  const totalProteinG = Math.round(weight * plan.proteinGKg);
  const totalCarbG = Math.round(weight * plan.carbGKg);
  const totalFatG = Math.round(weight * plan.fatGKg);
  const waterL = ((weight * 35) / 1000).toFixed(1);

  // Macros Grid
  const macrosGrid = document.getElementById('diet-macros-grid');
  if (macrosGrid) {
    macrosGrid.innerHTML = `
      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px; text-align: center;">
        <div style="font-size: 10px; color: #a1a1aa; text-transform: uppercase; font-weight: 700;">🔥 Calorias</div>
        <div style="font-size: 15px; font-weight: 800; color: #fff; margin-top: 2px;">${totalCalories}</div>
        <div style="font-size: 9px; color: #71717a;">kcal / dia</div>
      </div>
      <div style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.25); border-radius: 10px; padding: 10px; text-align: center;">
        <div style="font-size: 10px; color: #93c5fd; text-transform: uppercase; font-weight: 700;">🥩 Proteína</div>
        <div style="font-size: 15px; font-weight: 800; color: #60a5fa; margin-top: 2px;">${totalProteinG}g</div>
        <div style="font-size: 9px; color: #93c5fd;">${plan.proteinGKg}g / kg</div>
      </div>
      <div style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25); border-radius: 10px; padding: 10px; text-align: center;">
        <div style="font-size: 10px; color: #fcd34d; text-transform: uppercase; font-weight: 700;">🍚 Carbos</div>
        <div style="font-size: 15px; font-weight: 800; color: #fbbf24; margin-top: 2px;">${totalCarbG}g</div>
        <div style="font-size: 9px; color: #fcd34d;">${plan.carbGKg}g / kg</div>
      </div>
      <div style="background: rgba(34,211,160,0.08); border: 1px solid rgba(34,211,160,0.25); border-radius: 10px; padding: 10px; text-align: center;">
        <div style="font-size: 10px; color: #6ee7b7; text-transform: uppercase; font-weight: 700;">🥑 Gorduras</div>
        <div style="font-size: 15px; font-weight: 800; color: #22d3a0; margin-top: 2px;">${totalFatG}g</div>
        <div style="font-size: 9px; color: #6ee7b7;">${plan.fatGKg}g / kg</div>
      </div>
    `;
  }

  // Refeições
  const mealsContainer = document.getElementById('diet-tab-meals');
  if (mealsContainer) {
    mealsContainer.innerHTML = plan.meals.map((m, i) => `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 12px; margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 28px; height: 28px; border-radius: 8px; background: rgba(34,211,160,0.15); color: #22d3a0; display: flex; align-items: center; justify-content: center; font-size: 12px;">
              <i class="fa-solid ${m.icon}"></i>
            </div>
            <div>
              <div style="font-size: 12.5px; font-weight: 800; color: #fff;">${m.name}</div>
              <div style="font-size: 10.5px; color: #a1a1aa;"><i class="fa-regular fa-clock"></i> ${m.time} • ~${m.kcal} kcal</div>
            </div>
          </div>
          <span style="font-size: 10px; background: rgba(255,255,255,0.08); padding: 2px 7px; border-radius: 12px; color: #d4d4d8;">Refeição ${i + 1}</span>
        </div>
        <ul style="margin: 0; padding-left: 18px; font-size: 11.5px; color: #e4e4e7; line-height: 1.5;">
          ${m.items.map(it => `<li style="margin-bottom: 3px;">${it}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  // Suplementos
  const suppsContainer = document.getElementById('diet-tab-supplements');
  if (suppsContainer) {
    suppsContainer.innerHTML = `
      <div style="font-size: 11.5px; color: #a1a1aa; margin-bottom: 10px; line-height: 1.4;">
        <i class="fa-solid fa-circle-info" style="color:#22d3a0;"></i> Suplementação estratégica recomendada pelo FitBot IA para potencializar os resultados da meta de <strong>${plan.badge}</strong>:
      </div>
      ${plan.supplements.map(s => `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 12px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <div style="font-size: 12.5px; font-weight: 800; color: #22d3a0;">
              <i class="fa-solid fa-pills" style="margin-right: 4px;"></i> ${s.name}
            </div>
            <span style="font-size: 10.5px; color: #ffd166; font-weight: 700;">${s.dose}</span>
          </div>
          <div style="font-size: 11px; color: #a1a1aa; margin-bottom: 4px;"><i class="fa-regular fa-clock"></i> Momento: ${s.time}</div>
          <div style="font-size: 11px; color: #e4e4e7;"><strong>Benefício:</strong> ${s.benefit}</div>
        </div>
      `).join('')}
    `;
  }
}

function shareDietWhatsApp() {
  const p = (typeof loadProfileData === 'function' ? loadProfileData() : null) || JSON.parse(localStorage.getItem('fitsaude_profile_v2') || '{}');
  const currentUser = JSON.parse(localStorage.getItem('fitsaude_current_user_v2') || '{}');
  const plan = DIET_PLANS_DATABASE[currentDietGoal] || DIET_PLANS_DATABASE['Hipertrofia'];

  const studentName = p.name || currentUser.name || 'Aluno FitSaúde';
  const weight = parseFloat(p.weight || currentUser.weight) || 75;

  let text = `🥗 *PLANO ALIMENTAR FITSAÚDE & FITBOT IA*\n\n`;
  text += `👤 *Aluno:* ${studentName}\n`;
  text += `🎯 *Objetivo:* ${plan.badge}\n`;
  text += `⚖️ *Peso Atual:* ${weight} kg\n\n`;
  text += `📊 *METAS NUTRICIONAIS DIÁRIAS:*\n`;
  text += `• Proteína: ~${Math.round(weight * plan.proteinGKg)}g (${plan.proteinGKg}g/kg)\n`;
  text += `• Carboidratos: ~${Math.round(weight * plan.carbGKg)}g\n`;
  text += `• Gorduras: ~${Math.round(weight * plan.fatGKg)}g\n`;
  text += `• Hidratação: ~${((weight * 35)/1000).toFixed(1)}L de água\n\n`;
  text += `🍽️ *CARDÁPIO SUGERIDO:*\n`;

  plan.meals.forEach((m, i) => {
    text += `\n*${i + 1}. ${m.name} (${m.time})*\n`;
    m.items.forEach(it => {
      text += `  - ${it}\n`;
    });
  });

  text += `\n🤖 *Dica FitBot IA:* ${plan.fitbotTip}\n\n`;
  text += `💪 *FitSaúde — Seu Treino e Dieta no Bolso!*`;

  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
