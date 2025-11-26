import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Building2, Utensils, Hospital, Settings, HelpCircle, Eye } from 'lucide-react';
import { useEyeTracking } from '@/hooks/useEyeTracking';

interface LayoutProps {
    children: ReactNode;
    title?: string;
    showSupport?: boolean;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export default function Layout({ children, title, showSupport = false, darkMode, toggleDarkMode }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const { focusedElement, dwellProgress } = useEyeTracking({
        onDwell: (elementId) => {
            switch (elementId) {
                case 'nav-banking':
                    navigate('/banking');
                    break;
                case 'nav-restaurant':
                    navigate('/restaurant');
                    break;
                case 'nav-hospital':
                    navigate('/hospital');
                    break;
                case 'nav-settings':
                    navigate('/settings');
                    break;
                case 'nav-home':
                    navigate('/');
                    break;
                case 'theme-toggle':
                    toggleDarkMode();
                    break;
                case 'support-button':
                    alert('Suporte será chamado em breve!');
                    break;
            }
        }
    });

    const navItems = [
        { id: 'nav-banking', icon: Building2, label: 'Banco', path: '/banking' },
        { id: 'nav-restaurant', icon: Utensils, label: 'Restaurante', path: '/restaurant' },
        { id: 'nav-hospital', icon: Hospital, label: 'Hospital', path: '/hospital' },
        { id: 'nav-settings', icon: Settings, label: 'Configurações', path: '/settings' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-24 bg-white/80 dark:bg-blue-900/80 backdrop-blur-md shadow-2xl border-r-2 border-blue-200 dark:border-blue-700 flex flex-col items-center py-8 gap-6 z-30">
                {/* Logo/Home */}
                <button
                    data-eye-trackable
                    data-eye-id="nav-home"
                    onClick={() => navigate('/')}
                    className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                >
                    <Eye className="w-8 h-8 text-white" />
                    {focusedElement === 'nav-home' && (
                        <div className="absolute inset-0 rounded-2xl border-4 border-blue-500 dark:border-blue-400 animate-pulse" />
                    )}
                    {focusedElement === 'nav-home' && (
                        <div
                            className="absolute inset-0 rounded-2xl bg-blue-500/20 dark:bg-blue-400/20"
                            style={{
                                clipPath: `inset(0 ${100 - dwellProgress}% 0 0)`
                            }}
                        />
                    )}
                </button>

                <div className="w-full h-px bg-blue-200 dark:bg-blue-700" />

                {/* Navigation Items */}
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <button
                            key={item.id}
                            data-eye-trackable
                            data-eye-id={item.id}
                            onClick={() => navigate(item.path)}
                            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isActive
                                ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-lg'
                                : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700'
                                }`}
                        >
                            <Icon className="w-7 h-7" />
                            {focusedElement === item.id && (
                                <div className="absolute inset-0 rounded-2xl border-4 border-blue-500 dark:border-blue-400 animate-pulse" />
                            )}
                            {focusedElement === item.id && (
                                <div
                                    className="absolute inset-0 rounded-2xl bg-blue-500/20 dark:bg-blue-400/20"
                                    style={{
                                        clipPath: `inset(0 ${100 - dwellProgress}% 0 0)`
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </aside>

            {/* Main Content */}
            <main className="ml-24 min-h-screen flex flex-col">
                {/* Header */}
                {title && (
                    <header className="bg-white/60 dark:bg-blue-900/60 backdrop-blur-md border-b-2 border-blue-200 dark:border-blue-700 py-6 px-8 shadow-lg">
                        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                            {title}
                        </h1>
                    </header>
                )}

                {/* Content */}
                <div className="flex-1 p-8">
                    {children}
                </div>

                {/* Support Button */}
                {showSupport && (
                    <div className="flex justify-center pb-8">
                        <Button
                            data-eye-trackable
                            data-eye-id="support-button"
                            onClick={() => alert('Suporte será chamado em breve!')}
                            className="relative px-8 py-6 text-lg rounded-2xl bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <HelpCircle className="w-6 h-6 mr-2" />
                            Chamar Suporte
                            {focusedElement === 'support-button' && (
                                <div className="absolute inset-0 rounded-2xl border-4 border-white/50 animate-pulse" />
                            )}
                            {focusedElement === 'support-button' && (
                                <div
                                    className="absolute inset-0 rounded-2xl bg-white/20"
                                    style={{
                                        clipPath: `inset(0 ${100 - dwellProgress}% 0 0)`
                                    }}
                                />
                            )}
                        </Button>
                    </div>
                )}
            </main>

            {/* Theme Toggle */}
            <div className="fixed bottom-4 left-28 z-30">
                <button
                    data-eye-trackable
                    data-eye-id="theme-toggle"
                    onClick={toggleDarkMode}
                    className="relative w-14 h-14 rounded-full bg-white dark:bg-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
                >
                    {darkMode ? (
                        <Sun className="w-6 h-6 text-yellow-500" />
                    ) : (
                        <Moon className="w-6 h-6 text-blue-600" />
                    )}
                    {focusedElement === 'theme-toggle' && (
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500 dark:border-blue-400 animate-pulse" />
                    )}
                    {focusedElement === 'theme-toggle' && (
                        <div
                            className="absolute inset-0 rounded-full bg-blue-500/20 dark:bg-blue-400/20"
                            style={{
                                clipPath: `inset(0 ${100 - dwellProgress}% 0 0)`
                            }}
                        />
                    )}
                </button>
            </div>
        </div>
    );
}