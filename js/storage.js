/* ─── FITSAÚDE STORAGE & BACKUP MODULE ────────────────────────── */

const STORAGE_KEYS = {
  SK_MASC: 'fitsaude_sched_masc_v9',
  SK_FEM: 'fitsaude_sched_fem_v9',
  DK: 'fitsaude_done_v9',
  GK: 'fitsaude_gender_v9',
  PK: 'fitsaude_profile_v1',
  HK: 'fitsaude_history_v1',
  AK: 'fitsaude_achievements_v1',
  FK: 'fitsaude_favorites_v1'
};

const DEFAULT_PROFILE = {
  name: 'Aluno FitSaúde',
  age: 25,
  gender: 'masculino',
  height: 175,
  weight: 75,
  goal: 'Hipertrofia',
  level: 'Intermediário'
};

function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Erro ao ler ${key} do LocalStorage:`, err);
    return defaultValue;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Erro ao salvar ${key} no LocalStorage:`, err);
  }
}

/* ── Backup & Restauração JSON ── */
function exportBackupJSON() {
  const data = {
    app: 'FitSaúde',
    version: '1.0',
    timestamp: new Date().toISOString(),
    profile: getStorageItem(STORAGE_KEYS.PK, DEFAULT_PROFILE),
    schedMasc: getStorageItem(STORAGE_KEYS.SK_MASC, null),
    schedFem: getStorageItem(STORAGE_KEYS.SK_FEM, null),
    done: [...getStorageItem(STORAGE_KEYS.DK, [])],
    gender: getStorageItem(STORAGE_KEYS.GK, 'masculino'),
    history: getStorageItem(STORAGE_KEYS.HK, []),
    achievements: getStorageItem(STORAGE_KEYS.AK, []),
    favorites: getStorageItem(STORAGE_KEYS.FK, [])
  };

  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FitSaude_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('<i class="fa-solid fa-download"></i>', 'Backup exportado!');
}

function importBackupJSON(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.profile) setStorageItem(STORAGE_KEYS.PK, data.profile);
      if (data.schedMasc) setStorageItem(STORAGE_KEYS.SK_MASC, data.schedMasc);
      if (data.schedFem) setStorageItem(STORAGE_KEYS.SK_FEM, data.schedFem);
      if (data.done) setStorageItem(STORAGE_KEYS.DK, data.done);
      if (data.gender) setStorageItem(STORAGE_KEYS.GK, data.gender);
      if (data.history) setStorageItem(STORAGE_KEYS.HK, data.history);
      if (data.achievements) setStorageItem(STORAGE_KEYS.AK, data.achievements);
      if (data.favorites) setStorageItem(STORAGE_KEYS.FK, data.favorites);

      toast('<i class="fa-solid fa-file-import"></i>', 'Dados restaurados!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast('<i class="fa-solid fa-triangle-exclamation"></i>', 'Arquivo de backup inválido!');
    }
  };
  reader.readAsText(file);
}

function importData() {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.json,application/json';
  inp.onchange = (e) => {
    const file = e.target.files[0];
    if (file) importBackupJSON(file);
  };
  inp.click();
}
