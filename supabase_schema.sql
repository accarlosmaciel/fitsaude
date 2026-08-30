-- ==============================================================================
-- FITSAÚDE - SCRIPT COMPLETO DE CRIAÇÃO DO BANCO DE DADOS (SUPABASE / POSTGRESQL)
-- MVP: 7 Dias Grátis | Plano FitSaúde R$ 29,90/mês | PIX & WhatsApp Oficial
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
    subscription_status TEXT NOT NULL DEFAULT 'TRIAL' CHECK (subscription_status IN ('TRIAL', 'ACTIVE', 'PENDING_PAYMENT', 'EXPIRED', 'BLOCKED')),
    plan TEXT NOT NULL DEFAULT 'FitSaúde',
    phone TEXT DEFAULT '(62) 99439-0943',
    gender TEXT NOT NULL DEFAULT 'masculino' CHECK (gender IN ('masculino', 'feminino')),
    goal TEXT DEFAULT 'Hipertrofia' CHECK (goal IN ('Hipertrofia', 'Emagrecimento', 'Definição', 'Força', 'Condicionamento', 'Perda de Gordura', 'Saúde & Condicionamento')),
    level TEXT DEFAULT 'Intermediário' CHECK (level IN ('Iniciante', 'Intermediário', 'Avançado')),
    weight NUMERIC(5,2) DEFAULT 75.0,
    height NUMERIC(5,2) DEFAULT 175.0,
    age INTEGER DEFAULT 25,
    workouts_done INTEGER DEFAULT 0,
    avatar TEXT,
    trial_started_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    trial_ends_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now() + interval '7 days'),
    subscription_started_at TIMESTAMPTZ,
    subscription_expires_at TIMESTAMPTZ,
    last_payment_at TIMESTAMPTZ,
    next_payment_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.2 Planos da Academia (Plano Único FitSaúde R$ 29,90)
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    price_month NUMERIC(10,2) NOT NULL,
    price_total NUMERIC(10,2) NOT NULL,
    period TEXT NOT NULL,
    trial_days INTEGER DEFAULT 7,
    pix_key TEXT DEFAULT '5f038f67-9fd9-44fc-8c50-b94e8c79e172',
    whatsapp_contact TEXT DEFAULT '+55 62 99439-0943',
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Inserir/Atualizar Plano Único
INSERT INTO public.plans (id, name, description, price_month, price_total, period, trial_days, pix_key, whatsapp_contact, features)
VALUES (
    'fitsaude_monthly',
    'FitSaúde',
    '7 dias de teste grátis com acesso completo a treinos, animações 3D, planilhas, PDFs e FitBot IA.',
    29.90,
    29.90,
    'Mensal',
    7,
    '5f038f67-9fd9-44fc-8c50-b94e8c79e172',
    '+55 62 99439-0943',
    '["7 Dias de Acesso Gratuito", "Acesso a todos os treinos Masc & Fem", "Player de Execução 3D com Cronômetro", "FitBot IA com Groq Llama 3.3", "Download de Planilhas e Relatórios PDF", "Suporte Oficial via WhatsApp"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    price_month = EXCLUDED.price_month,
    price_total = EXCLUDED.price_total,
    pix_key = EXCLUDED.pix_key,
    whatsapp_contact = EXCLUDED.whatsapp_contact;

-- 2.3 Assinaturas e Pagamentos
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT,
    plan_name TEXT NOT NULL DEFAULT 'FitSaúde',
    price_formatted TEXT NOT NULL DEFAULT 'R$ 29,90/mês',
    payment_method TEXT NOT NULL DEFAULT 'PIX Oficial',
    status TEXT NOT NULL DEFAULT 'Paga',
    paid_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    next_renewal TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.4 Histórico de Pagamentos (Auditoria)
CREATE TABLE IF NOT EXISTS public.payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_email TEXT,
    plan_name TEXT NOT NULL DEFAULT 'FitSaúde',
    amount NUMERIC(10,2) NOT NULL DEFAULT 29.90,
    amount_formatted TEXT NOT NULL DEFAULT 'R$ 29,90',
    payment_method TEXT NOT NULL DEFAULT 'PIX Oficial',
    status TEXT NOT NULL DEFAULT 'APROVADO',
    approved_by TEXT DEFAULT 'Super Admin',
    approved_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    next_due_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now() + interval '30 days')
);

-- 2.5 Logs de Mensagens WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    student_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SENT',
    sent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2.6 Fichas / Dias de Treino
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

-- 2.7 Exercícios das Fichas
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
