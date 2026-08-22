/* ══════════════════════════════════════════════════════════════════
   FITSAÚDE - SISTEMA MULTIUSUÁRIO (VISITANTE, ATLETA, ADMIN)
   ══════════════════════════════════════════════════════════════════ */

const ROLES_STORAGE_KEY = 'fitsaude_user_role_v1';
const CURRENT_USER_KEY = 'fitsaude_current_user_v1';
const STUDENTS_DB_KEY = 'fitsaude_students_db_v1';
const SUBSCRIPTIONS_DB_KEY = 'fitsaude_subscriptions_db_v1';
const ADMIN_CONFIG_KEY = 'fitsaude_admin_config_v1';

function showToast(msg, icon = '<i class="fa-solid fa-circle-check"></i>') {
  if (typeof toast === 'function') {
    toast(icon, msg, 2000);
  }
}

// Initial Mock Data for System
const DEFAULT_STUDENTS = [
  { id: 'alu_1', name: 'Carlos Maciel', email: 'carlos@fitsaude.com', plan: 'Anual VIP', status: 'active', joined: '15/01/2026', phone: '(11) 98765-4321', goal: 'Hipertrofia', avatar: 'CM' },
  { id: 'alu_2', name: 'Mariana Silva', email: 'mariana.silva@email.com', plan: 'Trimestral', status: 'active', joined: '02/02/2026', phone: '(11) 97654-3210', goal: 'Emagrecimento', avatar: 'MS' },
  { id: 'alu_3', name: 'Lucas Oliveira', email: 'lucas.treino@email.com', plan: 'Mensal', status: 'pending', joined: '18/08/2026', phone: '(21) 99887-1122', goal: 'Definição', avatar: 'LO' },
  { id: 'alu_4', name: 'Beatriz Costa', email: 'beatriz.c@email.com', plan: 'Anual VIP', status: 'active', joined: '20/12/2025', phone: '(31) 98444-5566', goal: 'Condicionamento', avatar: 'BC' },
  { id: 'alu_5', name: 'Rafael Santos', email: 'rafa.santos@email.com', plan: 'Mensal', status: 'blocked', joined: '10/05/2026', phone: '(41) 99112-3344', goal: 'Força', avatar: 'RS' }
];

const DEFAULT_SUBSCRIPTIONS = [
  { id: 'sub_101', student: 'Carlos Maciel', plan: 'Anual VIP', val: 'R$ 358,80', method: 'Cartão de Crédito', status: 'Paga', date: '15/01/2026' },
  { id: 'sub_102', student: 'Mariana Silva', plan: 'Trimestral', val: 'R$ 119,70', method: 'PIX', status: 'Paga', date: '02/02/2026' },
  { id: 'sub_103', student: 'Lucas Oliveira', plan: 'Mensal', val: 'R$ 49,90', method: 'PIX', status: 'Pendente', date: '18/08/2026' },
  { id: 'sub_104', student: 'Beatriz Costa', plan: 'Anual VIP', val: 'R$ 358,80', method: 'Cartão de Crédito', status: 'Paga', date: '20/12/2025' }
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
let currentSelectedCheckoutPlan = { name: 'Anual VIP', price: 'R$ 29,90/mês (R$ 358,80/ano)' };

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

  // Set the active role view
  setUserRole(currentUserRole, true);
}

// ─── Set Role & Re-render Interface ───────────────────────────
function setUserRole(role, silent = false) {
  currentUserRole = role;
  localStorage.setItem(ROLES_STORAGE_KEY, role);

  // Update top-bar badge
  const badge = document.getElementById('current-role-badge');
  const roleNameEl = document.getElementById('current-role-name');
  if (badge && roleNameEl) {
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

  // Render role-specific navigation and screens
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

  if (!silent && typeof showToast === 'function') {
    const roleTitles = { visitante: 'Modo Visitante Ativo', atleta: 'Bem-vindo(a), Atleta!', admin: 'Painel do Administrador' };
    showToast(`${roleTitles[role] || 'Perfil alterado'}`);
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
        <span class="nav-label">Início</span>
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
    'visitante-planos': 'Nossos <span>Planos</span>',
    'treinos': 'Fit<span>Saúde</span>',
    'planilhas': 'Planilhas <span>Treinos</span>',
    'resumo': 'Resumo <span>Semanal</span>',
    'chat': 'FitBot <span>IA</span>',
    'perfil': 'Perfil <span>Atleta</span>',
    'atleta-assinatura': 'Sua <span>Assinatura</span>',
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

  // Call relevant renderers
  if (screenId === 'planilhas' && typeof renderPlanilhas === 'function') renderPlanilhas();
  if (screenId === 'resumo' && typeof renderSummary === 'function') renderSummary();
  if (screenId === 'admin-dashboard') renderAdminDashboard();
  if (screenId === 'admin-alunos') renderAdminAlunos();
  if (screenId === 'admin-assinaturas') renderAdminAssinaturas();
  if (screenId === 'admin-config') renderAdminConfig();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Visitante & Auth Modals ──────────────────────────────────
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
    if (typeof showToast === 'function') showToast('Preencha email e senha!');
    return;
  }

  // Check if admin login
  if (email.toLowerCase().includes('admin')) {
    closeAuthModal();
    setUserRole('admin');
    if (typeof showToast === 'function') showToast('👑 Login Administrador autenticado!');
    return;
  }

  // Regular athlete login
  closeAuthModal();
  setUserRole('atleta');
  if (typeof showToast === 'function') showToast(`⚡ Bem-vindo de volta!`);
}

function handleRegisterSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('auth-reg-name').value;
  const email = document.getElementById('auth-reg-email').value;
  const pass = document.getElementById('auth-reg-pass').value;

  if (!name || !email || !pass) {
    if (typeof showToast === 'function') showToast('Preencha todos os campos!');
    return;
  }

  const newUser = {
    id: 'alu_' + Date.now(),
    name: name,
    email: email,
    role: 'atleta',
    plan: 'Mensal',
    status: 'active',
    joined: new Date().toLocaleDateString('pt-BR'),
    phone: '(11) 90000-0000',
    goal: 'Hipertrofia',
    avatar: name.slice(0, 2).toUpperCase()
  };

  // Add to students database
  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  students.unshift(newUser);
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  closeAuthModal();
  setUserRole('atleta');
  if (typeof showToast === 'function') showToast(`🎉 Conta criada com sucesso!`);
}

function handleForgotPassword() {
  const email = prompt('Digite seu e-mail cadastrado para recuperação:');
  if (email) {
    if (typeof showToast === 'function') {
      showToast(`📧 Link de recuperação enviado para ${email}!`);
    } else {
      alert(`Link de recuperação enviado para ${email}!`);
    }
  }
}

// ─── Checkout & Plan Subscription ─────────────────────────────
function openCheckoutModal(planName, price) {
  currentSelectedCheckoutPlan = { name: planName, price: price };
  const modal = document.getElementById('checkout-modal-backdrop');
  const titleEl = document.getElementById('checkout-plan-name');
  const priceEl = document.getElementById('checkout-plan-price');

  if (titleEl) titleEl.innerText = `Plano ${planName}`;
  if (priceEl) priceEl.innerText = price;
  if (modal) modal.classList.add('show');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal-backdrop');
  if (modal) modal.classList.remove('show');
}

function setPaymentMethod(method) {
  document.querySelectorAll('.payment-method-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`pay-method-${method}`);
  if (btn) btn.classList.add('active');

  const pixBox = document.getElementById('checkout-pix-view');
  const cardBox = document.getElementById('checkout-card-view');

  if (pixBox && cardBox) {
    pixBox.style.display = method === 'pix' ? 'block' : 'none';
    cardBox.style.display = method === 'card' ? 'block' : 'none';
  }
}

function copyPixCode() {
  const code = '00020126580014br.gov.bcb.pix0136fitsaude-treinos-assinatura-20265204000053039865802BR5916FITSAUDE ACADEMIA6009SAO PAULO62070503***6304A1B2';
  navigator.clipboard.writeText(code).then(() => {
    if (typeof showToast === 'function') showToast('📋 Código PIX copiado!');
  }).catch(() => {
    if (typeof showToast === 'function') showToast('📋 Código copiado!');
  });
}

function confirmSubscriptionPayment() {
  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
  currentUser.plan = currentSelectedCheckoutPlan.name;
  currentUser.role = 'atleta';
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  // Add to subscriptions database
  const subs = JSON.parse(localStorage.getItem(SUBSCRIPTIONS_DB_KEY) || '[]');
  subs.unshift({
    id: 'sub_' + Date.now(),
    student: currentUser.name || 'Novo Aluno',
    plan: currentSelectedCheckoutPlan.name,
    val: currentSelectedCheckoutPlan.price.split('(')[0],
    method: document.getElementById('pay-method-pix')?.classList.contains('active') ? 'PIX' : 'Cartão de Crédito',
    status: 'Paga',
    date: new Date().toLocaleDateString('pt-BR')
  });
  localStorage.setItem(SUBSCRIPTIONS_DB_KEY, JSON.stringify(subs));

  closeCheckoutModal();
  setUserRole('atleta');
  if (typeof showToast === 'function') showToast(`🎉 Assinatura ativada! Bem-vindo ao FitSaúde!`);
}

// ─── Admin Management Functions ───────────────────────────────
function renderAdminDashboard() {
  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  const subs = JSON.parse(localStorage.getItem(SUBSCRIPTIONS_DB_KEY) || '[]');

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  
  // Calculate approximate MRR
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
      <div class="admin-student-card">
        <div class="admin-student-info">
          <div class="admin-student-avatar">${s.avatar || s.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <div class="admin-student-name">${s.name}</div>
            <div class="admin-student-meta">
              <span>${s.plan}</span> • <span>${statusLabels[s.status] || s.status}</span>
            </div>
          </div>
        </div>
        <div class="admin-student-actions">
          <button class="btn-student-action" onclick="toggleStudentStatus('${s.id}')" title="Alterar Status">
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
  if (typeof showToast === 'function') showToast('Status do aluno atualizado!');
}

function deleteStudent(id) {
  if (!confirm('Deseja realmente remover este aluno?')) return;
  let students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  students = students.filter(s => s.id !== id);
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students));
  renderAdminAlunos();
  if (typeof showToast === 'function') showToast('Aluno removido com sucesso!');
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
    avatar: name.slice(0, 2).toUpperCase()
  };

  const students = JSON.parse(localStorage.getItem(STUDENTS_DB_KEY) || '[]');
  students.unshift(newStudent);
  localStorage.setItem(STUDENTS_DB_KEY, JSON.stringify(students));
  renderAdminAlunos();
  if (typeof showToast === 'function') showToast(`✅ Aluno ${name} cadastrado!`);
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
  if (typeof showToast === 'function') showToast('💾 Configurações da academia salvas!');
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
        headStyles: { fillColor: [220, 20, 60] }
      });
    }

    doc.save('FitSaude_Relatorio_Geral.pdf');
    if (typeof showToast === 'function') showToast('📄 Relatório Administrativo baixado!');
  } else {
    alert('Exportação concluída!');
  }
}

// ─── Security Tab Functions ───────────────────────────────────
function handleChangePassword() {
  const newPass = prompt('Digite sua nova senha:');
  if (newPass && newPass.length >= 6) {
    if (typeof showToast === 'function') showToast('🔒 Senha alterada com sucesso!');
  } else if (newPass) {
    if (typeof showToast === 'function') showToast('A senha deve ter pelo menos 6 caracteres.');
  }
}

function handleLogout() {
  setUserRole('visitante');
  if (typeof showToast === 'function') showToast('👋 Sessão encerrada.');
}
