import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import WebGazerManager, { GazePoint } from '@/lib/webgazer-manager';

interface CalibrationProps {
  onComplete: () => void;
}

export default function EyeTrackingCalibration({ onComplete }: CalibrationProps) {
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [points, setPoints] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [status, setStatus] = useState<'waiting' | 'collecting' | 'success' | 'error'>('waiting');
  const [progress, setProgress] = useState(0);
  const manager = WebGazerManager.getInstance();
  const samplesRef = useRef<GazePoint[]>([]);
  const collectionTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const calibrationPoints = manager.getCalibrationPoints();
    setPoints(calibrationPoints);
    manager.startCalibrationSession();
  }, []);

  useEffect(() => {
    if (points.length > 0 && currentPointIndex < points.length) {
      startPointCalibration(points[currentPointIndex]);
    }
  }, [currentPointIndex, points]);

  const startPointCalibration = (point: { x: number; y: number }) => {
    setStatus('waiting');
    setProgress(0);
    samplesRef.current = [];

    // Pequeno delay antes de começar a coletar para dar tempo do usuário olhar
    setTimeout(() => {
      setStatus('collecting');
      collectSamples(point);
    }, 500);
  };

  const collectSamples = async (targetPoint: { x: number; y: number }) => {
    const SAMPLES_NEEDED = 20; // ~600ms a 30fps
    const INTERVAL = 30;

    const intervalId = setInterval(async () => {
      const prediction = await manager.getCurrentPrediction();

      if (prediction) {
        samplesRef.current.push(prediction);
        setProgress((samplesRef.current.length / SAMPLES_NEEDED) * 100);

        // Treinar continuamente enquanto olha
        manager.trainPoint(targetPoint.x, targetPoint.y);

        if (samplesRef.current.length >= SAMPLES_NEEDED) {
          clearInterval(intervalId);
          validateAndAdvance(targetPoint);
        }
      }
    }, INTERVAL);

    collectionTimerRef.current = intervalId; // Guardar para limpar se necessário
  };

  const validateAndAdvance = (targetPoint: { x: number; y: number }) => {
    const isValid = manager.validateSampleStability(samplesRef.current);

    if (isValid) {
      setStatus('success');
      setTimeout(() => {
        if (currentPointIndex < points.length - 1) {
          setCurrentPointIndex(prev => prev + 1);
        } else {
          finishCalibration();
        }
      }, 500);
    } else {
      setStatus('error');
      // Tentar novamente após um breve aviso
      setTimeout(() => {
        samplesRef.current = [];
        setProgress(0);
        setStatus('collecting');
        collectSamples(targetPoint); // Retry automático
      }, 1500);
    }
  };

  const finishCalibration = () => {
    manager.setIsCalibrated(true);
    onComplete();
  };

  // Limpeza
  useEffect(() => {
    return () => {
      if (collectionTimerRef.current) {
        clearInterval(collectionTimerRef.current);
      }
    };
  }, []);

  if (points.length === 0) return null;

  const currentPoint = points[currentPointIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      <div className="absolute top-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-2">
          Calibração ({currentPointIndex + 1}/{points.length})
        </h2>
        <p className="text-lg text-gray-300">
          {status === 'waiting' && "Olhe para o ponto..."}
          {status === 'collecting' && "Mantenha o olhar fixo..."}
          {status === 'success' && "Ótimo! Próximo ponto..."}
          {status === 'error' && "Não mexa a cabeça! Tente novamente."}
        </p>
      </div>

      {/* Ponto de Calibração */}
      {currentPoint && (
        <div
          className="absolute flex items-center justify-center transition-all duration-300"
          style={{
            left: `${currentPoint.x}px`,
            top: `${currentPoint.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Anel de Progresso */}
          <div
            className={`w-16 h-16 rounded-full border-4 transition-all duration-200 ${status === 'error' ? 'border-red-500' :
                status === 'success' ? 'border-green-500' : 'border-blue-500'
              }`}
            style={{
              opacity: status === 'waiting' ? 0.5 : 1,
              transform: `scale(${1 + (progress / 100) * 0.5})`
            }}
          />

          {/* Ponto Central */}
          <div className={`w-4 h-4 rounded-full absolute ${status === 'error' ? 'bg-red-500' : 'bg-white'
            }`} />
        </div>
      )}

      <div className="absolute bottom-8">
        <Button
          onClick={onComplete}
          variant="outline"
          className="bg-white/10 text-white hover:bg-white/20 border-white/20"
        >
          Cancelar Calibração
        </Button>
      </div>
    </div>
  );
}