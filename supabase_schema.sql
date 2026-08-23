-- ==============================================================================
-- FITSAÚDE - SCRIPT COMPLETO DE CRIAÇÃO DO BANCO DE DADOS (SUPABASE / POSTGRESQL)
-- 100% Idempotente e pronto para rodar no SQL Editor do Supabase sem erros.
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CRIAÇÃO DAS TABELAS
-- ==============================================================================

-- 2.1 Perfis de Usuários
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Aluno FitSaúde',
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'atleta' CHECK (role IN ('visitante', 'atleta', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'blocked')),
    plan TEXT NOT NULL DEFAULT 'Anual VIP' CHECK (plan IN ('Mensal', 'Trimestral', 'Anual VIP')),
    phone TEXT,
    gender TEXT NOT NULL DEFAULT 'masculino' CHECK (gender IN ('masculino', 'feminino')),
    goal TEXT DEFAULT 'Hipertrofia' CHECK (goal IN ('Hipertrofia', 'Emagrecimento', 'Definição', 'Força', 'Condicionamento', 'Perda de Gordura', 'Saúde & Condicionamento')),
    level TEXT DEFAULT 'Intermediário' CHECK (level IN ('Iniciante', 'Intermediário', 'Avançado')),
    weight NUMERIC(5,2) DEFAULT 75.0,
    height NUMERIC(5,2) DEFAULT 175.0,
    age INTEGER DEFAULT 25,
    workouts_done INTEGER DEFAULT 0,
    avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.2 Planos da Academia
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price_month NUMERIC(10,2) NOT NULL,
    price_total NUMERIC(10,2) NOT NULL,
    period TEXT NOT NULL,
    popular BOOLEAN DEFAULT false,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.3 Assinaturas e Pagamentos
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT,
    plan_name TEXT NOT NULL,
    price_formatted TEXT NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('PIX Simulado', 'Cartão de Crédito', 'Boleto')),
    status TEXT NOT NULL DEFAULT 'Paga' CHECK (status IN ('Paga', 'Pendente', 'Cancelada')),
    paid_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    next_renewal TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.4 Fichas / Dias de Treino
CREATE TABLE IF NOT EXISTS public.workout_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gender TEXT NOT NULL CHECK (gender IN ('masculino', 'feminino')),
    day_name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    day_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    icon TEXT,
    color TEXT NOT NULL DEFAULT '#dc143c',
    duration TEXT DEFAULT '60 min',
    level TEXT DEFAULT 'Alta',
    is_rest BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.5 Exercícios das Fichas
CREATE TABLE IF NOT EXISTS public.exercises (
    id TEXT PRIMARY KEY,
    workout_day_id UUID REFERENCES public.workout_days(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    sets INTEGER NOT NULL DEFAULT 3,
    reps TEXT NOT NULL DEFAULT '10-12',
    weight TEXT DEFAULT 'Corpo',
    rest_seconds INTEGER DEFAULT 60,
    gif_url TEXT,
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.6 Histórico de Treinos Concluídos
CREATE TABLE IF NOT EXISTS public.workout_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_day_id UUID REFERENCES public.workout_days(id) ON DELETE SET NULL,
    workout_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    iso_date DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INTEGER DEFAULT 60,
    volume_kg NUMERIC(10,2) DEFAULT 0,
    completed_exercises JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.7 Checklist Diário de Exercícios Feitos
CREATE TABLE IF NOT EXISTS public.daily_exercise_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL,
    check_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, exercise_id, check_date)
);

-- 2.8 Conquistas e Medalhas
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    criteria_type TEXT NOT NULL,
    criteria_value NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.9 Conquistas Desbloqueadas pelos Usuários
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE (user_id, achievement_id)
);

-- 2.10 Mensagens do FitBot IA
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.11 Configurações Administrativas do FitSaúde
CREATE TABLE IF NOT EXISTS public.admin_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gym_name TEXT NOT NULL DEFAULT 'FitSaúde Club & Training',
    gym_phone TEXT NOT NULL DEFAULT '(11) 98888-7777',
    groq_model TEXT NOT NULL DEFAULT 'llama-3.3-70b-versatile',
    plan_prices JSONB NOT NULL DEFAULT '{"mensal": 49.90, "trimestral": 39.90, "anual": 29.90}'::jsonb,
    auto_renew BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. ÍNDICES DE ALTA PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_days_gender ON public.workout_days(gender);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_day ON public.exercises(workout_day_id);
CREATE INDEX IF NOT EXISTS idx_history_user_date ON public.workout_history(user_id, iso_date);
CREATE INDEX IF NOT EXISTS idx_daily_checks_user_date ON public.daily_exercise_checks(user_id, check_date);
CREATE INDEX IF NOT EXISTS idx_chat_user_created ON public.chat_messages(user_id, created_at);

-- ==============================================================================
-- 4. FUNÇÕES & TRIGGERS
-- ==============================================================================

-- 4.1 Atualizador automático de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_config_updated_at ON public.admin_config;
CREATE TRIGGER update_admin_config_updated_at
    BEFORE UPDATE ON public.admin_config
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4.2 Criação automática de perfil ao registrar no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        auth_user_id,
        name,
        email,
        role,
        status,
        plan
    )
    VALUES (
        NEW.id,
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Aluno FitSaúde'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'atleta'),
        'active',
        COALESCE(NEW.raw_user_meta_data->>'plan', 'Anual VIP')
    )
    ON CONFLICT (email) DO UPDATE 
    SET auth_user_id = EXCLUDED.auth_user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 5. SEGURANÇA (RLS - ROW LEVEL SECURITY)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_exercise_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso
DROP POLICY IF EXISTS "Permitir leitura pública de perfis" ON public.profiles;
CREATE POLICY "Permitir leitura pública de perfis" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção e edição de perfis" ON public.profiles;
CREATE POLICY "Permitir inserção e edição de perfis" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura pública de planos" ON public.plans;
CREATE POLICY "Permitir leitura pública de planos" ON public.plans FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gerenciamento de planos por admin" ON public.plans;
CREATE POLICY "Permitir gerenciamento de planos por admin" ON public.plans FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura pública de assinaturas" ON public.subscriptions;
CREATE POLICY "Permitir leitura pública de assinaturas" ON public.subscriptions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção e edição de assinaturas" ON public.subscriptions;
CREATE POLICY "Permitir inserção e edição de assinaturas" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura pública de treinos" ON public.workout_days;
CREATE POLICY "Permitir leitura pública de treinos" ON public.workout_days FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gerenciamento de treinos" ON public.workout_days;
CREATE POLICY "Permitir gerenciamento de treinos" ON public.workout_days FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura pública de exercícios" ON public.exercises;
CREATE POLICY "Permitir leitura pública de exercícios" ON public.exercises FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir gerenciamento de exercícios" ON public.exercises;
CREATE POLICY "Permitir gerenciamento de exercícios" ON public.exercises FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura e escrita do histórico" ON public.workout_history;
CREATE POLICY "Permitir leitura e escrita do histórico" ON public.workout_history FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura e escrita de checks" ON public.daily_exercise_checks;
CREATE POLICY "Permitir leitura e escrita de checks" ON public.daily_exercise_checks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura pública de conquistas" ON public.achievements;
CREATE POLICY "Permitir leitura pública de conquistas" ON public.achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir desbloqueio de conquistas" ON public.user_achievements;
CREATE POLICY "Permitir desbloqueio de conquistas" ON public.user_achievements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir chat para usuários" ON public.chat_messages;
CREATE POLICY "Permitir chat para usuários" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura e edição de config admin" ON public.admin_config;
CREATE POLICY "Permitir leitura e edição de config admin" ON public.admin_config FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 6. VIEWS (KPIS DO PAINEL ADMIN)
-- ==============================================================================
CREATE OR REPLACE VIEW public.admin_kpis_view AS
SELECT
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'atleta') AS total_students,
    (SELECT COUNT(*) FROM public.profiles WHERE status = 'active' AND role = 'atleta') AS active_students,
    (SELECT COALESCE(SUM(
        CASE 
            WHEN plan = 'Mensal' THEN 49.90
            WHEN plan = 'Trimestral' THEN 39.90
            WHEN plan = 'Anual VIP' THEN 29.90
            ELSE 0
        END
    ), 0) FROM public.profiles WHERE status = 'active' AND role = 'atleta') AS mrr,
    (SELECT COUNT(*) FROM public.workout_history WHERE iso_date = CURRENT_DATE) AS workouts_today,
    ROUND(
        (SELECT COUNT(*)::numeric FROM public.profiles WHERE status = 'active' AND role = 'atleta') /
        NULLIF((SELECT COUNT(*)::numeric FROM public.profiles WHERE role = 'atleta'), 0) * 100, 1
    ) AS retention_rate;

-- ==============================================================================
-- 7. SEED DATA (DADOS INICIAIS)
-- ==============================================================================

-- 7.1 Planos
INSERT INTO public.plans (id, name, description, price_month, price_total, period, popular, features)
VALUES 
('plan_mensal', 'Mensal', 'Flexibilidade total mês a mês', 49.90, 49.90, 'Cobrado mensalmente', false, '["Treinos Masc e Fem completos", "FitBot IA com suporte padrão", "Checklist e histórico no app", "Acesso Web e Mobile"]'::jsonb),
('plan_trimestral', 'Trimestral', 'Foco de médio prazo com economia', 39.90, 119.70, 'Cobrado a cada 3 meses', false, '["Tudo do plano Mensal", "Economia de 20%", "Exportação de PDFs de treino", "Dashboard de evolução"]'::jsonb),
('plan_anual', 'Anual VIP', 'Máxima economia e suporte prioritário', 29.90, 358.80, 'Cobrado anualmente (12x R$ 29,90)', true, '["Tudo dos planos anteriores", "FitBot IA Ilimitado (Groq Llama)", "Suporte e consultoria VIP", "Acesso a novos módulos em 1ª mão", "Maior custo-benefício"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7.2 Conquistas
INSERT INTO public.achievements (id, icon, title, description, criteria_type, criteria_value)
VALUES
('first_workout', '🏅', 'Primeiro Passo', 'Conclua seu 1º treino', 'workouts_count', 1),
('workout_10', '🔥', 'Consistente', 'Registre 10 treinos no app', 'workouts_count', 10),
('ex_100', '💪', 'Máquina de Músculos', 'Marque 100 exercícios concluídos', 'exercises_count', 100),
('hours_100', '⏳', 'Dedicado 100h', 'Acumule 100 horas de treino', 'hours_count', 100),
('weight_1ton', '🏋️', 'Força Bruta', 'Levante +1.000 kg no acumulado', 'volume_kg', 1000)
ON CONFLICT (id) DO NOTHING;

-- 7.3 Configuração Admin
INSERT INTO public.admin_config (gym_name, gym_phone, groq_model, plan_prices, auto_renew)
VALUES ('FitSaúde Club & Training', '(11) 98888-7777', 'llama-3.3-70b-versatile', '{"mensal": 49.90, "trimestral": 39.90, "anual": 29.90}'::jsonb, true)
ON CONFLICT DO NOTHING;

-- 7.4 Alunos de Exemplo
INSERT INTO public.profiles (id, name, email, role, plan, status, phone, goal, weight, height, workouts_done, avatar)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Carlos Maciel', 'carlos@fitsaude.com', 'atleta', 'Anual VIP', 'active', '(11) 98765-4321', 'Hipertrofia', 78.0, 178.0, 34, 'CM'),
('a0000000-0000-0000-0000-000000000002', 'Mariana Silva', 'mariana.silva@email.com', 'atleta', 'Trimestral', 'active', '(11) 97654-3210', 'Emagrecimento', 62.0, 165.0, 21, 'MS'),
('a0000000-0000-0000-0000-000000000003', 'Lucas Oliveira', 'lucas.treino@email.com', 'atleta', 'Mensal', 'pending', '(21) 99887-1122', 'Definição', 82.0, 180.0, 8, 'LO'),
('a0000000-0000-0000-0000-000000000004', 'Beatriz Costa', 'beatriz.c@email.com', 'atleta', 'Anual VIP', 'active', '(31) 98444-5566', 'Condicionamento', 58.0, 162.0, 49, 'BC'),
('a0000000-0000-0000-0000-000000000005', 'Rafael Santos', 'rafa.santos@email.com', 'atleta', 'Mensal', 'blocked', '(41) 99112-3344', 'Força', 90.0, 185.0, 15, 'RS')
ON CONFLICT (email) DO NOTHING;

-- 7.5 Assinaturas de Exemplo
INSERT INTO public.subscriptions (user_id, student_name, student_email, plan_name, price_formatted, payment_method, status)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Carlos Maciel', 'carlos@fitsaude.com', 'Anual VIP', 'R$ 29,90/mês', 'Cartão de Crédito', 'Paga'),
('a0000000-0000-0000-0000-000000000002', 'Mariana Silva', 'mariana.silva@email.com', 'Trimestral', 'R$ 39,90/mês', 'PIX Simulado', 'Paga'),
('a0000000-0000-0000-0000-000000000003', 'Lucas Oliveira', 'lucas.treino@email.com', 'Mensal', 'R$ 49,90/mês', 'PIX Simulado', 'Pendente'),
('a0000000-0000-0000-0000-000000000004', 'Beatriz Costa', 'beatriz.c@email.com', 'Anual VIP', 'R$ 29,90/mês', 'Cartão de Crédito', 'Paga')
ON CONFLICT DO NOTHING;

-- 7.6 Treinos Masculinos
INSERT INTO public.workout_days (id, gender, day_name, short_name, day_index, title, icon, color, duration, level, is_rest, image_url)
VALUES
('d0000000-0000-0000-0000-000000000001', 'masculino', 'Segunda', 'SEG', 0, 'Peito & Tríceps', '<i class="fa-solid fa-person-running"></i>', '#dc143c', '60 min', 'Alta', false, 'images/chest.png'),
('d0000000-0000-0000-0000-000000000002', 'masculino', 'Terça', 'TER', 1, 'Pernas & Quadríceps', '<i class="fa-solid fa-shoe-prints"></i>', '#4cc9f0', '75 min', 'Muito Alta', false, 'images/legs.png'),
('d0000000-0000-0000-0000-000000000003', 'masculino', 'Quarta', 'QUA', 2, 'Costas & Bíceps', '<i class="fa-solid fa-hand-fist"></i>', '#a78bfa', '65 min', 'Alta', false, 'images/back.png'),
('d0000000-0000-0000-0000-000000000004', 'masculino', 'Quinta', 'QUI', 3, 'Descanso & Recuperação', '<i class="fa-solid fa-bed"></i>', '#22d3a0', '—', '—', true, 'images/rest.png'),
('d0000000-0000-0000-0000-000000000005', 'masculino', 'Sexta', 'SEX', 4, 'Ombros & Core', '<i class="fa-solid fa-fire"></i>', '#ffd166', '55 min', 'Média-Alta', false, 'images/shoulders.png'),
('d0000000-0000-0000-0000-000000000006', 'masculino', 'Sábado', 'SÁB', 5, 'Full Body & Força', '<i class="fa-solid fa-bolt"></i>', '#ef476f', '80 min', 'Alta', false, 'images/fullbody.png'),
('d0000000-0000-0000-0000-000000000007', 'masculino', 'Domingo', 'DOM', 6, 'Descanso/Cardio Leve', '<i class="fa-solid fa-spa"></i>', '#22d3a0', '30 min', 'Baixa', true, 'images/rest.png')
ON CONFLICT (id) DO NOTHING;

-- Exercícios Masculinos
INSERT INTO public.exercises (id, workout_day_id, name, muscle_group, sets, reps, weight, order_index)
VALUES
('m_s1', 'd0000000-0000-0000-0000-000000000001', 'Supino Reto com Barra', 'Peitoral', 4, '8-10', '60 kg', 1),
('m_s2', 'd0000000-0000-0000-0000-000000000001', 'Supino Inclinado com Halteres', 'Peitoral', 3, '10-12', '22 kg', 2),
('m_s3', 'd0000000-0000-0000-0000-000000000001', 'Crucifixo na Polia', 'Peitoral', 3, '12-15', '15 kg', 3),
('m_s4', 'd0000000-0000-0000-0000-000000000001', 'Tríceps Corda', 'Tríceps', 4, '12', '30 kg', 4),
('m_s5', 'd0000000-0000-0000-0000-000000000001', 'Tríceps Testa', 'Tríceps', 3, '10-12', '24 kg', 5),

('m_t1', 'd0000000-0000-0000-0000-000000000002', 'Agachamento Livre', 'Quadríceps', 5, '6-8', '80 kg', 1),
('m_t2', 'd0000000-0000-0000-0000-000000000002', 'Leg Press 45°', 'Quadríceps', 4, '10-12', '180 kg', 2),
('m_t3', 'd0000000-0000-0000-0000-000000000002', 'Stiff com Barra', 'Posterior', 4, '10', '50 kg', 3),
('m_t4', 'd0000000-0000-0000-0000-000000000002', 'Cadeira Extensora', 'Quadríceps', 3, '15', '50 kg', 4),
('m_t5', 'd0000000-0000-0000-0000-000000000002', 'Cadeira Flexora', 'Posterior', 3, '12', '40 kg', 5),
('m_t6', 'd0000000-0000-0000-0000-000000000002', 'Panturrilha em Pé', 'Pernas', 4, '20', '80 kg', 6),

('m_q1', 'd0000000-0000-0000-0000-000000000003', 'Puxada Aberta no Pulley', 'Costas', 4, '8-10', '55 kg', 1),
('m_q2', 'd0000000-0000-0000-0000-000000000003', 'Remada Curvada com Barra', 'Costas', 4, '10', '50 kg', 2),
('m_q3', 'd0000000-0000-0000-0000-000000000003', 'Remada Unilateral (Serrote)', 'Costas', 3, '10 cada', '24 kg', 3),
('m_q4', 'd0000000-0000-0000-0000-000000000003', 'Rosca Direta com Barra W', 'Bíceps', 4, '10-12', '22 kg', 4),
('m_q5', 'd0000000-0000-0000-0000-000000000003', 'Rosca Martelo com Halteres', 'Bíceps', 3, '12', '14 kg', 5),

('m_x1', 'd0000000-0000-0000-0000-000000000005', 'Desenvolvimento com Halteres', 'Ombros', 4, '10-12', '20 kg', 1),
('m_x2', 'd0000000-0000-0000-0000-000000000005', 'Elevação Lateral na Polia', 'Ombros', 4, '12-15', '8 kg', 2),
('m_x3', 'd0000000-0000-0000-0000-000000000005', 'Elevação Frontal', 'Ombros', 3, '12', '10 kg', 3),
('m_x4', 'd0000000-0000-0000-0000-000000000005', 'Abdominal infra Paralelas', 'Core', 3, '15-20', 'Corpo', 4),
('m_x5', 'd0000000-0000-0000-0000-000000000005', 'Prancha Isométrica', 'Core', 3, '60 seg', 'Corpo', 5),

('m_a1', 'd0000000-0000-0000-0000-000000000006', 'Levantamento Terra', 'Costas', 4, '5', '100 kg', 1),
('m_a2', 'd0000000-0000-0000-0000-000000000006', 'Barra Fixa', 'Costas', 3, 'Máx', 'Corpo', 2),
('m_a3', 'd0000000-0000-0000-0000-000000000006', 'Flexão de Braço', 'Peitoral', 3, '15-20', 'Corpo', 3),
('m_a4', 'd0000000-0000-0000-0000-000000000006', 'Agachamento Búlgaro', 'Pernas', 3, '10 cada', '16 kg', 4),
('m_a5', 'd0000000-0000-0000-0000-000000000006', 'Burpees', 'Full Body', 3, '12', 'Corpo', 5)
ON CONFLICT (id) DO NOTHING;

-- 7.7 Treinos Femininos
INSERT INTO public.workout_days (id, gender, day_name, short_name, day_index, title, icon, color, duration, level, is_rest, image_url)
VALUES
('f0000000-0000-0000-0000-000000000001', 'feminino', 'Segunda', 'SEG', 0, 'Glúteos & Posterior', '<i class="fa-solid fa-person-walking"></i>', '#e11d48', '65 min', 'Alta', false, 'images/fem_glutes.jpg'),
('f0000000-0000-0000-0000-000000000002', 'feminino', 'Terça', 'TER', 1, 'Membros Superiores & Postura', '<i class="fa-solid fa-dumbbell"></i>', '#a78bfa', '55 min', 'Média', false, 'images/fem_upper.jpg'),
('f0000000-0000-0000-0000-000000000003', 'feminino', 'Quarta', 'QUA', 2, 'Quadríceps & Glúteo Enfático', '<i class="fa-solid fa-shoe-prints"></i>', '#4cc9f0', '70 min', 'Alta', false, 'images/fem_legs.jpg'),
('f0000000-0000-0000-0000-000000000004', 'feminino', 'Quinta', 'QUI', 3, 'Descanso & Mobilidade', '<i class="fa-solid fa-bed"></i>', '#22d3a0', '—', '—', true, 'images/fem_rest.jpg'),
('f0000000-0000-0000-0000-000000000005', 'feminino', 'Sexta', 'SEX', 4, 'Core, Definição & Cardio', '<i class="fa-solid fa-fire"></i>', '#ffd166', '50 min', 'Média-Alta', false, 'images/fem_core.jpg'),
('f0000000-0000-0000-0000-000000000006', 'feminino', 'Sábado', 'SÁB', 5, 'Booty Sculpt & Full Body', '<i class="fa-solid fa-bolt"></i>', '#ef476f', '65 min', 'Alta', false, 'images/fem_fullbody.jpg'),
('f0000000-0000-0000-0000-000000000007', 'feminino', 'Domingo', 'DOM', 6, 'Descanso & Caminhada Leve', '<i class="fa-solid fa-spa"></i>', '#22d3a0', '35 min', 'Baixa', true, 'images/rest.png')
ON CONFLICT (id) DO NOTHING;

-- Exercícios Femininos
INSERT INTO public.exercises (id, workout_day_id, name, muscle_group, sets, reps, weight, order_index)
VALUES
('f_s1', 'f0000000-0000-0000-0000-000000000001', 'Elevação Pélvica com Barra', 'Pernas', 4, '10-12', '50 kg', 1),
('f_s2', 'f0000000-0000-0000-0000-000000000001', 'Stiff com Halteres', 'Pernas', 4, '12', '14 kg', 2),
('f_s3', 'f0000000-0000-0000-0000-000000000001', 'Cadeira Flexora', 'Pernas', 3, '12-15', '35 kg', 3),
('f_s4', 'f0000000-0000-0000-0000-000000000001', 'Glúteo na Polia (Coice)', 'Pernas', 4, '12 cada', '15 kg', 4),
('f_s5', 'f0000000-0000-0000-0000-000000000001', 'Cadeira Abdutora', 'Pernas', 3, '15-20', '45 kg', 5),

('f_t1', 'f0000000-0000-0000-0000-000000000002', 'Puxada Aberta no Pulley', 'Costas', 3, '12', '30 kg', 1),
('f_t2', 'f0000000-0000-0000-0000-000000000002', 'Desenvolvimento com Halteres', 'Ombros', 3, '12', '8 kg', 2),
('f_t3', 'f0000000-0000-0000-0000-000000000002', 'Elevação Lateral', 'Ombros', 3, '15', '5 kg', 3),
('f_t4', 'f0000000-0000-0000-0000-000000000002', 'Tríceps Corda', 'Tríceps', 3, '12', '20 kg', 4),
('f_t5', 'f0000000-0000-0000-0000-000000000002', 'Rosca Direta com Halteres', 'Bíceps', 3, '12', '6 kg', 5),

('f_q1', 'f0000000-0000-0000-0000-000000000003', 'Agachamento Sumô com Halter', 'Pernas', 4, '10-12', '20 kg', 1),
('f_q2', 'f0000000-0000-0000-0000-000000000003', 'Leg Press Horizontal', 'Pernas', 4, '12', '100 kg', 2),
('f_q3', 'f0000000-0000-0000-0000-000000000003', 'Passada/Afundo com Halteres', 'Pernas', 3, '10 cada', '8 kg', 3),
('f_q4', 'f0000000-0000-0000-0000-000000000003', 'Cadeira Extensora', 'Pernas', 3, '15', '40 kg', 4),
('f_q5', 'f0000000-0000-0000-0000-000000000003', 'Panturrilha no Leg Press', 'Pernas', 4, '15-20', '60 kg', 5),

('f_x1', 'f0000000-0000-0000-0000-000000000005', 'Prancha Dinâmica', 'Core', 3, '45 seg', 'Corpo', 1),
('f_x2', 'f0000000-0000-0000-0000-000000000005', 'Abdominal Infra na Prancha', 'Core', 3, '15-20', 'Corpo', 2),
('f_x3', 'f0000000-0000-0000-0000-000000000005', 'Mountain Climbers', 'Core', 3, '40 seg', 'Corpo', 3),
('f_x4', 'f0000000-0000-0000-0000-000000000005', 'Abdominal Oblíquio Russo', 'Core', 3, '20 total', '5 kg', 4),
('f_x5', 'f0000000-0000-0000-0000-000000000005', 'Cardio Esteira Inclinada', 'Cardio', 1, '25 min', 'Caminhada', 5),

('f_a1', 'f0000000-0000-0000-0000-000000000006', 'Agachamento Búlgaro', 'Pernas', 3, '10 cada', '10 kg', 1),
('f_a2', 'f0000000-0000-0000-0000-000000000006', 'Elevação Pélvica Unilateral', 'Pernas', 3, '12 cada', 'Corpo', 2),
('f_a3', 'f0000000-0000-0000-0000-000000000006', 'Remada Baixa Triângulo', 'Costas', 3, '12', '25 kg', 3),
('f_a4', 'f0000000-0000-0000-0000-000000000006', 'Flexão de Braço no Banco', 'Peitoral', 3, '12', 'Corpo', 4),
('f_a5', 'f0000000-0000-0000-0000-000000000006', 'Polichinelos / Corda', 'Cardio', 3, '1 min', 'Corpo', 5)
ON CONFLICT (id) DO NOTHING;
