import React from 'react';
import { Home, BookOpen, RotateCcw, Award } from 'lucide-react';

export type TabType = 'home' | 'learning' | 'review' | 'progress';

interface BottomNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Главная', icon: Home },
    { id: 'learning' as TabType, label: 'Учеба', icon: BookOpen },
    { id: 'review' as TabType, label: 'Повторение', icon: RotateCcw },
    { id: 'progress' as TabType, label: 'Прогресс', icon: Award },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-bloom-border max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? 'text-bloom-dark font-semibold' : 'text-bloom-muted hover:text-bloom-primary'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[11px] mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};