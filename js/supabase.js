/* ══════════════════════════════════════════════════════════════════
   FITSAÚDE - SUPABASE CLIENT & CLOUD SYNC MODULE (MVP)
   Conexão com Supabase Database, Auth, Storage e Assinaturas
   ══════════════════════════════════════════════════════════════════ */

const SUPABASE_CONFIG = {
  url: 'https://rowibltqabfxkvsrbgmk.supabase.co',
  publishableKey: 'sb_publishable_1Zbz73akRIVpS-ZJ7sXX5w_xzIU7uPa'
};

let supabaseClient = null;

function getSupabase() {
  if (!supabaseClient) {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      supabaseClient = supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.publishableKey
      );
      console.log('⚡ [FitSaúde] Conectado com sucesso ao Supabase!');
    } else {
      console.warn('⚠️ [FitSaúde] Biblioteca Supabase JS não carregada.');
    }
  }
  return supabaseClient;
}

// ── Sincronização e Leitura Global ─────────────────────────────

/**
 * Inicializa e sincroniza os dados do Supabase para o cache local
 */
async function syncAllDataFromSupabase() {
  const sb = getSupabase();
  if (!sb) return;

  try {
    // 1. Carregar Alunos/Perfis
    const { data: profiles, error: pErr } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
    if (!pErr && profiles && profiles.length > 0) {
      const formattedStudents = profiles.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        plan: p.plan || 'FitSaúde',
        status: p.status || 'active',
        subscription_status: p.subscription_status || 'TRIAL',
        joined: new Date(p.created_at).toLocaleDateString('pt-BR'),
        phone: p.phone || '(62) 99439-0943',
        goal: p.goal || 'Hipertrofia',
        weight: Number(p.weight) || 75,
        height: Number(p.height) || 175,
        workoutsDone: p.workouts_done || 0,
        avatar: p.avatar || (p.name ? p.name.slice(0, 2).toUpperCase() : 'FS')
      }));
      localStorage.setItem('fitsaude_students_db_v2', JSON.stringify(formattedStudents));
      console.log('📥 [FitSaúde] Alunos sincronizados do Supabase:', formattedStudents.length);
    }

    // 2. Carregar Assinaturas
    const { data: subs, error: sErr } = await sb.from('subscriptions').select('*').order('created_at', { ascending: false });
    if (!sErr && subs && subs.length > 0) {
      const formattedSubs = subs.map(s => ({
        id: s.id,
        student: s.student_name,
        plan: s.plan_name || 'FitSaúde',
        val: s.price_formatted || 'R$ 29,90/mês',
        method: s.payment_method || 'PIX Oficial',
        status: s.status,
        date: new Date(s.paid_at || s.created_at).toLocaleDateString('pt-BR')
      }));
      localStorage.setItem('fitsaude_subscriptions_db_v2', JSON.stringify(formattedSubs));
      console.log('📥 [FitSaúde] Assinaturas sincronizadas do Supabase:', formattedSubs.length);
    }

    // Atualizar telas se ativas
    if (typeof renderAdminDashboard === 'function') renderAdminDashboard();
    if (typeof renderAdminAlunos === 'function') renderAdminAlunos();
    if (typeof renderAdminPendingPayments === 'function') renderAdminPendingPayments();

  } catch (err) {
    console.warn('⚠️ [FitSaúde] Falha ao sincronizar dados em nuvem (usando cache local):', err);
  }
}

/**
 * Salva/Atualiza o perfil do aluno no Supabase
 */
async function syncProfileToSupabase(profileData) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('profiles')
      .upsert({
        name: profileData.name,
        email: profileData.email || 'carlos@fitsaude.com',
        gender: profileData.gender || 'masculino',
        age: profileData.age || 25,
        height: profileData.height || 175,
        weight: profileData.weight || 75,
        goal: profileData.goal || 'Hipertrofia',
        level: profileData.level || 'Intermediário',
        role: profileData.role || 'atleta',
        status: profileData.status || 'active',
        subscription_status: profileData.subscription_status || 'TRIAL',
        plan: profileData.plan || 'FitSaúde',
        workouts_done: profileData.workoutsDone || profileData.workouts_done || 0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' })
      .select();

    if (error) throw error;
    console.log('☁️ [FitSaúde] Perfil sincronizado com o Supabase com sucesso!');
    return data;
  } catch (err) {
    console.error('❌ [FitSaúde] Erro ao sincronizar perfil no Supabase:', err);
    return null;
  }
}

/**
 * Registra uma nova assinatura no Supabase
 */
async function syncSubscriptionToSupabase(subData) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('subscriptions')
      .insert([{
        student_name: subData.student,
        student_email: subData.email || null,
        plan_name: subData.plan || 'FitSaúde',
        price_formatted: subData.val || 'R$ 29,90/mês',
        payment_method: subData.method || 'PIX Oficial',
        status: subData.status || 'Paga'
      }])
      .select();

    if (error) throw error;
    console.log('💳 [FitSaúde] Assinatura gravada no Supabase!');
    return data;
  } catch (err) {
    console.error('❌ [FitSaúde] Erro ao gravar assinatura:', err);
    return null;
  }
}

// Auto-inicializar sincronização ao carregar
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    getSupabase();
    syncAllDataFromSupabase();
  });
}
