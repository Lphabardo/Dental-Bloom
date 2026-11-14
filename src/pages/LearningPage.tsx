import React from 'react';
import { BookOpen, Globe, Languages } from 'lucide-react';

export const LearningPage: React.FC = () => {
  const tracks = [
    {
      id: 'zfa',
      title: 'ZFA Schule',
      desc: 'Профессиональные темы, LF 4, инструменты и лечение.',
      count: '14 уроков',
      icon: BookOpen,
      color: 'bg-pink-50 text-bloom-dark border-bloom-border'
    },
    {
      id: 'german',
      title: 'Deutsch für ZFA',
      desc: 'Стоматологический немецкий, артикли и школьные задания.',
      count: '10 уроков',
      icon: Languages,
      color: 'bg-purple-50 text-purple-700 border-purple-100'
    },
    {
      id: 'english',
      title: 'English from Zero',
      desc: 'Английский с алфавита до базовой стоматологической лексики.',
      count: '8 уроков',
      icon: Globe,
      color: 'bg-blue-50 text-blue-700 border-blue-100'
    },
  ];

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-2xl font-bold text-bloom-text">Направления</h1>
      <p className="text-sm text-bloom-muted">Выберите направление для изучения:</p>

      <div className="space-y-3">
        {tracks.map((track) => {
          const Icon = track.icon;
          return (
            <div 
              key={track.id} 
              className="bg-white p-4 rounded-2xl border border-bloom-border shadow-sm flex items-start space-x-4 cursor-pointer hover:border-bloom-primary transition"
            >
              <div className={`p-3 rounded-xl ${track.color}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-bloom-text">{track.title}</h2>
                  <span className="text-xs font-medium text-bloom-muted">{track.count}</span>
                </div>
                <p className="text-xs text-bloom-muted mt-1">{track.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};