import { useState } from 'react';
import { ShoppingCart, Package, Clock, ArrowLeft, LucideIcon } from 'lucide-react';
import { useEyeTracking } from '@/hooks/useEyeTracking';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RestaurantProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

type RestaurantFlow = 'main' | 'order-combo' | 'order-summary' | 'order-confirm' | 'order-result' |
  'pickup-select' | 'pickup-confirm' | 'pickup-result' |
  'track-select' | 'track-confirm' | 'track-result';

export default function Restaurant({ darkMode, toggleDarkMode }: RestaurantProps) {
  const [flow, setFlow] = useState<RestaurantFlow>('main');
  const [selectedCombo, setSelectedCombo] = useState<string>('');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [selectedPickup, setSelectedPickup] = useState<string>('');
  const [selectedTrack, setSelectedTrack] = useState<string>('');

  // Função centralizada para lidar com ações (tanto clique quanto dwell)
  const handleAction = (elementId: string) => {
    // Main menu
    if (elementId === 'restaurant-order') {
      setFlow('order-combo');
    } else if (elementId === 'restaurant-pickup') {
      setFlow('pickup-select');
    } else if (elementId === 'restaurant-track') {
      setFlow('track-select');
    }

    // Order flow
    else if (elementId.startsWith('combo-')) {
      setSelectedCombo(elementId.replace('combo-', ''));
      setFlow('order-summary');
    } else if (elementId === 'order-confirm-yes') {
      const newOrderNumber = Math.floor(Math.random() * 9000 + 1000).toString();
      setOrderNumber(newOrderNumber);
      setFlow('order-result');
      setTimeout(() => setFlow('main'), 4000);
    } else if (elementId === 'order-confirm-no') {
      setFlow('main');
    }

    // Pickup flow
    else if (elementId.startsWith('pickup-select-')) {
      setSelectedPickup(elementId.replace('pickup-select-', ''));
      setFlow('pickup-confirm');
    } else if (elementId === 'pickup-confirm-yes') {
      setFlow('pickup-result');
      setTimeout(() => setFlow('main'), 3000);
    } else if (elementId === 'pickup-confirm-no') {
      setFlow('main');
    }

    // Track flow
    else if (elementId.startsWith('track-select-')) {
      setSelectedTrack(elementId.replace('track-select-', ''));
      setFlow('track-confirm');
    } else if (elementId === 'track-confirm-yes') {
      setFlow('track-result');
      setTimeout(() => setFlow('main'), 3000);
    } else if (elementId === 'track-confirm-no') {
      setFlow('main');
    }

    // Back button
    else if (elementId === 'back-button') {
      setFlow('main');
    }
  };

  const { focusedElement, dwellProgress } = useEyeTracking({
    onDwell: handleAction
  });

  const combos = [
    { id: 'combo-1', name: 'Combo 1', items: 'X-Salada + Refrigerante', price: 'R$ 8,00' },
    { id: 'combo-2', name: 'Combo 2', items: '2 X-Salada + Refrigerante', price: 'R$ 16,00' },
    { id: 'combo-3', name: 'Combo 3', items: '2 Kikão + 2 X-Salada', price: 'R$ 20,00' }
  ];

  const renderButton = (id: string, icon: LucideIcon, label: string) => {
    const Icon = icon;
    const isFocused = focusedElement === id;

    return (
      <button
        onClick={() => handleAction(id)}
        data-eye-trackable
        data-eye-id={id}
        className="relative h-48 rounded-3xl bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center gap-4 hover:scale-105"
      >
        <Icon className="w-16 h-16 text-white" />
        <span className="text-2xl font-bold text-white">{label}</span>

        {isFocused && (
          <div className="absolute inset-0 rounded-3xl border-6 border-white/50 animate-pulse" />
        )}
        {isFocused && (
          <div
            className="absolute inset-0 rounded-3xl bg-white/20"
            style={{ clipPath: `inset(0 ${100 - dwellProgress}% 0 0)` }}
          />
        )}
      </button>
    );
  };

  const renderComboButton = (combo: typeof combos[0]) => {
    const isFocused = focusedElement === combo.id;

    return (
      <button
        onClick={() => handleAction(combo.id)}
        data-eye-trackable
        data-eye-id={combo.id}
        className="relative p-6 rounded-2xl bg-white dark:bg-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <div className="text-left">
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">{combo.name}</p>
          <p className="text-lg text-blue-600 dark:text-blue-300 mb-3">{combo.items}</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{combo.price}</p>
        </div>

        {isFocused && (
          <div className="absolute inset-0 rounded-2xl border-4 border-blue-500 dark:border-blue-400 animate-pulse" />
        )}
        {isFocused && (
          <div
            className="absolute inset-0 rounded-2xl bg-blue-500/20 dark:bg-blue-400/20"
            style={{ clipPath: `inset(0 ${100 - dwellProgress}% 0 0)` }}
          />
        )}
      </button>
    );
  };

  const renderSimpleButton = (id: string, label: string) => {
    const isFocused = focusedElement === id;

    return (
      <button
        onClick={() => handleAction(id)}
        data-eye-trackable
        data-eye-id={id}
        className="relative h-32 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105"
      >
        <span className="text-2xl font-bold text-white">{label}</span>

        {isFocused && (
          <div className="absolute inset-0 rounded-2xl border-4 border-white/50 animate-pulse" />
        )}
        {isFocused && (
          <div
            className="absolute inset-0 rounded-2xl bg-white/20"
            style={{ clipPath: `inset(0 ${100 - dwellProgress}% 0 0)` }}
          />
        )}
      </button>
    );
  };

  const renderConfirmButton = (id: string, label: string, variant: 'confirm' | 'cancel') => {
    const isFocused = focusedElement === id;
    const colors = variant === 'confirm'
      ? 'from-green-400 to-green-600 dark:from-green-500 dark:to-green-700'
      : 'from-red-400 to-red-600 dark:from-red-500 dark:to-red-700';

    return (
      <button
        onClick={() => handleAction(id)}
        data-eye-trackable
        data-eye-id={id}
        className={`relative h-32 rounded-2xl bg-gradient-to-br ${colors} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105`}
      >
        <span className="text-2xl font-bold text-white">{label}</span>

        {isFocused && (
          <div className="absolute inset-0 rounded-2xl border-4 border-white/50 animate-pulse" />
        )}
        {isFocused && (
          <div
            className="absolute inset-0 rounded-2xl bg-white/20"
            style={{ clipPath: `inset(0 ${100 - dwellProgress}% 0 0)` }}
          />
        )}
      </button>
    );
  };

  const selectedComboData = combos.find(c => c.id === `combo-${selectedCombo}`);

  return (
    <Layout title="Restaurante" showSupport darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className="max-w-6xl mx-auto">
        {flow !== 'main' && (
          <Button
            onClick={() => handleAction('back-button')}
            data-eye-trackable
            data-eye-id="back-button"
            className="mb-6 rounded-xl"
            variant="outline"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        )}

        {flow === 'main' && (
          <div className="grid grid-cols-3 gap-8">
            {renderButton('restaurant-order', ShoppingCart, 'Fazer Pedido')}
            {renderButton('restaurant-pickup', Package, 'Retirada')}
            {renderButton('restaurant-track', Clock, 'Acompanhar Pedido')}
          </div>
        )}

        {flow === 'order-combo' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Escolha seu Combo
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {combos.map(combo => renderComboButton(combo))}
            </div>
          </div>
        )}

        {flow === 'order-summary' && selectedComboData && (
          <div>
            <Card className="p-8 mb-8 bg-white/80 dark:bg-blue-900/80 backdrop-blur">
              <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-6">
                Confirmar Pedido?
              </h2>
              <div className="text-center text-lg text-blue-700 dark:text-blue-300 space-y-2">
                <p className="text-2xl font-bold">{selectedComboData.name}</p>
                <p>{selectedComboData.items}</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{selectedComboData.price}</p>
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-6">
              {renderConfirmButton('order-confirm-yes', 'Confirmar Pedido', 'confirm')}
              {renderConfirmButton('order-confirm-no', 'Cancelar Pedido', 'cancel')}
            </div>
          </div>
        )}

        {flow === 'order-result' && (
          <Card className="p-12 text-center bg-white/80 dark:bg-blue-900/80 backdrop-blur">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              Pedido realizado com sucesso!
            </h2>
            <p className="text-2xl text-blue-700 dark:text-blue-300 mb-2">
              Número do pedido:
            </p>
            <p className="text-5xl font-bold text-blue-900 dark:text-blue-100">
              {orderNumber}
            </p>
          </Card>
        )}

        {flow === 'pickup-select' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Selecione a Retirada
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {renderSimpleButton('pickup-select-1', 'Retirada 1')}
              {renderSimpleButton('pickup-select-2', 'Retirada 2')}
              {renderSimpleButton('pickup-select-3', 'Retirada 3')}
            </div>
          </div>
        )}

        {flow === 'pickup-confirm' && (
          <div>
            <Card className="p-8 mb-8 bg-white/80 dark:bg-blue-900/80 backdrop-blur">
              <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-6">
                Confirmar Retirada?
              </h2>
              <p className="text-center text-xl text-blue-700 dark:text-blue-300">
                Retirada {selectedPickup}
              </p>
            </Card>
            <div className="grid grid-cols-2 gap-6">
              {renderConfirmButton('pickup-confirm-yes', 'Confirmar', 'confirm')}
              {renderConfirmButton('pickup-confirm-no', 'Cancelar', 'cancel')}
            </div>
          </div>
        )}

        {flow === 'pickup-result' && (
          <Card className="p-12 text-center bg-white/80 dark:bg-blue-900/80 backdrop-blur">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
              Retirada realizada
            </h2>
          </Card>
        )}

        {flow === 'track-select' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Selecione o Pedido
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {renderSimpleButton('track-select-1', 'Pedido 1')}
              {renderSimpleButton('track-select-2', 'Pedido 2')}
              {renderSimpleButton('track-select-3', 'Pedido 3')}
            </div>
          </div>
        )}

        {flow === 'track-confirm' && (
          <div>
            <Card className="p-8 mb-8 bg-white/80 dark:bg-blue-900/80 backdrop-blur">
              <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-6">
                Confirmar Consulta?
              </h2>
              <p className="text-center text-xl text-blue-700 dark:text-blue-300">
                Pedido {selectedTrack}
              </p>
            </Card>
            <div className="grid grid-cols-2 gap-6">
              {renderConfirmButton('track-confirm-yes', 'Confirmar', 'confirm')}
              {renderConfirmButton('track-confirm-no', 'Cancelar', 'cancel')}
            </div>
          </div>
        )}

        {flow === 'track-result' && (
          <Card className="p-12 text-center bg-white/80 dark:bg-blue-900/80 backdrop-blur">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
              Pronto para retirada
            </h2>
          </Card>
        )}
      </div>
    </Layout>
  );
}