/* ─── FITSAÚDE TIMER MODULE ──────────────────────────────────── */

let workoutTimerInterval = null;
let workoutSecondsElapsed = 0;
let isWorkoutActive = false;

let restTimerInterval = null;
let restSecondsRemaining = 0;

/* ── Active Workout Stopwatch ── */
function startWorkoutTimer() {
  if (isWorkoutActive) return;
  isWorkoutActive = true;
  workoutSecondsElapsed = 0;
  
  const display = document.getElementById('workout-clock');
  const btn = document.getElementById('btn-toggle-workout-timer');
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-square"></i> Finalizar Treino';
    btn.className = 'btn-timer-act btn-timer-stop';
  }

  workoutTimerInterval = setInterval(() => {
    workoutSecondsElapsed++;
    if (display) display.textContent = formatTimeHMS(workoutSecondsElapsed);
  }, 1000);

  toast('<i class="fa-solid fa-play"></i>', 'Treino iniciado!');
}

function stopWorkoutTimer() {
  if (!isWorkoutActive) return;
  isWorkoutActive = false;
  clearInterval(workoutTimerInterval);
  workoutTimerInterval = null;

  const finalSeconds = workoutSecondsElapsed;
  const mins = Math.max(1, Math.round(finalSeconds / 60));

  const btn = document.getElementById('btn-toggle-workout-timer');
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar Treino';
    btn.className = 'btn-timer-act btn-timer-start';
  }

  // Create Workout History record
  if (typeof recordWorkoutHistory === 'function') {
    recordWorkoutHistory(mins);
  }

  workoutSecondsElapsed = 0;
  const display = document.getElementById('workout-clock');
  if (display) display.textContent = '00:00';

  toast('<i class="fa-solid fa-circle-check"></i>', `Treino finalizado (${mins} min)!`);
  confetti();
}

function toggleWorkoutTimer() {
  if (isWorkoutActive) {
    if (confirm('Deseja finalizar e registrar este treino agora?')) {
      stopWorkoutTimer();
    }
  } else {
    startWorkoutTimer();
  }
}

/* ── Rest Timer ── */
function startRestTimer(seconds) {
  clearInterval(restTimerInterval);
  restSecondsRemaining = seconds;

  const display = document.getElementById('rest-countdown-display');
  if (display) {
    display.textContent = formatTimeHMS(restSecondsRemaining);
    display.style.color = '#a78bfa';
  }

  toast('<i class="fa-solid fa-stopwatch"></i>', `Descanso de ${seconds}s iniciado!`);

  restTimerInterval = setInterval(() => {
    restSecondsRemaining--;
    if (display) display.textContent = formatTimeHMS(restSecondsRemaining);

    if (restSecondsRemaining <= 0) {
      clearInterval(restTimerInterval);
      restTimerInterval = null;

      // Play Sound & Vibrate
      playTimerEndSound();
      vibrateDevice([300, 150, 300, 150, 400]);

      if (display) {
        display.textContent = '🔔 HORA DO PRÓXIMO SET!';
        display.style.color = '#22d3a0';
      }
      toast('<i class="fa-solid fa-bell"></i>', 'Descanso finalizado! Bora pra série!');
    }
  }, 1000);
}

/* ── Cardio Timer com Meta ── */
let cardioTargetSeconds = 3600;
let cardioSecondsElapsed = 0;
let cardioTimerInterval = null;
let cardioState = 'stopped';
let cardioGoalReached = false;

function selectCardioGoal(sec) {
  if (cardioState === 'running' || cardioState === 'paused') {
    if (!confirm('Deseja alterar a meta do treino de cardio em andamento?')) return;
  }
  cardioTargetSeconds = sec;
  cardioGoalReached = cardioSecondsElapsed >= cardioTargetSeconds;

  document.querySelectorAll('.cardio-chip').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-sec')) === sec);
  });

  updateCardioUI();
}

function startCardioTimer() {
  if (cardioState === 'running') return;
  cardioState = 'running';
  cardioSecondsElapsed = 0;
  cardioGoalReached = false;

  cardioTimerInterval = setInterval(() => {
    cardioSecondsElapsed++;
    updateCardioUI();
  }, 1000);

  updateCardioControlsUI();
  toast('<i class="fa-solid fa-heart-pulse"></i>', 'Cardio iniciado!');
}

function pauseCardioTimer() {
  if (cardioState !== 'running') return;
  cardioState = 'paused';
  clearInterval(cardioTimerInterval);
  cardioTimerInterval = null;

  updateCardioControlsUI();
  toast('<i class="fa-solid fa-pause"></i>', 'Cardio pausado');
}

function resumeCardioTimer() {
  if (cardioState !== 'paused') return;
  cardioState = 'running';

  cardioTimerInterval = setInterval(() => {
    cardioSecondsElapsed++;
    updateCardioUI();
  }, 1000);

  updateCardioControlsUI();
  toast('<i class="fa-solid fa-play"></i>', 'Cardio retomado!');
}

function stopCardioTimer() {
  if (cardioState === 'stopped') return;

  const mins = Math.max(1, Math.round(cardioSecondsElapsed / 60));
  clearInterval(cardioTimerInterval);
  cardioTimerInterval = null;
  cardioState = 'stopped';
  cardioSecondsElapsed = 0;
  cardioGoalReached = false;

  updateCardioControlsUI();
  updateCardioUI();

  toast('<i class="fa-solid fa-flag-checkered"></i>', `Cardio finalizado (${mins} min)!`);
  if (typeof confetti === 'function') confetti();
}

function updateCardioControlsUI() {
  const btnStart = document.getElementById('cardio-btn-start');
  const btnPause = document.getElementById('cardio-btn-pause');
  const btnResume = document.getElementById('cardio-btn-resume');
  const btnStop = document.getElementById('cardio-btn-stop');

  if (!btnStart) return;

  if (cardioState === 'stopped') {
    btnStart.style.display = 'inline-flex';
    btnPause.style.display = 'none';
    btnResume.style.display = 'none';
    btnStop.style.display = 'none';
  } else if (cardioState === 'running') {
    btnStart.style.display = 'none';
    btnPause.style.display = 'inline-flex';
    btnResume.style.display = 'none';
    btnStop.style.display = 'inline-flex';
  } else if (cardioState === 'paused') {
    btnStart.style.display = 'none';
    btnPause.style.display = 'none';
    btnResume.style.display = 'inline-flex';
    btnStop.style.display = 'inline-flex';
  }
}

function formatTimeHMS(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = num => String(num).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function updateCardioUI() {
  const clockEl = document.getElementById('cardio-clock');
  const remEl = document.getElementById('cardio-remaining');
  const fillEl = document.getElementById('cardio-progress-fill');
  const pctEl = document.getElementById('cardio-pct-text');
  const badgeEl = document.getElementById('cardio-status-badge');

  if (!clockEl) return;

  clockEl.textContent = formatTimeHMS(cardioSecondsElapsed);

  const remSec = Math.max(0, cardioTargetSeconds - cardioSecondsElapsed);
  const pct = Math.min(100, Math.round((cardioSecondsElapsed / cardioTargetSeconds) * 100));

  if (fillEl) fillEl.style.width = pct + '%';

  if (cardioSecondsElapsed >= cardioTargetSeconds) {
    if (!cardioGoalReached) {
      cardioGoalReached = true;
      if (typeof confetti === 'function') confetti();
      toast('<i class="fa-solid fa-trophy"></i>', 'Meta de Cardio Concluída! 🎉');
    }
    const extraSec = cardioSecondsElapsed - cardioTargetSeconds;
    remEl.textContent = extraSec > 0 ? `Meta concluída! Extra: +${formatTimeHMS(extraSec)}` : 'Meta concluída! 🎉';
    remEl.style.color = '#22d3a0';
    if (pctEl) pctEl.textContent = '100% Concluído (Meta Atingida! 🎉)';
    if (badgeEl) {
      badgeEl.textContent = 'Meta Concluída! 🎉';
      badgeEl.className = 'cardio-badge goal-reached';
    }
  } else {
    remEl.textContent = `Falta: ${formatTimeHMS(remSec)}`;
    remEl.style.color = 'var(--txt2)';
    if (pctEl) pctEl.textContent = `${pct}% concluído`;
    if (badgeEl) {
      const targetMins = Math.round(cardioTargetSeconds / 60);
      if (targetMins === 30) badgeEl.textContent = 'Meta: 30 min';
      else if (targetMins === 60) badgeEl.textContent = 'Meta: 1h00';
      else if (targetMins === 90) badgeEl.textContent = 'Meta: 1h30';
      else if (targetMins === 120) badgeEl.textContent = 'Meta: 2h00';
      else badgeEl.textContent = targetMins >= 60 ? `Meta: ${(targetMins / 60).toFixed(1)}h` : `Meta: ${targetMins} min`;
      badgeEl.className = 'cardio-badge';
    }
  }
}
