import { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { BottomNavigation, type TabType } from './components/BottomNavigation';
import { HomePage } from './pages/HomePage';
import { LearningPage } from './pages/LearningPage';
import { ReviewPage } from './pages/ReviewPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLessonActive, setIsLessonActive] = useState(false);

  // Заголовок в зависимости от текущей вкладки или открытого экрана
  const getTitle = () => {
    if (isSettingsOpen) return 'Настройки';
    if (isLessonActive) return 'Урок';
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
            <div className="text-center py-12 space-y-4">
              <h2 className="text-xl font-bold text-bloom-text">Экран урока</h2>
              <p className="text-sm text-bloom-muted">Здесь скоро появится контент урока по LF 4.</p>
              <button 
                onClick={() => setIsLessonActive(false)}
                className="px-4 py-2 bg-bloom-dark text-white rounded-xl text-sm font-medium"
              >
                Завершить урок
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'home' && (
                <HomePage 
                  onStartLesson={() => setIsLessonActive(true)} 
                  onOpenSettings={() => setIsSettingsOpen(true)} 
                />
              )}
              {activeTab === 'learning' && <LearningPage />}
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