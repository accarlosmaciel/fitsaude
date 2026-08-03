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

  if (typeof setGender === 'function' && (gender === 'masculino' || gender === 'feminino')) {
    setGender(gender);
  }

  const dayGreeting = document.getElementById('day-greeting');
  if (dayGreeting && typeof getGreeting === 'function') dayGreeting.innerHTML = getGreeting();

  toast('<i class="fa-solid fa-user-check"></i>', 'Perfil atualizado!');
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
