import React from 'react';
import { RotateCcw } from 'lucide-react';

export const ReviewPage: React.FC = () => {
  return (
    <div className="space-y-4 pb-24 text-center py-10">
      <div className="w-16 h-16 bg-bloom-light text-bloom-dark rounded-full flex items-center justify-center mx-auto">
        <RotateCcw size={32} />
      </div>
      <h1 className="text-xl font-bold text-bloom-text">Повторение слов</h1>
      <p className="text-sm text-bloom-muted max-w-xs mx-auto">
        Здесь будут карточки интервального повторения для закрепления профессиональных терминов.
      </p>
    </div>
  );
};