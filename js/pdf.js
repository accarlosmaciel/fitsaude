/* ─── FITSAÚDE PDF GENERATOR MODULE ───────────────────────────── */

function renderPlanilhas() {
  const container = document.getElementById('sheets-grid');
  if (!container || typeof PLANILHAS_DATA === 'undefined') return;

  container.innerHTML = PLANILHAS_DATA.map((plan, idx) => `
    <div class="sheet-card">
      <div class="sheet-card-header">
        <div class="sheet-card-icon">${plan.icon}</div>
        <div>
          <div class="sheet-card-title">${plan.title}</div>
          <div class="sheet-card-subtitle">Público: ${plan.gender}</div>
        </div>
      </div>
      <div class="sheet-card-desc">${plan.desc}</div>
      <div class="sheet-card-tags">
        ${plan.tags.map(t => `<span class="sheet-tag">${t}</span>`).join('')}
      </div>
      <div class="sheet-card-actions">
        <button class="btn-sheet-download" onclick="downloadPDF('${plan.gender.toLowerCase()}')">
          <i class="fa-solid fa-file-pdf"></i> Baixar PDF
        </button>
        <button class="btn-sheet-download" onclick="downloadPlanilha(${idx})" style="background:rgba(255,255,255,0.08);color:#fff;box-shadow:none;">
          <i class="fa-solid fa-file-csv"></i> Baixar CSV
        </button>
        <button class="btn-sheet-apply" onclick="applyPlanilha(${idx})">
          <i class="fa-solid fa-bolt"></i> Aplicar no App
        </button>
      </div>
    </div>
  `).join('');
}

function downloadPDF(genderType) {
  if (typeof jspdf === 'undefined') {
    alert('Biblioteca jsPDF ainda não foi carregada!');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const isMasc = genderType === 'masculino';
  const schedData = isMasc ? DEFAULT_MASCULINO : DEFAULT_FEMININO;
  const title = isMasc ? 'PLANILHA DE TREINO MASCULINA — HIPERTROFIA ABC' : 'PLANILHA DE TREINO FEMININA — DEFINIÇÃO & GLÚTEOS';
  const primaryColor = isMasc ? [220, 20, 60] : [167, 139, 250];

  const profile = typeof loadProfileData === 'function' ? loadProfileData() : DEFAULT_PROFILE;

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('FITSAÚDE — SISTEMA DE TREINOS', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(title, 14, 19);

  // Profile Subheader
  doc.setFillColor(245, 245, 250);
  doc.rect(0, 26, 210, 14, 'F');
  doc.setTextColor(50, 50, 60);
  doc.setFontSize(8);
  doc.text(`Aluno: ${profile.name}  |  Idade: ${profile.age}  |  Peso: ${profile.weight}kg  |  Altura: ${profile.height}cm  |  Objetivo: ${profile.goal}`, 14, 34);

  let currentY = 44;

  schedData.forEach((d) => {
    if (currentY > 260) {
      doc.addPage();
      currentY = 16;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${d.day.toUpperCase()} — ${d.name} (${d.dur || 'Descanso'})`, 14, currentY);
    currentY += 4;

    if (d.rest || !d.exercises.length) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 130);
      doc.text('• Dia de Descanso & Recuperação Muscular Ativa.', 16, currentY);
      currentY += 10;
      return;
    }

    const tableRows = d.exercises.map((e, idx) => [
      idx + 1,
      e.name,
      e.muscle,
      e.sets,
      e.reps,
      e.weight || '—'
    ]);

    doc.autoTable({
      startY: currentY,
      head: [['#', 'Exercício', 'Grupo Muscular', 'Séries', 'Reps', 'Carga (kg)']],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2.5
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { cellWidth: 65 },
        2: { cellWidth: 45 },
        3: { halign: 'center', cellWidth: 20 },
        4: { halign: 'center', cellWidth: 22 },
        5: { halign: 'center', cellWidth: 20 }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = doc.lastAutoTable.finalY + 8;
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 120);
    doc.text(`FitSaúde — ${title}  •  Página ${i}/${pageCount}`, 105, 292, { align: 'center' });
  }

  const filename = isMasc ? 'FitSaude_Treino_Masculino.pdf' : 'FitSaude_Treino_Feminino.pdf';
  doc.save(filename);
  toast('<i class="fa-solid fa-file-pdf"></i>', `PDF ${isMasc ? 'Masculino' : 'Feminino'} gerado!`);
}
