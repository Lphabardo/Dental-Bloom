import React from 'react';
import { CheckCircle2, Flame } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-2xl font-bold text-bloom-text">Ваш прогресс</h1>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-bloom-border">
          <div className="flex items-center space-x-2 text-bloom-primary mb-1">
            <CheckCircle2 size={18} />
            <span className="text-xs font-semibold">Пройдено уроков</span>
          </div>
          <span className="text-2xl font-bold text-bloom-text">0 / 30</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-bloom-border">
          <div className="flex items-center space-x-2 text-orange-500 mb-1">
            <Flame size={18} />
            <span className="text-xs font-semibold">Дней подряд</span>
          </div>
          <span className="text-2xl font-bold text-bloom-text">1 день</span>
        </div>
      </div>
    </div>
  );
};