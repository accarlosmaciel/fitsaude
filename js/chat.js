/* ─── FITSAÚDE CHAT & AI MODULE ───────────────────────────────── */

const GROQ_API_KEY = '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';
const GROQ_MODELS = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];

const SYSTEM_TRAINING_PROMPT = `Você é o FitBot IA, personal trainer e especialista em saúde e nutrição do app FitSaúde.

REGRAS DE RESPOSTA:
- Responda SEMPRE em português do Brasil de forma clara, motivadora e estruturada.
- Use bullet points, emojis e **negrito** para destacar dicas práticas.
- Seja direto e forneça respostas acionáveis sobre treino, execução, nutrição ou descanso.
- Mantenha respostas concisas e fáceis de ler no celular.`;

let chatHistory = [];
let isBotTyping = false;
let lastUserQuery = '';

const BOT_RESPONSES_LOCAL = [
  {
    keys: ['dor', 'doendo', 'muscular', 'doms', 'recuperacao', 'recuperar'],
    reply: `**💪 Treinar com Dor Muscular (DOMS)**\n\n• **Dor leve a moderada:** Pode treinar! Foque em outro grupo muscular ou faça treino regenerativo com carga reduzida.\n• **Dor intensa ou nas articulações:** Descanse! O músculo cresce e se regenera durante o descanso.\n• **Dicas de alívio:** Hidrate-se bem, consuma boas fontes de proteína e faça 10 min de aquecimento/alongamento dinâmico.\n\n💡 *Regra de ouro:* Dor tardia no músculo é normal; pontadas em tendões e articulações exigem pausa imediata!`
  },
  {
    keys: ['montar treino', 'monte um treino', 'rotina', 'divisao', 'ficha', 'hipertrofia', 'treino'],
    reply: `**🏋️ Rotina Sugerida para Hipertrofia (ABC)**\n\n• **Treino A (Push):** Peito, Ombros e Tríceps (Supino, Desenvolvimento, Paralelas/Tríceps corda).\n• **Treino B (Pull):** Costas, Trapézio e Bíceps (Puxada alta, Remada curvada, Rosca direta).\n• **Treino C (Legs):** Pernas completas e Panturrilhas (Agachamento, Leg Press, Cadeira extensora, Stiff).\n\n💡 *Dica:* Mantenha de 3 a 4 séries de 8 a 12 repetições com foco na progressão de carga!`
  },
  {
    keys: ['agach', 'squat', 'agachar', 'perna', 'quadriceps'],
    reply: `**🦵 Agachamento Perfeito**\n\n• **Pés:** Largura dos ombros, ligeiramente apontados para fora.\n• **Joelhos:** Acompanham a linha dos pés, sem fechar para dentro.\n• **Coluna:** Neutra e peito aberto durante todo o percurso.\n• **Movimento:** Inicie projetando o quadril para trás como se fosse sentar.\n\n💡 *Dica de ouro:* Calcanhares 100% firmes no chão o tempo todo!`
  },
  {
    keys: ['supino', 'peito', 'bench', 'peitoral'],
    reply: `**🏋️ Supino Reto Perfeito**\n\n• **Escápulas:** Retraídas e presas firmes no banco.\n• **Pegada:** Ligeiramente mais larga que os ombros.\n• **Descida:** Barra controlada até a linha média do peitoral.\n• **Cotovelos:** Ângulo seguro em torno de 45° a 75° do tronco.\n\n💡 *Dica:* Mantenha os pés firmes no chão gerando impulso (leg drive)!`
  },
  {
    keys: ['proteina', 'protein', 'whey', 'frango', 'ovo', 'carne'],
    reply: `**🥩 Meta Diária de Proteína**\n\n• **Para Hipertrofia:** 1,6g a 2,2g por kg de peso corporal ao dia.\n• **Exemplo prático:** Quem pesa 70kg precisa de aproximadamente 120g a 150g de proteína/dia.\n• **Melhores fontes:** Ovos, peito de frango, peixes, carnes magras, Whey Protein e queijos magros.\n\n💡 *Dica:* Distribua em 3 a 5 refeições para manter a síntese proteica ativa.`
  },
  {
    keys: ['creatina', 'creatine', 'suplemento'],
    reply: `**🧪 Guia da Creatina**\n\n• **Dose ideal:** 3g a 5g todos os dias (mesmo nos dias sem treino).\n• **Melhor momento:** Com uma refeição rica em carboidratos para melhor absorção.\n• **Benefícios:** Mais força, aumento de potência e volume celular.\n\n💡 *Mito:* Não é obrigatório fazer fase de saturação, o efeito é por acúmulo contínuo!`
  },
  {
    keys: ['aquec', 'mobilidade', 'alongar', 'aquecimento'],
    reply: `**🔥 Aquecimento Eficiente**\n\n• **Cardio leve:** 5 a 10 min de esteira ou bike para elevar temperatura corporal.\n• **Mobilidade articular:** Rotação de ombros, quadril e tornozelos.\n• **Séries de aproximação:** 1 ou 2 séries leves do primeiro exercício com 40-50% da carga.\n\n💡 *Evite:* Alongamentos estáticos excessivos antes de pegar cargas pesadas.`
  },
  {
    keys: ['gordura', 'emagrec', 'secar', 'deficit', 'perder peso', 'cardio'],
    reply: `**🔥 Perda de Gordura com Preservação Muscular**\n\n• **Déficit Calórico Moderado:** Gaste 300 a 500 kcal a mais do que consome.\n• **Mantenha a Proteína Alta:** 1,8g a 2,2g/kg para não perder massa magra.\n• **Musculação Intensa:** Mantenha os treinos de força como prioridade.\n• **Cardio regular:** 150 min de atividade moderada na semana (ou 20-30 min pós-treino).\n\n💡 *Constância vence qualquer dieta restritiva extrema!*`
  },
  {
    keys: ['agua', 'hidrat', 'beber'],
    reply: `**💧 Hidratação para Alta Performance**\n\n• **Cálculo básico:** 35ml a 45ml de água por kg de peso corporal.\n• **Exemplo:** 70kg x 35ml = ~2,5 Litros por dia (+ 500ml durante o treino).\n• **Benefícios:** Evita fadiga precoce, previne cãibras e melhora a força muscular!`
  }
];

function getBotReplyLocal(text) {
  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const r of BOT_RESPONSES_LOCAL) {
    if (r.keys.some(k => lower.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      return r.reply;
    }
  }
  return `💪 **FitBot IA ao seu dispor!**\n\nPosso te orientar com:\n• **Treinos personalizados** (Hipertrofia, Emagrecimento, Força)\n• **Execução postural** (Agachamento, Supino, Terra)\n• **Nutrição & Suplementos** (Proteína, Creatina, Déficit calórico)\n• **Descanso & Recuperação muscular**\n\nToque em um dos botões rápidos acima ou digite sua pergunta detalhada! 🚀`;
}

function getDynamicSystemPrompt() {
  const p = typeof loadProfileData === 'function' ? loadProfileData() : (typeof DEFAULT_PROFILE !== 'undefined' ? DEFAULT_PROFILE : {});
  return `${SYSTEM_TRAINING_PROMPT}

DADOS DO ALUNO:
- Nome: ${p.name || 'Aluno'}
- Idade: ${p.age || '25'} anos
- Sexo: ${p.gender || 'masculino'}
- Altura: ${p.height || '175'} cm
- Peso: ${p.weight || '75'} kg
- Objetivo: ${p.goal || 'Hipertrofia'}
- Nível de treino: ${p.level || 'Intermediário'}

Oriente o aluno ${p.name || ''} com base nas suas metas e nível atual.`;
}

async function fetchGroqAIResponse(userText) {
  chatHistory.push({ role: 'user', content: userText });
  if (chatHistory.length > 12) chatHistory = chatHistory.slice(-12);

  const messagesPayload = [
    { role: 'system', content: getDynamicSystemPrompt() },
    ...chatHistory
  ];

  for (const modelName of GROQ_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelName,
          messages: messagesPayload,
          temperature: 0.6,
          max_tokens: 500
        })
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Groq modelo ${modelName} status ${response.status}. Tentando próximo...`);
        continue;
      }

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content;
      if (botReply && botReply.trim().length > 0) {
        chatHistory.push({ role: 'assistant', content: botReply.trim() });
        return botReply.trim();
      }
    } catch (err) {
      console.warn(`Tentativa com ${modelName} falhou:`, err.message || err);
    }
  }

  return getBotReplyLocal(userText);
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

function copyBotMessage(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
  if (typeof toast === 'function') toast('<i class="fa-solid fa-copy"></i>', 'Resposta copiada!');
}

function regenerateLastMessage() {
  if (!lastUserQuery) {
    if (typeof toast === 'function') toast('<i class="fa-solid fa-circle-info"></i>', 'Nenhuma mensagem anterior para regenerar.');
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
