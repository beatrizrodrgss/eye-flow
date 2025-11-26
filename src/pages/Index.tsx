import { useNavigate } from 'react-router-dom';
import { Building2, Utensils, Hospital } from 'lucide-react';
import { useEyeTracking } from '@/hooks/useEyeTracking';
import Layout from '@/components/Layout';

interface HomeProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Home({ darkMode, toggleDarkMode }: HomeProps) {
  const navigate = useNavigate();

  const { focusedElement, dwellProgress } = useEyeTracking({
    onDwell: (elementId) => {
      switch (elementId) {
        case 'home-banking':
          navigate('/banking');
          break;
        case 'home-restaurant':
          navigate('/restaurant');
          break;
        case 'home-hospital':
          navigate('/hospital');
          break;
      }
    }
  });

  const mainButtons = [
    {
      id: 'home-banking',
      icon: Building2,
      label: 'Banking',
      path: '/banking',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      id: 'home-restaurant',
      icon: Utensils,
      label: 'Restaurante',
      path: '/restaurant',
      gradient: 'from-blue-500 to-blue-700'
    },
    {
      id: 'home-hospital',
      icon: Hospital,
      label: 'Totem Hospital',
      path: '/hospital',
      gradient: 'from-blue-600 to-blue-800'
    }
  ];

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        {/* Logo/Title */}
        <div className="mb-16 text-center animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 bg-clip-text text-transparent mb-4">
            EYE-Flow
          </h1>
          <p className="text-xl text-blue-600 dark:text-blue-400">
            Sistema de Totem Acessível com Rastreamento Ocular
          </p>
        </div>

        {/* Main Buttons */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-6xl px-8">
          {mainButtons.map((button, index) => {
            const Icon = button.icon;
            const isFocused = focusedElement === button.id;

            return (
              <button
                key={button.id}
                data-eye-trackable
                data-eye-id={button.id}
                onClick={() => navigate(button.path)}
                className={`relative group h-64 rounded-3xl bg-gradient-to-br ${button.gradient} dark:opacity-90 shadow-2xl hover:shadow-3xl transition-all duration-500 flex flex-col items-center justify-center gap-6 hover:scale-105 animate-in fade-in slide-in-from-bottom duration-700`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Icon className="w-24 h-24 text-white drop-shadow-lg" />
                <span className="text-3xl font-bold text-white drop-shadow-lg">
                  {button.label}
                </span>

                {isFocused && (
                  <div className="absolute inset-0 rounded-3xl border-8 border-white/50 animate-pulse" />
                )}
                
                {isFocused && (
                  <div 
                    className="absolute inset-0 rounded-3xl bg-white/20"
                    style={{
                      clipPath: `inset(0 ${100 - dwellProgress}% 0 0)`
                    }}
                  />
                )}

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}