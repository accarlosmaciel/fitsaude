/* ─── FITSAÚDE TREINO MODULE ──────────────────────────────────── */

let currentSearchQuery = '';
let currentMuscleFilter = 'Todos';
let favoriteExIds = new Set(getStorageItem(STORAGE_KEYS.FK, []));

/* ── Favorites ── */
function toggleFavoriteEx(exId, event) {
  if (event) event.stopPropagation();
  if (favoriteExIds.has(exId)) {
    favoriteExIds.delete(exId);
    toast('<i class="fa-solid fa-star"></i>', 'Removido dos favoritos');
  } else {
    favoriteExIds.add(exId);
    toast('<i class="fa-solid fa-star" style="color:#ffd166"></i>', 'Adicionado aos favoritos!');
  }
  setStorageItem(STORAGE_KEYS.FK, [...favoriteExIds]);
  renderWorkout();
}

/* ── Duplicate Workout Day ── */
function duplicateCurrentWorkoutDay() {
  const d = schedule[activeDay];
  if (!d || d.rest || !d.exercises.length) {
    toast('<i class="fa-solid fa-circle-info"></i>', 'Nenhum exercício para duplicar hoje!');
    return;
  }

  if (!confirm(`Duplicar o treino "${d.name}" para um novo dia?`)) return;

  const newDay = {
    ...JSON.parse(JSON.stringify(d)),
    day: `${d.day} (Cópia)`,
    short: `${d.short}*`,
    exercises: d.exercises.map(e => ({ ...e, id: 'c' + Date.now() + Math.random().toString(36).substr(2, 4) }))
  };

  schedule.push(newDay);
  saveSched();
  render();
  toast('<i class="fa-solid fa-clone"></i>', 'Treino duplicado com sucesso!');
}

/* ── Edit Exercise Modal ── */
let editingExId = null;

function openEditExModal(exId, event) {
  if (event) event.stopPropagation();
  let foundEx = null;
  schedule.forEach(d => {
    const e = d.exercises.find(x => x.id === exId);
    if (e) foundEx = e;
  });

  if (!foundEx) return;
  editingExId = exId;

  document.getElementById('edit-ex-name').value = foundEx.name;
  document.getElementById('edit-ex-muscle').value = foundEx.muscle;
  document.getElementById('edit-ex-sets').value = foundEx.sets;
  document.getElementById('edit-ex-reps').value = foundEx.reps;
  document.getElementById('edit-ex-weight').value = foundEx.weight;

  document.getElementById('modal-edit-ex-overlay').classList.add('show');
}

function closeEditExModal() {
  document.getElementById('modal-edit-ex-overlay').classList.remove('show');
  editingExId = null;
}

function saveEditedExercise() {
  if (!editingExId) return;
  const name = document.getElementById('edit-ex-name').value.trim();
  const muscle = document.getElementById('edit-ex-muscle').value.trim() || 'Geral';
  const sets = parseInt(document.getElementById('edit-ex-sets').value) || 3;
  const reps = document.getElementById('edit-ex-reps').value.trim() || '12';
  const weight = document.getElementById('edit-ex-weight').value.trim() || '—';

  if (!name) return;

  schedule.forEach(d => {
    const e = d.exercises.find(x => x.id === editingExId);
    if (e) {
      e.name = name;
      e.muscle = muscle;
      e.sets = sets;
      e.reps = reps;
      e.weight = weight;
    }
  });

  saveSched();
  closeEditExModal();
  render();
  toast('<i class="fa-solid fa-pen-to-square"></i>', 'Exercício atualizado!');
}

/* ── Delete Exercise ── */
function deleteExercise(exId, event) {
  if (event) event.stopPropagation();
  if (!confirm('Tem certeza que deseja excluir este exercício?')) return;

  schedule.forEach(d => {
    d.exercises = d.exercises.filter(e => e.id !== exId);
  });

  done.delete(exId);
  saveDone();
  saveSched();
  render();
  toast('<i class="fa-solid fa-trash-can"></i>', 'Exercício excluído');
}

/* ── Filter & Search Handlers ── */
function handleSearchInput(query) {
  currentSearchQuery = query.toLowerCase().trim();
  renderWorkout();
}

function setMuscleFilter(muscle) {
  currentMuscleFilter = muscle;
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-muscle') === muscle);
  });
  renderWorkout();
}
