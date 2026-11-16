import React from 'react';
import { BookOpen, Globe, Languages, CheckCircle2 } from 'lucide-react';
import { getAllLessons } from '../features/lessons/lessonService';
import { getCompletedLessons } from '../features/lessons/lessonProgress';

interface LearningPageProps {
  onSelectLesson: (lessonId: string) => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ onSelectLesson }) => {
  const allLessons = getAllLessons();
  const completed = getCompletedLessons();

  // Определяем, к какому направлению относится каждый урок
  const getLessonTrack = (lesson: any): 'zfa' | 'german' | 'english' => {
    const tag = (lesson.moduleTag || '').toLowerCase();
    const id = (lesson.id || '').toLowerCase();
    const title = (lesson.title || '').toLowerCase();

    if (tag.includes('english') || id.startsWith('eng-') || title.includes('alphabet')) {
      return 'english';
    }
    if (tag.includes('deutsch') || id.startsWith('de-')) {
      return 'german';
    }
    return 'zfa';
  };

  const tracks = [
    {
      id: 'zfa' as const,
      title: 'ZFA Schule',
      desc: 'Школьная программа: право, гигиена, кариесология и клиника.',
      icon: BookOpen,
      color: 'bg-pink-50 text-bloom-dark border border-bloom-border',
    },
    {
      id: 'german' as const,
      title: 'Deutsch für ZFA',
      desc: 'Стоматологический немецкий, артикли и школьные задания.',
      icon: Languages,
      color: 'bg-purple-50 text-purple-700 border border-purple-100',
    },
    {
      id: 'english' as const,
      title: 'English from Zero',
      desc: 'Английский с алфавита до базовой стоматологической лексики.',
      icon: Globe,
      color: 'bg-blue-50 text-blue-700 border border-blue-100',
    },
  ];

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-2xl font-bold text-[#34313A]">Направления</h1>

      {tracks.map((track) => {
        const Icon = track.icon;
        const trackLessons = allLessons.filter((l) => getLessonTrack(l) === track.id);
        const hasLessons = trackLessons.length > 0;

        return (
          <div
            key={track.id}
            className={`bg-white p-4 rounded-2xl border border-[#F0E4E9] shadow-sm space-y-3 ${
              !hasLessons ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-3 rounded-xl shrink-0 ${track.color}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-[#34313A]">{track.title}</h2>
                  {hasLessons ? (
                    <span className="text-xs font-medium text-[#817782]">
                      Уроков: {trackLessons.length}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[#817782]">Скоро</span>
                  )}
                </div>
                <p className="text-xs text-[#817782] mt-0.5">{track.desc}</p>
              </div>
            </div>

            {hasLessons && (
              <div className="space-y-2 pt-1">
                {trackLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className="w-full text-left p-3 rounded-xl border border-[#F0E4E9] hover:border-[#D985A8] transition flex items-center justify-between"
                  >
                    <div className="pr-2">
                      <p className="text-sm font-semibold text-[#34313A]">{lesson.title}</p>
                      <p className="text-xs text-[#817782]">{lesson.subtitle}</p>
                    </div>
                    {completed.includes(lesson.id) && (
                      <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};