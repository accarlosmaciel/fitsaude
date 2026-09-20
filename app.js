/* ============================================================
   EduSys — Sistema Escolar Acadêmico
   app.js — Data + Logic + Render
   ============================================================ */

// ── Dados (baseados no script SQL) ──────────────────────────
let cursos = [
  { id_curso: 1, nome_curso: 'Análise e Desenvolvimento de Sistemas', duracao_semestres: 5 },
  { id_curso: 2, nome_curso: 'Administração', duracao_semestres: 6 },
  { id_curso: 3, nome_curso: 'Ciências Contábeis', duracao_semestres: 8 },
];

let alunos = [
  { id_aluno: 1,  nome: 'Ana Souza',        cpf: '111.111.111-11', data_nascimento: '2003-05-15', email: 'ana.souza.novo@email.com' },
  { id_aluno: 2,  nome: 'Bruno Oliveira',   cpf: '222.222.222-22', data_nascimento: '2002-08-20', email: 'bruno.oliveira@email.com' },
  { id_aluno: 3,  nome: 'Carlos Santos',    cpf: '333.333.333-33', data_nascimento: '2004-01-10', email: 'carlos.santos@email.com' },
  { id_aluno: 4,  nome: 'Daniela Lima',     cpf: '444.444.444-44', data_nascimento: '2003-11-25', email: 'daniela.lima@email.com' },
  { id_aluno: 5,  nome: 'Eduardo Pereira',  cpf: '555.555.555-55', data_nascimento: '2002-03-18', email: 'eduardo.pereira@email.com' },
  { id_aluno: 6,  nome: 'Fernanda Alves',   cpf: '666.666.666-66', data_nascimento: '2004-07-30', email: 'fernanda.alves@email.com' },
  { id_aluno: 7,  nome: 'Gabriel Costa',    cpf: '777.777.777-77', data_nascimento: '2003-09-12', email: 'gabriel.costa@email.com' },
  { id_aluno: 8,  nome: 'Helena Martins',   cpf: '888.888.888-88', data_nascimento: '2002-12-05', email: 'helena.martins@email.com' },
  { id_aluno: 9,  nome: 'Igor Rodrigues',   cpf: '999.999.999-99', data_nascimento: '2004-02-22', email: 'igor.rodrigues@email.com' },
  { id_aluno: 10, nome: 'Juliana Ferreira', cpf: '000.000.000-00', data_nascimento: '2003-06-17', email: 'juliana.ferreira@email.com' },
];

let professores = [
  { id_professor: 1, nome: 'Marcos Almeida', email: 'marcos.almeida@escola.com', especialidade: 'Programação' },
  { id_professor: 2, nome: 'Patricia Gomes', email: 'patricia.gomes@escola.com', especialidade: 'Banco de Dados' },
  { id_professor: 3, nome: 'Ricardo Mendes', email: 'ricardo.mendes@escola.com', especialidade: 'Administração' },
  { id_professor: 4, nome: 'Luciana Rocha',  email: 'luciana.rocha@escola.com',  especialidade: 'Contabilidade' },
  { id_professor: 5, nome: 'Fernando Castro',email: 'fernando.castro@escola.com',especialidade: 'Matemática' },
];

let disciplinas = [
  { id_disciplina: 1, nome_disciplina: 'Programação I',             carga_horaria: 80, id_curso: 1, id_professor: 1 },
  { id_disciplina: 2, nome_disciplina: 'Banco de Dados',            carga_horaria: 80, id_curso: 1, id_professor: 2 },
  { id_disciplina: 3, nome_disciplina: 'Engenharia de Software',    carga_horaria: 60, id_curso: 1, id_professor: 1 },
  { id_disciplina: 4, nome_disciplina: 'Gestão de Pessoas',         carga_horaria: 60, id_curso: 2, id_professor: 3 },
  { id_disciplina: 5, nome_disciplina: 'Administração Financeira',  carga_horaria: 80, id_curso: 2, id_professor: 3 },
  { id_disciplina: 6, nome_disciplina: 'Contabilidade Geral',       carga_horaria: 80, id_curso: 3, id_professor: 4 },
  { id_disciplina: 7, nome_disciplina: 'Matemática Financeira',     carga_horaria: 60, id_curso: 3, id_professor: 5 },
];

let matriculas = [
  { id_matricula: 1,  id_aluno: 1,  id_curso: 1, data_matricula: '2026-02-10' },
  { id_matricula: 2,  id_aluno: 2,  id_curso: 1, data_matricula: '2026-02-11' },
  { id_matricula: 3,  id_aluno: 3,  id_curso: 1, data_matricula: '2026-02-12' },
  { id_matricula: 4,  id_aluno: 4,  id_curso: 2, data_matricula: '2026-02-10' },
  { id_matricula: 5,  id_aluno: 5,  id_curso: 2, data_matricula: '2026-02-13' },
  { id_matricula: 6,  id_aluno: 6,  id_curso: 2, data_matricula: '2026-02-14' },
  { id_matricula: 7,  id_aluno: 7,  id_curso: 3, data_matricula: '2026-02-10' },
  { id_matricula: 8,  id_aluno: 8,  id_curso: 3, data_matricula: '2026-02-11' },
  { id_matricula: 9,  id_aluno: 9,  id_curso: 3, data_matricula: '2026-02-12' },
  { id_matricula: 10, id_aluno: 10, id_curso: 1, data_matricula: '2026-02-15' },
];

let aluno_disciplinas = [
  { id_aluno: 1,  id_disciplina: 1, nota: 9.0, frequencia: 95 },
  { id_aluno: 1,  id_disciplina: 2, nota: 8.5, frequencia: 92 },
  { id_aluno: 1,  id_disciplina: 3, nota: 9.2, frequencia: 96 },
  { id_aluno: 2,  id_disciplina: 1, nota: 7.5, frequencia: 88 },
  { id_aluno: 2,  id_disciplina: 2, nota: 8.0, frequencia: 90 },
  { id_aluno: 2,  id_disciplina: 3, nota: 7.8, frequencia: 85 },
  { id_aluno: 3,  id_disciplina: 1, nota: 6.5, frequencia: 80 },
  { id_aluno: 3,  id_disciplina: 2, nota: 7.0, frequencia: 82 },
  { id_aluno: 3,  id_disciplina: 3, nota: 6.8, frequencia: 79 },
  { id_aluno: 4,  id_disciplina: 4, nota: 9.0, frequencia: 96 },
  { id_aluno: 4,  id_disciplina: 5, nota: 8.5, frequencia: 94 },
  { id_aluno: 5,  id_disciplina: 4, nota: 7.0, frequencia: 85 },
  { id_aluno: 5,  id_disciplina: 5, nota: 7.5, frequencia: 87 },
  { id_aluno: 6,  id_disciplina: 4, nota: 8.5, frequencia: 93 },
  { id_aluno: 6,  id_disciplina: 5, nota: 9.0, frequencia: 95 },
  { id_aluno: 7,  id_disciplina: 6, nota: 9.5, frequencia: 97 },
  { id_aluno: 7,  id_disciplina: 7, nota: 8.8, frequencia: 94 },
  { id_aluno: 8,  id_disciplina: 6, nota: 8.0, frequencia: 90 },
  { id_aluno: 8,  id_disciplina: 7, nota: 7.5, frequencia: 88 },
  { id_aluno: 9,  id_disciplina: 6, nota: 6.5, frequencia: 78 },
  { id_aluno: 9,  id_disciplina: 7, nota: 7.0, frequencia: 80 },
  { id_aluno: 10, id_disciplina: 1, nota: 8.8, frequencia: 94 },
  { id_aluno: 10, id_disciplina: 2, nota: 9.2, frequencia: 96 },
  { id_aluno: 10, id_disciplina: 3, nota: 8.5, frequencia: 91 },
];

// ── State ────────────────────────────────────────────────────
let currentPage = 'dashboard';
let chartInstance = null;
let nextAlunoId = 11;
let nextMatriculaId = 11;
let filterAlunoSearch = '';
let filterAlunoCurso = '';
let filterNotaSearch = '';

// ── Helpers ──────────────────────────────────────────────────
const getCurso  = id => cursos.find(c => c.id_curso === id);
const getAluno  = id => alunos.find(a => a.id_aluno === id);
const getProf   = id => professores.find(p => p.id_professor === id);
const getDisc   = id => disciplinas.find(d => d.id_disciplina === id);

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function formatDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function calcAge(dob) {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function getCursoMedia(id_aluno) {
  const notas = aluno_disciplinas.filter(ad => ad.id_aluno === id_aluno).map(ad => ad.nota);
  if (!notas.length) return null;
  return (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2);
}

function getFreqMedia(id_aluno) {
  const freqs = aluno_disciplinas.filter(ad => ad.id_aluno === id_aluno).map(ad => ad.frequencia);
  if (!freqs.length) return null;
  return (freqs.reduce((a, b) => a + b, 0) / freqs.length).toFixed(1);
}

function getGradeClass(nota) {
  if (nota === null) return '';
  if (nota >= 7) return 'badge-green';
  if (nota >= 5) return 'badge-yellow';
  return 'badge-red';
}

function getFreqClass(freq) {
  if (freq === null) return '';
  if (freq >= 75) return 'badge-green';
  if (freq >= 60) return 'badge-yellow';
  return 'badge-red';
}

const avatarColors = [
  'linear-gradient(135deg,#7c3aed,#3b82f6)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
  'linear-gradient(135deg,#3b82f6,#06b6d4)',
];

function avatarColor(id) { return avatarColors[id % avatarColors.length]; }

function getAlunoMatricula(id_aluno) {
  return matriculas.find(m => m.id_aluno === id_aluno);
}

// ── Navigation ───────────────────────────────────────────────
function navigate(page) {
  currentPage = page;
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
  // Update topbar title
  const titles = {
    dashboard: 'Dashboard',
    alunos: 'Alunos',
    professores: 'Professores',
    cursos: 'Cursos',
    disciplinas: 'Disciplinas',
    matriculas: 'Matrículas',
    notas: 'Notas & Frequência',
  };
  document.getElementById('topbarTitle').textContent = titles[page] || page;
  // Reset search bar
  document.getElementById('globalSearch').value = '';
  // Render page
  renderPage(page);
  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('open');
}

function renderPage(page) {
  const main = document.getElementById('mainContent');
  main.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'page-enter';

  switch (page) {
    case 'dashboard':   renderDashboard(wrapper);   break;
    case 'alunos':      renderAlunos(wrapper);       break;
    case 'professores': renderProfessores(wrapper);  break;
    case 'cursos':      renderCursos(wrapper);       break;
    case 'disciplinas': renderDisciplinas(wrapper);  break;
    case 'matriculas':  renderMatriculas(wrapper);   break;
    case 'notas':       renderNotas(wrapper);        break;
    default:            wrapper.innerHTML = '<p>Página não encontrada.</p>';
  }

  main.appendChild(wrapper);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function handleSearch(val) {
  // Global search routes to relevant page
}

// ── Toast ────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type !== 'success' ? type : ''}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Modal ────────────────────────────────────────────────────
function openModal(title, bodyHTML) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ── DASHBOARD ────────────────────────────────────────────────
function renderDashboard(el) {
  // KPIs
  const alunosPorCurso = cursos.map(c => ({
    nome: c.nome_curso.split(' ').slice(0, 2).join(' '),
    count: matriculas.filter(m => m.id_curso === c.id_curso).length,
  }));
  const totalNotas = aluno_disciplinas.length;
  const aprovados = aluno_disciplinas.filter(ad => ad.nota >= 7).length;
  const mediaGeral = (aluno_disciplinas.reduce((a, b) => a + b.nota, 0) / totalNotas).toFixed(2);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Bem-vindo ao EduSys 👋</h1>
        <p>Visão geral do sistema acadêmico</p>
      </div>
    </div>

    <div class="cards-grid">
      <div class="stat-card" style="--card-grad: linear-gradient(135deg,#7c3aed,#a855f7)">
        <div class="stat-card-icon">🎓</div>
        <div class="stat-card-value">${alunos.length}</div>
        <div class="stat-card-label">Alunos Matriculados</div>
      </div>
      <div class="stat-card" style="--card-grad: linear-gradient(135deg,#3b82f6,#06b6d4)">
        <div class="stat-card-icon">👨‍🏫</div>
        <div class="stat-card-value">${professores.length}</div>
        <div class="stat-card-label">Professores</div>
      </div>
      <div class="stat-card" style="--card-grad: linear-gradient(135deg,#10b981,#06b6d4)">
        <div class="stat-card-icon">📚</div>
        <div class="stat-card-value">${cursos.length}</div>
        <div class="stat-card-label">Cursos Ativos</div>
      </div>
      <div class="stat-card" style="--card-grad: linear-gradient(135deg,#f59e0b,#ef4444)">
        <div class="stat-card-icon">📖</div>
        <div class="stat-card-value">${disciplinas.length}</div>
        <div class="stat-card-label">Disciplinas</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="glass-card">
        <div class="glass-card-header">
          <span class="glass-card-title">📊 Alunos por Curso</span>
        </div>
        <div class="chart-wrapper">
          <canvas id="chartCursos"></canvas>
        </div>
      </div>

      <div class="glass-card">
        <div class="glass-card-header">
          <span class="glass-card-title">📈 Desempenho Geral</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;padding-top:8px">
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:13px;color:var(--text-secondary)">Taxa de Aprovação</span>
              <span style="font-size:13px;font-weight:700;color:var(--green)">${Math.round(aprovados/totalNotas*100)}%</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${Math.round(aprovados/totalNotas*100)}%;background:var(--grad-green)"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:13px;color:var(--text-secondary)">Média Geral de Notas</span>
              <span style="font-size:13px;font-weight:700;color:var(--purple-light)">${mediaGeral}/10</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${parseFloat(mediaGeral)*10}%;background:var(--grad-purple)"></div></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:13px;color:var(--text-secondary)">Frequência Média</span>
              <span style="font-size:13px;font-weight:700;color:var(--cyan)">${(aluno_disciplinas.reduce((a,b)=>a+b.frequencia,0)/totalNotas).toFixed(1)}%</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${(aluno_disciplinas.reduce((a,b)=>a+b.frequencia,0)/totalNotas).toFixed(1)}%;background:var(--grad-blue)"></div></div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="glass-card-header" style="margin-bottom:12px">
          <span class="glass-card-title">🏆 Top Alunos</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${alunos
            .map(a => ({ a, media: parseFloat(getCursoMedia(a.id_aluno) || 0) }))
            .sort((x,y) => y.media - x.media)
            .slice(0, 3)
            .map(({ a, media }, i) => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg-card);border-radius:8px;border:1px solid var(--border)">
                <span style="font-size:18px">${['🥇','🥈','🥉'][i]}</span>
                <div class="avatar" style="background:${avatarColor(a.id_aluno)}">${getInitials(a.nome)}</div>
                <span style="flex:1;font-size:13px;font-weight:500">${a.nome}</span>
                <span class="badge badge-green" style="font-size:12px">${media.toFixed(2)}</span>
              </div>
            `).join('')}
        </div>
      </div>

      <div class="glass-card">
        <div class="glass-card-header">
          <span class="glass-card-title">📋 Últimas Matrículas</span>
        </div>
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Aluno</th><th>Curso</th><th>Data</th></tr></thead>
            <tbody>
              ${[...matriculas].sort((a,b)=>b.data_matricula.localeCompare(a.data_matricula)).slice(0,6).map(m => {
                const a = getAluno(m.id_aluno);
                const c = getCurso(m.id_curso);
                return `<tr>
                  <td><div class="avatar-cell">
                    <div class="avatar" style="background:${avatarColor(m.id_aluno)};width:28px;height:28px;font-size:11px">${getInitials(a.nome)}</div>
                    <span style="font-size:13px">${a.nome}</span>
                  </div></td>
                  <td><span class="badge badge-purple" style="font-size:11px">${c.nome_curso.split(' ').slice(0,2).join(' ')}</span></td>
                  <td style="color:var(--text-secondary);font-size:13px">${formatDate(m.data_matricula)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Chart.js
  requestAnimationFrame(() => {
    const canvas = document.getElementById('chartCursos');
    if (!canvas) return;
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: alunosPorCurso.map(c => c.nome),
        datasets: [{
          label: 'Alunos',
          data: alunosPorCurso.map(c => c.count),
          backgroundColor: ['rgba(124,58,237,0.7)', 'rgba(59,130,246,0.7)', 'rgba(16,185,129,0.7)'],
          borderColor:     ['rgba(124,58,237,1)',   'rgba(59,130,246,1)',   'rgba(16,185,129,1)'],
          borderWidth: 2,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#1a1a3e', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94a3b8', font: { size: 12 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94a3b8', font: { size: 12 }, stepSize: 1 }, beginAtZero: true },
        }
      }
    });
  });
}

// ── ALUNOS ───────────────────────────────────────────────────
function renderAlunos(el) {
  const filtered = alunos.filter(a => {
    const q = filterAlunoSearch.toLowerCase();
    const matchSearch = !q || a.nome.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.cpf.includes(q);
    let matchCurso = true;
    if (filterAlunoCurso) {
      const mat = getAlunoMatricula(a.id_aluno);
      matchCurso = mat && mat.id_curso === parseInt(filterAlunoCurso);
    }
    return matchSearch && matchCurso;
  });

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Alunos</h1>
        <p>${alunos.length} alunos cadastrados</p>
      </div>
      <button class="btn btn-primary" id="btnNovoAluno" onclick="abrirModalAluno()">
        ＋ Novo Aluno
      </button>
    </div>

    <div class="glass-card">
      <div class="glass-card-header">
        <div class="filters">
          <input type="text" class="filter-input" placeholder="🔍  Buscar por nome, email ou CPF..."
            value="${filterAlunoSearch}"
            id="alunoSearch"
            oninput="filterAlunoSearch=this.value; renderAlunos(document.querySelector('.page-enter'))">
          <select class="filter-select" id="alunoCursoFilter"
            onchange="filterAlunoCurso=this.value; renderAlunos(document.querySelector('.page-enter'))">
            <option value="">Todos os cursos</option>
            ${cursos.map(c => `<option value="${c.id_curso}" ${filterAlunoCurso==c.id_curso?'selected':''}>${c.nome_curso}</option>`).join('')}
          </select>
        </div>
        <span class="badge badge-purple">${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>CPF</th>
              <th>Nascimento</th>
              <th>Curso</th>
              <th>Média</th>
              <th>Frequência</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `<tr><td colspan="7"><div class="empty-state"><div class="icon">🔍</div><p>Nenhum aluno encontrado.</p></div></td></tr>` : ''}
            ${filtered.map(a => {
              const mat = getAlunoMatricula(a.id_aluno);
              const curso = mat ? getCurso(mat.id_curso) : null;
              const media = getCursoMedia(a.id_aluno);
              const freq  = getFreqMedia(a.id_aluno);
              return `<tr>
                <td>
                  <div class="avatar-cell">
                    <div class="avatar" style="background:${avatarColor(a.id_aluno)}">${getInitials(a.nome)}</div>
                    <div class="avatar-info">
                      <span style="font-weight:600">${a.nome}</span>
                      <span class="sub">${a.email}</span>
                    </div>
                  </div>
                </td>
                <td style="font-size:13px;color:var(--text-secondary);font-family:monospace">${a.cpf}</td>
                <td style="font-size:13px;color:var(--text-secondary)">${formatDate(a.data_nascimento)} <span style="color:var(--text-muted)">(${calcAge(a.data_nascimento)} anos)</span></td>
                <td>${curso ? `<span class="badge badge-purple" style="font-size:11px">${curso.nome_curso.split(' ').slice(0,2).join(' ')}</span>` : '<span class="badge badge-red">Sem matrícula</span>'}</td>
                <td>${media !== null ? `<span class="badge ${getGradeClass(parseFloat(media))}">${media}</span>` : '<span style="color:var(--text-muted)">—</span>'}</td>
                <td>${freq !== null ? `<span class="badge ${getFreqClass(parseFloat(freq))}">${freq}%</span>` : '<span style="color:var(--text-muted)">—</span>'}</td>
                <td>
                  <div class="actions">
                    <button class="action-btn view" title="Ver detalhes" onclick="verAluno(${a.id_aluno})">👁</button>
                    <button class="action-btn edit" title="Editar" onclick="abrirModalAluno(${a.id_aluno})">✏️</button>
                    <button class="action-btn delete" title="Excluir" onclick="excluirAluno(${a.id_aluno})">🗑</button>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function abrirModalAluno(id = null) {
  const aluno = id ? alunos.find(a => a.id_aluno === id) : null;
  const mat   = aluno ? getAlunoMatricula(aluno.id_aluno) : null;
  const title = aluno ? '✏️ Editar Aluno' : '➕ Novo Aluno';

  const html = `
    <div class="form-grid">
      <div class="form-group full">
        <label>Nome Completo</label>
        <input type="text" id="fNome" placeholder="Ex: João Silva" value="${aluno?.nome || ''}">
      </div>
      <div class="form-group">
        <label>CPF</label>
        <input type="text" id="fCpf" placeholder="000.000.000-00" value="${aluno?.cpf || ''}">
      </div>
      <div class="form-group">
        <label>Data de Nascimento</label>
        <input type="date" id="fDob" value="${aluno?.data_nascimento || ''}">
      </div>
      <div class="form-group full">
        <label>E-mail</label>
        <input type="email" id="fEmail" placeholder="aluno@email.com" value="${aluno?.email || ''}">
      </div>
      <div class="form-group full">
        <label>Curso</label>
        <select id="fCurso">
          <option value="">Selecionar curso...</option>
          ${cursos.map(c => `<option value="${c.id_curso}" ${mat?.id_curso===c.id_curso?'selected':''}>${c.nome_curso}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarAluno(${id || 'null'})">
        ${aluno ? '💾 Salvar' : '➕ Cadastrar'}
      </button>
    </div>
  `;
  openModal(title, html);
}

function salvarAluno(id) {
  const nome  = document.getElementById('fNome').value.trim();
  const cpf   = document.getElementById('fCpf').value.trim();
  const dob   = document.getElementById('fDob').value;
  const email = document.getElementById('fEmail').value.trim();
  const cursoId = parseInt(document.getElementById('fCurso').value);

  if (!nome || !cpf || !dob || !email) {
    showToast('Preencha todos os campos obrigatórios!', 'error');
    return;
  }

  if (id) {
    // Edit
    const idx = alunos.findIndex(a => a.id_aluno === id);
    alunos[idx] = { ...alunos[idx], nome, cpf, data_nascimento: dob, email };
    // Update matricula if curso changed
    const matIdx = matriculas.findIndex(m => m.id_aluno === id);
    if (cursoId) {
      if (matIdx >= 0) {
        matriculas[matIdx].id_curso = cursoId;
      } else {
        matriculas.push({ id_matricula: nextMatriculaId++, id_aluno: id, id_curso: cursoId, data_matricula: new Date().toISOString().split('T')[0] });
      }
    }
    showToast(`✅ Aluno "${nome}" atualizado!`);
  } else {
    // Create
    const newId = nextAlunoId++;
    alunos.push({ id_aluno: newId, nome, cpf, data_nascimento: dob, email });
    if (cursoId) {
      matriculas.push({ id_matricula: nextMatriculaId++, id_aluno: newId, id_curso: cursoId, data_matricula: new Date().toISOString().split('T')[0] });
    }
    showToast(`✅ Aluno "${nome}" cadastrado com sucesso!`);
  }

  closeModal();
  navigate('alunos');
}

function excluirAluno(id) {
  const aluno = getAluno(id);
  openModal('🗑️ Confirmar Exclusão', `
    <p style="color:var(--text-secondary);margin-bottom:20px">
      Tem certeza que deseja excluir o aluno <strong style="color:var(--text-primary)">${aluno.nome}</strong>?
      <br><br>
      <span style="color:var(--red);font-size:13px">⚠️ Esta ação também removerá sua matrícula e notas.</span>
    </p>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-danger" onclick="confirmarExclusao(${id})">🗑️ Excluir</button>
    </div>
  `);
}

function confirmarExclusao(id) {
  const aluno = getAluno(id);
  alunos = alunos.filter(a => a.id_aluno !== id);
  matriculas = matriculas.filter(m => m.id_aluno !== id);
  aluno_disciplinas = aluno_disciplinas.filter(ad => ad.id_aluno !== id);
  showToast(`🗑️ Aluno "${aluno.nome}" removido.`, 'warning');
  closeModal();
  navigate('alunos');
}

function verAluno(id) {
  const a = getAluno(id);
  const mat = getAlunoMatricula(id);
  const curso = mat ? getCurso(mat.id_curso) : null;
  const notas = aluno_disciplinas.filter(ad => ad.id_aluno === id);
  const media = getCursoMedia(id);
  const freq  = getFreqMedia(id);

  const html = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
      <div class="avatar" style="background:${avatarColor(a.id_aluno)};width:56px;height:56px;font-size:22px">${getInitials(a.nome)}</div>
      <div>
        <div style="font-size:20px;font-weight:700">${a.nome}</div>
        <div style="color:var(--text-secondary);font-size:14px">${a.email}</div>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">CPF</div>
        <div class="detail-value" style="font-family:monospace">${a.cpf}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Nascimento</div>
        <div class="detail-value">${formatDate(a.data_nascimento)} (${calcAge(a.data_nascimento)} anos)</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Curso</div>
        <div class="detail-value">${curso ? curso.nome_curso : '—'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Matrícula</div>
        <div class="detail-value">${mat ? formatDate(mat.data_matricula) : '—'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Média Geral</div>
        <div class="detail-value">
          ${media !== null ? `<span class="badge ${getGradeClass(parseFloat(media))}">${media}</span>` : '—'}
        </div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Frequência Média</div>
        <div class="detail-value">
          ${freq !== null ? `<span class="badge ${getFreqClass(parseFloat(freq))}">${freq}%</span>` : '—'}
        </div>
      </div>
    </div>

    ${notas.length > 0 ? `
    <p class="section-title" style="margin-top:20px">Notas por Disciplina</p>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${notas.map(n => {
        const d = getDisc(n.id_disciplina);
        const aprovado = n.nota >= 7;
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px">
          <span style="font-size:13px;font-weight:500">${d.nome_disciplina}</span>
          <div style="display:flex;gap:8px;align-items:center">
            <span class="badge ${aprovado ? 'badge-green' : 'badge-red'}" style="font-size:12px">${n.nota.toFixed(1)}</span>
            <span class="badge badge-blue" style="font-size:12px">${n.frequencia}%</span>
          </div>
        </div>`;
      }).join('')}
    </div>
    ` : ''}

    <div class="form-actions" style="margin-top:20px">
      <button class="btn btn-ghost" onclick="closeModal()">Fechar</button>
      <button class="btn btn-primary" onclick="closeModal(); setTimeout(()=>abrirModalAluno(${id}),100)">✏️ Editar</button>
    </div>
  `;
  openModal('👁️ Detalhes do Aluno', html);
}

// ── PROFESSORES ──────────────────────────────────────────────
function renderProfessores(el) {
  const espBadge = { 'Programação': 'badge-purple', 'Banco de Dados': 'badge-blue', 'Administração': 'badge-cyan', 'Contabilidade': 'badge-yellow', 'Matemática': 'badge-green' };

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Professores</h1>
        <p>${professores.length} professores cadastrados</p>
      </div>
    </div>
    <div class="glass-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>Professor</th><th>E-mail</th><th>Especialidade</th><th>Disciplinas</th><th>Ações</th></tr>
          </thead>
          <tbody>
            ${professores.map(p => {
              const discs = disciplinas.filter(d => d.id_professor === p.id_professor);
              const cls = espBadge[p.especialidade] || 'badge-purple';
              return `<tr>
                <td><div class="avatar-cell">
                  <div class="avatar" style="background:${avatarColor(p.id_professor+5)}">${getInitials(p.nome)}</div>
                  <span style="font-weight:600">${p.nome}</span>
                </div></td>
                <td style="color:var(--text-secondary);font-size:13px">${p.email}</td>
                <td><span class="badge ${cls}">${p.especialidade}</span></td>
                <td>
                  <div style="display:flex;gap:4px;flex-wrap:wrap">
                    ${discs.map(d => `<span class="badge badge-purple" style="font-size:11px">${d.nome_disciplina}</span>`).join('')}
                  </div>
                </td>
                <td>
                  <div class="actions">
                    <button class="action-btn view" title="Ver detalhes" onclick="verProfessor(${p.id_professor})">👁</button>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function verProfessor(id) {
  const p = getProf(id);
  const discs = disciplinas.filter(d => d.id_professor === id);
  const alunos_count = new Set(
    discs.flatMap(d => aluno_disciplinas.filter(ad => ad.id_disciplina === d.id_disciplina).map(ad => ad.id_aluno))
  ).size;

  const html = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
      <div class="avatar" style="background:${avatarColor(id+5)};width:56px;height:56px;font-size:22px">${getInitials(p.nome)}</div>
      <div>
        <div style="font-size:20px;font-weight:700">${p.nome}</div>
        <div style="color:var(--text-secondary);font-size:14px">${p.email}</div>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-item"><div class="detail-label">Especialidade</div><div class="detail-value">${p.especialidade}</div></div>
      <div class="detail-item"><div class="detail-label">Total de Alunos</div><div class="detail-value">${alunos_count}</div></div>
    </div>
    <p class="section-title">Disciplinas Lecionadas</p>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${discs.map(d => {
        const c = getCurso(d.id_curso);
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px">
          <span style="font-size:13px;font-weight:500">${d.nome_disciplina}</span>
          <div style="display:flex;gap:6px">
            <span class="badge badge-purple" style="font-size:11px">${c.nome_curso.split(' ').slice(0,2).join(' ')}</span>
            <span class="badge badge-blue" style="font-size:11px">${d.carga_horaria}h</span>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="form-actions"><button class="btn btn-ghost" onclick="closeModal()">Fechar</button></div>
  `;
  openModal('👨‍🏫 Detalhes do Professor', html);
}

// ── CURSOS ───────────────────────────────────────────────────
function renderCursos(el) {
  const courseColors = ['badge-purple', 'badge-blue', 'badge-green'];

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Cursos</h1>
        <p>${cursos.length} cursos cadastrados</p>
      </div>
    </div>
    <div class="cards-grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
      ${cursos.map((c, i) => {
        const total = matriculas.filter(m => m.id_curso === c.id_curso).length;
        const discs = disciplinas.filter(d => d.id_curso === c.id_curso);
        const grads = ['linear-gradient(135deg,#7c3aed,#a855f7)', 'linear-gradient(135deg,#3b82f6,#06b6d4)', 'linear-gradient(135deg,#10b981,#06b6d4)'];
        return `
          <div class="glass-card" style="cursor:default">
            <div style="height:4px;background:${grads[i]};border-radius:99px;margin-bottom:20px"></div>
            <div style="font-size:22px;font-weight:800;margin-bottom:6px">${c.nome_curso}</div>
            <div style="color:var(--text-secondary);font-size:13px;margin-bottom:20px">Duração: ${c.duracao_semestres} semestres</div>
            <div style="display:flex;gap:16px;margin-bottom:20px">
              <div style="text-align:center">
                <div style="font-size:28px;font-weight:800;background:${grads[i]};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${total}</div>
                <div style="font-size:12px;color:var(--text-muted)">Alunos</div>
              </div>
              <div style="text-align:center">
                <div style="font-size:28px;font-weight:800;background:${grads[i]};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${discs.length}</div>
                <div style="font-size:12px;color:var(--text-muted)">Disciplinas</div>
              </div>
            </div>
            <div class="divider"></div>
            <p style="font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px">Disciplinas</p>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${discs.map(d => `<span class="badge ${courseColors[i]}">${d.nome_disciplina}</span>`).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ── DISCIPLINAS ──────────────────────────────────────────────
function renderDisciplinas(el) {
  el.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Disciplinas</h1>
        <p>${disciplinas.length} disciplinas cadastradas</p>
      </div>
    </div>
    <div class="glass-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>Disciplina</th><th>Curso</th><th>Professor</th><th>Carga Horária</th><th>Alunos</th></tr>
          </thead>
          <tbody>
            ${disciplinas.map(d => {
              const c = getCurso(d.id_curso);
              const p = getProf(d.id_professor);
              const totalAlunos = aluno_disciplinas.filter(ad => ad.id_disciplina === d.id_disciplina).length;
              const cursoBadge = d.id_curso === 1 ? 'badge-purple' : d.id_curso === 2 ? 'badge-blue' : 'badge-green';
              return `<tr>
                <td><span style="font-weight:600">${d.nome_disciplina}</span></td>
                <td><span class="badge ${cursoBadge}" style="font-size:11px">${c.nome_curso.split(' ').slice(0,2).join(' ')}</span></td>
                <td><div class="avatar-cell">
                  <div class="avatar" style="background:${avatarColor(d.id_professor+5)};width:28px;height:28px;font-size:11px">${getInitials(p.nome)}</div>
                  <span style="font-size:13px">${p.nome}</span>
                </div></td>
                <td>
                  <span class="badge badge-yellow">${d.carga_horaria}h</span>
                </td>
                <td><span style="font-weight:600">${totalAlunos}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── MATRÍCULAS ───────────────────────────────────────────────
function renderMatriculas(el) {
  el.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Matrículas</h1>
        <p>${matriculas.length} matrículas registradas</p>
      </div>
    </div>
    <div class="glass-card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>#</th><th>Aluno</th><th>Curso</th><th>Data de Matrícula</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${[...matriculas].sort((a,b) => b.data_matricula.localeCompare(a.data_matricula)).map(m => {
              const a = getAluno(m.id_aluno);
              const c = getCurso(m.id_curso);
              const cursoBadge = m.id_curso === 1 ? 'badge-purple' : m.id_curso === 2 ? 'badge-blue' : 'badge-green';
              return `<tr>
                <td style="color:var(--text-muted);font-family:monospace;font-size:12px">#${String(m.id_matricula).padStart(3,'0')}</td>
                <td><div class="avatar-cell">
                  <div class="avatar" style="background:${avatarColor(m.id_aluno)};width:30px;height:30px;font-size:12px">${getInitials(a.nome)}</div>
                  <span style="font-weight:500">${a.nome}</span>
                </div></td>
                <td><span class="badge ${cursoBadge}">${c.nome_curso}</span></td>
                <td style="color:var(--text-secondary)">${formatDate(m.data_matricula)}</td>
                <td><span class="badge badge-green">✓ Ativa</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── NOTAS & FREQUÊNCIA ───────────────────────────────────────
function renderNotas(el) {
  const filtered = aluno_disciplinas.filter(ad => {
    if (!filterNotaSearch) return true;
    const q = filterNotaSearch.toLowerCase();
    const a = getAluno(ad.id_aluno);
    const d = getDisc(ad.id_disciplina);
    return a.nome.toLowerCase().includes(q) || d.nome_disciplina.toLowerCase().includes(q);
  });

  // Summary stats
  const totalNota = aluno_disciplinas.length;
  const aprovados = aluno_disciplinas.filter(ad => ad.nota >= 7).length;
  const reprovados = totalNota - aprovados;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-header-left">
        <h1>Notas & Frequência</h1>
        <p>Desempenho acadêmico dos alunos</p>
      </div>
    </div>

    <div class="cards-grid" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-bottom:24px">
      <div class="stat-card" style="--card-grad:var(--grad-green)">
        <div class="stat-card-icon">✅</div>
        <div class="stat-card-value">${aprovados}</div>
        <div class="stat-card-label">Aprovações (nota ≥ 7)</div>
      </div>
      <div class="stat-card" style="--card-grad:var(--grad-yellow)">
        <div class="stat-card-icon">⚠️</div>
        <div class="stat-card-value">${reprovados}</div>
        <div class="stat-card-label">Reprovações (nota < 7)</div>
      </div>
      <div class="stat-card" style="--card-grad:var(--grad-purple)">
        <div class="stat-card-icon">📊</div>
        <div class="stat-card-value">${(aluno_disciplinas.reduce((a,b)=>a+b.nota,0)/totalNota).toFixed(2)}</div>
        <div class="stat-card-label">Média Geral</div>
      </div>
      <div class="stat-card" style="--card-grad:var(--grad-blue)">
        <div class="stat-card-icon">📅</div>
        <div class="stat-card-value">${(aluno_disciplinas.reduce((a,b)=>a+b.frequencia,0)/totalNota).toFixed(1)}%</div>
        <div class="stat-card-label">Frequência Média</div>
      </div>
    </div>

    <div class="glass-card">
      <div class="glass-card-header">
        <div class="filters">
          <input class="filter-input" type="text" placeholder="🔍  Buscar por aluno ou disciplina..."
            value="${filterNotaSearch}"
            oninput="filterNotaSearch=this.value; renderNotas(document.querySelector('.page-enter'))">
        </div>
        <span class="badge badge-purple">${filtered.length} registros</span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr><th>Aluno</th><th>Disciplina</th><th>Curso</th><th>Nota</th><th>Frequência</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `<tr><td colspan="6"><div class="empty-state"><div class="icon">🔍</div><p>Nenhum resultado encontrado.</p></div></td></tr>` : ''}
            ${filtered.map(ad => {
              const a = getAluno(ad.id_aluno);
              const d = getDisc(ad.id_disciplina);
              const c = getCurso(d.id_curso);
              const aprovado = ad.nota >= 7;
              const freqOk = ad.frequencia >= 75;
              const cursoBadge = d.id_curso === 1 ? 'badge-purple' : d.id_curso === 2 ? 'badge-blue' : 'badge-green';
              return `<tr>
                <td><div class="avatar-cell">
                  <div class="avatar" style="background:${avatarColor(a.id_aluno)};width:30px;height:30px;font-size:12px">${getInitials(a.nome)}</div>
                  <span style="font-weight:500;font-size:13px">${a.nome}</span>
                </div></td>
                <td style="font-size:13px">${d.nome_disciplina}</td>
                <td><span class="badge ${cursoBadge}" style="font-size:11px">${c.nome_curso.split(' ').slice(0,2).join(' ')}</span></td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="badge ${aprovado ? 'badge-green' : 'badge-red'}" style="font-size:13px;font-weight:700">${ad.nota.toFixed(1)}</span>
                  </div>
                </td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span class="badge ${freqOk ? 'badge-green' : 'badge-red'}" style="font-size:12px">${ad.frequencia}%</span>
                    <div class="progress-bar" style="width:70px"><div class="progress-fill" style="width:${ad.frequencia}%;background:${freqOk ? 'var(--grad-green)' : 'var(--grad-yellow)'}"></div></div>
                  </div>
                </td>
                <td><span class="badge ${aprovado && freqOk ? 'badge-green' : 'badge-red'}">${aprovado && freqOk ? '✓ Aprovado' : '✗ Reprovado'}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  navigate('dashboard');
});
