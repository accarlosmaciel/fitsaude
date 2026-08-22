# ⚛️ Guia de Arquitetura & Migração para React + TypeScript

Este documento mapeia todas as telas e componentes atuais do **FitSaúde** para a futura migração em **React + TypeScript**.

---

## 🗂️ Estrutura de Pastas Recomendada (React + TS)

```
src/
├── assets/                  # Imagens, GIFs e SVGs
├── components/              # Componentes reutilizáveis
│   ├── common/              # Button, Modal, Card, Toast, Badge
│   ├── layout/              # AppHeader, BottomNav, RoleTopBar
│   ├── player/              # WorkoutPlayer3D, RestTimer, RepsCounter
│   └── hydration/           # WaterTracker, WaterGoalChips
├── contexts/                # AuthContext, WorkoutContext, ThemeContext
├── hooks/                   # useWorkout, useHydration, useChatBot
├── pages/                   # Telas principais divididas por Perfil
│   ├── visitante/           # LandingPage, PlansPage, OnboardingModal
│   ├── atleta/              # WorkoutsPage, SheetsPage, SummaryPage, FitBotPage, ProfilePage, SubscriptionPage, SecurityPage
│   └── admin/               # DashboardPage, StudentsPage, StudentDetailPage, GlobalWorkoutsPage, ReportsPage, SubscriptionsPage, SettingsPage
├── services/                # storageService, pdfService, groqApiService
└── types/                   # user.ts, workout.ts, plan.ts, admin.ts
```

---

## 🧭 Mapeamento 1:1 de Telas e Componentes

| Tela Atual (HTML / JS) | Componente React Futuro | Types / Props |
| :--- | :--- | :--- |
| `screen-visitante-landing` | `<VisitorLanding />` | `void` |
| `screen-visitante-planos` | `<VisitorPlans onSelectPlan={startOnboarding} />` | `Plan[]` |
| `onboarding-modal-backdrop` | `<OnboardingModal step={step} plan={selectedPlan} />` | `OnboardingState` |
| `screen-treinos` | `<AthleteWorkouts gender={gender} activeDay={day} />` | `WorkoutDay[]` |
| `workout-player` | `<WorkoutPlayer exercise={currentEx} sets={sets} />` | `Exercise, SetProgress` |
| `screen-planilhas` | `<AthleteSheets onExportPdf={generatePdf} />` | `GenderMode` |
| `screen-resumo` | `<AthleteSummary stats={stats} />` | `StatsData` |
| `screen-chat` | `<FitBotChat messages={messages} onSend={sendMessage} />` | `ChatMessage[]` |
| `screen-perfil` | `<AthleteProfile user={user} onSave={saveUser} />` | `User` |
| `screen-atleta-assinatura` | `<AthleteSubscription sub={subscription} />` | `Subscription` |
| `screen-atleta-seguranca` | `<AthleteSecurity onLogout={logout} />` | `void` |
| `screen-admin-dashboard` | `<AdminDashboard kpis={kpis} />` | `AdminKPIs` |
| `screen-admin-alunos` | `<AdminStudents students={students} onSelect={openDetail} />` | `Student[]` |
| `student-detail-modal-backdrop` | `<AdminStudentDetail student={student} />` | `Student` |
| `screen-admin-assinaturas` | `<AdminSubscriptions list={subs} />` | `Subscription[]` |
| `screen-admin-config` | `<AdminSettings config={config} onSave={save} />` | `AdminConfig` |
