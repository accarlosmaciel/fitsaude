/* ─── FITSAÚDE UTILS MODULE ──────────────────────────────────── */

/* Toast notification com suporte à vibração */
function toast(icon, msg, duration = 2000) {
  const t = document.getElementById('toast');
  if (!t) return;
  document.getElementById('toast-icon').innerHTML = icon;
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), duration);

  if ('vibrate' in navigator) {
    try { navigator.vibrate([30, 20, 30]); } catch (e) { }
  }
}

/* Native Web Share API */
function shareAppProgress(title = 'FitSaúde – Treino', text = 'Acompanhe meu progresso nos treinos!') {
  if (navigator.share) {
    navigator.share({ title, text, url: window.location.href })
      .then(() => toast('<i class="fa-solid fa-share-nodes"></i>', 'Compartilhado com sucesso!'))
      .catch(() => { });
  } else {
    navigator.clipboard?.writeText(`${title} - ${text} (${window.location.href})`);
    toast('<i class="fa-solid fa-copy"></i>', 'Link copiado para a área de transferência!');
  }
}

/* Web Notifications API */
function requestWorkoutNotification() {
  if (!('Notification' in window)) {
    toast('<i class="fa-solid fa-bell-slash"></i>', 'Notificações não suportadas neste navegador.');
    return;
  }
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      toast('<i class="fa-solid fa-bell"></i>', 'Lembrete de treino ativado!');
      new Notification('FitSaúde 🏋️', {
        body: 'Hora do treino! Mantenha a consistência hoje 💪',
        icon: 'images/icon-192.png'
      });
    } else {
      toast('<i class="fa-solid fa-triangle-exclamation"></i>', 'Permissão de notificação negada.');
    }
  });
}

/* Confetti animation */
function confetti() {
  const cols = ['#dc143c', '#f43f5e', '#22d3a0', '#ffd166', '#a78bfa'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    const c = cols[Math.floor(Math.random() * cols.length)];
    const sz = Math.random() * 7 + 3;
    el.style.cssText = `position:fixed;z-index:9999;width:${sz}px;height:${sz}px;background:${c};border-radius:${Math.random() > .5 ? '50%' : '2px'};left:${Math.random() * 100}vw;top:${Math.random() * 50 + 10}vh;pointer-events:none;animation:cf 1.1s ease forwards;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
  if (!document.getElementById('cf-style')) {
    const s = document.createElement('style');
    s.id = 'cf-style';
    s.textContent = '@keyframes cf{0%{transform:translateY(0)rotate(0);opacity:1}100%{transform:translateY(70px)rotate(360deg);opacity:0}}';
    document.head.appendChild(s);
  }
}

/* Web Audio API Sound Generator */
function playTimerEndSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // Play 3 cheerful beep notes
    const playNote = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    playNote(523.25, 0, 0.15);     // C5
    playNote(659.25, 0.18, 0.15);  // E5
    playNote(783.99, 0.36, 0.3);   // G5
  } catch (err) {
    console.warn('Erro ao tocar som:', err);
  }
}

/* Vibration API helper */
function vibrateDevice(pattern = [200, 100, 200]) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.warn('Vibração indisponível:', e);
    }
  }
}

/* Format Time (seconds to mm:ss or hh:mm:ss) */
function formatTimeHMS(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

/* Format Date (DD/MM/YYYY) */
function formatDateBR(dateObj = new Date()) {
  return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
