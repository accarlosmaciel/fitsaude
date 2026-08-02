/* ─── FITSAÚDE ACHIEVEMENTS MODULE ────────────────────────────── */

const ACHIEVEMENTS_LIST = [
  { id: 'first_workout', icon: '🏅', title: 'Primeiro Passo', desc: 'Conclua seu 1º treino' },
  { id: 'workout_10', icon: '🔥', title: 'Consistente', desc: 'Registre 10 treinos no app' },
  { id: 'ex_100', icon: '💪', title: 'Máquina de Músculos', desc: 'Marque 100 exercícios concluídos' },
  { id: 'hours_100', icon: '⏳', title: 'Dedicado 100h', desc: 'Acumule 100 horas de treino' },
  { id: 'weight_1ton', icon: '🏋️', title: 'Força Bruta', desc: 'Levante +1.000 kg no acumulado' }
];

let unlockedAchievements = new Set(getStorageItem(STORAGE_KEYS.AK, []));

function checkAchievements() {
  const history = getStorageItem(STORAGE_KEYS.HK, []);
  const doneSet = getStorageItem(STORAGE_KEYS.DK, []);
  const historyCount = history.length;
  const doneCount = doneSet.length;
  const totalVolume = calcTotalVolumeKg();
  const totalHours = parseFloat(calcTotalHoursTrained());

  let newlyUnlocked = false;

  const tryUnlock = (id) => {
    if (!unlockedAchievements.has(id)) {
      unlockedAchievements.add(id);
      newlyUnlocked = true;
      const item = ACHIEVEMENTS_LIST.find(a => a.id === id);
      if (item) {
        toast(`${item.icon}`, `Conquista desbloqueada: ${item.title}!`);
        confetti();
      }
    }
  };

  if (historyCount >= 1) tryUnlock('first_workout');
  if (historyCount >= 10) tryUnlock('workout_10');
  if (doneCount >= 100) tryUnlock('ex_100');
  if (totalHours >= 100) tryUnlock('hours_100');
  if (totalVolume >= 1000) tryUnlock('weight_1ton');

  if (newlyUnlocked) {
    setStorageItem(STORAGE_KEYS.AK, [...unlockedAchievements]);
  }
}

function renderAchievementsGrid() {
  const container = document.getElementById('achievements-grid-container');
  if (!container) return;

  container.innerHTML = `
    <div class="section-label" style="margin-top:16px;"><i class="fa-solid fa-trophy" style="color:#ffd166;"></i> Conquistas & Medalhas</div>
    <div class="achievements-grid">
      ${ACHIEVEMENTS_LIST.map(a => {
        const isUnlocked = unlockedAchievements.has(a.id);
        return `
          <div class="achievement-card ${isUnlocked ? 'unlocked' : ''}">
            <div class="achieve-icon">${a.icon}</div>
            <div>
              <div class="achieve-title">${a.title}</div>
              <div class="achieve-desc">${a.desc}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
