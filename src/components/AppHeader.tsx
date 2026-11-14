import React from 'react';

interface AppHeaderProps {
  title: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  return (
    <header className="sticky top-0 z-20 bg-bloom-bg/90 backdrop-blur-md border-b border-bloom-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold bg-gradient-to-r from-bloom-dark to-bloom-primary bg-clip-text text-transparent">
          Dental Bloom
        </span>
      </div>
      <div className="text-sm font-medium text-bloom-muted">
        {title}
      </div>
    </header>
  );
};