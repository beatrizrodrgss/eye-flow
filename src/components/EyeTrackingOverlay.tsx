import { Button } from '@/components/ui/button';
import { Eye, RotateCcw } from 'lucide-react';

interface EyeTrackingOverlayProps {
  onRecalibrate: () => void;
}

export default function EyeTrackingOverlay({ onRecalibrate }: EyeTrackingOverlayProps) {
  return (
    <>
      {/* Câmera do WebGazer - posicionada no canto superior direito */}
      <div id="cameraWebgazerVideoContainer" className="fixed top-4 right-4 z-40">
        <div className="bg-white/90 dark:bg-blue-900/90 rounded-2xl shadow-2xl p-3 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Rastreamento Ativo
            </span>
          </div>
          <div id="webgazerVideoContainer" className="rounded-lg overflow-hidden" />
        </div>
      </div>

      {/* Botão de recalibração */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={onRecalibrate}
          className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg"
          data-eye-trackable
          data-eye-id="recalibrate-button"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
      </div>
    </>
  );
}