/* ─── FITSAÚDE CALENDAR & STREAK MODULE ───────────────────────── */

function calcStreaks() {
  const history = getStorageItem(STORAGE_KEYS.HK, []);
  if (!history || !history.length) return { current: 0, max: 0 };

  const dates = [...new Set(history.map(h => h.isoDate))].sort((a, b) => new Date(b) - new Date(a));
  if (!dates.length) return { current: 0, max: 0 };

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Check if active streak starts today or yesterday
  let checkIndex = 0;
  if (dates[0] === today || dates[0] === yesterday) {
    let lastDate = new Date(dates[0]);
    currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const currDate = new Date(dates[i]);
      const diffDays = Math.round((lastDate - currDate) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        currentStreak++;
        lastDate = currDate;
      } else {
        break;
      }
    }
  }

  // Calculate Max Streak across entire history
  if (dates.length > 0) {
    tempStreak = 1;
    maxStreak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const d1 = new Date(dates[i]);
      const d2 = new Date(dates[i + 1]);
      const diff = Math.round((d1 - d2) / (1000 * 3600 * 24));
      if (diff === 1) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 1;
      }
    }
  }

  return { current: currentStreak, max: Math.max(currentStreak, maxStreak) };
}

function renderStreakCard() {
  const container = document.getElementById('streak-card-container');
  if (!container) return;

  const { current, max } = calcStreaks();

  container.innerHTML = `
    <div class="streak-card">
      <div class="streak-main">
        <div class="streak-flame"><i class="fa-solid fa-fire"></i></div>
        <div>
          <div class="streak-val">${current} ${current === 1 ? 'Dia' : 'Dias'} Consecutivos</div>
          <div class="streak-sub">Foco e constância nos treinos</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:0.68rem;color:var(--txt2);font-weight:700;">RECORDES</div>
        <div style="font-size:1.1rem;font-weight:900;color:#ffd166;">🏆 ${max} d</div>
      </div>
    </div>
  `;
}

function renderCalendarGrid() {
  const container = document.getElementById('calendar-container');
  if (!container) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const history = getStorageItem(STORAGE_KEYS.HK, []);
  const trainedDaysSet = new Set(history.map(h => h.isoDate));

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  let daysHtml = weekDays.map(d => `<div class="cal-day-head">${d}</div>`).join('');

  // Empty cells for offset
  for (let i = 0; i < firstDayIndex; i++) {
    daysHtml += `<div class="cal-day-cell" style="opacity:0;"></div>`;
  }

  // Days cells
  for (let d = 1; d <= daysInMonth; d++) {
    const padD = String(d).padStart(2, '0');
    const padM = String(month + 1).padStart(2, '0');
    const isoDateStr = `${year}-${padM}-${padD}`;

    const isTrained = trainedDaysSet.has(isoDateStr);
    const isToday = d === now.getDate();

    daysHtml += `
      <div class="cal-day-cell ${isTrained ? 'trained' : ''} ${isToday ? 'today' : ''}">
        ${d}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="calendar-wrap">
      <div class="calendar-header">
        <span><i class="fa-solid fa-calendar-days"></i> ${monthNames[month]} ${year}</span>
        <span style="font-size:0.75rem;color:var(--green);"><i class="fa-solid fa-circle-check"></i> ${trainedDaysSet.size} treinos</span>
      </div>
      <div class="calendar-grid">
        ${daysHtml}
      </div>
    </div>
  `;
}
