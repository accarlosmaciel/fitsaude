/* ─── FITSAÚDE PROFILE & HEALTH MODULE ────────────────────────── */

let userProfile = getStorageItem(STORAGE_KEYS.PK, DEFAULT_PROFILE);

function loadProfileData() {
  userProfile = getStorageItem(STORAGE_KEYS.PK, DEFAULT_PROFILE);
  return userProfile;
}

function saveProfileData(p) {
  userProfile = p;
  setStorageItem(STORAGE_KEYS.PK, userProfile);
}

/* ── Calculations ── */
function calcIMC(weight, heightCm) {
  if (!weight || !heightCm) return { imc: '—', label: 'Indefinido', badgeClass: 'badge-imc-normal' };
  const hM = heightCm / 100;
  const imc = (weight / (hM * hM)).toFixed(1);
  let label = 'Peso Ideal';
  let badgeClass = 'badge-imc-normal';
  if (imc < 18.5) { label = 'Abaixo do Peso'; badgeClass = 'badge-imc-warn'; }
  else if (imc < 25) { label = 'Peso Ideal'; badgeClass = 'badge-imc-normal'; }
  else if (imc < 30) { label = 'Sobrepeso'; badgeClass = 'badge-imc-warn'; }
  else { label = 'Obesidade'; badgeClass = 'badge-imc-alert'; }
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

  if (!intakeValEl) return;

  const intakeL = (waterIntakeMl / 1000).toFixed(1);
  const goalL = (waterGoalMl / 1000).toFixed(1);
  const pct = Math.min(100, Math.round((waterIntakeMl / waterGoalMl) * 100));

  intakeValEl.textContent = `${intakeL} L`;
  targetSubEl.textContent = `/ ${goalL} L hoje`;
  pctValEl.textContent = `${pct}%`;
  if (fillEl) fillEl.style.width = `${pct}%`;

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
