import React from 'react';
import { ArrowRight, BatteryMedium } from 'lucide-react';

interface HomePageProps {
  lesson: {
    title: string;
    subtitle: string;
    moduleTag: string;
    duration: string;
  };
  reviewCount: number;
  onStartLesson: () => void;
  onStartShort: () => void;
  onOpenSettings: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ lesson, reviewCount, onStartLesson, onStartShort, onOpenSettings }) => {
  return (
    <div className="space-y-4 pb-24">
      {/* Приветствие */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-bloom-text">Hello! ✨</h1>
          <p className="text-sm text-bloom-muted">Little steps. Bright future.</p>
        </div>
        <button 
          onClick={onOpenSettings}
          className="p-2 rounded-full bg-bloom-light text-bloom-dark hover:bg-bloom-border transition"
        >
          ⚙️
        </button>
      </div>

      {/* Карточка сегодняшнего урока */}
      <div className="bg-gradient-to-br from-bloom-light to-white p-5 rounded-3xl border border-bloom-border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-bloom-primary text-white">
            {lesson.moduleTag}
          </span>
          <span className="text-xs text-bloom-muted font-medium flex items-center gap-1">
            ⏱️ {lesson.duration}
          </span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-bloom-text">{lesson.title}</h2>
          <p className="text-sm text-bloom-muted mt-1">
            {lesson.subtitle}
          </p>
        </div>

        <button
          onClick={onStartLesson}
          className="w-full py-3 px-4 bg-bloom-dark text-white rounded-2xl font-medium shadow-md hover:bg-bloom-primary transition flex items-center justify-center space-x-2"
        >
          <span>Start Learning</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Кнопка "Сегодня я устала" */}
      <div className="bg-white p-4 rounded-2xl border border-bloom-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-bloom-light rounded-xl text-bloom-dark">
            <BatteryMedium size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-bloom-text">Heute bin ich müde</h3>
            <p className="text-xs text-bloom-muted">Короткий урок на 5 минут</p>
          </div>
        </div>
        <button 
          onClick={onStartShort}
          className="px-3 py-1.5 bg-bloom-light text-bloom-dark text-xs font-semibold rounded-xl hover:bg-bloom-primary hover:text-white transition"
        >
          Старт
        </button>
      </div>

      {/* Блок быстрого повторения */}
      <div className="bg-white p-4 rounded-2xl border border-bloom-border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-bloom-text">Quick Review</h3>
          <span className="text-xs text-bloom-muted">К повторению: {reviewCount}</span>
        </div>
        <p className="text-xs text-bloom-muted">
  {reviewCount > 0
    ? 'Открой вкладку «Повторение», чтобы повторить карточки.'
    : 'На сегодня всё повторено. Новые карточки появятся после следующего урока.'}
</p>
      </div>
    </div>
  );
};