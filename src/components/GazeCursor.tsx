import { useEffect, useState } from 'react';
import WebGazerManager from '@/lib/webgazer-manager';

export default function GazeCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const manager = WebGazerManager.getInstance();

        const removeListener = manager.addGazeListener((data) => {
            if (data) {
                setPosition({ x: data.x, y: data.y });
                setIsActive(true);
            } else {
                setIsActive(false);
            }
        });

        return () => {
            removeListener();
        };
    }, []);

    if (!isActive) return null;

    return (
        <>
            {/* Cursor principal */}
            <div
                className="fixed pointer-events-none z-[9999] transition-all duration-75"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                {/* Ponto central */}
                <div className="relative">
                    <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse" />

                    {/* Anel externo animado */}
                    <div className="absolute inset-0 -m-2">
                        <div className="w-8 h-8 border-2 border-blue-400 rounded-full animate-ping opacity-75" />
                    </div>

                    {/* Anel médio */}
                    <div className="absolute inset-0 -m-1">
                        <div className="w-6 h-6 border-2 border-blue-300 rounded-full opacity-50" />
                    </div>
                </div>
            </div>

            {/* Rastro/trail effect */}
            <div
                className="fixed pointer-events-none z-[9998] transition-all duration-200 opacity-30"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <div className="w-12 h-12 bg-blue-400 rounded-full blur-xl" />
            </div>
        </>
    );
}
