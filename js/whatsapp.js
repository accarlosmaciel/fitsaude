/* ══════════════════════════════════════════════════════════════════
   FITSAÚDE — SERVIÇO DE AUTOMAÇÃO WHATSAPP & RÉGUA DE COMUNICAÇÃO
   WhatsApp Oficial: +55 62 99439-0943 | PIX: 5f038f67-9fd9-44fc-8c50-b94e8c79e172
   ══════════════════════════════════════════════════════════════════ */

const WHATSAPP_LOGS_KEY = 'fitsaude_whatsapp_logs_v3';

const WhatsAppService = {
  /**
   * Templates das mensagens da régua de relacionamento
   */
  templates: {
    DAY_1_WELCOME: (name) => 
      `Olá, ${name}! 👋\n\nBem-vindo(a) ao *FitSaúde*! Seu acesso de 7 dias grátis está 100% liberado.\n\n🏋️‍♂️ Que tal explorar seus treinos e iniciar seu primeiro exercício hoje?\n🤖 Nosso *FitBot IA* está à disposição para tirar qualquer dúvida sobre séries, postura e nutrição.\n\nBons treinos! 💪`,

    DAY_2_FOLLOWUP: (name) => 
      `E aí, ${name}! Tudo bem? 💪\n\nPassando para acompanhar seu início no *FitSaúde*. Você já conferiu o *Player 3D de Execução* com animações interativas e cronômetro de descanso?\n\nAcesse o app e mantenha a consistência nos treinos!`,

    DAY_3_VALUE: (name) => 
      `Fala, ${name}! 🔥\n\nVocê sabia que pode registrar suas metas diárias de hidratação, calcular seu IMC e acompanhar sua evolução semanal direto no painel do *FitSaúde*?\n\nQualquer dúvida sobre alimentação ou execução de exercícios, basta perguntar ao nosso *FitBot IA*!`,

    DAY_4_FOLLOWUP: (name) => 
      `Olá, ${name}! 👋\n\nComo está o ritmo de treinos nesta semana? A constância é o segredo para a transformação corporal.\n\nSe precisar ajustar suas cargas ou séries, abra o aplicativo e continue firme! 🚀`,

    DAY_5_OFFER: (name) => 
      `Olá, ${name}! 🌟\n\nSeu teste gratuito está na reta final e queremos que você continue evoluindo conosco sem interrupções!\n\n🔥 Assine o plano *FitSaúde* por apenas *R$ 29,90/mês* e garanta acesso contínuo a todas as ferramentas, fichas e IA.\n\n🔑 *Chave PIX:* ${OFFICIAL_PIX_KEY}\n\nGaranta sua vaga!`,

    DAY_6_REMINDER: (name) => 
      `Atenção, ${name}! ⏳\n\nFalta apenas *1 dia* para o encerramento do seu teste grátis no *FitSaúde*.\n\nPara não perder o acesso às suas fichas e histórico, renove por *R$ 29,90/mês* via PIX:\n🔑 *Chave PIX:* ${OFFICIAL_PIX_KEY}\n\nEnvie seu comprovante por aqui para continuarmos juntos! 💪`,

    DAY_7_FINAL: (name) => 
      `Olá, ${name}! 🚨\n\nSeu período de 7 dias grátis no *FitSaúde* encerrou hoje.\n\nPara reativar seu acesso completo imediatamente:\n📌 *Plano:* FitSaúde\n💰 *Valor:* R$ 29,90/mês\n🔑 *Chave PIX:* ${OFFICIAL_PIX_KEY}\n\nAssim que fizer o PIX, envie o comprovante nesta conversa para liberarmos seus +30 dias! 🚀`,

    EXPIRING_SOON_RENEWAL: (name, daysLeft) =>
      `Olá, ${name}! 👋\n\nSua assinatura do *FitSaúde* vence em *${daysLeft} dia(s)*.\n\nPara renovar seu plano sem interrupção:\n💰 *Valor:* R$ 29,90/mês\n🔑 *Chave PIX:* ${OFFICIAL_PIX_KEY}\n\nEnvie o comprovante para confirmação da baixa!`,

    PAYMENT_CONFIRMED: (name) => 
      `🎉 Parabéns, ${name}!\n\nSeu pagamento de *R$ 29,90* foi confirmado com sucesso pelo Super Admin do FitSaúde! ✅\n\nSeu acesso completo está garantido por mais *30 dias*. Bons treinos e continue focado na sua meta! 🏋️‍♂️🔥`
  },

  /**
   * Retorna os logs de mensagens disparadas
   */
  getLogs: function() {
    return JSON.parse(localStorage.getItem(WHATSAPP_LOGS_KEY) || '[]');
  },

  /**
   * Verifica se determinado evento já foi enviado para o usuário (Proteção contra Duplicidade)
   */
  hasEventBeenSent: function(userId, eventType, referenceDate = null) {
    const logs = this.getLogs();
    const todayStr = (referenceDate || new Date()).toISOString().slice(0, 10);

    return logs.some(log => 
      log.user_id === userId && 
      log.event_type === eventType &&
      (log.sent_at || '').slice(0, 10) === todayStr
    );
  },

  /**
   * Registra um disparo de mensagem nos logs
   */
  logMessage: function(userId, eventType, studentName, phone, messageContent, status = 'SENT') {
    const logs = this.getLogs();
    const logEntry = {
      id: 'wa_log_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      user_id: userId,
      event_type: eventType,
      student_name: studentName,
      phone: phone,
      message: messageContent,
      status: status,
      sent_at: new Date().toISOString()
    };
    logs.unshift(logEntry);
    localStorage.setItem(WHATSAPP_LOGS_KEY, JSON.stringify(logs));
    return logEntry;
  },

  /**
   * Gera a URL do WhatsApp para envio
   */
  generateWhatsAppLink: function(phone, message) {
    const cleanPhone = (phone || OFFICIAL_WHATSAPP_NUMBER).replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone;
    return `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(message)}`;
  },

  /**
   * Dispara ou agenda um evento específico para um usuário
   */
  triggerEvent: function(userId, eventType, customPhone = null) {
    const studentsKey = 'fitsaude_students_db_v2';
    const students = JSON.parse(localStorage.getItem(studentsKey) || '[]');
    const student = students.find(s => s.id === userId);
    if (!student) return false;

    const studentName = (student.name || 'Aluno').split(' ')[0];
    const phone = customPhone || student.phone || OFFICIAL_WHATSAPP_NUMBER;

    // Verificar duplicidade
    if (this.hasEventBeenSent(userId, eventType)) {
      console.log(`ℹ️ [WhatsAppService] Evento ${eventType} já foi enviado hoje para ${student.name}. Ignorando.`);
      return false;
    }

    const templateFn = this.templates[eventType];
    if (!templateFn) return false;

    const message = templateFn(studentName);
    this.logMessage(userId, eventType, student.name, phone, message, 'LOGGED');
    console.log(`📱 [WhatsAppService] Mensagem gerada para ${student.name} [${eventType}]:\n${message}`);

    return { phone, message, url: this.generateWhatsAppLink(phone, message) };
  },

  /**
   * Scheduler Automático de Cobrança e Régua (Verificação Diária)
   * Executa mesmo sem admin logado.
   */
  runDailyScheduler: function() {
    console.log('🤖 [FitSaúde Scheduler] Executando verificação diária de trials e assinaturas...');
    const studentsKey = 'fitsaude_students_db_v2';
    const students = JSON.parse(localStorage.getItem(studentsKey) || '[]');
    const now = new Date();

    students.forEach(student => {
      const sub = typeof getUserSubscription === 'function' ? getUserSubscription(student.id) : null;
      if (!sub) return;

      const studentName = (student.name || 'Aluno').split(' ')[0];

      // 1. Caso esteja em TRIAL: calcular dia atual do trial (1 a 7)
      if (sub.status === 'TRIAL' && sub.trial_started_at) {
        const start = new Date(sub.trial_started_at);
        const diffMs = now - start;
        const currentDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

        if (currentDay >= 1 && currentDay <= 7) {
          const eventKey = `DAY_${currentDay}_${currentDay === 1 ? 'WELCOME' : (currentDay === 3 ? 'VALUE' : (currentDay === 5 ? 'OFFER' : (currentDay === 6 ? 'REMINDER' : (currentDay === 7 ? 'FINAL' : 'FOLLOWUP'))))}`;
          if (!this.hasEventBeenSent(student.id, eventKey)) {
            this.triggerEvent(student.id, eventKey);
          }
        } else if (currentDay > 7 && sub.status === 'TRIAL') {
          // Expirar trial
          sub.status = 'EXPIRED';
          if (typeof saveUserSubscription === 'function') saveUserSubscription(sub);
          this.triggerEvent(student.id, 'DAY_7_FINAL');
        }
      }

      // 2. Caso esteja em ACTIVE: verificar se vence em 3 dias, 1 dia ou hoje
      if (sub.status === 'ACTIVE' && sub.subscription_expires_at) {
        const expiry = new Date(sub.subscription_expires_at);
        const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

        if (diffDays <= 3 && diffDays > 0) {
          const eventKey = `RENEWAL_D_${diffDays}`;
          if (!this.hasEventBeenSent(student.id, eventKey)) {
            const template = this.templates.EXPIRING_SOON_RENEWAL(studentName, diffDays);
            this.logMessage(student.id, eventKey, student.name, student.phone || OFFICIAL_WHATSAPP_NUMBER, template);
          }
        } else if (diffDays <= 0) {
          // Venceu
          sub.status = 'EXPIRED';
          if (typeof saveUserSubscription === 'function') saveUserSubscription(sub);
          if (!this.hasEventBeenSent(student.id, 'EXPIRED_NOTICE')) {
            const template = this.templates.DAY_7_FINAL(studentName);
            this.logMessage(student.id, 'EXPIRED_NOTICE', student.name, student.phone || OFFICIAL_WHATSAPP_NUMBER, template);
          }
        }
      }
    });
  }
};

// Executar scheduler na inicialização e a cada 1 hora
if (typeof window !== 'undefined') {
  window.WhatsAppService = WhatsAppService;
  setTimeout(() => WhatsAppService.runDailyScheduler(), 2000);
  setInterval(() => WhatsAppService.runDailyScheduler(), 3600000);
}
