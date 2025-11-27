import { useState } from 'react';
import { ArrowLeftRight, Wallet, CreditCard, ArrowLeft, LucideIcon } from 'lucide-react';
import { useEyeTracking } from '@/hooks/useEyeTracking';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BankingProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

type BankingFlow = 'main' | 'pix-value' | 'pix-recipient' | 'pix-confirm' | 'pix-result' |
  'balance-type' | 'balance-result' |
  'ted-value' | 'ted-recipient' | 'ted-confirm' | 'ted-result';

export default function Banking({ darkMode, toggleDarkMode }: BankingProps) {
  const [flow, setFlow] = useState<BankingFlow>('main');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [selectedBalanceType, setSelectedBalanceType] = useState<string>('');
  const [operationType, setOperationType] = useState<'pix' | 'ted'>('pix');

  // Função centralizada para lidar com ações (tanto clique quanto dwell)
  const handleAction = (elementId: string) => {
    // Main menu
    if (elementId === 'banking-pix') {
      setFlow('pix-value');
      setOperationType('pix');
    } else if (elementId === 'banking-balance') {
      setFlow('balance-type');
    } else if (elementId === 'banking-ted') {
      setFlow('ted-value');
      setOperationType('ted');
    }

    // PIX flow
    else if (elementId.startsWith('pix-value-')) {
      setSelectedValue(elementId.replace('pix-value-', ''));
      setFlow('pix-recipient');
    } else if (elementId.startsWith('pix-recipient-')) {
      setSelectedRecipient(elementId.replace('pix-recipient-', ''));
      setFlow('pix-confirm');
    } else if (elementId === 'pix-confirm-yes') {
      setFlow('pix-result');
      setTimeout(() => setFlow('main'), 3000);
    } else if (elementId === 'pix-confirm-no') {
      setFlow('main');
    }

    // Balance flow
    else if (elementId.startsWith('balance-type-')) {
      setSelectedBalanceType(elementId.replace('balance-type-', ''));
      setFlow('balance-result');
      setTimeout(() => setFlow('main'), 3000);
    }

    // TED flow
    else if (elementId.startsWith('ted-value-')) {
      setSelectedValue(elementId.replace('ted-value-', ''));
      setFlow('ted-recipient');
    } else if (elementId.startsWith('ted-recipient-')) {
      setSelectedRecipient(elementId.replace('ted-recipient-', ''));
      setFlow('ted-confirm');
    } else if (elementId === 'ted-confirm-yes') {
      setFlow('ted-result');
      setTimeout(() => setFlow('main'), 3000);
    } else if (elementId === 'ted-confirm-no') {
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

  const renderButton = (id: string, icon: LucideIcon, label: string, description?: string) => {
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
        {description && (
          <span className="text-sm text-blue-100">{description}</span>
        )}

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

  const renderValueButton = (value: string, prefix: string) => {
    const id = `${prefix}-value-${value}`;
    const isFocused = focusedElement === id;

    return (
      <button
        onClick={() => handleAction(id)}
        data-eye-trackable
        data-eye-id={id}
        className="relative h-32 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105"
      >
        <span className="text-3xl font-bold text-white">R$ {value}</span>

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

  const renderRecipientButton = (name: string, key: string, prefix: string) => {
    const id = `${prefix}-recipient-${name}`;
    const isFocused = focusedElement === id;

    return (
      <button
        onClick={() => handleAction(id)}
        data-eye-trackable
        data-eye-id={id}
        className="relative p-6 rounded-2xl bg-white dark:bg-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <div className="text-left">
          <p className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">{name}</p>
          <p className="text-sm text-blue-600 dark:text-blue-300">{key}</p>
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

  const renderBalanceTypeButton = (id: string, label: string) => {
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

  const getBalanceValue = (type: string) => {
    const balances: Record<string, string> = {
      'poupanca': 'R$ 1.250,00',
      'corrente': 'R$ 540,00',
      'investimentos': 'R$ 3.200,00'
    };
    return balances[type] || 'R$ 0,00';
  };

  const getBalanceLabel = (type: string) => {
    const labels: Record<string, string> = {
      'poupanca': 'Poupança',
      'corrente': 'Conta Corrente',
      'investimentos': 'Investimentos'
    };
    return labels[type] || type;
  };

  return (
    <Layout title="Banco" showSupport darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
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
            {renderButton('banking-pix', ArrowLeftRight, 'PIX', 'Transferência instantânea')}
            {renderButton('banking-balance', Wallet, 'Saldo', 'Consultar saldo')}
            {renderButton('banking-ted', CreditCard, 'TED', 'Transferência bancária')}
          </div>
        )}

        {flow === 'pix-value' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Selecione o Valor do PIX
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {renderValueButton('10', 'pix')}
              {renderValueButton('20', 'pix')}
              {renderValueButton('50', 'pix')}
            </div>
          </div>
        )}

        {flow === 'pix-recipient' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Selecione o Destinatário
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {renderRecipientButton('João Silva', '***.***.123-45', 'pix')}
              {renderRecipientButton('Maria Santos', '***.***.678-90', 'pix')}
              {renderRecipientButton('Pedro Costa', '***.***.234-56', 'pix')}
            </div>
          </div>
        )}

        {flow === 'pix-confirm' && (
          <div>
            <Card className="p-8 mb-8 bg-white/80 dark:bg-blue-900/80 backdrop-blur">
              <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-6">
                Confirmar PIX?
              </h2>
              <div className="text-center text-lg text-blue-700 dark:text-blue-300 space-y-2">
                <p className="text-2xl font-bold">R$ {selectedValue}</p>
                <p>Para: {selectedRecipient === 'João Silva' ? 'João Silva' : selectedRecipient === 'Maria Santos' ? 'Maria Santos' : 'Pedro Costa'}</p>
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-6">
              {renderConfirmButton('pix-confirm-yes', 'Confirmar PIX', 'confirm')}
              {renderConfirmButton('pix-confirm-no', 'Cancelar PIX', 'cancel')}
            </div>
          </div>
        )}

        {flow === 'pix-result' && (
          <Card className="p-12 text-center bg-white/80 dark:bg-blue-900/80 backdrop-blur">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
              PIX realizado com sucesso!
            </h2>
          </Card>
        )}

        {flow === 'balance-type' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Selecione o Tipo de Conta
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {renderBalanceTypeButton('balance-type-poupanca', 'Poupança')}
              {renderBalanceTypeButton('balance-type-corrente', 'Conta Corrente')}
              {renderBalanceTypeButton('balance-type-investimentos', 'Investimentos')}
            </div>
          </div>
        )}

        {flow === 'balance-result' && (
          <Card className="p-12 text-center bg-white/80 dark:bg-blue-900/80 backdrop-blur">
            <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-6">
              {getBalanceLabel(selectedBalanceType)}
            </h2>
            <p className="text-6xl font-bold text-green-600 dark:text-green-400">
              {getBalanceValue(selectedBalanceType)}
            </p>
          </Card>
        )}

        {flow === 'ted-value' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Selecione o Valor do TED
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {renderValueButton('100', 'ted')}
              {renderValueButton('200', 'ted')}
              {renderValueButton('500', 'ted')}
            </div>
          </div>
        )}

        {flow === 'ted-recipient' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Selecione o Destinatário
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {renderRecipientButton('Ana Lima', 'Banco 001 - Ag 1234', 'ted')}
              {renderRecipientButton('Carlos Souza', 'Banco 237 - Ag 5678', 'ted')}
              {renderRecipientButton('Fernanda Rocha', 'Banco 104 - Ag 9012', 'ted')}
            </div>
          </div>
        )}

        {flow === 'ted-confirm' && (
          <div>
            <Card className="p-8 mb-8 bg-white/80 dark:bg-blue-900/80 backdrop-blur">
              <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-6">
                Confirmar TED?
              </h2>
              <div className="text-center text-lg text-blue-700 dark:text-blue-300 space-y-2">
                <p className="text-2xl font-bold">R$ {selectedValue}</p>
                <p>Para: {selectedRecipient === 'Ana Lima' ? 'Ana Lima' : selectedRecipient === 'Carlos Souza' ? 'Carlos Souza' : 'Fernanda Rocha'}</p>
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-6">
              {renderConfirmButton('ted-confirm-yes', 'Confirmar TED', 'confirm')}
              {renderConfirmButton('ted-confirm-no', 'Cancelar TED', 'cancel')}
            </div>
          </div>
        )}

        {flow === 'ted-result' && (
          <Card className="p-12 text-center bg-white/80 dark:bg-blue-900/80 backdrop-blur">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
              TED realizado com sucesso!
            </h2>
          </Card>
        )}
      </div>
    </Layout>
  );
}