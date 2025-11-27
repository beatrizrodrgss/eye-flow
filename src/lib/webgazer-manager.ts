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

  // Smoothing (EMA)
  private lastGazePoint: GazePoint | null = null;
  private readonly SMOOTHING_FACTOR = 0.7; // Ajustável (0.1 = muito suave/lento, 0.9 = rápido/jittery)
  private readonly MAX_JUMP_THRESHOLD = 300; // Pixels máximos permitidos entre frames (evita teleporte)

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
        .saveDataAcrossSessions(true)
        .begin();

      // Configurar precisão e estabilidade
      webgazer.params.showVideoPreview = true;
      // webgazer.applyKalmanFilter(true); // Desativamos o Kalman nativo para usar nosso EMA customizado

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
    if (!this.lastGazePoint) {
      this.lastGazePoint = currentGaze;
      return currentGaze;
    }

    // Calcular distância para detectar "teleporte"
    const dx = currentGaze.x - this.lastGazePoint.x;
    const dy = currentGaze.y - this.lastGazePoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Se o salto for muito grande, ignorar este frame (pode ser erro de detecção ou piscada)
    if (distance > this.MAX_JUMP_THRESHOLD) {
      return null;
    }

    // Exponential Moving Average (EMA)
    const smoothX = this.SMOOTHING_FACTOR * currentGaze.x + (1 - this.SMOOTHING_FACTOR) * this.lastGazePoint.x;
    const smoothY = this.SMOOTHING_FACTOR * currentGaze.y + (1 - this.SMOOTHING_FACTOR) * this.lastGazePoint.y;

    const smoothedPoint = { x: smoothX, y: smoothY };
    this.lastGazePoint = smoothedPoint;

    return smoothedPoint;
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

      const faceOverlay = document.getElementById('webgazerFaceOverlay');
      if (faceOverlay) {
        faceOverlay.style.display = 'block';
        faceOverlay.style.position = 'absolute';
        faceOverlay.style.top = '0';
        faceOverlay.style.left = '0';
        faceOverlay.style.right = 'auto';
        faceOverlay.style.width = '160px';
        faceOverlay.style.height = '120px';
        faceOverlay.style.pointerEvents = 'none';
        faceOverlay.style.borderRadius = '12px';
        faceOverlay.style.zIndex = '20';
        videoContainer.appendChild(faceOverlay);
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

  getIsCalibrated(): boolean {
    return this.isCalibrated;
  }

  setIsCalibrated(value: boolean): void {
    this.isCalibrated = value;
  }
}

export default WebGazerManager;