// src/pages/LearningPage.tsx
import React from 'react';
import { BookOpen, Globe, Languages } from 'lucide-react';

interface LearningPageProps {
  onSelectLesson: () => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ onSelectLesson }) => {
  const tracks = [
    {
      id: 'zfa',
      title: 'ZFA Schule',
      desc: 'Профессиональные темы, LF 1 (роль в практике, договор), инструменты.',
      count: '1 урок доступен',
      icon: BookOpen,
      color: 'bg-pink-50 text-bloom-dark border-bloom-border',
      onClick: onSelectLesson,
    },
    {
      id: 'german',
      title: 'Deutsch für ZFA',
      desc: 'Стоматологический немецкий, артикли и школьные задания.',
      count: 'Скоро',
      icon: Languages,
      color: 'bg-purple-50 text-purple-700 border-purple-100',
    },
    {
      id: 'english',
      title: 'English from Zero',
      desc: 'Английский с алфавита до базовой стоматологической лексики.',
      count: 'Скоро',
      icon: Globe,
      color: 'bg-blue-50 text-blue-700 border-blue-100',
    },
  ];

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-2xl font-bold text-[#34313A]">Направления</h1>
      <p className="text-sm text-[#817782]">Выберите направление для изучения:</p>

      <div className="space-y-3">
        {tracks.map((track) => {
          const Icon = track.icon;
          return (
            <div 
              key={track.id} 
              onClick={track.onClick}
              className={`bg-white p-4 rounded-2xl border border-[#F0E4E9] shadow-sm flex items-start space-x-4 transition ${
                track.onClick ? 'cursor-pointer hover:border-[#D985A8]' : 'opacity-75'
              }`}
            >
              <div className={`p-3 rounded-xl ${track.color}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-[#34313A]">{track.title}</h2>
                  <span className="text-xs font-medium text-[#817782]">{track.count}</span>
                </div>
                <p className="text-xs text-[#817782] mt-1">{track.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};