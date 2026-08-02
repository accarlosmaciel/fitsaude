# 🛠️ Tecnologias e Dependências do Projeto

O **FitSaúde** utiliza uma arquitetura leve, moderna e modular baseada inteiramente em tecnologias Web nativas (Client-Side Only), sem dependência de frameworks pesados como React/Vue/Angular, garantindo máxima performance e inicialização instantânea.

---

## 💻 Core Stack

| Tecnologia | Descrição & Utilização |
| :--- | :--- |
| **HTML5** | Estruturação semântica da aplicação, App Shell, PWA Meta tags para dispositivos móveis. |
| **CSS3 (Vanilla)** | Estilização personalizada, CSS Variables (Design Tokens), Flexbox/Grid, animações de gradientes e efeitos de vidro (*Glassmorphism*). |
| **JavaScript (ES6+)** | Lógica de estado da aplicação, manipulação do DOM, persistência local e integração assíncrona (`async/await`) com APIs externas. |

---

## 📦 Bibliotecas Externas (CDNs)

- **[Font Awesome 6.5.0](https://fontawesome.com/)**: Biblioteca de ícones vetoriais em SVG/Font utilizados em toda a interface do aplicativo.
- **[Chart.js](https://www.chartjs.org/)**: Renderização de gráficos interativos HTML5 Canvas para acompanhamento do progresso semanal ("Caminho do Vencedor").
- **[jsPDF 2.5.1](https://github.com/parallax/jsPDF)** + **[jsPDF AutoTable 3.8.2](https://github.com/simonbengtsson/jsPDF-AutoTable)**: Motor de geração e exportação de planilhas de treino em formato PDF de alta qualidade visual diretamente no navegador.

---

## 🤖 Inteligência Artificial & APIs

- **API da Groq (`https://api.groq.com/openai/v1/chat/completions`)**:
  - **Modelo:** `llama-3.3-70b-versatile` (Llama 3.3 da Meta).
  - **Prompt de Sistema:** Especializado em musculação, educação física, biomecânica e nutrição esportiva.
- **Mecanismo de Fallback Offline (`BOT_RESPONSES_LOCAL`)**:
  - Motor de busca local em JavaScript que utiliza correspondência de palavras-chave normalizadas (removendo acentos e maiúsculas) para responder o usuário caso fique sem conexão ou ocorra falha na API.

---

## 💾 Persistência de Dados (LocalStorage)

O aplicativo armazena as preferências e o progresso do usuário no armazenamento local do navegador (*Browser LocalStorage*):

- `fitsaude_sched_masc_v9`: Estrutura JSON com os treinos masculinos.
- `fitsaude_sched_fem_v9`: Estrutura JSON com os treinos femininos.
- `fitsaude_done_v9`: Array JSON com os IDs dos exercícios marcados como concluídos.
- `fitsaude_gender_v9`: Guarda o gênero/modalidade ativa (`masculino` ou `feminino`).
