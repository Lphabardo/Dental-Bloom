import { useState, useEffect } from 'react';
import { AppHeader } from './components/AppHeader';
import { BottomNavigation, type TabType } from './components/BottomNavigation';
import { HomePage } from './pages/HomePage';
import { LearningPage } from './pages/LearningPage';
import { ReviewPage } from './pages/ReviewPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { LessonPage } from './pages/LessonPage';
import { getAllLessons } from './features/lessons/lessonService';
import { getCompletedLessons } from './features/lessons/lessonProgress';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Храним ID открытого урока (null, если никакой урок не открыт)
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  
  // Список пройденных уроков для обновления UI
  const [completedIds, setCompletedIds] = useState<string[]>(getCompletedLessons());
  const lessons = getAllLessons();

  // Синхронизация прогресса при завершении уроков
  useEffect(() => {
    const syncProgress = () => {
      setCompletedIds(getCompletedLessons());
    };
    window.addEventListener('lessonProgressUpdated', syncProgress);
    window.addEventListener('storage', syncProgress);
    return () => {
      window.removeEventListener('lessonProgressUpdated', syncProgress);
      window.removeEventListener('storage', syncProgress);
    };
  }, []);

  // Заголовок в зависимости от текущей вкладки или открытого экрана
  const getTitle = () => {
    if (isSettingsOpen) return 'Настройки';
    if (activeLessonId) return 'Урок ZFA';
    switch (activeTab) {
      case 'home': return 'Главная';
      case 'learning': return 'Учеба';
      case 'review': return 'Повторение';
      case 'progress': return 'Прогресс';
    }
  };

  // Находим следующий непройденный урок для кнопки на главной
  const nextLesson = lessons.find((l) => !completedIds.includes(l.id)) || lessons[0];

  return (
    <div className="min-h-screen bg-bloom-bg flex justify-center">
      {/* Ограничение ширины под мобильный экран и центрирование */}
      <div className="w-full max-w-md bg-bloom-bg min-h-screen flex flex-col relative shadow-xl">
        <AppHeader title={getTitle()} />

        <main className="flex-1 p-4 overflow-y-auto pb-24">
          {isSettingsOpen ? (
            <SettingsPage onBack={() => setIsSettingsOpen(false)} />
          ) : activeLessonId ? (
            // Открываем конкретный урок по его ID
            <LessonPage 
              lessonId={activeLessonId} 
              onBack={() => {
                setCompletedIds(getCompletedLessons());
                setActiveLessonId(null);
              }} 
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomePage 
                  onStartLesson={() => setActiveLessonId(nextLesson.id)} 
                  onOpenSettings={() => setIsSettingsOpen(true)} 
                />
              )}
              {activeTab === 'learning' && (
                <LearningPage onSelectLesson={(lessonId) => setActiveLessonId(lessonId)} />
              )}
              {activeTab === 'review' && <ReviewPage />}
              {activeTab === 'progress' && <ProgressPage />}
            </>
          )}
        </main>

        {!isSettingsOpen && !activeLessonId && (
          <BottomNavigation activeTab={activeTab} onChangeTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}

export default App;