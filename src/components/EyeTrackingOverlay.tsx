import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface EyeTrackingOverlayProps {
  onRecalibrate: () => void;
}

export default function EyeTrackingOverlay({ onRecalibrate }: EyeTrackingOverlayProps) {
  return (
    <>
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