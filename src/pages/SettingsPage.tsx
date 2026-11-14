import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export const SettingsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 rounded-xl bg-bloom-light text-bloom-dark">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-bloom-text">Настройки</h1>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-bloom-border space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-bloom-border">
          <span className="text-sm text-bloom-text">Интерфейс</span>
          <span className="text-xs text-bloom-muted">Русский + Deutsch</span>
        </div>
        <button className="w-full py-2 text-left text-sm text-red-500 flex items-center space-x-2">
          <RefreshCw size={16} />
          <span>Сбросить прогресс</span>
        </button>
      </div>
    </div>
  );
};