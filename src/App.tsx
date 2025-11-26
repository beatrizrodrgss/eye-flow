import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WebGazerManager from '@/lib/webgazer-manager';
import EyeTrackingCalibration from '@/components/EyeTrackingCalibration';
import EyeTrackingOverlay from '@/components/EyeTrackingOverlay';
import Index from './pages/Index';
import Banking from './pages/Banking';
import Restaurant from './pages/Restaurant';
import Hospital from './pages/Hospital';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
  const [isCalibrating, setIsCalibrating] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const initWebGazer = async () => {
      try {
        const manager = WebGazerManager.getInstance();
        await manager.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Erro ao inicializar WebGazer:', error);
      }
    };

    initWebGazer();

    return () => {
      const manager = WebGazerManager.getInstance();
      manager.stop();
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCalibrationComplete = () => {
    setIsCalibrating(false);
  };

  const handleRecalibrate = () => {
    setIsCalibrating(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="text-6xl mb-4">👁️</div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Inicializando EYE-Flow</h2>
          <p className="text-blue-700">Por favor, permita o acesso à câmera...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          {isCalibrating ? (
            <EyeTrackingCalibration onComplete={handleCalibrationComplete} />
          ) : (
            <>
              <EyeTrackingOverlay onRecalibrate={handleRecalibrate} />
              <Routes>
                <Route path="/" element={<Index darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
                <Route path="/banking" element={<Banking darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
                <Route path="/restaurant" element={<Restaurant darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
                <Route path="/hospital" element={<Hospital darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
                <Route path="/settings" element={<Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;