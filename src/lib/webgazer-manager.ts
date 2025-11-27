import webgazer from 'webgazer';

export interface GazePoint {
  x: number;
  y: number;
}

export interface CalibrationPoint {
  x: number;
  y: number;
  id: number;
}

class WebGazerManager {
  private static instance: WebGazerManager;
  private isInitialized = false;
  private isCalibrated = false;
  private gazeListeners: ((data: GazePoint | null) => void)[] = [];
  private dwellTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly DWELL_TIME = 1000; // 1 segundo

  // Smoothing (SMA - Simple Moving Average)
  private gazeBuffer: GazePoint[] = [];
  private readonly BUFFER_SIZE = 15; // Tamanho do buffer para média móvel (maior = mais suave/lento)
  private readonly MAX_JUMP_THRESHOLD = 300; // Pixels máximos permitidos entre frames

  private constructor() { }

  static getInstance(): WebGazerManager {
    if (!WebGazerManager.instance) {
      WebGazerManager.instance = new WebGazerManager();
    }
    return WebGazerManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configurações explícitas para melhor precisão em notebooks
      webgazer.setRegression('ridge');
      webgazer.setTracker('TFFacemesh'); // Mais robusto a ângulos e iluminação

      await webgazer
        .setGazeListener((data: GazePoint | null) => {
          if (data) {
            const smoothedData = this.calculateSmoothedGaze(data);
            if (smoothedData) {
              this.gazeListeners.forEach(listener => listener(smoothedData));
            }
          }
        })
        .showVideo(true)
        .showPredictionPoints(false) // Ocultar ponto vermelho de debug por padrão
        .showFaceOverlay(false)      // Otimização: Ocultar overlay de rosto
        .showFaceFeedbackBox(false)  // Otimização: Ocultar box de feedback
        .saveDataAcrossSessions(true)
        .begin();

      // Configurar precisão e estabilidade
      webgazer.params.showVideoPreview = true;
      // webgazer.applyKalmanFilter(true); // Desativamos o Kalman nativo para usar nosso SMA customizado

      // Mover o vídeo para o container no overlay superior ESQUERDO
      this.setupVideoElement();

      this.isInitialized = true;
      console.log('WebGazer inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar WebGazer:', error);
      throw error;
    }
  }

  private calculateSmoothedGaze(currentGaze: GazePoint): GazePoint | null {
    // Se o buffer estiver vazio, apenas adiciona
    if (this.gazeBuffer.length === 0) {
      this.gazeBuffer.push(currentGaze);
      return currentGaze;
    }

    const lastPoint = this.gazeBuffer[this.gazeBuffer.length - 1];

    // Calcular distância para detectar "teleporte"
    const dx = currentGaze.x - lastPoint.x;
    const dy = currentGaze.y - lastPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Se o salto for muito grande, ignorar este frame (pode ser erro de detecção ou piscada)
    if (distance > this.MAX_JUMP_THRESHOLD) {
      return null;
    }

    // Adicionar ao buffer
    this.gazeBuffer.push(currentGaze);
    if (this.gazeBuffer.length > this.BUFFER_SIZE) {
      this.gazeBuffer.shift();
    }

    // Calcular média (SMA)
    const avgX = this.gazeBuffer.reduce((sum, p) => sum + p.x, 0) / this.gazeBuffer.length;
    const avgY = this.gazeBuffer.reduce((sum, p) => sum + p.y, 0) / this.gazeBuffer.length;

    return { x: avgX, y: avgY };
  }

  private setupVideoElement() {
    const videoElement = document.getElementById('webgazerVideoFeed');
    const videoContainer = document.getElementById('webgazerVideoContainer');

    if (videoElement && videoContainer) {
      videoElement.style.position = 'absolute';
      videoElement.style.top = '0';
      videoElement.style.left = '0';
      videoElement.style.right = 'auto';
      videoElement.style.width = '160px';
      videoElement.style.height = 'auto';
      videoElement.style.opacity = '0';
      videoElement.style.pointerEvents = 'none';
      videoElement.style.zIndex = '-1';

      videoContainer.appendChild(videoElement);

      const overlayCanvas = document.getElementById('webgazerVideoCanvas');
      if (overlayCanvas) {
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.right = 'auto';
        overlayCanvas.style.width = '160px';
        overlayCanvas.style.height = '120px';
        overlayCanvas.style.pointerEvents = 'none';
        overlayCanvas.style.display = 'block';
        overlayCanvas.style.borderRadius = '12px';
        overlayCanvas.style.zIndex = '10';
        videoContainer.appendChild(overlayCanvas);
      }
    }
  }

  addGazeListener(listener: (data: GazePoint | null) => void): () => void {
    this.gazeListeners.push(listener);
    return () => {
      this.gazeListeners = this.gazeListeners.filter(l => l !== listener);
    };
  }

  async calibrate(points: CalibrationPoint[]): Promise<void> {
    this.isCalibrated = true;
  }

  getCalibrationPoints(): CalibrationPoint[] {
    // Grid 3x3 = 9 pontos
    const points: CalibrationPoint[] = [];
    const margin = 100;
    const width = window.innerWidth - 2 * margin;
    const height = window.innerHeight - 2 * margin;

    let id = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        points.push({
          x: margin + (width / 2) * col,
          y: margin + (height / 2) * row,
          id: id++
        });
      }
    }

    return points;
  }

  startDwellTimer(elementId: string, callback: () => void): void {
    this.clearDwellTimer(elementId);
    const timer = setTimeout(() => {
      callback();
      this.clearDwellTimer(elementId);
    }, this.DWELL_TIME);
    this.dwellTimers.set(elementId, timer);
  }

  clearDwellTimer(elementId: string): void {
    const timer = this.dwellTimers.get(elementId);
    if (timer) {
      clearTimeout(timer);
      this.dwellTimers.delete(elementId);
    }
  }

  clearAllDwellTimers(): void {
    this.dwellTimers.forEach(timer => clearTimeout(timer));
    this.dwellTimers.clear();
  }

  isElementInGaze(element: HTMLElement, gazePoint: GazePoint): boolean {
    const rect = element.getBoundingClientRect();
    const padding = 20;

    return (
      gazePoint.x >= rect.left - padding &&
      gazePoint.x <= rect.right + padding &&
      gazePoint.y >= rect.top - padding &&
      gazePoint.y <= rect.bottom + padding
    );
  }

  pause(): void {
    if (this.isInitialized) {
      webgazer.pause();
    }
  }

  resume(): void {
    if (this.isInitialized) {
      webgazer.resume();
    }
  }

  async stop(): Promise<void> {
    if (this.isInitialized) {
      this.clearAllDwellTimers();
      await webgazer.end();
      this.isInitialized = false;
      this.isCalibrated = false;
    }
  }

  showPredictionPoints(show: boolean): void {
    if (this.isInitialized) {
      webgazer.showPredictionPoints(show);
    }
  }

  // Método para treinamento contínuo (Recalibração)
  trainPoint(x: number, y: number) {
    if (this.isInitialized) {
      webgazer.recordScreenPosition(x, y, 'click');
    }
  }

  // Treinamento em "rajada" para calibração inicial forte
  trainPointBurst(x: number, y: number) {
    if (this.isInitialized) {
      // Grava 5 amostras rápidas para reforçar o ponto
      for (let i = 0; i < 5; i++) {
        webgazer.recordScreenPosition(x, y, 'click');
      }
    }
  }

  getIsCalibrated(): boolean {
    return this.isCalibrated;
  }

  setIsCalibrated(value: boolean): void {
    this.isCalibrated = value;
  }
}

export default WebGazerManager;