/**
 * FITSAÚDE - DEFINIÇÕES DE TIPOS & CONTRATOS TYPESCRIPT
 * Estrutura 100% preparada para migração para React + TypeScript
 */

export type UserRole = 'visitante' | 'atleta' | 'admin';

export type PlanType = 'Mensal' | 'Trimestral' | 'Anual VIP';

export type PaymentStatus = 'Paga' | 'Pendente' | 'Cancelada';

export type StudentStatus = 'active' | 'pending' | 'blocked';

export type GenderMode = 'masculino' | 'feminino';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan?: PlanType;
  status: StudentStatus;
  joined: string;
  phone?: string;
  goal?: 'Hipertrofia' | 'Emagrecimento' | 'Definição' | 'Força' | 'Condicionamento';
  level?: 'Iniciante' | 'Intermediário' | 'Avançado';
  weight?: number;
  height?: number;
  age?: number;
  workoutsDone?: number;
  avatar?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  sets: number;
  reps: string;
  weight?: string;
  restSec?: number;
  gifUrl?: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  short: string;
  name: string;
  icon: string;
  color: string;
  dur: string;
  lvl: string;
  rest: boolean;
  image: string;
  exercises: Exercise[];
}

export interface Plan {
  id: string;
  name: PlanType;
  description: string;
  priceMonth: number;
  priceTotal: number;
  period: string;
  popular?: boolean;
  features: string[];
}

export interface Subscription {
  id: string;
  student: string;
  studentId?: string;
  plan: PlanType;
  val: string;
  method: 'PIX Simulado' | 'Cartão de Crédito' | 'Boleto';
  status: PaymentStatus;
  date: string;
  nextRenewal?: string;
}

export interface AdminKPIs {
  totalStudents: number;
  activeStudents: number;
  mrr: number;
  workoutsToday: number;
  retentionRate: number;
}
