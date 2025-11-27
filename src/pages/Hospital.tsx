import { useState } from 'react';
import { ClipboardCheck, Calendar, Activity, ArrowLeft, LucideIcon } from 'lucide-react';
import { useEyeTracking } from '@/hooks/useEyeTracking';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HospitalProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

type HospitalFlow = 'main' | 'checkin-select' | 'checkin-confirm' | 'checkin-result' |
  'schedule-select' | 'schedule-confirm' | 'schedule-result' |
  'status-select' | 'status-result';

export default function Hospital({ darkMode, toggleDarkMode }: HospitalProps) {
  const [flow, setFlow] = useState<HospitalFlow>('main');
  const [selectedCheckin, setSelectedCheckin] = useState<string>('');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [protocolNumber, setProtocolNumber] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Função centralizada para lidar com ações (tanto clique quanto dwell)
  const handleAction = (elementId: string) => {
    // Main menu
    if (elementId === 'hospital-checkin') {
      setFlow('checkin-select');
    } else if (elementId === 'hospital-schedule') {
      setFlow('schedule-select');
    } else if (elementId === 'hospital-status') {
      setFlow('status-select');
    }

    // Check-in flow
    else if (elementId.startsWith('checkin-select-')) {
      setSelectedCheckin(elementId.replace('checkin-select-', ''));
      setFlow('checkin-confirm');
    } else if (elementId === 'checkin-confirm-yes') {
      setFlow('checkin-result');
      setTimeout(() => setFlow('main'), 3000);
    } else if (elementId === 'checkin-confirm-no') {
      setFlow('main');
    }

    // Schedule flow
    else if (elementId === 'schedule-confirm-yes') {
      const newProtocol = Math.floor(Math.random() * 90000 + 10000).toString();
      setProtocolNumber(newProtocol);
      setFlow('schedule-result');
      setTimeout(() => setFlow('main'), 4000);

    } else if (elementId === 'schedule-confirm-no') {
      setFlow('main');

    } else if (
      elementId === 'schedule-cardio' ||
      elementId === 'schedule-neuro' ||
      elementId === 'schedule-clinico'
    ) {
      setSelectedSchedule(elementId);
      setFlow('schedule-confirm');
    }

    // Status flow
    else if (elementId.startsWith('status-select-')) {
      setSelectedStatus(elementId.replace('status-select-', ''));
      setFlow('status-result');
      setTimeout(() => setFlow('main'), 4000);
    }

    // Back button
    else if (elementId === 'back-button') {
      setFlow('main');
    }
  };

  const { focusedElement, dwellProgress } = useEyeTracking({
    onDwell: handleAction
  });

  const schedules = [
    { id: 'schedule-cardio', specialty: 'Cardiologista', time: '8h Segunda-feira' },
    { id: 'schedule-neuro', specialty: 'Neurologista', time: '14h Terça-feira' },
    { id: 'schedule-clinico', specialty: 'Clínico Geral', time: '10h Quinta-feira' }
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

  const renderScheduleButton = (schedule: typeof schedules[0]) => {
    const isFocused = focusedElement === schedule.id;

    return (
      <button
        onClick={() => handleAction(schedule.id)}
        data-eye-trackable
        data-eye-id={schedule.id}
        className="relative p-6 rounded-2xl bg-white dark:bg-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <div className="text-left">
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">{schedule.specialty}</p>
          <p className="text-lg text-blue-600 dark:text-blue-300">{schedule.time}</p>
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

  const selectedScheduleData = schedules.find(s => s.id === selectedSchedule);

  return (
    <Layout title="Totem Hospitalar" showSupport darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
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
            {renderButton('hospital-checkin', ClipboardCheck, 'Check-in')}
            {renderButton('hospital-schedule', Calendar, 'Agendar')}
            {renderButton('hospital-status', Activity, 'Status da Consulta')}
          </div>
        )}

        {flow === 'checkin-select' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Selecione o Período
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {renderSimpleButton('checkin-select-manha', 'Manhã')}
              {renderSimpleButton('checkin-select-tarde', 'Tarde')}
              {renderSimpleButton('checkin-select-noite', 'Noite')}
            </div>
          </div>
        )}

        {flow === 'checkin-confirm' && (
          <div>
            <Card className="p-8 mb-8 bg-white/80 dark:bg-blue-900/80 backdrop-blur">
              <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-6">
                Confirmar Check-in?
              </h2>
              <p className="text-center text-xl text-blue-700 dark:text-blue-300">
                Período: {selectedCheckin === 'manha' ? 'Manhã' : selectedCheckin === 'tarde' ? 'Tarde' : 'Noite'}
              </p>
            </Card>
            <div className="grid grid-cols-2 gap-6">
              {renderConfirmButton('checkin-confirm-yes', 'Confirmar Check-in', 'confirm')}
              {renderConfirmButton('checkin-confirm-no', 'Cancelar Check-in', 'cancel')}
            </div>
          </div>
        )}

        {flow === 'checkin-result' && (
          <Card className="p-12 text-center bg-white/80 dark:bg-blue-900/80 backdrop-blur">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
              Check-in realizado
            </h2>
          </Card>
        )}

        {flow === 'schedule-select' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Escolha uma opção para prosseguir com agendamento
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {schedules.map(schedule => renderScheduleButton(schedule))}
            </div>
          </div>
        )}

        {flow === 'schedule-confirm' && selectedScheduleData && (
          <div>
            <Card className="p-8 mb-8 bg-white/80 dark:bg-blue-900/80 backdrop-blur">
              <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-6">
                Confirmar Agendamento?
              </h2>
              <div className="text-center text-lg text-blue-700 dark:text-blue-300 space-y-2">
                <p className="text-2xl font-bold">{selectedScheduleData.specialty}</p>
                <p className="text-xl">{selectedScheduleData.time}</p>
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-6">
              {renderConfirmButton('schedule-confirm-yes', 'Confirmar Agendamento', 'confirm')}
              {renderConfirmButton('schedule-confirm-no', 'Cancelar Agendamento', 'cancel')}
            </div>
          </div>
        )}

        {flow === 'schedule-result' && (
          <Card className="p-12 text-center bg-white/80 dark:bg-blue-900/80 backdrop-blur">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              Agendado com sucesso
            </h2>
            <p className="text-2xl text-blue-700 dark:text-blue-300 mb-2">
              Número do protocolo:
            </p>
            <p className="text-5xl font-bold text-blue-900 dark:text-blue-100">
              {protocolNumber}
            </p>
          </Card>
        )}

        {flow === 'status-select' && (
          <div>
            <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-100 mb-8">
              Selecione a Consulta
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {renderSimpleButton('status-select-1', 'Consulta 1')}
              {renderSimpleButton('status-select-2', 'Consulta 2')}
            </div>
          </div>
        )}

        {flow === 'status-result' && (
          <Card className="p-12 text-center bg-white/80 dark:bg-blue-900/80 backdrop-blur">
            <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-6">
              Agendada com sucesso
            </h2>
            <p className="text-xl text-blue-700 dark:text-blue-300 mb-4">
              Consulta: {selectedStatus === '1' ? 'Consulta 1' : 'Consulta 2'}
            </p>
            <div className="text-6xl mb-4">⏱️</div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              Sua consulta começa em aproximadamente 20 minutos
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}