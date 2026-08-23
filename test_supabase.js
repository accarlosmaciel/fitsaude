const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rowibltqabfxkvsrbgmk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_1Zbz73akRIVpS-ZJ7sXX5w_xzIU7uPa';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function testDatabase() {
  console.log('🔄 Testando conexão com Supabase em:', SUPABASE_URL);
  let allPass = true;

  // 1. Testar tabela profiles
  try {
    const { data: profiles, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    console.log(`✅ [PROFILES] OK! Total de perfis encontrados: ${profiles.length}`);
    profiles.forEach(p => console.log(`   - ${p.name} (${p.email}) - Plano: ${p.plan}`));
  } catch (err) {
    console.error('❌ [PROFILES] Erro:', err.message);
    allPass = false;
  }

  // 2. Testar tabela plans
  try {
    const { data: plans, error } = await supabase.from('plans').select('*');
    if (error) throw error;
    console.log(`✅ [PLANS] OK! Total de planos cadastrados: ${plans.length}`);
    plans.forEach(p => console.log(`   - ${p.name}: R$ ${p.price_month}/mês`));
  } catch (err) {
    console.error('❌ [PLANS] Erro:', err.message);
    allPass = false;
  }

  // 3. Testar tabela workout_days & exercises
  try {
    const { data: days, error } = await supabase.from('workout_days').select('*');
    if (error) throw error;
    console.log(`✅ [WORKOUT_DAYS] OK! Total de rotinas de treino: ${days.length}`);

    const { data: exercises, error: errEx } = await supabase.from('exercises').select('*');
    if (errEx) throw errEx;
    console.log(`✅ [EXERCISES] OK! Total de exercícios cadastrados: ${exercises.length}`);
  } catch (err) {
    console.error('❌ [WORKOUTS] Erro:', err.message);
    allPass = false;
  }

  // 4. Testar tabela subscriptions
  try {
    const { data: subs, error } = await supabase.from('subscriptions').select('*');
    if (error) throw error;
    console.log(`✅ [SUBSCRIPTIONS] OK! Total de assinaturas: ${subs.length}`);
  } catch (err) {
    console.error('❌ [SUBSCRIPTIONS] Erro:', err.message);
    allPass = false;
  }

  // 5. Testar tabela achievements
  try {
    const { data: ach, error } = await supabase.from('achievements').select('*');
    if (error) throw error;
    console.log(`✅ [ACHIEVEMENTS] OK! Total de medalhas/conquistas: ${ach.length}`);
  } catch (err) {
    console.error('❌ [ACHIEVEMENTS] Erro:', err.message);
    allPass = false;
  }

  // 6. Testar view admin_kpis_view
  try {
    const { data: kpis, error } = await supabase.from('admin_kpis_view').select('*').single();
    if (error) throw error;
    console.log(`✅ [ADMIN_KPIS_VIEW] OK! KPIs em tempo real:`, kpis);
  } catch (err) {
    console.error('❌ [ADMIN_KPIS_VIEW] Erro:', err.message);
    allPass = false;
  }

  console.log('\n===========================================');
  if (allPass) {
    console.log('🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
  } else {
    console.log('⚠️ ALGUNS TESTES FALHARAM.');
  }
  console.log('===========================================');
  process.exit(allPass ? 0 : 1);
}

testDatabase();
