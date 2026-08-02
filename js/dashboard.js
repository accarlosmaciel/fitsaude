/* ─── FITSAÚDE DASHBOARD & HISTORY MODULE ─────────────────────── */

let workoutHistory = getStorageItem(STORAGE_KEYS.HK, []);

function recordWorkoutHistory(durationMins) {
  const d = schedule[activeDay];
  if (!d) return;

  const doneExs = d.exercises.filter(e => done.has(e.id));
  const exCount = doneExs.length || d.exercises.length;

  // Calculate Total Weight Lifted (approximate: sets * avg_reps * weight_kg)
  let totalWeightKg = 0;
  doneExs.forEach(e => {
    const sets = e.sets || 3;
    const repsMatch = String(e.reps).match(/\d+/);
    const reps = repsMatch ? parseInt(repsMatch[0]) : 10;
    const weightMatch = String(e.weight).match(/\d+/);
    const weight = weightMatch ? parseInt(weightMatch[0]) : 10;
    totalWeightKg += sets * reps * weight;
  });

  const record = {
    id: 'h_' + Date.now(),
    data: formatDateBR(new Date()),
    isoDate: new Date().toISOString().slice(0, 10),
    treino: d.name,
    tempo: durationMins,
    exercicios: exCount,
    carga: totalWeightKg
  };

  workoutHistory.unshift(record);
  setStorageItem(STORAGE_KEYS.HK, workoutHistory);

  // Check achievements after history update
  if (typeof checkAchievements === 'function') {
    checkAchievements();
  }
}

function calcTotalVolumeKg() {
  return workoutHistory.reduce((acc, h) => acc + (h.carga || 0), 0);
}

function calcTotalHoursTrained() {
  const totalMins = workoutHistory.reduce((acc, h) => acc + (h.tempo || 0), 0);
  return (totalMins / 60).toFixed(1);
}

function renderSummary() {
  const nonRest = schedule.filter(d => !d.rest);
  const totalEx = schedule.reduce((a, d) => a + d.exercises.length, 0);
  const totalDone = [...done].length;
  const totalSets = schedule.reduce((a, d) => a + d.exercises.reduce((b, e) => b + e.sets, 0), 0);
  const avg = nonRest.length ? Math.round(totalEx / nonRest.length) : 0;
  const totalVolume = calcTotalVolumeKg();

  const summaryGrid = document.getElementById('summary-grid');
  if (summaryGrid) {
    summaryGrid.innerHTML = `
      ${[
        ['<i class="fa-solid fa-calendar-check"></i>', nonRest.length, 'Dias Treino'],
        ['<i class="fa-solid fa-dumbbell"></i>', totalEx, 'Exercícios'],
        ['<i class="fa-solid fa-hashtag"></i>', totalSets, 'Séries'],
        ['<i class="fa-solid fa-weight-hanging"></i>', (totalVolume / 1000).toFixed(1) + ' t', 'Carga Total'],
        ['<i class="fa-solid fa-circle-check"></i>', totalDone, 'Concluídos']
      ].map(([ic, v, l]) => `
      <div class="sum-card">
        <span class="sum-card-icon">${ic}</span>
        <div class="sum-card-val">${v}</div>
        <div class="sum-card-lbl">${l}</div>
      </div>`).join('')}
    `;
  }

  // Per-day progress bars
  const weekProgBars = document.getElementById('week-prog-bars');
  if (weekProgBars) {
    weekProgBars.innerHTML = schedule.filter(d => !d.rest).map(d => {
      const t = d.exercises.length;
      const dn = d.exercises.filter(e => done.has(e.id)).length;
      const p = t ? Math.round((dn / t) * 100) : 0;
      return `<div class="week-bar-row">
        <div class="week-bar-day">${d.short}</div>
        <div class="week-bar-track"><div class="week-bar-fill" style="width:${p}%"></div></div>
        <div class="week-bar-pct">${p}%</div>
      </div>`;
    }).join('');
  }

  // Render Performance Line Chart
  renderPerformanceChart();

  // Render Calendar and Streak if available
  if (typeof renderCalendarGrid === 'function') renderCalendarGrid();
  if (typeof renderStreakCard === 'function') renderStreakCard();
  if (typeof renderAchievementsGrid === 'function') renderAchievementsGrid();
  if (typeof renderGoalsCard === 'function') renderGoalsCard();
}

let chartInstance = null;

function renderPerformanceChart() {
  const canvas = document.getElementById('performanceChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const labels = schedule.map(d => d.short);
  const dataValues = schedule.map(d => {
    if (d.rest) return 0;
    const total = d.exercises.length;
    const doneEx = d.exercises.filter(e => done.has(e.id)).length;
    return total ? Math.round((doneEx / total) * 100) : 0;
  });

  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(220, 20, 60, 0.45)');
  gradient.addColorStop(1, 'rgba(220, 20, 60, 0.0)');

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Conclusão (%)',
        data: dataValues,
        borderColor: '#dc143c',
        borderWidth: 3,
        pointBackgroundColor: '#ffd166',
        pointBorderColor: '#dc143c',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        backgroundColor: gradient,
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#8e8ea0', font: { size: 11, weight: 'bold' } } },
        y: { min: 0, max: 100, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#8e8ea0', stepSize: 25, callback: (v) => v + '%' } }
      }
    }
  });
}

function renderGoalsCard() {
  const container = document.getElementById('goals-container');
  if (!container) return;

  const weeklyDone = workoutHistory.filter(h => {
    const diffDays = (new Date() - new Date(h.isoDate)) / (1000 * 3600 * 24);
    return diffDays <= 7;
  }).length;

  const monthlyDone = workoutHistory.filter(h => {
    const diffDays = (new Date() - new Date(h.isoDate)) / (1000 * 3600 * 24);
    return diffDays <= 30;
  }).length;

  const wPct = Math.min(100, Math.round((weeklyDone / 5) * 100));
  const mPct = Math.min(100, Math.round((monthlyDone / 20) * 100));

  container.innerHTML = `
    <div class="goals-card">
      <div class="section-label" style="padding:0;margin-bottom:14px;"><i class="fa-solid fa-bullseye"></i> Suas Metas</div>
      
      <div class="goal-item">
        <div class="goal-head">
          <span>Treinar 5x nesta semana</span>
          <span style="color:var(--red-light);">${weeklyDone}/5 (${wPct}%)</span>
        </div>
        <div class="goal-bar-track"><div class="goal-bar-fill" style="width:${wPct}%"></div></div>
      </div>

      <div class="goal-item" style="margin-top:12px;">
        <div class="goal-head">
          <span>20 Treinos no Mês</span>
          <span style="color:var(--green);">${monthlyDone}/20 (${mPct}%)</span>
        </div>
        <div class="goal-bar-track"><div class="goal-bar-fill" style="width:${mPct}%;background:linear-gradient(90deg,var(--green),#38bdf8);"></div></div>
      </div>
    </div>
  `;
}
