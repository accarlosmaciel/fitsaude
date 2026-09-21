/* ══════════════════════════════════════════════════════════════════
   FITSAÚDE - SISTEMA MULTIUSUÁRIO, CONTROLE DE ROLES & ADMIN
   Visitante (Landing / 7 Dias Grátis) | Atleta (WebApp) | Super Admin
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
  { id: 'alu_1', name: 'Carlos Maciel', email: 'carlos@fitsaude.com', plan: 'FitSaúde', status: 'active', subscription_status: 'ACTIVE', joined: '15/01/2026', phone: '(62) 99439-0943', goal: 'Hipertrofia', weight: 78, height: 178, workoutsDone: 34, avatar: 'CM' },
  { id: 'alu_2', name: 'Mariana Silva', email: 'mariana.silva@email.com', plan: 'FitSaúde', status: 'active', subscription_status: 'TRIAL', joined: '28/08/2026', phone: '(11) 97654-3210', goal: 'Emagrecimento', weight: 62, height: 165, workoutsDone: 5, avatar: 'MS' },
  { id: 'alu_3', name: 'Lucas Oliveira', email: 'lucas.treino@email.com', plan: 'FitSaúde', status: 'pending', subscription_status: 'PENDING_PAYMENT', joined: '29/08/2026', phone: '(21) 99887-1122', goal: 'Definição', weight: 82, height: 180, workoutsDone: 8, avatar: 'LO' },
  { id: 'alu_4', name: 'Beatriz Costa', email: 'beatriz.c@email.com', plan: 'FitSaúde', status: 'active', subscription_status: 'ACTIVE', joined: '20/12/2025', phone: '(31) 98444-5566', goal: 'Condicionamento', weight: 58, height: 162, workoutsDone: 49, avatar: 'BC' },
  { id: 'alu_5', name: 'Rafael Santos', email: 'rafa.santos@email.com', plan: 'FitSaúde', status: 'blocked', subscription_status: 'EXPIRED', joined: '10/05/2026', phone: '(41) 99112-3344', goal: 'Força', weight: 90, height: 185, workoutsDone: 15, avatar: 'RS' }
];

const DEFAULT_ADMIN_CONFIG = {
  gymName: 'FitSaúde Club & Training',
  gymPhone: '(62) 99439-0943',
  pixKey: '5f038f67-9fd9-44fc-8c50-b94e8c79e172',
  groqModel: 'Llama 3.3 70B Versatile',
  planPrice: 29.90,
  autoRenew: true
};

// Current Session State
let currentUserRole = localStorage.getItem(ROLES_STORAGE_KEY) || 'visitante';
let selectedOnboardingPlan = { name: 'FitSaúde', price: 'R$ 29,90/mês' };
let temporaryUserData = null;

// Initialize System on load
function initRolesSystem() {
  if (!localStorage.getItem(STUDENTS_DB_KEY)) {
    localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(DEFAULT_STUDENTS));
  }
  if (!localStorage.getItem(ADMIN_CONFIG_KEY)) {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(DEFAULT_ADMIN_CONFIG));
  }
  if (!localStorage.getItem(CURRENT_USER_KEY)) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
      id: 'alu_1',
      name: 'Carlos Maciel',
      email: 'carlos@fitsaude.com',
      role: 'atleta',
      plan: 'FitSaúde',
      subscription_status: 'ACTIVE',
      memberSince: '15/01/2026'
    }));
  }

  // Inicializar assinaturas mock para usuários padrão se não existirem
  DEFAULT_STUDENTS.forEach(s => {
    if (typeof getUserSubscription === 'function') {
      const sub = getUserSubscription(s.id);
      if (s.subscription_status) {
        sub.status = s.subscription_status;
        sub.student_name = s.name;
        sub.email = s.email;
        sub.phone = s.phone;
        if (s.subscription_status === 'ACTIVE') {
          const nextMonth = new Date(Date.now() + 25 * 24 * 60 * 60 * 1000);
          sub.subscription_expires_at = nextMonth.toISOString();
          sub.last_payment_at = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
        } else if (s.subscription_status === 'TRIAL') {
          sub.trial_ends_at = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
        } else if (s.subscription_status === 'EXPIRED') {
          sub.subscription_expires_at = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
        }
        if (typeof saveUserSubscription === 'function') saveUserSubscription(sub);
      }
    }
  });

  // Handle URL Hash routing
  handleHashRouting();
  window.addEventListener('hashchange', handleHashRouting);

  // Set the active role view
  setUserRole(currentUserRole, true);
}

// Auto-run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRolesSystem);
} else {
  initRolesSystem();
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
    if (sub === 'assinatura') switchRoleScreen('atleta-assinatura');
    else if (sub === 'seguranca') switchRoleScreen('atleta-seguranca');
    else if (sub) switchRoleScreen(sub);
    else switchRoleScreen('treinos');
  } else if (section === 'admin') {
    setUserRole('admin', true);
    if (sub === 'alunos' && param) {
      switchRoleScreen('admin-alunos');
      openStudentDetail(param);
    } else if (sub === 'pendentes') {
      switchRoleScreen('admin-pendentes');
    } else if (sub === 'configuracoes' || sub === 'config') {
      switchRoleScreen('admin-config');
    } else if (sub) {
      switchRoleScreen('admin-' + sub);
    } else {
      switchRoleScreen('admin-dashboard');
    }
  }
}

// ─── Controle de Visibilidade dos Botões de Role (Apenas Admin) ───
function isCurrentSessionAdmin() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
  } catch (e) {}
  return currentUserRole === 'admin' || (user && (user.role === 'admin' || user.email === 'accarlosmaciel@gmail.com'));
}

function updateRoleTopBar() {
  const topBar = document.getElementById('role-top-bar');
  const quickSelect = document.getElementById('role-quick-select');
  if (!topBar) return;

  const isAdmin = isCurrentSessionAdmin();

  if (isAdmin) {
    topBar.style.display = 'flex';
    topBar.classList.add('is-admin');
    if (quickSelect) quickSelect.style.display = 'flex';
  } else {
    topBar.style.display = 'none';
    topBar.classList.remove('is-admin');
    if (quickSelect) quickSelect.style.display = 'none';
  }
}

// Atalho secreto: 5 toques no cabeçalho para abrir acesso admin se necessário
let headerSecretClicks = 0;
let headerSecretTimer = null;
function handleHeaderSecretClick() {
  headerSecretClicks++;
  clearTimeout(headerSecretTimer);
  headerSecretTimer = setTimeout(() => {
    headerSecretClicks = 0;
  }, 2000);

  if (headerSecretClicks >= 5) {
    headerSecretClicks = 0;
    if (isCurrentSessionAdmin()) {
      setUserRole(currentUserRole === 'admin' ? 'atleta' : 'admin');
    } else {
      openAuthModal('login');
      showToast('👑 Área de Acesso Administrativo', '<i class="fa-solid fa-crown"></i>');
    }
  }
}
window.handleHeaderSecretClick = handleHeaderSecretClick;
window.isCurrentSessionAdmin = isCurrentSessionAdmin;
window.updateRoleTopBar = updateRoleTopBar;

// ─── Set Role & Re-render Interface ───────────────────────────
function setUserRole(role, silent = false) {
  currentUserRole = role;
  localStorage.setItem(ROLES_STORAGE_KEY, role);

  if (role === 'admin') {
    let u = null;
    try { u = JSON.parse(localStorage.getItem(CURRENT_USER_KEY)); } catch(e) {}
    if (!u || u.role !== 'admin') {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
        id: '1',
        level: 1,
        name: 'Carlos Maciel',
        email: 'accarlosmaciel@gmail.com',
        role: 'admin',
        plan: 'FitSaúde (Super Admin)',
        status: 'active',
        avatar: '👑',
        memberSince: new Date().toLocaleDateString('pt-BR')
      }));
    }
  }

  // Apenas o Administrador pode visualizar a barra com botões de roles
  updateRoleTopBar();

  // Update top-bar badge
  const badge = document.getElementById('current-role-badge');
  if (badge) {
    badge.className = `role-badge-current role-badge-${role}`;
    const labels = {
      visitante: '<i class="fa-solid fa-eye"></i> Visitante',
      atleta: '<i class="fa-solid fa-dumbbell"></i> Atleta',
      admin: '<i class="fa-solid fa-crown"></i> Super Admin'
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
      admin: '👑 Painel Super Admin do FitSaúde' 
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
        <span class="nav-label">Oferta</span>
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
      <button class="nav-btn" id="nav-admin-pendentes" onclick="switchRoleScreen('admin-pendentes')">
        <span class="nav-icon"><i class="fa-solid fa-clock-rotate-left"></i></span>
        <span class="nav-label">Pendentes</span>
      </button>
      <button class="nav-btn" id="nav-admin-treinos" onclick="switchRoleScreen('admin-treinos')">
        <span class="nav-icon"><i class="fa-solid fa-dumbbell"></i></span>
        <span class="nav-label">Treinos</span>
      </button>
      <button class="nav-btn" id="nav-admin-assinaturas" onclick="switchRoleScreen('admin-assinaturas')">
        <span class="nav-icon"><i class="fa-solid fa-credit-card"></i></span>
        <span class="nav-label">Finanças</span>
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
    'visitante-planos': 'Oferta <span>FitSaúde</span>',
    'treinos': 'Fit<span>Saúde</span>',
    'planilhas': 'Planilhas <span>Treinos</span>',
    'resumo': 'Resumo <span>Semanal</span>',
    'chat': 'FitBot <span>IA</span>',
    'perfil': 'Perfil <span>Atleta</span>',
    'atleta-assinatura': 'Minha <span>Assinatura</span>',
    'atleta-seguranca': 'Segurança & <span>Acesso</span>',
    'admin-dashboard': 'Super <span>Admin</span>',
    'admin-alunos': 'Gestão de <span>Alunos</span>',
    'admin-pendentes': 'Pagamentos <span>Pendentes</span>',
    'admin-treinos': 'Treinos <span>Academia</span>',
    'admin-planilhas': 'Relatórios & <span>Planilhas</span>',
    'admin-assinaturas': 'Gestão <span>Financeira</span>',
    'admin-config': 'Configurações <span>Gerais</span>'
  };

  const icons = {
    'visitante-landing': '<img src="images/logo.png" alt="FitSaúde" class="app-header-logo-img" />',
    'visitante-planos': '<i class="fa-solid fa-tags"></i>',
    'treinos': '<img src="images/logo.png" alt="FitSaúde" class="app-header-logo-img" />',
    'planilhas': '<i class="fa-solid fa-table-list"></i>',
    'resumo': '<i class="fa-solid fa-chart-pie"></i>',
    'chat': '<i class="fa-solid fa-robot"></i>',
    'perfil': '<i class="fa-solid fa-user"></i>',
    'atleta-assinatura': '<i class="fa-solid fa-credit-card"></i>',
    'atleta-seguranca': '<i class="fa-solid fa-shield-halved"></i>',
    'admin-dashboard': '<i class="fa-solid fa-chart-line"></i>',
    'admin-alunos': '<i class="fa-solid fa-users"></i>',
    'admin-pendentes': '<i class="fa-solid fa-clock-rotate-left"></i>',
    'admin-treinos': '<img src="images/logo.png" alt="FitSaúde" class="app-header-logo-img" />',
    'admin-planilhas': '<i class="fa-solid fa-file-pdf"></i>',
    'admin-assinaturas': '<i class="fa-solid fa-credit-card"></i>',
    'admin-config': '<i class="fa-solid fa-gear"></i>'
  };

  if (headerTitle && titles[screenId]) headerTitle.innerHTML = titles[screenId];
  if (headerIcon && icons[screenId]) headerIcon.innerHTML = icons[screenId];

  // Call relevant screen renderers
  if (screenId === 'treinos' && typeof render === 'function') render();
  if (screenId === 'planilhas' && typeof renderPlanilhas === 'function') renderPlanilhas();
  if (screenId === 'resumo' && typeof renderSummary === 'function') renderSummary();
  if (screenId === 'chat') {
    const badge = document.getElementById('chat-badge');
    if (badge) badge.classList.remove('show');
    if (typeof scrollChat === 'function') setTimeout(scrollChat, 100);
  }
  if (screenId === 'perfil' && typeof renderProfileForm === 'function') renderProfileForm();
  if (screenId === 'atleta-assinatura' && typeof renderAthleteSubscriptionScreen === 'function') renderAthleteSubscriptionScreen();
  if (screenId === 'admin-dashboard') renderAdminDashboard();
  if (screenId === 'admin-alunos') renderAdminAlunos();
  if (screenId === 'admin-pendentes') renderAdminPendingPayments();
  if (screenId === 'admin-assinaturas') renderAdminAssinaturas();
  if (screenId === 'admin-config') renderAdminConfig();

  // Paywall check
  if (typeof checkPaywallGate === 'function') checkPaywallGate();

  const headerBtn = document.getElementById('header-action-btn');
  if (headerBtn) headerBtn.style.display = (screenId === 'treinos' || screenId === 'admin-treinos') ? '' : 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global window exposure
window.setUserRole = setUserRole;
window.switchRoleScreen = switchRoleScreen;
window.switchScreen = switchRoleScreen;
window.startOnboardingFunnel = startOnboardingFunnel;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.openStudentDetail = openStudentDetail;
window.closeStudentDetailModal = closeStudentDetailModal;

// ══════════════════════════════════════════════════════════════════
//  FLUXO DO VISITANTE — 7 DIAS GRÁTIS
// ══════════════════════════════════════════════════════════════════

function startOnboardingFunnel() {
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
  document.querySelectorAll('.step-node').forEach((node, idx) => {
    node.classList.remove('active', 'done');
    if (idx + 1 === step) node.classList.add('active');
    else if (idx + 1 < step) node.classList.add('done');
  });

  document.getElementById('ob-step-1').style.display = step === 1 ? 'block' : 'none';
  document.getElementById('ob-step-2').style.display = step === 2 ? 'block' : 'none';
  document.getElementById('ob-step-3').style.display = step === 3 ? 'block' : 'none';
}

function handleOnboardingStep1Submit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('ob-name').value;
  const email = document.getElementById('ob-email').value;
  const phone = document.getElementById('ob-phone') ? document.getElementById('ob-phone').value : '';
  const goal = document.getElementById('ob-goal') ? document.getElementById('ob-goal').value : 'Hipertrofia';

  if (!name || !email) {
    showToast('Por favor, preencha todos os campos obrigatórios!');
    return;
  }

  // Criação da conta com 7 dias de TRIAL automático
  const res = registerNewTrialUser(name, email, phone, goal);
  temporaryUserData = res.user;

  // Atualizar dados na tela de sucesso
  const successName = document.getElementById('ob-success-user-name');
  if (successName) successName.innerText = name.split(' ')[0];

  setOnboardingStep(3);
  if (typeof confetti === 'function') confetti();
  showToast('🎉 Conta criada! Seus 7 dias de teste grátis começaram!');
}

function enterWebAppAsAthlete() {
  closeOnboardingModal();
  setUserRole('atleta');
  switchRoleScreen('treinos');
  showToast(`⚡ Bem-vindo ao FitSaúde! Aproveite seus 7 dias grátis!`);
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

async function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('auth-login-email');
  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const pass = document.getElementById('auth-login-pass')?.value || '';

  if (!email) {
    showToast('Preencha o seu e-mail!');
    return;
  }

  // Super Admin Level 1 Check (accarlosmaciel@gmail.com)
  const isSuperAdmin = email === 'accarlosmaciel@gmail.com' || email.includes('admin');

  if (isSuperAdmin) {
    const adminUser = {
      id: '1',
      level: 1,
      name: 'Carlos Maciel',
      email: 'accarlosmaciel@gmail.com',
      role: 'admin',
      plan: 'FitSaúde (Super Admin)',
      status: 'active',
      avatar: '👑',
      memberSince: new Date().toLocaleDateString('pt-BR')
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
    closeAuthModal();
    setUserRole('admin');
    showToast('👑 Bem-vindo, Super Administrador!');
    return;
  }

  // Regular athlete login
  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  let foundStudent = students.find(s => s.email.toLowerCase() === email);

  if (!foundStudent) {
    // Se não existir, cadastrar automaticamente com 7 dias de trial
    const res = registerNewTrialUser(email.split('@')[0], email, '', 'Hipertrofia');
    foundStudent = res.user;
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundStudent));
  }

  closeAuthModal();
  setUserRole('atleta');
  showToast(`⚡ Bem-vindo(a) de volta!`);
}

function handleRegisterSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('auth-reg-name')?.value;
  const email = document.getElementById('auth-reg-email')?.value;
  const phone = document.getElementById('auth-reg-phone')?.value || '';

  if (!name || !email) {
    showToast('Preencha os campos obrigatórios!');
    return;
  }

  registerNewTrialUser(name, email, phone, 'Hipertrofia');
  closeAuthModal();
  setUserRole('atleta');
  showToast(`🎉 7 Dias Grátis ativados com sucesso!`);
}

function handleForgotPasswordSubmit(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('auth-forgot-email');
  const email = emailInput ? emailInput.value : '';
  if (!email) {
    showToast('Informe o seu e-mail!');
    return;
  }
  showToast(`📧 Link de recuperação enviado para ${email}!`);
  if (emailInput) emailInput.value = '';
  setTimeout(() => {
    switchAuthTab('login');
  }, 1200);
}

// ══════════════════════════════════════════════════════════════════
//  SUPER ADMIN — DASHBOARD & GESTÃO DE PAGAMENTOS
// ══════════════════════════════════════════════════════════════════

function renderAdminDashboard() {
  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  const pendingPayments = JSON.parse(localStorage.getItem(PENDING_PAYMENTS_KEY) || '[]');
  const now = new Date();

  let trialCount = 0;
  let activeCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;

  students.forEach(s => {
    const sub = typeof getUserSubscription === 'function' ? getUserSubscription(s.id) : null;
    if (!sub) return;

    if (sub.status === 'TRIAL') {
      trialCount++;
    } else if (sub.status === 'ACTIVE') {
      activeCount++;
      if (sub.subscription_expires_at) {
        const exp = new Date(sub.subscription_expires_at);
        const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
        if (diffDays <= 3 && diffDays >= 0) expiringSoonCount++;
      }
    } else if (sub.status === 'EXPIRED') {
      expiredCount++;
    }
  });

  const pendingCount = pendingPayments.length;
  const totalStudents = students.length;
  const mrr = (activeCount * 29.90).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Update DOM Elements
  const totalEl = document.getElementById('admin-kpi-total');
  const trialEl = document.getElementById('admin-kpi-trial');
  const activeEl = document.getElementById('admin-kpi-active');
  const expiringEl = document.getElementById('admin-kpi-expiring');
  const pendingEl = document.getElementById('admin-kpi-pending');
  const expiredEl = document.getElementById('admin-kpi-expired');
  const mrrEl = document.getElementById('admin-kpi-mrr');

  if (totalEl) totalEl.innerText = totalStudents;
  if (trialEl) trialEl.innerText = trialCount;
  if (activeEl) activeEl.innerText = activeCount;
  if (expiringEl) expiringEl.innerText = expiringSoonCount;
  if (pendingEl) pendingEl.innerText = pendingCount;
  if (expiredEl) expiredEl.innerText = expiredCount;
  if (mrrEl) mrrEl.innerText = `R$ ${mrr}`;
}

/**
 * Renderiza a lista de Pagamentos Pendentes no Admin
 */
function renderAdminPendingPayments() {
  const container = document.getElementById('admin-pending-payments-list');
  if (!container) return;

  const pendingList = JSON.parse(localStorage.getItem(PENDING_PAYMENTS_KEY) || '[]');

  if (pendingList.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:36px;color:var(--txt2);background:var(--bg2);border-radius:var(--r-lg);border:1px solid var(--border);">
        <i class="fa-solid fa-circle-check" style="font-size:36px;color:var(--green);margin-bottom:10px;opacity:0.8;"></i>
        <h4 style="font-size:16px;color:var(--txt);font-weight:700;margin-bottom:4px;">Nenhum pagamento pendente!</h4>
        <p style="font-size:12px;">Todos os comprovantes enviados foram aprovados e liberados.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pendingList.map(item => `
    <div class="admin-pending-card" style="background:var(--bg2);border:1px solid rgba(255,209,102,0.3);border-radius:var(--r-lg);padding:16px;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
        <div>
          <h4 style="font-family:'Outfit',sans-serif;font-size:16px;font-weight:800;color:var(--txt);margin-bottom:2px;">
            ${item.student_name}
          </h4>
          <div style="font-size:12px;color:var(--txt2);">${item.student_email} • ${item.student_phone || 'Sem telefone'}</div>
        </div>
        <span style="background:rgba(255,209,102,0.15);color:var(--yellow);padding:4px 10px;border-radius:12px;font-size:11px;font-weight:800;">
          <i class="fa-solid fa-hourglass-half"></i> AGUARDANDO LIBERAÇÃO
        </span>
      </div>

      <div style="background:var(--bg3);padding:10px 14px;border-radius:var(--r-md);margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <span style="font-size:11px;color:var(--txt2);display:block;">Plano & Valor:</span>
          <strong style="font-size:14px;color:var(--green);">${item.plan} — ${item.amount_formatted}</strong>
        </div>
        <div>
          <span style="font-size:11px;color:var(--txt2);display:block;">Data Solicitação:</span>
          <span style="font-size:12px;color:var(--txt);">${new Date(item.requested_at).toLocaleDateString('pt-BR')} ${new Date(item.requested_at).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      <div style="font-size:11px;color:var(--txt2);margin-bottom:12px;">
        <strong>Observação:</strong> ${item.notes || 'Comprovante enviado pelo usuário'}
      </div>

      <div class="form-grid-2">
        <button class="btn-save" style="background:#25D366;color:#060608;font-weight:800;padding:12px;" onclick="approvePaymentByAdmin('${item.id}')">
          <i class="fa-solid fa-check"></i> CONFIRMAR PAGAMENTO (+30 Dias)
        </button>
        <button class="btn-save" style="background:rgba(37,211,102,0.15);color:#25D366;border:1px solid rgba(37,211,102,0.3);font-size:12px;" onclick="openWhatsAppChat('${item.student_phone}')">
          <i class="fa-brands fa-whatsapp"></i> Conversar no WhatsApp
        </button>
      </div>
    </div>
  `).join('');
}

function openWhatsAppChat(phone) {
  const cleanPhone = (phone || OFFICIAL_WHATSAPP_NUMBER).replace(/\D/g, '');
  const finalPhone = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone;
  window.open(`https://api.whatsapp.com/send?phone=${finalPhone}`, '_blank');
}

function renderAdminAlunos(searchQuery = '') {
  const container = document.getElementById('admin-alunos-list');
  if (!container) return;

  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.plan || '').toLowerCase().includes(searchQuery.toLowerCase())
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
    const sub = typeof getUserSubscription === 'function' ? getUserSubscription(s.id) : null;
    const subStatus = sub ? sub.status : (s.subscription_status || 'TRIAL');

    const statusLabels = {
      TRIAL: '<span class="student-status-badge" style="background:rgba(167,139,250,0.15);color:#a78bfa;"><i class="fa-solid fa-clock"></i> 7 Dias Trial</span>',
      ACTIVE: '<span class="student-status-badge active"><i class="fa-solid fa-check"></i> Ativo</span>',
      PENDING_PAYMENT: '<span class="student-status-badge pending"><i class="fa-solid fa-hourglass-half"></i> Pgto Pendente</span>',
      EXPIRED: '<span class="student-status-badge blocked"><i class="fa-solid fa-triangle-exclamation"></i> Expirado</span>',
      BLOCKED: '<span class="student-status-badge blocked"><i class="fa-solid fa-ban"></i> Bloqueado</span>'
    };

    return `
      <div class="admin-student-card" onclick="openStudentDetail('${s.id}')">
        <div class="admin-student-info">
          <div class="admin-student-avatar">${s.avatar || s.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <div class="admin-student-name">${s.name}</div>
            <div class="admin-student-meta">
              <span>FitSaúde (R$ 29,90)</span> • <span>${statusLabels[subStatus] || subStatus}</span>
            </div>
          </div>
        </div>
        <div class="admin-student-actions" onclick="event.stopPropagation()">
          <button class="btn-student-action" onclick="openStudentDetail('${s.id}')" title="Ver Detalhes">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-student-action" onclick="sendWhatsAppReminderSequence('${s.id}')" title="Cobrança WhatsApp">
            <i class="fa-brands fa-whatsapp" style="color:#25D366;"></i>
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

  const sub = typeof getUserSubscription === 'function' ? getUserSubscription(id) : null;
  const modal = document.getElementById('student-detail-modal-backdrop');
  const container = document.getElementById('student-detail-content');
  if (!modal || !container) return;

  const expiryText = sub && sub.subscription_expires_at ? new Date(sub.subscription_expires_at).toLocaleDateString('pt-BR') : (sub && sub.trial_ends_at ? new Date(sub.trial_ends_at).toLocaleDateString('pt-BR') + ' (Trial)' : '—');

  container.innerHTML = `
    <div class="student-detail-header">
      <div class="student-detail-avatar">${student.avatar || student.name.slice(0, 2).toUpperCase()}</div>
      <div>
        <h3 style="font-family:'Outfit',sans-serif;font-size:20px;color:var(--txt);font-weight:800;">${student.name}</h3>
        <p style="font-size:12px;color:var(--txt2);">${student.email}</p>
        <div style="margin-top:4px;">
          <span class="student-status-badge active">${(sub ? sub.status : 'TRIAL').toUpperCase()}</span>
        </div>
      </div>
    </div>

    <div class="student-detail-metrics">
      <div class="metric-mini-box">
        <div class="metric-mini-label">Plano</div>
        <div class="metric-mini-val" style="color:var(--red-light);">FitSaúde (R$ 29,90)</div>
      </div>
      <div class="metric-mini-box">
        <div class="metric-mini-label">Vencimento</div>
        <div class="metric-mini-val">${expiryText}</div>
      </div>
      <div class="metric-mini-box">
        <div class="metric-mini-label">Treinos Feitos</div>
        <div class="metric-mini-val" style="color:var(--green);">${student.workoutsDone || 0}</div>
      </div>
    </div>

    <div class="profile-card" style="margin-bottom:14px;">
      <div class="section-label" style="padding:0;margin-bottom:10px;"><i class="fa-solid fa-address-card"></i> Informações Cadastrais</div>
      <p style="font-size:13px;color:var(--txt);margin-bottom:6px;"><strong>WhatsApp:</strong> ${student.phone || '(62) 99439-0943'}</p>
      <p style="font-size:13px;color:var(--txt);margin-bottom:6px;"><strong>Objetivo:</strong> ${student.goal || 'Hipertrofia'}</p>
      <p style="font-size:13px;color:var(--txt);"><strong>Data de Cadastro:</strong> ${student.joined || 'Hoje'}</p>
    </div>

    <!-- Ações de Cobrança / Régua WhatsApp -->
    <div style="background:rgba(37, 211, 102, 0.08);border:1px solid rgba(37, 211, 102, 0.25);border-radius:var(--r-lg);padding:14px;margin-bottom:14px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <span style="font-size:12px;font-weight:700;color:#25D366;"><i class="fa-brands fa-whatsapp"></i> Comunicação & Cobrança</span>
        <span style="font-size:10px;background:rgba(37,211,102,0.18);color:#25D366;padding:2px 8px;border-radius:10px;font-weight:800;">OFICIAL</span>
      </div>
      <p style="font-size:11px;color:var(--txt2);line-height:1.4;margin-bottom:10px;">Enviar mensagem da régua de relacionamento ou aviso de cobrança diretamente no WhatsApp do aluno.</p>
      <div class="form-grid-2">
        <button class="btn-save" style="background:#25D366;color:#060608;font-weight:800;font-size:12px;padding:10px;" onclick="sendWhatsAppReminderSequence('${student.id}')">
          <i class="fa-solid fa-paper-plane"></i> Enviar Cobrança PIX
        </button>
        <button class="btn-save" style="background:var(--bg3);border:1px solid var(--border);font-size:12px;padding:10px;" onclick="grant30DaysToStudent('${student.id}')">
          <i class="fa-solid fa-calendar-plus"></i> +30 Dias Manual
        </button>
      </div>
    </div>

    <div class="form-grid-2">
      <button class="btn-save" style="background:var(--bg3);border:1px solid var(--border);" onclick="toggleStudentStatus('${student.id}');closeStudentDetailModal();">
        <i class="fa-solid fa-arrows-rotate"></i> Alternar Bloqueio
      </button>
      <button class="btn-reset" style="background:rgba(255,26,75,0.12);color:var(--red-light);border-color:var(--border-red);" onclick="deleteStudent('${student.id}');closeStudentDetailModal();">
        <i class="fa-solid fa-trash"></i> Excluir Aluno
      </button>
    </div>
  `;

  modal.classList.add('show');
}

function sendWhatsAppReminderSequence(studentId) {
  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  const phone = (student.phone || OFFICIAL_WHATSAPP_NUMBER).replace(/\D/g, '');
  const studentName = student.name ? student.name.split(' ')[0] : 'Aluno FitSaúde';

  const message = `Olá, ${studentName}! 👋\n\nIdentificamos que sua assinatura do plano *FitSaúde (R$ 29,90/mês)* precisa ser confirmada/renovada.\n\n🔑 *Chave PIX:* ${OFFICIAL_PIX_KEY}\n💰 *Valor:* R$ 29,90\n\nAssim que realizar o PIX, basta responder com o comprovante para liberação de mais 30 dias!\n\nFitSaúde agradece! 💪`;

  const url = `https://api.whatsapp.com/send?phone=${phone.startsWith('55') ? phone : '55' + phone}&text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  showToast(`📲 Cobrança PIX gerada para ${studentName}!`);
}

function grant30DaysToStudent(studentId) {
  if (typeof getUserSubscription === 'function') {
    const sub = getUserSubscription(studentId);
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    sub.status = 'ACTIVE';
    sub.subscription_expires_at = nextMonth.toISOString();
    sub.last_payment_at = now.toISOString();
    sub.next_payment_at = nextMonth.toISOString();
    if (typeof saveUserSubscription === 'function') saveUserSubscription(sub);

    showToast('✅ +30 dias concedidos manualmente com sucesso!');
    closeStudentDetailModal();
    renderAdminAlunos();
    renderAdminDashboard();
  }
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
  renderAdminDashboard();
  showToast('Aluno removido com sucesso!');
}

function openAddStudentModal() {
  const modal = document.getElementById('add-student-modal-backdrop');
  if (modal) modal.classList.add('show');
}

function closeAddStudentModal() {
  const modal = document.getElementById('add-student-modal-backdrop');
  if (modal) modal.classList.remove('show');
}

function handleAddStudentSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('add-stu-name')?.value;
  const email = document.getElementById('add-stu-email')?.value;
  const phone = document.getElementById('add-stu-phone')?.value;
  const goal = document.getElementById('add-stu-goal')?.value || 'Hipertrofia';

  if (!name || !email) {
    showToast('Preencha os campos obrigatórios!');
    return;
  }

  registerNewTrialUser(name, email, phone, goal);
  closeAddStudentModal();
  renderAdminAlunos();
  renderAdminDashboard();
  showToast(`✅ Aluno ${name} cadastrado com 7 dias grátis!`);
}

function renderAdminAssinaturas() {
  const container = document.getElementById('admin-assinaturas-list');
  if (!container) return;

  const history = JSON.parse(localStorage.getItem('fitsaude_payment_history_v3') || '[]');

  if (history.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:30px;color:var(--txt2);">
        <i class="fa-solid fa-receipt" style="font-size:32px;margin-bottom:8px;opacity:0.5;"></i>
        <p>Nenhuma transação aprovada registrada no histórico.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = history.map((sub, i) => `
    <div class="admin-student-card">
      <div class="admin-student-info">
        <div class="admin-student-avatar" style="color:var(--green);"><i class="fa-solid fa-receipt"></i></div>
        <div>
          <div class="admin-student-name">${sub.student_name}</div>
          <div class="admin-student-meta">
            <span>${sub.plan}</span> • <span>${sub.payment_method}</span> • <strong>${sub.amount_formatted}</strong>
          </div>
        </div>
      </div>
      <div>
        <span class="student-status-badge active">${sub.status}</span>
      </div>
    </div>
  `).join('');
}

function renderAdminConfig() {
  const config = JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY) || JSON.stringify(DEFAULT_ADMIN_CONFIG));
  const nameInput = document.getElementById('cfg-gym-name');
  const phoneInput = document.getElementById('cfg-gym-phone');
  const pixInput = document.getElementById('cfg-gym-pix');
  const modelInput = document.getElementById('cfg-groq-model');

  if (nameInput) nameInput.value = config.gymName || 'FitSaúde';
  if (phoneInput) phoneInput.value = config.gymPhone || '(62) 99439-0943';
  if (pixInput) pixInput.value = config.pixKey || '5f038f67-9fd9-44fc-8c50-b94e8c79e172';
  if (modelInput) modelInput.value = config.groqModel || 'Llama 3.3 70B Versatile';
}

function saveAdminConfig() {
  const nameInput = document.getElementById('cfg-gym-name');
  const phoneInput = document.getElementById('cfg-gym-phone');
  const pixInput = document.getElementById('cfg-gym-pix');
  const modelInput = document.getElementById('cfg-groq-model');

  const config = {
    gymName: nameInput ? nameInput.value : 'FitSaúde',
    gymPhone: phoneInput ? phoneInput.value : '(62) 99439-0943',
    pixKey: pixInput ? pixInput.value : '5f038f67-9fd9-44fc-8c50-b94e8c79e172',
    groqModel: modelInput ? modelInput.value : 'Llama 3.3 70B Versatile',
    planPrice: 29.90
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
    const rows = students.map((s, idx) => [idx + 1, s.name, s.email, 'FitSaúde (R$ 29,90)', (s.subscription_status || s.status).toUpperCase(), s.joined]);

    if (doc.autoTable) {
      doc.autoTable({
        startY: 35,
        head: [['#', 'Nome do Aluno', 'E-mail', 'Plano', 'Status', 'Cadastro']],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [220, 20, 60] }
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
  const currPass = document.getElementById('sec-curr-pass')?.value;
  const newPass = document.getElementById('sec-new-pass')?.value;
  const confPass = document.getElementById('sec-conf-pass')?.value;

  if (!currPass || !newPass || !confPass) {
    showToast('Preencha todos os campos de senha!');
    return;
  }

  if (newPass.length < 6) {
    showToast('A nova senha deve ter pelo menos 6 caracteres!');
    return;
  }

  if (newPass !== confPass) {
    showToast('As senhas não coincidem!');
    return;
  }

  if (document.getElementById('sec-curr-pass')) document.getElementById('sec-curr-pass').value = '';
  if (document.getElementById('sec-new-pass')) document.getElementById('sec-new-pass').value = '';
  if (document.getElementById('sec-conf-pass')) document.getElementById('sec-conf-pass').value = '';

  showToast('🔒 Senha atualizada com sucesso!');
}

function handleLogout() {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.setItem(ROLES_STORAGE_KEY, 'visitante');
  currentUserRole = 'visitante';
  updateRoleTopBar();
  setUserRole('visitante');
  showToast('👋 Sessão encerrada.');
}

// Window Exposures
window.openAddStudentModal = openAddStudentModal;
window.closeAddStudentModal = closeAddStudentModal;
window.handleAddStudentSubmit = handleAddStudentSubmit;
window.handleForgotPasswordSubmit = handleForgotPasswordSubmit;
window.handleChangePassword = handleChangePassword;
window.handleLogout = handleLogout;
window.switchAuthTab = switchAuthTab;
window.handleLoginSubmit = handleLoginSubmit;
window.handleRegisterSubmit = handleRegisterSubmit;
window.saveAdminConfig = saveAdminConfig;
window.exportAdminReport = exportAdminReport;
window.toggleStudentStatus = toggleStudentStatus;
window.deleteStudent = deleteStudent;
window.renderAdminAlunos = renderAdminAlunos;
window.renderAdminPendingPayments = renderAdminPendingPayments;
window.enterWebAppAsAthlete = enterWebAppAsAthlete;
window.handleOnboardingStep1Submit = handleOnboardingStep1Submit;
window.setOnboardingStep = setOnboardingStep;
window.closeOnboardingModal = closeOnboardingModal;
window.sendWhatsAppReminderSequence = sendWhatsAppReminderSequence;
window.grant30DaysToStudent = grant30DaysToStudent;
window.openWhatsAppChat = openWhatsAppChat;
