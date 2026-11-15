import React, { useEffect, useState } from 'react';
import { CheckCircle2, Flame } from 'lucide-react';
import { getAllLessons } from '../features/lessons/lessonService';
import { getCompletedLessons, getStreak } from '../features/lessons/lessonProgress';

const daysWord = (n: number) => {
  const last = n % 10;
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return 'дней';
  if (last === 1) return 'день';
  if (last >= 2 && last <= 4) return 'дня';
  return 'дней';
};

export const ProgressPage: React.FC = () => {
  const [completed, setCompleted] = useState<string[]>(getCompletedLessons());
  const [streak, setStreak] = useState<number>(getStreak());

  useEffect(() => {
    const update = () => {
      setCompleted(getCompletedLessons());
      setStreak(getStreak());
    };
    window.addEventListener('lessonProgressUpdated', update);
    return () => window.removeEventListener('lessonProgressUpdated', update);
  }, []);

  const lessons = getAllLessons();
  const done = lessons.filter((l) => completed.includes(l.id)).length;

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-2xl font-bold text-bloom-text">Ваш прогресс</h1>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-bloom-border">
          <div className="flex items-center space-x-2 text-bloom-primary mb-1">
            <CheckCircle2 size={18} />
            <span className="text-xs font-semibold">Пройдено уроков</span>
          </div>
          <span className="text-2xl font-bold text-bloom-text">
            {done} / {lessons.length}
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-bloom-border">
          <div className="flex items-center space-x-2 text-orange-500 mb-1">
            <Flame size={18} />
            <span className="text-xs font-semibold">Дней подряд</span>
          </div>
          <span className="text-2xl font-bold text-bloom-text">
            {streak} {daysWord(streak)}
          </span>
        </div>
      </div>
    </div>
  );
};