import { Settings as SettingsIcon } from 'lucide-react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';

interface SettingsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Settings({ darkMode, toggleDarkMode }: SettingsProps) {
  return (
    <Layout title="Configurações" darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center bg-white/80 dark:bg-blue-900/80 backdrop-blur">
          <SettingsIcon className="w-24 h-24 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Configurações
          </h2>
          <p className="text-lg text-blue-700 dark:text-blue-300">
            Página de configurações em desenvolvimento
          </p>
        </Card>
      </div>
    </Layout>
  );
}