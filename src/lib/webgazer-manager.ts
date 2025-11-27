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
      // Buffer para suavização (Moving Average)
      const gazeBuffer: GazePoint[] = [];
      const BUFFER_SIZE = 10; // Tamanho do buffer para média móvel

      await webgazer
        .setGazeListener((data: GazePoint | null) => {
          if (data) {
            // Adicionar ponto ao buffer
            gazeBuffer.push(data);
            if (gazeBuffer.length > BUFFER_SIZE) {
              gazeBuffer.shift();
            }

            // Calcular média dos pontos no buffer
            const avgX = gazeBuffer.reduce((sum, p) => sum + p.x, 0) / gazeBuffer.length;
            const avgY = gazeBuffer.reduce((sum, p) => sum + p.y, 0) / gazeBuffer.length;

            const smoothedData = { ...data, x: avgX, y: avgY };

            this.gazeListeners.forEach(listener => listener(smoothedData));
          }
        })
        .showVideo(true) // Mostrar vídeo
        .showPredictionPoints(true)
        .saveDataAcrossSessions(true)
        .begin();

      // Configurar precisão e estabilidade
      webgazer.params.showVideoPreview = true;
      webgazer.applyKalmanFilter(true); // Estabilizar o rastreamento

      // Mover o vídeo para o container no overlay superior ESQUERDO
      const videoElement = document.getElementById('webgazerVideoFeed');
      const videoContainer = document.getElementById('webgazerVideoContainer');

      if (videoElement && videoContainer) {
        // Configurar estilos do vídeo - OCULTAR O ELEMENTO DE VÍDEO RAW para evitar duplicação
        // O canvas (webgazerVideoCanvas) será o responsável por mostrar a imagem
        videoElement.style.position = 'absolute';
        videoElement.style.top = '0';
        videoElement.style.left = '0';
        videoElement.style.right = 'auto';
        videoElement.style.width = '160px';
        videoElement.style.height = 'auto';
        videoElement.style.opacity = '0'; // Ocultar visualmente, mas manter no DOM
        videoElement.style.pointerEvents = 'none';
        videoElement.style.zIndex = '-1'; // Jogar para trás

        // Mover para o container
        videoContainer.appendChild(videoElement);

        // Garantir que o canvas de overlay também seja movido ou ajustado se necessário
        const overlayCanvas = document.getElementById('webgazerVideoCanvas');
        if (overlayCanvas) {
          overlayCanvas.style.position = 'absolute';
          overlayCanvas.style.top = '0';
          overlayCanvas.style.left = '0';
          overlayCanvas.style.right = 'auto';
          overlayCanvas.style.width = '160px';
          overlayCanvas.style.height = '120px'; // Altura aproximada para 4:3
          overlayCanvas.style.pointerEvents = 'none';
          overlayCanvas.style.display = 'block';
          overlayCanvas.style.borderRadius = '12px';
          overlayCanvas.style.zIndex = '10'; // Garantir que fique visível
          videoContainer.appendChild(overlayCanvas);
        }

        // Ajustar o face overlay se existir
        const faceOverlay = document.getElementById('webgazerFaceOverlay');
        if (faceOverlay) {
          faceOverlay.style.display = 'block'; // Mostrar o box verde do rosto
          faceOverlay.style.position = 'absolute';
          faceOverlay.style.top = '0';
          faceOverlay.style.left = '0';
          faceOverlay.style.right = 'auto';
          faceOverlay.style.width = '160px';
          faceOverlay.style.height = '120px';
          faceOverlay.style.pointerEvents = 'none';
          faceOverlay.style.borderRadius = '12px';
          faceOverlay.style.zIndex = '20'; // Ficar acima do canvas
          videoContainer.appendChild(faceOverlay);
        }
      }

      this.isInitialized = true;
      console.log('WebGazer inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar WebGazer:', error);
      throw error;
    }
  }

  addGazeListener(listener: (data: GazePoint | null) => void): () => void {
    this.gazeListeners.push(listener);
    return () => {
      this.gazeListeners = this.gazeListeners.filter(l => l !== listener);
    };
  }

  async calibrate(points: CalibrationPoint[]): Promise<void> {
    // A calibração é feita através da interação do usuário com os pontos
    // O WebGazer automaticamente aprende com os cliques
    this.isCalibrated = true;
  }

  getCalibrationPoints(): CalibrationPoint[] {
    // Grid 4x4 = 16 pontos
    const points: CalibrationPoint[] = [];
    const margin = 100;
    const width = window.innerWidth - 2 * margin;
    const height = window.innerHeight - 2 * margin;

    let id = 0;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        points.push({
          x: margin + (width / 3) * col,
          y: margin + (height / 3) * row,
          id: id++
        });
      }
    }

    return points;
  }

  startDwellTimer(elementId: string, callback: () => void): void {
    // Limpar timer existente
    this.clearDwellTimer(elementId);

    // Criar novo timer
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
    const padding = 20; // Área de tolerância

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

  getIsCalibrated(): boolean {
    return this.isCalibrated;
  }

  setIsCalibrated(value: boolean): void {
    this.isCalibrated = value;
  }
}

export default WebGazerManager;