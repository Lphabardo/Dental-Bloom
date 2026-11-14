import { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { BottomNavigation, type TabType } from './components/BottomNavigation';
import { HomePage } from './pages/HomePage';
import { LearningPage } from './pages/LearningPage';
import { ReviewPage } from './pages/ReviewPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { LessonPage } from './pages/LessonPage'; // Импортируем наш настоящий урок

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLessonActive, setIsLessonActive] = useState(false);

  // Заголовок в зависимости от текущей вкладки или открытого экрана
  const getTitle = () => {
    if (isSettingsOpen) return 'Настройки';
    if (isLessonActive) return 'Урок: LF 1';
    switch (activeTab) {
      case 'home': return 'Главная';
      case 'learning': return 'Учеба';
      case 'review': return 'Повторение';
      case 'progress': return 'Прогресс';
    }
  };

  return (
    <div className="min-h-screen bg-bloom-bg flex justify-center">
      {/* Ограничение ширины под мобильный экран и центрирование */}
      <div className="w-full max-w-md bg-bloom-bg min-h-screen flex flex-col relative shadow-xl">
        <AppHeader title={getTitle()} />

        <main className="flex-1 p-4 overflow-y-auto">
          {isSettingsOpen ? (
            <SettingsPage onBack={() => setIsSettingsOpen(false)} />
          ) : isLessonActive ? (
            // Подключаем настоящий компонент урока с кнопкой возврата
            <LessonPage onBack={() => setIsLessonActive(false)} />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomePage 
                  onStartLesson={() => setIsLessonActive(true)} 
                  onOpenSettings={() => setIsSettingsOpen(true)} 
                />
              )}
              {activeTab === 'learning' && (
                <LearningPage onSelectLesson={() => setIsLessonActive(true)} />
              )}
              {activeTab === 'review' && <ReviewPage />}
              {activeTab === 'progress' && <ProgressPage />}
            </>
          )}
        </main>

        {!isSettingsOpen && !isLessonActive && (
          <BottomNavigation activeTab={activeTab} onChangeTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}

export default App;