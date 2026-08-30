/* ══════════════════════════════════════════════════════════════════
   FITSAÚDE — ENGINE DE ASSINATURA, TRIAL DE 7 DIAS & COBRANÇA PIX
   MVP Oficial: 7 dias grátis | R$ 29,90/mês | PIX Oficial | WhatsApp
   ══════════════════════════════════════════════════════════════════ */

// ── Constantes Oficiais do MVP ────────────────────────────────
const OFFICIAL_WHATSAPP_NUMBER = '5562994390943';
const OFFICIAL_WHATSAPP_DISPLAY = '+55 62 99439-0943';
const OFFICIAL_PIX_KEY = '5f038f67-9fd9-44fc-8c50-b94e8c79e172';
const OFFICIAL_PLAN_NAME = 'FitSaúde';
const OFFICIAL_PLAN_PRICE = 29.90;
const OFFICIAL_PLAN_PRICE_FORMATTED = 'R$ 29,90/mês';

// Storage Keys
const SUBSCRIPTION_STORAGE_KEY = 'fitsaude_user_subscription_v3';
const PENDING_PAYMENTS_KEY = 'fitsaude_pending_payments_v3';
const PAYMENT_HISTORY_KEY = 'fitsaude_payment_history_v3';

// Status válidos: 'TRIAL', 'ACTIVE', 'PENDING_PAYMENT', 'EXPIRED', 'BLOCKED'

/**
 * Retorna ou cria a assinatura do usuário logado
 */
function getUserSubscription(userId) {
  let subsMap = JSON.parse(localStorage.getItem(SUBSCRIPTION_STORAGE_KEY) || '{}');
  
  if (!subsMap[userId]) {
    // Criar assinatura padrão em modo TRIAL de 7 dias
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    subsMap[userId] = {
      user_id: userId,
      plan: OFFICIAL_PLAN_NAME,
      price: OFFICIAL_PLAN_PRICE,
      price_formatted: OFFICIAL_PLAN_PRICE_FORMATTED,
      status: 'TRIAL',
      trial_started_at: now.toISOString(),
      trial_ends_at: trialEnd.toISOString(),
      subscription_started_at: null,
      subscription_expires_at: null,
      last_payment_at: null,
      next_payment_at: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subsMap));
  }

  // Verificar expiração automática de status
  return checkAndUpdateSubscriptionExpiration(subsMap[userId]);
}

/**
 * Salva a assinatura do usuário
 */
function saveUserSubscription(subscription) {
  let subsMap = JSON.parse(localStorage.getItem(SUBSCRIPTION_STORAGE_KEY) || '{}');
  subscription.updated_at = new Date().toISOString();
  subsMap[subscription.user_id] = subscription;
  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subsMap));

  // Sincronizar com perfil do aluno se existir
  updateStudentRecordStatus(subscription);

  // Sincronizar em nuvem se Supabase estiver ativo
  if (typeof syncSubscriptionToSupabase === 'function') {
    syncSubscriptionToSupabase({
      student: subscription.student_name || 'Aluno FitSaúde',
      email: subscription.email || null,
      plan: subscription.plan,
      val: subscription.price_formatted,
      method: 'PIX Oficial',
      status: subscription.status === 'ACTIVE' ? 'Paga' : (subscription.status === 'TRIAL' ? 'Trial' : 'Pendente')
    });
  }

  return subscription;
}

/**
 * Verifica se o período de Trial ou Assinatura expirou
 */
function checkAndUpdateSubscriptionExpiration(sub) {
  if (!sub) return null;
  const now = new Date();

  let modified = false;

  // 1. Verificar término de TRIAL
  if (sub.status === 'TRIAL' && sub.trial_ends_at) {
    const trialEnd = new Date(sub.trial_ends_at);
    if (now > trialEnd) {
      sub.status = 'EXPIRED';
      modified = true;
    }
  }

  // 2. Verificar término de Assinatura Ativa (ACTIVE)
  if (sub.status === 'ACTIVE' && sub.subscription_expires_at) {
    const subExpire = new Date(sub.subscription_expires_at);
    if (now > subExpire) {
      sub.status = 'EXPIRED';
      modified = true;
    }
  }

  if (modified) {
    let subsMap = JSON.parse(localStorage.getItem(SUBSCRIPTION_STORAGE_KEY) || '{}');
    sub.updated_at = now.toISOString();
    subsMap[sub.user_id] = sub;
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subsMap));
    updateStudentRecordStatus(sub);
  }

  return sub;
}

/**
 * Atualiza o status na tabela/lista de alunos (STUDENTS_DB_KEY)
 */
function updateStudentRecordStatus(sub) {
  const studentsKey = 'fitsaude_students_db_v2';
  let students = JSON.parse(localStorage.getItem(studentsKey) || '[]');
  let updated = false;

  students = students.map(s => {
    if (s.id === sub.user_id || s.email === sub.email) {
      s.subscription_status = sub.status;
      s.plan = sub.plan || OFFICIAL_PLAN_NAME;
      if (sub.status === 'EXPIRED' || sub.status === 'BLOCKED') {
        s.status = 'blocked';
      } else if (sub.status === 'PENDING_PAYMENT') {
        s.status = 'pending';
      } else {
        s.status = 'active';
      }
      updated = true;
    }
    return s;
  });

  if (updated) {
    localStorage.setItem(studentsKey, JSON.stringify(students));
  }
}

/**
 * Inicia o fluxo de cadastro com 7 dias de TRIAL automático
 */
function registerNewTrialUser(name, email, phone = '', goal = 'Hipertrofia') {
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const userId = 'alu_' + Date.now();

  const newUser = {
    id: userId,
    name: name,
    email: email,
    phone: phone || '(11) 98765-0000',
    role: 'atleta',
    plan: OFFICIAL_PLAN_NAME,
    status: 'active',
    subscription_status: 'TRIAL',
    joined: now.toLocaleDateString('pt-BR'),
    goal: goal,
    weight: 75,
    height: 175,
    workoutsDone: 0,
    avatar: name ? name.slice(0, 2).toUpperCase() : 'FS'
  };

  // Salva no banco de alunos
  const studentsKey = 'fitsaude_students_db_v2';
  let students = JSON.parse(localStorage.getItem(studentsKey) || '[]');
  students.unshift(newUser);
  localStorage.setItem(studentsKey, JSON.stringify(students));

  // Salva a assinatura em modo TRIAL
  const newSub = {
    user_id: userId,
    student_name: name,
    email: email,
    phone: phone,
    plan: OFFICIAL_PLAN_NAME,
    price: OFFICIAL_PLAN_PRICE,
    price_formatted: OFFICIAL_PLAN_PRICE_FORMATTED,
    status: 'TRIAL',
    trial_started_at: now.toISOString(),
    trial_ends_at: trialEnd.toISOString(),
    subscription_started_at: null,
    subscription_expires_at: null,
    last_payment_at: null,
    next_payment_at: null,
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };
  saveUserSubscription(newSub);

  // Define como usuário ativo da sessão
  localStorage.setItem('fitsaude_current_user_v2', JSON.stringify(newUser));

  // Agendar mensagem do Dia 1 no WhatsAppService
  if (typeof WhatsAppService !== 'undefined') {
    WhatsAppService.triggerEvent(userId, 'DAY_1_WELCOME');
  }

  return { user: newUser, subscription: newSub };
}

/**
 * Ação: Usuário clica em 'PAGUEI / ENVIAR COMPROVANTE'
 */
function submitProofOfPayment() {
  const currentUser = JSON.parse(localStorage.getItem('fitsaude_current_user_v2') || '{}');
  const userId = currentUser.id || 'alu_default';
  const sub = getUserSubscription(userId);

  const now = new Date();
  sub.status = 'PENDING_PAYMENT';
  sub.student_name = currentUser.name || 'Aluno FitSaúde';
  sub.email = currentUser.email || 'aluno@fitsaude.com';
  sub.phone = currentUser.phone || '';
  saveUserSubscription(sub);

  // Registrar em pagamentos pendentes para o Super Admin
  let pendingList = JSON.parse(localStorage.getItem(PENDING_PAYMENTS_KEY) || '[]');
  const pendingRecord = {
    id: 'pay_req_' + Date.now(),
    user_id: userId,
    student_name: currentUser.name || 'Aluno FitSaúde',
    student_email: currentUser.email || 'aluno@fitsaude.com',
    student_phone: currentUser.phone || '',
    plan: OFFICIAL_PLAN_NAME,
    amount: OFFICIAL_PLAN_PRICE,
    amount_formatted: OFFICIAL_PLAN_PRICE_FORMATTED,
    requested_at: now.toISOString(),
    status: 'PENDING_APPROVAL',
    notes: 'Pagamento de R$ 29,90 via PIX enviado pelo usuário'
  };

  // Evita duplicar se já houver um pendente aberto para o mesmo usuário
  pendingList = pendingList.filter(p => p.user_id !== userId);
  pendingList.unshift(pendingRecord);
  localStorage.setItem(PENDING_PAYMENTS_KEY, JSON.stringify(pendingList));

  // Notificar via WhatsApp oficial
  const firstName = (currentUser.name || 'Aluno').split(' ')[0];
  const message = `Olá! Realizei o pagamento do plano FitSaúde (R$ 29,90/mês).\n\n👤 *Nome:* ${currentUser.name || 'Aluno'}\n📧 *E-mail:* ${currentUser.email || 'aluno@fitsaude.com'}\n🔑 *Chave PIX:* ${OFFICIAL_PIX_KEY}\n\nSegue o comprovante em anexo para liberação do meu acesso!`;

  const waUrl = `https://api.whatsapp.com/send?phone=${OFFICIAL_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
  
  if (typeof showToast === 'function') {
    showToast('📲 Abrindo WhatsApp para envio do comprovante...');
  }
  
  window.open(waUrl, '_blank');

  // Atualizar telas
  if (typeof renderAthleteSubscriptionScreen === 'function') renderAthleteSubscriptionScreen();
  if (typeof checkPaywallGate === 'function') checkPaywallGate();
}

/**
 * Super Admin: Confirmar Pagamento Manual e Liberar +30 Dias
 */
function approvePaymentByAdmin(pendingId) {
  let pendingList = JSON.parse(localStorage.getItem(PENDING_PAYMENTS_KEY) || '[]');
  const pending = pendingList.find(p => p.id === pendingId);
  if (!pending) return;

  const now = new Date();
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Atualizar assinatura do usuário
  const sub = getUserSubscription(pending.user_id);
  sub.status = 'ACTIVE';
  sub.subscription_started_at = sub.subscription_started_at || now.toISOString();
  sub.subscription_expires_at = nextMonth.toISOString();
  sub.last_payment_at = now.toISOString();
  sub.next_payment_at = nextMonth.toISOString();
  saveUserSubscription(sub);

  // Adicionar ao Histórico Oficial de Pagamentos
  let history = JSON.parse(localStorage.getItem(PAYMENT_HISTORY_KEY) || '[]');
  const paymentHistoryItem = {
    id: 'pay_hist_' + Date.now(),
    user_id: pending.user_id,
    student_name: pending.student_name,
    student_email: pending.student_email,
    plan: OFFICIAL_PLAN_NAME,
    amount: pending.amount || OFFICIAL_PLAN_PRICE,
    amount_formatted: OFFICIAL_PLAN_PRICE_FORMATTED,
    payment_method: 'PIX Oficial',
    status: 'APROVADO',
    approved_at: now.toISOString(),
    approved_by: 'Super Admin (Carlos Maciel)',
    next_due_date: nextMonth.toISOString()
  };
  history.unshift(paymentHistoryItem);
  localStorage.setItem(PAYMENT_HISTORY_KEY, JSON.stringify(history));

  // Remover da lista de pendentes
  pendingList = pendingList.filter(p => p.id !== pendingId);
  localStorage.setItem(PENDING_PAYMENTS_KEY, JSON.stringify(pendingList));

  if (typeof showToast === 'function') {
    showToast(`✅ Pagamento confirmado! +30 dias liberados para ${pending.student_name}.`);
  }

  // Notificar usuário pelo WhatsApp se desejado
  if (typeof WhatsAppService !== 'undefined' && pending.student_phone) {
    WhatsAppService.triggerEvent(pending.user_id, 'PAYMENT_CONFIRMED');
  }

  // Re-renderizar telas do Admin
  if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
  if (typeof renderAdminPendingPayments === 'function') renderAdminPendingPayments();
  if (typeof renderAdminAlunos === 'function') renderAdminAlunos();
}

/**
 * Helper: Copiar Chave PIX Oficial com Toast
 */
function copyOfficialPixKey() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(OFFICIAL_PIX_KEY).then(() => {
      if (typeof showToast === 'function') showToast('📋 Chave PIX copiada com sucesso!');
    }).catch(() => {
      fallbackCopyPix();
    });
  } else {
    fallbackCopyPix();
  }
}

function fallbackCopyPix() {
  const tempInput = document.createElement('input');
  tempInput.value = OFFICIAL_PIX_KEY;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  if (typeof showToast === 'function') showToast('📋 Chave PIX copiada!');
}

/**
 * Renderiza a tela 'Minha Assinatura' do Atleta
 */
function renderAthleteSubscriptionScreen() {
  const currentUser = JSON.parse(localStorage.getItem('fitsaude_current_user_v2') || '{}');
  const userId = currentUser.id || 'alu_default';
  const sub = getUserSubscription(userId);
  const container = document.getElementById('screen-atleta-assinatura');
  if (!container) return;

  const now = new Date();
  let statusBadge = '';
  let statusDetail = '';
  let validityLabel = 'Próximo Vencimento';
  let validityValue = '—';

  if (sub.status === 'TRIAL') {
    const trialEnd = new Date(sub.trial_ends_at);
    const diffDays = Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)));
    statusBadge = `<span class="sub-badge-trial"><i class="fa-solid fa-clock"></i> 7 Dias Grátis (${diffDays} dias restantes)</span>`;
    statusDetail = `Você está aproveitando o período de teste gratuito com acesso total a todas as ferramentas.`;
    validityLabel = 'Término do Teste Grátis';
    validityValue = trialEnd.toLocaleDateString('pt-BR');
  } else if (sub.status === 'ACTIVE') {
    const subEnd = new Date(sub.subscription_expires_at);
    statusBadge = `<span class="sub-badge-active"><i class="fa-solid fa-circle-check"></i> Assinatura Ativa</span>`;
    statusDetail = `Acesso 100% liberado a treinos, animações 3D, planilhas, PDFs e FitBot IA.`;
    validityLabel = 'Próxima Renovação';
    validityValue = subEnd.toLocaleDateString('pt-BR');
  } else if (sub.status === 'PENDING_PAYMENT') {
    statusBadge = `<span class="sub-badge-pending"><i class="fa-solid fa-hourglass-half"></i> Pagamento em Análise</span>`;
    statusDetail = `Seu comprovante foi enviado ao Super Admin e está sendo processado. A liberação ocorre em instantes.`;
    validityLabel = 'Status da Análise';
    validityValue = 'Aguardando Admin';
  } else if (sub.status === 'EXPIRED') {
    statusBadge = `<span class="sub-badge-expired"><i class="fa-solid fa-triangle-exclamation"></i> Assinatura Expirada</span>`;
    statusDetail = `Seu período de acesso encerrou. Renove agora via PIX para continuar seus treinos!`;
    validityLabel = 'Vencimento';
    validityValue = 'Expirado';
  }

  const lastPaymentText = sub.last_payment_at ? new Date(sub.last_payment_at).toLocaleDateString('pt-BR') : 'Nenhum registro anterior';

  // Buscar histórico de faturas do usuário
  const history = JSON.parse(localStorage.getItem(PAYMENT_HISTORY_KEY) || '[]');
  const userHistory = history.filter(h => h.user_id === userId);

  container.innerHTML = `
    <div class="hero-strip">
      <div class="hero-greeting">Gestão Financeira <i class="fa-solid fa-credit-card"></i></div>
      <h1 class="hero-title">Minha <span>Assinatura</span></h1>
    </div>

    <!-- Card de Status Principal -->
    <div class="subscription-status-card">
      <div class="sub-status-header">
        <span style="font-size:12px;color:var(--txt2);font-weight:700;text-transform:uppercase;">Plano Vigente</span>
        ${statusBadge}
      </div>
      <div class="sub-plan-title">${OFFICIAL_PLAN_NAME} — ${OFFICIAL_PLAN_PRICE_FORMATTED}</div>
      <p style="font-size:13px;color:var(--txt2);margin-bottom:16px;">${statusDetail}</p>

      <div class="sub-detail-grid">
        <div class="sub-detail-item">
          <span class="sub-detail-label">${validityLabel}</span>
          <span class="sub-detail-val" style="color:var(--txt);">${validityValue}</span>
        </div>
        <div class="sub-detail-item">
          <span class="sub-detail-label">Valor Mensal</span>
          <span class="sub-detail-val" style="color:var(--green);font-weight:800;">${OFFICIAL_PLAN_PRICE_FORMATTED}</span>
        </div>
        <div class="sub-detail-item">
          <span class="sub-detail-label">Último Pagamento</span>
          <span class="sub-detail-val">${lastPaymentText}</span>
        </div>
        <div class="sub-detail-item">
          <span class="sub-detail-label">Canal Oficial</span>
          <span class="sub-detail-val" style="color:var(--txt);">${OFFICIAL_WHATSAPP_DISPLAY}</span>
        </div>
      </div>
    </div>

    <!-- Área de Pagamento & Renovação PIX -->
    <div class="profile-card" style="border: 1px solid rgba(34, 211, 160, 0.35);background: linear-gradient(180deg, rgba(34, 211, 160, 0.05) 0%, var(--bg2) 100%);">
      <div class="section-label" style="padding:0;margin-bottom:12px;color:var(--green);">
        <i class="fa-brands fa-pix"></i> Pagamento & Renovação via PIX
      </div>
      <p style="font-size:13px;color:var(--txt2);line-height:1.5;margin-bottom:14px;">
        Pague sua mensalidade de <strong>R$ 29,90</strong> utilizando a chave PIX oficial abaixo e envie o comprovante para liberação automática.
      </p>

      <div class="pix-key-display-box">
        <div class="pix-key-label">CHAVE PIX OFICIAL (FITSAÚDE)</div>
        <div class="pix-key-val-row">
          <code id="pix-official-key-text" class="pix-code-text">${OFFICIAL_PIX_KEY}</code>
          <button type="button" class="btn-copy-pix" onclick="copyOfficialPixKey()" title="Copiar Chave PIX">
            <i class="fa-solid fa-copy"></i> Copiar
          </button>
        </div>
      </div>

      <div class="pix-action-buttons">
        <button type="button" class="btn-save" style="background:#25D366;color:#060608;font-weight:800;font-size:14px;" onclick="submitProofOfPayment()">
          <i class="fa-brands fa-whatsapp" style="font-size:17px;"></i> PAGUEI / ENVIAR COMPROVANTE
        </button>
      </div>
      <p style="font-size:11px;color:var(--txt2);text-align:center;margin-top:10px;">
        WhatsApp Oficial de Cobrança: <strong>${OFFICIAL_WHATSAPP_DISPLAY}</strong>
      </p>
    </div>

    <!-- Histórico de Pagamentos -->
    <div class="profile-card" style="margin-top:14px;">
      <div class="section-label" style="padding:0;margin-bottom:14px;"><i class="fa-solid fa-clock-rotate-left"></i> Histórico de Mensalidades</div>
      ${userHistory.length === 0 ? `
        <div style="text-align:center;padding:20px;color:var(--txt2);font-size:13px;">
          <i class="fa-solid fa-receipt" style="font-size:24px;opacity:0.4;margin-bottom:8px;"></i>
          <p>Nenhum pagamento aprovado até o momento.</p>
        </div>
      ` : userHistory.map((h, i) => `
        <div class="admin-student-card" style="margin-bottom:8px;">
          <div class="admin-student-info">
            <div class="admin-student-avatar" style="color:var(--green);"><i class="fa-solid fa-check"></i></div>
            <div>
              <div class="admin-student-name">Mensalidade #${String(i+1).padStart(3, '0')}</div>
              <div class="admin-student-meta">${new Date(h.approved_at).toLocaleDateString('pt-BR')} • ${h.amount_formatted} • PIX</div>
            </div>
          </div>
          <span class="student-status-badge active">APROVADO</span>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Verifica se a tela atual requer paywall (usuário expirado tentando acessar treinos/fitbot)
 */
function checkPaywallGate() {
  const currentUser = JSON.parse(localStorage.getItem('fitsaude_current_user_v2') || '{}');
  if (currentUser.role === 'admin' || currentUser.role === 'visitante') {
    const paywall = document.getElementById('paywall-expired-overlay');
    if (paywall) paywall.classList.remove('active');
    return;
  }

  const sub = getUserSubscription(currentUser.id || 'alu_default');
  const paywall = document.getElementById('paywall-expired-overlay');

  if (sub && sub.status === 'EXPIRED') {
    if (paywall) paywall.classList.add('active');
  } else {
    if (paywall) paywall.classList.remove('active');
  }

  // Atualizar banner de dias restantes de Trial no topo do app
  updateTrialBanner(sub);
}

/**
 * Atualiza banner superior informando dias de teste grátis restantes
 */
function updateTrialBanner(sub) {
  let banner = document.getElementById('trial-countdown-banner');
  if (!banner) return;

  if (sub && sub.status === 'TRIAL') {
    const now = new Date();
    const trialEnd = new Date(sub.trial_ends_at);
    const diffDays = Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)));

    banner.style.display = 'flex';
    banner.innerHTML = `
      <div class="trial-banner-left">
        <i class="fa-solid fa-gift"></i>
        <span><strong>${diffDays} dia(s)</strong> de teste grátis restante(s).</span>
      </div>
      <button class="btn-trial-upgrade" onclick="switchRoleScreen('atleta-assinatura')">
        Assinar R$ 29,90/mês
      </button>
    `;
  } else {
    banner.style.display = 'none';
  }
}

// Iniciar verificação periódica de assinatura no cliente
setInterval(() => {
  const currentUser = JSON.parse(localStorage.getItem('fitsaude_current_user_v2') || '{}');
  if (currentUser && currentUser.id) {
    checkAndUpdateSubscriptionExpiration(getUserSubscription(currentUser.id));
    checkPaywallGate();
  }
}, 30000);

// Global Window Exposures
window.getUserSubscription = getUserSubscription;
window.saveUserSubscription = saveUserSubscription;
window.registerNewTrialUser = registerNewTrialUser;
window.submitProofOfPayment = submitProofOfPayment;
window.approvePaymentByAdmin = approvePaymentByAdmin;
window.copyOfficialPixKey = copyOfficialPixKey;
window.renderAthleteSubscriptionScreen = renderAthleteSubscriptionScreen;
window.checkPaywallGate = checkPaywallGate;
