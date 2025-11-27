import { useEffect, useState, useRef } from 'react';
import WebGazerManager, { GazePoint } from '@/lib/webgazer-manager';

interface UseEyeTrackingOptions {
  onDwell?: (elementId: string) => void;
  dwellTime?: number;
}

export const useEyeTracking = (options: UseEyeTrackingOptions = {}) => {
  const [gazePoint, setGazePoint] = useState<GazePoint | null>(null);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [dwellProgress, setDwellProgress] = useState<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const manager = WebGazerManager.getInstance();

  useEffect(() => {
    const removeListener = manager.addGazeListener((data) => {
      setGazePoint(data);
    });

    return () => {
      removeListener();
      manager.clearAllDwellTimers();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!gazePoint) return;

    // Verificar todos os elementos rastreáveis
    const trackableElements = document.querySelectorAll('[data-eye-trackable]');
    let foundElement: HTMLElement | null = null;

    trackableElements.forEach((element) => {
      if (manager.isElementInGaze(element as HTMLElement, gazePoint)) {
        foundElement = element as HTMLElement;
      }
    });

    if (foundElement) {
      const elementId = foundElement.getAttribute('data-eye-id') || '';

      if (focusedElement !== elementId) {
        // Novo elemento focado
        manager.clearAllDwellTimers();
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }

        setFocusedElement(elementId);
        setDwellProgress(0);

        // Iniciar progresso visual
        const startTime = Date.now();
        progressIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min((elapsed / 1000) * 100, 100);
          setDwellProgress(progress);
        }, 50);

        // Iniciar timer de dwell
        manager.startDwellTimer(elementId, () => {
          if (options.onDwell) {
            options.onDwell(elementId);
          }
          setDwellProgress(0);
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        });
      }
    } else {
      // Nenhum elemento focado
      if (focusedElement) {
        manager.clearAllDwellTimers();
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        setFocusedElement(null);
        setDwellProgress(0);
      }
    }
  }, [gazePoint, focusedElement, options]);

  return {
    gazePoint,
    focusedElement,
    dwellProgress
  };
};