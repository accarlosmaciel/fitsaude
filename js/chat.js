/* ─── FITSAÚDE CHAT & AI MODULE ───────────────────────────────── */

const GROQ_API_KEY = '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';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_TRAINING_PROMPT = `Você é o FitBot IA, assistente personal trainer do app FitSaúde.

REGRAS OBRIGATÓRIAS:
- Responda SEMPRE de forma CURTA e RESUMIDA (máx. 5 linhas ou 3 tópicos)
- Seja direto e objetivo — sem introduzões longas
- Use listas curtas com no máx. 3-4 itens
- Se precisar aprofundar, diga "Quer mais detalhes?"
- Tom: motivador, profissional e amigável
- Formate com **negrito** e listas curtas

Áreas: execução de exercícios, montagem de treinos, nutrição, suplementação.`;

let chatHistory = [];
let isBotTyping = false;

const BOT_RESPONSES_LOCAL = [
  { keys: ['agach', 'squat', 'agachar'], reply: `**🦵 Agachamento Perfeito**\n\n• **Pés:** Largura dos ombros, ligeiramente abertos.\n• **Joelhos:** Seguem a direção das pontas dos pés.\n• **Coluna:** Mantida reta e neutra durante o movimento.\n• **Movimento:** Puxe o quadril para trás como se fosse sentar.\n\n💡 *Dica:* Não deixe os calcanhares saírem do chão!` },
  { keys: ['supino', 'peito', 'bench'], reply: `**🏋️ Supino Reto**\n\n• **Pegada:** Ligeiramente mais larga que os ombros.\n• **Escápulas:** Retraídas (espremidas para trás no banco).\n• **Descida:** Baixe a barra até a linha média do peito de forma controlada.\n• **Cotovelos:** Mantidos a aproximadamente 45° do corpo.\n\n💡 *Dica:* Acredite no impulso dos pés firmes no chão!` },
  { keys: ['proteína', 'proteina', 'protein', 'whey'], reply: `**🥩 Proteína Diária**\n\n• **Meta ideal:** 1,6g a 2,2g por kg de peso corporal.\n• **Exemplo:** Se você pesa 70kg, consuma entre 110g e 150g de proteína/dia.\n• **Boas fontes:** Ovos, peito de frango, carne magra, peixes, Whey e tofu.\n\n💡 *Dica:* Distribua em 3 a 5 refeições ao longo do dia.` },
  { keys: ['creatina', 'creatine'], reply: `**🧪 Creatina: Como Tomar**\n\n• **Dose:** 3g a 5g todos os dias (com ou sem treino).\n• **Horário:** Tanto faz! O efeito é acumulativo no corpo.\n• **Benefício:** Aumenta força, volume celular e resistência muscular.\n\n💡 *Mito:* Não precisa fazer fase de saturação.` }
];

function getBotReplyLocal(text) {
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const r of BOT_RESPONSES_LOCAL) {
    if (r.keys.some(k => lower.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) return r.reply;
  }
  return `🤔 **Dúvida recebida!**\n\nEstou pronto para te ajudar com treinos, nutrição, execução de exercícios ou descanso!\n\nVocê também pode explorar os botões rápidos abaixo ou pedir para eu montar uma rotina personalizada! 💪`;
}

function getDynamicSystemPrompt() {
  const p = typeof loadProfileData === 'function' ? loadProfileData() : DEFAULT_PROFILE;
  return `${SYSTEM_TRAINING_PROMPT}

DADOS ATUAIS DO ALUNO:
- Nome: ${p.name || 'Aluno'}
- Idade: ${p.age || '25'} anos
- Sexo: ${p.gender || 'masculino'}
- Altura: ${p.height || '175'} cm
- Peso: ${p.weight || '75'} kg
- Objetivo: ${p.goal || 'Hipertrofia'}
- Nível de treino: ${p.level || 'Intermediário'}

IMPORTANTE: Use sempre o nome do aluno (${p.name || 'Aluno'}) e considere as suas características físicas, objetivo e nível de treino em todas as suas respostas.`;
}

async function fetchGroqAIResponse(userText) {
  chatHistory.push({ role: 'user', content: userText });
  if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

  const messagesPayload = [
    { role: 'system', content: getDynamicSystemPrompt() },
    ...chatHistory
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messagesPayload,
        temperature: 0.7,
        max_tokens: 400
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: status ${response.status}`);
    }

    const data = await response.json();
    const botReply = data.choices?.[0]?.message?.content;
    if (botReply) {
      chatHistory.push({ role: 'assistant', content: botReply });
      return botReply;
    }
    throw new Error('Resposta vazia da IA');
  } catch (err) {
    console.warn('Groq API Offline ou Erro, usando Fallback:', err);
    return getBotReplyLocal(userText);
  }
}

function formatMd(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function getTime() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function addMsg(role, text) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `msg ${role}`;

  const cleanTextEscaped = text.replace(/'/g, "\\'").replace(/\n/g, ' ');

  div.innerHTML = `
    <div class="msg-bubble">${formatMd(text)}</div>
    ${role === 'bot' ? `
      <div class="ai-actions-bar">
        <button class="btn-ai-sub" onclick="copyBotMessage('${cleanTextEscaped}')"><i class="fa-solid fa-copy"></i> Copiar</button>
        <button class="btn-ai-sub" onclick="toast('<i class=\\'fa-solid fa-thumbs-up\\'></i>', 'Obrigado pelo feedback!')"><i class="fa-solid fa-thumbs-up"></i> 👍</button>
        <button class="btn-ai-sub" onclick="toast('<i class=\\'fa-solid fa-thumbs-down\\'></i>', 'Anotado para melhorias!')"><i class="fa-solid fa-thumbs-down"></i> 👎</button>
        <button class="btn-ai-sub" onclick="regenerateLastMessage()"><i class="fa-solid fa-rotate-right"></i> Regenerar</button>
      </div>
    ` : ''}
    <div class="msg-time">${getTime()}</div>
  `;
  msgs.appendChild(div);
  scrollChat();
  saveChatHistoryLocal();
}

let lastUserQuery = '';

function copyBotMessage(text) {
  navigator.clipboard.writeText(text);
  toast('<i class="fa-solid fa-copy"></i>', 'Resposta copiada!');
}

function regenerateLastMessage() {
  if (!lastUserQuery) {
    toast('<i class="fa-solid fa-circle-info"></i>', 'Nenhuma mensagem anterior para regenerar.');
    return;
  }
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = lastUserQuery;
    sendMessage();
  }
}

function saveChatHistoryLocal() {
  try {
    const msgs = document.getElementById('chat-messages');
    if (msgs) localStorage.setItem('fitsaude_chat_logs', msgs.innerHTML);
  } catch(e){}
}

function scrollChat() {
  const msgs = document.getElementById('chat-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text || isBotTyping) return;
  lastUserQuery = text;
  input.value = '';
  input.style.height = '';
  addMsg('user', text);
  showTyping();

  const aiReply = await fetchGroqAIResponse(text);
  hideTyping();
  addMsg('bot', aiReply);
}

function sendQuick(text) {
  if (typeof switchScreen === 'function') switchScreen('chat');
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    setTimeout(() => sendMessage(), 50);
  }
}

function showTyping() {
  isBotTyping = true;
  const el = document.getElementById('typing-indicator');
  if (el) el.classList.add('show');
  scrollChat();
}

function hideTyping() {
  isBotTyping = false;
  const el = document.getElementById('typing-indicator');
  if (el) el.classList.remove('show');
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}
