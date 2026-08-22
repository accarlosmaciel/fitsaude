/* ══════════════════════════════════════════════════════════════════
   FITSAÚDE - SISTEMA MULTIUSUÁRIO & FUNIL DE ONBOARDING
   Visitante (Funil Onboarding) | Atleta (WebApp) | Administrador (Painel Próprio)
   ══════════════════════════════════════════════════════════════════ */

const ROLES_STORAGE_KEY = 'fitsaude_user_role_v2';
const CURRENT_USER_KEY = 'fitsaude_current_user_v2';
const STUDENTS_DB_KEY = 'fitsaude_students_db_v2';
const SUBSCRIPTIONS_DB_KEY = 'fitsaude_subscriptions_db_v2';
const ADMIN_CONFIG_KEY = 'fitsaude_admin_config_v2';

function showToast(msg, icon = '<i class="fa-solid fa-circle-check"></i>') {
  if (typeof toast === 'function') {
    toast(icon, msg, 2200);
  }
}

// Initial Mock Data for System
const DEFAULT_STUDENTS = [
  { id: 'alu_1', name: 'Carlos Maciel', email: 'carlos@fitsaude.com', plan: 'Anual VIP', status: 'active', joined: '15/01/2026', phone: '(11) 98765-4321', goal: 'Hipertrofia', weight: 78, height: 178, workoutsDone: 34, avatar: 'CM' },
  { id: 'alu_2', name: 'Mariana Silva', email: 'mariana.silva@email.com', plan: 'Trimestral', status: 'active', joined: '02/02/2026', phone: '(11) 97654-3210', goal: 'Emagrecimento', weight: 62, height: 165, workoutsDone: 21, avatar: 'MS' },
  { id: 'alu_3', name: 'Lucas Oliveira', email: 'lucas.treino@email.com', plan: 'Mensal', status: 'pending', joined: '18/08/2026', phone: '(21) 99887-1122', goal: 'Definição', weight: 82, height: 180, workoutsDone: 8, avatar: 'LO' },
  { id: 'alu_4', name: 'Beatriz Costa', email: 'beatriz.c@email.com', plan: 'Anual VIP', status: 'active', joined: '20/12/2025', phone: '(31) 98444-5566', goal: 'Condicionamento', weight: 58, height: 162, workoutsDone: 49, avatar: 'BC' },
  { id: 'alu_5', name: 'Rafael Santos', email: 'rafa.santos@email.com', plan: 'Mensal', status: 'blocked', joined: '10/05/2026', phone: '(41) 99112-3344', goal: 'Força', weight: 90, height: 185, workoutsDone: 15, avatar: 'RS' }
];

const DEFAULT_SUBSCRIPTIONS = [
  { id: 'sub_101', student: 'Carlos Maciel', plan: 'Anual VIP', val: 'R$ 29,90/mês', method: 'Cartão de Crédito', status: 'Paga', date: '15/01/2026' },
  { id: 'sub_102', student: 'Mariana Silva', plan: 'Trimestral', val: 'R$ 39,90/mês', method: 'PIX Simulado', status: 'Paga', date: '02/02/2026' },
  { id: 'sub_103', student: 'Lucas Oliveira', plan: 'Mensal', val: 'R$ 49,90/mês', method: 'PIX Simulado', status: 'Pendente', date: '18/08/2026' },
  { id: 'sub_104', student: 'Beatriz Costa', plan: 'Anual VIP', val: 'R$ 29,90/mês', method: 'Cartão de Crédito', status: 'Paga', date: '20/12/2025' }
];

const DEFAULT_ADMIN_CONFIG = {
  gymName: 'FitSaúde Club & Training',
  gymPhone: '(11) 98888-7777',
  groqModel: 'Llama 3.3 70B Versatile',
  planPrices: { mensal: 49.90, trimestral: 39.90, anual: 29.90 },
  autoRenew: true
};

// Current Session State
let currentUserRole = localStorage.getItem(ROLES_STORAGE_KEY) || 'visitante';
let selectedOnboardingPlan = { name: 'Anual VIP', price: 'R$ 29,90/mês (R$ 358,80/ano)' };
let temporaryUserData = null;

// Initialize System on load
function initRolesSystem() {
  if (!localStorage.getItem(STUDENTS_DB_KEY)) {
    localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(DEFAULT_STUDENTS));
  }
  if (!localStorage.getItem(SUBSCRIPTIONS_DB_KEY)) {
    localStorage.setItem(SUBSCRIPTIONS_DB_KEY, JSON.stringify(DEFAULT_SUBSCRIPTIONS));
  }
  if (!localStorage.getItem(ADMIN_CONFIG_KEY)) {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(DEFAULT_ADMIN_CONFIG));
  }
  if (!localStorage.getItem(CURRENT_USER_KEY)) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
      name: 'Carlos Maciel',
      email: 'carlos@fitsaude.com',
      role: 'atleta',
      plan: 'Anual VIP',
      memberSince: '15/01/2026'
    }));
  }

  // Handle URL Hash routing
  handleHashRouting();
  window.addEventListener('hashchange', handleHashRouting);

  // Set the active role view
  setUserRole(currentUserRole, true);
}

// ─── URL Hash Routing ─────────────────────────────────────────
function handleHashRouting() {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  if (!hash) return;

  const parts = hash.split('/');
  const section = parts[0];
  const sub = parts[1];
  const param = parts[2];

  if (section === 'visitante') {
    setUserRole('visitante', true);
    if (sub === 'planos') switchRoleScreen('visitante-planos');
    else switchRoleScreen('visitante-landing');
  } else if (section === 'atleta') {
    setUserRole('atleta', true);
    if (sub) switchRoleScreen(sub === 'assinatura' ? 'atleta-assinatura' : (sub === 'seguranca' ? 'atleta-seguranca' : sub));
  } else if (section === 'admin') {
    setUserRole('admin', true);
    if (sub === 'alunos' && param) {
      switchRoleScreen('admin-alunos');
      openStudentDetail(param);
    } else if (sub) {
      switchRoleScreen('admin-' + sub);
    } else {
      switchRoleScreen('admin-dashboard');
    }
  }
}

// ─── Set Role & Re-render Interface ───────────────────────────
function setUserRole(role, silent = false) {
  currentUserRole = role;
  localStorage.setItem(ROLES_STORAGE_KEY, role);

  // Update top-bar badge
  const badge = document.getElementById('current-role-badge');
  if (badge) {
    badge.className = `role-badge-current role-badge-${role}`;
    const labels = {
      visitante: '<i class="fa-solid fa-eye"></i> Visitante',
      atleta: '<i class="fa-solid fa-dumbbell"></i> Atleta',
      admin: '<i class="fa-solid fa-crown"></i> Administrador'
    };
    badge.innerHTML = labels[role] || role;
  }

  // Update switcher buttons state
  document.querySelectorAll('.role-switch-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  // Render role-specific navigation
  renderRoleNavigation(role);

  // Navigate to appropriate default screen
  if (role === 'visitante') {
    switchRoleScreen('visitante-landing');
  } else if (role === 'atleta') {
    switchRoleScreen('treinos');
  } else if (role === 'admin') {
    switchRoleScreen('admin-dashboard');
    renderAdminDashboard();
  }

  if (!silent) {
    const roleTitles = { 
      visitante: 'Modo Visitante Ativo', 
      atleta: '⚡ Bem-vindo(a) ao WebApp do Atleta!', 
      admin: '👑 Painel Administrativo do FitSaúde' 
    };
    showToast(roleTitles[role] || 'Perfil alterado');
  }
}

// ─── Role Navigation Renderer ─────────────────────────────────
function renderRoleNavigation(role) {
  const nav = document.getElementById('main-bottom-nav');
  if (!nav) return;

  nav.className = `bottom-nav nav-${role}`;

  if (role === 'visitante') {
    nav.innerHTML = `
      <button class="nav-btn active" id="nav-visitante-landing" onclick="switchRoleScreen('visitante-landing')">
        <span class="nav-icon"><i class="fa-solid fa-house"></i></span>
        <span class="nav-label">Conhecer</span>
      </button>
      <button class="nav-btn" id="nav-visitante-planos" onclick="switchRoleScreen('visitante-planos')">
        <span class="nav-icon"><i class="fa-solid fa-tags"></i></span>
        <span class="nav-label">Planos</span>
      </button>
      <button class="nav-btn" id="nav-visitante-auth" onclick="openAuthModal('login')">
        <span class="nav-icon"><i class="fa-solid fa-right-to-bracket"></i></span>
        <span class="nav-label">Entrar</span>
      </button>
    `;
  } else if (role === 'atleta') {
    nav.innerHTML = `
      <button class="nav-btn active" id="nav-treinos" onclick="switchRoleScreen('treinos')">
        <span class="nav-icon"><i class="fa-solid fa-dumbbell"></i></span>
        <span class="nav-label">Treinos</span>
      </button>
      <button class="nav-btn" id="nav-planilhas" onclick="switchRoleScreen('planilhas')">
        <span class="nav-icon"><i class="fa-solid fa-table-list"></i></span>
        <span class="nav-label">Planilhas</span>
      </button>
      <button class="nav-btn" id="nav-resumo" onclick="switchRoleScreen('resumo')">
        <span class="nav-icon"><i class="fa-solid fa-chart-pie"></i></span>
        <span class="nav-label">Resumo</span>
      </button>
      <button class="nav-btn" id="nav-chat" onclick="switchRoleScreen('chat')">
        <span class="nav-icon"><i class="fa-solid fa-comment-dots"></i></span>
        <div class="badge show" id="chat-badge"></div>
        <span class="nav-label">FitBot</span>
      </button>
      <button class="nav-btn" id="nav-perfil" onclick="switchRoleScreen('perfil')">
        <span class="nav-icon"><i class="fa-solid fa-user"></i></span>
        <span class="nav-label">Perfil</span>
      </button>
    `;
  } else if (role === 'admin') {
    nav.innerHTML = `
      <button class="nav-btn active" id="nav-admin-dashboard" onclick="switchRoleScreen('admin-dashboard')">
        <span class="nav-icon"><i class="fa-solid fa-chart-line"></i></span>
        <span class="nav-label">Painel</span>
      </button>
      <button class="nav-btn" id="nav-admin-alunos" onclick="switchRoleScreen('admin-alunos')">
        <span class="nav-icon"><i class="fa-solid fa-users"></i></span>
        <span class="nav-label">Alunos</span>
      </button>
      <button class="nav-btn" id="nav-admin-treinos" onclick="switchRoleScreen('admin-treinos')">
        <span class="nav-icon"><i class="fa-solid fa-dumbbell"></i></span>
        <span class="nav-label">Treinos</span>
      </button>
      <button class="nav-btn" id="nav-admin-planilhas" onclick="switchRoleScreen('admin-planilhas')">
        <span class="nav-icon"><i class="fa-solid fa-file-pdf"></i></span>
        <span class="nav-label">Planilhas</span>
      </button>
      <button class="nav-btn" id="nav-admin-assinaturas" onclick="switchRoleScreen('admin-assinaturas')">
        <span class="nav-icon"><i class="fa-solid fa-credit-card"></i></span>
        <span class="nav-label">Assinaturas</span>
      </button>
      <button class="nav-btn" id="nav-admin-config" onclick="switchRoleScreen('admin-config')">
        <span class="nav-icon"><i class="fa-solid fa-gear"></i></span>
        <span class="nav-label">Config</span>
      </button>
    `;
  }
}

// ─── Switch Screen Handler ────────────────────────────────────
function switchRoleScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const targetScreen = document.getElementById('screen-' + screenId);
  const targetNavBtn = document.getElementById('nav-' + screenId);

  if (targetScreen) targetScreen.classList.add('active');
  if (targetNavBtn) targetNavBtn.classList.add('active');

  // Update Header title and icon
  const headerTitle = document.getElementById('header-title');
  const headerIcon = document.getElementById('header-icon');

  const titles = {
    'visitante-landing': 'Fit<span>Saúde</span>',
    'visitante-planos': 'Planos <span>FitSaúde</span>',
    'treinos': 'Fit<span>Saúde</span>',
    'planilhas': 'Planilhas <span>Treinos</span>',
    'resumo': 'Resumo <span>Semanal</span>',
    'chat': 'FitBot <span>IA</span>',
    'perfil': 'Perfil <span>Atleta</span>',
    'atleta-assinatura': 'Minha <span>Assinatura</span>',
    'atleta-seguranca': 'Segurança & <span>Acesso</span>',
    'admin-dashboard': 'Admin <span>Dashboard</span>',
    'admin-alunos': 'Gestão de <span>Alunos</span>',
    'admin-treinos': 'Treinos <span>Academia</span>',
    'admin-planilhas': 'Relatórios & <span>Planilhas</span>',
    'admin-assinaturas': 'Gestão <span>Financeira</span>',
    'admin-config': 'Configurações <span>Gerais</span>'
  };

  const icons = {
    'visitante-landing': '<i class="fa-solid fa-dumbbell"></i>',
    'visitante-planos': '<i class="fa-solid fa-tags"></i>',
    'treinos': '<i class="fa-solid fa-dumbbell"></i>',
    'planilhas': '<i class="fa-solid fa-table-list"></i>',
    'resumo': '<i class="fa-solid fa-chart-pie"></i>',
    'chat': '<i class="fa-solid fa-robot"></i>',
    'perfil': '<i class="fa-solid fa-user"></i>',
    'atleta-assinatura': '<i class="fa-solid fa-credit-card"></i>',
    'atleta-seguranca': '<i class="fa-solid fa-shield-halved"></i>',
    'admin-dashboard': '<i class="fa-solid fa-chart-line"></i>',
    'admin-alunos': '<i class="fa-solid fa-users"></i>',
    'admin-treinos': '<i class="fa-solid fa-dumbbell"></i>',
    'admin-planilhas': '<i class="fa-solid fa-file-pdf"></i>',
    'admin-assinaturas': '<i class="fa-solid fa-credit-card"></i>',
    'admin-config': '<i class="fa-solid fa-gear"></i>'
  };

  if (headerTitle && titles[screenId]) headerTitle.innerHTML = titles[screenId];
  if (headerIcon && icons[screenId]) headerIcon.innerHTML = icons[screenId];

  // Call relevant screen renderers
  if (screenId === 'planilhas' && typeof renderPlanilhas === 'function') renderPlanilhas();
  if (screenId === 'resumo' && typeof renderSummary === 'function') renderSummary();
  if (screenId === 'admin-dashboard') renderAdminDashboard();
  if (screenId === 'admin-alunos') renderAdminAlunos();
  if (screenId === 'admin-assinaturas') renderAdminAssinaturas();
  if (screenId === 'admin-config') renderAdminConfig();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════════════════════════════════
//  FLUXO DO VISITANTE (ONBOARDING FUNNEL STEP-BY-STEP)
//  VISITANTE → CONHECE → PLANOS → CRIA CONTA → ASSINA → RECEBE ACESSO → ENTRA WEBAPP
// ══════════════════════════════════════════════════════════════════

function startOnboardingFunnel(planName, price) {
  selectedOnboardingPlan = { name: planName, price: price };
  
  // Set modal texts
  const planTag = document.getElementById('ob-selected-plan-badge');
  const planVal = document.getElementById('ob-selected-plan-price');
  if (planTag) planTag.innerText = `Plano ${planName}`;
  if (planVal) planVal.innerText = price;

  // Open modal at Step 1 (Criar Conta)
  openOnboardingModal();
  setOnboardingStep(1);
}

function openOnboardingModal() {
  const modal = document.getElementById('onboarding-modal-backdrop');
  if (modal) modal.classList.add('show');
}

function closeOnboardingModal() {
  const modal = document.getElementById('onboarding-modal-backdrop');
  if (modal) modal.classList.remove('show');
}

function setOnboardingStep(step) {
  // Update step indicators
  document.querySelectorAll('.step-node').forEach((node, idx) => {
    node.classList.remove('active', 'done');
    if (idx + 1 === step) node.classList.add('active');
    else if (idx + 1 < step) node.classList.add('done');
  });

  // Show correct step container
  document.getElementById('ob-step-1').style.display = step === 1 ? 'block' : 'none';
  document.getElementById('ob-step-2').style.display = step === 2 ? 'block' : 'none';
  document.getElementById('ob-step-3').style.display = step === 3 ? 'block' : 'none';
}

function handleOnboardingStep1Submit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('ob-name').value;
  const email = document.getElementById('ob-email').value;
  const pass = document.getElementById('ob-pass').value;
  const goal = document.getElementById('ob-goal').value;

  if (!name || !email || !pass) {
    showToast('Por favor, preencha todos os campos!');
    return;
  }

  temporaryUserData = {
    id: 'alu_' + Date.now(),
    name: name,
    email: email,
    role: 'atleta',
    plan: selectedOnboardingPlan.name,
    status: 'active',
    joined: new Date().toLocaleDateString('pt-BR'),
    phone: '(11) 9' + Math.floor(10000000 + Math.random() * 90000000),
    goal: goal || 'Hipertrofia',
    weight: 75,
    height: 175,
    workoutsDone: 0,
    avatar: name.slice(0, 2).toUpperCase()
  };

  // Advance to Step 2 (Assinatura / Pagamento Simulado)
  setOnboardingStep(2);
  showToast('Conta criada! Prossiga com a assinatura.');
}

function confirmSimulatedPayment() {
  if (!temporaryUserData) {
    temporaryUserData = {
      id: 'alu_' + Date.now(),
      name: 'Carlos Maciel',
      email: 'carlos@fitsaude.com',
      role: 'atleta',
      plan: selectedOnboardingPlan.name,
      status: 'active',
      joined: new Date().toLocaleDateString('pt-BR'),
      phone: '(11) 98765-4321',
      goal: 'Hipertrofia',
      weight: 75,
      height: 175,
      workoutsDone: 0,
      avatar: 'CM'
    };
  }

  // Save student to DB
  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  students.unshift(temporaryUserData);
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students));

  // Save current active user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(temporaryUserData));

  // Save subscription record
  const subs = JSON.parse(localStorage.getItem(SUBSCRIPTIONS_DB_KEY) || '[]');
  const isPix = document.getElementById('ob-pay-pix')?.classList.contains('active');
  subs.unshift({
    id: 'sub_' + Date.now(),
    student: temporaryUserData.name,
    plan: selectedOnboardingPlan.name,
    val: selectedOnboardingPlan.price.split('(')[0].trim(),
    method: isPix ? 'PIX Simulado' : 'Cartão de Crédito',
    status: 'Paga',
    date: new Date().toLocaleDateString('pt-BR')
  });
  localStorage.setItem(SUBSCRIPTIONS_DB_KEY, JSON.stringify(subs));

  // Update success card info
  const successName = document.getElementById('ob-success-user-name');
  const successPlan = document.getElementById('ob-success-plan-title');
  if (successName) successName.innerText = temporaryUserData.name;
  if (successPlan) successPlan.innerText = `Plano ${selectedOnboardingPlan.name}`;

  // Advance to Step 3 (Recebe Acesso)
  setOnboardingStep(3);
  if (typeof confetti === 'function') confetti();
  showToast('🎉 Pagamento aprovado com sucesso!');
}

function enterWebAppAsAthlete() {
  closeOnboardingModal();
  setUserRole('atleta');
  switchRoleScreen('treinos');
  showToast(`⚡ Bem-vindo ao FitSaúde! Bons treinos!`);
}

// ─── General Auth Modal (Login Direto / Cadastro) ─────────────
function openAuthModal(tab = 'login') {
  const modal = document.getElementById('auth-modal-backdrop');
  if (!modal) return;
  modal.classList.add('show');
  switchAuthTab(tab);
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal-backdrop');
  if (modal) modal.classList.remove('show');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.auth-tab-content').forEach(c => c.style.display = 'none');

  const activeBtn = document.getElementById(`auth-tab-${tab}`);
  const activeContent = document.getElementById(`auth-form-${tab}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activeContent) activeContent.style.display = 'block';
}

function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('auth-login-email').value;
  const pass = document.getElementById('auth-login-pass').value;

  if (!email || !pass) {
    showToast('Preencha email e senha!');
    return;
  }

  // Admin login check
  if (email.toLowerCase().includes('admin')) {
    closeAuthModal();
    setUserRole('admin');
    showToast('👑 Painel Administrador autenticado!');
    return;
  }

  // Regular athlete login
  closeAuthModal();
  setUserRole('atleta');
  showToast(`⚡ Bem-vindo de volta!`);
}

function handleRegisterSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('auth-reg-name').value;
  const email = document.getElementById('auth-reg-email').value;
  const pass = document.getElementById('auth-reg-pass').value;

  if (!name || !email || !pass) {
    showToast('Preencha todos os campos!');
    return;
  }

  const newUser = {
    id: 'alu_' + Date.now(),
    name: name,
    email: email,
    role: 'atleta',
    plan: 'Anual VIP',
    status: 'active',
    joined: new Date().toLocaleDateString('pt-BR'),
    phone: '(11) 98765-0000',
    goal: 'Hipertrofia',
    weight: 75,
    height: 175,
    workoutsDone: 0,
    avatar: name.slice(0, 2).toUpperCase()
  };

  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  students.unshift(newUser);
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  closeAuthModal();
  setUserRole('atleta');
  showToast(`🎉 Conta criada com sucesso!`);
}

function handleForgotPassword() {
  const email = prompt('Digite seu e-mail cadastrado para recuperação:');
  if (email) {
    showToast(`📧 Link de recuperação enviado para ${email}!`);
  }
}

// ─── Payment Method Selection in Onboarding ───────────────────
function setOnboardingPaymentMethod(method) {
  document.querySelectorAll('.ob-pay-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`ob-pay-${method}`);
  if (btn) btn.classList.add('active');

  const pixView = document.getElementById('ob-pix-view');
  const cardView = document.getElementById('ob-card-view');

  if (pixView && cardView) {
    pixView.style.display = method === 'pix' ? 'block' : 'none';
    cardView.style.display = method === 'card' ? 'block' : 'none';
  }
}

function copyPixCode() {
  const code = '00020126580014br.gov.bcb.pix0136fitsaude-treinos-assinatura-20265204000053039865802BR5916FITSAUDE ACADEMIA6009SAO PAULO62070503***6304A1B2';
  navigator.clipboard.writeText(code).then(() => {
    showToast('📋 Código PIX copiado!');
  }).catch(() => {
    showToast('📋 Código copiado!');
  });
}

// ══════════════════════════════════════════════════════════════════
//  ADMINISTRADOR (PAINEL EXECUTIVO & DETALHES DE ALUNOS)
// ══════════════════════════════════════════════════════════════════

function renderAdminDashboard() {
  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const mrr = (activeStudents * 39.90).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalEl = document.getElementById('admin-kpi-total');
  const mrrEl = document.getElementById('admin-kpi-mrr');
  const activeEl = document.getElementById('admin-kpi-active');

  if (totalEl) totalEl.innerText = totalStudents;
  if (mrrEl) mrrEl.innerText = `R$ ${mrr}`;
  if (activeEl) activeEl.innerText = activeStudents;
}

function renderAdminAlunos(searchQuery = '') {
  const container = document.getElementById('admin-alunos-list');
  if (!container) return;

  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.plan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:30px;color:var(--txt2);">
        <i class="fa-solid fa-user-xmark" style="font-size:32px;margin-bottom:8px;opacity:0.5;"></i>
        <p>Nenhum aluno encontrado.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(s => {
    const statusLabels = {
      active: '<span class="student-status-badge active">Ativo</span>',
      pending: '<span class="student-status-badge pending">Pendente</span>',
      blocked: '<span class="student-status-badge blocked">Bloqueado</span>'
    };
    return `
      <div class="admin-student-card" onclick="openStudentDetail('${s.id}')">
        <div class="admin-student-info">
          <div class="admin-student-avatar">${s.avatar || s.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <div class="admin-student-name">${s.name}</div>
            <div class="admin-student-meta">
              <span>${s.plan}</span> • <span>${statusLabels[s.status] || s.status}</span>
            </div>
          </div>
        </div>
        <div class="admin-student-actions" onclick="event.stopPropagation()">
          <button class="btn-student-action" onclick="openStudentDetail('${s.id}')" title="Ver Detalhes">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-student-action" onclick="toggleStudentStatus('${s.id}')" title="Alternar Status">
            <i class="fa-solid fa-arrows-rotate"></i>
          </button>
          <button class="btn-student-action danger" onclick="deleteStudent('${s.id}')" title="Excluir Aluno">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ─── Modal Detalhes do Aluno (/admin/alunos/:id) ──────────────
function openStudentDetail(id) {
  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  const student = students.find(s => s.id === id);
  if (!student) return;

  const modal = document.getElementById('student-detail-modal-backdrop');
  const container = document.getElementById('student-detail-content');
  if (!modal || !container) return;

  const imc = (student.weight && student.height) 
    ? (student.weight / Math.pow(student.height / 100, 2)).toFixed(1) 
    : '23.5';

  container.innerHTML = `
    <div class="student-detail-header">
      <div class="student-detail-avatar">${student.avatar || student.name.slice(0, 2).toUpperCase()}</div>
      <div>
        <h3 style="font-family:'Outfit',sans-serif;font-size:20px;color:var(--txt);font-weight:800;">${student.name}</h3>
        <p style="font-size:12px;color:var(--txt2);">${student.email}</p>
        <div style="margin-top:4px;">
          <span class="student-status-badge ${student.status === 'active' ? 'active' : (student.status === 'pending' ? 'pending' : 'blocked')}">${student.status.toUpperCase()}</span>
        </div>
      </div>
    </div>

    <div class="student-detail-metrics">
      <div class="metric-mini-box">
        <div class="metric-mini-label">Plano</div>
        <div class="metric-mini-val" style="color:var(--red-light);">${student.plan}</div>
      </div>
      <div class="metric-mini-box">
        <div class="metric-mini-label">IMC</div>
        <div class="metric-mini-val">${imc}</div>
      </div>
      <div class="metric-mini-box">
        <div class="metric-mini-label">Treinos Feitos</div>
        <div class="metric-mini-val" style="color:var(--green);">${student.workoutsDone || 12}</div>
      </div>
    </div>

    <div class="profile-card" style="margin-bottom:14px;">
      <div class="section-label" style="padding:0;margin-bottom:10px;"><i class="fa-solid fa-address-card"></i> Informações de Cadastro</div>
      <p style="font-size:13px;color:var(--txt);margin-bottom:6px;"><strong>WhatsApp:</strong> ${student.phone || '(11) 98888-0000'}</p>
      <p style="font-size:13px;color:var(--txt);margin-bottom:6px;"><strong>Objetivo:</strong> ${student.goal || 'Hipertrofia'}</p>
      <p style="font-size:13px;color:var(--txt);"><strong>Data de Matrícula:</strong> ${student.joined || '15/01/2026'}</p>
    </div>

    <div class="form-grid-2">
      <button class="btn-save" style="background:#25D366;color:#fff;" onclick="window.open('https://wa.me/55${(student.phone||'').replace(/\\D/g,'')}', '_blank')">
        <i class="fa-brands fa-whatsapp"></i> Contato WhatsApp
      </button>
      <button class="btn-save" style="background:var(--bg3);border:1px solid var(--border);" onclick="toggleStudentStatus('${student.id}');closeStudentDetailModal();">
        <i class="fa-solid fa-arrows-rotate"></i> Alternar Status
      </button>
    </div>
  `;

  modal.classList.add('show');
}

function closeStudentDetailModal() {
  const modal = document.getElementById('student-detail-modal-backdrop');
  if (modal) modal.classList.remove('show');
}

function toggleStudentStatus(id) {
  let students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  students = students.map(s => {
    if (s.id === id) {
      s.status = s.status === 'active' ? 'blocked' : 'active';
    }
    return s;
  });
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students));
  renderAdminAlunos();
  showToast('Status do aluno atualizado!');
}

function deleteStudent(id) {
  if (!confirm('Deseja realmente remover este aluno?')) return;
  let students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  students = students.filter(s => s.id !== id);
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students));
  renderAdminAlunos();
  showToast('Aluno removido com sucesso!');
}

function openAddStudentModal() {
  const name = prompt('Nome completo do aluno:');
  if (!name) return;
  const email = prompt('E-mail do aluno:', `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`);
  if (!email) return;
  const plan = prompt('Plano (Mensal, Trimestral ou Anual VIP):', 'Anual VIP') || 'Anual VIP';

  const newStudent = {
    id: 'alu_' + Date.now(),
    name: name,
    email: email,
    plan: plan,
    status: 'active',
    joined: new Date().toLocaleDateString('pt-BR'),
    phone: '(11) 98888-0000',
    goal: 'Hipertrofia',
    weight: 75,
    height: 175,
    workoutsDone: 0,
    avatar: name.slice(0, 2).toUpperCase()
  };

  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  students.unshift(newStudent);
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students));
  renderAdminAlunos();
  showToast(`✅ Aluno ${name} cadastrado!`);
}

function renderAdminAssinaturas() {
  const container = document.getElementById('admin-assinaturas-list');
  if (!container) return;

  const subs = JSON.parse(localStorage.getItem(SUBSCRIPTIONS_DB_KEY) || '[]');
  container.innerHTML = subs.map(sub => `
    <div class="admin-student-card">
      <div class="admin-student-info">
        <div class="admin-student-avatar" style="color:var(--green);"><i class="fa-solid fa-receipt"></i></div>
        <div>
          <div class="admin-student-name">${sub.student}</div>
          <div class="admin-student-meta">
            <span>${sub.plan}</span> • <span>${sub.method}</span> • <strong>${sub.val}</strong>
          </div>
        </div>
      </div>
      <div>
        <span class="student-status-badge ${sub.status === 'Paga' ? 'active' : 'pending'}">${sub.status}</span>
      </div>
    </div>
  `).join('');
}

function renderAdminConfig() {
  const config = JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY) || JSON.stringify(DEFAULT_ADMIN_CONFIG));
  const nameInput = document.getElementById('cfg-gym-name');
  const phoneInput = document.getElementById('cfg-gym-phone');
  const modelInput = document.getElementById('cfg-groq-model');

  if (nameInput) nameInput.value = config.gymName || '';
  if (phoneInput) phoneInput.value = config.gymPhone || '';
  if (modelInput) modelInput.value = config.groqModel || 'Llama 3.3 70B Versatile';
}

function saveAdminConfig() {
  const nameInput = document.getElementById('cfg-gym-name');
  const phoneInput = document.getElementById('cfg-gym-phone');
  const modelInput = document.getElementById('cfg-groq-model');

  const config = {
    gymName: nameInput ? nameInput.value : 'FitSaúde',
    gymPhone: phoneInput ? phoneInput.value : '(11) 98888-7777',
    groqModel: modelInput ? modelInput.value : 'Llama 3.3 70B Versatile',
    planPrices: { mensal: 49.90, trimestral: 39.90, anual: 29.90 }
  };

  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(config));
  showToast('💾 Configurações salvas!');
}

function exportAdminReport(type = 'pdf') {
  if (type === 'pdf' && window.jspdf) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('FITSAÚDE - RELATÓRIO ADMINISTRATIVO GERAL', 14, 20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, 14, 28);
    
    const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
    const rows = students.map((s, idx) => [idx + 1, s.name, s.email, s.plan, s.status.toUpperCase(), s.joined]);

    if (doc.autoTable) {
      doc.autoTable({
        startY: 35,
        head: [['#', 'Nome do Aluno', 'E-mail', 'Plano', 'Status', 'Cadastro']],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [255, 26, 75] }
      });
    }

    doc.save('FitSaude_Relatorio_Geral.pdf');
    showToast('📄 Relatório Administrativo baixado!');
  } else {
    alert('Exportação concluída!');
  }
}

// ─── Security & Account ───────────────────────────────────────
function handleChangePassword() {
  const newPass = prompt('Digite sua nova senha:');
  if (newPass && newPass.length >= 6) {
    showToast('🔒 Senha alterada com sucesso!');
  } else if (newPass) {
    showToast('A senha deve ter pelo menos 6 caracteres.');
  }
}

function handleLogout() {
  setUserRole('visitante');
  showToast('👋 Sessão encerrada.');
}
