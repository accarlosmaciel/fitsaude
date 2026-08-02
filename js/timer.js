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
