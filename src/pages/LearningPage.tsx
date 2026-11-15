import React from 'react';
import { BookOpen, Globe, Languages, CheckCircle2 } from 'lucide-react';
import { getAllLessons } from '../features/lessons/lessonService';
import { getCompletedLessons } from '../features/lessons/lessonProgress';

interface LearningPageProps {
  onSelectLesson: (lessonId: string) => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ onSelectLesson }) => {
  const lessons = getAllLessons();
  const completed = getCompletedLessons();

  const soon = [
    { id: 'german', title: 'Deutsch für ZFA', desc: 'Стоматологический немецкий, артикли и школьные задания.', icon: Languages, color: 'bg-purple-50 text-purple-700 border-purple-100' },
    { id: 'english', title: 'English from Zero', desc: 'Английский с алфавита до базовой стоматологической лексики.', icon: Globe, color: 'bg-blue-50 text-blue-700 border-blue-100' },
  ];

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-2xl font-bold text-[#34313A]">Направления</h1>

      <div className="bg-white p-4 rounded-2xl border border-[#F0E4E9] shadow-sm space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-pink-50 text-bloom-dark border border-bloom-border">
            <BookOpen size={24} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-[#34313A]">ZFA Schule</h2>
            <p className="text-xs text-[#817782]">Уроков: {lessons.length}</p>
          </div>
        </div>

        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson(lesson.id)}
            className="w-full text-left p-3 rounded-xl border border-[#F0E4E9] hover:border-[#D985A8] transition flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-[#34313A]">{lesson.title}</p>
              <p className="text-xs text-[#817782]">{lesson.subtitle}</p>
            </div>
            {completed.includes(lesson.id) && (
              <CheckCircle2 size={18} className="text-green-500 shrink-0" />
            )}
          </button>
        ))}
      </div>

      {soon.map((t) => {
        const Icon = t.icon;
        return (
          <div key={t.id} className="bg-white p-4 rounded-2xl border border-[#F0E4E9] shadow-sm flex items-start space-x-4 opacity-75">
            <div className={`p-3 rounded-xl ${t.color}`}><Icon size={24} /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-[#34313A]">{t.title}</h2>
                <span className="text-xs font-medium text-[#817782]">Скоро</span>
              </div>
              <p className="text-xs text-[#817782] mt-1">{t.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};