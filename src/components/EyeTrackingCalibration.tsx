import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import WebGazerManager from '@/lib/webgazer-manager';

interface CalibrationProps {
  onComplete: () => void;
}

export default function EyeTrackingCalibration({ onComplete }: CalibrationProps) {
  const [currentPoint, setCurrentPoint] = useState(0);
  const [points, setPoints] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [clickedPoints, setClickedPoints] = useState<Set<number>>(new Set());
  const manager = WebGazerManager.getInstance();

  useEffect(() => {
    const calibrationPoints = manager.getCalibrationPoints();
    setPoints(calibrationPoints);
  }, []);

  const handlePointClick = (pointId: number) => {
    const newClickedPoints = new Set(clickedPoints);
    newClickedPoints.add(pointId);
    setClickedPoints(newClickedPoints);

    if (newClickedPoints.size === points.length) {
      // Calibração completa
      setTimeout(() => {
        manager.setIsCalibrated(true);
        onComplete();
      }, 500);
    } else {
      setCurrentPoint(currentPoint + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex flex-col items-center justify-center">
      <div className="absolute top-8 text-center">
        <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
          Calibração do Rastreamento Ocular
        </h2>
        <p className="text-lg text-blue-700 dark:text-blue-300">
          Olhe para cada ponto azul e clique 1x nele ({clickedPoints.size}/{points.length})
        </p>
      </div>

      {points.map((point) => {
        const isClicked = clickedPoints.has(point.id);
        const isCurrent = point.id === currentPoint;

        return (
          <button
            key={point.id}
            onClick={() => handlePointClick(point.id)}
            className={`absolute w-16 h-16 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isClicked
                ? 'bg-green-500 scale-75'
                : isCurrent
                ? 'bg-blue-500 animate-pulse scale-110 shadow-lg shadow-blue-500/50'
                : 'bg-blue-400'
            }`}
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {isClicked && (
              <span className="text-white text-2xl">✓</span>
            )}
          </button>
        );
      })}

      <div className="absolute bottom-8">
        <Button
          onClick={onComplete}
          variant="outline"
          className="bg-white/80 dark:bg-blue-900/80 hover:bg-white dark:hover:bg-blue-800"
        >
          Pular Calibração
        </Button>
      </div>
    </div>
  );
}