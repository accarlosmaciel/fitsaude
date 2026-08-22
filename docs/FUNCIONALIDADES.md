# ⚡ Funcionalidades do FitSaúde

O **FitSaúde** é dividido em 5 telas principais integradas em um App Shell com navegação fluida.

---

## 🏋️ 1. Módulo de Treinos (`screen-treinos`)

- **Alternância de Modalidades (Masculino & Feminino):**
  - Permite mudar com 1 clique a estrutura de treino ativa.
  - **Masculino:** Foco em Hipertrofia/Força ABC + Fullbody (Peito/Tríceps, Pernas, Costas/Bíceps, Ombros, FullBody).
  - **Feminino:** Foco em Glúteos, Coxas, Postura e Definição (Glúteos/Posterior, Superiores, Quadríceps, Core/Cardio, Booty Sculpt).
- **Navegação Diária (Segunda a Domingo):**
  - Carrossel horizontal de seleção de dias.
  - Destaque automático com ponto indicador no dia da semana atual.
  - Distinção visual para **Dias de Descanso & Recuperação** com ilustrações dedicadas e dicas de recuperação.
- **Card de Treino & Checklist Interativo:**
  - Exibe duração estimada (`60 min`), nível de intensidade (`Alta`, `Muito Alta`) e badge de progresso.
  - Checklist interativo de exercícios com contador de séries, variação de repetições e carga (kg).
  - Animação e atualização imediata da barra de progresso do dia.
- **Modal de Adicionar Exercício Customizado (`+ Exercício`):**
  - Permite ao usuário incluir novos exercícios na rotina de qualquer dia da semana.
  - Formulário completo para definir: Dia, Nome, Grupo Muscular, Séries, Repetições e Carga.

---

## 📄 2. Módulo de Planilhas & Exportação PDF (`screen-planilhas`)

- **Planilhas Pré-configuradas:**
  - Apresentação estruturada das rotinas completas para consulta rápida.
- **Exportação em PDF de Alta Qualidade:**
  - Botões dedicados para baixar o PDF da planilha **Masculina** e **Feminina**.
  - Gerado 100% no cliente via `jsPDF` e `AutoTable`.
  - O PDF gerado inclui:
    - Cabeçalho personalizado FitSaúde.
    - Tabelas organizadas por dia da semana.
    - Metadados de exercícios, séries, repetições e observações de execução.

---

## 📊 3. Módulo de Resumo & Dashboard (`screen-resumo`)

- **Cards de Estatísticas Globais:**
  - **Sessões:** Total de treinos planejados na semana.
  - **Exercícios:** Total acumulado de exercícios.
  - **Hoje:** Quantidade de exercícios concluídos no dia de hoje.
  - **Semana %:** Porcentagem global de conclusão semanal.
- **Gráfico "Caminho do Vencedor":**
  - Gráfico interativo via `Chart.js` mostrando a comparação visual entre meta e concluído por dia.
- **Distribuição por Grupos Musculares:**
  - Tags de agrupamento informando a quantidade de exercícios dedicados a cada grupo muscular na semana (Peito, Glúteos, Dorsal, Quadríceps, etc.).
- **Reset de Progresso Semanal:**
  - Botão de reset com confirmação rápida para limpar as marcações e iniciar uma nova semana de treinos.

---

## 🤖 4. FitBot IA – Assistente Virtual de Saúde (`screen-chat`)

- **Interface de Chat Estilo Mensageiro:**
  - Badge de status da IA em tempo real ("Groq Llama 3.3").
  - Indicador de digitação animado (*typing indicator*).
- **Conhecimento Esportivo & Nutricional:**
  - Treinado para responder dúvidas sobre execução correta de movimentos, divisão de treinos, cálculo de proteína diária, uso de suplementos (Creatina, Whey), recuperação e prevenção de lesões.
- **Botoes de Resposta Rápida (*Quick Replies*):**
  - Atalhos pré-definidos para perguntas mais comuns: *"Como fazer agachamento?"*, *"Devo treinar com dor muscular?"*, *"Quanto de proteína consumir?"*, *"Como suplementar Creatina?"*, etc.
- **Suporte Offline / Fallback Automático:**
  - Caso a conexão com a API da Groq fique indisponível, o bot utiliza uma base de conhecimento local em JS para manter o atendimento funcionando sem erros.

---

## 👤 5. Módulo de Perfil do Usuário (`screen-perfil`)

- **Personalização de Dados Corporais:**
  - Permite configurar **Nome**, **Idade**, **Sexo**, **Altura (cm)**, **Peso (kg)**, **Objetivo** e **Nível de Treino**.
- **Cálculo Automático de Métricas de Saúde:**
  - **IMC Calculado:** Exibe o valor do Índice de Massa Corporal com classificação de saúde (Abaixo do peso, Peso ideal, Sobrepeso, Obesidade).
  - **Meta Proteica:** Calcula automaticamente a meta de ingestão proteica recomendada em gramas/dia de acordo com peso e objetivo.
- **Integração com o Sistema:**
  - Personaliza a saudação na tela inicial com o nome do aluno (ex: *"Bom dia, Carlos!"*).
  - Sincroniza dinamicamente o sexo informado com o modal de treino padrão (Masculino/Feminino).
  - Injeta os dados do aluno no prompt do **FitBot IA** para que a IA dê conselhos sob medida.

---

## 👥 6. Sistema Multiusuário (Visitante, Atleta, Administrador)

### 👁️ Visitante (Acesso Inicial / Não Cadastrado)
- **Conhecer o FitSaúde:** Apresentação da plataforma, vitrine de recursos (Player 3D, IA FitBot, Métricas).
- **Ver os Planos:** Cards interativos dos planos Mensal (R$ 49,90), Trimestral (R$ 39,90) e Anual VIP (R$ 29,90).
- **Criar Conta & Login:** Modais completos de autenticação com validação.
- **Recuperar Senha:** Fluxo assistido de recuperação de acesso.
- **Assinar um Plano:** Checkout instantâneo via PIX (QR Code e Copia e Cola) ou Cartão de Crédito com ativação automática.

### ⚡ Atleta (Usuário com Assinatura Ativa)
- **Treinos:** Acesso total às rotinas Masc & Fem, dias da semana e player de execução 3D.
- **Planilhas:** Visualização e download de PDFs completos.
- **Resumo:** Gráficos e progresso semanal.
- **FitBot IA:** Assistente Groq Llama 3.3 com contexto de treino.
- **Perfil:** IMC, hidratação diária, metas e temas visuais.
- **Assinatura:** Visualização do plano ativo, validade, faturas e renovação.
- **Segurança:** Troca de senha, sessões ativas e logout.

### 👑 Administrador (Dono do FitSaúde)
- **Dashboard:** KPIs executivos (Total de alunos, MRR faturamento, treinos hoje, retenção).
- **Alunos:** Gestão completa com busca em tempo real, status ativo/pendente/bloqueado, cadastro e exclusão.
- **Treinos:** Painel de controle de fichas e catálogo de exercícios da academia.
- **Planilhas:** Emissão e download de relatórios administrativos gerais em PDF.
- **Assinaturas:** Controle financeiro de todas as assinaturas e pagamentos da plataforma.
- **Configurações:** Nome da academia, WhatsApp de suporte, modelo da IA e backup geral do banco.
