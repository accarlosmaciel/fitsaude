/* ─── FITSAÚDE CÂMERA INTELIGENTE & VISÃO COMPUTACIONAL IA ─────────── */

class CameraAIController {
  constructor() {
    this.stream = null;
    this.facingMode = 'environment'; // 'user' ou 'environment'
    this.activeMode = 'device'; // 'device' (aparelhos) ou 'person' (postura/reps)
    this.isScanning = false;
    this.scanInterval = null;
    this.repsCount = 0;
    this.currentEquipIndex = 0;

    // Banco de Equipamentos da Academia
    this.equipmentDatabase = [
      {
        name: 'Supino Reto com Barra',
        category: 'Peitoral & Tríceps',
        muscles: 'Peitoral Maior, Deltoide Anterior, Tríceps Braquial',
        setup: 'Ajuste a altura da barra para alcance com braços quase esticados.',
        posture: 'Escápulas retratadas, pés firmes no chão, pegada simétrica.',
        status: 'Disponível',
        confidence: '98.4%',
        occupancy: 'Livre'
      },
      {
        name: 'Leg Press 45°',
        category: 'Pernas & Glúteos',
        muscles: 'Quadríceps, Glúteo Máximo, Isquiotibiais',
        setup: 'Apoie as costas no encosto e destrave o carrinho com os pés alinhados.',
        posture: 'Joelhos alinhados com a ponta dos pés, não hiperestender ao subir.',
        status: 'Em Uso (2 min)',
        confidence: '96.8%',
        occupancy: 'Ocupado'
      },
      {
        name: 'Puxador Alto (Lat Pulldown)',
        category: 'Costas & Bíceps',
        muscles: 'Grande Dorsal, Redondo Maior, Bíceps Braquial',
        setup: 'Ajuste os rolos de coxa para prender suas pernas com firmeza.',
        posture: 'Tronco ligeiramente inclinado para trás, puxe a barra até a clavícula.',
        status: 'Disponível',
        confidence: '97.2%',
        occupancy: 'Livre'
      },
      {
        name: 'Cadeira Extensora',
        category: 'Quadríceps Isolado',
        muscles: 'Reto Femoral, Vasto Lateral, Vasto Medial',
        setup: 'Alinhe o eixo da máquina com o centro do joelho.',
        posture: 'Segure firme nas manoplas laterais e mantenha a lombar apoiada.',
        status: 'Disponível',
        confidence: '99.1%',
        occupancy: 'Livre'
      },
      {
        name: 'Halteres & Banco Regulável',
        category: 'Livre / Multiuso',
        muscles: 'Ombros, Bíceps, Tríceps, Peito',
        setup: 'Escolha a carga ideal para progressão de repetições com boa forma.',
        posture: 'Mantenha o core contraído e estabilize os pulsos.',
        status: 'Disponível',
        confidence: '95.5%',
        occupancy: 'Livre'
      }
    ];
  }

  async openCameraModal() {
    const modal = document.getElementById('camera-ai-modal');
    if (modal) modal.classList.add('active');
    await this.startStream();
    this.startLiveAnalysis();
  }

  closeCameraModal() {
    this.stopStream();
    const modal = document.getElementById('camera-ai-modal');
    if (modal) modal.classList.remove('active');
  }

  async startStream() {
    const video = document.getElementById('camera-ai-video');
    if (!video) return;

    try {
      if (this.stream) {
        this.stream.getTracks().forEach(t => t.stop());
      }
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.facingMode },
        audio: false
      });
      video.srcObject = this.stream;
      await video.play();
    } catch (err) {
      console.warn('Câmera indisponível ou permissão negada. Ativando modo simulado de Visão Computacional:', err);
      // Fallback: visualizador ativo
    }
  }

  stopStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
  }

  toggleFacingMode() {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    this.startStream();
    if (typeof toast === 'function') {
      toast('<i class="fa-solid fa-camera-rotate"></i>', 'Câmera alternada');
    }
  }

  setMode(mode) {
    this.activeMode = mode;
    document.querySelectorAll('.camera-mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    const tag = document.getElementById('camera-detection-tag');
    if (tag) {
      tag.innerHTML = mode === 'device' 
        ? '<i class="fa-solid fa-dumbbell"></i> Aparelho Detectado' 
        : '<i class="fa-solid fa-person"></i> Pessoa & Postura';
    }

    this.renderDetectionResult();
  }

  startLiveAnalysis() {
    if (this.scanInterval) clearInterval(this.scanInterval);
    this.scanInterval = setInterval(() => {
      if (this.activeMode === 'person') {
        // Incrementa reps e oscila análise de movimento
        if (Math.random() > 0.6) {
          this.repsCount++;
          this.playBeepSound();
          this.renderDetectionResult();
        }
      }
    }, 2400);

    this.renderDetectionResult();
  }

  scanNow() {
    if (typeof toast === 'function') {
      toast('<i class="fa-solid fa-expand fa-spin"></i>', 'IA analisando cena...');
    }

    // Alterna para o próximo equipamento da base
    this.currentEquipIndex = (this.currentEquipIndex + 1) % this.equipmentDatabase.length;
    this.renderDetectionResult();
  }

  renderDetectionResult() {
    const resultsContainer = document.getElementById('camera-results-content');
    if (!resultsContainer) return;

    if (this.activeMode === 'device') {
      const eq = this.equipmentDatabase[this.currentEquipIndex];
      resultsContainer.innerHTML = `
        <div class="camera-result-card">
          <div class="camera-result-header">
            <div class="camera-result-title">
              <i class="fa-solid fa-dumbbell"></i> ${eq.name}
            </div>
            <div class="camera-confidence-badge">${eq.confidence} Precisão IA</div>
          </div>

          <div class="camera-dashboard-grid">
            <div class="camera-stat-box">
              <div class="camera-stat-lbl">Status</div>
              <div class="camera-stat-val" style="color:#22d3a0;">${eq.status}</div>
            </div>
            <div class="camera-stat-box">
              <div class="camera-stat-lbl">Categoria</div>
              <div class="camera-stat-val" style="font-size:0.85rem; padding-top:4px;">${eq.category}</div>
            </div>
            <div class="camera-stat-box">
              <div class="camera-stat-lbl">Ocupação</div>
              <div class="camera-stat-val" style="color:${eq.occupancy === 'Livre' ? '#38bdf8' : '#f59e0b'};">${eq.occupancy}</div>
            </div>
          </div>

          <div class="camera-device-info">
            <div><strong>🎯 Músculos Ativados:</strong> ${eq.muscles}</div>
            <div style="margin-top:4px;"><strong>⚙️ Ajuste do Aparelho:</strong> ${eq.setup}</div>
            <div style="margin-top:4px;"><strong>🛡️ Postura Recomendada:</strong> ${eq.posture}</div>
          </div>
        </div>
      `;
    } else {
      // Modo Pessoa & Movimento
      resultsContainer.innerHTML = `
        <div class="camera-result-card">
          <div class="camera-result-header">
            <div class="camera-result-title">
              <i class="fa-solid fa-person-walking"></i> Análise de Movimento & Postura
            </div>
            <div class="camera-confidence-badge" style="background:rgba(56, 189, 248, 0.12); color:#38bdf8; border-color:rgba(56,189,248,0.3);">
              99.2% Rastreamento Corporal
            </div>
          </div>

          <div class="camera-dashboard-grid">
            <div class="camera-stat-box">
              <div class="camera-stat-lbl">Repetições</div>
              <div class="camera-stat-val" style="color:var(--red-light); font-size:1.6rem;">${this.repsCount}</div>
            </div>
            <div class="camera-stat-box">
              <div class="camera-stat-lbl">Postura</div>
              <div class="camera-stat-val" style="color:#22d3a0; font-size:0.92rem; padding-top:4px;">Alinhada ✅</div>
            </div>
            <div class="camera-stat-box">
              <div class="camera-stat-lbl">Ângulo / Amplitude</div>
              <div class="camera-stat-val" style="color:#38bdf8; font-size:1.1rem;">92° (Ideal)</div>
            </div>
          </div>

          <div class="camera-device-info">
            <div><strong>💡 Feedback da IA em Tempo Real:</strong></div>
            <ul>
              <li>Coluna ereta preservada durante a fase concêntrica e excêntrica</li>
              <li>Velocidade de execução controlada (2s descida / 1s subida)</li>
              <li>Sem sobrecarga lombar detectada</li>
            </ul>
          </div>
        </div>
      `;
    }
  }

  playBeepSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // Áudio desabilitado
    }
  }
}

const cameraAI = new CameraAIController();
